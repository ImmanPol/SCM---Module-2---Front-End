import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/CustomAssessment.json";

export default function HomePage() {
  const [ethereumWallet, setEthereumWallet] = useState(undefined);
  const [userAccount, setUserAccount] = useState(undefined);
  const [atmContract, setATMContract] = useState(undefined);
  const [userBalance, setUserBalance] = useState(undefined);
  const [error, setError] = useState(null);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        setEthereumWallet(window.ethereum);
      } else {
        setError("Please install Metamask to be able to use this application.");
      }
    } catch (error) {
      setError("Error detecting Metamask: " + error.message);
    }
  };

  const handleAccountChange = (accounts) => {
    if (accounts && accounts.length > 0) {
      setUserAccount(accounts[0]);
      getATMContract(accounts[0]);
    } else {
      setError("No accounts found. Please connect to your Metamask.");
    }
  };

  const connectAccount = async () => {
    try {
      if (!ethereumWallet) {
        throw new Error("MetaMask wallet is required to connect");
      }
      const accounts = await ethereumWallet.request({ method: "eth_requestAccounts" });
      handleAccountChange(accounts);
    } catch (error) {
      setError("Error connecting to account: " + error.message);
    }
  };

  const getATMContract = (account) => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereumWallet);
      const signer = provider.getSigner(account);
      const contract = new ethers.Contract(contractAddress, atmABI, signer);
      setATMContract(contract);
    } catch (error) {
      setError("Error getting ATM contract: " + error.message);
    }
  };

  const getUserBalance = async () => {
    try {
      if (atmContract) {
        const balance = await atmContract.getBalance();
        setUserBalance(balance.toNumber());
      }
    } catch (error) {
      setError("Error getting balance: " + error.message);
    }
  };

  const depositETH = async () => {
    try {
      if (atmContract) {
        const transaction = await atmContract.deposit(1);
        await transaction.wait();
        getUserBalance();
      }
    } catch (error) {
      setError("Error depositing ETH: " + error.message);
    }
  };

  const withdrawETH = async () => {
    try {
      if (atmContract) {
        const transaction = await atmContract.withdraw(1);
        await transaction.wait();
        getUserBalance();
      }
    } catch (error) {
      setError("Error withdrawing ETH: " + error.message);
    }
  };

  const renderUserInterface = () => {
    if (!ethereumWallet) {
      return <p className="message">Please install Metamask to your extention to use this ATM.</p>;
    }

    if (!userAccount) {
      return (
        <button className="connect-button" onClick={connectAccount}>
          Start Connecting Your Metamask Wallet
        </button>
      );
    }

    if (userBalance === undefined) {
      getUserBalance();
    }

    return (
      <div className="user-info">
        <p className="account">Your Account Address: {userAccount}</p>
        <p className="balance">Your Curent Balance: {userBalance}</p>
        <div className="buttons">
          <button onClick={depositETH}>Deposit 1 ETH</button>
          <button onClick={withdrawETH}>Withdraw 1 ETH</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM Project!</h1>
      </header>
      {error && <p className="error">Error: {error}</p>}
      {renderUserInterface()}
      <style jsx>{`
        .container {
          text-align: center;
          margin-top: 50px;
          color: #fff;
          font-family: Arial, sans-serif;
          background-color: #0000FF;
          padding: 20px;
        }
        .message {
          color: red;
          font-weight: bold;
        }
        .connect-button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #00FFFF;
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-size: 16px;
        }
        .connect-button:hover {
          background-color: #00FFFF;
        }
        .user-info {
          margin-top: 20px;
        }
        .account, .balance {
          margin-bottom: 10px;
        }
        .buttons button {
          margin: 5px;
          padding: 10px 20px;
          background-color: #0000FF;
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-size: 16px;
        }
        .buttons button:hover {
          background-color: #00FFFF;
        }
        .error {
          color: red;
          font-weight: bold;
        }
      `}</style>
    </main>
  );
}
