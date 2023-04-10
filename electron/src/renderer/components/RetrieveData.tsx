import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from "reactstrap";
import { ethers } from 'ethers'

import "./RetrieveData.css"


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

  return (
    <>
      <h1>Retrieved Data</h1>
    </>
  )
};

export default RetrieveData;
