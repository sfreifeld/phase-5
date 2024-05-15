import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';


function ProjectCard({project, session}) {
    const navigate = useNavigate(); 
    const tags = project.tags

    const handleDetailsClick = () => {
        navigate(`/project/${project.id}`, { state: { project: project, session: session } }) // Navigate to /project when button is clicked
    };

    return (
        <Card className='m-5'>
          <Card.Body>
            <Card.Title>{project.title}</Card.Title>
            <div className='d-flex flex-row'>
                <img style={{ width: '15%' }} src='https://cdn.britannica.com/92/100692-050-5B69B59B/Mallard.jpg'/>
                <div className='m-3'>
                    <Card.Text>Nonprofit Name</Card.Text>
                    <Card.Text>{project.description}</Card.Text>
                    <div className='d-flex flex-row' >
                        { 
                        tags && tags.map(tag => (
                            <Card.Text className='me-2' key={tag}> {tag} </Card.Text>
                            ))
                        }
                    </div>
                    <Button variant="primary" onClick={handleDetailsClick}>Get more details</Button>
                </div>
            </div>
          </Card.Body>
        </Card>
      );
    }

export default ProjectCard;