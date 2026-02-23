import { useEffect, useState } from 'react';
import api from '../api/client.js';
import StoriesCarousel from '../components/StoriesCarousel.jsx';
import PostCard from '../components/PostCard.jsx';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get('/stories').then((res) => setStories(res.data)).catch(() => setStories([]));
  }, []);

  useEffect(() => {
    api
      .get('/posts/feed', { params: { page, limit: 5, sort: 'recent' } })
      .then((res) => setPosts((prev) => [...prev, ...res.data]))
      .catch(() => {});
  }, [page]);

  const handleLike = async (postId) => {
    await api.post(`/posts/${postId}/like`);
    setPosts((prev) => prev.map((post) => (post._id === postId ? { ...post, likes: [...(post.likes || []), 'me'] } : post)));
  };

  return (
    <main>
      <StoriesCarousel stories={stories} />
      <div className="feed-grid">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} onLike={handleLike} />
        ))}
      </div>
      <button onClick={() => setPage((p) => p + 1)}>Load more</button>
    </main>
  );
}
