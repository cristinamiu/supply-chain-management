import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { prepareSupplyChain } from "../../utils/prepare";
import { object } from "prop-types";
import Image from "next/image";
import containerPic from "../../public/container.png";
import abi from "../../utils/SupplyChainManagement.json";

const DeliveryState = {
  0: "Created",
  1: "In transit",
  2: "Delivered",
  3: "Compliant",
  4: "Non-Compliant",
  5: "Paid",
  6: "In negociation",
};

const ViolationState = {
  0: "Not Violated",
  1: "Violated",
};

const ButtonState = {
  1: "Confirm Arrival",
  2: "Begin Evaluation",
  4: "Begin Negociation",
  3: "Proceed to payment",
};

function HomeLayout() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [containers, setContainers] = useState([]);
  const [contractInstance, setContractInstance] = useState("");
  const [numberOfContainers, setNumberOfContainers] = useState(0);
  const [loading, setLoading] = useState(false);
  const owner = "0xcE39C4adA9e64d1711A56313ac464a4cbe995a44";

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);

        ethereum.on("accountsChanged", (accounts) => {
          console.log("Changed");
          setCurrentAccount(accounts[0]);
        });
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("please install MetaMask");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const onDeliveryStateChange = (_containerIndex, _deliveryState) => {
    console.log(
      "Delivery state set to: " +
        DeliveryState[containers[_containerIndex]._deliveryState] +
        " for container:" +
        _containerIndex
    );
  };

  const onViolationStateChange = (_containerIndex, _violationState) => {
    console.log("Violation triggered for container");
  };

  const handleDeliveryState = async (key) => {
    try {
      switch (DeliveryState[containers[key]._deliveryState]) {
        case "In transit":
          await triggerArrival(key);
        case "Delivered":
          await triggerEvaluation(key);
        case "Non-Compliant":
          await triggerNegociation(key);
        case "Compliant":
          await triggerPayment(key);
      }
    } catch {
      alert("Something went wrong");
    }
  };

  const triggerArrival = async (key) => {
    if (currentAccount != containers[key]._customerAddress.toLowerCase()) {
      alert("You are not the customer!");
    } else {
      setLoading(true);
      const tx = await contractInstance.triggerArrival(key, {
        gasLimit: 2000000,
      });
      await tx.wait();
      contractInstance.on("DeliveryStateChanged", onDeliveryStateChange);
    }
    setLoading(false);
  };

  const triggerEvaluation = async (key) => {
    if (currentAccount != containers[key]._customerAddress.toLowerCase()) {
      alert("You are not the customer!");
    } else {
      setLoading(true);
      const tx = await contractInstance.triggerEvaluation(key, {
        gasLimit: 2000000,
      });
      await tx.wait();
      contractInstance.on("DeliveryStateChanged", onDeliveryStateChange);
    }
    setLoading(false);
  };

  const triggerNegociation = async (key) => {
    if (currentAccount != containers[key]._customerAddress.toLowerCase()) {
      alert("You are not the customer!");
    } else {
      setLoading(true);
      const tx = await contractInstance.triggerNegotiation(key, {
        gasLimit: 2000000,
      });
      await tx.wait();
      contractInstance.on("DeliveryStateChanged", onDeliveryStateChange);
    }
    setLoading(false);
  };

  const triggerPayment = async (key) => {
    if (currentAccount != containers[key]._customerAddress.toLowerCase()) {
      alert("You are not the customer!");
    } else {
      setLoading(true);
      const tx = await contractInstance.triggerPayment(key, {
        value: containers[key]._price,
        gasLimit: 2000000,
      });
      await tx.wait();
      contractInstance.on("DeliveryStateChanged", onDeliveryStateChange);
    }
    setLoading(false);
  };

  const withdraw = async () => {
    const tx = await contractInstance.withdraw();
    await tx.wait();
  };
  const getSupplyChain = useCallback(async () => {
    console.log("bla");
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();

      // const CONTRACT_ADDRESS = "0x9aCA96ad60a5f4E6118BD0eDFff75717649DF2BC";
      const CONTRACT_ADDRESS = "0xBB668385B9A599Cba24E3e87ca4c3863DbD963F6";
      const supplyChainContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi.abi,
        signer
      );
      const _containers = [];

      setContractInstance(supplyChainContract);

      const _numberOfContainers = await supplyChainContract.containersIndex();
      await _numberOfContainers.wait;

      for (var i = 0; i < _numberOfContainers.toNumber(); i++) {
        const container = await supplyChainContract.containers(i);
        await container.wait;

        _containers.push(container);
      }
      setNumberOfContainers(_numberOfContainers.toNumber());
      setContainers(_containers);
      console.log("INDEX", _numberOfContainers);
    } else {
      console.log("BLA");
    }
  }, [containers]);

  useEffect(() => {
    isWalletConnected();
    getSupplyChain();
    setLoading(false);
  }, [getSupplyChain]);

  return (
    <div>
      {loading == true ? (
        <div className="spinner-border spinner" role="status">
          <span className="sr-only"></span>
        </div>
      ) : (
        <></>
      )}
      {currentAccount ? (
        <div>
          {currentAccount.toLowerCase() == owner.toLowerCase() ? (
            <>
              <button className="btn btn-dark btn-lg" onClick={withdraw}>
                {" "}
                Withdraw{" "}
              </button>
              <h1>Shipping Containers: {numberOfContainers}</h1>

              <div className="row row-cols-1 row-cols-md-3 g-4">
                {Object.keys(containers).map((key, container) => (
                  <div key={container}>
                    <div className="col">
                      <div className="card h-80">
                        <div className="m-6 d-flex justify-content-center">
                          <Image
                            src={containerPic}
                            alt="Container Image"
                            height={150}
                          />
                        </div>

                        <div className="card-body">
                          <h5 className="card-title">
                            Id: {key}, {containers[key]._productName}
                          </h5>
                          <p className="card-title">
                            Price: {containers[key]._price.toNumber()} wei
                          </p>
                          <p className="card-title">
                            Quantity: {containers[key]._quantity.toNumber()}{" "}
                            tons
                          </p>
                          <p className="card-title">
                            Delivery State:{" "}
                            {DeliveryState[containers[key]._deliveryState]}
                          </p>

                          <p className="card-title">
                            Violation State:{" "}
                            {ViolationState[containers[key]._violationState]}
                          </p>
                          <p className="card-title">
                            Customer Address: {containers[key]._customerAddress}
                          </p>

                          {DeliveryState[containers[key]._deliveryState] ==
                            "Created" ||
                          DeliveryState[containers[key]._deliveryState] ==
                            "In negociation" ||
                          DeliveryState[containers[key]._deliveryState] ==
                            "Paid" ? (
                            <></>
                          ) : (
                            <div className=" col-md-6">
                              <button
                                className="btn btn-success btn-block"
                                onClick={() => handleDeliveryState(key)}
                              >
                                {ButtonState[containers[key]._deliveryState]}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1>Shipping Containers: {numberOfContainers}</h1>
              <div className="row row-cols-1 row-cols-md-3 g-4">
                {Object.keys(containers)
                  .filter((c, d) => {
                    return (
                      containers[c]._customerAddress.toLowerCase() ==
                      currentAccount
                    );
                  })
                  .map((key, container) => (
                    <div key={container}>
                      <div className="col">
                        <div className="card h-80">
                          <div className="m-6 d-flex justify-content-center">
                            <Image
                              src={containerPic}
                              alt="Container Image"
                              height={150}
                            />
                          </div>

                          <div className="card-body">
                            <h5 className="card-title">
                              Id: {key}, {containers[key]._productName}
                            </h5>
                            <p className="card-title">
                              Price: {containers[key]._price.toNumber()} wei
                            </p>
                            <p className="card-title">
                              Quantity: {containers[key]._quantity.toNumber()}{" "}
                              tons
                            </p>
                            <p className="card-title">
                              Delivery State:{" "}
                              {DeliveryState[containers[key]._deliveryState]}
                            </p>

                            <p className="card-title">
                              Violation State:{" "}
                              {ViolationState[containers[key]._violationState]}
                            </p>
                            <p className="card-title">
                              Customer Address:{" "}
                              {containers[key]._customerAddress}
                            </p>

                            {DeliveryState[containers[key]._deliveryState] ==
                              "Created" ||
                            DeliveryState[containers[key]._deliveryState] ==
                              "In negociation" ||
                            DeliveryState[containers[key]._deliveryState] ==
                              "Paid" ? (
                              <></>
                            ) : (
                              <div className=" col-md-6">
                                <button
                                  className="btn btn-success btn-block"
                                  onClick={() => handleDeliveryState(key)}
                                >
                                  {ButtonState[containers[key]._deliveryState]}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <button className="btn btn-dark btn-lg" onClick={connectWallet}>
          {" "}
          Connect your wallet{" "}
        </button>
      )}
    </div>
  );
}

export default HomeLayout;
