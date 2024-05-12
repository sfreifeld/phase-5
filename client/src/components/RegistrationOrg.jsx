import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function RegistrationOrg() {
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Nonprofit Name</Form.Label>
        <Form.Control type="name" placeholder="Enter nonprofit name" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formWebsite">
        <Form.Label>Website</Form.Label>
        <Form.Control placeholder="Enter website url" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formWebsite">
        <Form.Label>Sector</Form.Label>
        <Form.Control placeholder="Enter nonprofit sector" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default RegistrationOrg;