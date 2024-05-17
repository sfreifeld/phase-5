import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import NavBarMain from '../components/NavBar';



function ProjectDetail() {


    return (
        <div className='vh-100 vw-100'>
            <NavBarMain className="fixed-top"/>
            <Card className='m-5'>
                <Card.Title>Project Title</Card.Title>
                <div className='d-flex flex-row'>
                <div className="col-7">
                        <p>Nonprofit Name</p>
                        <img style={{ width: '100%' }} src='https://cdn.britannica.com/92/100692-050-5B69B59B/Mallard.jpg'/>
                    </div>
                    <div className="col-5">
                        <p>Quick Facts</p>
                        <p>Project posted  on 03/11/24</p>
                        <p>3-4 weeks</p>
                        <p>www.organization.com</p>
                    </div>
                </div>
                <br></br>
                <p>Project Overview</p>
                <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                <p>Nonprofit Overview</p>
                <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                <p> Skills </p>
                <div className='d-flex flex-row'>
                    <p className="mb-0 bg-primary rounded-pill p-2 me-2"> Web Development</p>
                    <p className="mb-0 bg-primary rounded-pill p-2 me-2"> Javascript</p>
                    <p className="mb-0 bg-primary rounded-pill p-2 me-2"> Python </p>
                    <p className="mb-0 bg-primary rounded-pill p-2 me-2"> Flask </p>
                </div>
            
            </Card>
            
        </div>
      );
    }

export default ProjectDetail;
