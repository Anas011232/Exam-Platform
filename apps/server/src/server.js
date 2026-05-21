const dotenv = require("dotenv");
const path = require("path");

// ১. লোড env সবার আগে (সঠিক পাথ সহ)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ২. এরপর বাকি ফাইলগুলো রিকোয়ার করুন
const { connectDB } = require("./config/db"); // কার্লি ব্র্যাকেট যুক্ত করা হয়েছে
const app = require("./app");

const start = async () => {
  console.log("⏳ Connecting to MongoDB...");

  try {
    // ৩. ডাটাবেজ কানেক্ট করা
    await connectDB();

    // ৪. সার্ভার লিসেন করা
    app.listen(5000, () => {
      console.log("🔥 Server running on port 5000");
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

start();