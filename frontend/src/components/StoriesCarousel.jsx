export default function StoriesCarousel({ stories }) {
  return (
    <section className="stories">
      {stories.map((story) => (
        <article key={story._id} className="story-item">
          <img src={story.user?.profilePicture?.url || 'https://placehold.co/64'} alt={story.user?.username} />
          <span>{story.user?.username}</span>
        </article>
      ))}
    </section>
  );
}
