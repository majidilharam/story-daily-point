import { useState, useEffect } from "react";

export default function History({
    tasks,
    dark,
    defaultTarget,
    setPage,
    setSelectedDate,
}) {
    const [mode, setMode] = useState("list");


    const [start, setStart] = useState(() => localStorage.getItem("hStart") || "2025-11-27");
    const [end, setEnd] = useState(() => localStorage.getItem("hEnd") || "2025-12-03");

    // simpan ke localStorage biar tidak hilang
    useEffect(() => {
        localStorage.setItem("hStart", start);
        localStorage.setItem("hEnd", end);
    }, [start, end]);


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

            {/* SWITCH LIST */}
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


            <div className="mt-2">
                <input
                    id="startInput"
                    type="date"
                    value={start}
                    onChange={(e) => {
                        setStart(e.target.value);

                        setTimeout(() => {
                            document.getElementById("endInput").showPicker();
                        }, 200);
                    }}
                    className="hidden"
                />
                <input
                    id="endInput"
                    type="date"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="hidden"
                />
                <button
                    onClick={() => document.getElementById("startInput").showPicker()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border font-semibold
                        ${dark ? "bg-[#111820] text-white border-gray-700" : "bg-white text-black border-gray-300"}`}
                >
                    <span className="text-lg">📅</span>

                    {new Date(start).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric"
                    })}

                    {" – "}

                    {new Date(end).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    })}
                </button>
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
                                ${dark ? "bg-[#111820] border-gray-700" : "bg-white border-gray-300"}`}
                            >
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() =>
                                        setOpen({ ...open, [ds]: !open[ds] })
                                    }
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
                                        <span className="text-sm opacity-70">{percent}%</span>

                                        <div className="h-2 bg-gray-300 rounded mb-3 mt-1">
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
                                                    className={`p-2 rounded border mb-2 transition-all ${t.completed
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

            {/* BOARD MODE  */}
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
                                ${dark ? "bg-[#111820] border-gray-700" : "bg-white border-gray-300"}`}
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
                                            className={`p-2 rounded border mb-2 ${t.completed
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