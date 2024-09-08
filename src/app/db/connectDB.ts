import mongoose, { Mongoose } from "mongoose";

let cachedDb: Mongoose | null = null;

const connectDB = async (): Promise<Mongoose> => {
  if (!process.env.MONGO_URI || !process.env.DB_NAME) {
    throw new Error("Please define the environment variables in .env.local");
  }

  if (cachedDb) {
    console.log("Using existing database connection");
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
      autoCreate: true,
    });

    console.log("Database Connected");
    cachedDb = db;
    return db;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConnection: Promise<Mongoose> | null;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongooseConnection) {
    global._mongooseConnection = connectDB();
  }

  global._mongooseConnection
    .then((db) => {
      cachedDb = db;
    })
    .catch((err) => {
      console.error("Error resolving global mongoose connection:", err);
    });
}

export default connectDB;
