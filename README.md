🚀 Xeno CRM - Mini Customer Relationship Management Platform
A full-stack CRM application built for the Xeno SDE Internship Assignment 2025. This platform enables customer data management, audience segmentation, campaign creation with AI-powered messaging, and delivery tracking.

Frontend: https://xeno-crm-frontend.vercel.app

Backend API: https://xeno-crm-backend.onrender.com

API Docs: https://xeno-crm-backend.onrender.com/api/docs


🏗️ Architecture Diagram
![image](https://github.com/user-attachments/assets/c572b21d-0deb-4fe6-97f8-3e0c63d3c7a9)



💡 Features
✅ Core Features
Customer & Order Management: REST APIs for data ingestion with validation

Dynamic Audience Segmentation: Rule-based audience creation with AND/OR logic

Campaign Management: Create, send, and track personalized campaigns

AI-Powered Messaging: Generate campaign messages using Google Gemini API

Google OAuth Authentication: Secure login with Google accounts

Real-time Delivery Tracking: Monitor campaign delivery status (SENT/FAILED)


🔥 Advanced Features
Interactive API Documentation: Swagger UI for testing endpoints

Audience Size Preview: Real-time calculation of segment size

Campaign Templates: Save and reuse successful campaign formats

Delivery Analytics: Comprehensive campaign performance metrics



🛠️ Tech Stack Summary
Component	Technology	Purpose
Frontend	React.js, Tailwind CSS, React Router	User interface and navigation
Backend	Node.js, Express.js	RESTful API server
Database	MongoDB, Mongoose	Data storage and modeling
Authentication	Google OAuth 2.0, JWT	Secure user authentication
AI Integration	Google Gemini API	Intelligent message generation
Documentation	Swagger/OpenAPI	API testing and documentation
Deployment	Netlify (Frontend), Render (Backend)	Cloud hosting



🚀 Local Setup Instructions
Prerequisites
Node.js (v16+ recommended)

MongoDB (local or MongoDB Atlas)

Google Cloud Project with OAuth credentials

Google AI Studio API key

1. Clone the Repository
bash
git clone https://github.com/Aayush09b/Xeno_CRM.git
cd Xeno_CRM
2. Backend Setup
bash
cd server
npm install

# Create .env file
cp .env.example .env
Environment Variables (server/.env):

text
PORT=5000
MONGODB_URI=mongodb://localhost:27017/xeno_crm
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
Start Backend Server:

bash
npm run dev
# Server runs on http://localhost:5000
3. Frontend Setup
bash
cd client
npm install

# Create .env file
cp .env.example .env
Environment Variables (client/.env):

text
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
Start Frontend:

bash
npm start
# Client runs on http://localhost:3000
4. Database Setup
The application will automatically create required collections. For sample data, you can use the provided seed script:

bash
cd server
npm run seed
📡 API Endpoints
Method	Endpoint	Description
POST	/api/auth/google	Google OAuth authentication
POST	/api/customers	Create customer record
POST	/api/orders	Create order record
POST	/api/audiences	Create audience segment
GET	/api/audiences	List all segments
POST	/api/campaigns	Create campaign
GET	/api/campaigns	List campaigns with stats
POST	/api/messages/generate	AI message generation
Full API Documentation: /api/docs

🤖 AI Integration Details
Google Gemini API Implementation
Model Used: gemini-pro for text generation

Features:

Campaign message suggestions based on audience and goals

Context-aware content generation

Integration: REST API calls from backend to Gemini endpoint

Rate Limiting: Implemented to respect API quotas

Example AI Feature:

javascript
// Generate campaign message
POST /api/messages/generate
{
  "prompt": "Create a promotional message for high-spending customers",
}



⚠️ Known Limitations & Assumptions

Limitations
Gemini API Quota: Free tier limits may affect message generation at scale

Real-time Updates: Currently uses polling; WebSocket implementation planned

File Upload: Media attachments not implemented in current version

Multi-language Support: Currently supports English only

Campaign Scheduling: Advanced scheduling features (recurring campaigns) not included


Assumptions
Data Format: Customer and order data follows predefined JSON schema

Authentication: Users must have Google accounts for OAuth

Browser Support: Modern browsers with ES6+ support assumed

Network: Stable internet connection required for AI features

Scale: Designed for small to medium businesses (up to 10k customers)


Future Enhancements
 WebSocket integration for real-time updates

 Advanced analytics dashboard

 Multi-channel messaging (SMS, WhatsApp)

 Campaign A/B testing framework

 Advanced segmentation with ML



🧪 Testing
Run Backend Tests
bash
cd server
npm test
Test API Endpoints
Visit http://localhost:5000/api/docs for interactive API testing.


👨‍💻 Developer Information
Created by: Aayush
Assignment: Xeno SDE Internship 2025
Repository: https://github.com/Aayush09b/Xeno_CRM

📄 License
This project is part of an internship assignment and is intended for educational purposes.

⭐ If you found this project helpful, please consider giving it a star!
