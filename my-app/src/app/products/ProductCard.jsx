const ProductCard = ({ image, name, description, category, price }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        className="w-full h-48 object-cover object-center"
        src={image}
        alt={name}
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{name}</h2>
        <p className="text-gray-600 mb-2">{description}</p>
        <p className="text-gray-600 mb-2">Category: {category}</p>
        <p className="text-gray-800 font-semibold">${price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
