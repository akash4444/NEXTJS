"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useSession, getSession } from "next-auth/react";
import { resetAuth, updateAuth } from "../../redux/auth/authSlice";
import { adminInPages } from "@/constant";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const currentPath = usePathname();
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth || {});
  const [loading, setLoading] = useState(true);
  const isAdmin = role === "admin";

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
      console.log("session", session);
      dispatch(updateAuth({ role: session?.user?.role }));
      setLoading(false);
    };
    if (
      !isAdmin &&
      (adminInPages.includes(currentPath) ||
        currentPath.startsWith("/editProduct/"))
    ) {
      router.push("/products");
    }
    fetchData();
  }, [currentPath]);

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
