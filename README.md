# IT Service Desk Management System

A full-stack, enterprise-grade IT Help Desk application built using the MERN stack (MongoDB, Express, React, Node.js). This system features role-based access control (RBAC), automated approval gates, real-time tracking, and security best practices.

---

## 🌟 Key & Important Features

### 🔐 1. Strict Role-Based Access Control (RBAC)
Dedicated and context-aware interfaces for different user categories to ensure proper separation of concerns:
*   **Requesters (End-Users)**: Log issues, request resources, track ticket status, and communicate with agents.
*   **Approvers (Managers)**: Approve or reject resource and access requests submitted by direct reports.
*   **IT Agents (Technicians)**: Resolve, assign, escalate, and collaborate on tickets within designated queues.
*   **Admins (IT Managers)**: Full system configuration, user management, and team assignment group administration.

### ⚙️ 2. Automated Workflow Routing & Approval Gates
*   **Incident Routing**: Technical bugs, hardware issues, or outages are routed directly to the IT Tier 1 queue.
*   **Service Request Gates**: Resource or permission requests are automatically locked at a `Pending Approval` stage and routed to the requester's manager. They only proceed to the IT queue once approved.
*   **Resolution Sign-Off**: Ensures a feedback loop where tickets must be verified by the requester before transitioning to `Closed`.

### ⚡ 3. Real-Time Collaboration
*   **Socket.io Relays**: Real-time comment updates, status transitions, and agent assignment notifications.
*   **Chronological Activity Logs**: A nested comments system with internal notes (for agents only) and external communications.

### 🛡️ 4. Robust Security Architecture
*   **HTTP-Only Cookies**: JWT tokens stored securely on the client in HTTP-Only, Secure, and SameSite=Strict cookies to protect against XSS (Cross-Site Scripting) vulnerabilities.
*   **Express Security Guards**: API route protection middleware that verifies JWT cookies and enforces access authorization gates.

### 📂 5. Media Attachments & S3 Integration
*   Multi-part file uploads (screenshots, error logs) handled via **Multer** and streamed securely to **AWS S3** bucket storage.

---

## 🛠️ Technology Stack

| Frontend (React) | Backend (Express / Node.js) | Database & Storage |
| :--- | :--- | :--- |
| Tailwind CSS (Styling) | Node.js & Express.js | MongoDB & Mongoose (Schema) |
| React Hook Form + Zod | JWT & Bcryptjs (Security) | AWS S3 / Multer (File Uploads) |
| TanStack Query + Axios | Socket.io (Real-time updates) | Socket.io (WebSocket Connection) |
| Lucide React (Icons) | Cookie-Parser & Cors | |

---

## 📁 Repository Structure
```bash
it-service-desk-monorepo/
├── backend/            # Node.js API with Express & Mongoose
├── frontend/           # React dashboard UI with Tailwind
├── description.md      # Detailed application design blueprint
└── README.md           # Project overview and run instructions
```

---

## 🚀 Running the Project

To review the blueprints and start configuring, check:
*   `description.md`: For technical design, data structures, and schemas.
