import { contractAddresses, votingEngAbi } from "@/constants"
import { useEffect, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { useNotification } from "web3uikit"

export default function CreateForm() {
    let [question, setQuestion] = useState("")
    let [duration, setDuration] = useState(0)
    let [quorum, setQuorum] = useState(0)
    let [inputFieldsCandidates, setinputFieldsCandidates] = useState(["", ""])

    const { chainId: chainIdHex, isWeb3Enabled, enableWeb3 } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const votingEngAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const dispatch = useNotification()

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
            _candidates: inputFieldsCandidates,
            _duration: duration,
            _quorum: quorum,
        }, //add question, candidates, duration, quorum through props
        //params: { _question: "Shit?", _candidates: ["yes", "no"], _duration: 600, _quorum: 50 }, //add question, candidates, duration, quorum through props
        //msgValue: [],
    })

    //state variables

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

    function handleDuration(event) {
        setDuration(parseInt(event.target.value))
    }
    function handleQuorum(event) {
        setQuorum(parseInt(event.target.value))
    }

    function addCandidateInput() {
        let newfield = ""
        setinputFieldsCandidates([...inputFieldsCandidates, newfield])
    }

    function handleFormChange(index, event) {
        let data = [...inputFieldsCandidates]
        data[index] = event.target.value
        setinputFieldsCandidates(data)
    }

    const submit = (e) => {
        e.preventDefault()
        console.log(`Candidates: ${inputFieldsCandidates}`)
        console.log(`Question: ${question}`)
        console.log(`Duration: ${duration}`)
        console.log(`Quorum: ${quorum}`)
        const sendCreateVoting = async () => {
            await createVoting({
                // onComplete:
                // onError:
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
            })
        }
        sendCreateVoting()
    }

    return (
        <form>
            <div class="flex flex-col content-center items-center">
                <div className="w-3/4">
                    <label
                        for="question"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Question
                    </label>
                    <input
                        onChange={handleQuestion}
                        type="text"
                        id="question"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Are you the rabbit?"
                        required
                    />
                </div>

                {inputFieldsCandidates.map((input, index) => {
                    const cand = "candidate" + (index + 1)
                    return (
                        <div key={index} className="w-3/4">
                            <label
                                for={cand}
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Candidate {index + 1}
                            </label>
                            <input
                                onChange={(event) => handleFormChange(index, event)}
                                type="text"
                                id={cand}
                                name={cand}
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Yes"
                                value={input.cand}
                                required
                            />
                        </div>
                    )
                })}

                <div className="w-3/4">
                    <label
                        for="duration"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Duration
                    </label>
                    <input
                        onChange={handleDuration}
                        type="number"
                        id="duration"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="15"
                        required
                    />
                </div>
                <div className="w-3/4">
                    <label
                        for="quorum"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Quorum
                    </label>
                    <input
                        onChange={handleQuorum}
                        type="number"
                        id="quorum"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="60"
                        required
                    />
                </div>
                <div className="mt-2 flex flex-col items-center">
                    <button
                        onClick={addCandidateInput}
                        type="button"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Add candidate
                    </button>
                    <button
                        disabled={isLoading || isFetching}
                        onClick={submit}
                        type="submit"
                        className="mt-2 text-white bg-green-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </form>
    )
}
