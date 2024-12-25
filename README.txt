#Fitness Web Application

##Overview
The Fitness Web Application is a comprehensive tool designed to help users set, track, and achieve their fitness goals. The application supports user authentication, goal management, and progress visualization. Built using modern web development technologies, it ensures secure data handling and provides an intuitive user experience.

---

##Features
###User Authentication
- **Secure Sign-Up & Log-In:**
  - Users register with a unique username, email, and password.
  - Passwords are securely hashed using `bcrypt` to ensure data security.
- **Session Management:**
  - Sessions are managed using `express-session` to maintain login states.

###Fitness Goal Management
- **Personalized Goals:**
  - Set, view, and track progress for fitness goals.
- **Progress Tracking:**
  - Visualize achievements over time.

###Data Storage
- **MongoDB Database:**
  - User data and goals are stored securely using the `Mongoose` ODM.
  - Data validation ensures integrity and consistency.

---

##Tools and Libraries Used
###Backend
- **Node.js**: Runtime for building the application.
- **Express.js**: Framework to handle routing and middleware efficiently.
- **MongoDB**: NoSQL database to store user and fitness goal data.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **bcrypt**: Library for securely hashing user passwords.
- **dotenv**: For managing environment variables securely.
- **express-session**: For managing user sessions and login persistence.

###Frontend
- **HTML/CSS**: For designing the user interface.
- **Handlebars.js**: Templating engine to render dynamic views.
- **Custom CSS**: Tailored styles for user-friendly interfaces.

###Development Tools
- **npm**: Package manager for installing dependencies.
- **Git**: Version control system for collaboration and code tracking.

---

##Installation
###Prerequisites
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

###Steps
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/AhmadShah-1/CS546_Final_Project.git
   cd CS546_Final_Project
