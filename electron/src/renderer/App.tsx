import { useState } from 'react';
import { Container, Row, Col } from "reactstrap";
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal, Web3Button } from '@web3modal/react'
import { configureChains, createClient, WagmiConfig, useAccount } from 'wagmi'
import { goerli } from 'wagmi/chains' // change to mainnet for production

// Style sheet
import './App.css';
// Sensitive information
import { projectId } from "../../work/sensitive";

// Components
import AddClinicalData from './components/AddClinicalData';
import EmployeeHeader from './components/EmployeeHeader';
import Patient from "./components/PatientData";
import RetrieveData from './components/RetrieveData';


/**
 * Web3Modal
 * MetaMask interaction
 */
const chains = [goerli]
const { provider } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider
})
const ethereumClient = new EthereumClient(wagmiClient, chains)


const MedicalRecordsPage: React.FunctionComponent = () => {
  const { address } = useAccount()
  const [sharedCPF, setSharedCPF] = useState('000.000.000-00')

  return (
    <>
      <section className='hero__section'>
        <Container fluid>
          <Row className='header__section'>
            <Col xs={9}>
              <EmployeeHeader address={String(address)} />
            </Col>
            <Col className='ms-5'>
              <WagmiConfig client={wagmiClient}>
                <Row className="align-items-end">
                  <Col className="d-flex justify-content-end mt-4 mb-1">
                    <Web3Button />
                  </Col>
                </Row>
              </WagmiConfig>
              <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
            </Col>
          </Row>
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
      <section>
        <Container fluid>
          <Row className='mt-3 mb-3'>
            <Col>
            </Col>
            <Col className='patient__container ps-5 ms-5'>
              <Patient sharedCPF={sharedCPF} setSharedCPF={setSharedCPF} />
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container fluid>
          <Row className='addData__container mb-3'>
            <Col xs={6}>
              <AddClinicalData address={String(address)} sharedCPF={sharedCPF}/>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <RetrieveData sharedCPF={sharedCPF} />
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
