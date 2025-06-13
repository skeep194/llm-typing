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
    const [words, setWords] = useState<string[]>([]); // feature add
    /*
    useEffect(() => {
        inputRef.current?.focus();
    }, [currentWordIndex]);
    */

    useEffect(() => {           //feature add
    fetch("http://localhost:5050/api/words")
        .then((res) => res.json())
        .then((data) => setWords(data))
        .catch((err) => console.error("Failed to fetch words:", err));
    }, []);

const loadNewWords = () => {            //add 새로운 단어 불러오기
    fetch("http://localhost:5050/api/words")
    .then((res) => res.json())
    .then((data) => {
      setWords(data);
      setCurrentWordIndex(0);
      setTypedHistory([]);
      setInputValue("");
      setPrefix("type");
    })
    .catch((err) => console.error("Failed to fetch words:", err));
};



useEffect(() => {
  loadNewWords();
}, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);

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
    const correct = inputValue === words[currentWordIndex];
    const updatedHistory = [
      ...typedHistory,
      { word: words[currentWordIndex], typed: inputValue, correct },
    ];
    setTypedHistory(updatedHistory);
    setInputValue("");

    if (currentWordIndex + 1 >= words.length) {
      // 🔁 모든 단어 입력 완료 → 새 게임 시작
      setTimeout(() => {
        loadNewWords(); // 0.5초 후 새 게임 시작
      }, 500);
    } else {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  }
};


    return (
        <Center w="100%" h="100%">
            <Flex flexDirection="column" gap={8}>
                <Center>
                    <Text fontSize="2xl" fontWeight="bold" mb={32}>
                        {prefix && <Text as="span" color="gray.500">{prefix}</Text>}
                    </Text>
                </Center>

                <Box fontSize="xl" lineHeight="relaxed" maxW="4xl" mx="auto" mb={8}>
                    {words.map((word, i) => {
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
            </Flex>
        </Center>
    );
} 