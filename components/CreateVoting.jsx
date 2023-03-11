import { contractAddresses, votingEngAbi } from "@/constants"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"

export default function CreateVoting() {
    const { chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const votingEngAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const { runContractFunction: createVoting } = useWeb3Contract({
        abi: votingEngAbi,
        contractAddress: votingEngAddress,
        functionName: "createVoting",
        params: {}, //add question, candidates, duration, quorum through props
        //msgValue: [],
    })
    return <div>Hi from create voting</div>
}
