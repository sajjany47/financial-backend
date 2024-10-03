import { createServer } from "http";
import mongoose from "mongoose";
import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import BranchRoutes from "./routes/branch.routes.js";
import EmployeeRoutes from "./routes/employee.routes.js";
import RegionalRoutes from "./routes/regional.routes.js";
import LoanRoutes from "./routes/loan.routes.js";
import DocumentRoutes from "./routes/dcoument.routes.js";
import path from "path";
import { fileURLToPath } from "url";

function main() {
  const port = process.env.port;
  const mongodb_url = process.env.mongodb_url;

  // Get __filename and __dirname for ES Modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const app = express();
  app.use(
    fileUpload({
      useTempFiles: true,
    })
  );
  const server = createServer(app);
  app.use(express.json());
  // Serve static files (like images) from the './src/uploads' directory
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  app.use(express.urlencoded({ limit: "30 mb", extended: true }));
  mongoose
    .connect(mongodb_url)
    .then(() => {
      server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((e) => console.log(e));

  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    })
  );

  app.use("/user", EmployeeRoutes);
  app.use("/branch", BranchRoutes);
  app.use("/regional", RegionalRoutes);
  app.use("/loan", LoanRoutes);
  app.use("/document", DocumentRoutes);
}
main();
