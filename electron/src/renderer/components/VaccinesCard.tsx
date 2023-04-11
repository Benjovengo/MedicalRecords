import React from 'react';
import { Row, Col } from "reactstrap";

/** Stylesheet */
import "./Cards.css"


/**
 * Interface of the card for a retrieved vaccine.
 */
interface RetrievedData {
  name: string;
  lab: string;
  lot: string;
  dose: number;
  totalDoses: number;
  date: number;
  authorizedUser: string;
  index: number;
}


/**
 * Format a card for a single procedure.
 * 
 * @param name which vaccine was ministered
 * @param lab the manufacturer of the vaccine
 * @param lot the lot of the ministered vaccine
 * @param dose which dose was ministered
 * @param totalDoses how many doses in total the vaccine requires
 * @param date the date in which the procedure has taken place - Unix Epoch
 * @param authorizedUser the user that inserted the procedure into the blockchain
 * @param index the index of the procedure in the patient's list
 * @returns React component to display the information about a single vaccine
 */
const VaccineCard: React.FC<RetrievedData> = ({ name, lab, lot, dose, totalDoses, date, authorizedUser, index }) => {

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
        <Row className='mb-3'>
          <Col>
            <Row className='field__header'>
              Vaccine
            </Row>
            <Row className='vaccine__header'>
              <span>{name}</span>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row className='field__header'>
              Manufacturer
            </Row>
            <Row className='blockchain__info'>
              <span>{lab}</span>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row className='field__header'>
              Lot Number:
            </Row>
            <Row className='blockchain__info'>
              <span>{lot}</span>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row className='field__header'>
              Dose
            </Row>
            <Row className='blockchain__info'>
              <span>{dose}/{totalDoses}</span>
            </Row>
          </Col>
          <Col>
            <Row className='field__header'>
              Date
            </Row>
            <Row className='blockchain__info'>
              <span>{unixTimestampToDate(date)}</span>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row className='field__header'>
              Registered by:
            </Row>
            <Row className='blockchain__info'>
              <span className='authorized__address'>{authorizedUser}</span>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
    </>
  );
};

export default VaccineCard;