import { supabase } from "../supabaseClient"
import NavBarMain from "./NavBar";
import ProjectCard from "./ProjectCard"
import React, { useState, useEffect } from 'react';
import SearchBar from "./SearchBar";
import { Button } from 'react-bootstrap';
import HomeHero from "./HomeHero";
import { useLocation } from 'react-router-dom'; // Import useLocation

function CreateProject() {
  const location = useLocation(); // Use the useLocation hook to access location object
  const { session } = location.state || {}; // Destructure session from location.state, defaulting to an empty object if undefined

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submit behavior

    const { data, error } = await supabase
      .from('projects') // Replace 'projects' with your actual table name
      .insert([
        { title: title, description: description, project_type: projectType }
      ]);

    if (error) {
      console.error('Error inserting data: ', error);
    } else {
      console.log('Data inserted successfully: ', data);
      // Optionally reset form or redirect user
    }
  };

  return (
    <div className="vh-100 vw-100">
      <NavBarMain className="fixed-top " session={session}></NavBarMain>
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
                    <option value="type1">1-3 Weeks</option>
                    <option value="type2">4-6 Weeks</option>
                    <option value="type3">7+ Weeks</option>
                </select>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default CreateProject;