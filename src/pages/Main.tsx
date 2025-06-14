import { Box, Text, Input, Center, Flex } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";

const WORDS = [
    "early", "without", "out", "how", "world", "on", "people", "she", "some", "most",
    "since", "very", "year", "that", "present", "some", "interest", "at", "group",
    "through", "still", "follow", "most", "now", "give", "each", "face", "come",
    "we", "part", "word", "through", "day", "general", "say", "very", "man", "look",
    "now", "own", "one", "turn", "not", "he"
];

interface TypedWord {
    word: string;
    typed: string;
    correct: boolean;
}

export default function Main() {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [typedHistory, setTypedHistory] = useState<TypedWord[]>([]);
    const [prefix, setPrefix] = useState("type");
    const inputRef = useRef<HTMLInputElement>(null);

    const [startTime, setStartTime] = useState<number | null>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, [currentWordIndex]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        if (!startTime) {
            setStartTime(Date.now());
        }

        if (prefix && newValue.length > 0) {
            const lastChar = newValue[newValue.length - 1];
            if (lastChar === prefix[0]) {
                setPrefix(prefix.slice(1));
                setInputValue("");
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();

            const correct = inputValue === WORDS[currentWordIndex];
            setTypedHistory([
                ...typedHistory,
                { word: WORDS[currentWordIndex], typed: inputValue, correct },
            ]);
            setInputValue("");
            setCurrentWordIndex(currentWordIndex + 1);
        }
    };

    const getStats = () => {
        if (!startTime || typedHistory.length === 0) return null;

        const now = Date.now();
        const seconds = (now - startTime) / 1000;
        const correctCount = typedHistory.filter((w) => w.correct).length;
        const totalCount = typedHistory.length;

        const accuracy = totalCount === 0 ? "0.0" : ((correctCount / totalCount) * 100).toFixed(1);
        const wpm = seconds === 0 ? "0.0" : ((correctCount / seconds) * 60).toFixed(1);

        return { accuracy, wpm };
    };

    const stats = getStats();

    return (
        <Center w="100%" h="100%">
            <Flex flexDirection="column" gap={8}>
                <Center>
                    <Text fontSize="2xl" fontWeight="bold" mb={32}>
                        {prefix && <Text as="span" color="gray.500">{prefix}</Text>}
                    </Text>
                </Center>

                <Box fontSize="xl" lineHeight="relaxed" maxW="4xl" mx="auto" mb={8}>
                    {WORDS.map((word, i) => {
                        const typed = typedHistory[i];
                        const isActive = i === currentWordIndex;
                        let color = "gray.500";
                        if (typed) color = typed.correct ? "white" : "red.500";
                        if (isActive) color = "yellow.500";
                        return (
                            <Text key={i} as="span" color={color} mr={3}>
                                {word}
                            </Text>
                        );
                    })}
                </Box>

                <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    maxW="xl"
                    mx="auto"
                    bg="transparent"
                    borderColor="gray.500"
                    textAlign="center"
                    fontSize="xl"
                    _focus={{ outline: "none" }}
                    marginBottom={8}
                />

                {stats && (
                    <Center>
                        <Text fontSize="xl" fontWeight="semibold" color="green.300">
                            🎯 정확도: {stats.accuracy}% | ⌨️ WPM: {stats.wpm}
                        </Text>
                    </Center>
                )}
            </Flex>
        </Center>
    );
}
