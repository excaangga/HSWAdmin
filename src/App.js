import React, { useState, useEffect } from "react";
import Jobs from "./Jobs";
import Candidates from "./Candidates";
import Industries from "./Industries";
import Gmail from "./Gmail";
import Linkedin from "./Linkedin";
import Wa from "./Wa";
import Youtube from "./Youtube";

const username = process.env.REACT_APP_USERNAME;
const password = process.env.REACT_APP_PASSWORD;
const appVersion = "1";

function App() {
  const [uname, setUname] = useState(localStorage.getItem("username") || "");
  const [pass, setPass] = useState(localStorage.getItem("password") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('Jobs');

  useEffect(() => {
    // Check if credentials are stored and not expired
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    const timestamp = parseInt(localStorage.getItem("timestamp"));
    const storedAppVersion = localStorage.getItem("appVersion");

    if (storedAppVersion !== appVersion) {
      localStorage.clear();
      return;
    }

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Jobs':
        return <Jobs />;
      case 'Candidates':
        return <Candidates />;
      case 'Industries':
        return <Industries />;
      case 'Gmail':
        return <Gmail />;
      case 'Linkedin':
        return <Linkedin />;
      case 'Wa':
        return <Wa />;
      case 'Youtube':
        return <Youtube />;

      // case 'Clients':
      //   return <Clients />;
      // case 'Hero':
      //   return <Hero />;
      // case 'Testimony':
      //   return <Testimony />;
    }
  };

  if (isLoggedIn) {
    return (
      <div className="w-max">
        <div className="flex space-x-3 mx-4 sticky top-0 bg-white h-max min-w-full">
          <button className={`px-3 py-2 my-2 border border-blue-300 hover:bg-gray-300 rounded-md ${activeTab === 'Jobs' ? 'bg-blue-300' : ''}`} onClick={() => setActiveTab('Jobs')}>Jobs</button>
          <button className={`px-3 py-2 my-2 border border-blue-300 hover:bg-gray-300 rounded-md ${activeTab === 'Candidates' ? 'bg-blue-300' : ''}`} onClick={() => setActiveTab('Candidates')}>Candidates</button>
          <button className={`px-3 py-2 my-2 border border-blue-300 hover:bg-gray-300 rounded-md ${activeTab === 'Industries' ? 'bg-blue-300' : ''}`} onClick={() => setActiveTab('Industries')}>Industries</button>
          <button className={`px-3 py-2 my-2 border border-blue-300 hover:bg-gray-300 rounded-md ${activeTab === 'Gmail' ? 'bg-blue-300' : ''}`} onClick={() => setActiveTab('Gmail')}>Gmail</button>
          <button className={`px-3 py-2 my-2 border border-blue-300 hover:bg-gray-300 rounded-md ${activeTab === 'Linkedin' ? 'bg-blue-300' : ''}`} onClick={() => setActiveTab('Linkedin')}>Linkedin</button>
          <button className={`px-3 py-2 my-2 border border-blue-300 hover:bg-gray-300 rounded-md ${activeTab === 'Wa' ? 'bg-blue-300' : ''}`} onClick={() => setActiveTab('Wa')}>Wa</button>
          <button className={`px-3 py-2 my-2 border border-blue-300 hover:bg-gray-300 rounded-md ${activeTab === 'Youtube' ? 'bg-blue-300' : ''}`} onClick={() => setActiveTab('Youtube')}>Youtube</button>
        </div>
        {renderTabContent()}
      </div>
    );
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