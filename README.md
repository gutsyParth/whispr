# 🔐 Whispr — Secure Real-Time Private Chat

A **privacy-first real-time chat application** where users can create **secure, temporary chat rooms** for 1-to-1 communication.

Built using modern full-stack technologies with a focus on **speed, security, and clean architecture**.

---

## 🚀 Live Demo

👉 https://whispr-flame.vercel.app/

---

## ✨ Features

- 🔒 **Private Chat Rooms**
  - Only **2 users per room**
  - Unauthorized access is blocked

- ⚡ **Real-Time Messaging**
  - Instant message delivery with live updates

- 🧑‍💻 **Auto-Generated User Identity**
  - Unique usernames like `anonymous-wolf-12345`
  - Persisted using browser storage

- ⏳ **Self-Destructing Rooms**
  - Rooms automatically deleted after **10 minutes**
  - All messages permanently wiped

- 🧹 **Manual Room Deletion**
  - Instantly destroy room and remove all users

- 🧠 **Type-Safe Backend**
  - Built with **Elysia.js** for fast and scalable APIs

- 📡 **Efficient Data Fetching**
  - Powered by **TanStack Query**

---

## 🛠️ Tech Stack

**Frontend**
- Next.js (App Router)
- React
- Tailwind CSS

**Backend**
- Elysia.js (Type-safe API layer)

**Other Tools**
- TanStack Query (Data fetching)
- NanoID (Unique IDs)
- LocalStorage (Identity persistence)

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/gutsyParth/whispr.git
cd whispr
```

---

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

---

### 3. Run the development server

```bash
npm run dev
```

---

### 4. Open in browser

http://localhost:3000

---

## 🧑‍💻 How to Use

### Step 1: Open the app
- Visit the homepage
- A **random username** is automatically generated for you

### Step 2: Create a room
- Click **"Create Secure Room"**
- You’ll be redirected to a private chat room

### Step 3: Share the room
- Share the URL with **one person only**

### Step 4: Start chatting
- Messages are delivered **instantly in real-time**

### Step 5: Room behavior
- Room automatically:
  - ⏳ Expires after **10 minutes**
  - 🗑️ Deletes all messages

- Or manually:
  - Click **Destroy Room** to delete instantly

---

## 📁 Project Structure

```bash
src/
├── app/
│   ├── api/            # Backend (Elysia catch-all routes)
│   ├── page.tsx        # Landing page
│   ├── room/[id]/      # Dynamic chat rooms
│   └── layout.tsx
├── components/         # UI components + providers
├── lib/
│   ├── client.ts       # Type-safe API client
│   ├── realtime.ts     # Realtime communication logic
│   └── utils.ts
```

---

## ⚡ Key Concepts Demonstrated

- Next.js **App Router & Dynamic Routing**
- **Catch-all API routing**
- Full-stack **type safety (Elysia + client)**
- Real-time communication
- Clean folder architecture (`lib`, `components`)
- Persistent identity using LocalStorage

---

## 🚀 Deployment

Deploy easily on **Vercel**:

```bash
npm run build
npm start
```

Or use one-click deploy:

👉 https://vercel.com/new

---

## 📌 Future Improvements

- 👥 Group chat support  
- 🔐 End-to-end encryption  
- 📎 Media sharing  
- 🔑 Authentication system  

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork the repo
# Create a new branch
git checkout -b feature/your-feature

# Commit changes
git commit -m "Add feature"

# Push and open PR
```

---

## 📜 License

MIT License

---

## 🧠 Author

**Parth Yadav**  
- GitHub: https://github.com/gutsyParth  
