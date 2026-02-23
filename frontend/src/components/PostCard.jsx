export default function PostCard({ post, onLike }) {
  return (
    <article className="post-card">
      <header>
        <strong>{post.author?.username}</strong>
        <span>{post.location}</span>
      </header>
      {post.media?.[0]?.mediaType === 'video' ? (
        <video controls src={post.media[0].url} />
      ) : (
        <img src={post.media?.[0]?.url || 'https://placehold.co/600x600'} alt={post.caption} />
      )}
      <div className="post-actions">
        <button onClick={() => onLike(post._id)}>Like ({post.likes?.length || 0})</button>
      </div>
      <p>{post.caption}</p>
      <small>{post.comments?.length || 0} comments</small>
    </article>
  );
}
