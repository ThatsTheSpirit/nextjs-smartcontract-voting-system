import { ResponsivePie } from "@nivo/pie"
import { useEffect, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { contractAddresses, votingEngAbi, votingAbi } from "@/constants"
import { useRouter } from "next/router"

export default function Results() {
    const router = useRouter()
    const { id } = router.query

    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const votingEngAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [votingAddress, setVotingAddress] = useState("")
    const [stopEffect, setStopEffect] = useState(false)
    const [candidates, setCandidates] = useState([])
    const [winner, setWinner] = useState("")
    const [candVotes, setCandVotes] = useState([])
    const [question, setQuestion] = useState("")

    function getRandomInt(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    // function* zip(...iterables) {
    //     let iterators = iterables.map((i) => i[Symbol.iterator]())
    //     while (true) {
    //         let results = iterators.map((iter) => iter.next())
    //         if (results.some((res) => res.done)) return
    //         else yield results.map((res) => res.value)
    //     }
    // }

    function zip(arr1, arr2) {
        let result = []
        const longest = arr1.length > arr2.length ? arr1.length : arr2.length

        for (let i = 0; i < longest; i++) {
            result.push([arr1[i], arr2[i]])
        }

        return result
    }

    const { runContractFunction: getVoting } = useWeb3Contract({
        abi: votingEngAbi,
        contractAddress: votingEngAddress,
        functionName: "getVoting",
        params: { index: id },
    })

    const { runContractFunction: getCandidates } = useWeb3Contract({
        abi: votingAbi,
        contractAddress: votingAddress,
        functionName: "getCandidates",
        params: {},
    })

    const { runContractFunction: getWinner } = useWeb3Contract({
        abi: votingAbi,
        contractAddress: votingAddress,
        functionName: "getWinner",
    })

    const { runContractFunction: getQuestion } = useWeb3Contract({
        abi: votingAbi,
        contractAddress: votingAddress,
        functionName: "getQuestion",
    })

    const { runContractFunction: getCandidatesVotes } = useWeb3Contract({
        abi: votingAbi,
        contractAddress: votingAddress,
        functionName: "getCandidatesVotes",
    })

    async function updateVotingInfo() {
        const address = await getVoting()
        setVotingAddress(address)
        console.log(address)
    }

    useEffect(() => {
        updateVotingInfo()
    }, [])

    useEffect(() => {
        updateVotingInfo()

        if (votingAddress == "undefined") {
            setStopEffect(!stopEffect)
        }
    }, [stopEffect])

    useEffect(() => {
        async function getInfo() {
            const candidatesFromCall = await getCandidates()
            setCandidates(candidatesFromCall)
            console.log(candidatesFromCall)

            const allVotesFromCall = await getCandidatesVotes()
            const allVotesNums = allVotesFromCall?.map((el) => Number(el))

            let candZipped = zip(candidatesFromCall, allVotesNums)
            console.log(candZipped)

            const candInfo = candZipped.map(([cand, votes]) => {
                return {
                    id: cand,
                    label: cand,
                    value: votes,
                    color: `hsl(${getRandomInt(0, 255)}, 70%, 50%)`,
                }
            })

            console.log(candInfo)
            setCandVotes(candInfo)

            const winnerFromCall = await getWinner()
            setWinner(winnerFromCall)
            console.log(winnerFromCall)

            const qFromCall = await getQuestion()
            setQuestion(qFromCall)
        }
        getInfo()
    }, [votingAddress])

    useEffect(() => {
        console.log(candidates)
        console.log(candVotes)
        console.log(winner)
        console.log(candVotes)
    })

    return (
        <div style={{ height: 800 }}>
            <div style={{ textAlign: "center", fontSize: "1.5em" }}>{question}</div>
            {winner != "" ? (
                <ResponsivePie
                    //height={600}
                    //width={600}

                    data={candVotes}
                    margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    borderWidth={1}
                    borderColor={{
                        from: "color",
                        modifiers: [["darker", 0.2]],
                    }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: "color" }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{
                        from: "color",
                        modifiers: [["darker", 2]],
                    }}
                    defs={[
                        {
                            id: "dots",
                            type: "patternDots",
                            background: "inherit",
                            color: "rgba(255, 255, 255, 0.3)",
                            size: 4,
                            padding: 1,
                            stagger: true,
                        },
                        {
                            id: "lines",
                            type: "patternLines",
                            background: "inherit",
                            color: "rgba(255, 255, 255, 0.3)",
                            rotation: -45,
                            lineWidth: 6,
                            spacing: 10,
                        },
                    ]}
                    fill={[
                        {
                            match: {
                                id: "ruby",
                            },
                            id: "dots",
                        },
                        {
                            match: {
                                id: "c",
                            },
                            id: "dots",
                        },
                        {
                            match: {
                                id: "go",
                            },
                            id: "dots",
                        },
                        {
                            match: {
                                id: "python",
                            },
                            id: "dots",
                        },
                        {
                            match: {
                                id: "scala",
                            },
                            id: "lines",
                        },
                        {
                            match: {
                                id: "lisp",
                            },
                            id: "lines",
                        },
                        {
                            match: {
                                id: "elixir",
                            },
                            id: "lines",
                        },
                        {
                            match: {
                                id: "javascript",
                            },
                            id: "lines",
                        },
                    ]}
                    legends={[
                        {
                            anchor: "bottom",
                            direction: "row",
                            justify: false,
                            translateX: 0,
                            translateY: 56,
                            itemsSpacing: 0,
                            itemWidth: 100,
                            itemHeight: 18,
                            itemTextColor: "#999",
                            itemDirection: "left-to-right",
                            itemOpacity: 1,
                            symbolSize: 18,
                            symbolShape: "circle",
                            effects: [
                                {
                                    on: "hover",
                                    style: {
                                        itemTextColor: "#000",
                                    },
                                },
                            ],
                        },
                    ]}
                />
            ) : (
                <h1>Winner did not define</h1>
            )}
        </div>
    )
}
