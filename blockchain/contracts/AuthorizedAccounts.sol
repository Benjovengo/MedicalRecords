// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

/**
 * @title Authorized Accounts Information
 * @author Fábio Benjovengo
 *
 * Smart contract to store information about authorized personnel
 * to add clinical information of the patients to the blockchain.
 *
 * @custom:security Use this contract only for tests! Do NOT
 *                  store any real information in this project!
 * @custom:security-contact fabio.benjovengo@gmail.com
 */
contract AuthorizedAccounts {
    /**
     * State Variables
     */
    /// the address of the owner of this contract
    address private immutable owner;
    /// Information about the authorized person
    struct Person {
        string firstName;
        string lastName;
        uint256 cpf;
        uint256 date;
        bool isAuthorized;
    }
    /// list of authorized people
    mapping(address => Person) private people;

    /**
     * Events
     */
    event AuthorizedPersonAdded(
        string firstName,
        string lastName,
        uint256 cpf,
        uint256 date,
        address blockchainAccountAddress
    );

    /**
     * Constructor Method
     */
    constructor() {
        /// set the deployer as the initial owner of this contract
        owner = msg.sender;
        /// add the deployer to the list of authorized personnel
        people[msg.sender] = Person(
            "Fabio",
            "Benjovengo",
            12345678900,
            uint256(1679073072),
            true
        );
    }

    /**
     * Register a new authorized person to add/modify data
     * of the patients on the blockchain.
     *
     * @param firstName the first name of the authorized person
     * @param lastName the last name of the authorized person
     * @param cpf brazilian CPF
     * @param date date when the person is registered
     * @param blockchainAccountAddress the blockchain address of the person
     */
    function setAuthorizedPerson(
        string memory firstName,
        string memory lastName,
        uint256 cpf,
        uint256 date,
        address blockchainAccountAddress
    ) external {
        require(msg.sender == owner, "Only the owner can call this function!");
        /// Add authorized person info
        people[blockchainAccountAddress] = Person(
            firstName,
            lastName,
            cpf,
            date,
            true
        );
        /// Broadcast event
        emit AuthorizedPersonAdded(
            firstName,
            lastName,
            cpf,
            date,
            blockchainAccountAddress
        );
    }

    /**
     * Authorize a previously deauthorized employee.
     *
     * @param blockchainAccountAddress the blockchain address of the person
     */
    function authorizePerson(address blockchainAccountAddress) external {
        require(msg.sender == owner, "Only the owner can call this function!");
        /// Authorize
        people[blockchainAccountAddress].isAuthorized = true;
    }

    /**
     * Deauthorize a previously authorized employee.
     *
     * @param blockchainAccountAddress the blockchain address of the person
     */
    function deauthorizePerson(address blockchainAccountAddress) external {
        require(msg.sender == owner, "Only the owner can call this function!");
        /// Deauthorize
        people[blockchainAccountAddress].isAuthorized = false;
    }

    /**
     * Get authorized person data.
     *
     * @param blockchainAccountAddress the blockchain address of the person
     * @return people[blockchainAccountAddress] the authorized person register data
     */
    function getAuthorizedPerson(
        address blockchainAccountAddress
    ) external view returns (Person memory) {
        require(msg.sender == owner, "Only the owner can call this function!");
        return people[blockchainAccountAddress];
    }

    /**
     * Is the person authorized?
     *
     * @param blockchainAccountAddress the blockchain address of the person
     * @return people[blockchainAccountAddress].isAuthorized authorization status
     */
    function isPersonAuthorized(
        address blockchainAccountAddress
    ) external view returns (bool) {
        require(msg.sender == owner, "Only the owner can call this function!");
        return people[blockchainAccountAddress].isAuthorized;
    }
}
