import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { supabase } from "../supabaseClient"
import { useSession } from './SessionContext';

function NavBarMain() {
    const { session, user, userType } = useSession();

    if (!user) {
        return <div>Loading...</div>; // Show a loading indicator or similar feedback
    }



    return (
        <Navbar bg="primary" data-bs-theme="dark">
            <Container>
            <Navbar.Brand href="#home">Phase 5</Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                {user && (
                    <Nav.Link href={`/profile/${user.profile_id}`}>Profile</Nav.Link>
                )}
                { userType == 'org' && user ?
                (<Nav.Link href="/createproject" className='text-white'>Create Project +</Nav.Link>) :
                (<Nav.Link href={`/notifications/${user.profile_id}`} className='text-white'>Notifications</Nav.Link>)
                }
                <Nav.Link href="/about">About</Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={() => supabase.auth.signOut()}>Sign out</Button>
            </Container>
        </Navbar>
    )
}

export default NavBarMain