import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URL || "";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

declare global {
   var mongoose_obj : {conn: null | mongoose.Mongoose, promise: null | Promise<mongoose.Mongoose>}
}

let cached = global.mongoose_obj;

if (!cached) {
  cached = global.mongoose_obj = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("connected to mongodb")
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;