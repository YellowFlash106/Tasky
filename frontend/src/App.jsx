import { Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Signup from './components/Signup';
import Login from './components/Login';

const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrUser] = useState(() =>{
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    if(currentUser){
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }else{
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const handleAuthSubmit = data => {
    const user = {
      email: data.email,
      name : data.name || "User",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=random`
    }
    setCurrUser(user);
    navigate('/',{replace: true});
  }
  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrUser(null);
    navigate('/login',{replace: true});
  }

  const ProtectedLayout = () => {
    <Layout user={currentUser} onLogout= {handleLogout}>
      <Outlet /> 
    </Layout>
  }
  
  return (
    <>

     <Routes>
    <Route path='/login' element={<div className='flex inset-0 bg-black bg-opacity-50 fixed items-center justify-center'>
      <Login onAuthSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/register')} />
    </div>} />

    <Route path='/register' element={<div className='flex inset-0 bg-black bg-opacity-50 fixed items-center justify-center'>
      <Signup onAuthSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/login')} />
    </div>} />

    <Route path='/' element={<Layout />} />

     </Routes>
    </>
  )
}

export default App

// 1 : 47
