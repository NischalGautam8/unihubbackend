import {
  postinterface,
  originalpostinterface,
} from "../interface/postinterface";
export const returnablePost = (
  posts: Array<originalpostinterface>,
  userid: string
) => {
  const modifiedPosts: postinterface = posts.map((post) => {
    const modifiedPost = post.toObject();
    modifiedPost.commentsCount = post.comments.length;
    modifiedPost.likesCount = post.likes.length;
    modifiedPost.hasLiked = post.likes.includes(userid);
    delete modifiedPost.comments;
    delete modifiedPost.likes;
    return modifiedPost;
  });
  return modifiedPosts;
};
