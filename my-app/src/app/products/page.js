import React from "react";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "Product 1",
    description: "Description of product 1.",
    price: 10.99,
    image:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.clearskin.in%2Fblog%2Fsummer-fruits-for-glowing-healthy-skin%2F&psig=AOvVaw3xWiqQT0vgJjZIVv1ouLek&ust=1710507261558000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCMjY_5_m84QDFQAAAAAdAAAAABAD",
    // Add other details as needed
  },
  {
    id: 2,
    name: "Product 2",
    description: "Description of product 2.",
    price: 15.99,
    image:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.clearskin.in%2Fblog%2Fsummer-fruits-for-glowing-healthy-skin%2F&psig=AOvVaw3xWiqQT0vgJjZIVv1ouLek&ust=1710507261558000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCMjY_5_m84QDFQAAAAAdAAAAABAD",
    // Add other details as needed
  },
  // Add more products as needed
];

const ProductsPage = () => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsPage;
