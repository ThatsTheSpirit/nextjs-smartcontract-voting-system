import { useEffect, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { contractAddresses, votingEngAbi, votingAbi } from "@/constants"
import Header from "./Header"
import Radio from "./Radio"

export default function VotingInfo({ id }) {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const votingEngAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    let [votingAddress, setvotingAddress] = useState("0x")
    let [question, setQuestion] = useState("")
    let [candidates, setCandidates] = useState([])
    let [timeEnd, setTimeEnd] = useState("")
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

        //const timeStartFromCall = parseInt(await getTimeStart())
        const timeEndFromCall = Number(await getTimeEnd())

        const dateEnd = new Date(timeEndFromCall).toLocaleDateString()

        //const durationFromCall = timeEndFromCall - timeStartFromCall
        //setDuration(durationFromCall)
        setTimeEnd(dateEnd)

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
            <div className="mt-2 my-0 mx-auto flex flex-col content-center items-center rounded-lg divide-y w-2/3 divide-gray-100 border-green-200 bg-zinc-100">
                <div className="w-3/4">Address: {votingAddress}</div>
                <div className="w-3/4">Question: {question}</div>
                <div className="w-3/4">
                    {candidates &&
                        candidates.map((el, index) => (
                            <Radio key={index} text={el} index={index} />
                        ))}
                </div>
                {/* {candidates && candidates.map((el) => <div key={el}>Candidate: {el}</div>)} */}
                <div className="w-3/4">Time end: {timeEnd}</div>
                <div className="w-3/4">Quorum: {quorum}</div>
                <div className="w-3/4">ID: {id}</div>
            </div>
        </>
    )
}
