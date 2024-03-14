"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const authData = useSelector((state) => state.auth || {});
  const [loading, setLoading] = useState(true);
  const token = window.sessionStorage.getItem("token");
  const userId = window.sessionStorage.getItem("userId");

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(false);
      if (!token || !userId) {
        router.push("/login"); // Redirect to login if not authenticated
      }
    };

    checkAuth();
  }, [authData, token, userId]);

  // Render loading state or children component
  return (
    <>
      {loading ? (
        <div>
          <div>Loading...</div>
          <div>Loading...</div> <div>Loading...</div> <div>Loading...</div>{" "}
          <div>Loading...</div> <div>Loading...</div> <div>Loading...</div>{" "}
          <div>Loading...</div> <div>Loading...</div> <div>Loading...</div>{" "}
          <div>Loading...</div> <div>Loading...</div> <div>Loading...</div>{" "}
          <div>Loading...</div> <div>Loading...</div>
        </div>
      ) : (
        children
      )}
    </>
  );
}
