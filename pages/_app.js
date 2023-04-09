import "@/styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"

import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi"
import { hardhat, polygonMumbai } from "@wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
// const { chains, provider, webSocketProvider } = configureChains(
//     [hardhat, polygonMumbai]
//     //[alchemyProvider({ apiKey: "yourAlchemyApiKey" }), publicProvider()]
// )

// Set up client
const { provider, webSocketProvider } = configureChains(
    [hardhat, polygonMumbai],
    [publicProvider()]
)

const client = createClient({
    provider,
    webSocketProvider,
})

export default function App({ Component, pageProps }) {
    return (
        <WagmiConfig client={client}>
            <MoralisProvider initializeOnMount={false}>
                <NotificationProvider>
                    <Component {...pageProps} />
                </NotificationProvider>
            </MoralisProvider>
        </WagmiConfig>
    )
}
