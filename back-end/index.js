const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.join(__dirname, ".env"),
});

const connectDB = require("./db/index.js");
// const bodyParser = require('bodyParser');

const { app } = require("./app.js");
require("./utils/customConsole.js");

const port = process.env.PORT || 8000;

app.listen(port, async () => {
  console.log(`Server is running at port : ${port}`);

  try {
    await connectDB();
    console.log("Supabase connection check passed");
  } catch (err) {
    console.error(`Supabase connection check failed: ${err.message}`);
    console.warn(
      "Server is running in limited mode (health/chat routes still available)",
    );
  }
});
