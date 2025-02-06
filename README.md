
```markdown
# Revisionary App - AI-Powered Flashcards and Quiz Generator

Revisionary is an educational app that uses AI to generate flashcards, quizzes, and summaries based on YouTube video content. It provides a seamless learning experience by integrating various APIs and services, including YouTube transcript extraction, Google Gemini AI for summarization, and MongoDB for storing data.

## Features

- **YouTube Video Summary**: Extracts video transcripts and generates a concise summary using the **youtube-transcript-api library** and **Google Gemini API**.
- **Flashcard Generation**: Based on the summary, it generates flashcards for efficient learning.
- **Quiz Generation**: A multiple-choice quiz is created from the summary to assess the user’s understanding.
- **Speech Synthesis**: Users can listen to the flashcard summaries via speech.
- **Analytics**: Displays quiz results with detailed feedback on correct and incorrect answers.

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Flask
- **Database**: MongoDB
- **APIs**:
  - **Google Gemini API** for content generation (summaries and quizzes)
- **Library**:
  - **youtube-transcript-api** for transcript extraction from YouTube videos
- **Cloud**: MongoDB Atlas for database hosting
- **Speech**: Expo Speech API for reading aloud summaries

## Installation

### Prerequisites

- Node.js (for running the frontend)
- Python 3.x (for running the backend)
- MongoDB Atlas account (for database)
- Google Gemini API key (for generating summaries and quizzes)

### Frontend Setup

1. Clone the repository:

    ```bash
    https://github.com/1DS22CS223-SUPRIYAR/Revisionary.git
    cd revisionary
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Run the React Native app using Expo:

    ```bash
    expo start
    ```

    You can scan the QR code in your terminal or use the Expo Go app on your mobile device to run the app.

### Backend Setup

1. Navigate to the backend folder in your terminal.
```bash
    cd frontend
    ```
   
2. Install the required Python packages:

    ```bash
    pip install -r requirements.txt
    ```

3. Set up MongoDB:
   - Create a MongoDB Atlas cluster and get the connection string.
   - Replace the placeholder in the code for MongoDB connection (check the `app.py` file for the connection URI).

4. Set up the Google Gemini API key:
   - Go to [Google Cloud](https://cloud.google.com) and get your Gemini API key.
   - Replace the placeholder in `app.py` with your actual Gemini API key.

5. Run the Flask server:

    ```bash
    python app.py
    ```

    This will start the server on `http://127.0.0.1:5000`.

## API Endpoints

### `/summary` (POST)

Generates a summary for a given YouTube video URL.

**Request Body**:
```json
{
    "youtube_url": "https://www.youtube.com/watch?v=video_id"
}
```

**Response**:
```json
{
    "summary": "Summary of the video content...",
    "video_id": "video_id"
}
```

If the summary is already stored in the database for the given video ID, it will be retrieved from MongoDB and returned in the response.

---

### `/quiz` (POST)

Generates a quiz based on the video summary.

**Request Body**:
```json
{
    "video_id": "video_id"
}
```

**Response**:
```json
{
    "quiz": {
        "quiz": [
            {
                "question": "What is the capital of France?",
                "options": {
                    "0": "Berlin",
                    "1": "Madrid",
                    "2": "Paris",
                    "3": "London"
                },
                "correct_answer": "2"
            },
            ...
        ]
    }
}
```

The quiz will be based on the summary previously generated for the video, and will contain multiple-choice questions with one correct answer.

---

### `/flashcards` (POST)

Generates flashcards based on a video summary (currently commented out in the code).

**Request Body**:
```json
{
    "youtube_url": "https://www.youtube.com/watch?v=video_id"
}
```

**Response**:
```json
{
    "flashcards": [
        "Flashcard 1 content",
        "Flashcard 2 content",
        ...
    ],
    "video_id": "video_id"
}
```

---

## Troubleshooting

- **Missing Transcript**: If no transcript is available for the YouTube video, the backend will return an error stating `"Error: No transcript available."`
- **Google Gemini API Errors**: Ensure the Gemini API key is correctly set up and that it is active. You might encounter errors if the key is invalid.
- **MongoDB Connection Issues**: Ensure the MongoDB Atlas cluster is properly set up and the connection string is correct. MongoDB connection issues can lead to errors while saving or retrieving data.

---

## Acknowledgements

- **Google Gemini API**: For content generation and summarization.
- **YouTube Transcript API**: For fetching video transcripts.
- **MongoDB**: For storing summaries and quizzes.
- **Expo & React Native**: For building the mobile application.
```

---

