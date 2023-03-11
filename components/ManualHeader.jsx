// This file is to show what making a connect button looks like behind the scenes!

import { useEffect } from "react"
import { useMoralis } from "react-moralis"

// Top navbar
export default function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled } = useMoralis()

    useEffect(() => {
        if (isWeb3Enableds) return
        enableWeb3()
    }, [isWeb3Enabled])

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button onClick={async () => await enableWeb3()}>Connect</button>
            )}
        </div>
    )
}
