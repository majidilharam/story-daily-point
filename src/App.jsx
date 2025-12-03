import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Today from "./components/Today";
import History from "./components/History";
import Target from "./components/Target";

export default function App() {
  const [page, setPage] = useState("today");

  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  });

  const [defaultTarget, setDefaultTarget] = useState(() => {
    return JSON.parse(localStorage.getItem("defaultTarget")) || 13;
  });

  const [dark, setDark] = useState(() => {
    return JSON.parse(localStorage.getItem("dark")) || false;
  });


  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );



  useEffect(() => {
    const updateDate = () => {
      const today = new Date().toISOString().split("T")[0];
      setSelectedDate(today);
    };

    updateDate();


    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 0, 0
    );

    const msUntilMidnight = nextMidnight - now;


    const timeout = setTimeout(() => {
      updateDate();


      setInterval(updateDate, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);



  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("defaultTarget", JSON.stringify(defaultTarget));
    localStorage.setItem("dark", JSON.stringify(dark));
  }, [tasks, defaultTarget, dark]);

  return (
    <div className={dark ? "bg-[#0d1117] text-white min-h-screen" : "bg-gray-100 text-black min-h-screen"}>
      <Navbar
        page={page}
        setPage={setPage}
        dark={dark}
        setDark={setDark}
      />

      <div className="pt-28 px-6">
        {page === "today" && (
          <Today
            tasks={tasks}
            setTasks={setTasks}
            defaultTarget={defaultTarget}
            dark={dark}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}

        {page === "history" && (
          <History
            tasks={tasks}
            dark={dark}
            defaultTarget={defaultTarget}
            setPage={setPage}
            setSelectedDate={setSelectedDate}
          />
        )}

        {page === "target" && (
          <Target
            dark={dark}
            defaultTarget={defaultTarget}
            setDefaultTarget={setDefaultTarget}
          />
        )}
      </div>
    </div>
  );
}