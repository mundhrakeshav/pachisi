import React, { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { ProviderModalContext } from "../../context/providerModalContext";
import { Web3Context } from "../../context/web3Context";

const ProviderModal = () => {
  const { setModalShow, modalShow } = useContext(ProviderModalContext);
  const { connectMetamask, connectPortis } = useContext(Web3Context);

  return (
    <Modal
      show={modalShow}
      onHide={() => {
        setModalShow(false);
      }}>
      <Modal.Header closeButton>
        <Modal.Title>Connect to web3</Modal.Title>
      </Modal.Header>
      <Modal.Body>Heyy!, How do you wanna connect?</Modal.Body>
      <Modal.Footer>
        <Button
          variant="dark"
          onClick={() => {
            setModalShow(false);
            connectMetamask();
          }}>
          MetaMask
        </Button>

        <Button
          variant="dark"
          onClick={() => {
            setModalShow(false);
            connectPortis();
          }}>
          Portis
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProviderModal;
