const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routers/user');
const postRouter = require('./routers/post');
const tagRouter = require('./routers/tag');
const categoryRouter = require('./routers/category');
const postTagRouter = require('./routers/postTag');
const commentRouter = require('./routers/comment');

const app = express();

// mongoose.connect('mongodb://localhost:27017/blogSphare')
mongoose.connect('mongodb+srv://rksharma7071:FvS3dI9aizQAQTPM@cluster0.jl0r7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => console.error("MongoDB Connection Error: ", error))

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  const apiRoutes = {
    "/users": "User related operations",
    "/posts": "Post related operations",
    "/tags": "Tag related operations",
    "/categories": "Category related operations",
    "/postTags": "Post-Tag relationship operations",
    "/comments": "Comment related operations"
  };

  res.json({
    msg: "Welcome to the API!",
    availableRoutes: apiRoutes
  });
});


// Router 
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/tags', tagRouter);
app.use('/categories', categoryRouter);
app.use('/postTags', postTagRouter);
app.use('/comments', commentRouter);

app.listen(8000, () => {
  console.log("Server running...")
})