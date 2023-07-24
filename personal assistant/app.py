import logging
from flask import Flask, request, jsonify
import requests
import urllib3
from flask_cors import CORS

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = Flask(__name__)
CORS(app)

# Replace 'YOUR_OPENAI_API_KEY' with your actual API key
openai_api_key = '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'

# Create a logger instance
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

# Define your intent recognition logic here
def recognize_intent(user_input):
    # Implement your custom intent recognition logic
    # Check if the user input matches any predefined intent rules
    # Return the recognized intent or None if no match found
    if 'order status' in user_input.lower():
        return 'OrderStatusInquiry'
    elif 'leave request' in user_input.lower():
        return 'LeaveRequest'
    elif 'benefits information' in user_input.lower():
        return 'BenefitsInformation'
    elif 'policy inquiry' in user_input.lower():
        return 'PolicyInquiry'
    elif 'update personal information' in user_input.lower():
        return 'UpdatePersonalInfo'
    elif 'training and development' in user_input.lower():
        return 'TrainingAndDevelopment'
    else:
        return None

# Define HR responses for each recognized intent
hr_responses = {
    'OrderStatusInquiry': 'Your order status is in progress.',
    'LeaveRequest': 'Sure! Please provide more details about your leave request.',
    'BenefitsInformation': 'Here is some information about employee benefits...',
    'PolicyInquiry': 'Sure! The policy for this specific topic is...',
    'UpdatePersonalInfo': 'To update your personal information, please...',
    'TrainingAndDevelopment': 'Our training and development programs include...',
    'UnknownIntent': "I'm sorry, I cannot process that request."
}

@app.route('/generate-response', methods=['POST'])
def generate_response():
    try:
        data = request.get_json()
        user_input = data['user_input']
        logger.debug('Received API Request Payload: %s', data)

        # Recognize the intent locally using the custom function
        recognized_intent = recognize_intent(user_input)

        if recognized_intent:
            # If the intent is recognized, use the HR response for the recognized intent
            generated_text = hr_responses.get(recognized_intent, "I'm sorry, I cannot process that request.")
        else:
            # If the intent is not recognized, pass the user input to the OpenAI API server
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {openai_api_key}'
            }

            payload = {
                'max_tokens': 70,
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {"role": "system", "content": "You as an AI personal assistant can assist others with a variety of tasks."},
                    {"role": "user", "content": user_input}
                ]
                # You can include other parameters based on your requirements
            }

            # Make the API request to the OpenAI API URL
            response = requests.post('https://api.openai.com/v1/chat/completions', json=payload, headers=headers, verify=False)

            if response.status_code == 200:
                # Extract the generated response from the API response
                data = response.json()
                generated_text = data['choices'][0]['message']['content'].strip()
            else:
                # Handle API errors
                error_message = f"API Error: {response.status_code}, {response.text}"
                return jsonify({'error': error_message}), response.status_code

        return jsonify({'response': generated_text}), 200

    except Exception as e:
        # Handle any other exceptions
        logger.error('Error processing API request: %s', e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run()
