import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function History({
    tasks,
    dark,
    defaultTarget,
    setPage,
    setSelectedDate,
}) {
    const [mode, setMode] = useState("list");

    // Load saved range from localStorage
    const savedStart = localStorage.getItem("historyStart") || "2025-11-27";
    const savedEnd = localStorage.getItem("historyEnd") || "2025-12-03";

    const [start, setStart] = useState(savedStart);
    const [end, setEnd] = useState(savedEnd);

    // Calendar popup
    const [showCal, setShowCal] = useState(false);
    const [range, setRange] = useState([new Date(start), new Date(end)]);

    
    useEffect(() => {
        localStorage.setItem("historyStart", start);
        localStorage.setItem("historyEnd", end);
    }, [start, end]);

    // Generate date list
    const getDates = () => {
        const arr = [];
        let s = new Date(start);
        let e = new Date(end);
        while (s <= e) {
            arr.push(new Date(s));
            s.setDate(s.getDate() + 1);
        }
        return arr;
    };

    const dates = getDates().sort((a, b) => b - a);
    const format = (d) => d.toISOString().split("T")[0];

    const goToDay = (date) => {
        setSelectedDate(date);
        setPage("today");
    };

    const [open, setOpen] = useState({});

    return (
        <div className="max-w-[1100px] mx-auto space-y-6">

            {/* SWITCH LIST / BOARD */}
            <div className="flex gap-3">
                <button
                    onClick={() => setMode("list")}
                    className={`px-4 py-2 rounded-lg font-semibold cursor-pointer
                    ${mode === "list"
                        ? "bg-blue-600 text-white"
                        : dark
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-white text-black border hover:bg-gray-100"
                    }`}
                >
                    List
                </button>

                <button
                    onClick={() => setMode("board")}
                    className={`px-4 py-2 rounded-lg font-semibold cursor-pointer
                    ${mode === "board"
                        ? "bg-blue-600 text-white"
                        : dark
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-white text-black border hover:bg-gray-100"
                    }`}
                >
                    Board
                </button>
            </div>

            {/* DATE RANGE DISPLAY */}
            <div className="relative">
                <button
                    onClick={() => setShowCal(!showCal)}
                    className={`px-4 py-2 rounded-lg border cursor-pointer flex items-center gap-2
                        ${dark
                            ? "bg-[#1e293b] border-gray-600 text-white"
                            : "bg-white border-gray-300 text-black"
                        }`}
                >
                    📅 {new Date(start).toDateString()} — {new Date(end).toDateString()}
                </button>

                {/* CALENDAR  */}
                {showCal && (
                    <div
                        className={`calendar-popup absolute z-50 mt-2 rounded-xl shadow-xl border 
                        ${dark ? "bg-[#0d1117] border-gray-700 text-white"
                              : "bg-white border-gray-300"
                        }
                        w-[95vw] max-w-[350px] p-3`}
                    >
                        <Calendar
                            selectRange={true}
                            onChange={(value) => {
                                setRange(value);
                                setStart(value[0].toISOString().split("T")[0]);
                                setEnd(value[1].toISOString().split("T")[0]);
                            }}
                            value={range}
                            className="rounded-lg"
                        />

                        <button
                            onClick={() => setShowCal(false)}
                            className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded cursor-pointer"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>

            {/* LIST MODE */}
            {mode === "list" && (
                <div className="space-y-4">
                    {dates.map((d) => {
                        const ds = format(d);
                        const dayTasks = tasks.filter((t) => t.date === ds);
                        const completed = dayTasks.filter((t) => t.completed);
                        const totalSP = completed.reduce((a, b) => a + b.points, 0);
                        const percent = Math.round((totalSP / defaultTarget) * 100);

                        return (
                            <div
                                key={ds}
                                className={`rounded-xl border shadow p-4 transition-all
                                    ${dark ? "bg-[#111820] border-gray-700" 
                                           : "bg-white border-gray-300"}`}
                            >
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => setOpen({ ...open, [ds]: !open[ds] })}
                                >
                                    <h3 className="font-bold">
                                        {d.toDateString()} — {totalSP}/{defaultTarget} pts
                                    </h3>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            goToDay(ds);
                                        }}
                                        className="px-3 py-1 rounded bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                                    >
                                        Go →
                                    </button>
                                </div>

                                {open[ds] && (
                                    <div className="mt-3">
                                        <p className="text-sm mb-1 opacity-80">{percent}%</p>

                                        <div className="h-2 bg-gray-300 rounded mb-3">
                                            <div
                                                className="h-full bg-blue-600 rounded"
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>

                                        {dayTasks.length === 0 ? (
                                            <p>No tasks</p>
                                        ) : (
                                            dayTasks.map((t) => (
                                                <p
                                                    key={t.id}
                                                    className={`p-2 rounded border mb-2 transition-all
                                                        ${t.completed
                                                            ? dark
                                                                ? "bg-blue-900 text-blue-200 border-blue-700"
                                                                : "bg-blue-100 text-blue-800 border-blue-300"
                                                            : dark
                                                                ? "bg-[#1e293b] text-gray-200 border-[#334155]"
                                                                : "bg-gray-100 text-gray-800 border-gray-300"
                                                        }`}
                                                >
                                                    {t.title} — {t.points} pts
                                                </p>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* BOARD MODE */}
            {mode === "board" && (
                <div className="grid md:grid-cols-3 gap-4">
                    {dates.map((d) => {
                        const ds = format(d);
                        const dayTasks = tasks.filter((t) => t.date === ds);
                        const completed = dayTasks.filter((t) => t.completed);
                        const totalSP = completed.reduce((a, b) => a + b.points, 0);
                        const percent = Math.round((totalSP / defaultTarget) * 100);

                        return (
                            <div
                                key={ds}
                                className={`rounded-xl border shadow p-4 transition-all
                                    ${dark ? "bg-[#111820] border-gray-700" 
                                           : "bg-white border-gray-300"}`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold">{d.toDateString()}</h3>

                                    <button
                                        onClick={() => goToDay(ds)}
                                        className="text-blue-600 hover:underline cursor-pointer"
                                    >
                                        →
                                    </button>
                                </div>

                                <p className="font-bold mb-1">{percent}%</p>

                                <div className="h-2 bg-gray-300 rounded mb-3">
                                    <div
                                        className="h-full bg-blue-600 rounded"
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>

                                {dayTasks.length === 0 ? (
                                    <p>No tasks</p>
                                ) : (
                                    dayTasks.map((t) => (
                                        <div
                                            key={t.id}
                                            className={`p-2 rounded border mb-2 transition-all
                                                ${t.completed
                                                    ? dark
                                                        ? "bg-blue-900 text-blue-200 border-blue-700"
                                                        : "bg-blue-100 text-blue-800 border-blue-300"
                                                    : dark
                                                        ? "bg-[#1e293b] text-gray-200 border-[#334155]"
                                                        : "bg-gray-100 text-gray-800 border-gray-300"
                                                }`}
                                        >
                                            {t.title} — {t.points} pts
                                        </div>
                                    ))
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}