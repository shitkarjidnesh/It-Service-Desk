# MongoDB Connection to Router Flow (Express + Mongoose)

# 1. Connect to MongoDB

**.env**

```env
MONGO_URL=mongodb://localhost:27017/it_service_desk
PORT=5000
```

**config/db.js**

```javascript
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);


    
    process.exit(1);
  }
};

export default connectDB;
```

`mongoose.connect()` creates a connection between the Node.js
application and the MongoDB server.

---

# 2. Start the Server

**index.js**

```javascript
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(5000);
```

## What happens?

1.  `.env` is loaded.
2.  `connectDB()` connects to MongoDB.
3.  `express.json()` converts JSON requests into `req.body`.
4.  `/api/users` is linked to `userRoutes`.
5.  The server waits for incoming HTTP requests.

---

# 3. User Model - model/user.js

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

export default mongoose.model("User", userSchema);
```

The model represents the `users` collection and provides methods such
as:

- `findOne()`
- `findById()`
- `create()`
- `findByIdAndUpdate()`
- `findByIdAndDelete()`

---

# 4. Controller - controller.userController.js

```javascript
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  res.status(201).json(newUser);
};
```

The controller contains business logic.

It receives the request, communicates with MongoDB through the model,
and returns a response.

---

# 5. Router - router.userRouter.js

```javascript
import express from "express";

import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", getProfile);

router.put("/profile", updateProfile);

router.delete("/:id", deleteUser);

export default router;
```

## Why use a Router?

The router maps HTTP requests to controller functions.

Example:

```text
POST /register
        │
        ▼
registerUser()
```

Without a router, Express would not know which function should execute
for a particular URL.

---

# 6. Mount the Router

```javascript
app.use("/api/users", userRoutes);
```

This adds the prefix `/api/users` to every route inside `userRoutes.js`.

Examples:

Router Path Final Endpoint

---

`/register` `/api/users/register`
`/login` `/api/users/login`
`/profile` `/api/users/profile`

Express combines the prefix with each router path automatically.

---

# 7. Complete Registration Flow

```text
Frontend
     │
POST /api/users/register
     │
     ▼
Express Server
(index.js)
     │
app.use("/api/users", userRoutes)
     │
     ▼
userRoutes.js
router.post("/register", registerUser)
     │
     ▼
registerUser(req, res)
     │
     ▼
Read req.body
     │
     ▼
User.findOne({ email })
     │
     ├── User exists
     │      │
     │      ▼
     │   Return 400
     │
     └── User not found
            │
            ▼
      User.create({
          name,
          email,
          password
      })
            │
            ▼
MongoDB inserts the document
            │
            ▼
Return 201 Created
            │
            ▼
Frontend receives JSON response
```

---

# Responsibilities

## index.js

- Starts Express.
- Connects to MongoDB.
- Registers middleware.
- Mounts routers.
- Starts the server.

## userRoutes.js

- Defines URL paths.
- Maps each path to a controller function.
- Contains no database logic.

## userController.js

- Contains business logic.
- Validates requests.
- Calls Mongoose model methods.
- Sends HTTP responses.

## User.js (Model)

- Defines the MongoDB document structure.
- Interacts with MongoDB using Mongoose methods.

## MongoDB

- Stores and retrieves user documents.
