// pages/index.js (or any other page component)
import React, { useState, useEffect } from "react";
import Image from "next/image";
const ImageSection = ({ image, productName }) => {
  const [imageExists, setImageExists] = useState(true);

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
