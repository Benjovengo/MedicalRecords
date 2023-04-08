import { useEffect } from 'react';
import { Container, Row, Col } from "reactstrap";
import { ethers } from 'ethers'

/** Contract and Address */
import AuthorizedAccounts from '../../abis/AuthorizedAccounts.json' // contract ABI
import config from '../../config.json' // contracts addresses
import { ALCHEMY_API_KEY, PRIVATE_KEY, HARDHAT_ACCOUNT01_PRIVATE_KEY } from '../../../work/sensitive';

/** Stylesheet */
import './EmployeeHeader.css'


/**
 * Interface for the Employee component
 * 
 * @param address the address of the connected MetaMask account
 */
interface employeeProps {
  address: string;
}


/**
 * Component to display the employee personal information.
 * 
 * @param address string containing the address of the connected MetaMask account
 * @returns HTML component
 */
const EmployeeHeader: React.FunctionComponent<employeeProps> = ({ address }) => {
  // Get today's date
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate());
  
  
  // Setup provider and network - Alchemy
  /* const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", ALCHEMY_API_KEY);
  const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider); */
  
  // Setup provider and signer - Localhost
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const signer = new ethers.Wallet(HARDHAT_ACCOUNT01_PRIVATE_KEY, provider);
  // Javascript "version" of the smart contract
  const authorizedAccounts = new ethers.Contract(config[31337].authorizedAccounts.address, AuthorizedAccounts, signer)
  
  
  
  return (
    <>
      <Container fluid className='employee__container'>
        <form>
          <Row>
            <Col xs={4}>
              <Row>
                <Col>
                  <input type="text" id="employeeFirstName" name="employeeFirstName" required />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label className='patient__label' htmlFor="employeeFirstName">First Name</label>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col>
                  <input type="text" id="employeeLastName" name="employeeLastName" required />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label className='patient__label' htmlFor="employeeLastName">Last Name</label>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col>
                  <input type="text" id="employeeCPF" name="employeeCPF" placeholder='000.000.000-00' required />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label className='patient__label' htmlFor="employeeCPF">CPF Number</label>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Row>
                <Col>
                  <input type="text" id="employeeAddress" name="employeeAddress" required />
                </Col>
              </Row>
              <Row>
                <Col>
                  <label className='patient__label' htmlFor="employeeAddress">MetaMask Address</label>
                </Col>
              </Row>
            </Col>
            <Col>
              <input className='checkbox_style ms-3' type="checkbox" id="authorizedCheckbox" name="authorizedCheckbox" defaultValue="true"/>
              <label className='patient__label ms-1' htmlFor="authorizedCheckbox">Is authorized?</label>
            </Col>
            <Col className='text-end'>
              <button className='header__add__button'>Add/Update Employee</button>
            </Col>
          </Row>
        </form>
      </Container>
    </>
  )
}


export default EmployeeHeader