import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Register from './Pages/register'
import Home from './Pages/Home'
import Login from './Pages/login'
import Profile from './Pages/Profile'
import Header from './Pages/Header'
import PrivateRoute from './Components/PrivateRoute'
import AuthRedirect from './Components/AuthRedirect'
import Admin from './Pages/Admin'
import SurveyForm from './Pages/SurveyForm'
import SurveyPage from './Pages/SurveyPage'





function App() {
  return(
    <div>
      <Header/>
    
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={
          <AuthRedirect>
            <Register/>
          </AuthRedirect>
          }/>
        <Route path='/login' element={
          <AuthRedirect>
            <Login/>
          </AuthRedirect>
          }/>
        <Route path='/profile' element={
          <PrivateRoute>
            <Profile/>
          </PrivateRoute>
          }/>
          <Route path="/admin" element={<Admin />} />
          <Route path='/admin/surveys/:id?' element={<SurveyForm/>}/>
          <Route path='/survey/:id' element={<SurveyPage/>}/>
      </Routes>

    </div>
  )
}

export default App
