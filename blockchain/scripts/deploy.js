// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fs = require("fs"); // to copy the files to be used by the web interface


let clinicalDataAddress
let authorizedAccountsAddress
let patientsDataAddress

async function main() {
  // Setup accounts
  [ account1, account2, account3 ] = await ethers.getSigners()

  // deploy ClinicalData contract
  const ClinicalData = await ethers.getContractFactory('ClinicalData')
  const clinicalData = await ClinicalData.deploy()
  await clinicalData.deployed();
  clinicalDataAddress = clinicalData.address
  console.log(`ClinicalData contract deployed to ${clinicalData.address}`);

  // deploy AuthorizedAccounts contract
  const AuthorizedAccounts = await ethers.getContractFactory('AuthorizedAccounts')
  const authorizedAccounts = await AuthorizedAccounts.deploy()
  await authorizedAccounts.deployed();
  authorizedAccountsAddress = authorizedAccounts.address
  console.log(`AuthorizedAccounts contract deployed to ${authorizedAccounts.address}`);

  // deploy PatientsData contract
  const PatientsData = await ethers.getContractFactory('PatientsData')
  const patientsData = await PatientsData.deploy()
  await patientsData.deployed();
  patientsDataAddress = patientsData.address
  console.log(`PatientsData contract deployed to ${patientsData.address}`);


  // Setup another authorized account
  const setupAccount = await authorizedAccounts.setAuthorizedPerson('John', 'Doe', 98765432100, 199999999, '0xAD36Bf57B393f5673B7D57CB95f2F03E62b02F5D')
  await setupAccount.wait()

}


// Function to copy the ABI files
function createABIFiles() {
  // ClinicalData ABI
  let jsonFile = fs.readFileSync('./artifacts/contracts/ClinicalData.sol/ClinicalData.json')
  let jsonData = JSON.parse(jsonFile);
  let stringfyData = JSON.stringify(jsonData.abi, null, " ")
  let abiFilePath = "../electron/src/abis/ClinicalData.json"
  writeABIs(abiFilePath, stringfyData)

  // AuthorizedAccounts ABI
  jsonFile = fs.readFileSync('./artifacts/contracts/AuthorizedAccounts.sol/AuthorizedAccounts.json')
  jsonData = JSON.parse(jsonFile);
  stringfyData = JSON.stringify(jsonData.abi, null, " ")
  abiFilePath = "../electron/src/abis/AuthorizedAccounts.json"
  writeABIs(abiFilePath, stringfyData)

  // PatientsData ABI
  jsonFile = fs.readFileSync('./artifacts/contracts/PatientsData.sol/PatientsData.json')
  jsonData = JSON.parse(jsonFile);
  stringfyData = JSON.stringify(jsonData.abi, null, " ")
  abiFilePath = "../electron/src/abis/PatientsData.json"
  writeABIs(abiFilePath, stringfyData)
}


// write function
function writeABIs(_destination, _data) {
  // save new file
  var options = { flag : 'w' };
  fs.writeFileSync(_destination, _data , options, function(err) {
    if (err) throw err;
    console.log('complete');
  })
}


// Function to create/ update config.json file
function createConfigJSON(_clinicalDataAddress, _authorizedAccountsAddress, _patientsDataAddress) {
  const configFilePath = "../electron/src/config.json";

  // Create data JSON with contents
  var data = {}
  data[5] = [] //localhost

  data[5] = {
    clinicalData: {
      address: _clinicalDataAddress
    },
    authorizedAccounts: {
      address: _authorizedAccountsAddress
    },
    patientsData: {
      address: _patientsDataAddress
    }
  }

  // save new file
  stringfyData = JSON.stringify(data, null, " ")
  var options = { flag : 'w' };
  fs.writeFileSync(configFilePath, stringfyData , options, function(err) {
    if (err) throw err;
    console.log('complete');
  })
}


const runMain = async () => {
  try {
    await main()
    // copy files to client-side
    createABIFiles()
    // create config.json with deployed addresses
    createConfigJSON(clinicalDataAddress, authorizedAccountsAddress, patientsDataAddress)
    // terminate without errors
    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

runMain()