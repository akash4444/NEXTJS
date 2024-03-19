import React from "react";

const Home = () => {
  return (
    <div>
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: 'url("/homepage.jpg")' }}
      >
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-5xl font-bold text-white">
            Welcome to Fresh Fare Shop
          </h1>
          <p className="text-xl mt-4 text-white">
            Discover the freshest fruits, vegetables, and many more from around
            the world.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
