import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import store from './store/store.js'
import { Provider } from 'react-redux'
import { RouterProvider,createBrowserRouter } from 'react-router-dom'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import { HandleDashboard } from './pages/Dashboard.jsx'
import TeacherSignupPage from './pages/TeacherSignupPage.jsx'
import StudentSignupPage from './pages/StudentSignupPage.jsx'
import AppointmentsPage from './pages/AppointmentsPage.jsx'

const router = createBrowserRouter([
  {
    path:'/',
    element:<SignUp/>,
    
  },
  {
    path:'teacher/signup',
    element:<TeacherSignupPage/>
  },
  {
    path:'student/signup',
    element:<StudentSignupPage/>
  },
  {
    path:'appointment',
    element:<AppointmentsPage/>
  },
  {
    path:'login',
    element:<Login/>
  },
  {
    path:'/dashboard',
    element:<HandleDashboard/>
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
