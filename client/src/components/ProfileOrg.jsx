import { supabase } from "../supabaseClient"
import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn } from 'mdb-react-ui-kit';
import NavBarMain from "./NavBar";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

export default function ProfileOrg({ session }) {

  const [orgData, setOrgData] = useState(null)
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableDescription, setEditableDescription] = useState("This is your nonprofit summary.  Here you can write what your organization does, your mission statement, what kind of work you're looking for, and anything else!");
  const [tags, setTags] = useState([])
  const { id } = useParams();

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









  const handleEditClick = () => {
    if (isEditing) {
        supabase
            .from('organizations')
            .update({
               description: editableDescription,
               tags: tags 
              })
            .eq('profile_id', session.user.id)
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
    if (orgData) {
      if (orgData.description) {
        setEditableDescription(orgData.description);
      } else {
        setEditableDescription("This is your nonprofit description. You can write about what your organization does, your mission statement, and what kind of work you're looking for!");
      }
      if (orgData.tags) {
        setTags(orgData.tags)
      }
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
              <MDBCard style={{ borderRadius: '15px', height: '100%'}}>
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
  
  