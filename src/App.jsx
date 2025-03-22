import React, { useState, useEffect } from 'react'
import {getRandomUser } from '../components/api'
import UserCard from '../components/userCard';
import './App.css'

function App() {

  const [userData, setUserData] = useState(null);

  useEffect(()=>{
    getRandomUser().then((user)=> setUserData(user.results[0]));
  }, [])

  const refersh = () =>{
    getRandomUser().then((user)=> setUserData(user.results[0]));
  }

  return (
    <div className='App'> 
      <UserCard data = {userData}/>
      <button onClick={refersh}>Refresh User</button>
    </div>
  );
}

export default App;
