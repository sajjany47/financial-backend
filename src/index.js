import { createServer } from "http";
import mongoose from "mongoose";
import express from "express";

function main() {
  const port = process.env.port;
  const mongodb_url = process.env.mongodb_url;
  const cookieSecretKey = process.env.COOKIE_SECRET;
  const app = express();
  const server = createServer(app);

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
