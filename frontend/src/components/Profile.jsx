import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { BACK_BUTTON, DANGER_BTN, FULL_BUTTON, INPUTWRAPPER, personalFields, SECTION_WRAPPER, securityFields } from '../assets/dummy'
import { ChevronLeft, Lock, LogOut, Save, Shield, UserCircle } from 'lucide-react'
import { data, useNavigate } from 'react-router-dom';
import axios from 'axios';


const API_URL = "http://localhost:4000";


const Profile = ({setCurrUser, onLogout}) => {

  const [profile, setProfile] = useState({name:"", email:""})
  const [passwords, setPasswords] = useState({current:"", new:"", confirm:""});
  const [pwdLoading, setPwdLoading] = useState(false);
  const navigate = useNavigate();

    useEffect(() => {
     const token = localStorage.getItem("token");
     if (!token) return;
     axios.get(`${API_URL}/api/user/me`, { headers: { Authorization: `Bearer ${token}` } })
       .then(({ data }) => {
         if (data.success) setProfile({ name: data.user.name, email: data.user.email });
         else toast.error(data.message);
       })
       .catch(() => toast.error("UNABLE TO LOAD PROFILE."));
    },[])

    const saveProfile = async (e) => {
      e.preventDefault();

      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.put(
            `${API_URL}/api/user/profile`,{ name: profile.name, email: profile.email},{headers: {Authorization: `Bearer ${token}`}}
        );
        if(data.success){
            setCurrUser((prev) =>({
             ...prev, name: profile.name,
             avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random`
            }))
            toast.success("Profile Updated Successfully");
        }else{
            toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Profile update failed");
      }
    }
    
  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return toast.error("Password do not match")
    }

    const token = localStorage.getItem('token');
    if (!token) return toast.error('Not authenticated');
    if (passwords.new.length < 6) return toast.error('Password must be at least 6 characters');

    try {
      setPwdLoading(true);
      const { data } = await axios.put(
        `${API_URL}/api/user/password`,
        { currPassword: passwords.current, newPassword: passwords.new },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Password changed successfully");
        setPasswords({ current: "", new: "", confirm: "" })
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    } finally {
      setPwdLoading(false);
    }
  }
    

  return (
    <>
    <div className='min-h-screen bg-gray-50'>
        <ToastContainer position='top-center' autoClose={3000} />
        <div className='max-w-4xl mx-auto p-6'>
          <button onClick={() => navigate(-1)} className={BACK_BUTTON}>
           <ChevronLeft className='size-5 mr-1' />
           Back to Dashboard
          </button>
          <div className='flex items-center gap-4 mb-8'>
           <div className='size-16 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md '>
            {profile.name ? profile.name[0].toUpperCase() : "U"}
           </div>
           <div>
            <h1 className='text-3xl font-bold text-gray-800'>Account Settings</h1>
            <p className='text-gray-500 text-sm'>Manage your profile and security settings</p>
           </div>
          </div>
          <div className='grid grid-cols-2 gap-8'>
            <section className={SECTION_WRAPPER}>
            <div className='flex items-center gap-2 mb-6'>
           <UserCircle className="text-purple-500 size-5 " />
           <h2 className='text-xl font-semibold text-gray-800'>Personal Information</h2>
            </div>

            {/* Personal info name, email */}
             <form onSubmit={saveProfile} className='space-y-4'>
             {personalFields.map(({name, type, placeholder, icon: Icon}) =>(
             <div key={name} className={INPUTWRAPPER}>
                <Icon className='w-5 h-5 mr-2 '/>
                <input  type={type} placeholder={placeholder} value={profile[name]}
                onChange={(e) => setProfile({...profile, [name]:e.target.value})} 
                className='w-full focus:outline-none text-sm ' required
                />
              </div>
             ))}
             <button type='submit' className={FULL_BUTTON}>
                <Save className="size-4" /> Save Changes
             </button>
             </form>
            </section>

            <section className={SECTION_WRAPPER}>
             <div className='flex items-center gap-2 mb-6'>
            <Shield className="text-purple-500 size-5 " />
            <h2 className='text-xl font-semibold text-gray-800'>Security </h2>
             </div>

             <form onSubmit={changePassword} className='space-y-4'>
             {securityFields.map(({name, placeholder}) => (
            <div key={name} className={INPUTWRAPPER}>
                <Lock className='text-purple-500 size-5 mr-2 '/>
                <input  type="password" placeholder={placeholder} value={passwords[name]}
                onChange={(e) => setPasswords({...passwords, [name]:e.target.value})} 
                className='w-full focus:outline-none text-sm ' required
                />
              </div>
             ))}
              <button type='submit' className={FULL_BUTTON}>
                <Shield className="size-4" />Change password
             </button>

             <div className='mt-8 pt-6 border-t border-purple-100'>
             <h3 className='text-red-600 font-semibold mb-4 flex items-center gap-2'>
             <LogOut className='size-4' /> Danger Zone
             </h3>
             <button className={DANGER_BTN} onClick={onLogout}>
                Logout
               </button>
              </div>
             </form>
            </section>
           </div>
          </div>
         </div>
    </>
  )
}

export default Profile
//  3 : 32