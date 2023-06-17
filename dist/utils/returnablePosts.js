"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnablePost = void 0;
const returnablePost = (posts, userid) => {
    const modifiedPosts = posts.map((post) => {
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
exports.returnablePost = returnablePost;
