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


  return (
    <>
    <div className="procedure__wrapper">
    <div className={`${index % 2 === 0 ? 'item__even' : 'item__odd'}`}>
        <Row>
          <Col>
            <p>Clinic: <span>{clinicHospitalName}</span></p>
          </Col>
          <Col xs={4} className="text-end">
            <p>date: <span>{date}</span></p>
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
              <span>{procedureInfo}</span>
            </Col>
          </Row>
        </Row>
      </div>
    </div>
    </>
  );
};

export default ProcedureCard;