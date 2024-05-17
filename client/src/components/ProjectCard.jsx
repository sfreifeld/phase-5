import { useNavigate } from 'react-router-dom';


function ProjectCard({project}) {
    const navigate = useNavigate(); 
    const tags = project.tags

    const handleDetailsClick = () => {
        navigate(`/project/${project.id}`, { state: { project: project} }) // Navigate to /project when button is clicked
    };

    return (
        <div className='m-5 custom-card'>
            <p className='card-title'>{project.title}</p>
            <div className='d-flex flex-row'>
                <img style={{ width: '15%' }} src='https://cdn.britannica.com/92/100692-050-5B69B59B/Mallard.jpg'/>
                <div className='m-3'>
                    <p>Nonprofit Name</p>
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