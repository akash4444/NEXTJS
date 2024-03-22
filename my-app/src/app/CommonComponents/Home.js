import React from "react";

const Home = () => {
  return (
    <div>
      <div
        className="relative min-w-[350px] md:min-w-auto bg-contain bg-center bg-no-repeat  h-[400px] flex justify-center items-center"
        style={{ backgroundImage: "url('/images/logo.png')" }}
      >
        <div className="container md:mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl md:text-5xl font-bold text-black">
            Welcome to Fresh Fare Shop
          </h1>
          <p className="text-xl mt-4 text-black">
            Discover the freshest fruits, vegetables, and many more from around
            the world.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
