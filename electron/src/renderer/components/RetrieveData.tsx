import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from "reactstrap";
import { ethers } from 'ethers'


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
