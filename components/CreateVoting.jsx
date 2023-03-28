import { contractAddresses, votingEngAbi } from "@/constants"
import { useEffect, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import { useContractEvent } from "wagmi"

export default function CreateVoting() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const votingEngAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    let [votingsCount, setVotingsCount] = useState("0")
    const dispatch = useNotification()

    let [question, setQuestion] = useState("")
    let [candidate1, setCandidate1] = useState("")
    let [candidate2, setCandidate2] = useState("")
    let [duration, setDuration] = useState(0)
    let [quorum, setQuorum] = useState(0)

    const { runContractFunction: getVotingsCount } = useWeb3Contract({
        abi: votingEngAbi,
        contractAddress: votingEngAddress,
        functionName: "getVotingsCount",
        params: {},
    })

    async function updateUIValues() {
        const votingsCountFromCall = (await getVotingsCount()).toString()
        setVotingsCount(votingsCountFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    const handleNewNotification = (tx, type, message, position) => {
        dispatch({
            type: type,
            message: message,
            title: "Transaction Notification",
            position: position,
            icon: "bell",
        })
    }

    const handleSuccess = async (
        tx,
        type = "info",
        message = "Transaction Complete!",
        position = "topR"
    ) => {
        try {
            await tx.wait(1)
            updateUIValues()
            handleNewNotification(tx, type, message, position)
        } catch (error) {
            console.log(error)
        }
    }

    function handleQuestion(event) {
        setQuestion(event.target.value)
    }

    function handleCandidate1(event) {
        setCandidate1(event.target.value)
    }
    function handleCandidate2(event) {
        setCandidate2(event.target.value)
    }
    function handleDuration(event) {
        setDuration(parseInt(event.target.value))
    }
    function handleQuorum(event) {
        setQuorum(parseInt(event.target.value))
    }

    const {
        runContractFunction: createVoting,
        isFetching,
        isLoading,
        data,
        error,
    } = useWeb3Contract({
        abi: votingEngAbi,
        contractAddress: votingEngAddress,
        functionName: "createVoting",
        params: {
            _question: question,
            _candidates: [candidate1, candidate2],
            _duration: duration,
            _quorum: quorum,
        },
    })

    return (
        <div className="p-5">
            {/* <h1 className="py-4 px-4 font-bold text-3xl">Voting System</h1> */}
            {votingEngAddress ? (
                <>
                    <div>There are {votingsCount} votings at all</div>

                    <div>
                        <label htmlFor="q">Question</label>
                        <input type="text" name="q" id="q" onChange={handleQuestion} />
                    </div>
                    <div>
                        <label htmlFor="cand1">Candidate 1</label>
                        <input type="text" name="cand1" id="cand1" onChange={handleCandidate1} />
                    </div>
                    <div>
                        <label htmlFor="cand2">Candidate 2</label>
                        <input type="text" name="cand2" id="cand2" onChange={handleCandidate2} />
                    </div>
                    <div>
                        <label htmlFor="dur">Duration</label>
                        <input type="text" name="dur" id="dur" onChange={handleDuration} />
                    </div>
                    <div>
                        <label htmlFor="quorum">Quorum</label>
                        <input type="text" name="quor" id="quor" onChange={handleQuorum} />
                    </div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async () =>
                            await createVoting({
                                // onComplete:
                                // onError:
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }
                        disabled={isLoading || isFetching}
                    >
                        Create Voting
                    </button>

                    <div></div>
                    {/* {data && <pre>{JSON.stringify(data)}</pre>} */}
                </>
            ) : (
                <div>Please connect to a supported chain</div>
            )}
        </div>
    )
}
