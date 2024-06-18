import Web3, { ContractMissingDeployDataError } from "web3";
import fs from 'fs';
import solc from 'solc';
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { Console } from "console";
import cors from "cors";
var account =   '0x079e302a2fE6f96b07a7b3A450665fDEe26453e7'
console.log('Received account:', account);
// Here you can process the account data as needed


const app = express();
const port = 3300;
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Serve static files
var __dirname = "C:\\Users\\rauna\\Desktop\\"
app.use(express.static(path.join(__dirname, 'evm_project')));


// Handle POST request to validate the address
app.use(bodyParser.json());


      
const web3 = new Web3("http://127.0.0.1:7545");

// Read the Solidity source code from a file
const sourceCode = fs.readFileSync('./contracts/evm.sol', 'utf8');

// Compile the Solidity source code
const input = {
  language: 'Solidity',
  sources: {
    'evm.sol': {
      content: sourceCode,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode'],
      },
    },
    evmVersion: 'london'
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const bytecode = output.contracts['evm.sol']['Election'].evm.bytecode.object;
const abi = output.contracts['evm.sol']['Election'].abi;


// Deploy the contract
const contract = new web3.eth.Contract(abi);


 // Replace with your Ganache account's private key
var send_address = account;
const deploy = async () => {
  const gasEstimate = await contract.deploy({ data: bytecode }).estimateGas(); // Estimate gas required
  const deployedContract = await contract.deploy({ data: bytecode, arguments: [/* constructor arguments */] })
    .send({ from: account, gas: Number(gasEstimate) + 1000 }); // Deploy with gas and account

  console.log('Contract deployed to:', deployedContract.options.address);

  async function sendCandidatesNew(name,send_address) {
    try {
      const candidatenew = await deployedContract.methods.addCandidate(name).call({from:send_address});
      //console.log("candidate new:", candidatenew); // Access the value here
      return candidatenew;
    } catch (error) {
      console.error("Error calling candidatenew:", error);
    }
  }



  
  
  
  
  
  
  
  app.post('/addCandidate', async (req, res) => { // <- Add async keyword here
    // Get candidate name from request body
    const candidateDetails = req.body.candidateDetails;
    
    var result2 = await sendCandidatesNew(candidateDetails,send_address);
  
    // Send response back to the client
    res.json({ message: `Candidate details - candidate ${candidateDetails} has been added` });
  });




  
};

deploy().catch((error) => {
  console.error('Deployment error:', error);
});




// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});



