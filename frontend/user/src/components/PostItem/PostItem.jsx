import React from 'react';

const PostItem = ({ post, onDelete = () => {}, onTogglePin = () => {} }) => {
  return (
    <div className={`post-card ${post?.isPinned ? 'pinned' : ''}`}>
      <h3>{post?.title}</h3>
      <p>{post?.content}</p>
      {post?.imageUrl && <img src={post.imageUrl} alt="post" />}
      <button onClick={() => onTogglePin(post._id)}>
        {post?.isPinned ? 'Bỏ ghim' : 'Ghim'}
      </button>
      <button onClick={() => onDelete(post._id)}>Xóa</button>
    </div>
  );
};

export default PostItem;