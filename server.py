from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

SENTENCES = [
    "Sometimes we must lose something to understand its value.",
    "The sky was painted in shades of fire as the sun went down.",
    "She whispered secrets to the stars each night.",
    "Courage is not the absence of fear, but the triumph over it.",
    "The quiet breeze carried forgotten dreams.",
    "Hope is the only thing stronger than fear.",
    "The river flowed silently beneath the moonlight.",
    "In the end, we only regret the chances we didn't take.",
    "The forest echoed with the song of birds and wind.",
    "Every moment is a fresh beginning.",
    "Her laughter was the melody of his heart.",
    "They walked slowly, hand in hand, toward the horizon.",
    "Time flies faster when you're chasing dreams.",
    "The candle burned like a symbol of quiet resistance.",
    "She found beauty in the broken pieces.",
    "Truth doesn't always scream; sometimes it whispers.",
    "Even the darkest night will end and the sun will rise.",
    "The mountains stood still as time slipped by.",
    "Love speaks in silence and is heard in stillness.",
    "A single raindrop started the flood of memories.",
    "Let your courage be stronger than your fear.",
    "His words left footprints on her soul.",
    "She carried storms in her eyes and calm in her voice.",
    "Memories are timeless treasures of the heart.",
    "The world is full of magic patiently waiting for our senses.",
    "Kindness is a language the deaf can hear and the blind can see.",
    "When nothing is sure, everything is possible.",
    "Every scar tells a story of survival.",
    "A dream is a wish your heart makes.",
    "She moved like poetry in motion."
]


@app.route("/api/words")
def get_sentence():
    sentence = random.choice(SENTENCES)
    return jsonify(sentence.split())  # 여전히 배열로 반환하지만, 문장 기반


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)

