import React, { useState } from 'react';
import { Row, Col } from "reactstrap";

// Scripts
import cpfFormatting from 'renderer/scripts/cpfFormatting';

/** Stylesheet */
import "./AddClinicalData.css"


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


  return (
    <>
      <h3>Procedures and Vaccines Data</h3>
      <div className='mt-3 ms-3'>
        <select className='select__function' id="functionToCall" name="functionToCall" onChange={selectProcedureOrVaccine} >
          <option value="addProcedure">Add Procedure</option>
          <option value="addVaccine">Add Vaccine</option>
        </select>
      </div>


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
                <button className='me-2' type="submit">Save Unencrypted Data</button>
                <button type="submit">Save Encrypted Data</button>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-center mt-3 mb-2">
                <button className='reset__button'>Clear Form</button>
              </Col>
            </Row>
          </form>
        </div>


    </>
  )
};

export default AddClinicalData;
