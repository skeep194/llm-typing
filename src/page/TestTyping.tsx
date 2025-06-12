import React, { useState, useEffect, useRef } from "react";

interface TypedWord {
    word: string;
    typed: string;
    correct: boolean;
}

const WORDS = [
    "early", "without", "out", "how", "world", "on", "people", "she", "some", "most",
    "since", "very", "year"
];

export default function TestTyping() {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [typedHistory, setTypedHistory] = useState<TypedWord[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, [currentWordIndex]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            const correct = inputValue === WORDS[currentWordIndex];
            setTypedHistory([...typedHistory, { word: WORDS[currentWordIndex], typed: inputValue, correct }]);
            setCurrentWordIndex(currentWordIndex + 1);
            setInputValue("");
        }
    };

    return (
        <div className="min-h-screen bg-[#121417] text-white p-10 font-mono">
            {/* <div className="text-center text-2xl font-bold mb-32">type</div> */}

            <div className="text-xl leading-relaxed flex flex-wrap max-w-4xl mx-auto mb-32">
                {WORDS.map((word, i) => {
                    const typed = typedHistory[i];
                    const isActive = i === currentWordIndex;
                    let color = "text-gray-500";
                    if (typed) color = typed.correct ? "text-white" : "text-red-500";
                    if (isActive) color = "text-yellow-500";
                    return (
                        <span key={i} className={`${color} mr-3`}>
                            {word}
                        </span>
                    );
                })}
            </div>

            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full max-w-xl mx-auto block bg-transparent border-b-2 border-gray-500 text-white text-center text-xl focus:outline-none"
            />
        </div>
    );
}
