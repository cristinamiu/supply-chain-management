import { useCallback, useEffect, useState } from "react";
import { prepareSupplyChain } from "../../utils/prepare";

export default function CreateContainer() {
  const [container, setContainer] = useState({
    productName: "",
    price: "",
    quantity: "",
    customerAddress: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setContainer({ ...container, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const [provider, signer, supplyChainContract] = await prepareSupplyChain();

    const _numberOfContainers = await supplyChainContract.containersIndex();
    await _numberOfContainers.wait;

    const tx = await supplyChainContract.createContainer(
      container.productName,
      Number(container.price),
      Number(container.quantity),
      container.customerAddress
    );
    await tx.wait();
    setLoading(false);
  };
  return (
    <div>
      {loading == true ? (
        <div className="spinner-border spinner" role="status">
          <span className="sr-only"></span>
        </div>
      ) : (
        <></>
      )}
      <div className="content">
        <h2>Add new container</h2>
        <div className="row justify-content-md-center mt-4">
          <div className="col-md-4">
            <form>
              <div className="form-group">
                <label>Product Name: </label>
                <input
                  className="form-control"
                  type="text"
                  name="productName"
                  onChange={handleInputChange}
                ></input>
              </div>
              <div className="form-group">
                <label>Cost in Wei: </label>
                <input
                  className="form-control"
                  type="text"
                  name="cost"
                  onChange={handleInputChange}
                ></input>
              </div>
              <div className="form-group">
                <label>Quantity: </label>
                <input
                  className="form-control"
                  type="text"
                  name="quantity"
                  onChange={handleInputChange}
                ></input>
              </div>
              <div className="form-group">
                <label>CustomerAddress: </label>
                <input
                  className="form-control"
                  type="text"
                  name="customerAddress"
                  onChange={handleInputChange}
                ></input>
              </div>
              <button
                className="btn btn-primary mt-3"
                type="button"
                onClick={handleSubmit}
              >
                Create new item
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
