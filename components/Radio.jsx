//import "./Radio.module.css"

export default function Radio({ text, index, disabled = false, setCandidate }) {
    return (
        <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
            <div className="flex items-center h-5">
                <input
                    onChange={() => {
                        setCandidate(text)
                        console.log("Selected: " + text)
                    }}
                    id={`radio-${index}`}
                    name="helper-radio"
                    type="radio"
                    disabled={disabled}
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                />
            </div>
            <div className="ml-2 text-sm">
                <label
                    htmlFor={`radio-${index}`}
                    className="font-medium text-gray-900 dark:text-gray-300"
                >
                    <div>{text}</div>
                    <p
                        id={`radio-text-${index}`}
                        className="text-xs font-normal text-gray-500 dark:text-gray-300"
                    >
                        {`Candidate №${index + 1}`}
                    </p>
                </label>
            </div>
        </div>
    )
}
