from flask import Blueprint, request, jsonify
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import re
import google.generativeai as genai
from dotenv import load_dotenv
import os

# Initialize Blueprint
transcript_summary_bp = Blueprint("transcript_summary_bp", __name__)

# Load environment variables from .env file
load_dotenv()

# Get API key from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set. Please configure your environment variable.")

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

@transcript_summary_bp.route("/extract", methods=["POST"])
def extract_transcript():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.json
    video_url = data.get("video_url")

    if not video_url:
        return jsonify({"error": "No video URL provided"}), 400

    video_id = extract_video_id(video_url)

    if not video_id:
        return jsonify({"error": "Invalid video ID or URL"}), 400

    try:
        transcript_text = get_youtube_transcript(video_id, preferred_languages=["en", "hi"])

        if isinstance(transcript_text, str) and transcript_text.startswith("Error"):
            return jsonify({"error": transcript_text}), 400

        # Generate the summary using Gemini API
        summary = generate_summary(transcript_text)

        if isinstance(summary, tuple):  # Handles error JSON response
            return summary

        return jsonify({"summary": summary}), 200

    except Exception as e:
        return jsonify({"error": f"Failed to fetch transcript or generate summary: {str(e)}"}), 400

def get_youtube_transcript(video_id, preferred_languages=None):
    """
    Fetches the transcript of a YouTube video in the preferred language(s).
    If no preferred language is found, it falls back to any available transcript.
    """
    try:
        # Get available transcripts
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)

        # Try preferred languages first
        if preferred_languages:
            for lang in preferred_languages:
                try:
                    transcript = transcript_list.find_transcript(lang)
                    return " ".join([entry["text"] for entry in transcript.fetch()])
                except:
                    continue  # Try the next preferred language

        # Try manually created transcripts first, then auto-generated
        transcript = next(iter(transcript_list._manually_created_transcripts.values()), None) or \
                     next(iter(transcript_list._generated_transcripts.values()), None)

        if transcript:
            return " ".join([entry["text"] for entry in transcript.fetch()])

        return "Error: No transcript available in any language."

    except TranscriptsDisabled:
        return "Error: Transcripts are disabled for this video."
    except NoTranscriptFound:
        return "Error: No transcript found for this video."
    except Exception as e:
        return f"Error: {e}"

def generate_summary(transcript):
    """
    Uses Gemini AI to generate a summary of the provided transcript text.
    """
    try:
        model = genai.GenerativeModel("gemini-2.0-flash-exp")
        response1 = model.generate_content(
            [
                {"text": f"Translate the text to English if it is not already in English. "
                         f"Check if the text is strictly and completely related to history, politics, or geography. "
                         f"If yes, return only '1'. Otherwise, return only '0'. "
                         f"Here is the text:\n{transcript}\n"}
            ]
        )

        if not response1 or not hasattr(response1, 'text'):
            return jsonify({"error": "Gemini API did not return a valid response."}), 500

        response_text = response1.text.strip()

        # Ensure response is strictly '0' or '1'
        if response_text not in ["0", "1"]:
            return jsonify({"error": f"Unexpected response from Gemini API. Response: {response_text}"}), 500

        soc = int(response_text)

        if soc == 1:
            response2 = model.generate_content(
                [
                    {"text": f"Translate the text to English if it is not already in English. "
                             f"Here is the text:\n{transcript}\n"
                             f"Provide a 500-word summary of the text. "
                             f"Do not mention the instructor or the duration of the lecture. "
                             f"Do not list the topics covered, but explain them in detail."}
                ]
            )

            if not response2 or not hasattr(response2, 'text'):
                return jsonify({"error": "Gemini API did not return a valid summary."}), 500

            return response2.text

        return jsonify({"error": "The content is not related to history, politics, or geography."}), 400

    except Exception as e:
        return jsonify({"error": f"Error in generating summary: {str(e)}"}), 500

def extract_video_id(url):
    """
    Extracts the YouTube video ID from a given URL.
    """
    regex = r"(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})"
    match = re.search(regex, url)
    return match.group(1) if match else None
