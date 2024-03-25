import { useEffect, useState } from "react";
import { Modal, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AddressForm, AddressList } from "../CommonComponents/Address";
import {
  addAddress,
  getAddress,
  editAddress,
  deleteAddress,
} from "../commonFunctions/commonFunctions";
import { LoadingSpinner, AlertModal } from "../CommonComponents";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const AddressPage = ({
  selectedAddress = {},
  setSelectedAddress = () => {},
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn, userId, role } = useSelector((state) => state.auth || {});
  const address = useSelector((state) => state.address || []);

  const isAdmin = role === "admin";
  const [typeModal, setTypeModal] = useState("");
  const [submittingAddress, setSubmittingAddress] = useState(false);
  const [editData, setEditData] = useState({});
  const [deleteAddressModal, setDeleteAddressModal] = useState("");
  const [deletingAddress, setDeletingAddress] = useState(false);

  const handleOpenModal = (type) => {
    setTypeModal(type);
  };

  const handleCloseModal = () => {
    setTypeModal("");
    setEditData({});
  };

  const saveAddress = async (data, type) => {
    setSubmittingAddress(true);
    const payload = {
      ...data,
      userId,
    };
    if (type === "Add") {
      await addAddress(dispatch, payload);
    } else {
      await editAddress(dispatch, { ...payload, _id: editData._id });
    }

    setSubmittingAddress(false);
    handleCloseModal();
  };
  const AddressModal = ({
    open,
    handleClose,
    type = "Add",
    submittingAddress,
    editData = {},
  }) => {
    return (
      <Modal open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <div className="bg-white rounded-md p-4 overflow-y-auto max-h-full">
          <div className="flex justify-end">
            <IconButton
              disabled={submittingAddress}
              color="error"
              onClick={handleClose}
              aria-label="delete"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {`${type} Address`}
          </h2>
          <AddressForm
            type={type}
            saveAddress={saveAddress}
            submittingAddress={submittingAddress}
            editData={editData}
          />
        </div>
      </Modal>
    );
  };

  const openEditModal = (data, type) => {
    setEditData(data);
    handleOpenModal(type);
  };

  const openDeleteAlert = (data) => {
    setDeleteAddressModal(data._id);
  };

  const deleteUserAddress = async () => {
    const payload = { userId, addressId: deleteAddressModal };
    setDeletingAddress(true);
    await deleteAddress(dispatch, payload);
    setDeletingAddress(false);
    setDeleteAddressModal("");
  };

  return (
    <div className="container mx-auto p-0 md:py-4">
      {deleteAddressModal && (
        <AlertModal
          open={deleteAddressModal}
          yesbtn="Yes, I'm sure"
          nobtn="No, cancel"
          message="Are you sure you want to delete address ?"
          closeButton={() => setDeleteAddressModal("")}
          submitButton={() => deleteUserAddress()}
          loading={deletingAddress}
          setLoading={setDeletingAddress}
          loadingMsg="Please wait, Address deleting in progress..."
        />
      )}
      <AddressList
        handleEditAddClick={(type) => handleOpenModal(type)}
        handleDelete={openDeleteAlert}
        handleEdit={openEditModal}
        setSelectedAddress={setSelectedAddress}
        selectedAddress={selectedAddress}
        typeModal={typeModal}
        address={address}
      />
      <AddressModal
        open={Boolean(typeModal)}
        handleClose={handleCloseModal}
        type={typeModal}
        submittingAddress={submittingAddress}
        editData={editData}
      />
    </div>
  );
};

export default AddressPage;
