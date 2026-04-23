# 📅 Event Book - https://dimitar-event-book.netlify.app/

> **Plan memorable gatherings.** A modern full-stack platform for discovering, joining, and chatting about events — built with React, Supabase, and Tailwind CSS.

---

## ✨ Features

### 🗓️ Events
- Browse events by category (Hiking, Music, Tech, Food, Art, and more)
- View upcoming events with date, location, and description
- Reserve a spot with a single click

### 💬 Real-time Chat
- Event-specific conversation rooms — reserved attendees only
- Live messages powered by Supabase Realtime
- User avatars, message timestamps with relative time (Today / Yesterday / X days ago)
- **React to messages** with 6 fixed emoji reactions (👍 ❤️ 😂 😮 😢 😡)
- One reaction per user per message — click again to change or remove
- **Delete your own messages** (soft-delete, shown as "Message deleted")
- Messages persist across sessions

### 👤 Authentication & Profiles
- Sign up with email, password, and a unique username
- Sign in / sign out
- Profile page showing username, avatar, joined events, and quick chat access
- Upload a profile avatar stored in Supabase Storage
- Protected routes — guests are redirected to sign in

### 📬 Contact
- Authenticated users can send a message to the team
- Form resets on every login session

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| ⚛️ Frontend | React 18 + TypeScript |
| ⚡ Build Tool | Vite |
| 🎨 Styling | Tailwind CSS v4 |
| 🔀 Routing | React Router v6 |
| 🗄️ Backend | Supabase (Auth, Database, Storage, Realtime) |
| 😄 Emoji | emoji-picker-react |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Clone the repository

```bash
git clone https://github.com/your-username/event-book.git
cd event-book
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set up the database

Run the following SQL in your Supabase SQL editor:

```sql
-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT,
  date TEXT,
  location TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event reservations
CREATE TABLE event_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Messages
CREATE TABLE event_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  user_id UUID REFERENCES auth.users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Reactions
CREATE TABLE message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES event_messages(id),
  user_id UUID REFERENCES auth.users(id),
  emoji TEXT NOT NULL,
  UNIQUE(message_id, user_id)
);

-- Contact messages
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE event_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE message_reactions;
```

### 5. RLS Policies

```sql
-- Messages: anyone can read, authenticated users can insert
ALTER TABLE event_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON event_messages FOR SELECT USING (true);
CREATE POLICY "Auth insert" ON event_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner soft-delete" ON event_messages FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Reactions
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON message_reactions FOR SELECT USING (true);
CREATE POLICY "Auth insert" ON message_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner delete" ON message_reactions FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Owner update" ON message_reactions FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

### 6. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── context/          # AuthContext — global auth state
├── hooks/            # useAuth hook
├── pages/
│   ├── Home.tsx          # Landing page
│   ├── Event.tsx         # Category event listing
│   ├── Conversation.tsx  # Real-time event chat
│   ├── Profile.tsx       # User profile & events
│   ├── Auth.tsx          # Sign in / Sign up
│   ├── Contact.tsx       # Contact form
│   └── About.tsx         # About page
├── services/
│   ├── supabase.ts       # Supabase client
│   ├── events.ts         # Event fetching & reservations
│   ├── messages.ts       # Chat messages & reactions
│   ├── profile.ts        # Username read/write
│   ├── avatar.ts         # Avatar URL resolution
│   └── contact.ts        # Contact form submission
└── main.tsx          # Router + protected routes
```

---

## 🔒 Route Protection

| Route | Access |
|---|---|
| `/` `/events` `/about` `/contact` | Public |
| `/auth` | Guests only |
| `/profile` | Authenticated users |
| `/events/:category/:eventId` | Authenticated users |
| Chat room inside event | Authenticated + reserved spot |

---

## 📦 Build for Production

```bash
npm run build
```

Output is in the `dist/` folder, ready to deploy to Netlify, Vercel, or any static host.

For Netlify, a `netlify.toml` is included that handles SPA routing:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT
