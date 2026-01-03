import "dotenv/config";
import mongoose from "mongoose";
import { app } from "./app";
import { connectDatabase } from "./shared/database";

const PORT = process.env.PORT || 3333;

async function bootstrap() {
  await connectDatabase(process.env.MONGO_URI!);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap().catch(console.error);
