// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

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
    address private immutable owner;
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
        string firstName,
        string lastName,
        uint256 cpf,
        uint256 date
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
     * @param firstName the first name of the patient
     * @param lastName the last name of the patient
     * @param cpf brazilian cpf
     * @param date date when the person is registered
     */
    function addPatient(
        string memory firstName,
        string memory lastName,
        uint256 cpf,
        uint256 date
    ) external {
        require(msg.sender == owner, "Only the owner can call this function!");
        /// Add patient info
        patients[cpf] = Person(firstName, lastName, date);
        /// Broadcast event
        emit PatientAdded(firstName, lastName, cpf, date);
    }

    /**
     * Get patient data.
     *
     * @param cpf the cpf of the patient
     * @return patients[cpf] the patient's registered data
     */
    function getPatient(uint256 cpf) external view returns (Person memory) {
        require(msg.sender == owner, "Only the owner can call this function!");
        return patients[cpf];
    }
}
