import { useEffect, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { contractAddresses, votingEngAbi, votingAbi } from "@/constants"
import Header from "./Header"

export default function VotingInfo({ id }) {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const votingEngAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    let [votingAddress, setvotingAddress] = useState("0x")
    let [question, setQuestion] = useState("")
    let [candidates, setCandidates] = useState([])
    let [duration, setDuration] = useState(0)
    let [quorum, setQuorum] = useState(0)

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    })

    async function updateUI() {
        const addressVotingFromCall = await getVoting()
        setvotingAddress(addressVotingFromCall)

        const questionFromCall = await getQuestion()
        setQuestion(questionFromCall)

        const candidatesFromCall = await getCandidates()
        setCandidates(candidatesFromCall)

        const timeStartFromCall = parseInt(await getTimeStart())
        const timeEndFromCall = parseInt(await getTimeEnd())
        const durationFromCall = timeEndFromCall - timeStartFromCall
        setDuration(durationFromCall)

        const quorumFromCall = parseInt(await getQuorum())
        setQuorum(quorumFromCall)
    }

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

    const { runContractFunction: getCandidates } = useWeb3Contract({
        abi: votingAbi,
        contractAddress: votingAddress,
        functionName: "getCandidates",
        params: {},
    })

    const { runContractFunction: getQuorum } = useWeb3Contract({
        abi: votingAbi,
        contractAddress: votingAddress,
        functionName: "getQuorum",
        params: {},
    })

    const { runContractFunction: getTimeStart } = useWeb3Contract({
        abi: votingAbi,
        contractAddress: votingAddress,
        functionName: "getTimeStart",
        params: {},
    })

    const { runContractFunction: getTimeEnd } = useWeb3Contract({
        abi: votingAbi,
        contractAddress: votingAddress,
        functionName: "getTimeEnd",
        params: {},
    })

    return (
        <>
            <Header />
            <div className="py-4 px-4 font-bold text-3xl">
                <div>Address: {votingAddress}</div>
                <div>Question: {question}</div>
                {candidates && candidates.map((el) => <div key={el}>Candidate: {el}</div>)}
                {/* <div>Candidate 1: {candidates && candidates[0]}</div>
                <div>Candidate 2: {candidates && candidates[1]}</div> */}
                <div>Duration: {duration}</div>
                <div>Quorum: {quorum}</div>
                <div>ID: {id}</div>
                {/* <button
                    onClick={async () => {
                        setvotingAddress(
                            await getVoting({ onError: (error) => console.log(error) })
                        )
                    }}
                ></button> */}
            </div>
        </>
    )
}
