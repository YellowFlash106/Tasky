import React, { useState } from 'react'
import { PRODUCTIVITY_CARD, SIDEBAR_CLASSES } from '../assets/dummy'
import { Sparkles } from 'lucide-react';


const Sidebar = ({user, tasks}) => {

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showModal, setShowModal] = useState(false)
  
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.completed).length || 0;
  const productivity = totalTasks > 0 ? 
  Math.round((completedTasks / totalTasks) * 100) : 0
  
  const username = user?.name || "User";
  const initial = username[0].charAt(0).toUpperCase();

  return (
    <>
    <div className={SIDEBAR_CLASSES.desktop}>
     <div className='p-5 border-b border-purple-100 lg:block hidden'>
      <div className='flex items-center gap-3'>
        <div className='size-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md'>
          {initial}
        </div>

        <div>

      <h2 className='text-lg font-bold text-gray-800'> Hey, {username} 🐞</h2>
      <p className='text-sm text-purple-500 font-medium flex items-center gap-2'>
        <Sparkles className='size-4' /> Let's crush some tasks!😎
      </p>
       </div>
      </div>
     </div>

     <div className='p-4  space-y-6 overflow-y-auto flex-1'>
      <div className={PRODUCTIVITY_CARD.container}>
       <div className={PRODUCTIVITY_CARD.header}>
        <h3 className={PRODUCTIVITY_CARD.label}>PRODUCTIVITY</h3>
        <span className={PRODUCTIVITY_CARD.badge}>{productivity}%</span>

       </div>

      </div>

     </div>
    </div>

    </>
  )
}

export default Sidebar

// 3 : 00