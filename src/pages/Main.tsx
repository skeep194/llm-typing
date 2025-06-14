import { GoogleGenAI, Type } from "@google/genai";
import { Box, Text, Input, Center, Flex } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";

let WORDS: string[] = [];
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
  WORDS = JSON.parse(result.text!)[0].WORDS;
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
  getRandomWordsFromGemini();
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentWordIndex]);

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
      const correct = inputValue === WORDS[currentWordIndex];
      setTypedHistory([
        ...typedHistory,
        { word: WORDS[currentWordIndex], typed: inputValue, correct },
      ]);
      setCurrentWordIndex(currentWordIndex + 1);
      setInputValue("");
    }
  };

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
      </Flex>
    </Center>
  );
}
