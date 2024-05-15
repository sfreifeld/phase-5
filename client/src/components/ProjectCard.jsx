import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


function ProjectCard() {

    return (
        <Card className='m-5'>
          <Card.Body>
            <Card.Title>Projec Title</Card.Title>
            <Card.Text>
              Nonprofit Name
            </Card.Text>
            <Card.Text>
              Here is a 1 - 2 sentence description about the project and what is expected.
            </Card.Text>
            <div className='d-flex flex-row justify-content-around' >
                <Card.Text>Web Development</Card.Text>
                <Card.Text>Javascript</Card.Text>
                <Card.Text>Docker</Card.Text>
            </div>
            <Button variant="primary">Get more details</Button>
          </Card.Body>
        </Card>
      );
    }

export default ProjectCard;