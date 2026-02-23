# MERN Instagram Clone (Full-stack Starter)

This repository provides a production-oriented **Instagram clone starter** built with:

- **MongoDB + Mongoose**
- **Express.js + Node.js**
- **React (Vite)**
- **Socket.io** for real-time notifications and messaging
- **Cloudinary** for media storage

> Note: this implementation includes the core architecture, API surface, and UI scaffolding for the requested feature set. You can extend UI polish, moderation, and testing for enterprise-grade production.

## Implemented Features

### Authentication
- Signup / login / logout
- Access + refresh JWT tokens
- Password hashing with bcrypt

### Users & Profiles
- Profile fetch/update
- Bio + profile picture upload
- Follow/unfollow
- Save/unsave post bookmarks
- Search users by username

### Posts
- Create, edit, delete posts
- Media upload (images/videos)
- Caption + hashtag parsing + location
- Like/unlike + comments
- Feed endpoint with pagination
- Hashtag search

### Stories
- Upload stories with 24-hour expiry using MongoDB TTL index
- Story listing endpoint

### Notifications
- Notification records for follows/likes/comments
- Notification read endpoint

### Direct Messaging
- One-on-one conversation fetch
- Send text/media messages
- Socket.io room pattern for real-time events

### UI/UX
- Responsive shell with navbar, stories carousel, feed cards
- Auth page + protected routes
- Explore/messages/notifications pages scaffold
- Dark mode state hook (extend as needed)

## Project Structure

```
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    sockets/
    utils/
    app.js
    server.js
frontend/
  src/
    api/
    components/
    context/
    pages/
    styles/
```

## Local Setup

## 1) Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/instagram_clone
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me-too
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Optional `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Deployment Guidance

- **Backend**: Render/Railway/Fly.io with Node 20+, set env variables above.
- **Frontend**: Vercel/Netlify static hosting with `VITE_API_BASE_URL`.
- **Database**: MongoDB Atlas.
- **Media**: Cloudinary (or swap with S3 in `media.service.js`).
- **Sockets**: Use sticky sessions/adapter (e.g. Redis adapter) for multi-instance scale.

## Next Recommended Enhancements

1. Add robust refresh token rotation + HTTP-only cookie strategy.
2. Add API validation layer with `express-validator` schemas.
3. Add e2e tests (Playwright) + API integration tests (Jest/Supertest).
4. Implement full DM and notifications frontend with Socket.io client streams.
5. Add caching, rate limiting, and moderation/reporting flows.
