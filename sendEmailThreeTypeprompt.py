from flask import Flask, render_template, jsonify, request
import re
import requests
import urllib3
from flask_cors import CORS

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = Flask(__name__)
CORS(app)

original_output = ""  # Variable to store the original output
edited_outputs = []  # Array to store edited outputs
is_editable = False  # Variable to track the edit mode
final_output = ""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process_transcript():
    try:
        transcript = request.form['userInput']
        #print(type(transcript))

        # Replace TimeStamp
        userInputWithoutTimestamps = re.sub(r'\d{2}:\d{2}:\d{2}\.\d{3}\s-->\s\d{2}:\d{2}:\d{2}\.\d{3}', '', transcript)

        # Remove lines containing "Good morning" from the transcript
        userInputWithoutTimestamps = re.sub(r'<v\s*([^>]*)>.*?\bGood morning\b.*?</v>', '', userInputWithoutTimestamps)
        userInputWithoutTimestamps = re.sub(r'<v\s*([^>]*)>.*?\bGood evening\b.*?</v>', '', userInputWithoutTimestamps)
        userInputWithoutTimestamps = re.sub(r'<v\s*([^>]*)>.*?\bHow are you\b.*?</v>', '', userInputWithoutTimestamps)
        userInputWithoutTimestamps = re.sub(r'<v\s*([^>]*)>.*?\bHello\b.*?</v>', '', userInputWithoutTimestamps)

        # Replace <V> tag and comma inside name
        def replace_name(match):
            name = ' '.join(match.group(1).split(',')[::-1])
            return f'{name}: {match.group(2)}'

        userInputWithoutTimestamps = re.sub(r'<v\s*([^>]*)>(.*?)</v>', replace_name, userInputWithoutTimestamps)

        userInputWithoutTimestamps = userInputWithoutTimestamps.replace('\n', '')

        # Define the dictionary with text replacements
        replacements = {
            'Marc Jones:': 'Marc:',
            'WEBVTT': '',
            'Kumar': '',
            # Add more key-value pairs as needed
        }

        # Replace the text using the dictionary
        for key, value in replacements.items():
            userInputWithoutTimestamps = userInputWithoutTimestamps.replace(key, value)
        print(userInputWithoutTimestamps)
        front_prompt = 'please provide a detailed summary of the discussion from the meeting transcript.\n\nTranscript:'

        prompts = []
        formatted_text = ''
        i = 0
        while i < len(userInputWithoutTimestamps):
            chunk = userInputWithoutTimestamps[i:i + 10000]
            prompts.append(f'{front_prompt} {chunk}\n')
            i += 10000

        generated_texts = []
        prompt_index = 0
        full_text_output = ''

        def fetch_response():
            nonlocal prompt_index
            nonlocal full_text_output

            prompt = prompts[prompt_index]
            requestOptions = {
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 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',
                },
                'json': {
                    'prompt': prompt,
                    'max_tokens': 1000,
                    'temperature': 0.2,
                    'n': 1,
                    'stop': None,
                },
                'verify': False,
            }

            # Make the API request and process the response
            response = requests.post('https://api.openai.com/v1/engines/text-davinci-003/completions', **requestOptions)
            response.raise_for_status()
            data = response.json()
            generated_text = data['choices'][0]['text']
            generated_texts.append(generated_text)
            # print(generated_text)
            # full_text_output = full_text_output + "\nPart " + str(prompt_index+1) + "\n" + generated_text + "\n"
            full_text_output = full_text_output + "\n" + generated_text + "\n"

            if prompt_index < len(prompts) - 1:
                prompt_index += 1
                fetch_response()
            else:
                concatenated_text = ''.join(generated_texts)
                return concatenated_text

        # Call the fetch_response function
        concatenated_text = fetch_response()

        # Add the promptSelector value in the final prompt
        final_prompts = [
            'Question 1: Generate verbatim from the discussion:.\n\n Part wise meeting Summary for reference to answer:',
            'Question 2: Generate action item from the discussion:\n\n Part wise meeting Summary for reference to answer:',
            'Question 3: Generate key issues or challenges from the discussion:\n\n Part wise meeting Summary for reference to answer:'
        ]
        final_output = ''
        for prompt in final_prompts:
            requestOptions = {
                'headers': {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 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',
                },
                'json': {
                    'prompt': prompt,
                    'max_tokens': 1000,
                    'temperature': 0.2,
                    'n': 1,
                    'stop': None,
                },
                'verify': False,
            }

            try:
                response = requests.post('https://api.openai.com/v1/engines/text-davinci-003/completions', **requestOptions)
                response.raise_for_status()
                data = response.json()
                generated_text = data['choices'][0]['text']
                final_output += generated_text + '\n'
            except requests.exceptions.RequestException as e:
                print(f'RequestException: {str(e)}')
                final_output += 'Error occurred during API call\n'
            except json.JSONDecodeError as e:
                print(f'JSONDecodeError: {str(e)}')
                final_output += 'Error occurred during JSON decoding\n'
            except Exception as e:
                print(f'Exception: {str(e)}')
                final_output += 'Error occurred\n'

        print("Final Output:" + final_output)

        return jsonify({'formatted_text': full_text_output.replace('\n', '<br>'), 'final_output': final_output})

    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'RequestException: {str(e)}'})
    except json.JSONDecodeError as e:
        return jsonify({'error': f'JSONDecodeError: {str(e)}'})
    except Exception as e:
        return jsonify({'error': f'Exception: {str(e)}'})

if __name__ == '__main__':
    app.run(debug=True, port=8000)
