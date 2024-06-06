const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticate");

const prisma = new PrismaClient();

// 呟き投稿用API
router.post("/post", isAuthenticated, async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "内容が入力されていません" });
  }
  try {
    const newPost = await prisma.post.create({
      data: { title: content, content, autherId: req.userId },
      include: {
        auther: {
          include: {
            profile: true,
          },
        },
      },
    });
    res.status(201).json({ newPost });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "エラーが発生しました" });
  }
});

// 最新呟き取得API
router.get("/latest", async (req, res) => {
  try {
    const latestPost = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        auther: {
          include: {
            profile: true,
          },
        },
      },
    });
    res.json({ latestPost });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "エラーが発生しました" });
  }
});

// ログインAPI
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "ユーザーが見つかりません" });
  }
  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) {
    return res.status(400).json({ message: "パスワードが違います" });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return res.json({ token });
});

// 閲覧しているユーザーの投稿内容だけを取得するAPI
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const posts = await prisma.post.findMany({
      where: { autherId: parseInt(userId) },
      orderBy: { createdAt: "desc" },
      include: {
        auther: true,
      },
    });
    return res.status(200).json({ posts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "エラーが発生しました" });
  }
});

module.exports = router;
