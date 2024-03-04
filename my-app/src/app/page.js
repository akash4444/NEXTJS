"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const navigate = (param = "/") => {
    router.push(param);
  };
  return <main className={styles.main}></main>;
}
