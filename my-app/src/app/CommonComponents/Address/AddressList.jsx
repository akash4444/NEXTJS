// components/AddressList.js
import { useState } from "react";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AddressList = ({
  handleAddNewAddress = () => {},
  handleDelete = () => {},
  handleEdit = () => {},
  setSelectedAddress = () => {},
  selectedAddress,
}) => {
  const [addresses, setAddresses] = useState([
    { id: 1, address: "123 Main St", city: "New York", selected: false },
    { id: 2, address: "456 Elm St", city: "Los Angeles", selected: false },
    { id: 3, address: "789 Oak St", city: "Chicago", selected: false },
  ]);

  const handleSelect = (id) => {
    setSelectedAddress(
      addresses.map((address) =>
        address.id === id
          ? { ...address, selected: !address.selected }
          : address
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      {addresses.map((address) => (
        <div
          key={address.id}
          className="flex items-center flex-wrap border-b border-gray-200 py-2"
        >
          <div className="w-full md:w-auto flex items-center mb-2 md:mb-0">
            <input
              type="radio"
              id={`address-${address.id}`}
              checked={address.selected}
              onChange={() => handleSelect(address)}
              className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded mr-2"
            />
          </div>
          <div className="w-full md:w-auto flex-1 md:flex-none md:ml-4">
            <div className="text-lg font-semibold">{address.address}</div>
            <div className="text-gray-600">{address.city}</div>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <IconButton
              color="error"
              onClick={() => handleDelete(address)}
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              color="primary"
              aria-label="edit"
              onClick={() => handleEdit(address)}
            >
              <EditIcon />
            </IconButton>
          </div>
        </div>
      ))}
      <div className="text-right mt-4">
        <button
          onClick={() => handleAddNewAddress()}
          className="px-4 py-2 text-blue-500 cursor-pointer rounded-md"
        >
          Add New Address
        </button>
      </div>
    </div>
  );
};

export default AddressList;
