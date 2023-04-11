import React, { useEffect, useState } from 'react';
import { Row, Col } from "reactstrap";
import { ethers } from 'ethers'

/** Components */
import ProcedureCard from './ProceduresCard';
import VaccineCard from './VaccinesCard';

/** Contract and Address */
import ClinicalData from '../../abis/ClinicalData.json' // contract ABI
import PatientsData from '../../abis/PatientsData.json' // contract ABI
import config from '../../config.json' // contracts addresses
import { HARDHAT_ACCOUNT01_PRIVATE_KEY } from '../../../work/sensitive';

/** Scripts */
import cpfFormatting from 'renderer/scripts/cpfFormatting';
import { decryptText } from 'renderer/scripts/cryptography';

/** Stylesheet */
import "./RetrieveData.css"



// Setup provider and network - Alchemy
/* const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", ALCHEMY_API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider); */

// Setup provider and signer - Localhost
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
const signer = new ethers.Wallet(HARDHAT_ACCOUNT01_PRIVATE_KEY, provider);

const clinicalData = new ethers.Contract(config[31337].clinicalData.address, ClinicalData, signer)
const patientsData = new ethers.Contract(config[31337].patientsData.address, PatientsData, signer)


/**
 * Interface for the hooks for the procedures
 */
interface RetrievedProceduresData {
  clinicHospitalName: string;
  procedureInfo: string;
  date: number;
  doctorAddress: number;
  authorizedUser: string;
}


/**
 * Interface for the hooks for the vaccines
 */
interface RetrievedVaccinesData {
  name: string;
  lab: string;
  lot: string;
  dose: number;
  totalDoses: number;
  date: number;
  authorizedUser: string;
}


/**
 * Interface to receive the CPF from the PatientData section
 */
interface patientProps {
  sharedCPF: string;
}


/**
 * Retrieve clinical data main function.
 * 
 * @param sharedCPF the string containing the patient's CPF defined in the PatientData section
 * @returns the React.js component to display the clinical data
 */
const RetrieveData: React.FunctionComponent<patientProps> = ({ sharedCPF }) => {
  /**
   * Hooks
   */
  // Hooks for the data of the procedures retrieved from the blockchain
  const [proceduresData, setProceduresData] = useState<RetrievedProceduresData[]>([])
  const [encryptedProceduresData, setEncryptedProceduresData] = useState<RetrievedProceduresData[]>([])
  // Hooks for the data of the vaccines retrieved from the blockchain
  const [vaccinesData, setVaccinesData] = useState<RetrievedVaccinesData[]>([])
  const [encryptedVaccinesData, setEncryptedVaccinesData] = useState<RetrievedVaccinesData[]>([])


  /**
   * Execute functions when there is a new CPF for a new patient
   */
  useEffect(() => {
    if (sharedCPF !== '000.000.000-00'){
      getPatientInfo(sharedCPF)
      loadAllProcedures(sharedCPF)
      loadAllVaccines(sharedCPF)
    }
  }, [sharedCPF]);


  /**
   * Retrieve the personal information about the patient
   * 
   * @param _sharedCPF the CPF of the patient
   */
  const getPatientInfo = async (_sharedCPF: string) => {
    if (_sharedCPF.length == 11) {
      const loadData = await patientsData.getPatient(_sharedCPF)
      const fullName = loadData.firstName + ' ' + loadData.lastName
      document.getElementById('patientInfo')!.innerHTML = `${fullName}`
      document.getElementById('patientCPFNumber')!.innerHTML = `${cpfFormatting(_sharedCPF)}`
    }
  }


  /**
   * Retrieve the procedures from the Blockchain for a particular patient.
   * 
   * @param _sharedCPF the CPF of the patient
   */
  const loadAllProcedures = async (_sharedCPF: string) => {
    // Load Unencrypted procedures
    if (_sharedCPF.length === 11) {
      const proceduresQuantity = await clinicalData.getNumberOfProcedures(_sharedCPF)
      let proceduresArray = []
      for (let index = 0; index < proceduresQuantity[0]; index++) { //index 0: unencrypted procedures
        proceduresArray[index] = await clinicalData.getProcedure(_sharedCPF, index);
      }
      setProceduresData(proceduresArray)
    }
    
    // Load and decrypt procedures
    if (_sharedCPF.length === 11) {
      const proceduresQuantity = await clinicalData.getNumberOfProcedures(_sharedCPF)
      let encryptedProceduresArray = []
      for (let index = 0; index < proceduresQuantity[1]; index++) { //index 0: unencrypted procedures
        const loadEncryptedData = await clinicalData.getEncryptedProcedure(_sharedCPF, index)
        const decryptedJSON = String(decryptText(loadEncryptedData))
        encryptedProceduresArray[index] = JSON.parse(decryptedJSON)
      }
      setEncryptedProceduresData(encryptedProceduresArray)
    }
  }


  /**
   * Retrieve the vaccines from the Blockchain for a particular patient.
   * 
   * @param _sharedCPF the CPF of the patient
   */
  const loadAllVaccines = async (_sharedCPF: string) => {
    // Load Unencrypted procedures
    if (_sharedCPF.length === 11) {
      const vaccinesQuantity = await clinicalData.getNumberOfVaccines(_sharedCPF)
      let vaccinesArray = []
      for (let index = 0; index < vaccinesQuantity[0]; index++) { //index 0: unencrypted procedures
        vaccinesArray[index] = await clinicalData.getVaccine(_sharedCPF, index);
      }
      setVaccinesData(vaccinesArray)
    }
    
    // Load and decrypt vaccines
    if (_sharedCPF.length === 11) {
      const vaccinesQuantity = await clinicalData.getNumberOfVaccines(_sharedCPF)
      let encryptedVaccinesArray = []
      for (let index = 0; index < vaccinesQuantity[1]; index++) { //index 0: unencrypted procedures
        const loadEncryptedData = await clinicalData.getEncryptedVaccine(_sharedCPF, index)
        const decryptedJSON = String(decryptText(loadEncryptedData))
        encryptedVaccinesArray[index] = JSON.parse(decryptedJSON)
      }
      setEncryptedVaccinesData(encryptedVaccinesArray)
    }
  }


  return (
    <>
      <div className="retrieve__data__wrapper">
        <Row className='data__wrapper align-items-center mt-3'>
          <Col className='d-flex justify-content-center'>
            <h4 className='mb-3 ms-3 mt-2'>Blockchain Records</h4>
          </Col>
        </Row>
        <Row className='data__wrapper'>
          <Col>
            <Row className="justify-content-center">
              <Col className='text-center'>
                <div className='patient__records'>
                  <Row>
                    <Col>
                      <Row>
                        <Col className='col-auto'>
                          <b>Patient:</b> <span id='patientInfo'></span>
                        </Col>
                        <Col>
                          <b>CPF:</b> <span id='patientCPFNumber'></span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className='ms-1'>
                    <Col>
                      <b>Number of procedures:</b> {proceduresData.length + encryptedProceduresData.length}
                    </Col>
                  </Row>
                  <Row className='ms-1'>
                    <Col>
                      <b>Number of vaccines:</b> {vaccinesData.length + encryptedVaccinesData.length}
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        {/* Procedures */}
        <Row className='data__wrapper mt-3'>
          <Col>
            <h5>Procedures</h5>
            <Row className='align-items-start data__wrapper'>
              <Col className='data__col__wrapper'>
                <Row>
                  <Col xs="auto" className='vertical__header'>
                    <span>Encrypted Data</span>
                  </Col>
                  <Col className='data__fields'>
                    <Row>
                        {(encryptedProceduresData===null)? <></> : encryptedProceduresData.map((item, index) => (
                          <Col xs={6} className='card__map' key={index}>
                            <ProcedureCard clinicHospitalName={item.clinicHospitalName} procedureInfo={item.procedureInfo}  date={Number(item.date)} doctorAddress={item.doctorAddress} authorizedUser={item.authorizedUser} index={index} />
                          </Col>
                        ))}
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className='align-items-start data__wrapper mt-3'>
              <Col className='data__col__wrapper'>
                <Row>
                  <Col xs="auto" className='vertical__header'>
                    <span>Unencrypted Data</span>
                  </Col>
                  <Col className='data__fields'>
                    <Row>
                        {(proceduresData===null)? <></> : proceduresData.map((item, index) => (
                          <Col xs={6} className='card__map' key={index}>
                            <ProcedureCard clinicHospitalName={item.clinicHospitalName} procedureInfo={item.procedureInfo}  date={Number(item.date)} doctorAddress={item.doctorAddress} authorizedUser={item.authorizedUser} index={index} />
                          </Col>
                        ))}
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>




        {/* Vaccines */}
        <Row className='data__wrapper mt-3'>
          <Col>
            <h5>Vaccines</h5>
            <Row className='align-items-start data__wrapper'>
              <Col className='data__col__wrapper'>
                <Row>
                  <Col xs="auto" className='vertical__header'>
                    <span>Encrypted Data</span>
                  </Col>
                  <Col className='data__fields'>
                    <Row>
                      {(encryptedVaccinesData===null)? <></> : encryptedVaccinesData.map((item, index) => (
                        <div key={index}>
                          <VaccineCard name={item.name} lab={item.lab} lot={item.lot} dose={Number(item.dose)} totalDoses={Number(item.totalDoses)} date={Number(item.date)} authorizedUser={item.authorizedUser} index={index} />
                        </div>
                      ))}
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* <Row className='align-items-start data__wrapper mt-3'>
              <Col className='data__col__wrapper'>
                <Row>
                  <Col xs="auto" className='vertical__header'>
                    <span>Unencrypted Data</span>
                  </Col>
                  <Col className='data__fields'>
                    <Row>
                        {(proceduresData===null)? <></> : proceduresData.map((item, index) => (
                          <Col xs={6} className='card__map' key={index}>
                            <ProcedureCard clinicHospitalName={item.clinicHospitalName} procedureInfo={item.procedureInfo}  date={Number(item.date)} doctorAddress={item.doctorAddress} authorizedUser={item.authorizedUser} index={index} />
                          </Col>
                        ))}
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row> */}
          </Col>
        </Row>




      </div>
    </>
  )
};

export default RetrieveData;
