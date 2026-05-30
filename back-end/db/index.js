const { supabase } = require("./supabase");

const connectDB = async () => {
  const { error } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true });

  if (error) {
    throw new Error(`Supabase connection failed: ${error.message}`);
  }

  return { status: "ok" };
};

module.exports = connectDB;
