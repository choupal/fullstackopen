const lodash = require("lodash");

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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
