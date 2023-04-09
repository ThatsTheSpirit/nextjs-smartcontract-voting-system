import { useState } from "react"

export default function TimePicker(props) {
    let { minTime, time, setTime } = props
    const [strTime, setStrTime] = useState(new Date().toLocaleTimeString().slice(0, 5))

    function timeToDateTime(val) {
        const [hours, minutes] = val.split(":")
        let date = new Date()
        date.setHours(hours, minutes)
        return date
    }

    function dateTimeToTime(val) {
        const hours = val.getHours().toString()
        const minutes = val.getMinutes().toString()
        return hours.padStart(2, "0") + ":" + minutes
    }

    function handleTime(event) {
        setStrTime(event.target.value)

        let date = timeToDateTime(event.target.value)

        console.log("Date: " + date.getTime())
        //console.log("MinDate: " + minTime.getTime())

        // if (date > minTime) {
        //     setTime(date.getTime())
        // }

        setTime(date.getTime())
    }

    return (
        <input
            min={dateTimeToTime(new Date())}
            value={strTime}
            // placeholder="12:00"
            type="time"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            id="time-picker"
            required
            step="60"
            onChange={handleTime}
        />
    )
}

TimePicker.defaultProps = {
    //minTime: dateTimeToTime(Date.now()), //new Date(Date.now() + 1000 * 60),
    time: "12:00",
}
