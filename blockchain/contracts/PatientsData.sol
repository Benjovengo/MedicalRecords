// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

/**
 * @title Personal Information about the Patients
 * @author Fábio Benjovengo
 *
 * Smart contract to store information about the patients on
 * the blockchain.
 *
 * @custom:security Use this contract only for tests! Do NOT
 *                  store any real information in this project!
 * @custom:security-contact fabio.benjovengo@gmail.com
 */
contract PatientsData {
    /**
     * State Variables
     */
    /// the address of the owner of this contract
    address private owner;
    /// Information about the patient
    struct Person {
        string firstName;
        string lastName;
        uint256 date;
    }
    /// list of patients
    mapping(uint256 => Person) private patients;

    /**
     * Events
     */
    event PatientAdded(
        string _firstName,
        string _lastName,
        uint256 _CPF,
        uint256 _date
    );

    /**
     * Constructor Method
     */
    constructor() {
        /// set the deployer as the initial owner of this contract
        owner = msg.sender;
    }

    /**
     * Add a new (or modify existing) patient on the blockchain.
     *
     * @param _firstName the first name of the patient
     * @param _lastName the last name of the patient
     * @param _CPF brazilian CPF
     * @param _date date when the person is registered
     */
    function addPatient(
        string memory _firstName,
        string memory _lastName,
        uint256 _CPF,
        uint256 _date
    ) public {
        require(msg.sender == owner, "Only the owner can call this function!");
        /// Add patient info
        patients[_CPF] = Person(_firstName, _lastName, _date);
        /// Broadcast event
        emit PatientAdded(_firstName, _lastName, _CPF, _date);
    }

    /**
     * Get patient data.
     *
     * @param _CPF the CPF of the patient
     * @return patients[_CPF] the patient's registered data
     */
    function getPatient(uint256 _CPF) public view returns (Person memory) {
        require(msg.sender == owner, "Only the owner can call this function!");
        return patients[_CPF];
    }
}
