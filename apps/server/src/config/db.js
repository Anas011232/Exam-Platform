import { MongoClient } from "mongodb";

let client;

export const connectDB =
  async () => {
    try {
      const uri =
        process.env.MONGO_URI;

      console.log(
        "Mongo URI:",
        uri
      );

      client = new MongoClient(
        uri
      );

      await client.connect();

      console.log(
        "MongoDB Connected"
      );
    } catch (error) {
      console.log(error);

      process.exit(1);
    }
  };

export const getClient = () =>
  client;