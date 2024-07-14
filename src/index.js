import { createServer } from "http";
import mongoose from "mongoose";
import express from "express";
import fileUpload from "express-fileupload";
import routes from "./routes/routes";

function main() {
  const port = process.env.port;
  const mongodb_url = process.env.mongodb_url;
  const app = express();
  const server = createServer(app);
  app.use(fileUpload);
  app.use(express.json());
  app.use(express.urlencoded({ limit: "30 mb", extended: true }));
  app.use(routes);
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
