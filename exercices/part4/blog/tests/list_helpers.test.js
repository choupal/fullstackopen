const mongoose = require("mongoose");
const listHelper = require("./list_helper");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");

const initialBlogs = listHelper.initialBlogs;

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test("dummy returns one", () => {
  const result = listHelper.dummy(initialBlogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  test("total of all blogs likes", () => {
    const result = listHelper.totalLikes(initialBlogs);
    expect(result).toBe(36);
  });
});

describe("Favorite blog", () => {
  test("Favorite blogs with most likes", () => {
    const result = listHelper.favoriteBlog(initialBlogs);
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});

describe("Most blogs", () => {
  test("Person with most blogs", () => {
    const result = listHelper.mostBlogs(initialBlogs);
    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});

describe("Most Likes", () => {
  test("Person with most likes", () => {
    const result = listHelper.mostLikes(initialBlogs);
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});

describe("API GET REQUESTS", () => {
  test("correct number of blogs are returned as json", async () => {
    const blogsInDb = await listHelper.blogsInDb();

    expect(blogsInDb).toHaveLength(initialBlogs.length);

    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("verify id of blog posts", async () => {
    const blogsInDb = await listHelper.blogsInDb();
    blogsInDb.map((blog) => {
      expect(blog.id).toBeDefined();
    });
  });
});

describe("API POST REQUESTS", () => {
  test("New blog is created with content", async () => {
    const newBlog = {
      title: "Hello There",
      author: "General Kenobi",
      url: "www.kenoblog.com",
      likes: 12,
    };

    await api
      .post("/api/blogs")
      .set(
        "Authorization",
        "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJlbksiLCJpZCI6IjYzODBjMTQxNTMyMWExMmE1MWNmYTc3MiIsImlhdCI6MTY2OTM5NDA0NiwiZXhwIjoxNjY5Mzk3NjQ2fQ.6cAmEPZLgPzUhZDlt6vHew7C5MmwJ3aziXlnRjEMGfU"
      )
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsInDb = await listHelper.blogsInDb();
    expect(blogsInDb.length).toBe(initialBlogs.length + 1);
    console.log(newBlog);
  });

  test("Error if no or invalid token", async () => {
    const newBlog = {
      title: "Hello There",
      author: "General Kenobi",
      url: "www.kenoblog.com",
      likes: 12,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);

    const blogsInDb = await listHelper.blogsInDb();
    expect(blogsInDb.length).toBe(initialBlogs.length);
  });

  test("if no likes property => default to 0 likes", async () => {
    const newBlog = {
      title: "Hello There",
      author: "General Kenobi",
      url: "www.kenoblog.com",
    };

    await api
      .post("/api/blogs")
      .set(
        "Authorization",
        "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJlbksiLCJpZCI6IjYzODBjMTQxNTMyMWExMmE1MWNmYTc3MiIsImlhdCI6MTY2OTM5NDA0NiwiZXhwIjoxNjY5Mzk3NjQ2fQ.6cAmEPZLgPzUhZDlt6vHew7C5MmwJ3aziXlnRjEMGfU"
      )
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsInDb = await listHelper.blogsInDb();
    blogsInDb.map((blog) => {
      expect(blog.likes).not.toBeUndefined();
      expect(blog.likes).toBeGreaterThanOrEqual(0);
    });
  });

  test("if no title => 400 ", async () => {
    const newBlog = {
      author: "Robert C. Martin",
      url: "https://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    };

    await api
      .post("/api/blogs")
      .set(
        "Authorization",
        "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJlbksiLCJpZCI6IjYzODBjMTQxNTMyMWExMmE1MWNmYTc3MiIsImlhdCI6MTY2OTM5NDA0NiwiZXhwIjoxNjY5Mzk3NjQ2fQ.6cAmEPZLgPzUhZDlt6vHew7C5MmwJ3aziXlnRjEMGfU"
      )
      .send(newBlog)
      .expect(400);
  });

  test("if no url => 400 ", async () => {
    const newBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      likes: 2,
    };

    await api
      .post("/api/blogs")
      .set(
        "Authorization",
        "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkJlbksiLCJpZCI6IjYzODBjMTQxNTMyMWExMmE1MWNmYTc3MiIsImlhdCI6MTY2OTM5NDA0NiwiZXhwIjoxNjY5Mzk3NjQ2fQ.6cAmEPZLgPzUhZDlt6vHew7C5MmwJ3aziXlnRjEMGfU"
      )
      .send(newBlog)
      .expect(400);
  });
});

describe("API DELETE REQUESTS", () => {
  test("A blog has been deleted", async () => {
    const id = "5a422a851b54a676234d17f7";
    await api.delete(`/api/blogs/${id}`).expect(204);
    const blogsInDb = await listHelper.blogsInDb();
    expect(blogsInDb.length).toBe(initialBlogs.length - 1);
  });
});

describe("API PUT REQUESTS", () => {
  test("A blog has been modified", async () => {
    const id = "5a422bc61b54a676234d17fc";
    const modifiedBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "https://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 22,
    };
    await api.put(`/api/blogs/${id}`).send(modifiedBlog).expect(200);
    const blogsInDb = await listHelper.blogsInDb();
    const modifiedBlogInDb = blogsInDb.find((blog) => blog.id === id);
    expect(modifiedBlogInDb.likes).not.toBe(initialBlogs.likes);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
