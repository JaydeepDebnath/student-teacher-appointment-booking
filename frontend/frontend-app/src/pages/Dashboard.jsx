'use client';
import React,{useEffect, useState} from "react";
import {useSelector,useDispatch } from 'react-redux';
import Button from "../components/Button";
import {toast} from 'react-toastify';
import { fetchAppointments } from "../store/appointmentAuthSlice";
import { studentProfile } from "../store/studentAuthSlice";
import { teacherProfile } from "../store/teacherAuthSlice";
import { changePassword as StudentPassword } from "../store/studentAuthSlice";
import { changePassword as TeacherPassword } from "../store/teacherAuthSlice";
import { updateAccount as updateStudentAccount } from "../store/studentAuthSlice";
import { updateAccount as updateTeacherAccount } from "../store/teacherAuthSlice";



export const HandleDashboard = async () => {
    const dispatch = useDispatch();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {appointments,loading,error} = useSelector(state => state.appointmentAuth);
    const [accountInfo,setAccountInfo] = useState({
        name:"",
        eamil:"",
        contactNumber:"",
    });
    const [editMode,setEditMode] = useState(false)
    const {role} = useSelector(state => state.user || {} )


    useEffect(() => {
        if(role === 'student'){
            dispatch(studentProfile());
        }else if(role === 'teacher'){
            dispatch(teacherProfile());
        }
        },[dispatch,role])
    

    const handleChangePassword = (e) => {
        e.preventDefault();

        if(newPassword !== confirmPassword){
          toast.error("Passwords do not match!");
            return;
        }
        try {
            if(role === 'student'){
                dispatch(StudentPassword({password:newPassword}));
            } else if(role === 'teacher'){
                dispatch(TeacherPassword({ password: newPassword }));
            setNewPassword('');
            alert("Password changed successfully");
            }          
        }catch (error) {
            alert("Error changing password",error)
            
        }
    }

    const updateAccount =(e) =>{
        e.preventDefault();
        try {
            if (role === 'student') {
                dispatch(updateStudentAccount({ studentData: accountInfo }));
            } else if (role === 'teacher') {
                dispatch(updateTeacherAccount({ teacherData: accountInfo }));
            }
            alert("Account updated successfully")
        } catch (error) {
            alert("Error in updating account",error)
        }
        
    }

    const appointmentStatus = (e) => {
        e.preventDefault();
        try {
            dispatch(fetchAppointments())
        } catch (error) {
            alert("Error in fetching appointments")
        }
    }

    return (
      <div className="dashboard">
          <h1>Dashboard</h1>
          <div className="profile-section">
              <h2>Your Profile</h2>
              <p>Name: {accountInfo.name}</p>
              <p>Email: {accountInfo.email}</p>
              <p>Contact Number: {accountInfo.contactNumber}</p>
              <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </div>

          {editMode && (
              <form onSubmit={updateAccount}>
                  <label>Name</label>
                  <input
                      type="text"
                      value={accountInfo.name}
                      onChange={(e) => setAccountInfo({ ...accountInfo, name: e.target.value })}
                  />
                  <label>Email</label>
                  <input
                      type="email"
                      value={accountInfo.email}
                      onChange={(e) => setAccountInfo({ ...accountInfo, email: e.target.value })}
                  />
                  <label>Contact Number</label>
                  <input
                      type="text"
                      value={accountInfo.contactNumber}
                      onChange={(e) => setAccountInfo({ ...accountInfo, contactNumber: e.target.value })}
                  />
                  <button type="submit">Save Changes</button>
              </form>
          )}

          <div className="change-password">
              <h3>Change Password</h3>
              <form onSubmit={handleChangePassword}>
                  <label>New Password</label>
                  <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <label>Confirm Password</label>
                  <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button type="submit">Change Password</button>
              </form>
          </div>

          <div className="appointments-section">
              <h3>Appointments</h3>
              {loading ? (
                  <p>Loading appointments...</p>
              ) : error ? (
                  <p>Error fetching appointments: {error}</p>
              ) : (
                  <ul>
                      {Array.isArray(appointments) && appointments.map((appointment) => (
                          <li key={appointment.id}>
                              <p>Appointment with: {appointment.teacherName}</p>
                              <p>Date: {appointment.date}</p>
                              <p>Status: {appointment.status}</p>
                          </li>
                      ))}
                  </ul>
              )}
          </div>
      </div>
  );
};

export default HandleDashboard;