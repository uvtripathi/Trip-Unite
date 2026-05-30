const jwt = require("jsonwebtoken");
const { supabase } = require("../db/supabase");
exports.verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.AccessToken ||
      req.header("authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }
    const decodedToken = jwt.verify(token, process.env.jwt_secret);

    if (!decodedToken) {
      return res.status(401).json({ message: "token is invalid" });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, full_name, email, role")
      .eq("id", decodedToken.id)
      .maybeSingle();

    if (userError) {
      return res.status(401).json({ message: "user is not found" });
    }

    if (!user) {
      return res.status(401).json({ message: "user is not found" });
    }
    req.user = {
      id: user.id,
      _id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role || "traveler",
    };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
