import { useEffect } from 'react';
import { Container, Row, Col } from "reactstrap";
import { ethers } from 'ethers'

/** Contract and Address */
import PatientsData from '../../abis/PatientsData.json' // contract ABI
import config from '../../config.json' // contract addresses
import { ALCHEMY_API_KEY, PRIVATE_KEY, HARDHAT_ACCOUNT01_PRIVATE_KEY } from '../../../work/sensitive'

// Scripts
import cpfFormatting from 'renderer/scripts/cpfFormatting';

/** Stylesheet */
import './PatientData.css'


/**
 * Interface for the Patient component
 * 
 * @param sharedCPF the CPF of the patient to be shared with other components
 * @param setSharedCPF the useState function to set a new shared CPF
 */
interface patientProps {
  sharedCPF: string;
  setSharedCPF: (value: string) => void;
}


/**
 * The main function of the Patient component
 * 
 * @param sharedCPF the CPF of the patient to be shared with other components
 * @param setSharedCPF the useState function to set a new shared CPF
 * @returns HTML component to display the personal information of a patient
 */
const Patient: React.FunctionComponent<patientProps> = ({ sharedCPF, setSharedCPF }) => {
  // Setup provider and network - Alchemy
  /* const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", ALCHEMY_API_KEY);
  const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider); */
  
  // Setup provider and signer - Localhost
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const signer = new ethers.Wallet(HARDHAT_ACCOUNT01_PRIVATE_KEY, provider);
  // Javascript "version" of the smart contract
  const patientsData = new ethers.Contract(config[31337].patientsData.address, PatientsData, signer)


  /**
   * Add or update the patient personal information on the blockchain based on the HTML inputs
   * 
   * @param event mouse click event
   */
  const updatePatientInfo = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Get today's date as Unix epoch
    const currentDateUnixEpoch = Math.floor(new Date().getTime() / 1000);
    // Form data
    const firstName = (document.getElementById("patientFirstName") as HTMLInputElement).value
    const lastName = (document.getElementById("patientLastName") as HTMLInputElement).value
    const patientCPF = (document.getElementById("patientCPF") as HTMLInputElement).value
    // Remove all non-numeric characters from the input value
    const patientNumericCPF = patientCPF.replace(/\D/g, '');
    // Add data to the blockchain
    await patientsData.addPatient(firstName, lastName, patientNumericCPF, currentDateUnixEpoch)
    // change to busy or loading
    alert('Adding Patient')
  }


  /**
   * Retrieve the patient personal information from the blockchain and update the respective HTML components
   * 
   * @param event 
   */
  const getPatientInfo = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Form data
    const patientCPF = (document.getElementById("patientCPF") as HTMLInputElement).value
    // Remove all non-numeric characters from the input value
    const patientNumericCPF = patientCPF.replace(/\D/g, '');
    // format CPF
    let CPFInput = (document.getElementById("patientCPF") as HTMLInputElement)
    CPFInput.value = cpfFormatting(patientNumericCPF)
    setSharedCPF(patientNumericCPF)
    if (patientNumericCPF.length == 11) {
      // Retrieve the patient personal information from the blockchain
      const loadData = await patientsData.getPatient(patientNumericCPF)
      // Update the respective HTML components
      let firstNameInput = (document.getElementById("patientFirstName") as HTMLInputElement)
      firstNameInput.value = loadData.firstName
      let lastNameInput = (document.getElementById("patientLastName") as HTMLInputElement)
      lastNameInput.value = loadData.lastName
    }
  }


  return (
    <>
      <Container className='patient__wrapper'>
        <h4 className='ms-3'>Patient Info</h4>
        <form className='patient__form'>
          <Row className='patient__field'>
            <Col>
              <Row>
                <Col>
                  <label className='patient__label' htmlFor="patientCPF">CPF Number</label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <input type="text" id="patientCPF" name="patientCPF" onChange={(event: any) => getPatientInfo(event)} placeholder='000.000.000-00' required />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className='patient__field'>
            <Col>
              <Row>
                <Col>
                  <label className='patient__label' htmlFor="patientFirstName">First Name</label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <input className='wide__label' type="text" id="patientFirstName" name="patientFirstName" required />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className='patient__field'>
            <Col>
              <Row>
                <Col>
                  <label className='patient__label' htmlFor="patientLastName">Last Name</label>
                </Col>
              </Row>
              <Row>
                <Col>
                  <input className='wide__label' type="text" id="patientLastName" name="patientLastName" required />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className='align-items-end mt-3 mb-5'>
            <Col className='d-flex justify-content-end'>
              <button className='me-2' type="submit" onClick={(event: any) => updatePatientInfo(event)}>Save Info</button>
            </Col>
          </Row>
        </form>
        <Row>
          <Col>
            <p className='patient__info__paragraph ms-3 me-3 mt-2'>To reload the info from the blockchain after a manual edit, click reload blockchain data button below. This will replace the information in the first and last name fields.</p>
          </Col>
        </Row>
        <Row className='align-items-end'>
          <Col className='d-flex justify-content-end'>
            <button className='load__data' onClick={(event: any) => getPatientInfo(event)}>reload blockchain data</button>
          </Col>
        </Row>
      </Container>
    </>
  )
}


export default Patient