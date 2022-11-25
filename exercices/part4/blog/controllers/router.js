const router = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const { userExtractor } = require("../utils/middleware");

// const getTokenFrom = (request) => {
//   const authorization = request.get("authorization");
//   if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
//     return authorization.substring(7);
//   }
//   return null;
// };

// Get all blogs
router.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

// Post a new blog
router.post("/", userExtractor, async (request, response) => {
  const body = request.body;

  if (body.title === undefined || body.url === undefined) {
    response.status(400).end();
  }

  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    likes: body.likes === undefined ? 0 : body.likes,
    url: body.url,
    user: user._id,
  });

  const savedBLog = await blog.save();
  user.blogs = user.blogs.concat(savedBLog._id);
  await user.save();
  response.status(201).json(savedBLog);
});

// Delete a blog with id
router.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;

  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findOneAndRemove(request.params.id);
    response.status(204).end();
  } else {
    response
      .status(401)
      .json({ error: "you are not allowed to delete this blog" });
  }
});

// Update a blog with id
router.put("/:id", async (request, response) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    likes: request.body.likes === undefined ? 0 : request.body.likes,
    url: request.body.url,
  };

  const modifiedBLog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: "query",
  });
  response.json(modifiedBLog);
});

module.exports = router;
