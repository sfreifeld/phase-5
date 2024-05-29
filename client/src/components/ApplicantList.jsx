import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "../supabaseClient";
import confetti from 'canvas-confetti';
import { useSession } from './SessionContext';

function ApplicantList() {
    const { id } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [ status , setStatus] = useState('')
    const [ dev, setDev] = useState({})
    const { userType, user } = useSession();
    const [ project, setProject ] = useState(null)



    //Helper function to change status value to correct capitalization
    function capitalizeWords(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }
    
    //Helper function to get right color for text, based on project status
    function getStatusColor(status) {
        switch (status) {
            case 'open':
                return 'green';
            case 'in progress':
                return '#6495ED';
            case 'closed':
                return 'black';
            default:
                return 'black';
        }
    }

    // New function to handle project completion
    const handleCompleteProject = () => {
        if (window.confirm('Are you sure you want to mark this project as complete?')) {
            // Trigger confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            // Update the project status in your database
            supabase
                .from('projects')
                .update({ status: 'closed' }) // Set status to 'closed'
                .eq('id', id) // Ensure you update the correct project using the id
                .then(({ data, error }) => {
                    if (error) {
                        console.error('Error updating project status:', error);
                    } else {
                        console.log('Project status updated successfully:', data);
                        setStatus('closed'); // Update local state to reflect the change
                    }
                });
        }
    };

    //Gets status of project and which dev owns it, if it has been assigned
    useEffect(() => {
        supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .then(({ data: projectData, error: projectError }) => {
                if (projectError) {
                    console.log(id)
                    console.error('Error fetching project:', projectError);
                } else if (projectData[0].status) {
                    setProject(projectData[0])
                    setStatus(projectData[0].status);
                    console.log(projectData[0])
                    if (projectData[0].user_id) { // Check if user_id is not null
                        supabase
                            .from('users')
                            .select('full_name')
                            .eq('id', projectData[0].user_id)
                            .then(({ data: userData, error: userError }) => {
                                if (userError) {
                                    console.error('Error fetching user:', userError);
                                } else if (userData.length > 0) {
                                    console.log(userData[0])
                                    setDev(userData[0])
                                } else {
                                    console.log('No user found for this project');
                                }
                            });
                    } else {
                        console.log('No user assigned to this project yet');
                        setDev({}); // Reset or clear the dev state
                    }
                }
            });
    }, [id, status]);


    //Gets list of devs who have applied to project
    useEffect(() => {
        supabase
            .from('applicants')
            .select('user_id')
            .eq('project_id', id)
            .then(({ data: applicantData, error: applicantError }) => {
                if (applicantError) {
                    console.error('Error fetching applicants:', applicantError);
                } else {
                    const userIds = applicantData.map(applicant => applicant.user_id);
                    supabase
                        .from('users')
                        .select('*')
                        .in('id', userIds)
                        .then(({ data: userData, error: userError }) => {
                            if (userError) {
                                console.error('Error fetching user details:', userError);
                            } else {
                                setApplicants(userData);
                            }
                        });
                }
            });
    }, []);


    //function to handle logic when an org chooses an applicant for a project
    const handleChooseApplicant = (applicant) => {
        if (window.confirm(`Are you sure you want to choose ${applicant.full_name} for this project?`)) {
            setSelectedApplicant(applicant);
            supabase
                .from('projects')
                .update({ user_id: applicant.id, status: 'in progress' })
                .eq('id', id)
                .then(({ data, error }) => {
                    if (error) {
                        console.error('Error updating project:', error);
                    } else {
                        console.log('Project updated successfully:', data);
                        confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 }
                        });
                        supabase
                            .from('applicants')
                            .update({ chosen: true })
                            .eq('user_id', applicant.id)
                            .eq('project_id', id)
                            .then(({ data: updateData, error: updateError }) => {
                                if (updateError) {
                                    console.error('Error updating applicant:', updateError);
                                } else {
                                    console.log('Applicant updated successfully:', updateData);
                                }
                            });
                    }
                });
        }
    };

    return (
        <div className='m-5'>
            

                <div className='d-flex'>
                <h3 className="mb-3 me-3" style={{ color: getStatusColor(status) }}>
                    Project Status: {capitalizeWords(status)}
                </h3>
                {status == 'in progress' && userType == 'org' && project.org_id == user.id ? (
                    <button className='complete-btn' onClick={handleCompleteProject}>Project Complete</button>
                ) : null}
                </div>
        
            {status == 'open' && Object.keys(applicants).length > 0 && userType == 'org' && (
                <>
                    <h3 className="mb-3">Are you ready to choose a developer for this project?</h3>
                    {applicants.map((applicant, index) => (
                        <button className="btn" style={{ cursor: 'pointer'}} key={index} onClick={() => handleChooseApplicant(applicant)}>
                            {applicant.full_name}
                        </button>
                    ))}
                </>
            )}
            {(status == 'in progress' || status == 'closed') && (
            <h3 className="mb-3">Software Developer: {dev.full_name}</h3>
            )}
        </div>
    );
}

export default ApplicantList;
