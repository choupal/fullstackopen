const lodash = require("lodash");
const Blog = require("../models/blog");

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "https://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "https://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "https://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => {
    return acc + cur.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  let sortedBlogs = [...blogs].sort((a, b) => {
    return b.likes - a.likes;
  });

  return {
    title: sortedBlogs[0].title,
    author: sortedBlogs[0].author,
    likes: sortedBlogs[0].likes,
  };
};

const mostBlogs = (blogs) => {
  let sortedBlogs = lodash.groupBy(blogs, "author");

  return {
    author: Object.keys(sortedBlogs).pop(),
    blogs: sortedBlogs[Object.keys(sortedBlogs).pop()].length,
  };
};

const mostLikes = (blogs) => {
  const sortedBlogs = lodash.groupBy(blogs, "author");
  const authorLikes = lodash.mapValues(sortedBlogs, totalLikes);
  const mostLikedAuthor = Object.entries(authorLikes).sort(
    (a, b) => b[1] - a[1]
  )[0];
  return {
    author: mostLikedAuthor[0],
    likes: mostLikedAuthor[1],
  };
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  blogsInDb,
  initialBlogs,
};
