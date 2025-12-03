export default function Target({ defaultTarget, setDefaultTarget, dark }) {
    const saveTarget = () => {
        if (defaultTarget < 1) return;
        setDefaultTarget(defaultTarget);
    };

    return (
        <div className="w-full max-w-[700px] mx-auto space-y-6">

            <h2 className={`text-xl font-bold ${dark ? "text-white" : "text-black"}`}>
                Default Daily Target
            </h2>

            <div
                className={`
          p-6 rounded-xl shadow border 
          ${dark ? "bg-[#121a2b] text-white border-gray-700"
                        : "bg-white text-black border-gray-300"}
        `}
            >
                <p className="opacity-80 mb-3">
                    This is the default story point target that will be used every day.
                </p>

                <input
                    type="number"
                    value={defaultTarget}
                    onChange={(e) => setDefaultTarget(Number(e.target.value))}
                    className={`
            px-3 py-2 w-24 rounded border
            ${dark ? "bg-gray-800 text-white border-gray-600"
                            : "bg-white text-black border-gray-400"}
          `}
                />

                <button
                    onClick={saveTarget}
                    className="px-4 py-2 bg-blue-600 text-white rounded ml-3"
                >
                    Save
                </button>

                <p className="mt-3 opacity-70">
                    Current Target: {defaultTarget} pts/day
                </p>
            </div>

        </div>
    );
}