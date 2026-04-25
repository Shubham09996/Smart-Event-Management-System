<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" alt="Version" />
  <img src="https://img.shields.io/badge/License-MIT-orange?style=for-the-badge" alt="License" />
  
  <br />
  <br />

  <h1>🎉 CampusSync 🎓</h1>
  <p>
    <strong>A Next-Generation, Full-Stack Platform for Campus Events, Exams, and Seamless Institutional Management.</strong>
  </p>
</div>

<hr />

## 🌟 Overview

The **CampusSync** is a premium, production-ready full-stack application designed to revolutionize how educational institutions manage events, track student attendance, and coordinate examinations. Built with a highly responsive, modern, and aesthetically pleasing UI/UX, it offers robust capabilities for multiple user roles, from Students to Event Organizers and Administrators.

Combining state-of-the-art technologies with an elegant design system (Mesh gradients, 3D interactive cards, smooth micro-animations), this platform stands out as a "next-level" solution for modern campuses.

---

## ✨ Key Features

### 👨‍🎓 For Students
*   **Intuitive Dashboard:** A beautiful, responsive hub to track upcoming events, exams, and personal statistics.
*   **Event Discovery:** Browse events via a stunning interface with advanced filtering and 3D-effect cards.
*   **Automated Ticketing:** Receive QR-coded digital tickets for events.
*   **Exam Datesheets:** Dedicated academic view for course-specific datesheets and syllabus tracking.
*   **AI Tutor Bot:** Integrated smart AI assistant (powered by Google Gemini) for instant academic help.
*   **Gamified Notifications:** Real-time, dynamic notification system to enhance engagement.

### 👔 For Organizers
*   **Comprehensive Event Management:** Create, schedule, and manage events with ease.
*   **Exam Scheduling Module:** A decoupled system specifically designed to handle exam logistics and scheduling.
*   **Real-time QR Scanning:** Fast, reliable attendance tracking via built-in QR code scanning.
*   **Data Export & Import:** Seamlessly parse or generate CSVs for bulk participant data.
*   **Payment Integration:** Integrated with Stripe for smooth, secure paid event ticketing and course transactions.

### 🛡️ For Administrators
*   **Global Overview:** Top-level metrics and statistics visualized via interactive Recharts.
*   **User & Role Management:** Securely manage access control across the entire platform.
*   **Platform Customization:** Total control over organizational settings and feature toggles.

---

## 🛠️ Technology Stack

This project is built using the highly scalable **MERN** stack, enhanced with modern tooling.

### 🎨 Frontend
*   **Framework:** React 19 + Vite ⚡
*   **Styling:** Tailwind CSS v4 (Premium Bento-Box Aesthetic) 🎨
*   **Animations:** Framer Motion & LottieFiles 🎞️
*   **Data Visualization:** Recharts 📊
*   **Utilities:** React Router DOM, Axios, React Hot Toast
*   **Core Integrations:** HTML5-QRCode, jsPDF (for exports)

### ⚙️ Backend
*   **Environment:** Node.js + Express.js 🚀
*   **Database:** MongoDB via Mongoose 🗄️
*   **Security:** JWT Authentication, bcrypt.js 🔒
*   **Media & Storage:** Cloudinary & Multer ☁️
*   **AI Integration:** Google GenAI (Gemini) 🤖
*   **Mailing:** Nodemailer 📧
*   **Data Processing:** CSV-Parser, Json2CSV

---

## 📂 Project Structure

```text
📦 Smart-Event-Management-System
 ┣ 📂 backend
 ┃ ┣ 📂 controllers    # Business logic & API endpoints
 ┃ ┣ 📂 models         # MongoDB schemas
 ┃ ┣ 📂 routes         # Express routing definitions
 ┃ ┣ 📂 middleware     # Auth, error handling, etc.
 ┃ ┣ 📜 server.js      # Express application entry point
 ┃ ┗ 📜 package.json   # Backend dependencies
 ┣ 📂 frontend
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components   # Reusable UI components (Dashboards, Modals)
 ┃ ┃ ┣ 📂 pages        # Main application views (Login, Events, etc.)
 ┃ ┃ ┣ 📂 assets       # Images, SVGs, and Lottie animations
 ┃ ┃ ┣ 📜 App.jsx      # React router setup
 ┃ ┃ ┗ 📜 main.jsx     # Frontend entry point
 ┃ ┣ 📜 index.html
 ┃ ┣ 📜 vite.config.js # Vite build configurations
 ┃ ┗ 📜 package.json   # Frontend dependencies
 ┗ 📜 README.md
```

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### 1️⃣ Prerequisites
Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18+ recommended)
*   [Git](https://git-scm.com/)
*   A [MongoDB](https://www.mongodb.com/) URI (Local or Atlas)
*   A [Cloudinary](https://cloudinary.com/) Account

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/Shubham09996/Smart-Event-Management-System.git
cd Smart-Event-Management-System
```

### 3️⃣ Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file (see Environment Variables section below)
touch .env

# Start the development server
npm run dev
```

### 4️⃣ Frontend Setup
```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

---

## 🔐 Environment Variables

You need to create a `.env` file in the `backend` directory. Here is the required format:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Cloudinary Integration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (Nodemailer)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_app_password

# Google Gemini AI
GEMINI_API_KEY=your_google_gemini_api_key

# Payment Gateway (Stripe)
STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

## 📸 Platform Previews
*(Add your stunning screenshots here!)*

| Login Wizard | Dashboard View | Event Discovery |
| :---: | :---: | :---: |
| <img src="https://via.placeholder.com/400x250.png?text=Login+Wizard" alt="Login Flow" /> | <img src="https://via.placeholder.com/400x250.png?text=Student+Dashboard" alt="Dashboard" /> | <img src="https://via.placeholder.com/400x250.png?text=Event+Discovery" alt="Events" /> |

---

## 🤝 Contributing

We welcome contributions to make this project even better! 
1. **Fork** the repository.
2. **Create a new branch** (`git checkout -b feature/AmazingFeature`).
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`).
4. **Push to the branch** (`git push origin feature/AmazingFeature`).
5. **Open a Pull Request**.

---

## 👨‍💻 Author

Developed with ❤️ and ☕ by **Shubham Gupta**

*   **GitHub:** [@Shubham09996](https://github.com/Shubham09996)
*   **Role:** Lead Architect & Full-Stack Developer

---

<div align="center">
  <p>If you like this project, please consider giving it a ⭐ on GitHub!</p>
</div>
