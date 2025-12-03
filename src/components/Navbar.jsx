import { useState, useRef, useEffect } from "react";

export default function Navbar({ page, setPage, dark, setDark }) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const drawerRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const handleOutside = (e) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        if (open) document.addEventListener("mousedown", handleOutside);
        else document.removeEventListener("mousedown", handleOutside);

        return () => document.removeEventListener("mousedown", handleOutside);
    }, [open]);

    const btn = (p, label) => (
        <button
            onClick={() => {
                setPage(p);
                setOpen(false);
            }}
            className={`px-5 py-2 rounded-lg w-full text-left md:w-auto md:text-center transition-all cursor-pointer
                ${page === p
                    ? "bg-blue-600 text-white shadow-lg"
                    : dark
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "bg-white text-black hover:bg-gray-200"
                }`}
        >
            {label}
        </button>
    );

    return (
        <>
            <nav
                className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 
                ${dark ? "bg-[#0d1117]" : "bg-white"} 
                ${scrolled ? "shadow-md" : ""}`}
            >
                <div className="max-w-[1200px] mx-auto flex justify-between items-center px-6 py-4">


                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => setPage("today")}
                    >
                        <img
                            src="/target-icon.png"
                            className="w-7 h-7 -ml-1 group-hover:scale-110 transition"
                        />
                        <h1
                            className={`text-xl font-bold transition ${dark ? "text-white" : "text-black"
                                } group-hover:opacity-80`}
                        >
                            Story Point Daily
                        </h1>
                    </div>

                    {/* DESKTOP */}
                    <div className="hidden md:flex gap-3">
                        {btn("today", "Today")}
                        {btn("history", "History")}
                        {btn("target", "Default Target")}

                        <button
                            onClick={() => setDark(!dark)}
                            className={`px-4 py-2 rounded-lg transition-all cursor-pointer
                                ${dark ? "bg-gray-700 text-white hover:bg-gray-600"
                                    : "bg-gray-200 text-black hover:bg-gray-300"
                                }`}
                        >
                            {dark ? "Light Mode" : "Dark Mode"}
                        </button>
                    </div>

                    {/* MOBILE HAMBURGER */}
                    <button
                        className="md:hidden text-3xl cursor-pointer"
                        onClick={() => setOpen(true)}
                    >
                        ☰
                    </button>
                </div>
            </nav>

            {open && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" />
            )}

            <div
                ref={drawerRef}
                className={`fixed top-0 right-0 w-[70%] max-w-[300px] h-full z-50 md:hidden 
                    transition-transform duration-300 shadow-xl
                    ${dark ? "bg-[#0d1117] text-white" : "bg-white text-black"}
                    ${open ? "translate-x-0" : "translate-x-full"}
                `}
            >
                <div className="flex justify-end p-4">
                    <button
                        onClick={() => setOpen(false)}
                        className="text-3xl font-bold hover:opacity-70"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex flex-col gap-3 px-5">
                    {btn("today", "Today")}
                    {btn("history", "History")}
                    {btn("target", "Default Target")}

                    <button
                        onClick={() => {
                            setDark(!dark);
                            setOpen(false);
                        }}
                        className={`px-4 py-2 rounded-lg transition-all cursor-pointer
                        ${dark
                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                : "bg-gray-200 hover:bg-gray-300 text-black"
                            }`}
                    >
                        {dark ? "Light Mode" : "Dark Mode"}
                    </button>
                </div>
            </div>
        </>
    );
}