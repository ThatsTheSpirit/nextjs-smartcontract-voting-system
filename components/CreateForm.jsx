import { contractAddresses, votingEngAbi, votingAbi } from "@/constants"
import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralisSubscription, useMoralisQuery } from "react-moralis"
import { useMoralis } from "react-moralis"
import { useNotification } from "web3uikit"
import { useContractEvent, createClient, configureChains, useContractRead } from "wagmi"
import { hardhat, polygonMumbai, goerli, sepolia } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
const { GelatoOpsSDK, isGelatoOpsSupported } = require("@gelatonetwork/ops-sdk")
import AddVoters from "./AddVoters"
import { DatePicker } from "web3uikit"
import TimePicker from "./TimePicker"
import { ethers } from "ethers"

export default function CreateForm() {
    const { provider, webSocketProvider } = configureChains(
        [hardhat, polygonMumbai, goerli, sepolia],
        [publicProvider()]
    )

    const client = createClient({
        provider,
        webSocketProvider,
    })

    let [question, setQuestion] = useState("")
    let [timeEnd, setTimeEnd] = useState(0)
    let [quorum, setQuorum] = useState(0)
    let [inputFieldsCandidates, setinputFieldsCandidates] = useState(["", ""])
    let [addresses, setAddresses] = useState([])
    let [createdContract, setCreatedContract] = useState("")
    let [formatEndDate, setformatEndDate] = useState(false)

    let [contract, setContract] = useState()
    let [dedicated, setDedicated] = useState("")

    const { chainId: chainIdHex, isWeb3Enabled, enableWeb3, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const votingEngAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    let [isSupportedChain, setIsSupportedChain] = useState(isGelatoOpsSupported(chainId))

    const dispatch = useNotification()

    useContractEvent({
        address: votingEngAddress,
        abi: votingEngAbi,
        eventName: "VotingCreated",
        listener(votingAddress) {
            console.log(votingAddress)
            setCreatedContract(votingAddress)

            useGelatoOracle() //set timeEnd for Oracle
        },
    })

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
            _timeEnd: timeEnd,
            _quorum: quorum,
            _voters: addresses,
            _owner: account,
        },
    })

    const { runContractFunction: addToWhitelist } = useWeb3Contract({
        abi: votingAbi,
        contractAddress: createdContract,
        functionName: "addToWhitelist",
        params: {
            _addr: dedicated,
        },
    })

    async function createVotingEthersjs() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contractEng = new ethers.Contract(votingEngAddress, votingEngAbi, signer)

        setContract(contractEng)

        // contract.on("VotingCreated", (addr) => {
        //     setCreatedContract(addr)
        //     console.log(addr)
        // })

        const tx = await contractEng.createVoting(
            question,
            inputFieldsCandidates,
            timeEnd,
            quorum,
            addresses,
            account,
            {
                gasLimit: 2025446,
            }
        )
        const txReceipt = await tx.wait(1)
        console.log(txReceipt.logs)

        setCreatedContract(txReceipt.logs[0].address)
    }

    //state variables

    useEffect(() => {
        if (!isWeb3Enabled) {
            enableWeb3()
        }
    }, [isWeb3Enabled])

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

    function handleQuestion(event) {
        setQuestion(event.target.value)
    }

    function handleTimeEnd(event) {
        setTimeEnd(parseInt(event.target.value))
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

    function handleformatEndDate(event) {
        setformatEndDate(event.target.checked)
        console.log(event.target.checked)
    }

    function handleDateTimePicker(date) {
        const dateFromUser = date.getTime()
        console.log(dateFromUser)
        setTimeEnd(dateFromUser)
    }

    const useGelatoOracle = async () => {
        if (isGelatoOpsSupported(chainId)) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            const ethersContract = new ethers.Contract(createdContract, votingAbi, signer)
            const gelatoOps = new GelatoOpsSDK(chainId, signer)

            // Prepare Task data to automate
            const selector = ethersContract.interface.getSighash("defWinner()")
            //const resolverData = ethersContract.interface.getSighash("getState()")

            const { taskId, tx } = await gelatoOps.createTask({
                execAddress: createdContract,
                execSelector: selector,
                //resolverAddress: createdContract,
                //resolverData: resolverData,
                dedicatedMsgSender: true,
                name: "Automated Voting using resolver",
                startTime: Math.floor(timeEnd / 1000),
                singleExec: true,
            })

            const { address, isDeployed } = await gelatoOps.getDedicatedMsgSender()

            setDedicated(address)

            await addToWhitelist()

            const activeTasks = await gelatoOps.getActiveTasks()
            activeTasks.forEach((task) => {
                console.log(`- ${task.name} (${task.taskId})`)
            })
        }
    }

    const submit = (e) => {
        e.preventDefault()
        console.log(`Candidates: ${inputFieldsCandidates}`)
        console.log(`Question: ${question}`)
        console.log(`Time end: ${new Date(timeEnd).toLocaleString()}`)
        console.log(`Quorum: ${quorum}`)

        console.log(`chainId: ${chainId}`)

        const sendCreateVoting = async () => {
            if (chainId == 31337 || !isSupportedChain) {
                await createVoting({
                    onSuccess: handleSuccess,
                    onError: (error) => console.log(error),
                })
            } else {
                await createVotingEthersjs()
                await useGelatoOracle()
            }
        }

        sendCreateVoting()
    }

    return (
        <form>
            <div className="flex flex-col content-center items-center">
                <div className="w-3/4">
                    <label
                        htmlFor="question"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Question
                    </label>
                    <input
                        onChange={handleQuestion}
                        type="text"
                        id="question"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Are you the rabbit?"
                        required
                    />
                </div>

                {inputFieldsCandidates.map((input, index) => {
                    const cand = "candidate" + (index + 1)
                    return (
                        <div key={index} className="w-3/4">
                            <label
                                htmlFor={cand}
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Candidate {index + 1}
                            </label>
                            <input
                                onChange={(event) => handleFormChange(index, event)}
                                type="text"
                                id={cand}
                                name={cand}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Yes"
                                value={input.cand}
                                required
                            />
                        </div>
                    )
                })}

                <div className="w-3/4 items-center">
                    <label className="relative inline-flex items-center mt-2 cursor-pointer justify-center">
                        <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            onChange={handleformatEndDate}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                            Date/Time
                        </span>
                    </label>
                </div>

                {!formatEndDate ? (
                    <div className="w-3/4">
                        <label
                            htmlFor="date-picker"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Date end
                        </label>
                        <DatePicker
                            id="date-picker"
                            onChange={({ event: e, date }) => {
                                handleDateTimePicker(date)
                            }}
                            validation={{
                                min: new Date().toISOString().substring(0, 10),
                                required: true,
                            }}
                            type="date"
                            value=""
                        />
                    </div>
                ) : (
                    <div
                        className=" w-3/4"
                        id="timepicker-disable-past"
                        data-te-input-wrapper-init
                    >
                        <label
                            htmlFor="time-picker"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Time end
                        </label>

                        <TimePicker setTime={setTimeEnd} />
                    </div>
                )}
                <div className="w-3/4">
                    <label
                        htmlFor="quorum"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                        Quorum
                    </label>
                    <input
                        onChange={handleQuorum}
                        type="number"
                        id="quorum"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="60"
                        required
                    />
                </div>

                <div className="w-3/4">
                    <AddVoters addresses={addresses} setAddresses={setAddresses} />
                </div>
                <div className="mt-2 flex flex-col items-center">
                    <button
                        onClick={addCandidateInput}
                        type="button"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Add a candidate
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
