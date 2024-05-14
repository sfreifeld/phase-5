import { supabase } from "../supabaseClient"
import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';
import NavBarMain from "./NavBar";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ProfileOrg({ session }) {

  const [orgData, setOrgData] = useState(null)
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableDescription, setEditableDescription] = useState("This is your nonprofit summary.  Here you can write what your organization does, your mission statement, what kind of work you're looking for, and anything else!");
  const [tags, setTags] = useState([])
  const { id } = useParams();


  const handleEditClick = () => {
    if (isEditing) {
        supabase
            .from('organizations')
            .update({ description: editableDescription })
            .eq('profile_id', session.user.id)
            .single()
            .then(({ data: updateData, error: updateError }) => {
                if (updateError) {
                    console.error('Error updating description:', updateError);
                } else {
                        console.log('Description updated successfully:', updateData);
                    }
            })
        }
        setIsEditing(!isEditing);
    }


    const handleAddTag = (tag) => {
      if (tag && !tags.includes(tag)) {
          setTags([...tags, tag])
      }
  }

  const handleRemoveTag = (tag) => {
      setTags(tags.filter(t => t !== tag))
  }
                              

  const handleDescriptionChange = (event) => {
      setEditableDescription(event.target.value);
  };

  useEffect(() => {
    if (session) {
        supabase
            .from('organizations')
            .select('*')
            .eq('profile_id', session.user.id)
            .maybeSingle()
            .then(({ data: orgData, error: orgError }) => {
                if (orgError) {
                    console.error('Error fetching organization data:', orgError);
                    return;
                }
                setOrgData(orgData);
                if (orgData) {
                    return supabase
                        .from('projects')
                        .select('*')
                        .eq('org_id', orgData.id);
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
    if (orgData && orgData.description) {
        setEditableDescription(orgData.description);
    } else {
        setEditableDescription("This is your nonprofit description. You can write about your what your organization does, your mission statement, and what kind of work you're looking for!");
    }

  }, [orgData]);







    return (
      <div className="vh-100 vw-100" style={{ backgroundColor: '#e6ffe6' }}>
        <NavBarMain session={session}></NavBarMain>
        <MDBContainer>
          <MDBRow className="justify-content-left">

            <MDBCol md="6" lg="6" xl="6" className="mt-5">
              <MDBCard style={{ borderRadius: '15px' }}>
                <MDBCardBody className="p-4">
                  <div className="d-flex text-black">
                    <div className="flex-shrink-0">
                      <MDBCardImage
                        style={{ width: '180px', borderRadius: '10px' }}
                        src='https://marketplace.canva.com/EAFKWVyYMMw/1/0/1600w/canva-green-simple-international-day-of-charity-instagram-post-EVxZ49m2iZc.jpg'
                        alt='Generic placeholder image'
                        fluid />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      { orgData && (
                      <>
                        <MDBCardTitle>{orgData.org_name}</MDBCardTitle>
                        <MDBCardText>{orgData.website_url}</MDBCardText>
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
            {/* New card to the right */}
            <MDBCol md="6" lg="6" xl="6" className="mt-5">
              <MDBCard style={{ borderRadius: '15px' }}>
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
                      <div className="d-flex justify-content-start rounded-3 p-2 mb-2">
                        {tags.map(tag => (
                          <div key={tag} className="me-2">
                          <p className="mb-0 bg-primary rounded-pill p-2">{tag}
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
  