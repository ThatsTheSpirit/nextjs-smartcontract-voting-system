import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div>
            Voting System
            <ConnectButton moralisAuth={false} />
        </div>
    )
}
