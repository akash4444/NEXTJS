"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useSession, getSession } from "next-auth/react";
import { resetAuth } from "../../redux/auth/authSlice";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.auth || {});
  const [loading, setLoading] = useState(true);

  const session = useSession();
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/login");
    }
  }, [session.status]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const session = await getSession();
      if (!session) {
        dispatch(resetAuth());
      }

      setLoading(false);
    };

    fetchData();
  }, [router.pathname, session.data]);

  if (loading) {
    return (
      <div>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }
  // Render loading state or children component
  return <>{children}</>;
}
