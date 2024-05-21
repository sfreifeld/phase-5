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
                        })
                    }
                });
        }
    };

    return (
        <div className='m-5'>
            <h3 className="mb-3">Are you ready to choose a developer for this project?</h3>
                {applicants.map((applicant, index) => (
                    <button className="btn" style={{ cursor: 'pointer'}} key={index} onClick={() => handleChooseApplicant(applicant)}>
                        {applicant.full_name}
                    </button>
                ))}
            {selectedApplicant ? <p></p> : <p></p>}
        </div>
    );
}

export default ApplicantList;