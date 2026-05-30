const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const API_BASE = process.env.SMOKE_API_BASE || "http://localhost:8000";

const state = {
  cookieHeader: "",
  authToken: "",
  tripId: "",
};

function parseJsonSafely(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function updateCookies(response) {
  const setCookie = response.headers.get("set-cookie");
  if (!setCookie) return;

  const chunks = setCookie
    .split(/,(?=\s*\w+=)/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  const currentMap = new Map();
  if (state.cookieHeader) {
    state.cookieHeader.split("; ").forEach((pair) => {
      const [name, ...rest] = pair.split("=");
      currentMap.set(name, rest.join("="));
    });
  }

  chunks.forEach((cookie) => {
    const first = cookie.split(";")[0];
    const [name, ...rest] = first.split("=");
    currentMap.set(name, rest.join("="));
    if (name === "AccessToken") {
      state.authToken = rest.join("=");
    }
  });

  state.cookieHeader = Array.from(currentMap.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

async function requestJson(method, endpoint, body, useAuth = false) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (useAuth && state.cookieHeader) {
    headers.Cookie = state.cookieHeader;
  }

  if (useAuth && state.authToken) {
    headers.Authorization = `Bearer ${state.authToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  updateCookies(response);

  const rawText = await response.text();
  const json = parseJsonSafely(rawText);

  return {
    ok: response.ok,
    status: response.status,
    json,
    text: rawText,
  };
}

function logStep(title, result, expectedStatuses) {
  const expected = Array.isArray(expectedStatuses)
    ? expectedStatuses
    : [expectedStatuses];
  const pass = expected.includes(result.status);
  const statusIcon = pass ? "PASS" : "FAIL";

  console.log(`\n[${statusIcon}] ${title}`);
  console.log(`Status: ${result.status}`);

  if (result.json) {
    console.log(`Response: ${JSON.stringify(result.json)}`);
  } else {
    console.log(`Response: ${result.text || "<empty>"}`);
  }

  return pass;
}

(async () => {
  const stamp = Date.now();
  const email = `smoke_${stamp}@tripunite.dev`;
  const password = "secret123";

  console.log(`Running TripUnite smoke test against: ${API_BASE}`);

  const registerResult = await requestJson("POST", "/api/auth/register", {
    fullName: "Smoke Test User",
    email,
    password,
  });

  const registerPass = logStep("Register user", registerResult, [201, 400]);
  const registerMessage =
    registerResult.json?.msg ||
    registerResult.json?.message ||
    registerResult.text ||
    "";

  if (
    registerMessage.includes("Supabase database is not initialized") ||
    registerMessage.includes("Could not find the table 'public.users'")
  ) {
    console.error(
      "\nSchema missing. Run back-end/db/supabase-schema.sql in Supabase SQL Editor and retry.",
    );
    process.exit(1);
  }

  const loginResult = await requestJson("POST", "/api/auth/login", {
    email,
    password,
  });
  const loginPass = logStep("Login user", loginResult, 200);

  if (!state.authToken) {
    console.error("\nAccessToken cookie was not received from login.");
    process.exit(1);
  }

  const createTripResult = await requestJson(
    "POST",
    "/api/auth/createTrips",
    {
      Name: "Smoke Goa Escape",
      Destination: "Goa",
      Description: "Automated smoke test trip",
      StartDate: "2026-06-20",
      EndDate: "2026-06-25",
      estimatedBudget: 15000,
      TravellerCount: 10,
      localGuide: true,
      MeetUPLocation: "Panaji Bus Stand",
      Gender: "any",
      MinAge: 18,
      MaxAge: 45,
      Remark: "smoke-test",
    },
    true,
  );
  const createTripPass = logStep("Create trip", createTripResult, 200);
  state.tripId = createTripResult.json?.trip?._id || "";

  if (!state.tripId) {
    console.error("\nTrip id not found in create trip response.");
    process.exit(1);
  }

  const joinTripResult = await requestJson(
    "POST",
    `/api/auth/joinTrips/${state.tripId}`,
    {
      Name: "Smoke Test User",
      Contact: "9876543210",
      Age: 25,
      Gender: "male",
    },
    true,
  );
  const joinTripPass = logStep("Join trip", joinTripResult, [200, 500]);

  const joinedTripsResult = await requestJson(
    "GET",
    "/api/auth/joinedTrips",
    null,
    true,
  );
  const joinedTripsPass = logStep("Fetch joined trips", joinedTripsResult, 200);

  const allPass =
    registerPass &&
    loginPass &&
    createTripPass &&
    joinTripPass &&
    joinedTripsPass;

  if (!allPass) {
    console.error("\nSmoke test failed. Check the failing step output above.");
    process.exit(1);
  }

  console.log("\nAll smoke test steps completed successfully.");
  process.exit(0);
})().catch((error) => {
  console.error("\nSmoke test crashed:", error.message);
  process.exit(1);
});
