import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { supabase } from "../supabaseClient"
import { useSession } from './SessionContext';



function RegistrationDev() {
  const [errors, setErrors] = useState({});
  const { session, user } = useSession();

  function transferProfileDataToUserTable(userId, username, fullName) {
    supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)  // Filter to get only the newly signed up user's profile
      .then(({ data: profilesData, error: selectError }) => {
        if (selectError) {
          console.error('Error fetching profile:', selectError);
        } else if (profilesData.length > 0) {
          const profile = profilesData[0];  // Assuming there's only one profile per user
          supabase
            .from('users')
            .insert([
              { profile_id: profile.id, username: username, full_name: fullName}
            ])
            .then(({ data: insertData, error: insertError }) => {
              if (insertError) {
                console.error('Error inserting data into users table:', insertError);
              } else {
                console.log('Data added successfully to users table:', insertData);
              }
            });
        } else {
          console.log('No profile found for the user:', userId);
        }
      });
  };

  const validateUsername = (username) => {
    const regex = /^[A-Za-z0-9]{6,20}$/; // Regex to check the username criteria
    return regex.test(username);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission
    const userId = session.user.id; // Assuming the user ID is stored in session.user.id
    const username = event.target.elements.formUsername.value; // Get username from the form
    const fullName = event.target.elements.formFullName.value; // Get full name from the form

    setErrors({});

    if (!validateUsername(username)) {
      setErrors({ username: 'Username must be 6-20 characters and contain no special characters.' });
      return; // Stop the form submission if validation fails
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
          isInvalid={!!errors.username}  // Add this line
        />
        <Form.Control.Feedback type="invalid">
          {errors.username}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formFullName">
        <Form.Label>Full Name</Form.Label>
        <Form.Control type="text" placeholder="Enter full name" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default RegistrationDev;
