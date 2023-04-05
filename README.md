# Medical Records

This is a project built with Electron, React, and TypeScript to save information about medical procedures and vaccines for patients on the blockchain using Solidity to code the smart contracts. The contracts are deployed to the Goerli Testnet.

## Getting Started

To get started with this project, you need to have Node.js installed on your system. Clone the repository to your local machine and run the following command to install the required packages:

```bash
npm install
```

To start the development server, run the following command:

```bash
npm start
```

This will start the Electron app and launch a development server for the React app. The Electron app is responsible for communicating with the blockchain and the React app is responsible for displaying the data.

## Smart Contracts

The smart contracts are written in Solidity and can be found in the contracts directory. There is no need to deploy them again, as the smart contracts have already been deployed and their addresses and respective ABIs are available to the front end. Although, to deploy another copy the contracts to the Goerli Testnet, you need to create a .env file in the blockchain folder with the following content:

```
REACT_APP_ALCHEMY_API_KEY=<YOUR_ALCHEMY_API_KEY>
REACT_APP_GOERLI_PRIVATE_KEY=<YOUR_METAMASK_PRIVATE_KEY>
```

Replace <YOUR_ALCHEMY_API_KEY> with your Infura project ID and <YOUR_METAMASK_PRIVATE_KEY> with your Ethereum Metamask account private key. You can create an Infura project ID by signing up on Infura.

To deploy the contracts, run the following command:

```bash
npm run deploy
```

This will compile the contracts and deploy them to the Goerli Testnet using your Infura project ID and will use your Metamask account to sign the transactions.

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue on GitHub. If you want to contribute code, please fork the repository and create a pull request.
