# HealthLingo - AI Medical Translator

HealthLingo is a web-based AI-powered medical speech translation tool. It enables users to transcribe, enhance, and translate medical speech in real-time using AI models.

## Code Documentation

### Project Structure
```
health-lingo/
│-- app.py
│-- templates/
│   ├── index.html
│-- static/
│   ├── script.js
│-- vercel.json
│-- requirements.txt
│-- .env (not included in repo, contains API keys)
```

### Backend (Flask)
- **`app.py`**: The main Flask application that handles API requests.
- **Routes:**
  - `/` - Home route to check if the server is running.
  - `/enhance` - Enhances medical transcription.
  - `/translate` - Translates the text into the selected language.
- **External API Usage:**
  - Hugging Face models for text enhancement and translation.
  - `requests` library for making API calls.
- **Security Considerations:**
  - API keys are stored in `.env` file.
  - CORS is managed using `Flask-CORS`.
  - Input validation is performed to handle errors gracefully.

### Frontend
- **`templates/index.html`**: The main HTML page using Tailwind CSS.
- **`static/script.js`**: Handles user interactions and API requests.
  - Uses Web Speech API for speech recognition.
  - Fetches enhanced text and translations from Flask backend.
  - Implements text-to-speech using `speechSynthesis`.

### Deployment
- **Vercel Deployment:**
  - `vercel.json` configures Flask as a serverless function.
  - Frontend and backend are served from the same domain.

## User Guide
### How to Use
1. **Open the App:** Visit the deployed URL.
2. **Select Input Language:** Choose a language from the dropdown.
3. **Start Speaking:** Click "Start Speaking" and speak medical terms.
4. **View Transcriptions:** Original and enhanced transcriptions appear.
5. **Translate Text:** Select an output language.
6. **Hear Translation:** Click "Speak" to listen to the translated text.

## Installation (For Local Development)
### Prerequisites
- Python 3.x
- `pip` installed

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/healthlingo.git
   cd healthlingo
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Create a `.env` file and add your Hugging Face API key:
   ```sh
   HUGGINGFACE_API_KEY=your_api_key_here
   ```
4. Run the Flask server:
   ```sh
   python app.py
   ```
5. Open `http://127.0.0.1:5000` in your browser.

## Security Considerations
- API keys are securely stored in environment variables.
- CORS restrictions are applied using `Flask-CORS`.
- Input validation ensures secure API requests.
