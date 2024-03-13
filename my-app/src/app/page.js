import Image from "next/image";
import HomeComp from "./CommonComponents/Home";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <HomeComp />
    </main>
  );
}
