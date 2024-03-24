import Head from "next/head";

// Example items data (replace it with your actual data)
const items = [
  { id: 1, name: "Item 1", price: 10 },
  { id: 2, name: "Item 2", price: 15 },
  { id: 3, name: "Item 3", price: 20 },
];

const PlaceOrder = ({ items }) => {
  // Calculate total price of items
  const totalPrice = items.reduce((acc, item) => acc + item.price, 0);

  // Placeholder values for tax, discount, platform fee, and shipping fee
  const tax = 0;
  const discount = 0;
  const platformFee = 0; // Change this value to see the "FREE" label for non-zero platform fee
  const shippingFee = 0; // Change this value to see the "FREE" label for non-zero shipping fee

  // Calculate total cost including tax, discount, platform fee, and shipping fee
  const totalCost = totalPrice + tax - discount + platformFee + shippingFee;

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 mt-4 rounded-lg shadow-md w-full max-w-screen-md mx-auto">
        {/* Items List */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Items:</h2>
          {items.map((item) => (
            <div key={item._id} className="flex justify-between">
              <span>
                {`${item.productName}  `}{" "}
                <span className="text-red-500">{`x  ${item.quantity}`}</span>
              </span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Total Price, Tax, Discount, Platform Fee, Shipping Fee */}
        <div className="border-t border-gray-300 pt-4 mb-4">
          <div className="flex justify-between mb-2">
            <span>Total Price:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tax:</span>
            <span>-</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Discount:</span>
            <span>-</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Platform Fee:</span>
            <span className="font-bold text-green-500">
              {platformFee === 0 ? "FREE" : `$${platformFee}`}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping Fee:</span>
            <span className="font-bold text-green-500">
              {shippingFee === 0 ? "FREE" : `$${shippingFee}`}
            </span>
          </div>
        </div>
        <div className="border-t border-gray-300 pt-2 mb-2"></div>
        {/* Total Cost */}
        <div className="flex justify-between mb-4  bg-gray-200">
          <span className="font-semibold">Total Cost:</span>
          <span className="font-semibold">${totalCost.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
