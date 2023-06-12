export default function Card(props) {
    const { question, id, link } = props
    const width = "200",
        height = "200"
    const imageCount = 5
    const imageId = Math.floor(Math.random() * imageCount + 1)

    //console.log(props)
    return (
        <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href={link ? `votings/${id}` : ""}>
                <img
                    className="rounded-t-lg"
                    src={`images/q${imageId}.jpg`}
                    alt=""
                    width={width}
                    height={height}
                />
            </a>
            <div class="p-5">
                <a href={link ? `votings/${id}` : ""}>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {question}
                    </h5>
                </a>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    Here are the biggest enterprise technology acquisitions of 2021 so far, in
                    reverse chronological order.
                </p>
                <a
                    href={link ? `votings/${id}` : ""}
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Open Voting
                    <svg
                        aria-hidden="true"
                        class="w-4 h-4 ml-2 -mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                        ></path>
                    </svg>
                </a>
            </div>
        </div>

        //1

        // <div className="mb-2 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        //     <a href="#">
        //         <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        //             {question}
        //         </h5>
        //     </a>
        //     <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        //         Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse
        //         chronological order.
        //     </p>
        //     <a
        //         href={link ? `votings/${id}` : ""}
        //         className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        //     >
        //         Open voting
        //         <svg
        //             aria-hidden="true"
        //             className="w-4 h-4 ml-2 -mr-1"
        //             fill="currentColor"
        //             viewBox="0 0 20 20"
        //             xmlns="http://www.w3.org/2000/svg"
        //         >
        //             <path
        //                 fillRule="evenodd"
        //                 d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
        //                 clipRule="evenodd"
        //             ></path>
        //         </svg>
        //     </a>
        // </div>

        //2

        // <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        //             <img class="rounded-t-lg" src="images/q1.jpg" alt="" width="200" height="400" />
        //             <div className="mb-2 max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        //                 <a href="#">
        //                     <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        //                         {question}
        //                     </h5>
        //                 </a>
        //                 <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        //                     Here are the biggest enterprise technology acquisitions of 2021 so far, in
        //                     reverse chronological order.
        //                 </p>
        //                 <a
        //                     href={link ? `votings/${id}` : ""}
        //                     className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        //                 >
        //                     Open voting
        //                     <svg
        //                         aria-hidden="true"
        //                         className="w-4 h-4 ml-2 -mr-1"
        //                         fill="currentColor"
        //                         viewBox="0 0 20 20"
        //                         xmlns="http://www.w3.org/2000/svg"
        //                     >
        //                         <path
        //                             fillRule="evenodd"
        //                             d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
        //                             clipRule="evenodd"
        //                         ></path>
        //                     </svg>
        //                 </a>
        //             </div>
        //         </div>
    )
}
