import { createServer } from "http";
import mongoose from "mongoose";
import express from "express";
import fileUpload from "express-fileupload";
import UserRoutes from "./routes/user.routes";

function main() {
  const port = process.env.port;
  const mongodb_url = process.env.mongodb_url;
  const app = express();
  const server = createServer(app);
  app.use(fileUpload);
  app.use(express.json());
  app.use(express.urlencoded({ limit: "30 mb", extended: true }));
  // app.use(routes);
  app.use("/user", UserRoutes);
  mongoose
    .connect(mongodb_url)
    .then(() => {
      server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((e) => console.log(e));
}
main();
