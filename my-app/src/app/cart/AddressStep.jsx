import { useState } from "react";
import { Modal, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AddressForm, AddressList } from "../CommonComponents/Address";

const AddressPage = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const AddressModal = ({ open, handleClose, type = "Add" }) => {
    return (
      <Modal open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <div className="bg-white rounded-md p-4 overflow-y-auto max-h-full">
          <div className="flex justify-end">
            <Button onClick={handleClose}>
              <CloseIcon />
            </Button>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {`${type} Address`}
          </h2>
          <AddressForm />
        </div>
      </Modal>
    );
  };
  return (
    <div className="container mx-auto p-4">
      <AddressList />
      <AddressModal open={openModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default AddressPage;
