import { useNavigate } from 'react-router-dom';
import { supabase } from "../supabaseClient"
import { useEffect, useState } from 'react';


function ProjectCard({project}) {
    const navigate = useNavigate(); 
    const tags = project.tags
    const [org, setOrg] = useState('')

    // gets org data for each project
    useEffect(() => {
        const fetchOrgName = async () => {
            if (!project.org_id) return;

            const { data, error } = await supabase
                .from('organizations')
                .select('*') 
                .eq('id', project.org_id)
                .maybeSingle();
            if (error) {
                console.error('Error fetching organization', error);
                return;
            }
            if (data) {
                setOrg(data);
            }
        };

        fetchOrgName();
    }, []);

    //handles navigation to project details page
    const handleDetailsClick = () => {
        navigate(`/project/${project.id}`, { state: { project: project} })
    };

    return (
        <div className='m-5 custom-card'>
            <p className='card-title'>{project.title}</p>
            <div className='d-flex flex-row'>
                <img style={{ width: '15%' }} src={org ? `https://iromcovydnlvukoirsvp.supabase.co/storage/v1/object/public/avatars/${org.profile_id}` : ''}/>
                <div className='m-3'>
                    <p>{org && org.org_name}</p>
                    <p>{project.description}</p>
                    <div className='d-flex flex-row mb-3' >
                        { 
                        tags && tags.map(tag => (
                            <p className=' card-tags' key={tag}> {tag} </p>
                            ))
                        }
                    </div>
                    <button className='btn' onClick={handleDetailsClick}>Get more details</button>
                </div>
            </div>
        </div>
      );
    }

export default ProjectCard;