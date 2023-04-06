const { expect } = require("chai");
const { ethers } = require('hardhat')


// date
const date = Math.floor((new Date()).getTime() / 1000)


describe("Patient's Data", function () {

  let patientsData

  beforeEach(async () => {
    // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
    [deployer] = await ethers.getSigners()
    // Deploy PatientsData
    const PatientsData = await ethers.getContractFactory('PatientsData')
    patientsData = await PatientsData.connect(deployer).deploy()
  })

  it('Deployment address.', async () => {
    const result = await patientsData.address
    expect(result).to.not.equal('')
    expect(result).to.not.equal('0x')
  })

  it('Add patient information to the blockchain.', async () => {
    const firstName = 'Fábio'
    const lastName = 'Benjovengo'
    const CPF = '12312312312'
    // Call smart contract functions
    await patientsData.addPatient(firstName, lastName, CPF, date)
    const getPatientTx = await patientsData.getPatient(CPF)
    expect(getPatientTx.firstName).to.equal(firstName)
  })
});



describe("Authorized Accounts", function () {

  // smart contract
  let authorizedAccounts
  // accounts
  let deployer, account01, account02

  beforeEach(async () => {
    // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
    [deployer, account01, account02] = await ethers.getSigners()
    // Deploy AuthorizedAccounts
    const AuthorizedAccounts = await ethers.getContractFactory('AuthorizedAccounts')
    authorizedAccounts = await AuthorizedAccounts.connect(deployer).deploy()
    // smart contract interaction
    await authorizedAccounts.setAuthorizedPerson('Jane', 'Doe', '12481632641', date, account02.address)
  })

  it('Deployment address.', async () => {
    const result = await authorizedAccounts.address
    expect(result).to.not.equal('')
    expect(result).to.not.equal('0x')
  })

  it('Get the information about a registered authorized person.', async () => {
    const getAuthorizedPerson = await authorizedAccounts.getAuthorizedPerson(deployer.address)
    expect(getAuthorizedPerson.firstName).to.equal('Fabio')
  })

  it('Add the information about a new authorized person.', async () => {
    // data
    const firstName = 'John'
    const lastName = 'Doe'
    const CPF = '12345678900'
    // smart contract interaction
    await authorizedAccounts.setAuthorizedPerson(firstName, lastName, CPF, date, account01.address)
    const getAuthorizedPerson = await authorizedAccounts.getAuthorizedPerson(account01.address)
    expect(getAuthorizedPerson.firstName).to.equal(firstName)
    expect(getAuthorizedPerson.lastName).to.equal(lastName)
    expect(getAuthorizedPerson.CPF).to.equal(CPF)
  })

  it('Check if an account is authorized to modify information on the blockchain.', async () => {
    const isPersonAuthorized = await authorizedAccounts.isPersonAuthorized(deployer.address)
    expect(isPersonAuthorized).to.equal(true)
  })

  it('De-authorize and re-authorize an account.', async () => {
    // Is authorized?
    await authorizedAccounts.deauthorizePerson(account02.address)
    const deAuthorizedPerson = await authorizedAccounts.isPersonAuthorized(account02.address)
    // Re-authorize
    await authorizedAccounts.authorizePerson(account02.address)
    const isPersonReAuthorized = await authorizedAccounts.isPersonAuthorized(account02.address)
    // Tests
    expect(deAuthorizedPerson).to.equal(false)
    expect(isPersonReAuthorized).to.equal(true)
  })
});


describe("Clinical Data", function () {

  let deployer, account01
  let clinicalData

  // Procedure
  const clinicHospital = 'The Blockchain Hospital'
  const procedureInfo = 'The first procedure.'
  const doctorCPF = '98765432100'
  const patientCPF = '12481632641'
  // Vaccine
  const name = 'Blockchain Vaccine'
  const lab = 'Benjovengo Co.'
  const lot = 'fpb-001-2023'
  const dose = 1
  const numberOfDoses = 3

  beforeEach(async () => {
    // Setup accounts - to get signers use `const signers = await ethers.getSigners()`
    [deployer, account01] = await ethers.getSigners()
    // Deploy ClinicalData
    const ClinicalData = await ethers.getContractFactory('ClinicalData')
    clinicalData = await ClinicalData.connect(deployer).deploy()
  })

  it('Deployment address.', async () => {
    const result = await clinicalData.address
    expect(result).to.not.equal('')
    expect(result).to.not.equal('0x')
  })

  it('Add a new procedure.', async () => {
    await clinicalData.addProcedure(clinicHospital, procedureInfo, date, doctorCPF, patientCPF, deployer.address)
    const numberOfProcedures = await clinicalData.getNumberOfProcedures(patientCPF)
    expect(numberOfProcedures[0]).to.equal(1)
  })

  it('Retrieve data of a registered procedure.', async () => {
    // add procedure
    await clinicalData.addProcedure(clinicHospital, procedureInfo, date, doctorCPF, patientCPF, deployer.address)
    // retrieve data
    const procedureData = await clinicalData.getProcedure(patientCPF, 0)
    expect(procedureData.clinicHospitalName).to.equal(clinicHospital)
  })

  it('Add a new vaccine.', async () => {
    await clinicalData.addVaccine(name, lab, lot, dose, numberOfDoses, date, patientCPF, deployer.address)
    const numberOfVaccines = await clinicalData.getNumberOfVaccines(patientCPF)
    expect(numberOfVaccines[0]).to.equal(1)
  })

  it('Retrieve data of a registered vaccine.', async () => {
    await clinicalData.addVaccine(name, lab, lot, dose, numberOfDoses, date, patientCPF, deployer.address)
    // retrieve data
    const vaccineData = await clinicalData.getVaccine(patientCPF, 0)
    expect(vaccineData.name).to.equal(name)
    expect(vaccineData.lab).to.equal(lab)
    expect(vaccineData.lot).to.equal(lot)
    expect(vaccineData.dose).to.equal(dose)
    expect(vaccineData.numberOfDoses).to.equal(numberOfDoses)
    expect(vaccineData.date).to.equal(date)
    expect(vaccineData.authorizedUser).to.equal(deployer.address)
  })

});