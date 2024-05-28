import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { supabase } from "../supabaseClient"
import { useSession } from './SessionContext';
import { useNavigate } from 'react-router-dom';



function RegistrationDev() {
  const [errors, setErrors] = useState({});
  const { session, user, updateSession, updateUser, userType, updateUserType } = useSession();
  const navigate = useNavigate();
  //takes automatically created user data from supabase and copies to custom table
  function transferProfileDataToUserTable(userId, username, fullName) {
    supabase
      .from('profiles')
      .select('*')
      .eq('uuid', userId)
      .then(({ data: profilesData, error: selectError }) => {
        if (selectError) {
          console.error('Error fetching profile:', selectError);
        } else if (profilesData.length > 0) {
          const profile = profilesData[0];
          supabase
            .from('users')
            .insert([
              { profile_id: profile.id, username: username, full_name: fullName}
            ])
            .select('*')
            .then(({ data: insertData, error: insertError }) => {
              if (insertError) {
                console.error('Error inserting data into users table:', insertError);
              } else {
                console.log(insertData)
                console.log(insertData[0])
                updateUserType('dev')
                updateUser(insertData[0])

              }
            });
        } else {
          console.log('No profile found for the user:', userId);
        }
      });
  };


  useEffect(() => {
    console.log('Updated user:', user);
    console.log('Updated usertype:', userType);
    // Ensure user and userType are defined and user has a profile_id
    if (user && userType && user.profile_id) {
      navigate('/');
    }
  }, [user, userType]);

  // Regex to check the username criteria
  const validateUsername = (username) => {
    const regex = /^[A-Za-z0-9]{6,20}$/;
    return regex.test(username);
  };

  // Regex to check the full name criteria
  const validateFullName = (fullName) => {
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(fullName);
  };
  
  //copies form data to db
  const handleSubmit = (event) => {
    event.preventDefault();
    const userId = session.user.id;
    const username = event.target.elements.formUsername.value;
    const fullName = event.target.elements.formFullName.value;

    setErrors({});

    if (!validateUsername(username)) {
      setErrors({ username: 'Username must be 6-20 characters and contain no special characters.' });
      return;
    }

    if (!validateFullName(fullName)) {
      setErrors({ fullName: 'Full name must only contain letters and spaces.' });
      return;
    }

    transferProfileDataToUserTable(userId, username, fullName);
  };



  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Enter username" 
          isInvalid={!!errors.username}
        />
        <Form.Control.Feedback type="invalid">
          {errors.username}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formFullName">
        <Form.Label>Full Name</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Enter full name" 
          isInvalid={!!errors.fullName}
        />
        <Form.Control.Feedback type="invalid">
          {errors.fullName}
        </Form.Control.Feedback>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default RegistrationDev;
