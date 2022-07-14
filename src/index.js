const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hey");
});

// ------------------------------------------------------
// ------------------- SIGNUP USER ---------------------
// ------------------------------------------------------

app.post(`/signup`, async (req, res) => {
  const { name, email } = req.body;
  console.log(name);

  const result = await prisma.user.create({
    data: {
      name,
      email,
    },
  });
  res.json(result);
});

// ------------------------------------------------------
// ------------------- SIGNUP USER ---------------------
// ------------------------------------------------------

app.post("/login", async (req, res) => {
  const { email, name } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    res.status(200).json("Logged in successfully");
  } catch (error) {
    console.log({
      error: `User not found with email ${email}. Please Create your account`,
    });
  }
});

// ------------------------------------------------------
// ------------------- CREATE POST ---------------------
// ------------------------------------------------------

app.post(`/post`, async (req, res) => {
  const { title, content, authorEmail } = req.body;
  const result = await prisma.post.create({
    data: {
      title,
      content,
      author: { connect: { email: authorEmail } },
    },
  });
  res.json(result);
});

// ------------------------------------------------------
// ------------------- UPDATE POST ---------------------
// ------------------------------------------------------

app.put("/post/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  console.log(id);

  try {
    const result = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        content: content,
      },
    });
    res.json(result);
  } catch (error) {
    res.json({ error: `Post with ${id} does not exist on the database` });
  }
});
// ------------------------------------------------------
// ------------------- GET ALL POST ----------------------
// ------------------------------------------------------

app.get("/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (error) {
    console.log(error);
  }
});

// ------------------------------------------------------
// ------------------- DELETE POST ----------------------
// ------------------------------------------------------

app.delete("/post/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.delete({
      where: { id: Number(id) },
    });
    res.json(post);
  } catch (error) {
    console.log({
      error: `The Post with id ${id} does not exists on database`,
    });
  }
});

app.listen(8000, (req, res) => {
  console.log("server started on 8000");
});
