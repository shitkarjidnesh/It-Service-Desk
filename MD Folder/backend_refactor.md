# Backend Refactoring Log

**Date:** 14 July 2026

## Objective

Refactor the Express backend into a cleaner and more scalable architecture by separating application configuration, routing, and controller logic.

---

# Changes Made

## 1. Moved Express Application to `config/app.js`

### Previous Structure

```text
backend/
├── index.js
```

`index.js` contained:

- Express app initialization
- Middleware
- Routes
- Server startup

### New Structure

```text
backend/
├── config/
│   └── app.js
├── index.js
```

### Responsibility

`config/app.js`

- Creates Express application
- Registers middleware
- Registers routes
- Starts HTTP server

`index.js`

- Connects MongoDB
- Calls `connectApp()`

This separates database initialization from application configuration.

---

# 2. Implemented MVC Structure

Created dedicated folders.

```text
backend/
├── controllers/
├── router/
├── models/
├── config/
├── utils/
└── index.js
```

Benefits

- Better code organization
- Easier maintenance
- Separation of responsibilities
- Scalable project structure

---

# 3. Implemented User Router

Created

```text
router/
└── userRouter.js
```

Responsibilities

- Define user endpoints
- Forward requests to controller
- No business logic inside router

Example

```javascript
router.post("/register", registerUser);
```

Flow

```text
Request
    ↓
Router
    ↓
Controller
```

---

# 4. Implemented User Controller

Created

```text
controllers/
└── userController.js
```

Responsibilities

- Receive request
- Validate input
- Call database model
- Return response

No routing logic is written inside the controller.

---

# 5. Registered Router

Mounted router inside Express.

```javascript
app.use("/api/users", userRouter);
```

Available endpoint

```text
POST /api/users/register
```

---

# 6. Tested Registration API

Successfully tested using JSON request.

Example

```json
{
  "name": "Jidnesh",
  "email": "abc@gmail.com",
  "password": "123456"
}
```

User document created successfully.

---

# 7. Automatic ID Generation

Implemented custom ID generation using Mongoose middleware.

Generated fields

- `userId`
- `employeeId`

Example

```text
USR-000004
EMP-000001
```

IDs are generated before validation using a `pre("validate")` hook.

---

# 8. Learned Mongoose Async Middleware

Modern async middleware should not use `next()`.

Correct

```javascript
schema.pre("validate", async function () {
    this.userId = await generateId(...);
});
```

Reason

- Async middleware returns a Promise.
- Mongoose waits automatically.
- Errors are propagated automatically.

---

# 9. Password Hashing Plan

Prepared reusable password utility.

Planned structure

```text
utils/
└── password.js
```

Functions

- `hashPassword()`
- `comparePassword()`

These functions will be shared by:

- User
- Technician
- Admin

to avoid duplicate code.

---

# 10. Mongoose Warning Identified

Observed warning

```text
new option is deprecated
```

Cause

Using

```javascript
new: true
```

inside

```javascript
findOneAndUpdate();
```

Recommended replacement

```javascript
returnDocument: "after";
```

This returns the updated document while following the latest Mongoose API.

---

# Current Backend Structure

```text
backend/
│
├── config/
│   └── app.js
│
├── controllers/
│   └── userController.js
│
├── router/
│   └── userRouter.js
│
├── models/
│   └── User.js
│
├── utils/
│   ├── idGenerator.js
│   └── password.js (planned)
│
├── index.js
│
└── package.json
```

---

# Request Flow

```text
Client
    │
    ▼
POST /api/users/register
    │
    ▼
Express
    │
    ▼
userRouter
    │
    ▼
registerUser Controller
    │
    ▼
User Model
    │
    ├── pre("validate")
    │      ├── Generate userId
    │      └── Generate employeeId
    │
    ├── pre("save")
    │      └── Hash password (planned)
    │
    ▼
MongoDB
    │
    ▼
JSON Response
```

---

# Status

- ✅ Express application moved to `config/app.js`
- ✅ MVC folder structure implemented
- ✅ User router implemented
- ✅ User controller implemented
- ✅ Register API working
- ✅ MongoDB connected successfully
- ✅ Automatic `userId` generation implemented
- ✅ Automatic `employeeId` generation implemented
- ✅ Registration API tested successfully
- ⏳ Password hashing to be integrated
- ⏳ Login API implementation pending
