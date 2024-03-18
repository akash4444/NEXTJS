// pages/index.js (or any other page component)
import React, { useState, useEffect } from "react";
import Image from "next/image";
const ImageSection = ({ image, productName }) => {
  const [imageExists, setImageExists] = useState(true);

  useEffect(() => {
    const checkImageExists = async () => {
      try {
        const response = await fetch(`/images/${image}`); // Specify the image path
        if (!response.ok) {
          // If the image doesn't exist, set imageExists to false
          setImageExists(false);
        }
      } catch (error) {
        console.error("Error checking image existence:", error);
        setImageExists(false);
      }
    };

    // checkImageExists();
  }, []);

  return (
    <div>
      {imageExists ? (
        <Image
          src={`/images/${image}`}
          alt={productName}
          width={150}
          height={150}
          priority="high"
          onError={(event) => {
            setImageExists(false);
          }}
        />
      ) : (
        <Image
          src={`/images/default.png`}
          alt={productName}
          width={150}
          priority="high"
          height={150}
        />
      )}
    </div>
  );
};

export default ImageSection;
