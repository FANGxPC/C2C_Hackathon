# StudentConnect — AI‑Powered Study Platform

A lightweight platform to help students track learning progress, explore study materials, check placement insights, and chat with an AI study assistant powered by the Gemini API. Built as a rapid prototype for the ACM Code2Create Hackathon (ACM‑VIT).

**Live Demo:** [StudentConnect](https://c2-c-hackathon-student-connect-9aa1hvkq8-fangxpcs-projects.vercel.app/?_vercel_share=OLAObWqVnv4sTahrDEPz20ZNS74dg0p5)

---

## Features

- **Dashboard:** Today’s Focus, Daily Inspiration, and subject-wise progress bars.  
- **AI Study Assistant:** Quick explanations, concept help, summaries, and Q&A via Gemini API.  
- **Study Materials:** Searchable and categorized content (CS, AI/ML, DB, etc.).  
- **Placement Hub:** Cards with roles, locations, salary ranges, and prep tips.  
- **Networking & Study Groups:** Connect with peers and track learning together.  
- **Learning Tracker & Profile:** Monitor progress and manage your student profile.  

---

## Tech Stack

- **Frontend:** React + JavaScript  
- **AI:** Gemini API  
- **Hosting:** Vercel  

---

## Project Structure

```
studentconnect/
├─ src/
│  ├─ components/        # UI components (cards, progress bars, chat UI)
│  ├─ pages/             # Dashboard, AI Assistant, Study Materials, Placement, etc.
│  ├─ lib/               # API helpers (Gemini client, fetch utilities)
│  ├─ styles/            # Global and module styles
│  └─ data/              # Static mocks/placeholders for demo
├─ public/               # Static assets
├─ api/                  # Optional serverless routes (Gemini proxy)
├─ assets/screenshots/   # README images
└─ README.md
```

---

## Quick Start

```bash
# Clone the repo
git clone <repo-url>
cd studentconnect

# Install dependencies
npm install
# or
yarn

# Create environment file
# See Environment Variables section

# Run locally
npm run dev
# or
yarn dev
```

---

## Environment Variables

```env
# Required
GEMINI_API_KEY=your_key_here

# Optional (if using proxy/serverless route)
GEMINI_API_BASE_URL=https://generativelanguage.googleapis.com
```

Add the environment variables in your Vercel Project Settings.  

---

## Notes

- AI responses are approximate and for quick explanations.  
- Hackathon prototype; harden security and scalability before production.  

---

## Roadmap

- Authentication & role‑based access  
- Persistent chat & saved notes  
- Admin uploader with tagging/moderation  
- Offline‑first caching  
- Fine‑tuned prompts & safety layers  

---

## Acknowledgments

- ACM‑VIT — Code2Create Hackathon  
- Google Gemini API & open-source ecosystem  
- Vercel for rapid deployment  

---

## License

MIT — suitable for demos and learning. Replace if using in production.
