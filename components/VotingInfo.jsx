import { useEffect, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { contractAddresses, votingEngAbi, votingAbi } from "@/constants"
import { useNotification } from "web3uikit"
import { useContractEvent, createClient, configureChains } from "wagmi"
import { hardhat } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
import Header from "./Header"
import Radio from "./Radio"

export default function VotingInfo({ id }) {
    const { provider, webSocketProvider } = configureChains([hardhat], [publicProvider()])

    const client = createClient({
        provider,
        webSocketProvider,
    })

    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const votingEngAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    let [votingAddress, setvotingAddress] = useState("0x")
    let [question, setQuestion] = useState("")
    let [candidates, setCandidates] = useState([])
    let [timeEnd, setTimeEnd] = useState("")
    let [quorum, setQuorum] = useState(0)
    let [voted, setVoted] = useState(false)
    let [candidate, setCandidate] = useState(0)
    const dispatch = useNotification()

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    })

    useEffect(() => {
        updateVoterVoted()
    }, [account])

    useEffect(() => {
        async function updateVoting() {
            const addressVotingFromCall = await getVoting()
            setvotingAddress(addressVotingFromCall)
        }
        updateVoting()
        console.log("Address: " + votingAddress)
        updateVoterVoted()
    }, [isWeb3Enabled])

    async function updateVoterVoted() {
        const voterVotedFromCall = await getVoterVoted()
        console.log(`Voted: ${voterVotedFromCall}`)
        setVoted(voterVotedFromCall)
    }

    async function updateUI() {
        //const addressVotingFromCall = await getVoting()
        //setvotingAddress(addressVotingFromCall)

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

        const voterVotedFromCall = await getVoterVoted()
        console.log(`Voted: ${voterVotedFromCall}`)
        setVoted(voterVotedFromCall)
    }

    function handleVote(e) {
        e.preventDefault()
        console.log("Vote for " + candidate)

        async function sendVote() {
            await voteFor({
                onSuccess: handleSuccess,
                onError: (error) => {
                    console.log(error)
                },
            })
        }
        sendVote()
    }

    useContractEvent({
        address: votingAddress,
        abi: votingAbi,
        eventName: "VoterVoted",
        listener() {
            console.log("Voted!")
            setVoted(true)
        },
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

    const { runContractFunction: getVoterVoted } = useWeb3Contract({
        abi: votingAbi,
        contractAddress: votingAddress,
        functionName: "getVoterVoted",
        params: { voter: account },
    })

    const { runContractFunction: voteFor } = useWeb3Contract({
        abi: votingAbi,
        contractAddress: votingAddress,
        functionName: "voteFor",
        params: { _candidate: candidate },
    })

    const handleNewNotification = () => {
        dispatch({
            type: "success",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            //updateUIValues()
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Header />
            <div className="mt-2 my-0 mx-auto flex flex-col content-center items-center rounded-lg divide-y w-2/3 divide-gray-100 border-green-200 bg-zinc-100">
                <div className="w-3/4">Address: {votingAddress}</div>
                <div className="w-3/4">Question: {question}</div>
                <div className="w-3/4">
                    {candidates &&
                        candidates.map((el, index) => (
                            <Radio
                                key={index}
                                text={el}
                                index={index}
                                disabled={voted}
                                setCandidate={setCandidate}
                            />
                        ))}
                </div>
                <div className="w-3/4">Time end: {timeEnd}</div>
                <div className="w-3/4">Quorum: {quorum}</div>
                <div className="w-3/4">ID: {id}</div>
                <div className="w-12">
                    <button
                        disabled={voted}
                        hidden={voted}
                        onClick={handleVote}
                        type="submit"
                        className="mt-2 text-white bg-green-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Vote
                    </button>
                </div>
                <div className="w-14">
                    <button
                        //onClick={handleVote}
                        disabled={!voted}
                        hidden={!voted}
                        type="button"
                        className="mt-2 text-white bg-green-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Results
                    </button>
                </div>
            </div>
        </>
    )
}
