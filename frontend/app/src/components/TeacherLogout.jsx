import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom';
import { logout } from '../store/teacherAuthSlice';

function TeacherLogout() {
   const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    dispatch(logout());
    history.push('/login');
  };

return (
    <div>
      <h2>Teacher Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default TeacherLogout