import Head from "next/head";
import { useRouter } from "next/navigation";

const OrderCompleted = ({ orderId }) => {
  const router = useRouter();

  const navigateToProductsPage = () => {
    // Redirect to the '/products' page
    router.push("/products");
  };
  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center">
      <Head>
        <title>Order Completed</title>
      </Head>

      <div className="bg-white p-8 mt-4 rounded-lg shadow-md max-w-md md:max-w-lg lg:max-w-xl">
        <h1 className="text-2xl font-bold mb-4">Order Completed</h1>
        <p className="text-gray-800 mb-6">
          Thank you for your order with order ID:{" "}
          <span className="font-bold">{orderId}</span>. Your order has been
          successfully completed.
        </p>
        <button
          onClick={navigateToProductsPage}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderCompleted;
