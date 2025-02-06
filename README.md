Here’s a properly formatted version of your **README.md** file with corrected formatting, improved clarity, and a few minor fixes.  

---

# **Revisionary App - AI-Powered Flashcards and Quiz Generator**  

Revisionary is an educational app that uses AI to generate **flashcards, quizzes, and summaries** based on YouTube video content. It provides a seamless learning experience by integrating various APIs and services, including YouTube transcript extraction, Google Gemini AI for summarization, and MongoDB for storing data.

---

## **Features**  

- **YouTube Video Summary**: Extracts video transcripts and generates a concise summary using the **youtube-transcript-api library** and **Google Gemini API**.  
- **Flashcard Generation**: Creates flashcards based on the summary for efficient learning.  
- **Quiz Generation**: Generates multiple-choice quizzes to assess user understanding.  
- **Speech Synthesis**: Allows users to listen to the flashcard summaries via speech.  
- **Analytics**: Displays quiz results with feedback on correct and incorrect answers.  

---

## **Tech Stack**  

- **Frontend**: React Native with Expo  
- **Backend**: Flask  
- **Database**: MongoDB (MongoDB Atlas)  
- **APIs**:  
  - **Google Gemini API** for summarization and quiz generation  
- **Libraries**:  
  - **youtube-transcript-api** for extracting YouTube transcripts  
- **Cloud Services**:  
  - MongoDB Atlas for database hosting  
- **Speech Synthesis**:  
  - Expo Speech API for reading summaries aloud  

---

## **Installation**  

### **Prerequisites**  

Ensure you have the following installed:  
- **Node.js** (for frontend)  
- **Python 3.x** (for backend)  
- **MongoDB Atlas account** (for database storage)  
- **Google Gemini API key** (for generating summaries and quizzes)  

### **Frontend Setup**  

1. **Clone the repository**:  
    ```bash
    git clone https://github.com/1DS22CS223-SUPRIYAR/Revisionary.git
    cd Revisionary/frontend
    ```

2. **Install dependencies**:  
    ```bash
    npm install
    ```

3. **Run the React Native app using Expo**:  
    ```bash
    expo start
    ```
    - Scan the QR code in the terminal or use the Expo Go app on your mobile device to run the app.  

### **Backend Setup**  

1. **Navigate to the backend folder**:  
    ```bash
    cd ../backend
    ```

2. **Install the required Python packages**:  
    ```bash
    pip install -r requirements.txt
    ```

3. **Set up MongoDB**:  
   - Create a **MongoDB Atlas** cluster and obtain the connection string.  
   - Replace the placeholder in `app.py` with the **MongoDB connection URI**.  

4. **Set up the Google Gemini API key**:  
   - Go to [Google Cloud](https://cloud.google.com) and generate a **Gemini API key**.  
   - Replace the placeholder in `app.py` with your actual **API key**.  

5. **Run the Flask server**:  
    ```bash
    python app.py
    ```
    - The backend will start at: `http://127.0.0.1:5000`  

---

## **API Endpoints**  

### **1️⃣ `/summary` (POST) - Generate Video Summary**  

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
- If the summary is already stored in the database, it will return the saved data from **MongoDB**.  

---

### **2️⃣ `/quiz` (POST) - Generate Quiz**  

Generates a quiz based on the **video summary**.  

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
            }
        ]
    }
}
```
- The quiz is generated based on the **existing summary** for the video.  
- Each question has **multiple-choice options** with one correct answer.  

---

### **3️⃣ `/flashcards` (POST) - Generate Flashcards**  

(Currently commented out in the backend code)  

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
        "Flashcard 2 content"
    ],
    "video_id": "video_id"
}
```
- This endpoint generates **flashcards** based on the **video summary**.  

---

## **Troubleshooting & Common Issues**  

### **1. Missing Transcript**  
If no transcript is available for a YouTube video, the backend will return:  
```json
{
    "error": "No transcript available."
}
```
💡 **Solution**: Ensure that the video has **closed captions (CC)** enabled.  

### **2. Google Gemini API Errors**  
- If the API key is incorrect or inactive, errors may occur.  
💡 **Solution**: Double-check the **Gemini API key** in `app.py`.  

### **3. MongoDB Connection Issues**  
- If the MongoDB connection fails, the server might not save or retrieve data properly.  
💡 **Solution**: Ensure the **MongoDB Atlas connection string** is correctly set up in `app.py`.  

---

## **Acknowledgements**  

This project was made possible by:  
- **Google Gemini API** - for content summarization & quiz generation  
- **YouTube Transcript API** - for fetching transcripts  
- **MongoDB Atlas** - for database storage  
- **React Native & Expo** - for building the mobile app  

---

## **Future Enhancements**  

✅ **Add Flashcards Generation Support** (currently commented out)  
✅ **Improve UI/UX for Quiz & Flashcards Display**  
✅ **Add User Authentication for Saved Data**  


---

