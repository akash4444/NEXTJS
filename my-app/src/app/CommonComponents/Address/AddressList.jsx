// components/AddressList.js
import { useState } from "react";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AddressList = ({
  handleEditAddClick = () => {},
  handleDelete = () => {},
  handleEdit = () => {},
  setSelectedAddress = () => {},
  selectedAddress = {},
  address = [],
}) => {
  const handleSelect = (addr) => {
    setSelectedAddress(addr);
  };

  return (
    <div className="container mx-auto">
      {address.length === 0 && (
        <p className="flex items-center justify-center flex-wrap py-2">
          No address available.Please add address.
        </p>
      )}
      {address.map((addr) => (
        <div
          key={addr._id}
          className="flex items-center justify-center flex-wrap py-2"
        >
          <div className="flex bg-gray-100 py-6 px-3 rounded-md shadow-md w-full md:w-full flex-1 md:flex-none md:ml-4">
            <div className="w-8 flex items-center mb-2 md:mb-0">
              <input
                type="radio"
                id={`address-${addr._id}`}
                checked={addr._id === selectedAddress._id}
                onChange={() => handleSelect(addr)}
                className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
              />
            </div>
            <div className="">
              <h4 className="font-semibold">{`${addr.firstName} ${addr.lastName}`}</h4>

              <p className="">{addr.address}</p>

              <p className="">{addr.locality}</p>
              <p className="">
                {addr.city} - {addr.pinCode}
              </p>
              <p className="">{addr.state}</p>

              <p className="">Mobile #:{addr.mobileNumber}</p>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <IconButton
                color="error"
                onClick={() => handleDelete(addr)}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="edit"
                onClick={() => handleEdit(addr, "Edit")}
              >
                <EditIcon />
              </IconButton>
            </div>
          </div>
        </div>
      ))}
      <div className="text-right mt-4">
        <button
          onClick={() => handleEditAddClick("Add")}
          className="px-4 py-2 text-blue-500 cursor-pointer rounded-md"
        >
          Add New Address
        </button>
      </div>
    </div>
  );
};

export default AddressList;
