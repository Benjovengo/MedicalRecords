// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

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
    /// mapping from the CPF of the patient (11-digit number) to the number of plain text procedures
    mapping(uint256 => uint256) private numberOfProcedures;
    /// total number of registered procedures for a patient - encrypted
    /// mapping from the CPF of the patient (11-digit number) to the number of encrypted procedures
    mapping(uint256 => uint256) private numberOfEncryptedProcedures;
    /// total number of administered vaccines for a patient
    /// mapping from the CPF of the patient (11-digit number) to the number of plain text vaccines
    mapping(uint256 => uint256) private numberOfVaccines;
    /// total number of administered vaccines for a patient - encrypted
    /// mapping from the CPF of the patient (11-digit number) to the number of encrypted vaccines
    mapping(uint256 => uint256) private numberOfEncryptedVaccines;
    /// total number of procedures for a doctor
    /// mapping from the CPF of the doctor (11-digit number) to the number of procedures the doctor performed
    mapping(uint256 => uint256) private numberOfProceduresDoctor;

    /// Information about the vaccines
    struct Vaccine {
        string name;
        string lab;
        string lot;
        uint256 dose;
        uint256 numberOfDoses;
        uint256 date;
        address authorizedUser;
    }
    /// list of administered vaccines for a given patient
    /// mapping from the CPF of the patient (11-digit number) to a second mapping in which the key
    /// is the index of the vaccine and stores the plain text version of the vaccine info (struct)
    mapping(uint256 => mapping(uint256 => Vaccine)) private vaccines;
    /// encrypted list of administered vaccines for a given patient
    /// mapping from the CPF of the patient (11-digit number) to a second mapping in which the key
    /// is the index of the vaccine and stores the encrypted version of the vaccine info (struct)
    mapping(uint256 => mapping(uint256 => string)) private encryptedVaccines;

    /// Information about the procedures
    struct Procedure {
        string clinicHospitalName;
        string procedureInfo;
        uint256 date;
        uint256 doctorAddress; /// address of the main doctor
        address authorizedUser;
    }
    /// list of procedures for a given patient
    /// mapping from the CPF of the patient (11-digit number) to a second mapping in which the key
    /// is the index of the procedure and stores the plain text version of the procedure info (struct)
    mapping(uint256 => mapping(uint256 => Procedure)) private procedures;
    /// encrypted list of procedures for a given patient
    /// mapping from the CPF of the patient (11-digit number) to a second mapping in which the key
    /// is the index of the procedure and stores the encrypted version of the procedure info (struct)
    mapping(uint256 => mapping(uint256 => string)) private encryptedProcedures;

    /// Information about the procedures performed by a given doctor
    struct DoctorProcedure {
        uint256 patient;
        uint256 id;
    }
    /// mapping from the CPF of the doctor (11-digit number) to a second mapping in which the key is
    /// the index of the vaccine and stores the information about the procedure performed by the doctor
    mapping(uint256 => mapping(uint256 => DoctorProcedure))
        private doctorsProcedures;

    /**
     * Events
     */
    event VaccineAdded(
        string name,
        string lab,
        string lot,
        uint256 dose,
        uint256 date,
        uint256 patientCPF
    );
    event EncryptedVaccineAdded(uint256 patientCPF);
    event ProcedureAdded(
        string clinicHospitalName,
        string procedureInfo,
        uint256 date,
        uint256 doctorcpf,
        uint256 patientCPF
    );
    event EncryptedProcedureAdded(uint256 patientCPF);

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
     * @param newOwner the blockchain address of the clinic
     */
    function changeOwner(address newOwner) external {
        require(msg.sender == owner, "Only the owner can call this function!");
        require(
            newOwner != address(0x0),
            "Zero address cannot be made the owner of this contract!"
        );
        owner = newOwner;
    }

    /**
     * Get the address of the owner of this contract
     *
     * @return owner the address of the owner of this contract
     */
    function getOwner() external view returns (address) {
        return owner;
    }

    /**
     * Add a vaccine to a patient's list of vaccines
     *
     * @param name the name of the vaccine
     * @param lab the manufacturer of the vaccine
     * @param lot the lot of the vaccine
     * @param dose which dose was administered
     * @param numberOfDoses how many doses this vaccine takes
     * @param date today's date - Unix timestamp
     * @param patientCPF the cpf of the patient
     * @param authorizedUser the address of the user who registered the vaccine
     */
    function addVaccine(
        string memory name,
        string memory lab,
        string memory lot,
        uint256 dose,
        uint256 numberOfDoses,
        uint256 date,
        uint256 patientCPF,
        address authorizedUser
    ) external {
        //require(msg.sender == owner, "Only the owner can call this function!");
        /// Add vaccine
        vaccines[patientCPF][numberOfVaccines[patientCPF]] = Vaccine(
            name,
            lab,
            lot,
            dose,
            numberOfDoses,
            date,
            authorizedUser
        );
        /// Increment counter
        numberOfVaccines[patientCPF] += 1;
        /// Broadcast event
        emit VaccineAdded(name, lab, lot, dose, date, patientCPF);
    }

    /**
     * Add a procedure to a patient's history
     *
     * @param clinicHospitalName the name of the clinic/hospital
     * @param procedureInfo what procedure was made
     * @param date today's date - Unix timestamp
     * @param doctorcpf the cpf of the doctor
     * @param patientCPF the cpf of the patient
     * @param authorizedUser the address of the user who registered the procedure
     */
    function addProcedure(
        string memory clinicHospitalName,
        string memory procedureInfo,
        uint256 date,
        uint256 doctorcpf,
        uint256 patientCPF,
        address authorizedUser
    ) external {
        //require(msg.sender == owner, "Only the owner can call this function!");
        /// Add procedure to patient's list of procedures
        procedures[patientCPF][numberOfProcedures[patientCPF]] = Procedure(
            clinicHospitalName,
            procedureInfo,
            date,
            doctorcpf,
            authorizedUser
        );
        /// Add procedure to doctor's list
        doctorsProcedures[doctorcpf][
            numberOfProceduresDoctor[doctorcpf]
        ] = DoctorProcedure(patientCPF, numberOfProcedures[patientCPF]);
        /// Increment counters
        numberOfProcedures[patientCPF] += 1;
        numberOfProceduresDoctor[doctorcpf] += 1;
        /// Broadcast event
        emit ProcedureAdded(
            clinicHospitalName,
            procedureInfo,
            date,
            doctorcpf,
            patientCPF
        );
    }

    /**
     * Get the total number of vaccines for a patient
     *
     * @param patientCPF the cpf of the patient
     * @return [numberOfVaccines[patientCPF], numberOfEncryptedVaccines[patientCPF]]
     *         the total number of vaccines unencrypted and encrypted
     */
    function getNumberOfVaccines(
        uint256 patientCPF
    ) external view returns (uint256[2] memory) {
        //require(msg.sender == owner, "Only the owner can call this function!");
        return [
            numberOfVaccines[patientCPF],
            numberOfEncryptedVaccines[patientCPF]
        ];
    }

    /**
     * Get the total number of procedures for a patient
     *
     * @param patientCPF the cpf of the patient
     * @return numberOfVaccines[patientCPF] the total number of procedures
     */
    function getNumberOfProcedures(
        uint256 patientCPF
    ) external view returns (uint256[2] memory) {
        //require(msg.sender == owner, "Only the owner can call this function!");
        return [
            numberOfProcedures[patientCPF],
            numberOfEncryptedProcedures[patientCPF]
        ];
    }

    /**
     * Get information about a vaccine
     *
     * @param patientCPF the cpf of the patient
     * @param id the index of the vaccine in patient's list of vaccines
     * @return Vaccine the information about the administered vaccine
     */
    function getVaccine(
        uint256 patientCPF,
        uint256 id
    ) external view returns (Vaccine memory) {
        //require(msg.sender == owner, "Only the owner can call this function!");
        return vaccines[patientCPF][id];
    }

    /**
     * Get information about a procedure
     *
     * @param patientCPF the cpf of the patient
     * @param id the index of the procedure in patient's list of vaccines
     * @return Procedure the information about the procedure
     */
    function getProcedure(
        uint256 patientCPF,
        uint256 id
    ) external view returns (Procedure memory) {
        //require(msg.sender == owner, "Only the owner can call this function!");
        return procedures[patientCPF][id];
    }

    /**
     * Add a vaccine with encrypted contents to a patient's list of vaccines
     *
     * @param encryptedVaccineInfo the encrypted contents of the vaccine
     * @param patientCPF the cpf of the patient
     */
    function addEncryptedVaccine(
        string memory encryptedVaccineInfo,
        uint256 patientCPF
    ) external {
        //require(msg.sender == owner, "Only the owner can call this function!");
        /// Add vaccine
        encryptedVaccines[patientCPF][
            numberOfEncryptedVaccines[patientCPF]
        ] = encryptedVaccineInfo;
        /// Increment counter
        numberOfEncryptedVaccines[patientCPF] += 1;
        /// Broadcast event
        emit EncryptedVaccineAdded(patientCPF);
    }

    /**
     * Add a procedure with encrypted contents to a patient's history
     *
     * @param encryptedProcedureInfo the encrypted contents of the vaccine
     * @param patientCPF the cpf of the patient
     */
    function addEncryptedProcedure(
        string memory encryptedProcedureInfo,
        uint256 patientCPF
    ) external {
        //require(msg.sender == owner, "Only the owner can call this function!");
        /// Add vaccine
        encryptedProcedures[patientCPF][
            numberOfEncryptedProcedures[patientCPF]
        ] = encryptedProcedureInfo;
        /// Increment counter
        numberOfEncryptedProcedures[patientCPF] += 1;
        /// Broadcast event
        emit EncryptedProcedureAdded(patientCPF);
    }

    /**
     * Get information about a vaccine with encrypted contents
     *
     * @param patientCPF the cpf of the patient
     * @param id the index of the vaccine in patient's list of vaccines
     * @return string the encrypted information about the administered vaccine
     */
    function getEncryptedVaccine(
        uint256 patientCPF,
        uint256 id
    ) external view returns (string memory) {
        //require(msg.sender == owner, "Only the owner can call this function!");
        return encryptedVaccines[patientCPF][id];
    }

    /**
     * Get information about a procedure with encrypted contents
     *
     * @param patientCPF the cpf of the patient
     * @param id the index of the procedure in patient's list of vaccines
     * @return string the information about the procedure
     */
    function getEncryptedProcedure(
        uint256 patientCPF,
        uint256 id
    ) external view returns (string memory) {
        //require(msg.sender == owner, "Only the owner can call this function!");
        return encryptedProcedures[patientCPF][id];
    }
}
