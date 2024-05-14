import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"

function NavBarMain( { session }) {

    return (
        <Navbar bg="primary" data-bs-theme="dark">
            <Container>
            <Navbar.Brand href="#home">Phase 5</Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href={`/profile/${session.user.id}`}>Profile</Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={() => supabase.auth.signOut()}>Sign out</Button>
            </Container>
        </Navbar>
    )
}

export default NavBarMain