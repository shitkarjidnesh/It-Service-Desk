# IT Help Desk Application Blueprint

This document outlines the architecture, features, user workflows, technology choices, and data structures for building a modern, enterprise-ready IT Help Desk application.

---

## 1. Project Overview & Scope
The goal is to build a scalable, role-based IT Help Desk system that handles incident management, resource requests, multi-tier routing, business approvals, and real-time support tracking.

---

## 2. Core MVP & Product Features

### Phase 1: Minimum Viable Product (MVP)
* **Role-Based Dashboards:** Distinct user interfaces for Requesters, Agents, and Admins.
* **Ticket Management:** A clean lifecycle tracking system supporting statuses: `Open` ➔ `In Progress` ➔ `Pending User` ➔ `Resolved` ➔ `Closed`.
* **Media Support:** Ability for users to attach screenshots/photos to help diagnose issues quickly.
* **Activity Logging:** Chronological comment logs inside tickets for real-time collaboration.

### Phase 2 & 3: Advanced Roadmap
* **Approval Gates:** Specialized workflow routing for high-impact resource requests.
* **Knowledge Base:** A searchable library of self-service FAQ articles.
* **SLA Tracking:** Timers to monitor performance indicators based on ticket priority (`Low`, `Medium`, `High`, `Critical`).

---

## 3. Role Categorization & Responsibilities

The application implements strict Role-Based Access Control (RBAC). Every user maps to one of four profiles:

### 1. The Requester (End-User)
* **Work:** Logs problems, submits asset requests, communicates with technicians.
* **Responsibility:** Providing accurate logs and testing/verifying fixes.
* **Boundaries:** Can only view, comment on, and manage their own tickets.

### 2. The Approver (Manager)
* **Work:** Vets spending or permission requests from direct reports.
* **Responsibility:** Confirming budget or policy justifications promptly.
* **Boundaries:** Access restricted to a flat binary `Approve` or `Reject` dashboard. Cannot interact with global IT queues.

### 3. The IT Agent (Support Technician)
* **Work:** Resolves, categorizes, updates, and escalates tickets.
* **Responsibility:** Adhering to SLAs, translating jargon for users, and keeping technical troubleshooting logs.
* **Boundaries:** Full visibility of assigned queues; cannot modify global application settings.

### 4. The Admin (IT Manager)
* **Work:** System configuration, onboarding users, role updates, and queue performance analytics.
* **Responsibility:** Maintenance of system integrity, groups, and automation rules.
* **Boundaries:** Total system-wide access.

---

## 4. Sequential Work & Routing Flow

```
[User Form Entry] ──► [Category Assessment]
│
├──► (Service Request) ──► [Manager Approval Gate] ──► [IT Tier 1 Queue]
│
└──► (Incident/Broken) ───────────────────────────────► [IT Tier 1 Queue]
│
▼
[Agent Assignment]
│
▼
[Fix & User Sign-Off]
```

1.  **Ticket Classification:** A user inputs descriptions, metadata, and photos. The application automatically tracks the category.
2.  **The Approval Gate:** If it's an asset or high-security request, the ticket locks at `Pending Approval` until their manager authorizes it.
3.  **Triage & Assignment:** Issues enter an unassigned workspace queue. Agents assign items to themselves or escalate to technical groups (e.g., Network Team).
4.  **Verification Loop:** Once fixed, the ticket is marked `Resolved`. Requesters must verify the resolution to safely transition the ticket to `Closed`.

---

## 5. Architecture & Tech Stack Selection

The system is engineered using the **MERN Stack** coupled with modern UI utilities:

### Frontend (React)
* **Tailwind CSS:** Utility-first CSS framework for rapid dashboard design and responsive states.
* **React Hook Form + Zod:** Form management and schema verification to control validation on complex input sequences without slowing performance.
* **TanStack Query (React Query) + Axios:** Enterprise data-caching layer and HTTP promise client configured with `withCredentials: true` to pass data across origins.
* **Socket.io-client & Lucide React:** Live notification relays and iconography.
* **Lenis React:** Fluid canvas scrolling for long data threads.

### Backend (Node.js & Express)
* **Mongoose:** Explicit structural modeling for MongoDB documents.
* **Cors:** Server middleware to safely handle requests between the client and API domains.
* **Cookie-Parser, JWT, & Bcryptjs:** Cryptographic security stack enabling password hashing and HTTP-Only JWT distribution.
* **Multer & @aws-sdk/client-s3:** Multi-part file streaming to store attached images securely in cloud bucket storage.
* **Socket.io:** Server websocket handling for push updates.

---

## 6. Mongoose Schemas (Data Design)

### User Schema (`User.js`)
```javascript
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['REQUESTER', 'APPROVER', 'IT_AGENT', 'ADMIN'], default: 'REQUESTER' },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
```

### Ticket Schema (`Ticket.js`)

```javascript
const mongoose = require('mongoose');
const TicketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Hardware', 'Software', 'Network', 'Access Request', 'Other'], required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  status: { type: String, enum: ['Pending Approval', 'Open', 'In Progress', 'Pending User', 'Resolved', 'Closed'], default: 'Open' },
  openedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignmentGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', default: null },
  approverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  approvalStatus: { type: String, enum: ['Not Required', 'Pending', 'Approved', 'Rejected'], default: 'Not Required' },
  attachments: [{ fileName: String, fileUrl: String, uploadedAt: { type: Date, default: Date.now } }],
  resolutionSummary: { type: String, default: null },
  resolvedAt: { type: Date, default: null }
}, { timestamps: true });
TicketSchema.index({ status: 1, priority: -1 });
module.exports = mongoose.model('Ticket', TicketSchema);
```

### Comment Schema (`Comment.js`)

```javascript
const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  body: { type: String, required: true },
  isInternal: { type: Boolean, default: false },
  attachments: [{ fileName: String, fileUrl: String }]
}, { timestamps: true });
module.exports = mongoose.model('Comment', CommentSchema);
```

### Group Schema (`Group.js`)

```javascript
const mongoose = require('mongoose');
const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
module.exports = mongoose.model('Group', GroupSchema);
```

---

## 7. Security Architecture

### Authentication

* **Storage Strategy:** JWTs are written directly into secure **HTTP-Only, Secure, and SameSite=Strict** cookie frames on login. Frontend script packages cannot read or hijack token payloads, completely eliminating local XSS exposures.
* **Client Configuration:** Axios instances are configured globally with `withCredentials: true` to implicitly append authentication tokens on subsequent requests.

### Role-Based Access Control (RBAC) Middleware

The API executes a layered gatekeeping mechanism:

1. `protect`: Decodes and confirms the legitimacy of the incoming browser cookie.
2. `authorize(...roles)`: Cross-references the identity signature against authorized resource groups to grant or deny resource compilation.
