import React, { useState, useEffect } from "react";
import Jobs from "./Jobs";
import Candidates from "./Candidates";
import Industries from "./Industries";
import Gmail from "./Gmail";
import Linkedin from "./Linkedin";
import Wa from "./Wa";
import Youtube from "./Youtube";
import Hero from "./Hero";
import Clients from "./Clients";
import Logo from "./Logo";
import axios from "axios";
const bcrypt = require('bcryptjs');

function App() {
  const [uname, setUname] = useState("adminhsw");
  const [pass, setPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassConfirm, setNewPassConfirm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('Jobs');
  const backendUrl = 'http://202.157.185.132:3030';
  const [res, setRes] = useState([]);
  const [activeMenu, setActiveMenu] = useState('login');

  useEffect(() => {
    axios.get(backendUrl + "/auth/" + uname).then((response) => {
      setRes(response.data);
    });


    const timestamp = parseInt(localStorage.getItem("timestamp"));
    if (timestamp && Date.now() - timestamp < 5 * 60 * 1000) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to logout?");
    if (isConfirmed) {
      localStorage.clear(); // Clear all local storage
      setIsLoggedIn(false);
    }
  };

  async function handleSubmit() {
    const rows = res;
    const match = await bcrypt.compare(pass, rows.password);
    console.log(match)
    if (match) {
      localStorage.setItem("timestamp", Date.now().toString());
      setIsLoggedIn(true);
    } else {
      alert("Wrong credential.");
    }
  };

  async function handleReset(e) {
    e.preventDefault();
    const rows = res;
    const match = await bcrypt.compare(pass, rows.password);
    console.log(match)
    const isConfirmed = window.confirm("Are you sure you want to change your password?");
    if (isConfirmed) {
      if (newPass === newPassConfirm) {
        if (match) {
          await axios.put(backendUrl + "/auth/" + uname, {
            password: newPass,
          });
          alert("Password has been changed.");
          window.location.reload(true)
        } else {
          alert("Wrong credential.");
        }
      } else {
        alert("New password confirmation isn't the same.")
      }
    }
  };

  const renderMenu = () => {
    switch (activeMenu) {
      case 'login':
        return (
          <div>
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
      case 'reset':
        return (
          <div>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleReset}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Username
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setUname(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newpassword">
                  New Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="newpassword"
                  type="password"
                  placeholder="New Password"
                  onChange={(e) => setNewPass(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newpassword">
                  Confirm New Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="newpasswordconfirm"
                  type="password"
                  placeholder="Confirm New Password"
                  onChange={(e) => setNewPassConfirm(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        )
    }
  }

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
      case 'Hero':
        return <Hero />;
      case 'Clients':
        return <Clients />;
      case 'Logo':
        return <Logo />;
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
          <button className={`px-3 py-2 my-2 border border-blue-300 hover:bg-gray-300 rounded-md ${activeTab === 'Hero' ? 'bg-blue-300' : ''}`} onClick={() => setActiveTab('Hero')}>Home Image</button>
          <button className={`px-3 py-2 my-2 border border-blue-300 hover:bg-gray-300 rounded-md ${activeTab === 'Clients' ? 'bg-blue-300' : ''}`} onClick={() => setActiveTab('Clients')}>Clients Logo</button>
          <button className={`px-3 py-2 my-2 border border-blue-300 hover:bg-gray-300 rounded-md ${activeTab === 'Logo' ? 'bg-blue-300' : ''}`} onClick={() => setActiveTab('Logo')}>Web Logo</button>
          <button className={`px-3 py-2 my-2 border bg-red-300 hover:bg-red-500 rounded-md`} onClick={handleLogout}>Logout</button>
        </div>
        {renderTabContent()}
      </div>
    );
  }

  return (
    <div className="w-96 mx-auto mt-32">
      <div className="flex justify-center items-center space-x-2">
        <button className={`px-3 py-2 my-2 border border-blue-300 hover:bg-gray-300 rounded-md ${activeMenu === 'login' ? 'bg-blue-300' : ''}`} onClick={() => setActiveMenu('login')}>Login</button>
        <button className={`px-3 py-2 my-2 border border-blue-300 hover:bg-gray-300 rounded-md ${activeMenu === 'reset' ? 'bg-blue-300' : ''}`} onClick={() => setActiveMenu('reset')}>Reset Password</button>
      </div>
      {renderMenu()}
    </div>
  );
}

export default App;