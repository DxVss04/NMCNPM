import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostItem from '../PostItem/PostItem.jsx';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/posts/posts');
      setPosts(response.data.posts || []);
    } catch (err) {
      setError(err.message || 'Error fetching posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/posts/posts/delete/${id}`);
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      await axios.patch(`/api/posts/posts/toggle-pin/${id}`);
      setPosts(prev => prev.map(p => p._id === id ? { ...p, isPinned: !p.isPinned } : p));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="post-list">
      {posts.length === 0 && <div>Không có bài viết.</div>}
      {posts.map(post => (
        <PostItem key={post._id} post={post} onDelete={handleDelete} onTogglePin={handleTogglePin} />
      ))}
    </div>
  );
};

export default PostList;