// pages/index.js (or any other page component)
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { LoadingSpinner } from "../CommonComponents";
const ImageSection = ({ image, productName }) => {
  const [imageExists, setImageExists] = useState(true);
  const [loadingImage, setLoadingImage] = useState(true);

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
        <>
          {loadingImage && <LoadingSpinner loadingMsg="Loading..." />}

          <Image
            src={`/images/default.png`}
            alt={productName}
            width={loadingImage ? 10 : 150}
            priority="high"
            height={loadingImage ? 10 : 150}
            onLoad={() => setLoadingImage(false)}
          />
        </>
      )}
    </div>
  );
};

export default ImageSection;
