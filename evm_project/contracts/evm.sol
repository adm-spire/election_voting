// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Election{
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    event eventVote(
        uint indexed _candidateid //it will store it as log not data**
    );
    
    mapping (uint=>Candidate) public candidates;

    uint public candidatecount;

    mapping(address=>bool) public voter;

    constructor() {
        addCandidate("Alice");
        addCandidate("Bob");
    }
    function addCandidate(string memory _name) public{
        candidatecount++;
        candidates[candidatecount] = Candidate(candidatecount, _name, 0);
    }
    function vote(uint _candidateid) public{
        require(voter[msg.sender]==false,"you already voted");
        require(_candidateid>0 && _candidateid<=candidatecount);
        voter[msg.sender] = true;
        candidates[_candidateid].voteCount++;
        emit eventVote(_candidateid);
    }
}