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
      <section>
        <Container fluid>
          <Row className='mt-3 mb-3'>
            <Col>
              Patient Section
            </Col>
            <Col className='ms-5'>
              <WagmiConfig client={wagmiClient}>
                <Row className="align-items-end">
                  <Col className="d-flex justify-content-end mt-3">
                    <Web3Button />
                  </Col>
                </Row>
                <Row className="align-items-end">
                  <Col className="d-flex justify-content-end mt-3">
                    Employee Section
                  </Col>
                </Row>
              </WagmiConfig>
              <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
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
