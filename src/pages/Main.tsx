import { GoogleGenAI, Type } from "@google/genai";
import { Box, Text, Input, Center, Flex } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";

interface TypedWord {
  word: string;
  typed: string;
  correct: boolean;
}

const genAI = new GoogleGenAI({
  apiKey: "AIzaSyCpFzXsjw_NP_sSEGpKpsxmVlgVk33KNW4",
});

async function getRandomWordsFromGemini() {
  const result = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents:
      "Generate 40 random English words and return them as a structured array using the generateWords function.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            WORDS: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
          },
        },
      },
    },
  });
  return JSON.parse(result.text!)[0].WORDS;
}

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
  const [words, setWords] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const [startTime, setStartTime] = useState<number | null>(null);
  useEffect(() => {
    getRandomWordsFromGemini().then((words) => {
      setWords(words);
    });
  }, []);
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
      const correct = inputValue === words[currentWordIndex];

      setTypedHistory((prev) => [
        ...prev,
        { word: words[currentWordIndex], typed: inputValue, correct },
      ]);

      setInputValue("");
      const nextIndex = currentWordIndex + 1;

      if (nextIndex >= words.length) {
        setIsFinished(true); // ✅ 완료 상태로 변경
        setTimeout(() => {
          resetTest();
        }, 5000); // ✅ 5초 뒤 재시작
      } else {
        setCurrentWordIndex(nextIndex);
      }
    }
  };

  const getStats = () => {
    if (!startTime || typedHistory.length === 0) return null;

    const now = Date.now();
    const seconds = (now - startTime) / 1000;
    const correctCount = typedHistory.filter((w) => w.correct).length;
    const totalCount = typedHistory.length;

    const accuracy =
      totalCount === 0 ? "0.0" : ((correctCount / totalCount) * 100).toFixed(1);
    const wpm =
      seconds === 0 ? "0.0" : ((correctCount / seconds) * 60).toFixed(1);

    return { accuracy, wpm };
  };

   // ✅ 테스트 초기화 함수
   const resetTest = async () => {
    const newWords = await getRandomWordsFromGemini();
    setWords(newWords);
    setCurrentWordIndex(0);
    setTypedHistory([]);
    setInputValue("");
    setStartTime(null);
    setPrefix("type");
    setIsFinished(false); // 완료 상태 해제
  };

  const stats = getStats();

  return (
    <Center w="100%" h="100%">
      <Flex flexDirection="column" gap={8}>
        <Center>
          <Text fontSize="2xl" fontWeight="bold" mb={32}>
            {prefix && (
              <Text as="span" color="gray.500">
                {prefix}
              </Text>
            )}
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
          disabled={isFinished}
        />

        {stats && (
          <Center>
            <Text fontSize="xl" fontWeight="semibold" color="green.300">
              🎯 정확도: {stats.accuracy}% | ⌨️ WPM: {stats.wpm}
              {isFinished && " | 🔄 5초 뒤 다시 시작됩니다..."}
            </Text>
          </Center>
        )}
      </Flex>
    </Center>
  );
}