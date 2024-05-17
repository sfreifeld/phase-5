import React, { useState } from 'react';
import RegistrationDev from '../components/RegistrationDev';
import RegistrationOrg from '../components/RegistrationOrg';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { supabase } from "../supabaseClient"


function Registration() {
  const [activeForm, setActiveForm] = useState(null);

  return (
    <div className="container m-5 p-5">
    <button onClick={() => supabase.auth.signOut()}>Sign out</button>
      <h3>Do you want to sign up as a developer or a nonprofit?</h3>
      <p className='fst-italic'>Once your account is created, the account type cannot be changed later. Please ensure you select the option that best represents your role.</p>
      <div className='m-2'>
        <button 
          className={`btn ${activeForm === 'developer' ? 'btn-primary' : 'btn-outline-primary'} m-2`} 
          onClick={() => setActiveForm('developer')}
        >
          Developer
        </button>
        <button 
          className={`btn ${activeForm === 'nonprofit' ? 'btn-primary' : 'btn-outline-primary'} m-2`} 
          onClick={() => setActiveForm('nonprofit')}
        >
          Nonprofit
        </button>
      </div>
      {activeForm === 'developer' && <RegistrationDev />}
      {activeForm === 'nonprofit' && <RegistrationOrg/>}
    </div>
  );
}

export default Registration;
