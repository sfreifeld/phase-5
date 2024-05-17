import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { supabase } from "../supabaseClient"
import { useSession } from './SessionContext';

function transferProfileDataToOrgTable(orgId, orgName, websiteUrl, sector) {
  supabase
    .from('profiles')
    .select('*')
    .eq('id', orgId)  // Filter to get only the newly signed up org's profile
    .then(({ data: profilesData, error: selectError }) => {
      if (selectError) {
        console.error('Error fetching profile:', selectError);
      } else if (profilesData.length > 0) {
        const profile = profilesData[0];  // Assuming there's only one profile per user
        supabase
          .from('organizations')
          .insert([
            { profile_id: profile.id, org_name: orgName, website_url: websiteUrl, sector: sector }
          ])
          .then(({ data: insertData, error: insertError }) => {
            if (insertError) {
              console.error('Error inserting data into users table:', insertError);
            } else {
              console.log('Data added successfully to users table:', insertData);
            }
          });
      } else {
        console.log('No profile found for the user:', orgId);
      }
    });
};

function RegistrationOrg() {
  const session = useSession();


  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission
    const orgId = session.user.id; // Assuming the user ID is stored in session.user.id
    const orgName= event.target.elements.formOrgName.value; // Get username from the form
    const websiteUrl = event.target.elements.formWebsiteUrl.value; // Get full name from the form
    const sector = event.target.elements.formSector.value;
    transferProfileDataToOrgTable(orgId, orgName, websiteUrl, sector);
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formOrgName" className="mb-3">
        <Form.Label>Nonprofit Name</Form.Label>
        <Form.Control type="name" placeholder="Enter nonprofit name" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formWebsiteUrl">
        <Form.Label>Website</Form.Label>
        <Form.Control placeholder="Enter website url" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formSector">
        <Form.Label>Sector</Form.Label>
        <Form.Control placeholder="Enter nonprofit sector" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default RegistrationOrg;