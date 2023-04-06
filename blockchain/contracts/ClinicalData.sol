// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

/**
 * @title Clinical Information
 * @author Fábio Benjovengo
 *
 * Smart contract to store information about medical procedures
 * and other relevant clinical information on the blockchain.
 *
 * @custom:security Use this contract only for tests! Do NOT
 *                  store any real information in this project!
 * @custom:security-contact fabio.benjovengo@gmail.com
 */
contract ClinicalData {
    /**
     * State Variables
     */
    /// the address of the owner of this contract
    address private owner;
    /// total number of registered procedures for a patient
    mapping(uint256 => uint256) private numberOfProcedures;
    /// total number of administered vaccines for a patient
    mapping(uint256 => uint256) private numberOfVaccines;
    /// total number of procedures for a doctor
    mapping(uint256 => uint256) private numberOfProceduresDoctor;

    /// Information about the vaccines
    struct Vaccine {
        string name;
        string lab;
        string lot;
        uint256 dose;
        uint256 totalDoses;
        uint256 date;
        address authorizedUser;
    }
    /// list of administered vaccines for a given patient
    mapping(uint256 => mapping(uint256 => Vaccine)) private vaccines;

    /// Information about the procedures
    struct Procedure {
        string clinicHospitalName;
        string procedureInfo;
        uint256 date;
        uint256 doctorAddress; /// address of the main doctor
        address authorizedUser;
    }
    /// list of procedures for a given patient
    mapping(uint256 => mapping(uint256 => Procedure)) private procedures;

    /// Information about the procedures performed by a given doctor
    struct doctorProcedure {
        uint256 _patient;
        uint256 _id;
    }
    mapping(uint256 => mapping(uint256 => doctorProcedure))
        private doctorsProcedures;

    /**
     * Events
     */
    event VaccineAdded(
        string _name,
        string _lab,
        string _lot,
        uint256 _dose,
        uint256 _date,
        uint256 _patientCPF
    );
    event ProcedureAdded(
        string _clinicHospitalName,
        string _procedureInfo,
        uint256 _date,
        uint256 _doctorAddress,
        uint256 _patientCPF
    );

    /**
     * Constructor Method
     */
    constructor() {
        /// set the deployer as the initial owner of this contract
        owner = msg.sender;
    }

    /*
     * Change ownership of this token contract
     *
     * @param _newOwner the blockchain address of the clinic
     */
    function changeOwner(address _newOwner) public {
        require(msg.sender == owner, "Only the owner can call this function!");
        owner = _newOwner;
    }

    /**
     * Get the address of the owner of this contract
     *
     * @return owner the address of the owner of this contract
     */
    function getOwner() public view returns (address) {
        return owner;
    }

    /**
     * Add a vaccine to a patient's list of vaccines
     *
     * @param _name the name of the vaccine
     * @param _lab the manufacturer of the vaccine
     * @param _lot the lot of the vaccine
     * @param _dose which dose was administered
     * @param _totalDoses how many doses this vaccine takes
     * @param _date today's date - Unix timestamp
     * @param _patientCPF the CPF of the patient
     * @param _authorizedUser the address of the user who registered the vaccine
     */
    function addVaccine(
        string memory _name,
        string memory _lab,
        string memory _lot,
        uint256 _dose,
        uint256 _totalDoses,
        uint256 _date,
        uint256 _patientCPF,
        address _authorizedUser
    ) public {
        require(msg.sender == owner, "Only the owner can call this function!");
        /// Add vaccine
        vaccines[_patientCPF][numberOfVaccines[_patientCPF]] = Vaccine(
            _name,
            _lab,
            _lot,
            _dose,
            _totalDoses,
            _date,
            _authorizedUser
        );
        /// Increment counter
        numberOfVaccines[_patientCPF] += 1;
        /// Broadcast event
        emit VaccineAdded(_name, _lab, _lot, _dose, _date, _patientCPF);
    }

    /**
     * Add a procedure to a patient's history
     *
     * @param _clinicHospitalName the name of the clinic/hospital
     * @param _procedureInfo what procedure was made
     * @param _date today's date - Unix timestamp
     * @param _doctorAddress the CPF of the doctor
     * @param _patientCPF the CPF of the patient
     * @param _authorizedUser the address of the user who registered the procedure
     */
    function addProcedure(
        string memory _clinicHospitalName,
        string memory _procedureInfo,
        uint256 _date,
        uint256 _doctorAddress,
        uint256 _patientCPF,
        address _authorizedUser
    ) public {
        require(msg.sender == owner, "Only the owner can call this function!");
        /// Add procedure to patient's list of procedures
        procedures[_patientCPF][numberOfProcedures[_patientCPF]] = Procedure(
            _clinicHospitalName,
            _procedureInfo,
            _date,
            _doctorAddress,
            _authorizedUser
        );
        /// Add procedure to doctor's list
        doctorsProcedures[_doctorAddress][
            numberOfProceduresDoctor[_doctorAddress]
        ] = doctorProcedure(_patientCPF, numberOfProcedures[_patientCPF]);
        /// Increment counters
        numberOfProcedures[_patientCPF] += 1;
        numberOfProceduresDoctor[_doctorAddress] += 1;
        /// Broadcast event
        emit ProcedureAdded(
            _clinicHospitalName,
            _procedureInfo,
            _date,
            _doctorAddress,
            _patientCPF
        );
    }

    /**
     * Get the total number of vaccines for a patient
     *
     * @param _patientCPF the CPF of the patient
     * @return [numberOfVaccines[_patientCPF], numberOfEncryptedVaccines[_patientCPF]]
     *         the total number of vaccines unencrypted and encrypted
     */
    function getNumberOfVaccines(
        uint256 _patientCPF
    ) public view returns (uint256) {
        require(msg.sender == owner, "Only the owner can call this function!");
        return numberOfVaccines[_patientCPF];
    }

    /**
     * Get the total number of procedures for a patient
     *
     * @param _patientCPF the CPF of the patient
     * @return numberOfVaccines[_patientCPF] the total number of procedures
     */
    function getNumberOfProcedures(
        uint256 _patientCPF
    ) public view returns (uint256) {
        require(msg.sender == owner, "Only the owner can call this function!");
        return numberOfProcedures[_patientCPF];
    }

    /**
     * Get information about a vaccine
     *
     * @param _patientCPF the CPF of the patient
     * @param _id the index of the vaccine in patient's list of vaccines
     * @return Vaccine the information about the administered vaccine
     */
    function getVaccine(
        uint256 _patientCPF,
        uint256 _id
    ) public view returns (Vaccine memory) {
        require(msg.sender == owner, "Only the owner can call this function!");
        return vaccines[_patientCPF][_id];
    }

    /**
     * Get information about a procedure
     *
     * @param _patientCPF the CPF of the patient
     * @param _id the index of the procedure in patient's list of vaccines
     * @return Procedure the information about the procedure
     */
    function getProcedure(
        uint256 _patientCPF,
        uint256 _id
    ) public view returns (Procedure memory) {
        require(msg.sender == owner, "Only the owner can call this function!");
        return procedures[_patientCPF][_id];
    }
}
