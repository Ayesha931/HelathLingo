window.speechSynthesis.onvoiceschanged = function () {
    console.log("Voices loaded:", speechSynthesis.getVoices());
};

// document.addEventListener("DOMContentLoaded", function () {
//     const speakButton = document.querySelector("button[onclick='speakText()']");
    
//     if (speakButton) {
//         speakButton.addEventListener("click", speakText);
//     } else {
//         console.error("Speak button not found!");
//     }
// });

// const BACKEND_URL = window.location.hostname.includes("vercel.app")
//   ? "https://healthlingo.vercel.app/api"  // Your actual production URL
//   : "http://127.0.0.1:5000"; // Use local backend when running locally

// const BACKEND_URL = "https://healthlingo1.vercel.app/api"

// const BACKEND_URL = "http://127.0.0.1:5000"

// const BACKEND_URL = window.location.hostname.includes("vercel.app")
//   ? "https://health-lingo.vercel.app/api"
//   : "http://127.0.0.1:5000";

const BACKEND_URL = window.location.origin + "/api";

const originalTextArea = document.getElementById("originalText");
const enhancedTextArea = document.getElementById("enhancedText");
const translatedTextArea = document.getElementById("translatedText");
const inputLanguageSelect = document.getElementById("inputLanguageSelect");
const outputLanguageSelect = document.getElementById("outputLanguageSelect");

const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;

function startRecognition() {
    recognition.lang = inputLanguageSelect.value;
    recognition.start();
}

recognition.onresult = async function(event) {
    let transcript = event.results[0][0].transcript;
    originalTextArea.value = transcript;

    // Enhance and translate the transcription
    await enhanceAndTranslateText(transcript);
};

async function enhanceAndTranslateText(text) {
    const inputLang = inputLanguageSelect.value.split('-')[0]; // Extract language code
    const outputLang = outputLanguageSelect.value;
    
    try {
        // Step 1: Enhance transcription (calls Flask backend)
        let enhanceResponse = await fetch(`${BACKEND_URL}/enhance`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inputLang, text })
        });

        let enhanceData = await enhanceResponse.json();
        let enhancedText = enhanceData[0]?.generated_text || text;
        enhancedTextArea.value = enhancedText;

        // Step 2: Translate if needed
        if (inputLang !== outputLang) {
            let translateResponse = await fetch(`${BACKEND_URL}/translate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inputLang, outputLang, text: enhancedText })
            });

            let translateData = await translateResponse.json();
            translatedTextArea.value = translateData[0]?.translation_text || enhancedText;
        } else {
            translatedTextArea.value = enhancedText;
        }
    } catch (error) {
        console.error("API request failed:", error);
        alert("Failed to fetch from Flask server. Check if Flask is running.");
    }
}




function speakText() {
    console.log("Speak button clicked!");

    const text = translatedTextArea.value.trim();
    if (!text) {
        alert("No text available to speak.");
        return;
    }

    const lang = outputLanguageSelect.value || "en"; // Default to English

    // Stop any ongoing speech before speaking again
    speechSynthesis.cancel();

    function speakWithDelay() {
        let voices = speechSynthesis.getVoices();
        console.log("Available voices:", voices); // Debugging

        let selectedVoice = voices.find(voice => voice.name.includes("Google") && voice.lang.startsWith(lang));

        if (!selectedVoice) {
            alert(`No voice available for language: ${lang}. Trying default.`);
            selectedVoice = voices.find(voice => voice.lang.startsWith("en"));
        }

        if (!selectedVoice) {
            console.error("No suitable voice found.");
            return;
        }

        console.log(`Using voice: ${selectedVoice.name}, Lang: ${selectedVoice.lang}, Local: ${selectedVoice.localService}`);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;

        utterance.onstart = () => console.log("Speech started...");
        utterance.onend = () => console.log("Speech finished.");
        utterance.onerror = (event) => console.error("Speech error:", event.error);

        speechSynthesis.speak(utterance);
    }

    // Ensure voices are loaded every time before speaking
    if (speechSynthesis.getVoices().length === 0) {
        console.log("Voices not ready yet, waiting...");
        speechSynthesis.onvoiceschanged = () => {
            console.log("Voices loaded, speaking now...");
            speakWithDelay();
        };
        speechSynthesis.getVoices(); // Force voices to refresh
    } else {
        speakWithDelay();
    }
}
