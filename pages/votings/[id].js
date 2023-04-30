import VotingInfo from "@/components/VotingInfo"
import { useRouter } from "next/router"

export default function DynamicVotingInfo() {
    const router = useRouter()
    const { id } = router.query

    return (
        <>
            <VotingInfo id={id} />
        </>
    )
}
