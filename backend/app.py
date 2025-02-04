import urllib.parse
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import re
import os
from pymongo import MongoClient

# Load environment variables
#load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Configure Google Gemini API Key
GEMINI_API_KEY = "AIzaSyCy7h-FPR4kaWbqDkrt8vDNMZKbfJ6yC-M"
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set. Please configure your environment variable.")

genai.configure(api_key=GEMINI_API_KEY)

# Configure MongoDB
username = urllib.parse.quote_plus("revisionary")
password = urllib.parse.quote_plus("revisionary@123")
MONGO_URI = f"mongodb+srv://{username}:{password}@revisionary.uni6n.mongodb.net/?retryWrites=true&w=majority&appName=Revisionary"
client = MongoClient(MONGO_URI)
db = client["revisionary"]
summary_collection = db["summary"]
quiz_collection = db["quiz"]

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
            {"text": f"Translate the text to English if it is not already in English. "
                         f"Is this strictly about social science,history, politics, or geography? Reply '1' for yes, '0' for no. Just reply in one number"
                         f"Here is the text:\n{transcript}\n"}
        ])

        if not response1 or not hasattr(response1, 'text'):
            return None, "Gemini API did not return a valid response."

        soc = response1.text.strip()
        if soc not in ["0", "1"]:
            return None, f"Unexpected response: {soc}"

        if soc == "1":
            response2 = model.generate_content([
               {"text": f"Translate the text to English if it is not already in English. "
                             f"Here is the text:\n{transcript}\n"
                             f"Provide a 500-word summary of the text. "
                             f"Do not mention the instructor or the duration of the lecture. "
                             f"Do not list the topics covered, but explain them in detail."}
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
    Generate a multiple-choice quiz with exactly 5 questions based on the following summary:

    {summary}

    Each question should have four options (A, B, C, and D), and one correct answer should be clearly stated.
    Make sure very carefully that are no stray asterisks anywhere.
    Use this format:

    Number: <question_text>
    A) <option_1>
    B) <option_2>
    C) <option_3>
    D) <option_4>
    Correct Answer: <correct_option without text>

    Ensure that each question block has exactly 6 lines. The question number should be on the same block as the actual question.
    Do not change a single thing about this format.
    """

    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)

    # Log the raw response to see the actual output from Gemini
    
    return response.text

# Function to format quiz as JSON
def format_quiz_as_json(response_text):
    questions = []
    blocks = response_text.strip().split("\n\n")

    for block in blocks:
        lines = block.strip().split("\n")

        if len(lines) > 1:
            question_text = lines[1]
        else:
            raise ValueError("Quiz response does not have enough lines to extract a question.")

        
        question_text = lines[0]
        
        # Collect options (assuming options are always between line 1 and line 4)
        options = {
            "0":lines[1],
            "1":lines[2],
            "2":lines[3],
            "3":lines[4]}
        
        # Correct Answer will be the last line in each block
        correct_answer = lines[5].replace("Correct Answer: ", "").strip()

        questions.append({
            "question": question_text,
            "options": options,
            "correct_answer": correct_answer
        })

    return {"quiz": questions}

# API Endpoint for generating summary
# API Endpoint for generating summary
@app.route("/summary", methods=["POST"])
def process_youtube_url():
    data = request.json
    youtube_url = data.get("youtube_url")

    if not youtube_url:
        return jsonify({"error": "YouTube URL is required."}), 400

    video_id = extract_video_id(youtube_url)
    if not video_id:
        return jsonify({"error": "Invalid YouTube URL."}), 400

    # Check if summary already exists in MongoDB
    summary_document = summary_collection.find_one({"video_id": video_id})
    if summary_document:
        return jsonify({"summary": summary_document["summary"]})

    transcript, error = get_youtube_transcript(video_id)
    if error:
        return jsonify({"error": error}), 500

    summary, error = generate_summary(transcript)
    if error:
        return jsonify({"error": error}), 500

    # Save summary to MongoDB
    summary_document = {
        "video_id": video_id,
        "summary": summary
    }
    summary_collection.insert_one(summary_document)

    return jsonify({"summary": summary, "video_id": video_id})

# API Endpoint for generating quiz
@app.route("/quiz", methods=["POST"])
def generate_quiz_from_summary():
    data = request.json
    video_id = data.get("video_id")

    if not video_id:
        return jsonify({"error": "Video ID is required."}), 400

    summary_document = summary_collection.find_one({"video_id": video_id})
    if not summary_document:
        return jsonify({"error": "Summary not found for the given video ID."}), 404

    summary = summary_document["summary"]
    quiz_response = generate_quiz(summary)
    quiz = format_quiz_as_json(quiz_response)

    # Save quiz to MongoDB
    quiz_document = {
        "video_id": video_id,
        "quiz": quiz
    }
    quiz_collection.insert_one(quiz_document)

    return jsonify({"quiz": quiz})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
