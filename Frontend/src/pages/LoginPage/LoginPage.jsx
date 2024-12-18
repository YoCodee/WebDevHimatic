import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../.././../src/api.js"
import { AuthContext } from "../../context/AuthContect.jsx";
import Animation from "../../animation/animation.json"
import Lottie from "lottie-react";
import AnimationLogin from "../../animation/animetlogin.json"
function LoginPage() {
  const [error, setError] = useState(""); 
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login: loginContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      loginContext(response.data);
      navigate("/dashboard/home"); 
    } catch (err) {
      console.error("Login failed", err);
      if (err.response && err.response.data && err.response.data.message) {
     
        setError(err.response.data.message);
      } else {
       
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className=" h-screen text-gray-900 flex justify-center relative z-10 ">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1 ">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            
          </div>
          <div className="mt-12 flex flex-col items-center h-full">
           
            <div className="w-full flex-1 mt-12 flex h-full items-center flex-col">
            <h1 className="text-2xl xl:text-3xl font-extrabold py-12 justify-center">Log In</h1>
              {error && (
                <div className="mt-3 text-red-500 text-sm">{error}</div>
              )}
              <div className="mx-auto max-w-xs">
                <form action="" onSubmit={handleSubmit}>
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                  />
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                  />
                  <button className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                    <svg
                      className="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span>Login</span>
                  </button>
                </form>
                
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-blue-400 justify-center text-center   lg:flex">
          <Lottie animationData={AnimationLogin} loop={true} className="w-3/4" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
