# ◈ Clarity — Task Manager

> A modern, dark-themed to-do app built with pure HTML, CSS, and JavaScript.  
> Glassmorphism UI · Smooth animations · localStorage persistence · Zero dependencies.

---

## Preview :- https://dikshantsk01.github.io/Clarity/

```
┌──────────────────────────────────────────┐
│  ◈ Clarity                        3 left │
│  ─────────────────────────────────────── │
│  [ All ]  Active  Done                   │
│                                          │
│  + │ What needs to be done?    [ Add ]   │
│  ─────────────────────────────────────── │
│  ☐  Design landing page                  │
│  ☑  Write unit tests            ✕        │
│  ☐  Push to GitHub                       │
│  ─────────────────────────────────────── │
│  3 tasks · 1 completed    Clear completed│
└──────────────────────────────────────────┘
```

---

## Features

| Feature | Details |
|---|---|
| ✅ Add tasks | Type and press **Enter** or click **Add** |
| 🗑️ Delete tasks | Hover a card and click **✕** |
| ✔️ Complete tasks | Click the animated checkbox |
| 🔢 Task counter | Live badge showing remaining active tasks |
| 🔍 Filter tabs | **All**, **Active**, **Done** views |
| 🧹 Clear completed | Remove all done tasks in one click |
| 💾 Persistence | Tasks saved in `localStorage` — survive page refresh |
| 📱 Responsive | Works on mobile, tablet, and desktop |

---

## Tech Stack

- **HTML5** — Semantic markup, ARIA attributes, accessible roles  
- **CSS3** — Custom properties, Flexbox, `backdrop-filter`, keyframe animations  
- **Vanilla JavaScript** — ES6+, no frameworks, no build tools  
- **Google Fonts** — [Syne](https://fonts.google.com/specimen/Syne) + [DM Sans](https://fonts.google.com/specimen/DM+Sans)

---

## Getting Started

No installation or build step required. Just open the file.

### 1. Clone or download

```bash
git clone https://github.com/your-username/clarity-todo.git
cd clarity-todo
```

Or download the ZIP and extract it.

### 2. Open in browser

```bash
# Option A — double-click
open index.html

# Option B — local dev server (VS Code Live Server, Python, etc.)
python3 -m http.server 3000
# then visit http://localhost:3000
```

That's it. No `npm install`, no bundler, no config.

---

## File Structure

```
clarity-todo/
├── index.html      # App shell, markup, semantic structure
├── style.css       # All styles — variables, layout, animations
├── script.js       # App logic — state, render, localStorage
└── README.md       # You are here
```

---

## Design System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--bg-base` | `#07070e` | Page background |
| `--bg-surface` | `rgba(255,255,255, 0.042)` | Card / input background |
| `--accent` | `#4ef0d4` | Primary CTA, checkboxes, counter |
| `--violet` | `#a78bfa` | Secondary ambient glow |
| `--text-primary` | `#eef0f5` | Main text |
| `--text-secondary` | `rgba(…, 0.45)` | Labels, subtitles |
| `--border` | `rgba(255,255,255, 0.08)` | Card and input borders |

### Typography

| Role | Font | Weight |
|---|---|---|
| App title, buttons | **Syne** | 700 – 800 |
| Body, tasks, labels | **DM Sans** | 300 – 500 |

### Animations

| Interaction | Effect |
|---|---|
| App load | Slide-up + fade-in (`shellReveal`) |
| Add task | Staggered card entry per index |
| Check task | Spring pop + glow on checkbox |
| Delete task | Slide-right + fade-out before removal |
| Empty input submit | Horizontal shake on input wrapper |
| Add button hover | Shimmer sweep across button |
| Logo mark | Soft pulse glow loop |

---

## localStorage Schema

Tasks are stored under the key `clarity_tasks_v1` as a JSON array:

```json
[
  {
    "id": "task_1718000000000_ab3f2",
    "text": "Design landing page",
    "done": false,
    "createdAt": 1718000000000
  }
]
```

To reset all data, run in the browser console:

```js
localStorage.removeItem('clarity_tasks_v1');
location.reload();
```

---

## Browser Support

| Browser | Support |
|---|---|
| Chrome 88+ | ✅ Full |
| Firefox 103+ | ✅ Full |
| Safari 15.4+ | ✅ Full (`-webkit-backdrop-filter` included) |
| Edge 88+ | ✅ Full |
| IE 11 | ❌ Not supported |

> `backdrop-filter` requires a modern browser. The app degrades gracefully — glass effect simply becomes a flat semi-transparent surface.

---

## Customization

### Change the accent color

Open `style.css` and edit the `--accent` variable in `:root`:

```css
:root {
  --accent: #f59e0b;  /* swap to amber, for example */
  --accent-dim: rgba(245, 158, 11, 0.18);
  --accent-glow: rgba(245, 158, 11, 0.35);
}
```

### Change the fonts

Replace the Google Fonts `<link>` in `index.html` and update the font-family references in `style.css`.

---

## Roadmap / Ideas

- [ ] Drag-and-drop reordering
- [ ] Task priority levels (low / medium / high)
- [ ] Due dates with overdue highlighting
- [ ] Dark / light theme toggle
- [ ] Subtasks / nested todos
- [ ] Export tasks as Markdown or JSON

---

## License

MIT — free to use, modify, and distribute.  
If you use this in your own project or portfolio, a credit is appreciated but not required.

---

## Author

Built with care using zero dependencies.  
Feel free to fork, star ⭐, or open an issue.
