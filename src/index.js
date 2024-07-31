import { createServer } from "http";
import mongoose from "mongoose";
import express from "express";
import fileUpload from "express-fileupload";
import UserRoutes from "./routes/user.routes.js";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
// import user from "./api/user/user.model.js";

function main() {
  const port = process.env.port;
  const mongodb_url = process.env.mongodb_url;
  const app = express();
  app.use(fileUpload());
  const server = createServer(app);
  app.use(express.json());
  app.use(express.urlencoded({ limit: "30 mb", extended: true }));
  mongoose
    .connect(mongodb_url)
    .then(() => {
      server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((e) => console.log(e));
  // app.use(
  //   session({
  //     secret: process.env.SECRET_KEY,
  //     resave: false,
  //     saveUninitialized: false,
  //     store: MongoStore.create({ mongoUrl: mongodb_url }),
  //   })
  // );

  // // Middleware to check for multiple sessions
  // app.use(async (req, res, next) => {
  //   if (req.session.userId) {
  //     const userId = await user.findOne({ _id: req.session.userId });

  //     if (userId && userId.sessionId && userId.sessionId !== req.session.id) {
  //       req.session.destroy(() => {
  //         res.status(401).json({
  //           message: "Logged out due to new login from another device.",
  //         });
  //       });
  //       return;
  //     }
  //   }
  //   next();
  // });

  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    })
  );
  // app.use(routes);
  app.use("/user", UserRoutes);
}
main();
