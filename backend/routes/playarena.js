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

// POST http://localhost:5000/api/v1/playarena/signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password, nick } = req.body
    const db = req.app.locals.db; // get db instance from app.locals
    const userExists = await db.collection('users').find({username: username}).toArray();
    console.log("imprimo userExists: ", userExists)
    console.log("length: ", userExists.length)
    if (userExists.length > 0) 
        res.json({result: "YA EXISTE"});
    else {

        const resultado = await db.collection('users').insertOne({
            username,
            password,
            nick
        })
        console.log("Resultado insertOne: ", resultado)
        res.json(resultado);
    }

  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST http://localhost:5000/api/v1/playarena/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const db = req.app.locals.db; // get db instance from app.locals
    const findUser = await db.collection('users').findOne({
        username: username,
        password: password
    });
    console.log("imprimo findUser: ", findUser)
    if (findUser) {
        res.json(findUser);
    }
    else {
        res.json({result: "usuario o contraseña no válidos"})
    }

  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


export default router;