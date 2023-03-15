import Header from "@/components/Header"
import { contractAddresses, votingEngAbi } from "@/constants"
import { useEffect, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { useNotification } from "web3uikit"

export default function create() {
    const { chainId: chainIdHex, isWeb3Enabled, enableWeb3 } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const votingEngAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    // let [votingsCount, setVotingsCount] = useState("0")
    const dispatch = useNotification()

    let [question, setQuestion] = useState("")
    let [candidate1, setCandidate1] = useState("")
    let [candidate2, setCandidate2] = useState("")
    let [duration, setDuration] = useState(0)
    let [quorum, setQuorum] = useState(0)

    // async function updateUIValues() {
    //     const votingsCountFromCall = (await getVotingsCount()).toString()
    //     setVotingsCount(votingsCountFromCall)
    // }

    useEffect(() => {
        if (!isWeb3Enabled) {
            enableWeb3()
        }
    }, [isWeb3Enabled])

    const handleNewNotification = () => {
        dispatch({
            type: "info",
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
        }, //add question, candidates, duration, quorum through props
        //params: { _question: "Shit?", _candidates: ["yes", "no"], _duration: 600, _quorum: 50 }, //add question, candidates, duration, quorum through props
        //msgValue: [],
    })

    return (
        <>
            <Header />
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
    )
}
