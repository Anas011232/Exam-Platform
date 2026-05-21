const { MongoClient, ServerApiVersion } = require("mongodb");

let db;

const connectDB = async () => {
  if (db) return db;

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("❌ MONGODB_URI missing in environment variables");
  }

  // অপশনগুলো একদম মঙ্গোডিবির ড্রাইভার স্ট্যান্ডার্ড অনুযায়ী ফিক্স করা হলো
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    // সঠিক মঙ্গোডিবি ড্রাইভার অপশন হচ্ছে lookup (ছোট হাতের l দিয়ে এবং কোনো কাস্টম লজিক ছাড়া)
    lookup: require('dns').lookup 
  });

  try {
    await client.connect();
    
    // কানেকশন টেস্ট করার জন্য পিং পাঠানো
    await client.db("admin").command({ ping: 1 });
    
    db = client.db("exam-platform");
    console.log("🔥 MongoDB Connected Successfully!");
    return db;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    throw error;
  }
};

module.exports = { connectDB };