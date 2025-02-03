from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import re
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Configure Google Gemini API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set. Please configure your environment variable.")

genai.configure(api_key=GEMINI_API_KEY)

# Function to extract video ID from YouTube URL
def extract_video_id(youtube_url):
    regex = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(regex, youtube_url)
    return match.group(1) if match else None

# Function to get transcript
def get_youtube_transcript(video_id, preferred_languages=["en", "hi"]):
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # Try preferred languages first
        for lang in preferred_languages:
            try:
                transcript = transcript_list.find_transcript([lang])
                transcript_text = " ".join([entry['text'] for entry in transcript.fetch()])
                return transcript_text, None  # Returning transcript and None for no error
            except:
                continue  # Try next preferred language

        # Fallback to any available transcript
        transcript = transcript_list.find_transcript(transcript_list._generated_transcripts.keys())
        transcript_text = " ".join([entry['text'] for entry in transcript.fetch()])
        return transcript_text, None  # Returning transcript and None for no error

    except (TranscriptsDisabled, NoTranscriptFound):
        return None, "Error: No transcript available."  # Returning None for transcript and error message
    except Exception as e:
        return None, f"Error fetching transcript: {e}"  # Returning None for transcript and error message

# Function to generate summary
def generate_summary(transcript):
    try:
        model = genai.GenerativeModel("gemini-2.0-flash-exp")
        response1 = model.generate_content([
            {"text": f"Translate to English if not in English. Is this strictly about history, politics, or geography? Reply '1' for yes, '0' for no. Just reply in one number.\n{transcript}"}
        ])

        if not response1 or not hasattr(response1, 'text'):
            return None, "Gemini API did not return a valid response."

        soc = response1.text.strip()
        if soc not in ["0", "1"]:
            return None, f"Unexpected response: {soc}"

        if soc == "1":
            response2 = model.generate_content([
                {"text": f"Translate to English if not in English. Provide a 500-word summary without mentioning instructors or lecture duration:\n{transcript}"}
            ])
            if not response2 or not hasattr(response2, 'text'):
                return None, "Gemini API did not return a valid summary."

            return response2.text.strip(), None

        return None, "Content is not related to history, politics, or geography."

    except Exception as e:
        return None, f"Error generating summary: {str(e)}"

# Function to generate quiz
def generate_quiz(summary):
    prompt = f"""
    Generate a multiple-choice quiz in English based on the following summary:

    {summary}

    Format:
    Question: <question_text>
    A) <option_1>
    B) <option_2>
    C) <option_3>
    D) <option_4>
    Correct Answer: <correct_option>
    """
    model = genai.GenerativeModel("gemini-2.0-flash-exp")
    try:
        response = model.generate_content(prompt)
        if response.candidates and response.candidates[0].finish_reason != 3:
            return format_quiz_as_json(response.text)
        else:
            return {"error": "Quiz could not be generated due to content safety restrictions."}
    except Exception as e:
        return {"error": f"Error generating quiz: {e}"}

# Function to format quiz as JSON
def format_quiz_as_json(response_text):
    questions = []
    blocks = response_text.strip().split("\n\n")

    for block in blocks:
        lines = block.strip().split("\n")
        if len(lines) < 6:
            continue

        question = lines[0].replace("Question: ", "").strip()
        options = [line[3:].strip() for line in lines[1:5]]  # Removing A), B), C), D)
        correct_answer = lines[5].replace("Correct Answer: ", "").strip()

        questions.append({
            "question": question,
            "options": options,
            "correct_answer": correct_answer
        })

    return {"quiz": questions}

# API Endpoint
@app.route("/process", methods=["POST"])
def process_youtube_url():
    data = request.json
    youtube_url = data.get("youtube_url")

    if not youtube_url:
        return jsonify({"error": "YouTube URL is required."}), 400

    video_id = extract_video_id(youtube_url)
    if not video_id:
        return jsonify({"error": "Invalid YouTube URL."}), 400

    transcript, error = get_youtube_transcript(video_id)
    if error:
        return jsonify({"error": error}), 500

    summary, error = generate_summary(transcript)
    if error:
        return jsonify({"error": error}), 500

    quiz = generate_quiz(summary)

    response = {"summary": summary, "quiz": quiz}
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
