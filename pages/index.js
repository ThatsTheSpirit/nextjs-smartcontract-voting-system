import Head from "next/head"
import Image from "next/image"
import { Inter } from "next/font/google"
import styles from "@/styles/Home.module.css"
import Header from "@/components/Header"
// import Navbar from "@/components/Navbar"
import { useMoralis } from "react-moralis"
import CreateVoting from "@/components/CreateVoting"

const inter = Inter({ subsets: ["latin"] })
const supportedChains = ["31337", "5", "80001", "11155111"]

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Smart Contract Voting System</title>
                <meta name="description" content="Smart Contract Voting System" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* <Navbar /> */}
            <Header />
            <CreateVoting />
        </div>
    )
}
