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

import { useContractEvent, createClient, configureChains, useContractRead } from "wagmi"
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
        async function test() {
            console.log("useEffect test start")
            console.log(votingsCount)
            //for (let id = 0; id < votingsCount; id++) {
            console.log(id)
            //const addressVotingFromCall = await getVoting()
            //setvotingAddress(addressVotingFromCall)

            const questionFromCall = await getVotingQuestion()
            console.log("Question: " + questionFromCall)
            if (questionFromCall) {
                setQuestions([...questions, questionFromCall])
            }

            console.log(questions)
            console.log(isLoading)
            console.log(isFetching)
            //setId(id + 1)
            //}
            console.log("useEffect test start")
        }
        test()
    }, [votingsCount])

    useEffect(() => {
        async function updateUIValues() {
            console.log("useEffect updateUIValues start")
            const votingsCountFromCall = await getVotingsCount()
            console.log(`votingsCountFromCall: ${votingsCountFromCall}`)

            console.log(`votingEngAddress: ${votingEngAddress}`)

            setVotingsCount(Number(votingsCountFromCall))
            console.log("Count: " + votingsCount)

            //if (votingsCount > 0) {
            let _questions = [...questions]

            const votingsFromCall = await getVotings()

            console.log(`votingsFromCall: ${votingsFromCall}`)

            for (id = 0; id < votingsCount; id++) {
                //setId(id)
                console.log(id)
                //const addressVotingFromCall = await getVoting()
                //setvotingAddress(addressVotingFromCall)

                const questionFromCall = await getVotingQuestion({ params: { index: id } })

                console.log("Question: " + questionFromCall)

                _questions.push(questionFromCall)
                console.log("Questions: ", _questions)

                console.log(isLoading)
                console.log(isFetching)
                //setId(id + 1)
                //id++
            }
            setQuestions(_questions)
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
                {votingsCount > 0 ? (
                    questions.map((q, index) => <Card key={index} question={q} id={index} />)
                ) : (
                    <Card question={"Nothing there"} />
                )}
            </div>
            <Footer />
        </div>
    )
}
