import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

function SignUp() {
  const [userType,setUserType] = useState('')
  const navigate = useNavigate()

  const handleSignUp = (e) => {
    e.preventDefault();
    if(userType === 'teacher'){
      navigate('/teacher/signup');
    }else if(userType === 'student'){
      navigate('/student/signup');
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Sign Up as.</h1>
        <form onSubmit={handleSignUp}>
          <div className='flex flex-col mb-4'>
            <ValueButton 
              value="teacher" 
              label="Teacher"
              isSelected={userType === 'teacher'}
              onClick={()=>setUserType('teacher')}
              />
            <ValueButton
             value="student"
              label="Student"
              isSelected={userType === 'student'}
              onClick={() => setUserType('student')}
              />
          </div>
          <Button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}


const ValueButton = ({value,label,isSelected, onClick }) =>{
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer transition ${
        isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );
}

export default SignUp