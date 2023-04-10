import React from 'react';
import { Row, Col } from "reactstrap";

/** Scripts */
import cpfFormatting from 'renderer/scripts/cpfFormatting';

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


  /**
   * Format the information about the procedures to include line breaks.
   */
  const formatProceduresInfo = typeof procedureInfo === 'string' && procedureInfo.includes('\n') ? (
    procedureInfo.split('\n').map((str, index) => (
      <React.Fragment key={index}>
        {str}
        <br />
      </React.Fragment>
    ))
  ) : procedureInfo;


  /**
   * Convert Unix Epoch date to a human readable format.
   * 
   * @param unixTimestamp the Unix Epoch of the date in which the procedure as added to the blockchain
   * @returns string in the form of day/month/year
   */
  const unixTimestampToDate = (unixTimestamp: number) => {
    const date = new Date(unixTimestamp * 1000); // convert to milliseconds
    const day = date.getDate().toString().padStart(2, '0'); // pad with 0 if needed
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // pad with 0 if needed - months are zero-based, so add 1
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }


  return (
    <>
    <div className="procedure__wrapper">
      <div className={`${index % 2 === 0 ? 'item__even' : 'item__odd'}`}>
        <Row>
          <Col>
            <p>Clinic: <span>{clinicHospitalName}</span></p>
          </Col>
          <Col xs={4} className="text-end">
            <p>date: <span>{unixTimestampToDate(date)}</span></p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Doctor: <span>{cpfFormatting(String(doctorAddress))}</span></p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Registered by: <span className='authorized__address'>{authorizedUser}</span></p>
          </Col>
        </Row>
        <Row>
          <Row>
            <Col className='mt-3'>
              <p>Procedure Info</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <span>{formatProceduresInfo}</span>
            </Col>
          </Row>
        </Row>
      </div>
    </div>
    </>
  );
};

export default ProcedureCard;