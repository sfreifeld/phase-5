import { supabase } from "../supabaseClient"
import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';
import NavBarMain from "./NavBar";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useSession } from './SessionContext';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/background-org.jpg';

export default function ProfileOrg() {

  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableDescription, setEditableDescription] = useState("This is your nonprofit summary.  Here you can write what your organization does, your mission statement, what kind of work you're looking for, and anything else!");
  const [tags, setTags] = useState([])
  const { id } = useParams();
  const { session, user } = useSession();

  if (!user) {
    return <div>Loading...</div>;
  }

  // handles the logic for when a person drops a file for their profile picture
  const {getRootProps, getInputProps} = useDropzone({
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('file', file);

      supabase
        .storage
        .from('avatars')
        .upload(`${user.profile_id}`, file, {
          cacheControl: '3600',
          upsert: true
        })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error uploading file:', error);
          } else {
            console.log('File uploaded successfully:', data);
            // Optimistically update the profile picture URL in state
            const newProfilePicUrl = `https://iromcovydnlvukoirsvp.supabase.co/storage/v1/object/public/avatars/${user.profile_id}?${new Date().getTime()}`;
            setProfilePic(newProfilePicUrl);
          }
        });
    }, accept: 'image/*'
  });

  // toggles profile to edit mode
  const handleEditClick = () => {
    if (isEditing) {
        supabase
            .from('organizations')
            .update({
               description: editableDescription,
               tags: tags 
              })
            .eq('id', user.id)
            .single()
            .then(({ data: updateData, error: updateError }) => {
                if (updateError) {
                    console.error('Error updating org:', updateError);
                } else {
                        console.log('Organization updated successfully:', updateData);
                    }
            })
        }
        setIsEditing(!isEditing);
    }

//handles logic for changing profile elements while in edit mode
    const handleAddTag = (tag) => {
      if (tag && !tags.includes(tag)) {
        if (tags.length < 8) {
            setTags([...tags, tag]);
        } else {
            alert('You can only add up to 8 tags.');
        }
    }
}

  const handleRemoveTag = (tag) => {
      setTags(tags.filter(t => t !== tag))
  }
                              

  const handleDescriptionChange = (event) => {
      const newDescription = event.target.value;
      if (newDescription.length <= 500) {
          setEditableDescription(newDescription);
      } else {
          alert('Description must be less than 500 characters.');
      }
  };


  const handleDeleteProject = (projectId) => {
    if (window.confirm("Are you sure you want to mark this project as deleted? This action is irreversible.")) {
      supabase
        .from('projects')
        .update({ status: 'deleted' }) // Set the status to 'deleted'
        .eq('id', projectId)
        .then(({ data, error }) => {
          if (error) {
            console.error('Error marking project as deleted:', error);
          } else {
            setProjects(prevProjects => prevProjects.map(project => 
              project.id === projectId ? { ...project, status: 'deleted' } : project
            ));
            console.log('Project marked as deleted successfully');
          }
        });
    }
  }
    //gets list of projects for that org
  useEffect(() => {
    if (user) {
      supabase
        .from('projects')
        .select('*')
        .eq('org_id', user.id)
        .then(({ data: projectsData, error: projectsError }) => {
          if (projectsError) {
            console.error('Error fetching projects data:', projectsError);
            return;
          }
          setProjects(projectsData);
        });
    }
  }, [user]); 



  useEffect(() => {
    if (user) {
      if (user.description) {
        setEditableDescription(user.description);
      } else {
        setEditableDescription("This is your nonprofit description. You can write about what your organization does, your mission statement, and what kind of work you're looking for!");
      }
      if (user.tags) {
        setTags(user.tags)
      }
    }
  }, [user]);







    return (
      <div className="vh-100 vw-100" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <NavBarMain ></NavBarMain>
        <MDBContainer className="custom-container">
          <MDBRow className="justify-content-left">

            <MDBCol md="6" lg="6" xl="6" className="mt-5">
              <MDBCard className="custom-card" style={{ borderRadius: '15px' }}>
                <MDBCardBody className="p-4">
                  <div className="d-flex text-black">
                    <div className="flex-shrink-0">
                    {isEditing ? (
                        <div {...getRootProps()} style={{ border: '2px dashed #007bff', padding: '20px', cursor: 'pointer', width: '180px'}}>
                        <input {...getInputProps()} />
                        <p className='fst-italic' >Drag 'n' drop a profile image here, or click to select a file</p>
                        </div>
                    ) : (
                      <MDBCardImage
                        className="img-thumbnail"
                        style={{ width: '180px', borderRadius: '10px' }}
                        src={`https://iromcovydnlvukoirsvp.supabase.co/storage/v1/object/public/avatars/${user.profile_id}`}
                        alt='Generic placeholder image'
                        fluid /> )}
                    </div>
                    <div className="flex-grow-1 ms-3">
                        <MDBCardTitle>{user.org_name}</MDBCardTitle>
                        <MDBCardText><a href={user.website_url}>{user.website_url}</a></MDBCardText>
                      <div className="d-flex justify-content-start rounded-3 p-2 mb-2"
                        style={{ backgroundColor: '#efefef' }}>
                        <div>
                          <p className="small text-muted mb-1">Projects</p>
                          <p className="mb-0">{projects.length}</p>
                        </div>
                        <div className="px-3">
                          <p className="small text-muted mb-1">Hours</p>
                          <p className="mb-0">0</p>
                        </div>
                        <div>
                          <p className="small text-muted mb-1">Rating</p>
                          <p className="mb-0">5.0</p>
                        </div>
                      </div>
                      <div className="d-flex pt-1">
                        <MDBBtn outline className="me-1 flex-grow-1">Chat</MDBBtn>
                        <MDBBtn className="flex-grow-1">Follow</MDBBtn>
                      </div>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            {/* New card to the right */}
            <MDBCol md="6" lg="6" xl="6" className="mt-5">
              <MDBCard className="custom-card" style={{ borderRadius: '15px', height: '100%'}}>
                <MDBCardBody className="p-4">
                  <MDBRow>
                    <MDBCol md="6">
                      <MDBCardTitle>Previous Projects</MDBCardTitle>
                      <ul>
                        {projects && projects.length > 0 ? (
                            projects.filter(project => project.status !== 'open').map(project => (
                              <li key={project.id}>
                                <Link to={`/project/${project.id}`}>{project.title}</Link>
                            </li>
                            ))
                        ) : (
                            <div>No previous projects!</div>
                        )}
                      </ul>
                    </MDBCol>
                    <MDBCol md="6">
                      <MDBCardTitle>Current Projects</MDBCardTitle>
                      <ul>
                        {projects && projects.length > 0 ? (
                            projects.filter(project => project.status === 'open').map(project => (
                              <li key={project.id}>
                                <div className="d-flex flex-row">
                                  <Link to={`/project/${project.id}`}>{project.title}</Link>
                                  { isEditing ? <i className='bi bi-x-circle m-1' style={{ cursor: 'pointer' }} onClick={() => handleDeleteProject(project.id)}/> : '' }
                                </div>
                              </li>
                            ))
                        ) : (
                            <div>No current projects!</div>
                        )}
                      </ul>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
          <MDBRow className="justify-content-left">
            <MDBCol md="12" lg="12" xl="12" className="mt-5">
              <MDBCard className="custom-card" style={{ borderRadius: '15px' }}>
                <MDBCardBody className="p-4">
                  <div className="d-flex text-black">
                    <div className="flex-grow-1 ms-3">
                    {user.profile_id == id ? (
                    <MDBCardTitle>Organization Description <i className={`bi ${isEditing ? 'bi-check-lg' : 'bi-pencil'}`} onClick={handleEditClick}></i></MDBCardTitle>
                    ) : (<MDBCardTitle>Organization Description</MDBCardTitle>)}
                      { isEditing ? (
                        <div>
                            <textarea value={editableDescription} onChange={handleDescriptionChange} style={{ width: '100%', resize: 'none' }} />
                        </div>
                        ) : (
                            <MDBCardText dangerouslySetInnerHTML={{ __html: editableDescription.replace(/\n/g, '<br />') }}></MDBCardText>
                        )}
                      <MDBCardTitle className = "mt-4"> Tags </MDBCardTitle> 
                      {isEditing && (<p className="fw-light fst-italic">8 max</p>)}
                      <div className="d-flex justify-content-start rounded-3 p-2 mb-2">
                        {tags.map(tag => (
                          <div key={tag} className="me-2">
                          <p className="mb-0 btn">{tag}
                            {isEditing && <i className="bi bi-x-circle m-1" onClick={() => handleRemoveTag(tag)}></i>}
                          </p>
                        </div>
                      ))}
                      {isEditing && (
                            <div>
                                <input type="text" placeholder="Add tag" onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // Prevents the default form submission behavior
                                        handleAddTag(e.target.value);
                                        e.target.value = ''; // Optionally clear the input after adding
                                    }
                                }} />
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }
  
  
  
  
  
  
  
  
  