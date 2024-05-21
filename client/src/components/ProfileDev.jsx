import { supabase } from "../supabaseClient"
import React, { useEffect, useState } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';
import NavBarMain from "./NavBar";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useSession } from './SessionContext'
import { Link } from 'react-router-dom';

export default function ProfileDev() {
    
    const [userData, setUserData] = useState(null)
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editableBio, setEditableBio] = useState("Here is your bio.  You can write about your educational experience, your skills, and what you want to work on!");
    const [skills, setSkills] = useState([])
    const [profilepic, setProfilePic] = useState('https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp')
    const { id } = useParams();
    const { session, user } = useSession();
    const [applications, setApplications] = useState([])


    const {getRootProps, getInputProps} = useDropzone({
        onDrop: acceptedFiles => {
          const file = acceptedFiles[0];
          const formData = new FormData();
          formData.append('file', file);
    
          supabase
            .storage
            .from('avatars')
            .upload(`${session.user.id}`, file, {
              cacheControl: '3600',
              upsert: true
            })
            .then(({ data, error }) => {
              if (error) {
                console.error('Error uploading file:', error);
              } else {
                console.log('File uploaded successfully:', data);
                // Optimistically update the profile picture URL in state
                const newProfilePicUrl = `https://iromcovydnlvukoirsvp.supabase.co/storage/v1/object/public/avatars/${session.user.id}?${new Date().getTime()}`;
                setProfilePic(newProfilePicUrl);
              }
            });
        }
      });



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
    

    const handleEditClick = () => {
        if (isEditing) {
            supabase
                .from('users')
                .update({
                     bio: editableBio,
                     skills: skills 
                    })
                .eq('profile_id', session.user.id)
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
                                

    const handleBioChange = (event) => {
        setEditableBio(event.target.value);
    };

    const handleAddSkill = (skill) => {
        if (skill && !skills.includes(skill)) {
            setSkills([...skills, skill])
        }
    }

    const handleRemoveSkill = (skill) => {
        setSkills(skills.filter(s => s !== skill))
    }

    useEffect(() => {
        if (session && session.user) {
            supabase
                .from('users')
                .select('*')
                .eq('profile_id', session.user.id)
                .maybeSingle()
                .then(({ data: userData, error: userError }) => {
                    if (userError) {
                        console.error('Error fetching user data:', userError);
                        return;
                    }

                    setUserData(userData);
                    if (userData) {
                        return supabase
                            .from('projects')
                            .select('*')
                            .eq('user_id', userData.id);
                    }
                })
                .then(({ data: projectsData, error: projectsError }) => {
                    if (projectsError) {
                        console.error('Error fetching projects data:', projectsError);
                        return;
                    }
                    setProjects(projectsData);
                });
        }
    }, [session]);


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
                                            fetchedProjects.push(...projectData); // Assuming projectData is an array
                                            // Check if all requests have been processed
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
    }, [user]); // Depend on user to re-run this effect when user changes


    useEffect(() => {
        if (userData) {
          if (userData.bio) {
            setEditableBio(userData.bio);
          } else {
            setEditableBio("Here is your bio. You can write about your educational experience, your skills, and what you want to work on!");
          }
          if (userData.skills) {
            setSkills(userData.skills)
          }
        }
      }, [userData]);





    


    return (
      <div className="vh-100 vw-100" style={{ backgroundColor: '#9de2ff' }}>
        <NavBarMain></NavBarMain>
        <MDBContainer>
          <MDBRow className="justify-content-left d-flex align-items-stretch">
            <MDBCol md="6" lg="6" xl="6" className="mt-5">
              <MDBCard style={{ borderRadius: '15px', height: '100%' }}>
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
                        style={{ width: '180px', borderRadius: '10px' }}
                        src={`https://iromcovydnlvukoirsvp.supabase.co/storage/v1/object/public/avatars/${session.user.id}`}
                        alt='Generic placeholder image'
                        fluid /> )}
                    </div>
                    <div className="flex-grow-1 ms-3">
                    { userData && (
                        <>
                      <MDBCardTitle>{userData.full_name}</MDBCardTitle>
                      <MDBCardText>{userData.username}</MDBCardText>
                      </>
                    )}
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
            <MDBCol md="6" lg="6" xl="6" className="mt-5">
              <MDBCard style={{ borderRadius: '15px', height: '100%'}}>
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
              <MDBCard style={{ borderRadius: '15px' }}>
                <MDBCardBody className="p-4">
                  <div className="d-flex text-black">
                    <div className="flex-grow-1 ms-3">
                    {session.user.id === id ? (
                      <MDBCardTitle>Bio <i className={`bi ${isEditing ? 'bi-check-lg' : 'bi-pencil'}`} onClick={handleEditClick}></i></MDBCardTitle>
                    ) : <MDBCardTitle>Bio</MDBCardTitle>}
                      { isEditing ? (
                        <div>
                            <textarea value={editableBio} onChange={handleBioChange} style={{ width: '100%', resize: 'none' }} />
                        </div>
                        ) : (
                            <MDBCardText dangerouslySetInnerHTML={{ __html: editableBio.replace(/\n/g, '<br />') }}></MDBCardText>
                        )}
                      <MDBCardTitle className = "mt-4"> Skills </MDBCardTitle>
                      <div className="d-flex justify-content-start rounded-3 p-2 mb-2">
                        {skills.map(skill => (
                          <div key={skill} className="me-2">
                            <p className="mb-0 bg-primary rounded-pill p-2">{skill}
                              {isEditing && <i className="bi bi-x-circle m-1" onClick={() => handleRemoveSkill(skill)}></i>}
                            </p>
                          </div>
                        ))}
                        {isEditing && (
                            <div>
                                <input type="text" placeholder="Add skill" onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // Prevents the default form submission behavior
                                        handleAddSkill(e.target.value);
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
  
