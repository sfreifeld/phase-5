import { supabase } from "../supabaseClient"
import NavBarMain from "./NavBar";
import React, { useState } from 'react';
import { useSession } from './SessionContext';
import backgroundImage from '../assets/background.jpg'

function CreateProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('');
  const { user } = useSession();
  const [message, setMessage] = useState('');
  const [tags, setTags] = useState('');

  const handleTagsChange = (e) => {
    const inputTags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setTags(e.target.value); // Always update the input to reflect user typing
    if (inputTags.length > 8) {
      setMessage('You can only add up to 8 tags.');
    } else {
      setMessage(''); // Clear message when the number of tags is acceptable
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !description || !projectType || tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '').length === 0) {
      setMessage("Please fill all fields and add at least one tag.");
      return;
    }

    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    const { data, error } = await supabase
      .from('projects')
      .insert([
        { title: title, description: description, project_length: projectType, tags: tagsArray, org_id: user.id, status: 'open' }
      ]);

    if (error) {
      console.error('Error inserting data: ', error);
    } else {
      console.log('Data inserted successfully: ', data);
      setMessage("Your project has successfully been created!");
      setTitle('');
      setDescription('');
      setProjectType('');
      setTags('');
    }
  };

  const canSubmit = title && description && projectType && tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '').length > 0;

  return (
    <div className="vh-100 vw-100" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <NavBarMain className="fixed-top "></NavBarMain>
      <div className='d-flex justify-content-center align-items-center m-5 p-5'>
        <form  className="custom-card m-3 p-5" onSubmit={handleSubmit}>
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
                  <option value="" disabled selected>Select project duration</option>
                  <option value="1-3 Weeks">1-3 Weeks</option>
                  <option value="4-6 Weeks">4-6 Weeks</option>
                  <option value="7+ Weeks">7+ Weeks</option>
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="inputProjectTags" className="form-label">Tags (separate with commas)</label>
                <input
                  type="text"
                  className="form-control"
                  id="inputProjectTags"
                  value={tags}
                  onChange={handleTagsChange}
                />
            </div>
            <button type="submit" className="btn btn-primary" disabled={!canSubmit}>Submit</button>
            <div className="text-success">{message}</div>
        </form>
      </div>
    </div>
  );
}

export default CreateProject;
