const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const zod = require("zod");
const { supabase } = require("../db/supabase");

const emailParser = zod.string().email();
const passwordParser = zod.string().min(6);
const fullNameParser = zod.string().min(2).max(50);
const ageParser = zod.number().int().positive();
const contactParser = zod.string().min(10).max(14);
const genderParser = zod.string().min(1);

const getSupabaseErrorMessage = (error, fallback) => {
  const message = error?.message || fallback;
  if (
    typeof message === "string" &&
    message.includes("Could not find the table 'public.users'")
  ) {
    return "Supabase database is not initialized. Run back-end/db/supabase-schema.sql in Supabase SQL Editor, then retry.";
  }
  return message;
};

const mapTrip = (trip) => ({
  _id: trip.id,
  Name: trip.name,
  Destination: trip.destination,
  Description: trip.description,
  StartDate: trip.start_date,
  EndDate: trip.end_date,
  estimatedBudget: trip.estimated_budget,
  TravellerCount: trip.traveller_count,
  localGuide: trip.local_guide,
  MeetUPLocation: trip.meetup_location,
  Gender: trip.gender,
  MinAge: trip.min_age,
  MaxAge: trip.max_age,
  Remark: trip.remark,
  createdBy: trip.created_by,
});

exports.registerUser = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    const isEmail = emailParser.safeParse(email);
    const isPassword = passwordParser.safeParse(password);
    const isFullName = fullNameParser.safeParse(fullName);

    if (!isEmail.success) {
      return res.status(400).json({ errors: [{ msg: "Invalid email" }] });
    }
    if (!isPassword.success) {
      return res.status(400).json({
        errors: [{ msg: "Password must be at least 6 characters long" }],
      });
    }
    if (!isFullName.success) {
      return res.status(400).json({
        errors: [{ msg: "Full name must be at least 2 characters long" }],
      });
    }

    const { data: userExists, error: existsError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existsError) {
      return res
        .status(500)
        .json({
          msg: getSupabaseErrorMessage(existsError, "User check failed"),
        });
    }

    if (userExists) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { error: insertError } = await supabase.from("users").insert({
      full_name: fullName,
      email,
      password_hash: hashedPassword,
      role: "traveler",
    });

    if (insertError) {
      return res
        .status(500)
        .json({
          msg: getSupabaseErrorMessage(insertError, "User creation failed"),
        });
    }

    return res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Unable to register user" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isEmail = emailParser.safeParse(email);
    const isPassword = passwordParser.safeParse(password);
    if (!isEmail.success || !isPassword.success) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid email or password type" }] });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, full_name, email, password_hash, role")
      .eq("email", email)
      .maybeSingle();

    if (userError) {
      return res
        .status(500)
        .json({ msg: getSupabaseErrorMessage(userError, "Login failed") });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password_hash,
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role || "traveler" },
      process.env.jwt_secret,
      {
        expiresIn: "1d",
      },
    );

    const { error: tokenUpdateError } = await supabase
      .from("users")
      .update({ access_token: token })
      .eq("id", user.id);

    if (tokenUpdateError) {
      return res.status(500).json({ msg: tokenUpdateError.message });
    }

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res.cookie("AccessToken", token, options);
    return res.status(200).json({
      message: "Token saved successfully",
      Name: user.full_name,
      user: {
        _id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role || "traveler",
      },
    });
  } catch (error) {
    return res.status(500).json({ msg: "Unable to login user" });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    await supabase
      .from("users")
      .update({ access_token: null })
      .eq("id", req.user.id);

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    res.clearCookie("AccessToken", options);
    res.clearCookie("RefreshToken", options);

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to logout" });
  }
};

exports.JoinTrips = async (req, res) => {
  try {
    const tripId = req.params.trip_id;
    const { Name, Contact, Age, Gender } = req.body;

    const isName = fullNameParser.safeParse(Name);
    const isAge = ageParser.safeParse(Age);
    const isContact = contactParser.safeParse(Contact);
    const isGender = genderParser.safeParse(Gender);

    if (!isName.success)
      return res.status(400).json({ message: "Invalid Name" });
    if (!isAge.success) return res.status(400).json({ message: "Invalid Age" });
    if (!isContact.success)
      return res.status(400).json({ message: "Invalid Contact" });
    if (!isGender.success)
      return res.status(400).json({ message: "Invalid Gender" });
    if (!tripId)
      return res.status(400).json({ message: "Trip ID is required" });

    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .select("id")
      .eq("id", tripId)
      .maybeSingle();

    if (tripError) {
      return res.status(500).json({ message: tripError.message });
    }
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const { error: insertError } = await supabase.from("trip_members").insert({
      trip_id: tripId,
      user_id: req.user.id,
      name: Name,
      contact: Contact,
      age: Age,
      gender: Gender,
      status: "pending",
    });

    if (insertError) {
      return res.status(500).json({ message: insertError.message });
    }

    return res
      .status(200)
      .json({ message: "Join request created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getTrips = async (req, res) => {
  const { trip_id } = req.params;

  if (!trip_id) {
    return res.status(400).json({ msg: "Invalid trip id" });
  }

  try {
    const { data: trip, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", trip_id)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ msg: error.message });
    }

    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    return res.status(200).json({ trip: mapTrip(trip) });
  } catch (error) {
    return res.status(500).json({ msg: "Server error" });
  }
};
