import React, { useState, useEffect } from "react";
import Jobs from "./Jobs";

const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;

function App() {
  const [uname, setUname] = useState(localStorage.getItem("username") || "");
  const [pass, setPass] = useState(localStorage.getItem("password") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if credentials are stored and not expired
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    const timestamp = parseInt(localStorage.getItem("timestamp"));

    if (storedUsername === username && storedPassword === password) {
      if (timestamp && Date.now() - timestamp < 5 * 60 * 1000) {
        setIsLoggedIn(true);
      }
    }
  }, [username, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (uname === username && pass === password) {
      // Store credentials and timestamp in localStorage
      localStorage.setItem("username", uname);
      localStorage.setItem("password", pass);
      localStorage.setItem("timestamp", Date.now().toString());
      setIsLoggedIn(true);
    } else {
      alert("Wrong credential.");
    }
  };

  if (isLoggedIn) {
    return <Jobs />;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            value={uname}
            onChange={(e) => setUname(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Log in
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;