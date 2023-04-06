import { Container, Row, Col } from "reactstrap";
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';


function MedicalRecordsPage() {
  return (
    <>
      <section className='hero__section'>
        <Container fluid>
          <Row className='align-items-center'>
            <Col lg="6" md="6">
              <div className="hero__content">
                <div className="hero__header">
                  Medical Records
                  <div className='hero__sub__header'>
                    powered by Fábio Benjovengo and the Ethereum Network
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MedicalRecordsPage />} />
      </Routes>
    </Router>
  );
}
