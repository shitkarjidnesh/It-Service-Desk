import Technician from "../models/technician.js";

export const registerTechnician = async (req, res) => {
  const { name, email, password } = req.body;

  const existingTechnician = await Technician.findOne({ email });

  if (existingTechnician) {
    return res.status(400).json({
      message: "Technician already exists",
    });
  }

  const newTechnician = await Technician.create({
    name,
    email,
    password,
  });

  res.status(201).json(newTechnician);
};
