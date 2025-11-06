import mongoose, { Mongoose } from "mongoose";

// ✅ Dùng URL cố định — không cần .env
const FIXED_MONGODB_URI =
  "mongodb+srv://manhng132:%23q%2Ae%259Fb%267PfR%24%3F@cluster0.k4f3r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// -------------------------------
// 1️⃣ Khai báo type cho globalThis
// -------------------------------
declare global {
  // eslint-disable-next-line no-var
  var mongooseGlobal:
    | {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;
}

// -------------------------------
// 2️⃣ Tạo cache toàn cục (tránh reconnect)
// -------------------------------
const cached = global.mongooseGlobal ?? {
  conn: null,
  promise: null,
};
global.mongooseGlobal = cached;

// -------------------------------
// 3️⃣ Hàm kết nối chính
// -------------------------------
export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(FIXED_MONGODB_URI, {
        dbName: "prod",
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log("✅ Connected to MongoDB");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// -------------------------------
// 4️⃣ Optional: tự động kết nối khi import
// -------------------------------
connectToDatabase().catch(() => {
  console.warn("⚠️ Skipped MongoDB connection during build.");
});