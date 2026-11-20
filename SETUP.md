# FOCUS setup guide

FOCUS works as soon as you open `index.html`. The features below need **two short one-time setups**:

| Feature | Needs |
|---|---|
| Plan, GPA, syllabus scanner, resume, grad schools, research log | Nothing. Works right away |
| Install on your phone, reminders, offline | **Part 1**: host it (free) |
| Sync across devices, Google Calendar sign-in, sending dates to Google | **Part 1 + Part 2** |
| iCal link without sign-in, through your own relay | Optional **Part 3** |

---

## Part 1 · Host FOCUS on GitHub Pages (free, ~5 min)

1. Sign in at **github.com** and click **New repository**. Name it `focus` and make it **Public**. Your data is never stored in the code, only in your browser and your Google Drive.
2. Click **uploading an existing file** and drag in **all** of these files:
   `index.html`, `sw.js`, `manifest.webmanifest`, `icon.svg`, `icon-192.png`, `icon-512.png`, then **Commit changes**.
3. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After a minute your app is live at **`https://YOUR-USERNAME.github.io/focus/`**. Bookmark it.

> **Moving your data:** each web address has its own storage. If you already entered grades in the file version, open that copy and go to **Settings → Data & Backup → Export backup**. Then open the hosted copy and click **Import backup**. After Part 2, sync handles this for you.

**Updating later:** upload the new `index.html` over the old one. If you change `sw.js`, also change `VERSION` at its top so phones load the new version.

---

## Part 2 · Google sign-in: Calendar + Drive sync (free, ~10 min)

This creates a private "app" in your own Google account. Only you use it.

1. Open **console.cloud.google.com**, click the project picker at the top, then **New project**. Name it `FOCUS` and click **Create**, then select it.
2. Go to **APIs & Services → Library**. Search for and **Enable** both:
   - **Google Calendar API**
   - **Google Drive API**
3. Go to **APIs & Services → OAuth consent screen** (it may be called **Google Auth Platform**). Click **Get started**:
   - App name `FOCUS`, support email = your Gmail. Audience: **External**. Contact email = your Gmail. Agree, then **Create**.
   - Open **Audience**. Leave publishing status as **Testing** and under **Test users** click **Add users**, then add `aanmukendi@gmail.com` (and any other Google account you'll use).
4. Go to **Clients** (or **Credentials → Create credentials → OAuth client ID**):
   - Application type: **Web application**, name `FOCUS web`.
   - **Authorized JavaScript origins → Add URI:** `https://YOUR-USERNAME.github.io`
     (just the origin: no `/focus/`, no trailing slash)
   - Click **Create** and copy the **Client ID** (it ends in `.apps.googleusercontent.com`).
5. Open your hosted FOCUS, go to **Settings → Google & Sync**, paste the Client ID, and click **Connect Google**.
   - Google will warn **"Google hasn't verified this app."** That's expected for a personal app. Click **Continue** and allow access.

**What you get**
- **Calendar:** all your Google Calendar events appear in FOCUS (Month, Agenda, Home). Under **Settings → Google & Sync → Load my calendars** you can also include others, like Solar Car or Guard.
- **Send to Google Calendar:** buttons on a course's *Dates* and *Office hours* tabs and on each grad school's deadline. Google then reminds you on your phone, even when FOCUS is closed.
- **Sync:** your plan, grades, notes, grad schools, research log, resumes and syllabi are saved in a hidden FOCUS folder in your Google Drive. Sign in on your laptop and your phone and they match.

**Permissions FOCUS asks for:** read your calendars, create and edit events (only ones FOCUS makes are changed), and a private app folder in Drive. It **cannot** see your other Drive files.

Sign-in lasts for the browser session. When you reopen FOCUS, click **Connect** once (Home shows a reminder).

---

## Part 3 (optional) · Your own calendar relay (Cloudflare, free, ~5 min)

Only needed if you want to use your **secret iCal link** instead of signing in (for example, on a shared computer).

1. Sign up at **dash.cloudflare.com** and go to **Workers & Pages → Create → Create Worker**. Name it `focus-relay` and click **Deploy**.
2. Click **Edit code**, replace everything with the contents of `relay-worker.js`, and click **Deploy**.
3. Recommended: go to **Settings → Variables and Secrets → Add** a **Secret** named `KEY` with any long random text.
4. In FOCUS, open **Calendar → Google Calendar** and fill in **Your relay address**:
   `https://focus-relay.YOUR-NAME.workers.dev/?key=YOUR-KEY`

The relay only fetches `calendar.google.com/calendar/ical/...` links, so nobody can use it for anything else.

---

## Install on your phone + reminders

- **Android / Chrome:** open your hosted FOCUS, tap **⋮ → Install app**.
- **iPhone (iOS 16.4+):** open it in **Safari**, tap **Share → Add to Home Screen**, then open FOCUS from the home screen.
- Then go to **Settings → Reminders & App** and turn on **Notify me on this device**. Pick when you want them (2 weeks, 1 week, 3 days, 1 day, same day).

On-device reminders appear when FOCUS is open, or when you open the installed app. For reminders that always reach you, use **Send to Google Calendar**.

---

## Where your data lives

| Data | Stored |
|---|---|
| Plan, grades, notes, grad schools, research log | This browser, plus your Google Drive app folder if sync is on |
| Syllabi, resumes, grad-school files | This browser (IndexedDB), plus your Google Drive app folder if sync is on |
| Secret iCal link | **This device only.** Never synced or exported |
| Google sign-in | This browser session only |

Back up anytime: **Settings → Data & Backup → Export backup**.
