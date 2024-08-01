import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerStudent } from "../store/studentAuthSlice";

const StudentSignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData,setFormData ] = useState({
    name:'',
    email:'',
    studentClass:'',
    department:'',
    password:'',
    contactNumber:'',
    achademic_year:''
  });

  const {name,
    email,
    studentClass,
    department,
    password,
    contactNumber,
    achademic_year} = formData;

  const onChange = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value});
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerStudent({name,email,
        contactNumber,studentClass,
        department,password,achademic_year}));
        navigate('/')
    } catch (error) {
      console.error('Student SignUp failed:',error)
      throw new Error('Student SignUp failed:',error)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg border border-gray-300">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-6">Student Sign Up</h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 text-sm font-medium text-gray-800">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Enter your name"
              required
              className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-800">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email"
              required
              className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="studentClass" className="mb-1 text-sm font-medium text-gray-800">Class</label>
            <input
              type="text"
              id="studentClass"
              name="studentClass"
              value={studentClass}
              onChange={onChange}
              placeholder="Enter your class"
              required
              className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="department" className="mb-1 text-sm font-medium text-gray-800">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={department}
              onChange={onChange}
              placeholder="Enter your department"
              required
              className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-800">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your password"
              required
              className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="contactNumber" className="mb-1 text-sm font-medium text-gray-800">Contact Number</label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={contactNumber}
              onChange={onChange}
              placeholder="Enter your contact number"
              required
              className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="achademic_year" className="mb-1 text-sm font-medium text-gray-800">Academic Year</label>
            <input
              type="text"
              id="achademic_year"
              name="achademic_year"
              value={achademic_year}
              onChange={onChange}
              placeholder="Enter your academic year"
              required
              className="p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentSignUp;