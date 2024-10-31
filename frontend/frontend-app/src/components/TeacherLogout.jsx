import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/teacherAuthSlice';

function TeacherLogout() {
   const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

return (
    <div>
      <h2>Teacher Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default TeacherLogout