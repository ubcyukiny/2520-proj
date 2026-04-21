import * as db from '../fake-db';

async function getPosts(n = 20, sub?: string) {
  return db.getPosts(n, sub as any);
}

function getPostById(postid: string) {
  return db.getPost(Number(postid));
}

function createPost({
  title,
  link,
  description,
  creator,
  subgroup,
}: {
  title: string;
  link?: string;
  description?: string;
  creator: number;
  subgroup: string;
}) {
  return db.addPost(title, link, creator, description, subgroup);
}

function deletePost(postid: string) {
  return db.deletePost(Number(postid));
}

function updatePost(postid: string, updatedData: any) {
  return db.editPost(Number(postid), updatedData);
}

function getCommentsByPostId(postid: string) {
  const post = db.getPost(Number(postid));
  return post?.comments || [];
}

function createComment({
  description,
  creator,
  postid,
}: {
  description: string;
  creator: number;
  postid: string;
}) {
  return db.addComment(Number(postid), creator, description);
}

function getSubs() {
  return db.getSubs();
}

export {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  updatePost,
  getCommentsByPostId,
  createComment,
  getSubs,
};
