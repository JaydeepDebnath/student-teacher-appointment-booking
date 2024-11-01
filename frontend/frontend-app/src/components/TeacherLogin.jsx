import React,{useState} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { loginTeacher } from '../store/teacherAuthSlice'
import Button from './Button'
import Input from './Input'
import { useDispatch } from 'react-redux'
import {useForm} from 'react-hook-form'
import SignUp from '../pages/SignUp'


function TeacherLogin() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {register,handleSubmit} = useForm()
  const [error,setError] = useState(null)

  const login = async (data) => {
    try {
     await dispatch(loginTeacher({
      username:data.username,
      email:data.email,
      password:data.password,
      })).unwrap();
      navigate('/dashboard')
    } catch (error) {
      console.error('Teacher Login failed:', error);
      throw new Error('Teacher Login failed:',error)        
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h1>
        <form onSubmit={handleSubmit(login)} className="space-y-6">
          <div className='space-y-5'>
            <Input
              type="text"
              label="Username/Email"
              placeholder="Username or Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Email address must be a valid address"
                }
              })}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <Button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          >
            Log In
          </Button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/" className="text-purple-600 hover:underline">
            SignUp here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default TeacherLogin