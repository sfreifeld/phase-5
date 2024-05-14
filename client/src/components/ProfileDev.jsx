import { supabase } from "../supabaseClient"
import React, { useEffect, useState } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';
import NavBarMain from "./NavBar";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useParams } from 'react-router-dom';

export default function ProfileDev({ session }) {
    const [userData, setUserData] = useState(null)
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editableBio, setEditableBio] = useState("Here is your bio.  You can write about your educational experience, your skills, and what you want to work on!");
    const [skills, setSkills] = useState([])
    const { id } = useParams();

    const handleEditClick = () => {
        if (isEditing) {
            supabase
                .from('users')
                .update({ bio: editableBio })
                .eq('profile_id', session.user.id)
                .single()
                .then(({ data: updateData, error: updateError }) => {
                    if (updateError) {
                        console.error('Error updating profile:', updateError);
                    } else {
                            console.log('Bio updated successfully:', updateData);
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
        if (userData && userData.bio) {
            setEditableBio(userData.bio);
        } else {
            setEditableBio("Here is your bio. You can write about your educational experience, your skills, and what you want to work on!");
        }

        if (userData && userData.skills) {
            setSkills(userData.skills)
        }

    }, [userData]);


    return (
      <div className="vh-100 vw-100" style={{ backgroundColor: '#9de2ff' }}>
        <NavBarMain session={session}></NavBarMain>
        <MDBContainer>
          <MDBRow className="justify-content-left d-flex align-items-stretch">
            <MDBCol md="6" lg="6" xl="6" className="mt-5">
              <MDBCard style={{ borderRadius: '15px', height: '100%' }}>
                <MDBCardBody className="p-4">
                  <div className="d-flex text-black">
                    <div className="flex-shrink-0">
                      <MDBCardImage
                        style={{ width: '180px', borderRadius: '10px' }}
                        src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp'
                        alt='Generic placeholder image'
                        fluid />
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
              <MDBCard style={{ borderRadius: '15px', height: '100%' }}>
                <MDBCardBody className="p-4">
                  <MDBCardTitle>Previous Projects</MDBCardTitle>
                  <ul>
                    {projects && projects.length > 0 ? (
                        projects.map(project => (
                            <li key={project.id}>{project.title}</li>
                        ))
                    ) : (
                        <div>No projects done yet!</div>
                    )}
                  </ul>
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
  
