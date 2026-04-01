# A.U.R.A — Advanced Unified Response Assistant

Your personal AI assistant with voice activation, camera HUD, website control, and app locking.

---

## 🚀 Deploy in 5 Steps

### 1. Install Node.js
Download from https://nodejs.org (choose LTS version)

### 2. Extract this project folder
Unzip `aura-app` anywhere on your computer

### 3. Open terminal in the folder
Right-click the folder → "Open in Terminal" (or use VS Code)

### 4. Install and run
```bash
npm install
npm run dev
```
Open http://localhost:5173 in Chrome to test it locally.

### 5. Deploy to Vercel
```bash
npm install -g vercel
vercel
```
Follow the prompts — it deploys in under 2 minutes.
Your app will be live at: `https://aura-ai.vercel.app` (or similar)

---

## 📱 Install on Your Phone

1. Open your Vercel URL in **Chrome on Android**
2. Tap the **three-dot menu (⋮)**
3. Tap **"Add to Home Screen"**
4. Tap **Install**

AURA now lives on your home screen as a fullscreen app.

---

## 🎙️ How to Use

| Command | What happens |
|---|---|
| Say **"Aura"** | Activates and listens |
| "Aura, open YouTube" | Opens YouTube |
| "Aura, lock Instagram" | Locks Instagram |
| "Aura, unlock Instagram" | Unlocks it |
| "Aura, [any question]" | Answers via AI |

---

## 🔑 Note on API Key
The Claude API key is handled automatically when running inside Claude.ai artifacts.
For your standalone deployed app, you'll need to add your own Anthropic API key.

In `src/App.jsx`, find the fetch call to `https://api.anthropic.com/v1/messages`
and add a header:
```js
"x-api-key": "YOUR_ANTHROPIC_API_KEY",
"anthropic-version": "2023-06-01",
```

Get your key at: https://console.anthropic.com
