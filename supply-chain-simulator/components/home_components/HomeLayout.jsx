import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { prepareSupplyChain } from "../../utils/prepare";
import { object } from "prop-types";
import Image from "next/image";
import containerPic from "../../public/container.png";

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

function HomeLayout() {
  const [containers, setContainers] = useState([]);
  const [contractInstance, setContractInstance] = useState("");
  const [numberOfContainers, setNumberOfContainers] = useState(0);
  const [loading, setLoading] = useState(false);

  const getSupplyChain = useCallback(async () => {
    setLoading(true);
    const [provider, signer, supplyChainContract] = await prepareSupplyChain();
    const _containers = [];

    setContractInstance(supplyChainContract);

    const _numberOfContainers = await supplyChainContract.containersIndex();
    await _numberOfContainers.wait;

    for (var i = 0; i < _numberOfContainers.toNumber(); i++) {
      const container = await supplyChainContract.containers(i);
      await container.wait;

      _containers.push(container);
    }

    console.log(_containers);
    setContainers(_containers);
    setNumberOfContainers(_numberOfContainers.toNumber());

    console.log("CONTAINERS: ", containers);
    setLoading(false);
  }, [containers]);

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
    switch (DeliveryState[containers[key]._deliveryState]) {
      case "Created":
        await triggerDelivery(key);
    }
  };

  const triggerDelivery = async (key) => {
    setLoading(true);
    const tx = await contractInstance.triggerDelivery(
      key /*{ gasLimit: 2000000}*/
    );
    await tx.wait();

    contractInstance.on("DeliveryStateChanged", onDeliveryStateChange);
    setLoading(false);
  };

  const setViolation = async (key) => {
    setLoading(true);
    const tx = await contractInstance.triggerViolation(
      key /*{ gasLimit: 2000000}*/
    );
    await tx.wait();

    contractInstance.on("ViolationStateChanged", onViolationStateChange);
    setLoading(false);
  };

  useEffect(() => {
    getSupplyChain();
    setLoading(false);
  }, [getSupplyChain]);

  return (
    <div>
      {loading == true ? (
        <div class="spinner-border spinner" role="status">
          <span class="sr-only"></span>
        </div>
      ) : (
        <></>
      )}
      <div>
        <h1>Shipping Containers: {numberOfContainers}</h1>
        <div class="row row-cols-1 row-cols-md-3 g-4">
          {Object.keys(containers).map((key, container) => (
            <div key={container}>
              <div class="col">
                <div class="card h-80">
                  <div class="m-6 d-flex justify-content-center">
                    <Image
                      src={containerPic}
                      alt="Container Image"
                      height={150}
                    />
                  </div>

                  <div class="card-body">
                    <h5 class="card-title">
                      Id: {key}, {containers[key]._productName}
                    </h5>
                    <p class="card-title">
                      Price: {containers[key]._price.toNumber()} wei
                    </p>
                    <p class="card-title">
                      Quantity: {containers[key]._quantity.toNumber()} tons
                    </p>
                    <p class="card-title">
                      Delivery State:{" "}
                      {DeliveryState[containers[key]._deliveryState]}
                    </p>

                    <p class="card-title">
                      Violation State:{" "}
                      {ViolationState[containers[key]._violationState]}
                    </p>
                    <p class="card-title">
                      Customer Address: {containers[key]._customerAddress}
                    </p>
                    <div class="container">
                      <div class="row">
                        <div class=" col-md-6">
                          <button
                            class="btn btn-success btn-block"
                            onClick={() => handleDeliveryState(key)}
                            disabled={
                              DeliveryState[containers[key]._deliveryState] !=
                              "Created"
                            }
                          >
                            Begin Delivery
                          </button>
                        </div>
                        <div class=" col-md-6">
                          <button
                            class="btn btn-danger btn-block"
                            onClick={() => setViolation(key)}
                            disabled={
                              ViolationState[containers[key]._violationState] ==
                                "Violated" ||
                              DeliveryState[containers[key]._deliveryState] !=
                                "In transit"
                            }
                          >
                            Set Violation
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>{" "}
    </div>
  );
}

export default HomeLayout;
