// @ts-nocheck
import express from 'express';
import * as database from '../controller/postController';

const router = express.Router();

router.get('/list', async (req, res) => {
  const subs = await database.getSubs(); // ✅ simpler

  res.render('subs', { subs });
});

router.get('/show/:subname', async (req, res) => {
  const subname = req.params.subname;

  const posts = await database.getPosts(1000, subname); // ✅ no manual filter

  res.render('sub', {
    posts,
    subname,
    user: req.user,
  });
});

export default router;
