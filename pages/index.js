import Head from "next/head"
import Image from "next/image"
import { Inter } from "next/font/google"
import styles from "@/styles/Home.module.css"
import Header from "@/components/Header"
import { useMoralis, useWeb3Contract } from "react-moralis"
import Card from "@/components/Card"
import Footer from "@/components/Footer"
import { contractAddresses, votingEngAbi, votingAbi } from "@/constants"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

import { useContractEvent, createClient, configureChains, useContractWrite } from "wagmi"
import { hardhat } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"

const inter = Inter({ subsets: ["latin"] })
const supportedChains = ["31337", "5", "80001", "11155111"]

export default function Home() {
    const { provider, webSocketProvider } = configureChains([hardhat], [publicProvider()])

    const client = createClient({
        provider,
        webSocketProvider,
    })

    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const votingEngAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    let [votingsCount, setVotingsCount] = useState(0)
    let [votingAddress, setvotingAddress] = useState("0x")
    let [questions, setQuestions] = useState([])
    let [id, setId] = useState(0)
    let [votingAddresses, setVotingAddresses] = useState([])

    useContractEvent({
        address: votingEngAddress,
        abi: votingEngAbi,
        eventName: "VotingCreated",
        listener(question) {
            console.log(question)
            async function renewCount() {
                const votingsCountFromCall = await getVotingsCount()
                setVotingsCount(Number(votingsCountFromCall))
                setId(Number(votingsCountFromCall) - 1)
            }
            renewCount()
        },
    })

    const { write } = useContractWrite({
        mode: "recklesslyUnprepared",
        address: votingAddress,
        abi: votingAbi,
        functionName: "getQuestion",
    })

    const { runContractFunction: getVotingsCount } = useWeb3Contract({
        abi: votingEngAbi,
        contractAddress: votingEngAddress,
        functionName: "getVotingsCount",
        params: {}, //add question, candidates, duration, quorum through props
        //msgValue: [],
    })

    const { runContractFunction: getVoting } = useWeb3Contract({
        abi: votingEngAbi,
        contractAddress: votingEngAddress,
        functionName: "getVoting",
        params: { index: id },
    })

    const { runContractFunction: getQuestion } = useWeb3Contract({
        abi: votingAbi,
        contractAddress: votingAddress,
        functionName: "getQuestion",
        params: {},
    })

    const { runContractFunction: getVotings } = useWeb3Contract({
        abi: votingEngAbi,
        contractAddress: votingEngAddress,
        functionName: "getVotings",
        params: {},
    })
    const { runContractFunction: getVotingsQuestions } = useWeb3Contract({
        abi: votingEngAbi,
        contractAddress: votingEngAddress,
        functionName: "getVotingsQuestions",
        params: {},
    })

    const {
        runContractFunction: getVotingQuestion,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: votingEngAbi,
        contractAddress: votingEngAddress,
        functionName: "getVotingQuestion",
        params: { index: id },
    })

    useEffect(() => {
        updateQuestions()
    }, [votingsCount])

    useEffect(() => {
        async function updateUIValues() {
            console.log("useEffect updateUIValues start")
            const votingsCountFromCall = await getVotingsCount()
            console.log(`votingsCountFromCall: ${votingsCountFromCall}`)

            console.log(`votingEngAddress: ${votingEngAddress}`)

            setVotingsCount(Number(votingsCountFromCall))
            console.log("Count: " + votingsCount)

            const votingsFromCall = await getVotings()
            setVotingAddresses(votingsFromCall)
            console.log(`votingsFromCall: ${votingsFromCall}`)

            console.log("State questions: ", questions)
            console.log("useEffect updateUIValues end")
        }

        if (isWeb3Enabled) {
            updateUIValues()
        } else {
            setVotingsCount(0)
            setId(0)
            setQuestions([])
        }
    }, [isWeb3Enabled])

    async function updateVotings() {
        const votingAddressesFromCall = await getVotings()
        setVotingAddresses(votingAddressesFromCall)
    }

    async function updateQuestions() {
        const questionsFromCall = await getVotingsQuestions()
        console.log("Qs from call: ", questionsFromCall)
        setQuestions(questionsFromCall)
    }

    useEffect(() => {
        updateQuestions()
    }, [votingAddresses])

    useEffect(() => {
        updateVotings()
    }, [votingEngAddress])

    return (
        <div className={styles.container}>
            <Head>
                <title>Smart Contract Voting System</title>
                <meta name="description" content="Smart Contract Voting System" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />

            <div
                onClick={() => {
                    console.log(votingsCount)
                }}
            >
                Votings count: {votingsCount}
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                {votingsCount > 0 && questions ? (
                    questions.map((q, index) => (
                        <Card key={index} question={q} id={index} link={true} />
                    ))
                ) : (
                    <Card question={"Nothing there"} link={false} />
                )}
            </div>
            <Footer />
        </div>
    )
}
