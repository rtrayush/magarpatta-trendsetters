# Rotaract Club of Magarpatta Trendsetters — Website

A free, fast, dark-mode-ready website for the club. No backend, no hosting cost,
HTTPS included automatically via GitHub Pages.

## 🚀 Deploy it (takes ~10 minutes)

1. Create a new GitHub repository (e.g. `magarpatta-trendsetters`).
2. Upload everything in this folder to the repo (drag-and-drop on github.com works, or `git push`).
3. Go to **Settings → Pages** in the repo.
4. Under "Build and deployment", set **Source: Deploy from a branch**, branch: `main`, folder: `/ (root)`.
5. Save. Your site will be live in 1-2 minutes at:
   `https://<your-username>.github.io/<repo-name>/`
6. (Optional) Add a custom domain under the same Pages settings — GitHub issues a free HTTPS certificate automatically.

## ✍️ Updating content (no coding needed)

All editable content lives in three files inside `/data/`:

| File | Controls |
|---|---|
| `data/members.json` | Member directory + Upcoming Birthdays widget (auto-computed from `dob`) |
| `data/events.json` | Past + Upcoming events |
| `data/blogs.json` | Blog post cards |

To add a member, copy an existing entry in `members.json`, change the values, save.
The Members page and birthday widget update automatically — no other file needs to change.

Same pattern for events and blog posts.

## 📬 Enquiry form setup (one-time, 2 minutes)

The form on `contact.html` needs a free form backend since GitHub Pages can't run server code:

1. Go to https://formspree.io → sign up free → create a new form.
2. Copy the endpoint URL it gives you (looks like `https://formspree.io/f/abcd1234`).
3. Open `contact.html`, find the line:
   `<form id="enquiryForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">`
4. Replace `YOUR_FORM_ID` with your real endpoint. Done — submissions land in your email.

## 🖼️ Swapping placeholder branding for real assets

- **Logo / seal:** currently a placeholder gear SVG embedded in `partials/header.html`,
  `partials/footer.html`, and `assets/favicon.svg`. Replace with your real club logo
  (save as `assets/logo.svg` or `.png` and swap the `<svg class="seal">` tags for an `<img>` tag).
- **Member photos:** `badge-photo` divs currently show initials. To use real photos, add an
  `"photo": "assets/members/name.jpg"` field per member in `members.json` and update
  `js/members.js` to render an `<img>` when present (ask for this when ready — quick change).
- **Event photos:** same pattern — event cards currently show an emoji placeholder; swap for
  real photos the same way once you have them.

## 🎮 The game

`game.html` + `js/game.js` — "Service Sprint", a catch-the-icon arcade game themed to the
four Avenues of Service. High score is saved per-browser. No setup needed.

## 🌓 Dark mode

Toggled via the moon/sun icon in the navbar, persisted across visits with `localStorage`.
Respects the visitor's OS-level dark mode preference on first visit.

## 🗂️ File structure

```
index.html, about.html, why-join.html, members.html,
events.html, blogs.html, contact.html, game.html   ← pages
css/style.css                                       ← all styling, one file
js/                                                  ← include.js, main.js, members.js,
                                                       events.js, blogs.js, contact.js, game.js
data/                                                ← members.json, events.json, blogs.json
partials/                                            ← header.html, footer.html (shared nav/footer)
assets/                                              ← favicon, logo, future photos
```
