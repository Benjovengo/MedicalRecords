import React from 'react';
import { Row, Col } from "reactstrap";

/** Stylesheet */
import "./Cards.css"


/**
 * Interface of the card for a procedure retrieved procedure.
 */
interface RetrievedData {
  clinicHospitalName: string;
  procedureInfo: string;
  date: number;
  doctorAddress: number;
  authorizedUser: string;
  index: number;
}


/**
 * Format a card for a single procedure.
 * 
 * @param clinicHospitalName the clinic or hospital name of the retrieved procedure
 * @param procedureInfo the information about the procedure - can include line breaks
 * @param date the date in which the procedure has taken place - Unix Epoch
 * @param doctorAddress the address of the doctor in the blockchain
 * @param authorizedUser the user that inserted the procedure into the blockchain
 * @param index the index of the procedure in the patient's list
 * @returns React component to display the information about a single procedure
 */
const ProcedureCard: React.FC<RetrievedData> = ({ clinicHospitalName, procedureInfo, date, doctorAddress, authorizedUser, index }) => {


  return (
    <>
    <div className="procedure__wrapper">
      <h3>Procedure</h3>
    </div>
    </>
  );
};

export default ProcedureCard;