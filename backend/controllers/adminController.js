import Admin from "../models/admin.js";

export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const newAdmin = await Admin.create({
    name,
    email,
    password,
  });

  res.status(201).json(newAdmin);
};
