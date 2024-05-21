import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import NavBarMain from '../components/NavBar';
import { useParams } from 'react-router-dom'
import { useSession } from '../components/SessionContext';
import { supabase } from "../supabaseClient"
import React, { useState, useEffect } from 'react';
import ApplicantList from '../components/ApplicantList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faClock, faKeyboard   } from '@fortawesome/free-solid-svg-icons';



function ProjectDetail() {
    const {session, user, userType} = useSession();
    const { id } = useParams()
    const [isApplied, setIsApplied] = useState(false);
    const [project, setProject] = useState(undefined)
    const [org, setOrg] = useState(undefined)


    useEffect(() => {
        // Check if the user has already applied to the project
        const checkApplicationStatus = async () => {
            const { data, error } = await supabase
                .from('applicants')
                .select('*')
                .eq('user_id', user.id)
                .eq('project_id', id)
                .maybeSingle();

            if (error) {
                console.error('Error fetching application status:', error.message);
            } else if (data) {
                setIsApplied(true);
            }
        };

        if (user && id) {
            checkApplicationStatus();
        }
    }, [user, id]);


    useEffect(() => {
        const fetchProjectAndOrg = async () => {
            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .maybeSingle();

            if (projectError) {
                console.error('Error fetching project:', projectError.message);
                return;
            }

            if (projectData) {
                setProject(projectData);
                const { data: orgData, error: orgError } = await supabase
                    .from('organizations')
                    .select('*')
                    .eq('id', projectData.org_id)
                    .maybeSingle();

                if (orgError) {
                    console.error('Error fetching organization:', orgError.message);
                } else if (orgData) {
                    setOrg(orgData);
                }
            }
        };

        if (id) {
            fetchProjectAndOrg();
        }
    }, [id]);

    function handleUserApplication() {
        if (!isApplied) {
            supabase
                .from('applicants')
                .insert({
                    project_id: id,
                    user_id: user.id
                })
                .then(response => {
                    if (response.error) {
                        console.error('Error:', response.error.message);
                    } else {
                        console.log('Success:', response.data);
                        setIsApplied(true); // Set isApplied to true after successful application
                    }
                });
        }
    }
        


    return (
        <div className='vw-100 background'>
            <NavBarMain className="fixed-top"/>
            <ApplicantList/>
            {project && org ? (
                <Card className='m-5 p-5 custom-card'>
                    <Card.Title>{project.title}</Card.Title>
                    <div className='d-flex flex-row'>
                        <div className="col-7">
                            <p>{org.org_name}</p>
                            <img className="img-fluid" style={{ maxWidth: '50%' }} src={`https://iromcovydnlvukoirsvp.supabase.co/storage/v1/object/public/avatars/${org.profile_id}`}/>
                        </div>
                        <div className="col-5">
                            <p className='card-title mb-4'>Quick Facts</p>
                            <p className='mb-4'><FontAwesomeIcon icon={faCalendarDays} style={{color: "#6495ed",}} className="me-2"/>Posted on {new Date(project.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className='mb-4'><FontAwesomeIcon icon={faClock} style={{color: "#6495ed",}} className="me-2" />{project.project_length}</p>
                            <p className='mb-4'><FontAwesomeIcon icon={faKeyboard} style={{color: "#6495ed",}} className="me-2"/>{org.website_url}</p>
                            {userType == 'dev' ? (<button className='btn' onClick={handleUserApplication} disabled={isApplied}> Apply</button>) : ('')}
                        </div>
                    </div>
                    <br></br>
                    <p className='card-title'>Project Overview</p>
                    <p>{project.description}</p>
                    <p className='card-title'>Nonprofit Overview</p>
                    <p>{org.description}</p>
                    <p className='card-title'> Skills </p>
                    <div className='d-flex flex-row'>
                     {project.tags.map((tag, index) => (
                            <p key={index} className="btn m-2">{tag}</p>
                        ))}
                    </div>
                </Card>
            ) : (
                <div>Loading project details...</div>
            )}
            <div className="p-5"></div>
            
        </div>
      );
    }

export default ProjectDetail;

