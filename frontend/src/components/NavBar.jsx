import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function NavBar() {
  const { darkMode, toggleTheme } = useAuth();

  return (
    <nav className="nav">
      <h2>InstaMERN</h2>
      <div className="nav-links">
        <Link to="/">Feed</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/messages">Messages</Link>
        <Link to="/notifications">Notifications</Link>
        <button onClick={toggleTheme}>{darkMode ? 'Light' : 'Dark'} mode</button>
      </div>
    </nav>
  );
}
