# IT Service Management System --- Database Design and ID Architecture

## 1. Project Architecture

The system uses one web application with three role-based dashboards:

-   **User / Employee**
-   **Technician / IT Support**
-   **Admin**

All roles use the same backend and database. After login, the backend
identifies the account role and the frontend redirects the account to
the correct dashboard.

``` text
One Website
    |
    +-- Login
          |
          +-- User Dashboard
          +-- Technician Dashboard
          +-- Admin Dashboard
```

Recommended stack:

``` text
Frontend  -> React
Backend   -> Node.js + Express.js
Database  -> MongoDB + Mongoose
```

------------------------------------------------------------------------

# 2. Authentication Design

## Recommended Login

Use:

``` text
Employee ID / Email + Password
```

For stronger admin security:

``` text
Admin -> Email + Password + OTP
```

Do not ask the user to select a role on the login page. The backend
should identify the role from the authenticated account.

Example custom account IDs:

``` text
User        -> USR-000001
Technician  -> TEC-000001
Admin       -> ADM-000001
```

Recommended role values:

``` text
user
technician
admin
```

------------------------------------------------------------------------

# 3. Main MongoDB Collections

Recommended collections:

``` text
users
technicians
admins
tickets
comments
notifications
activityLogs
categories
departments
counters
```

Optional future collections:

``` text
teams
announcements
knowledgeArticles
feedback
slaPolicies
```

------------------------------------------------------------------------

# 4. User Activities

The user can:

-   View dashboard statistics
-   Report a problem
-   Create a ticket
-   View filed tickets
-   Search tickets
-   Filter tickets
-   Check ticket status
-   View ticket history
-   Add public comments
-   Reply to technicians
-   Upload attachments
-   Provide additional information
-   View resolution details
-   Confirm resolution
-   Reject resolution with a reason
-   Reopen a ticket
-   Close a ticket
-   Rate support experience
-   Submit feedback
-   View notifications
-   Manage profile
-   Change password
-   Manage notification preferences

Ticket status flow visible to the user:

``` text
Submitted
    |
Acknowledged
    |
Assigned
    |
In Progress
    |
    +-- Waiting for User
    +-- On Hold
    |
Resolved
    |
Closed
```

------------------------------------------------------------------------

# 5. Technician Activities

The technician can:

-   View assigned tickets
-   View permitted unassigned tickets
-   Search and filter tickets
-   Accept assigned tickets
-   Acknowledge tickets
-   Start work
-   Change status
-   Add diagnosis
-   Add public replies
-   Add internal technical notes
-   Request additional information
-   Upload attachments
-   Add root cause
-   Add work performed
-   Record time spent
-   Resolve tickets
-   Escalate tickets
-   Request reassignment
-   Transfer tickets if permitted
-   Correct ticket category if permitted
-   Search knowledge articles
-   Link knowledge articles
-   Create draft knowledge articles
-   View personal workload
-   View performance metrics
-   Manage profile and notification settings

Technician workflow:

``` text
Assigned
    |
Acknowledged
    |
In Progress
    |
    +-- Waiting for User
    +-- On Hold
    +-- Escalated
    |
Resolved
```

------------------------------------------------------------------------

# 6. Admin Activities

The admin can:

-   View system dashboard
-   View ticket analytics
-   View all tickets
-   Search and filter all tickets
-   Assign technicians
-   Reassign technicians
-   Change priority
-   Change category
-   Change status
-   Escalate tickets
-   Reopen tickets
-   Force-close tickets
-   Mark duplicate tickets
-   Merge duplicate tickets
-   Manage users
-   Manage technicians
-   Manage roles and permissions
-   Manage categories and subcategories
-   Manage departments
-   Manage assignment rules
-   Manage SLA rules
-   Manage knowledge base content
-   Manage announcements
-   Generate reports
-   Export reports
-   View audit logs
-   View login history
-   View failed login attempts
-   Review account activity

------------------------------------------------------------------------

# 7. Automatic System Activities

The backend should automatically:

``` text
Ticket Created
      |
Generate Ticket ID
      |
Calculate / Set Priority
      |
Select Support Group
      |
Assign Technician
      |
Start SLA Timer
      |
Create Notification
      |
Create Activity Log
```

The system should also:

-   Generate unique custom IDs
-   Record timestamps
-   Record important state changes
-   Send notifications
-   Detect SLA deadlines
-   Detect SLA breaches
-   Escalate overdue tickets
-   Auto-close resolved tickets after a configured period
-   Preserve audit history

------------------------------------------------------------------------

# 8. MongoDB `_id` and Custom ID Architecture

Each important document has two identities.

Example user:

``` js
{
  _id: ObjectId("..."),
  userId: "USR-000001"
}
```

Example ticket:

``` js
{
  _id: ObjectId("..."),
  ticketId: "INC-2026-000001"
}
```

## Responsibility of Each ID

``` text
Custom ID -> frontend, URLs, display, search, communication
MongoDB _id -> internal references, joins/populate, database operations
Authorization -> actual security
```

This creates an abstraction layer:

``` text
Frontend / Public API
        |
        | uses custom IDs
        v
Backend
        |
        | resolves custom ID to document
        v
MongoDB
        |
        | uses ObjectId references
        v
Related Collections
```

Example public URL:

``` text
/tickets/INC-2026-000001
```

Backend lookup:

``` js
const ticket = await Ticket.findOne({
  ticketId: req.params.ticketId
});
```

Internal database relationship:

``` js
{
  createdBy: ObjectId("..."),
  assignedTo: ObjectId("...")
}
```

## Important Security Rule

Hiding `_id` is abstraction, not authorization.

A user must not be allowed to access another user's ticket by changing
the custom ticket ID.

Correct protected query:

``` js
const ticket = await Ticket.findOne({
  ticketId: req.params.ticketId,
  createdBy: req.user._id
});
```

------------------------------------------------------------------------

# 9. ID Mapping Between Collections

## User

``` text
Public ID   -> USR-000001
Internal ID -> User._id
```

## Technician

``` text
Public ID   -> TEC-000001
Internal ID -> Technician._id
```

## Admin

``` text
Public ID   -> ADM-000001
Internal ID -> Admin._id
```

## Ticket

``` text
Public ID   -> INC-2026-000001
Internal ID -> Ticket._id
```

## Relationship Example

``` text
users
{
  _id: ObjectId("U1"),
  userId: "USR-000001"
}

technicians
{
  _id: ObjectId("T1"),
  technicianId: "TEC-000001"
}

tickets
{
  _id: ObjectId("TK1"),
  ticketId: "INC-2026-000001",

  createdBy: ObjectId("U1"),
  assignedTo: ObjectId("T1")
}

comments
{
  _id: ObjectId("C1"),

  ticket: ObjectId("TK1"),
  authorId: ObjectId("U1"),
  authorRole: "user"
}

notifications
{
  _id: ObjectId("N1"),

  recipientId: ObjectId("U1"),
  recipientRole: "user",
  relatedTicketId: ObjectId("TK1")
}

activityLogs
{
  _id: ObjectId("L1"),

  actorId: ObjectId("T1"),
  actorRole: "technician",
  entityId: ObjectId("TK1"),
  entityType: "ticket"
}
```

------------------------------------------------------------------------

# 10. Custom ID Format

Recommended format:

``` text
User        -> USR-000001
Technician  -> TEC-000001
Admin       -> ADM-000001
Ticket      -> INC-2026-000001
```

If the project later separates incident tickets and service requests:

``` text
Incident        -> INC-2026-000001
Service Request -> REQ-2026-000001
```

If there is only one ticket type, use:

``` text
TKT-2026-000001
```

Do not use:

``` js
countDocuments() + 1
```

This can generate duplicate IDs when:

-   Records are deleted
-   Multiple requests run simultaneously

Use an atomic counter collection.

------------------------------------------------------------------------

# 11. Counter Schema

``` js
import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },

  sequence: {
    type: Number,
    default: 0
  }
});

export default mongoose.model("Counter", counterSchema);
```

Example counter documents:

``` js
{
  _id: "user",
  sequence: 25
}

{
  _id: "technician",
  sequence: 8
}

{
  _id: "admin",
  sequence: 3
}

{
  _id: "ticket-2026",
  sequence: 120
}
```

------------------------------------------------------------------------

# 12. Reusable Custom ID Generator

``` js
import Counter from "../models/Counter.js";

export async function generateId(counterName, prefix, length = 6) {
  const counter = await Counter.findByIdAndUpdate(
    counterName,
    {
      $inc: {
        sequence: 1
      }
    },
    {
      new: true,
      upsert: true
    }
  );

  return `${prefix}-${String(counter.sequence).padStart(length, "0")}`;
}
```

Usage:

``` js
const userId = await generateId("user", "USR");
// USR-000001

const technicianId = await generateId("technician", "TEC");
// TEC-000001

const adminId = await generateId("admin", "ADM");
// ADM-000001
```

------------------------------------------------------------------------

# 13. Ticket ID Generator with Year

``` js
import Counter from "../models/Counter.js";

export async function generateTicketId() {
  const year = new Date().getFullYear();

  const counter = await Counter.findByIdAndUpdate(
    `ticket-${year}`,
    {
      $inc: {
        sequence: 1
      }
    },
    {
      new: true,
      upsert: true
    }
  );

  return `INC-${year}-${String(counter.sequence).padStart(6, "0")}`;
}
```

Generated values:

``` text
INC-2026-000001
INC-2026-000002
INC-2026-000003
```

The next year uses a separate counter:

``` text
INC-2027-000001
```

------------------------------------------------------------------------

# 14. User Schema

``` js
{
  _id: ObjectId,

  userId: String,

  employeeId: String,
  name: String,
  email: String,
  password: String,
  phone: String,

  departmentId: ObjectId,
  designation: String,
  location: String,

  role: "user",

  accountStatus: String,

  profileImage: String,

  notificationPreferences: {
    email: Boolean,
    inApp: Boolean
  },

  lastLoginAt: Date,

  createdAt: Date,
  updatedAt: Date
}
```

Recommended account status values:

``` text
active
inactive
blocked
```

Recommended indexes:

``` text
_id        -> automatically indexed and unique
userId     -> unique index
employeeId -> unique index
email      -> unique index
```

Mongoose custom ID field:

``` js
userId: {
  type: String,
  required: true,
  unique: true,
  index: true
}
```

------------------------------------------------------------------------

# 15. Technician Schema

Use the term `technician` instead of `worker` for an IT service
management system.

``` js
{
  _id: ObjectId,

  technicianId: String,

  name: String,
  email: String,
  password: String,
  phone: String,

  departmentId: ObjectId,
  teamId: ObjectId,

  specializations: [
    String
  ],

  assignedCategories: [
    ObjectId
  ],

  role: "technician",

  availabilityStatus: String,
  accountStatus: String,

  currentTicketCount: Number,

  profileImage: String,

  lastLoginAt: Date,

  createdAt: Date,
  updatedAt: Date
}
```

Availability values:

``` text
available
busy
offline
on_leave
```

Account status values:

``` text
active
inactive
blocked
```

Recommended indexes:

``` text
_id             -> automatic unique index
technicianId    -> unique index
email           -> unique index
departmentId    -> normal index if frequently filtered
accountStatus   -> normal index if frequently filtered
```

Values such as total resolved tickets and average resolution time should
normally be calculated from ticket data instead of duplicated
permanently.

------------------------------------------------------------------------

# 16. Admin Schema

``` js
{
  _id: ObjectId,

  adminId: String,

  name: String,
  email: String,
  password: String,
  phone: String,

  role: String,

  permissions: [
    String
  ],

  accountStatus: String,

  twoFactorEnabled: Boolean,

  lastLoginAt: Date,

  createdAt: Date,
  updatedAt: Date
}
```

Role values:

``` text
admin
super_admin
```

Example permissions:

``` js
[
  "manage_users",
  "manage_technicians",
  "manage_tickets",
  "manage_categories",
  "view_reports",
  "view_logs"
]
```

Recommended indexes:

``` text
_id      -> automatic unique index
adminId  -> unique index
email    -> unique index
```

------------------------------------------------------------------------

# 17. Ticket Schema

``` js
{
  _id: ObjectId,

  ticketId: String,

  title: String,
  description: String,

  createdBy: ObjectId,

  categoryId: ObjectId,
  subcategoryId: ObjectId,

  departmentId: ObjectId,

  affectedItem: String,

  impact: String,
  urgency: String,
  priority: String,

  status: String,

  assignedTo: ObjectId,
  assignedBy: ObjectId,

  attachments: [
    {
      fileName: String,
      fileUrl: String,
      fileType: String,
      uploadedAt: Date
    }
  ],

  location: String,

  resolution: {
    summary: String,
    rootCause: String,
    workPerformed: String,
    resolvedBy: ObjectId,
    resolvedAt: Date
  },

  sla: {
    responseDueAt: Date,
    resolutionDueAt: Date,
    firstRespondedAt: Date,
    responseBreached: Boolean,
    resolutionBreached: Boolean
  },

  closedAt: Date,

  createdAt: Date,
  updatedAt: Date
}
```

Priority values:

``` text
low
medium
high
critical
```

Status values:

``` text
submitted
acknowledged
assigned
in_progress
waiting_for_user
on_hold
resolved
closed
reopened
cancelled
```

Recommended indexes:

``` text
_id          -> automatic unique index
ticketId     -> unique index
createdBy    -> normal index
assignedTo   -> normal index
status       -> normal index
priority     -> normal index
categoryId   -> normal index
createdAt    -> normal index
```

Possible compound indexes should be added only after confirming actual
query patterns.

Example:

``` js
ticketSchema.index({
  assignedTo: 1,
  status: 1
});
```

------------------------------------------------------------------------

# 18. Ticket Relationship Fields in Mongoose

``` js
createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  index: true
},

assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Technician",
  default: null,
  index: true
}
```

Populate example:

``` js
const ticket = await Ticket.findOne({
  ticketId: req.params.ticketId
})
  .populate("createdBy", "userId name email")
  .populate("assignedTo", "technicianId name");
```

------------------------------------------------------------------------

# 19. Comment Schema

Comments should be stored separately because a ticket can accumulate
many comments.

``` js
{
  _id: ObjectId,

  ticketId: ObjectId,

  authorId: ObjectId,

  authorRole: String,

  message: String,

  commentType: String,

  attachments: [
    {
      fileName: String,
      fileUrl: String,
      fileType: String
    }
  ],

  isEdited: Boolean,
  editedAt: Date,

  createdAt: Date,
  updatedAt: Date
}
```

Author role values:

``` text
user
technician
admin
```

Comment type values:

``` text
public
internal
```

Rules:

``` text
User comment      -> public
Technician reply  -> public
Internal IT note  -> internal
Admin note        -> internal
```

Users must never receive internal comments through the API.

Recommended indexes:

``` text
ticketId
authorId
createdAt
```

------------------------------------------------------------------------

# 20. Notification Schema

``` js
{
  _id: ObjectId,

  recipientId: ObjectId,

  recipientRole: String,

  type: String,

  title: String,
  message: String,

  relatedTicketId: ObjectId,

  isRead: Boolean,
  readAt: Date,

  createdAt: Date
}
```

Recipient roles:

``` text
user
technician
admin
```

Notification types:

``` text
ticket_created
ticket_assigned
status_changed
new_comment
ticket_resolved
ticket_reopened
sla_warning
sla_breached
announcement
```

Example:

``` js
{
  recipientId: ObjectId("..."),
  recipientRole: "user",

  type: "status_changed",

  title: "Ticket Status Updated",

  message: "Your ticket INC-2026-000001 is now In Progress.",

  relatedTicketId: ObjectId("..."),

  isRead: false,
  readAt: null,

  createdAt: new Date()
}
```

Recommended indexes:

``` text
recipientId
relatedTicketId
isRead
createdAt
```

A useful compound index for notification listing:

``` js
notificationSchema.index({
  recipientId: 1,
  createdAt: -1
});
```

------------------------------------------------------------------------

# 21. Activity Log Schema

Logs should record important actions from all roles and the system.

``` js
{
  _id: ObjectId,

  actorId: ObjectId,

  actorRole: String,

  action: String,

  entityType: String,

  entityId: ObjectId,

  description: String,

  changes: {
    before: Object,
    after: Object
  },

  ipAddress: String,
  userAgent: String,

  createdAt: Date
}
```

Actor roles:

``` text
user
technician
admin
system
```

Entity types:

``` text
ticket
user
technician
admin
category
department
```

Example status-change log:

``` js
{
  actorId: ObjectId("..."),
  actorRole: "technician",

  action: "TICKET_STATUS_CHANGED",

  entityType: "ticket",
  entityId: ObjectId("..."),

  description: "Ticket status changed from Assigned to In Progress",

  changes: {
    before: {
      status: "assigned"
    },

    after: {
      status: "in_progress"
    }
  },

  createdAt: new Date()
}
```

Recommended log actions:

``` text
LOGIN_SUCCESS
LOGIN_FAILED
LOGOUT

TICKET_CREATED
TICKET_ASSIGNED
TICKET_REASSIGNED
TICKET_STATUS_CHANGED
TICKET_PRIORITY_CHANGED
TICKET_RESOLVED
TICKET_REOPENED
TICKET_CLOSED

COMMENT_ADDED
INTERNAL_NOTE_ADDED

USER_CREATED
USER_UPDATED
USER_BLOCKED
USER_ACTIVATED

TECHNICIAN_CREATED
TECHNICIAN_UPDATED
TECHNICIAN_DEACTIVATED

CATEGORY_CREATED
CATEGORY_UPDATED
CATEGORY_DELETED

PASSWORD_CHANGED
PASSWORD_RESET
```

Never log:

``` text
Passwords
OTP values
JWT tokens
Authorization headers
Sensitive authentication secrets
```

Recommended indexes:

``` text
actorId
entityId
entityType
action
createdAt
```

Useful compound index for ticket history:

``` js
activityLogSchema.index({
  entityType: 1,
  entityId: 1,
  createdAt: -1
});
```

A separate `ticketHistory` collection is not required if `activityLogs`
stores every meaningful ticket change.

------------------------------------------------------------------------

# 22. Category Schema

``` js
{
  _id: ObjectId,

  name: String,
  description: String,

  subcategories: [
    {
      _id: ObjectId,
      name: String
    }
  ],

  assignedTeamId: ObjectId,

  isActive: Boolean,

  createdBy: ObjectId,

  createdAt: Date,
  updatedAt: Date
}
```

Example:

``` js
{
  name: "Network",

  subcategories: [
    {
      name: "Wi-Fi"
    },
    {
      name: "VPN"
    },
    {
      name: "Internet"
    }
  ],

  isActive: true
}
```

------------------------------------------------------------------------

# 23. Department Schema

``` js
{
  _id: ObjectId,

  name: String,
  code: String,

  description: String,

  managerName: String,

  isActive: Boolean,

  createdAt: Date,
  updatedAt: Date
}
```

Example:

``` js
{
  name: "Finance",
  code: "FIN",
  isActive: true
}
```

Recommended indexes:

``` text
name -> unique if department names must be unique
code -> unique
```

------------------------------------------------------------------------

# 24. Frontend API Response Design

The frontend should primarily receive custom IDs.

Example:

``` js
{
  ticketId: "INC-2026-000001",

  title: "Unable to connect to office Wi-Fi",

  createdBy: {
    userId: "USR-000001",
    name: "Rahul"
  },

  assignedTo: {
    technicianId: "TEC-000001",
    name: "Amit"
  },

  status: "in_progress"
}
```

The frontend normally does not need:

``` js
{
  _id: "6868f29a91b2..."
}
```

Example backend projection:

``` js
const ticket = await Ticket.findOne({
  ticketId: req.params.ticketId
})
  .populate("createdBy", "userId name email")
  .populate("assignedTo", "technicianId name")
  .select("-__v");
```

If `_id` is not required by the frontend, transform the response before
sending it.

------------------------------------------------------------------------

# 25. Indexing Rules

MongoDB automatically creates:

``` text
_id -> unique index
```

Do not manually add another index to `_id`.

For custom IDs:

``` js
ticketId: {
  type: String,
  required: true,
  unique: true,
  index: true
}
```

The same rule applies to:

``` text
userId
technicianId
adminId
ticketId
```

Important distinction:

``` text
unique: true -> prevents duplicate values
index: true  -> improves matching and sorting for relevant queries
```

Do not index every field. Index fields used frequently for:

-   Exact lookup
-   Filtering
-   Sorting
-   Relationship queries

Too many indexes:

-   Increase storage usage
-   Slow inserts
-   Slow updates
-   Increase index maintenance cost

------------------------------------------------------------------------

# 26. Final Database Relationship Model

``` text
USER
  |
  | creates
  v
TICKET ---------------- CATEGORY
  |
  | assigned to
  v
TECHNICIAN

TICKET
  |
  +---- COMMENTS
  |
  +---- NOTIFICATIONS
  |
  +---- ACTIVITY LOGS

ADMIN
  |
  +---- manages users
  +---- manages technicians
  +---- assigns tickets
  +---- manages categories
  +---- reviews reports
  +---- reviews logs
```

------------------------------------------------------------------------

# 27. Core Design Rules

``` text
1. Keep MongoDB-generated _id.

2. Generate a separate structured custom ID.

3. Use custom IDs in:
   - frontend display
   - public URLs
   - search
   - support communication
   - API route parameters

4. Use ObjectId values in:
   - collection relationships
   - Mongoose refs
   - populate()
   - internal database operations

5. Create unique indexes on custom IDs.

6. Use atomic counters for sequential custom IDs.

7. Never use countDocuments() + 1 for ID generation.

8. Keep comments separate from tickets.

9. Keep notifications separate from tickets.

10. Use activityLogs as the audit trail.

11. Do not store passwords, OTPs, tokens, or authorization headers in logs.

12. Hiding _id is abstraction, not security.

13. Always enforce authorization in backend queries.
```
