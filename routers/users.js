const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticate");

const prisma = new PrismaClient();

// ユーザー情報取得API
router.get("/find", isAuthenticated, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { profile: true },
    });

    if (!user) {
      return res.status(404).json({ message: "ユーザーが見つかりません" });
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profile: user.profile,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "エラーが発生しました" });
  }
});

router.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    include: { profile: true, posts: { orderBy: { createdAt: "desc" } } },
  });

  if (!user) {
    return res.status(404).json({ message: "ユーザーが見つかりません" });
  }

  res.status(200).json({ user });
});

module.exports = router;
