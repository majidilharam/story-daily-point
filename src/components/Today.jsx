import { useState } from "react";

export default function Today({
    tasks,
    setTasks,
    selectedDate,
    setSelectedDate,
    defaultTarget,
    dark,
}) {
    const formatLong = (d) =>
        new Date(d + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const changeDay = (dir) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + dir);
        setSelectedDate(date.toISOString().split("T")[0]);
    };

    const todaysTasks = tasks.filter((t) => t.date === selectedDate);
    const completedSP = todaysTasks
        .filter((t) => t.completed)
        .reduce((s, t) => s + t.points, 0);

    const [title, setTitle] = useState("");
    const [points, setPoints] = useState(1);

    const addTask = () => {
        if (!title.trim()) return;
        const newTask = {
            id: Date.now(),
            title,
            points,
            completed: false,
            date: selectedDate,
        };
        setTasks([...tasks, newTask]);
        setTitle("");
        setPoints(1);
    };

    const toggleDone = (id) => {
        setTasks(tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter((t) => t.id !== id));
    };

    return (
        <div className="max-w-[1100px] mx-auto space-y-6">

            {/* DATE HEADER */}
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={() => changeDay(-1)}
                    className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 cursor-pointer"
                >
                    ←
                </button>

                <h2 className="text-xl font-bold">{formatLong(selectedDate)}</h2>

                <button
                    onClick={() => changeDay(1)}
                    className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 cursor-pointer"
                >
                    →
                </button>
            </div>

            {/* PROGRESS */}
            <div className={`p-6 rounded-xl shadow border ${dark ? "bg-[#121a2b]" : "bg-white"}`}>
                <h3 className="font-semibold">DAILY PROGRESS</h3>
                <p className="text-3xl font-bold">{completedSP} / {defaultTarget} pts</p>

                <div className="w-full h-2 bg-gray-300 mt-3 rounded">
                    <div
                        className="h-full bg-blue-600 rounded"
                        style={{ width: `${Math.min((completedSP / defaultTarget) * 100, 100)}%` }}
                    ></div>
                </div>
            </div>

            {/* ADD TASK */}
            <div className={`p-6 rounded-xl shadow border ${dark ? "bg-[#121a2b]" : "bg-white"}`}>
                <h3 className="font-semibold mb-2">+ Add Task</h3>

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task name"
                    className={`w-full px-3 py-2 rounded border mb-3 ${dark ? "bg-gray-800 text-white border-gray-600" : "bg-white border-gray-300"
                        }`}
                />

                <div className="flex gap-2 mb-3">
                    {[1, 2, 3, 5, 8].map((n) => (
                        <button
                            key={n}
                            onClick={() => setPoints(n)}
                            className={`px-3 py-1 rounded border cursor-pointer transition-all
                ${points === n ? "bg-blue-600 text-white" :
                                    dark ? "bg-gray-700 text-white hover:bg-gray-600" :
                                        "bg-gray-200 hover:bg-gray-300"}`}
                        >
                            {n}
                        </button>
                    ))}
                </div>

                <button onClick={addTask} className="w-full bg-blue-600 text-white py-2 rounded cursor-pointer">
                    Add to Today
                </button>
            </div>

            {/* TASK LIST */}
            <div className={`p-6 rounded-xl shadow border ${dark ? "bg-[#121a2b]" : "bg-white"}`}>
                <h3 className="font-semibold mb-3">Tasks for this day</h3>

                {todaysTasks.length === 0 ? (
                    <p>No tasks</p>
                ) : (
                    todaysTasks.map((t) => (
                        <div key={t.id} className="p-3 border rounded mb-3 flex justify-between">
                            <div>
                                <p className="font-bold">{t.title}</p>
                                <p className="text-sm opacity-70">{t.points} pts</p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleDone(t.id)}
                                    className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer"
                                >
                                    {t.completed ? "Undo" : "Done"}
                                </button>

                                <button
                                    onClick={() => deleteTask(t.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}