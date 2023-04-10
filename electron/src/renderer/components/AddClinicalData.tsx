import React, { useState } from 'react';
import { Row, Col } from "reactstrap";
import { ethers } from 'ethers'

// Scripts
import cpfFormatting from 'renderer/scripts/cpfFormatting';
import { encryptText } from 'renderer/scripts/cryptography';

/** Stylesheet */
import "./AddClinicalData.css"

// Contract and Address
import ClinicalData from '../../abis/ClinicalData.json' // contract ABI
import config from '../../config.json' // contract addresses
import { ALCHEMY_API_KEY, PRIVATE_KEY, HARDHAT_ACCOUNT01_PRIVATE_KEY } from '../../../work/sensitive';

// Setup provider and network - Alchemy
/* const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", ALCHEMY_API_KEY);
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider); */

// Setup provider and signer - Localhost
const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
const signer = new ethers.Wallet(HARDHAT_ACCOUNT01_PRIVATE_KEY, provider);

const clinicalData = new ethers.Contract(config[31337].clinicalData.address, ClinicalData, signer)




interface AddClinicalDataProps {
  address: string;
  sharedCPF: string;
}


const AddClinicalData: React.FunctionComponent<AddClinicalDataProps> = ({ address, sharedCPF }) => {
  /**
   * Hooks
   */
  // Select which type of data form will be displayed
  // Values: 'addProcedure' or 'addVaccine'
  const [procedureOrVaccine, setProcedureOrVaccine] = useState('addProcedure')
  

  // Get today's date
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate());
  const today: string = currentDate.toISOString().substring(0,10);


  /**
   * Set the hook for choosing between the Procedure or the Vaccine forms
   * 
   * @param event used to read the value of the select component
   */
  const selectProcedureOrVaccine = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProcedureOrVaccine(event.target.value)
  }


  /**
   * Format the CPF number in real-time
   * 
   * @param event 
   */
  const formatDocCPF = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Form data
    const doctorsCPF: string = (document.getElementById("doctorsCPF") as HTMLInputElement).value
    // Remove all non-numeric characters from the input value
    const doctorsNumericCPF: string = doctorsCPF.replace(/\D/g, '');
    // format CPF
    let CPFInput: HTMLInputElement = (document.getElementById("doctorsCPF") as HTMLInputElement)
    CPFInput.value = cpfFormatting(doctorsNumericCPF)
  }


/**
 * Save the procedure information as unencrypted data.
 * 
 * @param event clicking the button to add unencrypted procedure info
 */
  const addUnencryptedProcedure = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault()
    const clinicHospitalName = (document.getElementById("clinicHospitalName") as HTMLInputElement).value
    const procedureInfo = (document.getElementById("procedureInfo") as HTMLInputElement).value
    // Today's date in seconds: Unix Epoch
    const date = Math.floor(new Date().getTime() / 1000)
    const doctorsCPF = (document.getElementById("doctorsCPF") as HTMLInputElement).value
    // Remove all non-numeric characters from the input value
    const doctorsNumericCPF = doctorsCPF.replace(/\D/g, '');
    
    // Check if the value has 11 digits
    if (sharedCPF.length !== 11) {
      alert("Error! Patient document number must be 11 digits long." + "\n" + `Document number: "${sharedCPF}"`)
    } else {
      await clinicalData.addProcedure(clinicHospitalName, procedureInfo, date, doctorsNumericCPF, sharedCPF, address)
      alert('Successfully Added Unencrypted Procedure')
    }
  }


  /**
   * Save the procedure information as encrypted string data.
   * 
   * @param event clicking the button to add encrypted procedure info
   */
  const addEncryptedProcedure = async (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault()
    const clinicHospitalName = (document.getElementById("clinicHospitalName") as HTMLInputElement).value
    const procedureInfo = (document.getElementById("procedureInfo") as HTMLInputElement).value
    const date = Math.floor(new Date().getTime() / 1000)
    const doctorsCPF = (document.getElementById("doctorsCPF") as HTMLInputElement).value
    
    const dataJSON = {
        'clinicHospitalName': clinicHospitalName,
        'procedureInfo': procedureInfo,
        'date': date,
        'doctorAddress': doctorsCPF.replace(/\D/g, ''),
        'authorizedUser': address
      }
    // Check if the value has 11 digits
    if (sharedCPF.length !== 11) {
      alert("Error! Patient document number must be 11 digits long." + "\n" + `Document number: "${sharedCPF}"`)
    } else {
      const encryptedData = encryptText(JSON.stringify(dataJSON))
      await clinicalData.addEncryptedProcedure(encryptedData, sharedCPF)
      alert('Successfully Added Encrypted Procedure')
    }
  }


  /**
   * Clear the clinical procedure form
   * 
   * @param event click reset button
   */
  const clearProcedureForm = (event: React.MouseEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (confirm('Are you sure you want to clear the form?')) {
      const resetForm = document.getElementById('addProcedureForm') as HTMLFormElement
      resetForm.reset();
    }
  }



  return (
    <>
      <h3>Procedures and Vaccines Data</h3>
      <div className='mt-3 ms-3'>
        <select className='select__function' id="functionToCall" name="functionToCall" onChange={selectProcedureOrVaccine} >
          <option value="addProcedure">Add Procedure</option>
          <option value="addVaccine">Add Vaccine</option>
        </select>
      </div>

      {(procedureOrVaccine === 'addProcedure')? <>{/* Procedure */}
      <div>
          <form className='form__wrapper' id='addProcedureForm'>
            <Row>
              <Col>
                <div className="form__field mb-1">
                  <Row>
                    <label className='form__label' htmlFor="clinicHospitalName">Clinic/Hospital</label>
                  </Row>
                  <Row>
                    <input type="text" className='wide__label' id="clinicHospitalName" name="clinicHospitalName" /><br/>
                  </Row>
                </div>
              </Col>
            </Row>
            
            <Row>
              <Col>
                <div className="form__field mb-1">
                  <Row>
                    <label className='form__label' htmlFor="procedureInfo">Procedure Info</label>
                  </Row>
                  <Row>
                    <textarea className='wide__label' id="procedureInfo" name="procedureInfo" rows={5} /><br/>
                  </Row>
                </div>
              </Col>
            </Row>
            
            <Row>
              <Col>
                <div className="form__field mb-1">
                  <Row>
                    <label className='form__label' htmlFor="doctorsCPF">Doctor's Document (11-digit number)</label>
                  </Row>
                  <Row>
                    <input type="text" id="doctorsCPF" name="doctorsCPF" onChange={(event: any) => formatDocCPF(event)} placeholder='000.000.000-00' required /><br/>
                  </Row>
                </div>
              </Col>
              <Col>
                <div className="form__field mb-1">
                  <Row>
                      <label className='form__label' htmlFor="date">Date</label>
                  </Row>
                  <Row>
                      <input type="date" id="date" name="date" defaultValue={today} disabled/><br/>
                  </Row>
                </div>
              </Col>
            </Row>
            {/* Buttons */}
            <Row className="align-items-center">
              <Col className="d-flex justify-content-center mt-3 mb-2">
                <button className='me-2' type="submit" onClick={(event: any) => addUnencryptedProcedure(event)}>Save Unencrypted Data</button>
                <button type="submit" onClick={(event: any) => addEncryptedProcedure(event)}>Save Encrypted Data</button>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-center mt-3 mb-2">
                <button className='reset__button' onClick={(event: any) => clearProcedureForm(event)}>Clear Form</button>
              </Col>
            </Row>
          </form>
        </div>


        </> : <>{/* Vaccine */}
      
        <div>
          <form className='form__wrapper' id='addVaccineForm'>
            <Row>
              <Col>
                <div className="form__field mb-1">
                  <Row>
                    <label className='form__label' htmlFor="vaccineName">Vaccine Name</label>
                  </Row>
                  <Row>
                    <input type="text" className='wide__label' id="vaccineName" name="vaccineName" /><br/>
                  </Row>
                </div>
              </Col>
            </Row>
            
            <Row>
              <Col>
                <div className="form__field mb-1">
                  <Row>
                    <label className='form__label' htmlFor="vaccineLab">Manufacturer/Laboratory</label>
                  </Row>
                  <Row>
                    <input type="text" className='wide__label' id="vaccineLab" name="vaccineLab" /><br/>
                  </Row>
                </div>
              </Col>
            </Row>
            
            <Row>
              <Col>
                <div className="form__field mb-1">
                  <Row>
                    <label className='form__label' htmlFor="vaccineLot">Lot Number</label>
                  </Row>
                  <Row>
                    <input type="text" className='wide__label' id="vaccineLot" name="vaccineLot" /><br/>
                  </Row>
                </div>
              </Col>
            </Row>
            
            <Row>
              <Col>
                <div className="form__field mb-1">
                  <Row>
                    <label className='form__label' htmlFor="vaccineDose">Dose</label>
                  </Row>
                  <Row>
                    <input type="number" id="vaccineDose" name="vaccineDose" defaultValue={1} required /><br/>
                  </Row>
                </div>
              </Col>
              <Col>
                <div className="form__field mb-1">
                  <Row>
                    <label className='form__label' htmlFor="vaccineNumberOfDoses">Total Number of Doses</label>
                  </Row>
                  <Row>
                    <input type="number" id="vaccineNumberOfDoses" name="vaccineNumberOfDoses" defaultValue={1} /><br/>
                  </Row>
                </div>
              </Col>
              <Col>
                <div className="form__field mb-1">
                  <Row>
                      <label className='form__label' htmlFor="date">Date</label>
                  </Row>
                  <Row>
                      <input type="date" id="date" name="date" defaultValue={today} disabled/><br/>
                  </Row>
                </div>
              </Col>
            </Row>
            {/* Buttons */}
            <Row className="align-items-center">
              <Col className="d-flex justify-content-center mt-3 mb-2">
                <button className='me-2' type="submit" >Save Unencrypted Data</button>
                <button type="submit" >Save Encrypted Data</button>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-center mt-3 mb-2">
                <button className='reset__button' >Clear Form</button>
              </Col>
            </Row>
          </form>
        </div>
      </>}


    </>
  )
};

export default AddClinicalData;
