import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; 

const Header = () => {

  const handleSignOut =()=>{
    signOut(auth)
    .then(()=>alert('Signed out successfully'))
    .catch(error=>{
     console.log(error)
     alert(error.message)
    })
  }

  return (
   <div className="flex-container">

      <div className="logo">
      Countdown Board 
      </div>
      <div className="navItem">
        <ul>
          <li><a href="#">Home</a></li>
          <li><button className="LogOut" onClick={handleSignOut} >LogOut</button></li>
        </ul>
    </div>
   </div>
  )
}

export default Header