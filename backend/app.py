from flask import Flask
from transcript_summary import transcript_summary_bp

app = Flask(__name__)

# Register the Blueprint
app.register_blueprint(transcript_summary_bp, url_prefix="/api")

@app.route("/")
def home():
    return {"message": "Backend is running"}

if __name__ == "__main__":
    app.run(debug=True)
