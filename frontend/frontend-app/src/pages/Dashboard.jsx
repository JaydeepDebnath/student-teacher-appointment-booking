'use client';

import React,{useEffect, useState} from "react";
import {useSelector,useDispatch } from 'react-redux';
import Button from "../components/Button";
import {toast} from 'react-toastify';
import { changePassword, studentProfile } from "../store/studentAuthSlice";
import { teacherProfile } from "../store/teacherAuthSlice";
import { changePassword as StudentPassword } from "../store/studentAuthSlice";
import { changePassword as TeacherPassword } from "../store/teacherAuthSlice";


const dispatch = useDispatch();


export const handleDashboard = async () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {accountInfo,setAccountInfo} = useState({
        name:"",
        department:"",
        eamil:"",
        contactNumber:"", 
    })
    const user = useSelector()


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
            await dispatch(changePassword({password:newPassword}));
            setNewPassword('');
            alert("Password changed successfully")            
        } catch (error) {
            alert("Error changing password",error)
            
        }
    }

    const updateAccount =(e) =>{
        e.preventDefault();
        try {
            await dispatch(updateAccount({studentData:accountInfo}))
            alert("Account updated successfully")
        } catch (error) {
            alert("Error in updating account",error)
        }
        
    }

    const appointments = (e) => {
        e.preventDefault();
        try {
            await dispatch()
        } catch (error) {
            alert("Error in fetching appointments")
        }
    }


}