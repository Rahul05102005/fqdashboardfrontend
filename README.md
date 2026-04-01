# Faculty Instructional Quality Dashboard - Frontend

This is the frontend of the Faculty Instructional Quality Dashboard, built with React, TypeScript, and Vite. It provides a premium user interface for administrators, faculty members, and students to manage and view instructional quality metrics.

## 🚀 Features

- **Admin Dashboard**: Comprehensive overview of faculty performance, department stats, and trend analysis.
- **Faculty Management**: Full CRUD operations for managing faculty profiles and course assignments.
- **Feedback Analysis**: Visual representation of student feedback and performance metrics.
- **Student Portal**: Secure interface for students to submit anonymous feedback for their instructors.
- **Faculty Portal**: Personal dashboard for faculty to track their own performance and student reviews.
- **Premium UI**: Modern, responsive design using Tailwind CSS and Radix UI components.

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Fetching**: [Axios](https://axios-http.com/)
- **State Management**: React Context + Hooks
- **Charts**: [Recharts](https://recharts.org/)

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

## ⚙️ Installation

1. Navigate to the frontend directory:
   ```bash
   cd facultyiqdashboard
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

- `src/components`: Reusable UI components (buttons, inputs, layouts).
- `src/context`: Auth and global state management.
- `src/hooks`: Custom hooks for data fetching and logic.
- `src/lib`: API configuration and utility functions.
- `src/pages`: Main application views (Dashboard, Management, Login).
- `src/types`: TypeScript interfaces and types.

## 🔑 Authentication

The application uses JWT-based authentication.
- **Admin**: `admin@university.edu` / `admin123`
- **Faculty**: `faculty@university.edu` / `faculty123`
- **Student**: `student@university.edu` / `student123`

## 📄 License

This project is for educational purposes.
