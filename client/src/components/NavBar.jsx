import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { supabase } from "../supabaseClient"
import { useSession } from './SessionContext';

function NavBarMain() {
    const { session, user, userType } = useSession();


    return (
        <Navbar bg="primary" data-bs-theme="dark">
            <Container>
            <Navbar.Brand href="#home">Phase 5</Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                {session && session.user && (
                    <Nav.Link href={`/profile/${session.user.id}`}>Profile</Nav.Link>
                )}
                { userType == 'org' ?
                (<Nav.Link href="/createproject" className='text-white'>Create Project +</Nav.Link>) :
                (<Nav.Link href={`/notifications/${session.user.id}`} className='text-white'>Notifications</Nav.Link>)
                }
            </Nav>
            <Button variant="outline-light" onClick={() => supabase.auth.signOut()}>Sign out</Button>
            </Container>
        </Navbar>
    )
}

export default NavBarMain