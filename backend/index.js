const express = require("express");
const app = express();
const PORT = 5000;

// Middleware to parse incoming JSON payloads
app.use(express.json());

// Simple GET route
app.get("/api/", (req, res) => {
  res.send("Hello, World!");
  console.log(`hello world!`);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
