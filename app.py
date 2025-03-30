import os
from flask import Flask, request, jsonify, render_template
import requests
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://lingohealth.vercel.app"}})


HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY")  # Replace with your actual key
HEADERS = {"Authorization": f"Bearer {HF_API_KEY}", "Content-Type": "application/json"}

def query_huggingface(model, input_text):
    """Helper function to call Hugging Face API"""
    url = f"https://api-inference.huggingface.co/models/{model}"
    response = requests.post(url, headers=HEADERS, json={"inputs": input_text})

    if response.status_code == 200:
        return response.json()
    else:
        return {"error": f"Failed with status {response.status_code}", "details": response.text}

@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

@app.route("/api/enhance", methods=["POST"])
def enhance_text():
    """Enhances the medical transcription"""
    print("Received request for enhancement")  # Debug
    data = request.json
    print("Received data:", data)  # Debug

    input_lang = data.get("inputLang", "en")
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "No text provided"}), 400

    prompt = f"Enhance this medical transcription while keeping it in {input_lang}: {text}"
    model = "facebook/mbart-large-50"

    result = query_huggingface(model, prompt)
    print("Enhancement response:", result)  # Debug

    # Extract correct text from response
    if isinstance(result, list) and len(result) > 0 and "generated_text" in result[0]:
        enhanced_text = result[0]["generated_text"]
    else:
        enhanced_text = text  # Fallback to original

    return jsonify({"enhanced_text": enhanced_text})


@app.route("/api/translate", methods=["POST"])
def translate_text():
    """Translates the text using Helsinki-NLP"""
    print("Received request for translation")  # Debug
    data = request.json
    print("Received data:", data)  # Debug

    input_lang = data.get("inputLang", "en")
    output_lang = data.get("outputLang", "en")
    text = data.get("text", "")

    model = f"Helsinki-NLP/opus-mt-{input_lang}-{output_lang}"
    result = query_huggingface(model, text)
    print("Translation response:", result)  # Debug

    return jsonify(result)

if __name__ == "__main__":
    app.run()

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))