import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import {loginTeacher} from '../store/teacherAuthSlice'

const teacherLogin = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [formData, setFormData] = useState({
    username:'',
    email: '',
    contactNumber:'',
    department:'',
    subject:'',
    password: '',
    role:'',
  });
  const {
    username,
    email,
    contactNumber,
    department,
    subject,
    password,
    role,} = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginTeacher({ username,
        email,
        contactNumber,
        department,
        subject,
        password,
        role }));
      history.push('/');
    } catch (error) {
      console.error('Teacher login failed:', error);
      throw new Error('Teacher login failed:',error)
    }
  };

  return (
    <div>
      <h2>Teacher Login Page</h2>
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
          <label>Contact Number:</label>
          <input
            type="contactNumber"
            name="contactNumber"
            value={contactNumber}
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
          <label>Subject</label>
          <input
            type="subject"
            name="subject"
            value={subject}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Role</label>
          <select
          name="role"
          value={role}
          onChange={onChange}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
        </select>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};


export default teacherLogin;