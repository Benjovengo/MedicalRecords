// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

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
        uint256 CPF;
        uint256 date;
        bool isAuthorized;
    }
    /// list of authorized people
    mapping(address => Person) private people;

    /**
     * Events
     */
    event AuthorizedPersonAdded(
        string _firstName,
        string _lastName,
        uint256 _CPF,
        uint256 _date,
        address _blockchainAccountAddress
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
     * @param _firstName the first name of the authorized person
     * @param _lastName the last name of the authorized person
     * @param _CPF brazilian CPF
     * @param _date date when the person is registered
     * @param _blockchainAccountAddress the blockchain address of the person
     */
    function setAuthorizedPerson(
        string memory _firstName,
        string memory _lastName,
        uint256 _CPF,
        uint256 _date,
        address _blockchainAccountAddress
    ) public {
        require(msg.sender == owner, "Only the owner can call this function!");
        /// Add authorized person info
        people[_blockchainAccountAddress] = Person(
            _firstName,
            _lastName,
            _CPF,
            _date,
            true
        );
        /// Broadcast event
        emit AuthorizedPersonAdded(
            _firstName,
            _lastName,
            _CPF,
            _date,
            _blockchainAccountAddress
        );
    }

    /**
     * Authorize a previously deauthorized employee.
     *
     * @param _blockchainAccountAddress the blockchain address of the person
     */
    function authorizePerson(address _blockchainAccountAddress) public {
        require(msg.sender == owner, "Only the owner can call this function!");
        /// Authorize
        people[_blockchainAccountAddress].isAuthorized = true;
    }

    /**
     * Deauthorize a previously authorized employee.
     *
     * @param _blockchainAccountAddress the blockchain address of the person
     */
    function deauthorizePerson(address _blockchainAccountAddress) public {
        require(msg.sender == owner, "Only the owner can call this function!");
        /// Deauthorize
        people[_blockchainAccountAddress].isAuthorized = false;
    }

    /**
     * Get authorized person data.
     *
     * @param _blockchainAccountAddress the blockchain address of the person
     * @return people[_blockchainAccountAddress] the authorized person register data
     */
    function getAuthorizedPerson(
        address _blockchainAccountAddress
    ) public view returns (Person memory) {
        require(msg.sender == owner, "Only the owner can call this function!");
        return people[_blockchainAccountAddress];
    }

    /**
     * Is the person authorized?
     *
     * @param _blockchainAccountAddress the blockchain address of the person
     * @return people[_blockchainAccountAddress].isAuthorized authorization status
     */
    function isPersonAuthorized(
        address _blockchainAccountAddress
    ) public view returns (bool) {
        require(msg.sender == owner, "Only the owner can call this function!");
        return people[_blockchainAccountAddress].isAuthorized;
    }
}
