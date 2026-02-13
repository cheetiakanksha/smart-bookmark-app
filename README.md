# Smart Bookmark App

A modern, minimalistic, and private bookmark manager that allows users to save, organize, and access their favorite links quickly. Built with **Next.js**, **Supabase**, and **Tailwind CSS**, this app supports **Google authentication**, **real-time updates**, and a **responsive design**.

---

## 🚀 Features

- Google authentication with Supabase OAuth
- Add, delete, and manage bookmarks
- Real-time updates with Supabase Realtime
- Responsive and mobile-first design
- Pastel-colored bookmark cards for better UI
- Personalized greeting with user name or email
- Easy navigation with a Navbar
- Toast notifications for actions

---

## 🖼️ Screenshots

### Landing Page
![Landing Page](./screenshots/landing.png)

### Dashboard - Mobile
![Dashboard Mobile](./screenshots/dashboard-mobile.png)

### Dashboard - Desktop
![Dashboard Desktop](./screenshots/dashboard-desktop.png)

---

## 🌐 Live Demo

You can try the app here: [https://your-vercel-deployment-url.vercel.app](https://your-vercel-deployment-url.vercel.app)

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, TypeScript, React
- **Styling:** Tailwind CSS, Custom CSS
- **Backend / Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase OAuth (Google)
- **Animations:** Framer Motion
- **Deployment:** Vercel

---

## 📦 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/cheetiakanksha/smart-bookmark-app.git
cd smart-bookmark-app


## Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
Set up environment variables:
Create a .env.local file in the root directory with the following:

NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
Run the development server:

npm run dev
# or
yarn dev
Open http://localhost:3000 to view the app.

🗂️ Database Setup
Supabase SQL for bookmarks table:

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  title text not null,
  url text not null,
  created_at timestamp with time zone default now()
);

alter table public.bookmarks enable row level security;

create policy select_policy
on public.bookmarks
for select
using (auth.uid() = user_id);

create policy insert_policy
on public.bookmarks
for insert
with check (auth.uid() = user_id);

create policy delete_policy
on public.bookmarks
for delete
using (auth.uid() = user_id);

alter publication supabase_realtime add table public.bookmarks;
ALTER TABLE bookmarks REPLICA IDENTITY FULL;
⚡ Deployment
Push the project to GitHub.

Create a Vercel account (if not already).

Import your repository in Vercel.

Set environment variables in Vercel project settings.

Deploy – Vercel will automatically build and host your app.

📝 Challenges & Solutions
While building the Smart Bookmark App, I faced several challenges:

1. CSS not applying on dashboard page

Problem: Navbar styling worked, but dashboard components appeared unstyled.

Solution: Moved page-specific CSS to an external file (dashboard.css) and imported it into dashboard/page.tsx.

2. Supabase real-time updates not reflecting

Problem: Newly added bookmarks were not showing on the dashboard.

Solution: Fixed the Google OAuth authentication flow and ensured the Realtime channel subscribed correctly to the current user's bookmarks.

3. Duplicate bookmark entries

Problem: Clicking “Add” sometimes inserted the bookmark twice.

Solution: Added a check in the Realtime subscription to prevent duplicate insertion.

4. Responsive design issues

Problem: Cards were slightly misaligned on mobile and large screens.

Solution: Used a centered grid layout with justify-items: center and proper max-width constraints. Added media queries for responsive columns.

5. Button and card styling

Problem: Inline styles for buttons and cards did not provide consistent padding and spacing.

Solution: Moved all styling to an external CSS file with a pastel color palette and proper spacing between elements.

6. Centering header content after navbar

Problem: Greeting and page title were too close to the navbar.

Solution: Added padding/margin to header section to make “Hey, Name” and title visually balanced and centered.

7. Clickable “Open” button for bookmark URLs

Problem: Initially used an anchor tag; not consistent with buttons.

Solution: Converted to a button with onClick to open the URL in a new tab.

