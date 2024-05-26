import { Container, Row, Col } from 'react-bootstrap';
import heroVideo from '../assets/hero.mp4'
import { useNavigate } from 'react-router-dom';


function HomeHero() {
    const navigate = useNavigate();
    const handleLearnMoreClick = () => {
        navigate('/about'); // Navigate to the about page
    };

    return (
        <Container fluid style={{ position: 'relative', overflow: 'hidden', padding: 0, maxWidth: '100vw', minHeight: '40vh', marginTop: '-1px'}}>
            <div style={{
                position: 'absolute',
                width: '100vw',
                height: '100%',
                left: '0',
                top: '0',
                zIndex: '2',
            }}>
                <video autoPlay loop muted style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.80,
                    zIndex: '5'
                }}>
                    <source src={heroVideo} type="video/mp4" />
                </video>
            </div>
            <Row className="mt-5 align-items-center justify-content-center" style={{ height: '100%', position: 'relative', zIndex: '3' }}>
                <Col xs={12} md={8} lg={6} className="text-center">
                    <h1 className="display-4">Phase 5 Project</h1>
                    <p className="lead">Browse projects proposed by nonprofits to gain experience and code for a cause!</p>
                    <button className="btn" onClick={handleLearnMoreClick}>Learn More</button>
                </Col>
            </Row>
        </Container>
    )
}

export default HomeHero

