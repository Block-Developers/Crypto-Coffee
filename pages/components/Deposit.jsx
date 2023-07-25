import React, { useState, useEffect } from "react";
import {
  deposit,
  getTotalPlayers,
  getRemainingTime,
  getLastDepositor,
  getPot,
  getPlayerDepositCount,
  getPlayerTotalDeposit,
  getDepositAmount,
  SplitDeposit,
} from "../../config/BlockchainServices";
import { useAccount } from "wagmi";

import CountdownTimer from "./Timer";
import RefreshButton from "./Refresh";

const weiToEth = (wei) => {
  // 1 Ether (ETH) = 10^18 Wei
  const etherInWei = 10n ** 18n;
  const weiBigInt = BigInt(wei);
  const ethValue = Number(weiBigInt) / Number(etherInWei);
  return ethValue;
};
const gweiToEth = (gwei) => {
  // 1 Ether (ETH) = 1,000,000,000 Gwei (Giga-wei)
  const gweiInEther = 10 ** 9;
  const ethValue = gwei / gweiInEther;
  return ethValue.toFixed(5); // Return the value rounded to 5 decimal places
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
};

const useTimer = () => {
  const [timer, setTimer] = useState(0);

  const [gotTime, setGotTime] = useState(false);

  const [isGameEnded, setIsGameEnded] = useState(false);

  const [endGame, setEndGame] = useState(false);

  useEffect(() => {
    if (timer === "00:00") {
      setIsGameEnded(true);
      console.log(timer, isGameEnded);
      setEndGame(true);
    }
  }, [timer]);

  useEffect(() => {
    const handleGetTime = async () => {
      const res = await getRemainingTime();
      const timeInSecond = parseInt(res, 10);
      console.log(timeInSecond);
      setTimer(timeInSecond);
      localStorage.setItem("timerValue", timeInSecond);

      setGotTime(true);
      const time = formatTime(res.toString());
      console.log("rem timme:", time, typeof time);

      if (time === "00:00") {
        console.log(true);
        setEndGame(true);
      }
      console.log(endGame);
      setTimer(time);
    };

    const automateSplitAndUnfreeze = async () => {
      // Check if the game is not frozen and remaining time is 0
      console.log("Timer:", timer);
      const res = await getRemainingTime();
      const time = formatTime(res.toString());
      console.log("rem timme:", time, typeof time);

      if (time === "0" || time === "00:00" || endGame) {
        // Wait for 15 seconds
        console.log("intered timer");
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Call the SplitDeposit function
        try {
          if ("something") {
            console.log("Calling SplitDeposit...");
            const splitTx = await SplitDeposit();
            await splitTx.wait(); // Wait for the transaction to be mined
            console.log("SplitDeposit function called successfully!");

            const res = await getRemainingTime();
            const timeInSecond = parseInt(res, 10);
            console.log(timeInSecond, typeof timeInSecond);
            setTimer(timeInSeconds);
            window.location.reload();
            return;
          }
        } catch (error) {
          console.error("Error in automateSplitAndUnfreeze:", error);
        }
      }
    };

    const intervalId = setInterval(() => {
      handleGetTime();

      automateSplitAndUnfreeze();
    }, 1000); // Update the timer every second

    handleGetTime();
    setGotTime(true);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return { timer, gotTime };
};

const useBlockchainData = () => {
  const { address } = useAccount();
  const [potvalue, setPotvalue] = useState("");
  const [totalPlayers, setTotalPlayers] = useState("");
  const [LastDepositor, setlastDepositor] = useState("");
  const [mydeposit, SetMydeposit] = useState("");

  // const [address, setaddress] = useState("");
  const [depositamount, setdeposit] = useState("");
  useEffect(() => {
    const getPotvalue = async () => {
      const res = await getPot();
      const ethValue = weiToEth(res.toString());
      setPotvalue(ethValue);
    };
    const getLastDepositoraddress = async () => {
      const res = await getLastDepositor();
      setlastDepositor(res);
    };

    const getTotalPlayersfunc = async () => {
      const res = await getTotalPlayers();
      setTotalPlayers(res.toString());
    };
    const getdepo = async () => {
      const res = await getDepositAmount();
      const eth = gweiToEth(res.toString());
      setdeposit(gweiToEth(eth));
    };
    const getIndividualDeposit = async () => {
      const res = await getPlayerTotalDeposit({ address });
      const eth = gweiToEth(res.toString());
      SetMydeposit(gweiToEth(eth));
      console.log("depo", mydeposit);
    };

    const intervalId = setInterval(() => {
      getPotvalue();
      getTotalPlayersfunc();

      getdepo();
      getLastDepositoraddress();
      getIndividualDeposit();
    }, 1000); // Update the data every second

    getPotvalue();
    getTotalPlayersfunc();

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return {
    potvalue,
    totalPlayers,
    LastDepositor,
    mydeposit,

    depositamount,
  };
};

const Deposit = () => {
  const { timer, gotTime } = useTimer();
  const {
    potvalue,
    totalPlayers,
    LastDepositor,
    mydeposit,

    depositamount,
  } = useBlockchainData();

  const [expiryTimestamp, setExpiryTimestamp] = useState(0); // Add expiryTimestamp state
  const [timeInSeconds, settimeInSeconds] = useState(0);

  useEffect(() => {
    // Fetch the expiryTimestamp here and update the state
    const fetchExpiryTimestamp = async () => {
      const res = await getRemainingTime();
      setExpiryTimestamp(res);
    };

    // Fetch the initial expiryTimestamp
    fetchExpiryTimestamp();

    // Fetch the expiryTimestamp every second
    const intervalId = setInterval(fetchExpiryTimestamp, 1000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const handleGetTime = async () => {
      const res = await getRemainingTime();
      const timeInSecond = parseInt(res, 10);
      console.log(timeInSecond, typeof timeInSecond);
      settimeInSeconds(timeInSeconds);
    };
    handleGetTime();
    console.log("checkout");
    console.log(timeInSeconds, timer);
  }, []);

  useEffect(() => {
    console.log(timeInSeconds);
  });

  const isGameEnded = timer === "00:00"; // Check if the timer is at 0:00

  async function changeMetaMaskNetwork() {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xbfc0" }], // Replace with the desired network chainId for Bifrost
      });
    } catch (error) {
      console.error("Error changing network:", error);
      // Handle error or prompt user to switch manually
    }
  }
  const handleClick = async () => {
    console.log("started deposit");
    const getupdatedamount = depositamount;
    // const res = await deposit({ getupdatedamount });
    // console.log(res.toString());

    // Check if MetaMask is installed and enabled
    if (window.ethereum) {
      try {
        // Request the user's permission to access their accounts
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Get the current network ID
        const networkId = await window.ethereum.request({
          method: "net_version",
        });
        console.log(networkId);
        // Check if the current network is "bifrost" (replace 'bifrost' with the desired network name)
        if (networkId === "49088") {
          // Call the deposit function
          const res = await deposit({ getupdatedamount });
          console.log(res.toString());
        } else {
          // Notify the user to switch to the "bifrost" network
          alert("Please switch to the Bifrost network to deposit.");
          await changeMetaMaskNetwork();
          // Optionally, you can provide the user with a link or instructions to switch networks.
          // For example, you can direct them to a guide on how to change networks in MetaMask.
        }
      } catch (error) {
        console.error(error);
        // Handle error (e.g., user rejected the request or something went wrong)
      }
    } else {
      // MetaMask is not installed or not enabled
      alert("Please install MetaMask and connect to it to use this feature.");
      // You can also provide a link to the MetaMask website for installation.
    }
  };

  return (
    <div className="flex flex-col items-center justify-center  pb-0 pt-40 text-white">
      <div className="flex flex-row space-x-20 rounded-lg border-x border-x-white p-5 pb-16">
        {isGameEnded ? (
          <></>
        ) : (
          <div className="">
            <div className="flex flex-col space-y-2 rounded-lg border border-white border-x-white p-8 pb-[50px]">
              <p>My Deposit:</p>
              <p className="rounded-lg bg-green-500 px-6 py-3 text-white shadow-lg">
                {mydeposit}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-2 rounded-lg border border-white border-x-white p-8 ">
          <p>Deposit Amount: </p>
          <button className="rounded-lg bg-green-500 px-6 py-3 text-white shadow-lg">
            {depositamount}
          </button>
        </div>
        <div className="flex flex-col space-y-2 rounded-lg border border-white border-x-white p-8 ">
          <p>Pot Value:</p>
          <button className="rounded-lg bg-green-500 px-6 py-3 text-white shadow-lg">
            {potvalue}
          </button>
        </div>
        <div className="flex flex-col rounded-lg border border-white border-x-white p-8 ">
          <p className="text-center">
            {" "}
            Total Number<br></br> of players:
          </p>
          <button className="rounded-lg bg-green-500 px-6 py-3 text-white shadow-lg">
            {totalPlayers}
          </button>
        </div>
      </div>
      <h1 className="mb-8 pt-5 text-4xl font-bold">Welcome to Bidding App</h1>
      <p className="mb-4 text-lg">Place your bids with cryptocurrency</p>
      <p className="mb-4 text-lg">Win exciting rewards!</p>

      <div>
        {gotTime ? (
          <>
            <>
              <p className="text-center text-xl">Remaining Time:</p>
              {/* <MyTimer expiryTimestamp={timer} gotTime={gotTime} /> */}
              {console.log(timer)}
              {console.log(localStorage.getItem("timerValue"))}
              <CountdownTimer
                initialTime={localStorage.getItem("timerValue")}
              />
            </>
          </>
        ) : (
          <p>Time not got</p>
        )}
      </div>

      <div className="mt-8">
        {isGameEnded ? (
          <>
            <p className="text-center text-xl font-bold text-green-500">
              {" "}
              Last Game Winner: {LastDepositor}
            </p>
            <p className="text-center text-xl font-bold text-red-800">
              Ooops, Game is ended.
              <br /> wait for the game to reset......
            </p>
          </>
        ) : (
          <button
            className="rounded-lg bg-blue-700  px-6 py-3 text-white shadow-lg"
            onClick={handleClick}
          >
            Deposit
          </button>
        )}
      </div>
      <RefreshButton />
    </div>
  );
};

export default Deposit;
