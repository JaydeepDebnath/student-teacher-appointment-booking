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



export const handleDashboard = async () => {
    const dispatch = useDispatch();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {appointments,loading,error} = useSelector(state => state.appointmentAuth);
    const {accountInfo,setAccountInfo} = useState({
        name:"",
        eamil:"",
        contactNumber:"", 
    })
    const userRole = useSelector(state => state.user.role)


    useEffect(() => {
        dispatch(studentProfile());
        dispatch(teacherProfile());
        },[dispatch])
    

    const handleChangePassword = (e) => {
        e.preventDefault();

        if(newPassword !== confirmPassword){
            alert("password does not match!");
            return;
        }
        try {
            if(userRole === 'student'){
                dispatch(StudentPassword({password:newPassword}));
            } else if(userRole === 'teacher'){
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
            if (userRole === 'student') {
                dispatch(updateStudentAccount({ studentData: accountInfo }));
            } else if (userRole === 'teacher') {
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


    return(
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">User Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Information Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                    <form onSubmit={updateAccount}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <input
                                type="text"
                                value={accountInfo.name}
                                onChange={(e) => setAccountInfo({ ...accountInfo, name: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={accountInfo.email}
                                onChange={(e) => setAccountInfo({ ...accountInfo, email: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Contact Number</label>
                            <input
                                type="tel"
                                value={accountInfo.contactNumber}
                                onChange={(e) => setAccountInfo({ ...accountInfo, contactNumber: e.target.value })}
                                className="w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Update Account</Button>
                    </form>
                </div>

                {/* Change Password Section */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                    <form onSubmit={handleChangePassword}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Change Password</Button>
                    </form>
                </div>
            </div>

            {/* Appointments Section */}
            <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Appointments</h2>
                <Button onClick={appointmentStatus} className="bg-blue-500 text-white py-2 rounded">Fetch Appointments</Button>
                {loading && <p className="mt-4">Loading...</p>}
                {error && <p className="mt-4 text-red-500">{error}</p>}
                <ul className="mt-4">
                    {appointments.map(appointment => (
                        <li key={appointment.id} className="border-b py-2">{appointment.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}


export default handleDashboard;