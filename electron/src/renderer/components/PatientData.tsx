import { useEffect } from 'react';
import { Container, Row, Col } from "reactstrap";
import { ethers } from 'ethers'

/** Contract and Address */
import PatientsData from '../../abis/PatientsData.json' // contract ABI
import config from '../../config.json' // contract addresses
import { ALCHEMY_API_KEY, PRIVATE_KEY, HARDHAT_ACCOUNT01_PRIVATE_KEY } from '../../../work/sensitive'

/** Stylesheet */
import './PatientData.css'


interface patientProps {
  sharedCPF: string;
  setSharedCPF: (value: string) => void;
}


const Patient: React.FunctionComponent<patientProps> = ({ sharedCPF, setSharedCPF }) => {
  // Setup provider and network - Alchemy
  /* const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", ALCHEMY_API_KEY);
  const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider); */
  
  // Setup provider and signer - Localhost
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
  const signer = new ethers.Wallet(HARDHAT_ACCOUNT01_PRIVATE_KEY, provider);
  // Javascript "version" of the smart contract
  const patientsData = new ethers.Contract(config[31337].patientsData.address, PatientsData, signer)


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
      const loadData = await patientsData.getPatient(patientNumericCPF)
      let firstNameInput = (document.getElementById("patientFirstName") as HTMLInputElement)
      firstNameInput.value = loadData.firstName
      let lastNameInput = (document.getElementById("patientLastName") as HTMLInputElement)
      lastNameInput.value = loadData.lastName
    }
  }


  const cpfFormatting = (CPF: string) => {
    let formattedCPF = CPF
    // Add a period after the third and sixth digits
    formattedCPF = formattedCPF.replace(/(\d{3})(\d)/, "$1.$2");
    formattedCPF = formattedCPF.replace(/(\d{3})(\d)/, "$1.$2");
    // Add a dash before the last two digits
    formattedCPF = formattedCPF.replace(/(\d{2})$/, "-$1");
    
    return formattedCPF
  }


  return (
    <>
      <Container className='patient__wrapper'>
        <h4 className='ms-3'>Patient Info</h4>
        <form className='patient__form'>
          <Row>
            <Col xs={3}>
              <label className='patient__label' htmlFor="patientCPF">CPF Number</label>
            </Col>
            <Col>
              <input type="text" id="patientCPF" name="patientCPF" onChange={(event: any) => getPatientInfo(event)} placeholder='000.000.000-00' required /><br/>
            </Col>
          </Row>
          <Row>
            <Col xs={3}>
              <label className='patient__label' htmlFor="patientFirstName">First Name</label>
            </Col>
            <Col>
              <input className='wide__label' type="text" id="patientFirstName" name="patientFirstName" required /><br/>
            </Col>
          </Row>
          <Row className='mb-2'>
            <Col xs={3}>
              <label className='patient__label' htmlFor="patientLastName">Last Name</label>
            </Col>
            <Col>
              <input className='wide__label' type="text" id="patientLastName" name="patientLastName" required /><br/>
            </Col>
          </Row>
          <Row className='align-items-end'>
            <Col xs={5}>
              <button className='load__data me-2' onClick={(event: any) => getPatientInfo(event)}>load blockchain data</button>
            </Col>
            <Col className='d-flex justify-content-end'>
              <button className='me-2' type="submit" onClick={(event: any) => updatePatientInfo(event)}>Save</button>
            </Col>
          </Row>
        </form>
      </Container>
    </>
  )
}


export default Patient