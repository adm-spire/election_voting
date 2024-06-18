import Web3, { ContractMissingDeployDataError } from "web3";
import fs from 'fs';
import solc from 'solc';
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { Console } from "console";
import cors from "cors";
var account;

const app = express();
const port = 3000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Serve static files
var __dirname = "C:\\Users\\rauna\\Desktop\\"
app.use(express.static(path.join(__dirname, 'evm_project')));


// Handle POST request to validate the address
app.use(bodyParser.json());

// Route to handle receiving address form data
app.post('/submit_address', async (req, res) => {
  try {
      var {address} = req.body;
      account = address;
      
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

var universal = "0x8AA97f04089099a2C5F3a08887E397A86280F4a7";
// Deploy the contract
const contract = new web3.eth.Contract(abi,universal);
//initialize through admin

 // Replace with your Ganache account's private key
var send_address = account;
/*
const deploy = async () => {
  const gasEstimate = await contract.deploy({ data: bytecode }).estimateGas(); // Estimate gas required
  const deployedContract = await contract.deploy({ data: bytecode, arguments: [] })
    .send({ from: account, gas: Number(gasEstimate) + 1000 }); // Deploy with gas and account

  console.log('Contract deployed to:', deployedContract.options.address);
  */
  async function callCandidates(candidate_number) {
    try {
      const candidatenames = await contract.methods.candidates(candidate_number).call();
     // console.log("candidate details:", candidatenames); // Access the value here
     return candidatenames;
    } catch (error) {
      console.error("Error calling candidatenames:", error);
    }
  }

  async function callCandidatesCount() {
    try {
      const candidateCount = await contract.methods.candidatecount().call();
      //console.log("Number of candidates:", candidateCount); // Access the value here
      return candidateCount;
    } catch (error) {
      console.error("Error calling candidateCount:", error);
    }
  }

  async function sendCandidatesVote(vote_number,send_address) {
    try {
      const candidatevote = await contract.methods.vote(vote_number).send({from:send_address});
     // console.log("candidate vote:", candidatevote); // Access the value here
     return candidatevote;
    } catch (error) {
      console.error("Error calling candidatevote:", error);
    }
  }
  async function callCandidatesVote(vote_number,send_address) {
    try {
      const candidatevote = await contract.methods.vote(vote_number).call({from:send_address});
    //  console.log("candidate vote:", candidatevote); // Access the value here
    return candidatevote;
    } catch (error) {
      console.error("Error calling candidatevote:", error);
    }
  }
  
  async function sendCandidatesRegister(send_address) {
    try {
      const candidateregister = await contract.methods.voter(send_address).send({from:send_address});
      //console.log("candidate registered:", candidateregister); // Access the value here
      return candidateregister;

      
    } catch (error) {
      console.error("Error calling candidateregister:", error);
    }
  }
  async function callCandidatesRegister(send_address) {
    try {
      const candidateregister = await contract.methods.voter(send_address).call({from:send_address});
      //console.log("candidate registered:", candidateregister); // Access the value here
      return candidateregister;

      
    } catch (error) {
      console.error("Error calling candidateregister:", error);
    }
  }

  async function sendCandidatesNew(name,send_address) {
    try {
      const candidatenew = await contract.methods.addCandidate(name).send({from:send_address});
      //console.log("candidate new:", candidatenew); // Access the value here
      return candidatenew;
    } catch (error) {
      console.error("Error calling candidatenew:", error);
    }
  }
  async function callCandidatesNew(name,send_address) {
    try {
      const candidatenew = await contract.methods.addCandidate(name).call({from:send_address});
     // console.log("candidate new:", candidatenew); // Access the value here
     return candidatenew;
    } catch (error) {
      console.error("Error calling candidatenew:", error);
    }
  }

  var result4 = await callCandidatesCount();
  app.get('/candidate_count', (req, res) => {
     var result4new = result4.toString();
     res.json({ count: result4new });
   });
  //var result1 = await sendCandidatesRegister(send_address);
  
  //var result2 = await sendCandidatesNew("neeti",send_address);
  
  
  
  
  
    
    
    
  app.post('/candidates', async (req, res) => { // <- Add async keyword here
    // Get candidate name from request body
    const candidateNumber1 = req.body.candidateNumber1;
    var xx = Number(candidateNumber1);
    var result5 = await callCandidates(xx);

    // Send response back to the client
    res.json({ message: `Candidate details - ID ${result5.id} , Name - ${result5.name} ` });
});


  
  //var result3 = await sendCandidatesVote(xy,send_address);
  //var result8 = await callCandidatesVote(xy,send_address);
  // Send response back to the client

  
  //var result6 = await callCandidatesRegister(send_address);
  

  //var result7 = await callCandidatesNew("neeti",send_address);
  app.post('/vote', async (req, res) => {
    // Get candidate number from request body
    const candidateNumber = req.body.candidateNumber;
    var xy = Number(candidateNumber);
    var result6 = await callCandidatesRegister(send_address);
    var result3 = await sendCandidatesVote(xy, send_address);
    if(result6 == true){
      res.json({message : "you have already voted"})

    }
    else{
      res.json({message : `congrats ! you have succesfully voted candidate ${xy}`})
      
    }
         
    
  });

  

  

  
  
  //console.log(result1);
  
  //console.log(result2);
  
//  console.log(result3);
  //console.log(result4);
  //console.log(result5);
  
  //console.log(result6);
  
  //console.log(result7);
 // console.log(result8);
  

//};

//deploy().catch((error) => {
  //console.error('Deployment error:', error);
//});






      if (!account) {
          return res.status(400).json({ error: 'Account is required' });
      }
      console.log('Received account:', account);
      // Here you can process the account data as needed
      res.json({ message: 'Address received successfully' });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});






  
  
  


