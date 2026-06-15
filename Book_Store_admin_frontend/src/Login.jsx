import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();   // ⭐ add navigate hook

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/admin/login", {
        name,
        password,
      });

      console.log("Login Success:", res.data);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("admin", JSON.stringify(res.data.admin));

        alert("Login Successful!");
        navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg p-8 rounded-xl w-[350px]">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

        {error && (
          <p className="text-red-500 text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleLogin}>
          <label className="font-semibold">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg mb-4 mt-1"
            placeholder="Enter admin name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="font-semibold">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded-lg mb-4 mt-1"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

