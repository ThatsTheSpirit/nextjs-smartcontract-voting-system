import Head from "next/head"
import Image from "next/image"
import { Inter } from "next/font/google"
import styles from "@/styles/Home.module.css"
import Header from "@/components/Header"
// import Navbar from "@/components/Navbar"
import { useMoralis } from "react-moralis"
import CreateVoting from "@/components/CreateVoting"
import Card from "@/components/Card"
import Footer from "@/components/Footer"

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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                <Card />
                <Card />
                <Card />
                <Card />
            </div>
            <Footer />
        </div>
    )
}
