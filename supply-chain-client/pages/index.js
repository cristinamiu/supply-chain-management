import Head from "next/head";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import HomeLayout from "../components/home_components/HomeLayout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="content">
      <HomeLayout />
    </div>
  );
}
