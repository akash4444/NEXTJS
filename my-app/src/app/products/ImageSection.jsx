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
          loading="lazy"
          onError={(event) => {
            setImageExists(false);
          }}
        />
      ) : (
        <>
          {loadingImage && (
            <LoadingSpinner loadingMsg="Please wait. Image loading..." />
          )}

          <Image
            src={`/images/default.png`}
            alt={productName}
            loading="lazy"
            width={loadingImage ? 10 : 150}
            height={loadingImage ? 10 : 150}
            onLoad={() => setLoadingImage(false)}
          />
        </>
      )}
    </div>
  );
};

export default ImageSection;
