import React, { useState } from 'react';

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
  

  /**
   * Set the hook for choosing between the Procedure or the Vaccine forms
   * 
   * @param event used to read the value of the select component
   */
  const selectProcedureOrVaccine = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProcedureOrVaccine(event.target.value)
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

    </>
  )
};

export default AddClinicalData;
