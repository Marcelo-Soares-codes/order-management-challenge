import "dotenv/config";
import mongoose from "mongoose";
import { app } from "./app";

const PORT = process.env.PORT || 3333;

async function bootstrap() {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("MongoDB connected");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap().catch(console.error);
