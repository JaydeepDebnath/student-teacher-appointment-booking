import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import {loginStudent} from '../store/studentAuthSlice.js'

const studentLogin = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [formData,setFormData ] = useState({
    username:'',
    email:'',
    studentClass:'',
    department:'',
    password:'',
    contactNumber:'',
    achademic_year:''
  });

  const {username,
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
      await dispatch(loginStudent({username,email,
        contactNumber,studentClass,
        department,password,achademic_year}));
      history.push('/')
    } catch (error) {
      console.error('Student login failed:',error)
      throw new Error('Student login failed:',error)
    }
  };

  return (
    <div>
      <h2>Student Login Page</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Username</label>
          <input
            type="username"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Class</label>
          <input
            type="studentClass"
            name="studentClass"
            value={studentClass}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Department</label>
          <input
            type="department"
            name="department"
            value={department}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Contact Number</label>
          <input
            type="contactNumber"
            name="contactNumber"
            value={contactNumber}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Achademic Year</label>
          <input
            type="achademic_year"
            name="achademic_year"
            value={achademic_year}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default studentLogin;