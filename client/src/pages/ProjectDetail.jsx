import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import NavBarMain from '../components/NavBar';
import { useLocation } from 'react-router-dom';


function ProjectDetail() {

    const location = useLocation();

    const { session } = location.state || {};
    console.log(session)


    return (
        <div className='vh-100 vw-100'>
        <NavBarMain className="fixed-top" session={session}/>
        <div>HEYYYYY</div>
        </div>
      );
    }

export default ProjectDetail;