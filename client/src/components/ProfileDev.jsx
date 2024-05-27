import { supabase } from "../supabaseClient"
import React, { useEffect, useState } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';
import NavBarMain from "./NavBar";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useSession } from './SessionContext'
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/background-dev.jpg';

export default function ProfileDev() {
    
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editableBio, setEditableBio] = useState("Here is your bio.  You can write about your educational experience, your skills, and what you want to work on!");
    const [skills, setSkills] = useState([])
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const { id } = useParams();
    const { session, user } = useSession();
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true); // Loading state
    const [resumeExists, setResumeExists] = useState(false);

    useEffect(() => {
        const imageUrl = `https://iromcovydnlvukoirsvp.supabase.co/storage/v1/object/public/avatars/${user.profile_id}`;
        fetch(imageUrl)
            .then(response => {
                if (response.ok) {
                    setProfileImageUrl(imageUrl);
                } else {
                    setProfileImageUrl('https://christopherscottedwards.com/wp-content/uploads/2018/07/Generic-Profile.jpg'); // Default image URL
                }
            })
            .catch(() => {
                setProfileImageUrl('https://christopherscottedwards.com/wp-content/uploads/2018/07/Generic-Profile.jpg'); // Default image URL on error
            });
    }, [user.profile_id]); // Dependency array to re-run this effect when user.profile_id changes

    useEffect(() => {
        if (user) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [user]); // Dependency on user object from session context

    // handles the logic for when a person drops a file for their profile picture
    const {getRootProps, getInputProps} = useDropzone({
        onDrop: acceptedFiles => {
          const file = acceptedFiles[0];

          // Check if the file type starts with 'image/'
          if (!file.type.startsWith('image/')) {
            alert('Profile pictures must be either a .jpeg, .png, or .gif');
            return; // Stop the function if the file is not an image
          }

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
                const newProfilePicUrl = `https://iromcovydnlvukoirsvp.supabase.co/storage/v1/object/public/avatars/${user.profile_id}?${new Date().getTime()}`;
                setProfileImageUrl(newProfilePicUrl);
              }
            });
        },
        accept: 'image/*' // This line ensures only image files are accepted
      });


      const handleResumeUpload = async (file) => {
        const filePath = `resumes/${user.id}/1`;
        const { data, error } = await supabase
            .storage
            .from('resumes')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });
    
        if (error) {
            console.error('Error uploading resume:', error);
            return;
        }
    
    
        console.log('Resume uploaded successfully:', data);
    };

    const checkResumeExists = async () => {
        const filePath = `resumes/${user.id}/1`;
        const { data, error } = await supabase
            .storage
            .from('resumes')
            .list('', { limit: 1, prefix: filePath });

        if (data[0].id == null) {
            setResumeExists(false);
        } else {
            // Check if any file is actually returned in the list
            setResumeExists(data.length > 0);
        }
    };

    useEffect(() => {
        if (user) {
            checkResumeExists();
        }
    }, [user]);

    // deletes user application from db
    const handleDeleteApplication = (projectId, userId) => {
        if (window.confirm("Are you sure you want to withdraw your application?  This action cannot be undone.")) {
          supabase
            .from('applicants')
            .delete()
            .eq('project_id', projectId)
            .eq('user_id', userId)
            .then(({ error }) => {
              if (error) {
                console.error('Error deleting project:', error);
              } else {
                setApplications(prevApplications=> prevApplications.filter(application => application.id !== projectId));
                console.log('Application deleted successfully');
              }
            });
        }
      }
    
    // toggles profile to edit mode
    const handleEditClick = () => {
        if (isEditing) {
            supabase
                .from('users')
                .update({
                     bio: editableBio,
                     skills: skills 
                    })
                .eq('id', user.id)
                .single()
                .then(({ data: updateData, error: updateError }) => {
                    if (updateError) {
                        console.error('Error updating user:', updateError);
                    } else {
                            console.log('User updated successfully:', updateData);
                        }
                })
            }
            setIsEditing(!isEditing);
        }
                                
    //handles logic for changing profile elements while in edit mode
    const handleBioChange = (event) => {
        const newBio = event.target.value;
        if (newBio.length <= 500) {
            setEditableBio(newBio);
        } else {
            alert('Bio must be less than 500 characters.');
        }
    };

    const handleAddSkill = (skill) => {
        if (skill && !skills.includes(skill)) {
            if (skills.length < 8) {
                setSkills([...skills, skill]);
            } else {
                alert('You can only add up to 8 skills.');
            }
        }
    }

    const handleRemoveSkill = (skill) => {
        setSkills(skills.filter(s => s !== skill))
    }

    //gets list of projects for that user
    useEffect(() => {
        if (user) {
            supabase
                .from('projects')
                .select('*')
                .eq('user_id', user.id)
                .then(({ data: projectsData, error: projectsError }) => {
                    if (projectsError) {
                        console.error('Error fetching projects data:', projectsError);
                        return;
                    }
                    setProjects(projectsData);
                });
        }
    }, [user]);

    //gets list of open aplications for the user
    useEffect(() => {
        if (user) {
            supabase
                .from('applicants')
                .select('*')
                .eq('user_id', user.id)
                .then(({ data: applicationData, error: userError }) => {
                    if (userError) {
                        console.error('Error fetching user data:', userError);
                        return;
                    }
                    else {
                        if (applicationData.length > 0) {
                            const fetchedProjects = [];
                            applicationData.forEach((application, index, array) => {
                                supabase
                                    .from('projects')
                                    .select('*')
                                    .eq('id', application.project_id)
                                    .then(({ data: projectData, error: projectError }) => {
                                        if (projectError) {
                                            console.error('Error fetching project data:', projectError);
                                        } else {
                                            console.log('Project data:', projectData);
                                            fetchedProjects.push(...projectData);
                                            if (fetchedProjects.length === array.length) {
                                                setApplications(fetchedProjects);
                                            }
                                        }
                                    });
                            });
                        } else {
                            console.log('No applications found for this user.');
                        }
                    }
                });
        }
    }, [user]); 


    useEffect(() => {
        if (user) {
          if (user.bio) {
            setEditableBio(user.bio);
          } else {
            setEditableBio("Here is your bio. You can write about your educational experience, your skills, and what you want to work on!");
          }
          if (user.skills) {
            setSkills(user.skills)
          }
        }
      }, [user]);


    if (loading) {
        return <div>Loading...</div>; // Display loading message or spinner
    }

    return (
        <div className="vh-100 vw-100" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <NavBarMain></NavBarMain>
        <MDBContainer className="custom-container">
          <MDBRow className="justify-content-left d-flex align-items-stretch">
            <MDBCol md="6" lg="6" xl="6" className="mt-5">
              <MDBCard className="custom-card" style={{ borderRadius: '15px', height: '100%' }}>
                <MDBCardBody className="p-4">
                  <div className="d-flex text-black">
                    <div className="flex-shrink-0">
                    {isEditing ? (
                        <div {...getRootProps()} style={{ border: '2px dashed #007bff', padding: '20px', cursor: 'pointer', width: '180px'}}>
                        <input {...getInputProps({ accept: 'image/*' })} />
                        <p className='fst-italic' >Drag 'n' drop a profile image here, or click to select a file</p>
                        </div>
                    ) : (
                      <MDBCardImage
                        className="img-thumbnail"
                        style={{ width: '180px', borderRadius: '10px' }}
                        src={profileImageUrl}
                        alt='Profile image'
                        fluid /> )}
                    </div>
                    <div className="flex-grow-1 ms-3">

                      <MDBCardTitle>{user.full_name}</MDBCardTitle>
                      <MDBCardText>{user.username}</MDBCardText>

                      <div className="d-flex justify-content-start rounded-3 p-2 mb-2"
                        style={{ backgroundColor: '#efefef' }}>
                        <div>
                          <p className="small text-muted mb-1">Projects</p>
                          <p className="mb-0">{projects.filter(project => project.status === 'completed').length}</p>
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
            <MDBCol md="6" lg="6" xl="6" className="mt-5">
              <MDBCard className="custom-card" style={{ borderRadius: '15px', height: '100%'}}>
                <MDBCardBody className="p-4">
                  <MDBRow>
                    <MDBCol md="6">
                      <MDBCardTitle>Previous Projects</MDBCardTitle>
                      <ul>
                        {projects && projects.filter(project => project.status == 'closed') > 0 ? (
                            projects.filter(project => project.status == 'closed').map(project => (
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
                            projects.filter(project => project.status === 'in progress').map(project => (
                              <li key={project.id}>
                                <div className="d-flex flex-row">
                                  <Link to={`/project/${project.id}`}>{project.title}</Link>
                                </div>
                              </li>
                            ))
                        ) : (
                            <div>No current projects!</div>
                        )}
                      </ul>
                      <MDBCardTitle>Open Applications</MDBCardTitle>
                      <ul>
                      {applications && applications.length > 0 ? (
                            applications.filter(application => application.user_id == null).map(application => (
                              <li key={application.id}>
                                <div className="d-flex flex-row">
                                  <Link to={`/project/${application.id}`}>{application.title}</Link>
                                  { isEditing ? <i className='bi bi-x-circle m-1' style={{ cursor: 'pointer' }} onClick={() => handleDeleteApplication(application.id, user.id)}/> : '' }
                                </div>
                              </li>
                            ))
                        ) : (
                            <div>No current applications!</div>
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
                      <MDBCardTitle>Bio <i className={`bi ${isEditing ? 'bi-check-lg' : 'bi-pencil'}`} onClick={handleEditClick}></i></MDBCardTitle>
                    ) : <MDBCardTitle>Bio</MDBCardTitle>}
                      { isEditing ? (
                        <div>
                            <textarea value={editableBio} onChange={handleBioChange} style={{ width: '100%', resize: 'none' }} />
                        </div>
                        ) : (
                            <MDBCardText dangerouslySetInnerHTML={{ __html: editableBio.replace(/\n/g, '<br />') }}></MDBCardText>
                        )}
                      <MDBCardTitle className = "mt-4"> Resume </MDBCardTitle>
                      {resumeExists && !isEditing && (
                        <a href={`https://iromcovydnlvukoirsvp.supabase.co/storage/v1/object/public/resumes/resumes/${user.id}/1`} download="Resume.pdf" target='_blank'>Download Resume</a>
                      )}
                      {!resumeExists && !isEditing && (
                        <p>No resume on file</p>
                      )}
                      { isEditing ? (
                      <input type="file" onChange={(e) => handleResumeUpload(e.target.files[0])} />
                      ) : null}
                      <MDBCardTitle className = "mt-4"> Skills </MDBCardTitle>
                      {isEditing && (<p className="fw-light fst-italic">8 max</p>)}
                      <div className="d-flex justify-content-start rounded-3 p-2 mb-2">
                        {skills.map(skill => (
                          <div key={skill} className="me-2">
                            <p className="mb-0 btn" style={{ minWidth: '100px', textAlign: 'center' }}>{skill}
                              {isEditing && <i className="bi bi-x-circle m-1" onClick={() => handleRemoveSkill(skill)}></i>}
                            </p>
                          </div>
                        ))}
                        {isEditing && (
                            <div>
                                <input type="text" placeholder="Add skill" onKeyDown={e => {
                                    if (e.key === 'Enter' && skills.length < 8) {
                                        e.preventDefault(); // Prevents the default form submission behavior
                                        handleAddSkill(e.target.value);
                                        e.target.value = ''; // Optionally clear the input after adding
                                    }
                                    else if (e.key === 'Enter' && skills.length >= 8) {
                                        alert("Please only add up to 8 skills");
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
  

