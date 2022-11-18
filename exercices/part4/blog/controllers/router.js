const router = require("express").Router();
const Blog = require("../models/blog");

// Get all blogs
router.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

// Post a new blog
router.post("/", async (request, response) => {
  if (request.body.title === undefined || request.body.url === undefined) {
    response.status(400).end();
  }

  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    likes: request.body.likes === undefined ? 0 : request.body.likes,
    url: request.body.url,
  });

  const savedBLog = await blog.save();
  response.status(201).json(savedBLog);
});

// Delete a blog with id
router.delete("/:id", async (request, response) => {
  await Blog.findOneAndRemove(request.params.id);
  response.status(204).end();
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
