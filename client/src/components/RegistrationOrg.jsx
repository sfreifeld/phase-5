import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { supabase } from "../supabaseClient"
import { useSession } from './SessionContext';

function RegistrationOrg() {
  const [errors, setErrors] = useState({});
  const { session } = useSession();

  function transferProfileDataToOrgTable(orgId, orgName, websiteUrl, sector) {
    supabase
      .from('profiles')
      .select('*')
      .eq('id', orgId)
      .then(({ data: profilesData, error: selectError }) => {
        if (selectError) {
          console.error('Error fetching profile:', selectError);
        } else if (profilesData.length > 0) {
          const profile = profilesData[0]; 
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
  

  const validateOrgName = (orgName) => {
    return orgName.length > 2;
  };

  const validateSector = (sector) => {
    return /^[a-zA-Z]+$/.test(sector);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    const orgId = session.user.id;
    const orgName= event.target.elements.formOrgName.value;
    const websiteUrl = event.target.elements.formWebsiteUrl.value;
    const sector = event.target.elements.formSector.value;

    setErrors({});

    if (!validateOrgName(orgName)) {
      setErrors(errors => ({ ...errors, orgName: 'Nonprofit name must be greater than 2 characters.' }));
      return;
    }

    if (!validateSector(sector)) {
      setErrors(errors => ({ ...errors, sector: 'Sector must only contain letters.' }));
      return;
    }

    transferProfileDataToOrgTable(orgId, orgName, websiteUrl, sector);
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formOrgName" className="mb-3">
        <Form.Label>Nonprofit Name</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Enter nonprofit name" 
          isInvalid={!!errors.orgName}
        />
        <Form.Control.Feedback type="invalid">
          {errors.orgName}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formWebsiteUrl">
        <Form.Label>Website</Form.Label>
        <Form.Control placeholder="Enter website url" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formSector">
        <Form.Label>Sector</Form.Label>
        <Form.Control 
          placeholder="Enter nonprofit sector" 
          isInvalid={!!errors.sector}
        />
        <Form.Control.Feedback type="invalid">
          {errors.sector}
        </Form.Control.Feedback>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default RegistrationOrg;
