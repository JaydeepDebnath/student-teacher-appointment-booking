import React from 'react'
import { loginStudent } from '../store/studentAuthSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {useForm} from 'react-hook-form'



function StudentLogIn() {
const navigate = useNavigate()
  const dispatch = useDispatch()
  const {register,handleSubmit} = useForm()
  const [error,setError] = useState(null)

  const login = async (data) => {
    try {
     dispatch(loginStudent({
      name:data.name,
      email:data.email,
      password:data.password,
      }))
      navigate('/dashboard');
    } catch (error) {
      console.error('Teacher Login failed:', error);
      throw new Error('Teacher Login failed:',error)        
    }
  }
  return (
    <div>
      <h1>Student Login</h1>
      <form onSubmit={handleSubmit(login)}>
        <div>
          <input
            type="text"
            label='Username/Email'
            placeholder="Username or Email is required"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Email address must be a valid address"
              }
            })}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />
        </div>
        <Button type="submit">Log In</Button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default StudentLogIn