"use client";
import React from "react";
import { Button, IconButton } from "@mui/material";
import ShoppingCart from "@mui/icons-material/ShoppingCart";

const CartIcon = ({ count = 55 }) => {
  return (
    <div className="relative">
      <ShoppingCart color="primary" sx={{ fontSize: 36 }} />
      {count > 0 && (
        <div className="absolute top-0 right-0 bg-red-500 rounded-full text-white w-4 h-4 flex items-center justify-center text-xs">
          {count}
        </div>
      )}
    </div>
  );
};

export default CartIcon;
