# 🍔 Japura Eats

**Japura Eats** is a modern, comprehensive **Food Pre-Ordering & Canteen Management System** built exclusively for the **University of Sri Jayewardenepura**. It is designed to eliminate long queues, save time for students and staff, and streamline the daily operations of university canteens.

![Japura Eats Banner](./public/banner-placeholder.png) <!-- Replace with actual banner image -->

## ✨ Key Features

The system is divided into three main modules:

### 🎓 1. Student / Staff Portal (End Users)
- **Browse Canteens & Menus:** View available food items across different university canteens.
- **Pre-Order System:** Order food in advance and set a preferred pick-up time.
- **Real-time Cart:** Seamlessly add items to the cart and checkout securely.
- **Feedback & Ratings:** Rate food items and canteens to help others make better choices.

### 🏪 2. Seller Dashboard (Canteen Managers)
- **Menu Management:** Add, edit, or remove food items easily (Integrated with AWS S3 for image uploads).
- **Order Management:** View incoming orders in real-time and update statuses (`Pending` ➔ `Preparing` ➔ `Completed`).
- **Daily Insights:** Track daily revenue and identify the most popular food items.

### 🛡️ 3. Root Admin Portal (System Administrators)
- **Centralized Dashboard:** A bird's-eye view of the entire university's food ecosystem.
- **Advanced Analytics:** Interactive charts (using Recharts) to monitor university-wide revenue, order trends, and active users.
- **User & Canteen Management:** Full control over registered users, staff, and canteen approvals.
- **Feedback Monitoring:** Oversee all system ratings and reviews.

## 📸 Screenshots

*(Add your screenshots into the `public/screenshots/` folder and update the links below)*

| User Portal (Home) | Seller Dashboard | Admin Analytics |
| :---: | :---: | :---: |
| <img src="./public/screenshots/user-portal.png" width="250" alt="User Portal"/> | <img src="./public/screenshots/seller-dashboard.png" width="250" alt="Seller Dashboard"/> | <img src="./public/screenshots/admin-portal.png" width="250" alt="Admin Portal"/> |

## 🛠️ Tech Stack

This project is built using modern web technologies to ensure scalability, security, and a premium user experience (featuring Glassmorphism UI).

- **Frontend:** Next.js (App Router), React 19, Tailwind CSS v4
- **Backend (API):** Next.js Route Handlers (Custom RESTful API)
- **Database & Auth:** Supabase (PostgreSQL)
- **Cloud Storage:** AWS S3 (For images)
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **Language:** TypeScript

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase Account
- AWS Account (for S3 bucket)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/japura-eats.git
   cd japura-eats
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET_NAME=your_bucket_name
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/japura-eats/issues).

