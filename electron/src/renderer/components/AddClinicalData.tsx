import React, { useState } from 'react';

import "./AddClinicalData.css"


interface AddClinicalDataProps {
  address: string;
  sharedCPF: string;
}


const AddClinicalData: React.FunctionComponent<AddClinicalDataProps> = ({ address, sharedCPF }) => {
  
  
  return (
    <>
      <h1>Procedures and Vaccines Data</h1>
    </>
  )
};

export default AddClinicalData;
