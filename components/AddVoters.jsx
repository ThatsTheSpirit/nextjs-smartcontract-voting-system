import { useState } from "react"

export default function AddVoters({ addresses, setAddresses }) {
    //

    function onlyUnique(value, index, array) {
        return array.indexOf(value) === index
    }

    function onlyEthAddress(value) {
        return /^0x[a-fA-F0-9]{40}/g.test(value)
    }

    function handleChange(event) {
        let cleared = event.target.value
            .split("\n")
            .filter(onlyUnique)
            .filter((el) => el != "")
            .filter(onlyEthAddress)

        console.log(cleared)
        setAddresses(cleared)
        //let s = event.target.value.replace(/\\n/g, String.fromCharCode(13, 10))
        //console.log(s)
    }

    return (
        <>
            <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                Add voters
            </label>
            <textarea
                id="message"
                rows="4"
                className="whitespace-pre-wrap block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Write your addresses here..."
                onChange={handleChange}
                //value={addresses}
            ></textarea>
        </>
    )
}
