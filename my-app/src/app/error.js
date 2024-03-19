"use client";
import Head from "next/head";

const ErrorPage = ({ statusCode }) => {
  return (
    <div className="flex justify-center items-center">
      <Head>
        <title>Error {statusCode}</title>
      </Head>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Error {statusCode}
        </h1>
        <p className="text-lg mb-8">
          An error occurred while processing your request.
        </p>
        <p className="text-sm text-gray-500">
          Please try again later or contact support if the problem persists.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;

// If you're using TypeScript, you can define the props interface like this:
// interface ErrorPageProps {
//   statusCode: number;
// }
