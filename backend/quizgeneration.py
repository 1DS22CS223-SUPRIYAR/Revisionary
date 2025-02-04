
from flask import Flask, jsonify
from flask_cors import CORS
import google.generativeai as genai
import pymongo
import re

# 🔹 Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/generate-quiz": {"origins": "*"}})  # Enable CORS for frontend requests

# 🔹 Configure Google Gemini API Key
genai.configure(api_key="AIzaSyCy7h-FPR4kaWbqDkrt8vDNMZKbfJ6yC-M")

# Function to generate quiz from summary
def generate_quiz(summary):
    prompt = f"""
    Generate a multiple-choice quiz with exactly 5 questions based on the following summary:

    {summary}

    Each question should have four options (A, B, C, and D), and one correct answer should be clearly stated.
    Make sure very carefully that are no stray asterisks anywhere.
    Use this format:

    Question: <question_text>
    A) <option_1>
    B) <option_2>
    C) <option_3>
    D) <option_4>
    Correct Answer: <correct_option without text>
    Do not change a single thing about this format.
    """

    model = genai.GenerativeModel("gemini-pro")
    response = model.generate_content(prompt)

    # Log the raw response to see the actual output from Gemini
    
    return response.text

# Function to format quiz into JSON
import re

def format_quiz_as_json(response_text):
    questions = []
    blocks = response_text.strip().split("\n\n")

    for block in blocks:
        lines = block.strip().split("\n")

        if len(lines) > 1:
            question_text = lines[1]
        else:
            raise ValueError("Quiz response does not have enough lines to extract a question.")

        
        question_text = lines[1]
        
        # Collect options (assuming options are always between line 1 and line 4)
        options = {
            "0":lines[2],
            "1":lines[3],
            "2":lines[4],
            "3":lines[5]}
        
        # Correct Answer will be the last line in each block
        correct_answer = lines[6].replace("Correct Answer: ", "").strip()

        questions.append({
            "question": question_text,
            "options": options,
            "correct_answer": correct_answer
        })

    return {"quiz": questions}


# 🔹 API Endpoint to Get Quiz
@app.route("/generate-quiz", methods=["GET"])
def generate_quiz_api():
    # Sample summary for testing
    summary = "This lecture delves into the rise of nationalism in India, exploring the factors that contributed to the feeling of unity and national identity among the diverse population. The narrative begins with the impact of World War I on India. The war, while fought primarily in Europe, had significant indirect consequences for India, which was then under British rule. The British treated India as a resource to be exploited, leading to increased taxes, customs duties, and income tax. Simultaneously, the prices of goods doubled between 1913 and 1918, while the forced recruitment of Indians into the British army and the spread of the influenza pandemic added to the suffering. These hardships fueled resentment against British rule.\n\nThe emergence of Mahatma Gandhi on the Indian political scene in 1915 marked a turning point. Gandhi, having honed his methods in South Africa, introduced the concept of *Satyagraha*, a method of non-violent resistance emphasizing truth and peaceful protest. He successfully applied this method in three early movements in India: the Champaran movement against the *tinkathia* system forcing indigo cultivation, the Kheda movement against excessive tax collection, and the Ahmedabad mill worker's movement for a fair wage. These early successes established Gandhi's leadership and the power of Satyagraha.\n\nThe British responded to the growing nationalist movement with repressive measures, most notably the Rowlatt Act of 1919, which allowed for detention without trial. This draconian act galvanized the Indian people and sparked widespread protests. The Jallianwala Bagh massacre, where peaceful protestors were shot upon by British forces, further intensified anti-British sentiment.\n\nParallel to these events, the Khilafat movement emerged, a response to the dismantling of the Ottoman Caliphate after World War I, a position revered by Muslims worldwide.  Indian Muslims, along with figures like Muhammad Ali and Shaukat Ali, formed the Khilafat Committee to protest this decision. Seeing an opportunity to unite Hindus and Muslims against a common enemy, Gandhi proposed an alliance between the Khilafat movement and his Non-Cooperation movement. This movement, based on Gandhi's belief that British rule was sustained by Indian cooperation, called for the boycott of British institutions, goods, and titles.\n\nThe Non-Cooperation movement witnessed different forms of participation across the country. In cities, the middle class responded enthusiastically, students leaving schools, lawyers giving up their practice, and foreign goods being boycotted. In rural areas, peasants revolted against excessive rents imposed by landlords.  In the Awadh region, a peasant movement was led by Baba Ramchandra, who was later joined by Jawaharlal Nehru, who helped form the Awadh Kisan Sabha. Tribal communities in Andhra Pradesh, led by Alluri Sitarama Raju, resorted to guerrilla warfare against British laws restricting their use of forest resources.  Even plantation workers sought to leave the plantations, believing their freedom was at hand. These diverse manifestations of the movement demonstrated that the desire for *Swaraj*, or self-rule, had different meanings for different sections of society.\n\nHowever, the Non-Cooperation movement was abruptly halted in 1922 after the Chauri Chaura incident where protestors clashed with police and burned down a police station, leading to the deaths of several policemen. Gandhi, a firm believer in non-violence, withdrew the movement due to the violence. \n\nThe nationalist struggle continued, with the Simon Commission in 1928, appointed by the British to review the constitutional structure of India, but with no Indian members. This sparked widespread outrage, with protests echoing \"Simon, go back.\" The Viceroy, Lord Irwin, offered \"Dominion Status,\" granting limited autonomy, but it did not satisfy the growing demand for full independence.\n\nThe Civil Disobedience Movement followed, starting with the historic Dandi March in 1930, where Gandhi and his followers marched to the coast to break the salt law. The movement involved widespread defiance of British laws, leading to arrests and further repression. This was followed by the first and second round table conferences in London. Gandhi attended the second round but it resulted in little to no concessions from the British. In effect, Gandhi then restarted the civil disobedience movement which continued intermittently until 1934.\n\nThe Civil Disobedience Movement, like the Non-Cooperation movement, revealed the diverse aspirations of various groups.  While peasants demanded lower taxes and the business class was critical of British economic policies, women actively participated in the movement. However, Muslim participation was limited due to concerns over the Congress party's perceived bias towards Hindus and the unresolved issue of adequate Muslim representation in the political structure.  Dalits, marginalized and oppressed by the existing social structure, did not see significant participation but were championed by Dr. B.R. Ambedkar, who pushed for a separate electorate for Dalits. The Poona Pact was then put in place to resolve the differences in opinion between Gandhi and Dr. Ambedkar with a system that would reserve seats for the Dalits.\n\nFinally, the lecture highlights the different forms that nationalism took in India. These included the use of imagery, like Abanindranath Tagore's depiction of Bharat Mata, folklore, the national flag, and the reinterpretation of Indian history, all of which contributed to a shared sense of national identity and unity. This collective awakening, driven by shared suffering, unified aspirations, and powerful leadership, was a critical factor in the struggle for Indian independence.\n"
    
    if not summary:
        return jsonify({"error": "No summary found in MongoDB"}), 404

    quiz_response = generate_quiz(summary)

    # Debugging: check if the quiz response is being generated
    print("Quiz Response:")
    print(quiz_response)

    quiz=format_quiz_as_json(quiz_response)
    
    
    return jsonify(quiz)

# 🔹 Run Flask Server
if __name__ == "__main__":
    app.run(debug=True, port=5001)
