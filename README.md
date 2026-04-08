# 🗓 Interactive Wall Calendar

A modern, responsive wall calendar component built using React (Vite) and Tailwind CSS.  
Inspired by a physical hanging calendar, this project combines clean UI with interactive functionality like date range selection and notes management.

---

## 🚀 Live Demo

👉 https://interactive-calendar.vercel.app

---

## 📌 Features

### 🖼 Wall Calendar UI
- Hero image with month & year overlay
- Clean and minimal design inspired by real wall calendars

### 📅 Calendar Grid
- Dynamic month rendering
- Proper 7-column layout (Mon–Sun)
- Highlighted weekends

### 🎯 Date Range Selection
- Select start and end date
- Highlight selected range
- Clear visual states:
  - Start date (blue)
  - End date (green)
  - In-between dates (light highlight)

### 📝 Notes System
- Add notes for the month or selected date range
- Save notes using localStorage
- Persistent even after refresh
- Delete notes functionality

### 📱 Fully Responsive
- Desktop: Notes + Calendar side-by-side
- Mobile: Stacked layout (image → calendar → notes)
- Touch-friendly UI

---

## 🛠 Tech Stack

- React (Vite)
- Tailwind CSS
- date-fns
- localStorage (for persistence)

---

## 📂 Project Structure
src/
├── components/
│ ├── CalendarGrid.jsx
│ ├── DayCell.jsx
│ ├── HeroSection.jsx
│ └── NotesPanel.jsx
├── App.jsx
└── main.jsx



---

## ⚙️ Installation & Setup

Clone the repository:
git clone https://github.com/your-username/interactive-calendar.git
cd interactive-calendar

