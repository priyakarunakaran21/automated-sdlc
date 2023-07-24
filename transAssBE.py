from flask import Flask, render_template, jsonify, request
import re
import requests
import urllib3
import json
from flask_cors import CORS

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = Flask(__name__)
CORS(app)

original_output = ""  # Variable to store the original output
edited_outputs = []  # Array to store edited outputs
is_editable = False  # Variable to track the edit mode

@app.route('/')
def index():
    return render_template('index.html')

def create_text_file(file_path, content):
    # Implement your logic to create a text file and write the content
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)

@app.route('/process', methods=['POST'])
def process_transcript():
    try:
        transcript = request.form['userInput']
        
        
        #Write output to text file for testing
        #output_file_path2 = 'C:/vs_code/TranAssPY/output_Minutes.txt'
        #create_text_file(output_file_path2, transcript)
    # Save the output to the file
        
        
    
        
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
        prompt_selection = request.form['promptSelector']
        front_prompt = 'Please provide a concise summary of the main points and outcomes discussed in this part of the meeting transcript.Include key points, decisions made, and any important action items or follow-ups discussed in this part.\n\nTranscript:'

        prompts = []
        formatted_text = ''
        i = 0
        while i < len(userInputWithoutTimestamps):
            chunk = userInputWithoutTimestamps[i:i + 8000]
            prompts.append(f'{front_prompt} {chunk}\n')
            i += 8000

        generated_texts = []
        prompt_index = 0
        full_text_output = ''

        def fetch_response():
            nonlocal prompt_index
            nonlocal full_text_output

            prompt = prompts[prompt_index]
            #print("First prompt:")
            #print(prompt)
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
            try:
                response.raise_for_status()
                data = response.json()
                generated_text = data['choices'][0]['text']
                generated_texts.append(generated_text)
                full_text_output = full_text_output + "\n" + generated_text + "\n"
                #print("Output:"+full_text_output)
                if prompt_index < len(prompts) - 1:
                    prompt_index += 1
                    fetch_response()
                else:
                    concatenated_text = ''.join(generated_texts)
                    return concatenated_text
            except requests.exceptions.HTTPError as e:
                print(f'HTTPError: {str(e)}')
                print(f'Response content: {response.content}')
                return jsonify({'error': f'HTTPError: {str(e)}'}), 500
            except json.JSONDecodeError as e:
                print(f'JSONDecodeError: {str(e)}')
                print(f'Response content: {response.content}')
                return jsonify({'error': f'JSONDecodeError: {str(e)}'}), 500

        # Call the fetch_response function
        concatenated_text = fetch_response()

        # Add the promptSelector value in the final prompt
        final_prompt = f'Question:{prompt_selection} \n\n Part wise meeting Summary for reference to answer: {full_text_output}'
        print("final_prompt:")
        print(final_prompt)
        # Make the API call to OpenAI with the final prompt
        requestOptions = {
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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',
            },
            'json': {
                'prompt': final_prompt,
                'max_tokens': 1000,
                'temperature': 0.2,
                'n': 1,
                'stop': None,
            },
            'verify': False,
        }

        response = requests.post('https://api.openai.com/v1/engines/text-davinci-003/completions', **requestOptions)
        response.raise_for_status()
        data = response.json()
        full_text_output = data['choices'][0]['text']
        generated_text = data['choices'][0]['text']

        return jsonify({'formatted_text': full_text_output.replace('\n', '<br>'), 'final_output': generated_text})

    except requests.exceptions.RequestException as e:
        print(f'RequestException: {str(e)}')
        return jsonify({'error': f'RequestException: {str(e)}'}), 500
    except json.JSONDecodeError as e:
        print(f'JSONDecodeError: {str(e)}')
        return jsonify({'error': f'JSONDecodeError: {str(e)}'}), 500
    except Exception as e:
        print(f'Exception: {str(e)}')
        return jsonify({'error': f'Exception: {str(e)}'}), 500

@app.route('/edit_output', methods=['POST'])
def edit_output():
    global is_editable
    is_editable = True
    return jsonify({'message': 'Edit mode enabled'})

@app.route('/save_output', methods=['POST'])
def save_output():
    try:
        global original_output
        data = request.get_json()
        output = data.get('output')
        if output:
            original_output = output
            return 'Output saved'
        else:
            return 'Output not found in the request', 400
    except Exception as e:
        print(f"Error occurred while saving output: {e}")
        return 'Error occurred while saving output', 500

@app.route('/save_edited_output', methods=['POST'])
def save_edited_output():
    try:
        global is_editable
        global edited_outputs
        data = request.get_json()
        edited_output = data.get('output')
        if edited_output:
            edited_outputs.append(edited_output)
            is_editable = False
            return 'Edited output saved'
        else:
            return 'Output not found in the request', 400
    except Exception as e:
        print(f"Error occurred while saving edited output: {e}")
        return 'Error occurred while saving edited output', 500

@app.route('/regenerate_response', methods=['POST'])
def regenerate_response():
    return process_transcript()

if __name__ == '__main__':
    app.run(debug=True)
