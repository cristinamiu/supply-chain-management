// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import "./Ownable.sol";

contract SupplyChainManagement is Ownable {
    enum DeliveryState {Created, InTransit, Delivered, Compliant, NonCompliant, Paid, InNegociation}
    enum ViolationState {NotViolated, Violated}

    struct ShippingContainer {
        string _productName;
        uint _price;
        uint _quantity;
        address _customerAddress;
        DeliveryState _deliveryState;
        ViolationState _violationState;
    }

    mapping(uint => ShippingContainer) public containers;
    uint public containersIndex;

    event DeliveryStateChanged(uint _containerIndex, uint _deliveryState);
    event ViolationStateChanged(uint _containerIndex, uint _violationState);

    function createContainer(string memory _productName, uint _price, uint _quantity, address _customerAddress) public onlyOwner {
        containers[containersIndex]._productName = _productName;
        containers[containersIndex]._price = _price;
        containers[containersIndex]._quantity = _quantity;
        containers[containersIndex]._customerAddress = _customerAddress;
        containers[containersIndex]._deliveryState = DeliveryState.Created;
        containers[containersIndex]._violationState = ViolationState.NotViolated;

        emit DeliveryStateChanged(containersIndex, uint(containers[containersIndex]._deliveryState));
        emit DeliveryStateChanged(containersIndex, uint(containers[containersIndex]._violationState));

        containersIndex++;
    }

    function triggerDelivery(uint _containerId) public onlyOwner {
        require(containers[_containerId]._deliveryState == DeliveryState.Created, "Cannot trigger delivery, container further in the chain.");
        containers[_containerId]._deliveryState = DeliveryState.InTransit;

        emit DeliveryStateChanged(_containerId, uint(containers[_containerId]._deliveryState));
    }

    function triggerViolation(uint _containerId) public onlyOwner {
        require(containers[_containerId]._deliveryState == DeliveryState.InTransit, "Violation cannot happen outside the InTransit state!");
        containers[_containerId]._violationState = ViolationState.Violated;

        emit ViolationStateChanged(_containerId, uint(containers[_containerId]._violationState));
    }

    function triggerArrival(uint _containerId) public {
        require(containers[_containerId]._customerAddress == msg.sender, "You are not the customer!");
        require(containers[_containerId]._deliveryState == DeliveryState.InTransit, "The item must be in transit");

        containers[_containerId]._deliveryState = DeliveryState.Delivered;
        emit DeliveryStateChanged(_containerId, uint(containers[_containerId]._deliveryState));
    }

    function triggerEvaluation(uint _containerId) public {
        require(containers[_containerId]._deliveryState == DeliveryState.Delivered, "The item must be delivered to evaluate");
        require(containers[_containerId]._customerAddress == msg.sender, "You are not the customer!");

        if(containers[_containerId]._violationState == ViolationState.Violated) {
            containers[_containerId]._deliveryState = DeliveryState.NonCompliant;
        } else if (uint(containers[_containerId]._violationState) == uint(ViolationState.NotViolated)) {
            containers[_containerId]._deliveryState = DeliveryState.Compliant;
        }

        emit DeliveryStateChanged(_containerId, uint(containers[_containerId]._deliveryState));
    }

    function triggerPayment(uint _containerId) public payable {
        require(containers[_containerId]._deliveryState == DeliveryState.Compliant, "Non compliant for payment!");
        require(containers[_containerId]._customerAddress == msg.sender, "You are not the customer!");
        require(containers[_containerId]._price == msg.value, "Only full payments!");  

        containers[_containerId]._deliveryState = DeliveryState.Paid;
        emit DeliveryStateChanged(_containerId, uint(containers[_containerId]._deliveryState));
    }

    function triggerNegotiation(uint _containerId) public {
        require(containers[_containerId]._deliveryState == DeliveryState.NonCompliant, "Product must be non-compliant for negociation!");
        require(containers[_containerId]._customerAddress == msg.sender, "You are not the customer!");

        containers[_containerId]._deliveryState = DeliveryState.InNegociation;
        emit DeliveryStateChanged(_containerId, uint(containers[_containerId]._deliveryState));
    }

    function getBalance() public view onlyOwner returns(uint) {
        return address(this).balance;
    }

    function withdraw() public onlyOwner {
        _owner.transfer(getBalance());
    }
}