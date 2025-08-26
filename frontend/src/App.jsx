import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';

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
    // Store token if provided
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    if (data.userId) {
      localStorage.setItem('userId', data.userId);
    }
    
    const user = {
      email: data.email,
      name: data.name || "User",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=random`,
      token: data.token,
      userId: data.userId
    }
    setCurrUser(user);
    navigate('/',{replace: true});
  }
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('currentUser');
    setCurrUser(null);
    navigate('/login',{replace: true});
  }

  const ProtectedLayout = () => {
    return (
      <Layout user={currentUser} onLogout={handleLogout}>
        <Outlet /> 
      </Layout>
    )
  }
  
  return (
    <>

     <Routes>
    <Route path='/login' element={<div className='flex inset-0 bg-no-repeat bg-opacity-50 fixed items-center justify-center'>
      <Login onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/register')} />
    </div>} />

    <Route path='/register' element={<div className='flex inset-0 bg-no-repeat bg-opacity-50 fixed items-center justify-center'
        style={{ backgroundImage: `url('../src/assets/bg.jpg')` }} >
      <Signup onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/login')} />
    </div>} />

    <Route path='/' element={currentUser ? <ProtectedLayout /> : <div className='flex inset-0 bg-no-repeat bg-opacity-50 fixed items-center justify-center'><Login onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/register')} /></div>} />

    <Route element={currentUser ? <ProtectedLayout/> : <Navigate to='/login' replace /> }>
    <Route path='/' element={<Dashboard />} />
    </Route>

    <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} replace /> } />

     </Routes>
    </>
  )
}

export default App


