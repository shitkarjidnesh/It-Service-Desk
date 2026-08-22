import Admin from "../models/admin.js";
let name = "admin";
let email = "admin@mail.com";
let password = "admin123";
const newAdmin = await Admin.create({
  name,
  email,
  password,
});
