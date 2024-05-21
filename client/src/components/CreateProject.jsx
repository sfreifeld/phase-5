import { supabase } from "../supabaseClient"
import NavBarMain from "./NavBar";
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useSession } from './SessionContext';

function CreateProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('');
  const { session, user, userType } = useSession();
  const [message, setMessage] = useState('')


  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submit behavior

    const { data, error } = await supabase
      .from('projects') // Replace 'projects' with your actual table name
      .insert([
        { title: title, description: description, project_length: projectType, org_id: user.id, status: 'open' }
      ]);

    if (error) {
      console.error('Error inserting data: ', error);
    } else {
      console.log('Data inserted successfully: ', data);
      setMessage("Your project has successfully been created!")
      // Optionally reset form or redirect user
    }
  };

  return (
    <div className="vh-100 vw-100">
      <NavBarMain className="fixed-top "></NavBarMain>
      <div className='d-flex justify-content-center align-items-center m-5 p-5 border'> {/* Adjust width as needed */}
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="inputProjectTitle" className="form-label">Project Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="inputProjectTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                
            </div>
            <div className="mb-3">
                <label htmlFor="inputProjectDescription" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="inputProjectDescription"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </div>
            <div className="mb-3">
                <label htmlFor="inputProjectType" className="form-label">How long do you estimate that this project will take?</label>
                <select
                  className="form-control"
                  id="inputProjectType"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                >
                    <option value="1-3 Weeks">1-3 Weeks</option>
                    <option value="4-6 Weeks">4-6 Weeks</option>
                    <option value="7+ Weeks">7+ Weeks</option>
                </select>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
            <div className="text-success">{message}</div>
        </form>
      </div>
    </div>
  );
}

export default CreateProject;