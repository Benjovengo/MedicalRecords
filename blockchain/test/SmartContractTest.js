const { expect } = require("chai");
const { ethers } = require('hardhat')


describe("PatientsData", function () {

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
    const date = Math.floor((new Date()).getTime() / 1000)
    // Call smart contract functions
    await patientsData.addPatient(firstName, lastName, CPF, date)
    const getPatientTx = await patientsData.getPatient(CPF)
    expect(getPatientTx.firstName).to.equal(firstName)
  })
});
