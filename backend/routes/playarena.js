import { Router } from 'express';

const router = Router();

// GET /api/v1/playarena
router.get('/', async (req, res) => {
  // try {
  //   const db = req.app.locals.db; // get db instance from app.locals
  //   const chats = await db.collection('chats').find().toArray();
  //   res.json(chats);
  // } catch (error) {
  //   console.error("Error fetching chats:", error);
  //   res.status(500).json({ error: 'Failed to fetch chats' });
  // }
  res.json({test: "ok"})
});

export default router;