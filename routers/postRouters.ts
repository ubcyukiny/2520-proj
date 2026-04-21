// @ts-nocheck
import express from 'express';
import * as database from '../controller/postController';
const router = express.Router();
import { ensureAuthenticated } from '../middleware/checkAuth';

router.get('/', async (req, res) => {
  const posts = await database.getPosts(20);
  const user = await req.user;
  res.render('posts', { posts, user });
});

router.get('/create', ensureAuthenticated, (req, res) => {
  res.render('createPosts');
});

router.post('/create', ensureAuthenticated, async (req, res) => {
  const { title, link, description, sub } = req.body;

  // basic validation
  if (!title || (!link && !description) || !sub) {
    return res.redirect('/posts/create');
  }

  const user = req.user;

  const newPost = await database.createPost({
    title,
    link,
    description,
    creator: user.id,
    subgroup: sub,
  });

  res.redirect(`/posts/show/${newPost.id}`);
});

router.get('/show/:postid', async (req, res) => {
  const postid = req.params.postid;

  const post = await database.getPostById(postid);

  if (!post) {
    return res.redirect('/posts');
  }

  const comments = post.comments || [];

  res.render('individualPost', {
    post,
    comments,
    user: req.user,
  });
});

router.get('/edit/:postid', ensureAuthenticated, async (req, res) => {
  const post = await database.getPostById(req.params.postid);

  if (!post || post.creator.id !== req.user.id) {
    return res.redirect('/posts');
  }

  res.render('editPost', { post });
});

router.post('/edit/:postid', ensureAuthenticated, async (req, res) => {
  const postid = req.params.postid;
  const post = await database.getPostById(postid);

  if (!post || post.creator !== req.user.id) {
    return res.redirect('/posts');
  }

  const { title, link, description, sub } = req.body;

  await database.updatePost(postid, {
    title,
    link,
    description,
    subgroup: sub,
  });

  res.redirect(`/posts/show/${postid}`);
});
router.get('/deleteconfirm/:postid', ensureAuthenticated, async (req, res) => {
  const post = await database.getPostById(req.params.postid);

  if (!post || post.creator !== req.user.uname) {
    return res.redirect('/posts');
  }

  res.render('deleteConfirm', { post });
});

router.post('/delete/:postid', ensureAuthenticated, async (req, res) => {
  const post = await database.getPostById(req.params.postid);

  if (!post || post.creator !== req.user.uname) {
    return res.redirect('/posts');
  }

  await database.deletePost(req.params.postid);

  res.redirect(`/subs/show/${post.subgroup}`);
});

router.post(
  '/comment-create/:postid',
  ensureAuthenticated,
  async (req, res) => {
    const postid = req.params.postid;
    const { description } = req.body;

    if (!description) {
      return res.redirect(`/posts/show/${postid}`);
    }

    await database.createComment({
      description,
      creator: req.user.id,
      postid,
    });

    res.redirect(`/posts/show/${postid}`);
  },
);

export default router;
