# JWT Cookie — Create and Validate

## 1. Create JWT Cookie During Login

```js
import { generateToken } from "../utils/jwt.js";

const token = generateToken({
  id: admin._id.toString(),
  role: "admin",
  email: admin.email,
});

res.cookie("accessToken", token, {
  httpOnly: true,
  secure: false, // true in production with HTTPS
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
});

res.json({
  message: "Login successful",
});
```

The JWT is **not returned in the response body**.

The browser receives:

```http
Set-Cookie: accessToken=eyJ...
```

---

## 2. Required Cookie Parser

Install:

```bash
npm install cookie-parser
```

In `index.js`:

```js
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(cookieParser());
```

`cookieParser()` must be added **before your routes**.

---

## 3. Validate JWT Cookie

Create:

```text
middleware/
└── authMiddleware.js
```

```js
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const decoded = verifyToken(token);

    req.auth = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
```

The important line is:

```js
const token = req.cookies.accessToken;
```

The middleware gets the JWT directly from the cookie.

---

## 4. Protect a Route

```js
import { authMiddleware } from "../middleware/authMiddleware.js";

router.get("/profile", authMiddleware, getAdminProfile);
```

Request flow:

```text
GET /admin/profile
        ↓
Browser automatically sends
accessToken cookie
        ↓
authMiddleware
        ↓
req.cookies.accessToken
        ↓
verifyToken()
        ↓
req.auth
        ↓
getAdminProfile
```

---

## 5. Validate Admin Role

If the route should only be accessible by admins:

```js
import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const decoded = verifyToken(token);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    req.auth = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
```

---

## 6. JWT Utility

`utils/jwt.js`:

```js
import jwt from "jsonwebtoken";

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
```

Both creation and validation use the same:

```js
process.env.JWT_SECRET;
```

---

## 7. React Must Send Cookies

Axios:

```js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export default api;
```

Then:

```js
await api.post("/admin/login", {
  email,
  password,
});
```

and later:

```js
await api.get("/admin/profile");
```

You do **not** manually send the JWT.

---

## 8. Express CORS

If React and Express use different origins:

```js
import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
```

The important pair is:

```text
React
withCredentials: true

        ↓

Express
credentials: true
```

---

## 9. Logout / Delete Cookie

```js
export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.json({
    message: "Logout successful",
  });
};
```

---

## 10. Cookie Security Settings

### Development

```js
{
  httpOnly: true,
  secure: false,
  sameSite: "lax"
}
```

### Production

```js
{
  httpOnly: true,
  secure: true,
  sameSite: "lax"
}
```

Use `secure: true` when your production application uses HTTPS.

---

## 11. Complete Flow

```text
LOGIN
  ↓
Generate JWT
  ↓
res.cookie("accessToken", token)
  ↓
Browser stores HttpOnly cookie
  ↓
Request /admin/profile
  ↓
Browser automatically sends cookie
  ↓
req.cookies.accessToken
  ↓
verifyToken(token)
  ↓
JWT valid?
  ├── NO  → 401 Invalid/expired token
  │
  └── YES
        ↓
     req.auth
        ↓
     Controller
```

The JWT itself is **created once during login**, stored in the cookie, and **validated on every protected request**.
