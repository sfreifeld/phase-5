import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"

import { Container, Navbar, Nav, Form, FormControl, Button, Row, Col } from 'react-bootstrap';
import heroVideo from '../assets/hero.mp4'


function HomeHero() {

    return (
        <Container fluid style={{ position: 'relative', overflow: 'hidden', padding: 0, maxWidth: '100vw', minHeight: '40vh', marginTop: '-1px'}}>
            <video autoPlay loop muted style={{
                position: 'absolute',
                width: '100vw',
                left: '50%',
                top: '50%',
                height: '100%',
                objectFit: 'cover',
                transform: 'translate(-50%, -50%)',
                zIndex: '-1',
                opacity: 0.80
            }}>
                <source src={heroVideo} type="video/mp4" />
            </video>
            <Row className="mt-5 align-items-center justify-content-center" style={{ height: '100%' }}>
                <Col xs={12} md={8} lg={6} className="text-center">
                    <h1 className="display-4">Phase 5 Project</h1>
                    <p className="lead">Browse projects proposed by nonprofits to gain experience and code for a cause!</p>
                    <button className="btn">Learn More</button>
                </Col>
            </Row>
        </Container>
    )
}

export default HomeHero
