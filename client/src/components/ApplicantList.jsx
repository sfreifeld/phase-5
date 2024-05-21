import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "../supabaseClient";
import confetti from 'canvas-confetti';
import { useSession } from './SessionContext';

function ApplicantList() {
    const { id } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const { session } = useSession();
    const [ status , setStatus] = useState('')
    const [ dev, setDev] = useState({})

    function capitalizeWords(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }

    function getStatusColor(status) {
        switch (status) {
            case 'open':
                return 'green';
            case 'in progress':
                return '#6495ED';
            case 'closed':
                return 'black';
            default:
                return 'black'; // Default color if status is undefined or not one of the expected values
        }
    }
    
    useEffect(() => {
        supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .then(({ data: projectData, error: projectError }) => {
                if (projectError) {
                    console.error('Error fetching project:', projectError);
                } else if (projectData[0].status) {
                    setStatus(projectData[0].status);
                    // Query the users table to find the full name of the user
                    supabase
                        .from('users')
                        .select('full_name')
                        .eq('id', projectData[0].user_id) // Assuming 'user_id' is the field linking projects to users
                        .then(({ data: userData, error: userError }) => {
                            if (userError) {
                                console.error('Error fetching user:', userError);
                            } else if (userData.length > 0) {
                                setDev(userData[0])
                            } else {
                                console.log('No user found for this project');
                            }
                        });
                }
            });
    }, []);

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
    }, [id]);

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
                        // Update the applicants table after successful project update
                        supabase
                            .from('applicants')
                            .update({ chosen: true }) // Assuming you want to update the status
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
            { status ? (
                <h3 className="mb-3" style={{ color: getStatusColor(status) }}>
                    Project Status: {capitalizeWords(status)}
                </h3>
            ) : (
                <h3>Loading...</h3>
            )}
            {status == 'open' && dev !== null ? (
                <>
                    <h3 className="mb-3">Are you ready to choose a developer for this project?</h3>
                    {applicants.map((applicant, index) => (
                        <button className="btn" style={{ cursor: 'pointer'}} key={index} onClick={() => handleChooseApplicant(applicant)}>
                            {applicant.full_name}
                        </button>
                    ))}
                </>
            ) : (
                <h3 className="mb-3">Software Developer: {dev.full_name}</h3>
            )}
        </div>
    );
}

export default ApplicantList;
