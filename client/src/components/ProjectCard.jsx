import { useNavigate } from 'react-router-dom';
import { supabase } from "../supabaseClient"
import { useEffect, useState } from 'react';


function ProjectCard({project}) {
    const navigate = useNavigate(); 
    const tags = project.tags
    const [org, setOrg] = useState('')

    // Function to determine the card border class based on project status
    const getCardBorderClass = () => {
        switch (project.status) {
            case 'open':
                return 'open';
            case 'in progress':
                return 'in-progress';
            case 'closed':
                return 'closed';
            default:
                return '';
        }
    };

    function capitalizeWords(str) {
        return str.replace(/\b\w/g, char => char.toUpperCase());
    }

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
    }, [project.org_id]); // Added project.org_id as a dependency

    //handles navigation to project details page
    const handleDetailsClick = () => {
        navigate(`/project/${project.id}`, { state: { project: project} })
    };

    return (
        <div className={`m-5 custom-card ${getCardBorderClass()}`}>
            <div className="row">
                <div className="col-12 col-md-4">
                    <img className='img-fluid' src={org ? `https://iromcovydnlvukoirsvp.supabase.co/storage/v1/object/public/avatars/${org.profile_id}` : ''}/>
                </div>
                <div className="col-12 col-md-8">
                    <div className="d-flex justify-content-between">
                        <p className='card-title'>{capitalizeWords(project.status)}</p>
                        <p className='card-date text-right'>{new Date(project.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <p className='card-title'>{project.title}</p>
                    <p>{org && org.org_name}</p>
                    <p>{project.description}</p>
                    <div className='d-flex flex-wrap'>
                        {tags && tags.map(tag => (
                            <p className='card-tags me-3 mb-3' key={tag}> {tag} </p>
                        ))}
                    </div>
                    <button className='btn' onClick={handleDetailsClick}>Get more details</button>
                </div>
            </div>
        </div>
      );
    }

export default ProjectCard;
