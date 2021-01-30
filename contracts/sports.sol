pragma solidity ^0.5.12;

import "./dai.sol";

contract SportPachisi{
    
    //State of bet
    enum BetState { Open, Closed, Resolved }
    
    //daiContract on network
    address constant private DAI_ADDRESS = 0x49d5EB6f85440233aF194A65Da50CE9e26a00f97;
    
    Dai daiContract;
    
    //Total Number of bets placed
    uint totalBets;  
    
    //Struct of bet
    struct Bet{
        string title;
        string outcome1;
        string outcome2;
        uint totalVolumeOnOutcome1;
        uint totalVolumeOnOutcome2;
        mapping(address => uint) betAmountsOutcome1;        
        mapping(address => uint) betAmountsOutcome2;        
        uint betCloseTime;
        BetState betState;
    }
    
    //totalBets => Bet
    mapping(uint => Bet) public bets;
    

    //Initial bet amount should be above 10 Dai
    modifier initialBetAbove10(uint initialBet){
        require(initialBet >=10, "Initial bet is less than 10");
        _;   
    }
    
    //Contract is is approved to transfer specified amount
    modifier contractApproved(uint betAmount) {
        require(betAmount < daiContract.allowance(msg.sender, address(this)), "This contract is not allowed to transfer specified betAmount");    
        _;
    }
    
    //Specified bet closing time should be after now
    modifier betClosingTimeAfterNow(uint betClosingTime) {
        require(betClosingTime > now, "Bet closing time should be after now");
        _;
    }
    
    
    constructor() public {
        daiContract = Dai(DAI_ADDRESS);
    }
    
    //Function to create a new bet. Anyone can call it.
    //Bet is assumed to be binary
    //_title: Title or description of bet
    //_outcome1: Outcome 1 of bet.
    //_outcome2: Outcome 2 of bet.
    //_betClosingTime: Epoch time when bet will close.
    //_initialBetAmount: Initial amount user is putting in. Should be greater than 10.
    //_initialBet: If(True) User is betting on _outcome1 else User is betting on _outcome2
    //
    //   struct Bet{
    //     string title;
    //     string outcome1;
    //     string outcome2;
    //     uint totalVolumeOnOutcome1;
    //     uint totalVolumeOnOutcome2;
    //     mapping(address => uint) betAmountsOutcome1;        
    //     mapping(address => uint) betAmountsOutcome2;        
    //     uint betCloseTime;
    //     BetState betState;
    // }
    
    function pullMoney(address _from, uint _amount) private {
        daiContract.pull(_from, _amount);
    }
    
    
    function createBet(
        string memory _title, 
        string memory _outcome1, 
        string memory _outcome2, 
        uint _betClosingTime,
        uint _initialBetAmount,
        bool _initialBet) 
            public 
            initialBetAbove10(_initialBetAmount) 
            contractApproved(_initialBetAmount) 
            betClosingTimeAfterNow(_betClosingTime)  {
                
                Bet memory betMemory = Bet(_title, _outcome1, _outcome2, 0, 0, _betClosingTime, BetState.Open);
                bets[totalBets] = betMemory;
                
                Bet storage betStorage = bets[totalBets];
                
                if(_initialBet){
                    betStorage.totalVolumeOnOutcome1 = _initialBetAmount;
                    betStorage.betAmountsOutcome1[msg.sender] = _initialBetAmount;
                }
                else{
                    betStorage.totalVolumeOnOutcome2 = _initialBetAmount;
                    betStorage.betAmountsOutcome2[msg.sender] = _initialBetAmount;
                }
                
                totalBets++;
                pullMoney(msg.sender, _initialBetAmount);
    }
    
    
}
