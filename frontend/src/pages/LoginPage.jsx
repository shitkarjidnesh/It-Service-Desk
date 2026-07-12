import React, { useState } from "react";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Submitted locally:", formData);

    fetch("http://localhost:5000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response from backend:", data);
      })
      .catch((err) => {
        console.error("Error sending data to backend:", err);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-6 space-y-5"
        onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Contact Form
        </h2>

        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="mb-2 text-sm font-medium text-gray-700">
            Name
          </label>

          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 px-4 py-2 my-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            required
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="mb-2 text-sm font-medium text-gray-700">
            Password
          </label>

          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 px-4 py-2 my-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" required minLength={8} maxLength={16}
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition duration-200 cursor-pointer">
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
