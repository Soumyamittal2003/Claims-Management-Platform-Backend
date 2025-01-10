# Claims-Management-Platform-Backend

# Claims Management Platform - Backend

## Overview
This is the backend server for the Claims Management Platform. It provides RESTful APIs to handle claims submission, retrieval, and management for both patients and insurers.

## Features
- **Authentication:**
  - Role-based access control (Patient and Insurer).
  - JSON Web Token (JWT) for secure user sessions.
- **Claims Management:**
  - Patients can submit claims with optional document uploads.
  - Insurers can view, filter, and update claim statuses.
- **File Uploads:**
  - Support for uploading claim-related documents.
- **Data Persistence:**
  - MongoDB is used as the database to store users and claims.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Token (JWT)
- **File Uploads:** Multer

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/username/backend-repo.git
cd backend-repo

2. Install dependencies
```bash
npm install

npm start


