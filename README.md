# ✈️ TripAI – AI Powered Trip Planner

TripAI is a full-stack AI-powered travel planner that generates personalized itineraries based on 
destination, travel dates, budget, and interests. It combines AI-generated travel plans with real-time weather, 
hotel recommendations, flight details, and destination images for a seamless trip planning experience.

## 🌐 Live Demo:  https://tripplanner-coral.vercel.app/

## 📸 Screenshots
<img width="948" height="434" alt="image" src="https://github.com/user-attachments/assets/d7e89684-2e36-44c0-a7bb-96ede3e7f80a" />
<img width="656" height="439" alt="image" src="https://github.com/user-attachments/assets/57271d5b-4825-4105-8cdd-807c3f2a7367" />
<img width="662" height="436" alt="image" src="https://github.com/user-attachments/assets/34281357-484b-4e5b-8cc4-7e539b7188e4" />
<img width="638" height="435" alt="image" src="https://github.com/user-attachments/assets/15b17d2d-b1af-4f52-b823-eccb559421ed" />
<img width="623" height="434" alt="image" src="https://github.com/user-attachments/assets/2acd7cc1-d39b-4450-8dbe-1d5881c56f0b" />
<img width="862" height="401" alt="image" src="https://github.com/user-attachments/assets/7c6450d8-8fbe-4c61-a4ca-9d9ed43dc434" />

## 🚀 Features

- 🤖 AI-generated personalized travel itineraries
- 📅 Day-wise plans with Morning, Afternoon, Evening & Night timelines
- 🌤 Real-time weather information
- 🏨 Hotel recommendations
- ✈️ Flight suggestions
- 🖼 Destination & activity-specific images
- 💰 Budget estimation
- 🧳 Packing tips & travel tips
- 🔐 JWT Authentication (Login & Registration)
- 💾 Save, view, and delete trips
- 📱 Fully responsive modern UI
---
## 🛠 Tech Stack
**Frontend**
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

**APIs & AI**
- Google Gemini API
- OpenWeather API
- Geoapify Hotels API
- Unsplash Image API

---

## 🏗 Architecture

```text
            User
              │
              ▼
      React + Vite Frontend
              │
              ▼
       Express.js Backend
              │
 ┌────────────┼────────────┐
 ▼            ▼            ▼
Gemini    Weather API   Hotel API
  │
  ├────────► Flight Service
  ├────────► Image Service
  │
  ▼
 MongoDB
```

---

## 📂 Project Structure

```
TripAI/
│
├── client/        # React Frontend
├── server/        # Express Backend
├── README.md
└── package.json
```

---
## ⚙️ Installation
```bash
# Clone Repository
git clone https://github.com/chaitna27/TripAI.git

# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
```
---

## 🔑 Environment Variables
```env
MONGO_URI=
JWT_SECRET=
GEMINI_API_KEY=
OPENWEATHER_API_KEY=
GEOAPIFY_API_KEY=
UNSPLASH_ACCESS_KEY=
```

## 👩‍💻 Author
**Chaitna Modewar**  
B.Tech Information Technology, NIT Raipur
