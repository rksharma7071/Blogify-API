const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const userRouter = require("./routers/user");
const authRouter = require("./routers/auth");
const postRouter = require("./routers/post");
const tagRouter = require("./routers/tag");
const searchRouter = require("./routers/search");
const categoryRouter = require("./routers/category");
const postTagRouter = require("./routers/postTag");
const commentRouter = require("./routers/comment");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const mongoDB_URL = process.env.MONGO_URI;
mongoose
  .connect(mongoDB_URL)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => console.error("MongoDB Connection Error: ", error));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/", (req, res) => {
  const apiRoutes = {
    "/users": "User related operations",
    "/auth": "Login related operations",
    "/posts": "Post related operations",
    "/tags": "Tag related operations",
    "/categories": "Category related operations",
    "/postTags": "Post-Tag relationship operations",
    "/comments": "Comment related operations",
  };

  res.json({
    msg: "Welcome to the API!",
    availableRoutes: apiRoutes,
  });
});

// Router
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/tags", tagRouter);
app.use("/categories", categoryRouter);
app.use("/postTags", postTagRouter);
app.use("/comments", commentRouter);
app.use("/search", searchRouter);

app.use((req, res, next) => {
  res.status(404).json({ msg: "Route not found" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server running ${PORT} ...`);
});
