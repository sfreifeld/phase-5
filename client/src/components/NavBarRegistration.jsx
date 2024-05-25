import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { supabase } from "../supabaseClient"
import { useSession } from './SessionContext';

function NavBarRegistration() {




    return (
        <Navbar bg="primary" data-bs-theme="dark">
            <Container>
            <Navbar.Brand href="#home">Phase 5</Navbar.Brand>
            <Button variant="outline-light" onClick={() => supabase.auth.signOut()}>Sign out</Button>
            </Container>
        </Navbar>
    )
}

export default NavBarRegistration