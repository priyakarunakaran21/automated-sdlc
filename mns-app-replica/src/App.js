import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [transcriptType, setTranscriptType] = useState('file');
  const [promptType, setPromptType] = useState('Please provide a detailed summary of the main discussion points covered in the discussion.');
  const [customTemplate, setCustomTemplate] = useState('');
  const [response, setResponse] = useState('');
  const [editingMode, setEditingMode] = useState(false);

  const handleTranscriptSelection = (event) => {
    setTranscriptType(event.target.value);
  };

  const handlePromptSelection = (event) => {
    setPromptType(event.target.value);
  };

  const handleCustomTemplateChange = (event) => {
    setCustomTemplate(event.target.value);
  };

  const submitForm = () => {
    let userInputToSend = userInput;
    if (transcriptType === 'file') {
      // Handle file input
      const fileInput = document.getElementById('fileLocationInput');
      const file = fileInput.files[0];
      const reader = new FileReader();

      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        reader.onload = function (event) {
          const arrayBuffer = event.target.result;
          const zip = new window.JSZip();
          zip.loadAsync(arrayBuffer).then((zip) => {
            const docxFileContent = zip.file('word/document.xml').async('string');
            docxFileContent.then((content) => {
              const plainTextContent = content.replace(/<[^>]+>/g, '');
              userInputToSend = plainTextContent;
              makeAPIRequest(userInputToSend, promptType);
            });
          });
        };
        reader.readAsArrayBuffer(file);
        return;
      } else {
        reader.onload = function (event) {
          userInputToSend = event.target.result;
          makeAPIRequest(userInputToSend, promptType);
        };
        reader.readAsText(file);
        return;
      }
    }

    makeAPIRequest(userInputToSend, promptType);
  };

  

  const makeAPIRequest = (userInput, promptType) => {
    // Make the API call to process the transcript and get the response
    fetch('http://localhost:8000/process_transcript_and_email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to process transcript and send email');
        }
      })
      .then((data) => {
        setResponse(data.message);
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  const saveOutput = () => {
    // Make the API call to save the output
    fetch('http://127.0.0.1:5000/save_output', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ output: response }),
    })
      .then((response) => {
        // Handle the response if needed
        if (response.ok) {
          console.log('Output saved successfully');
        } else {
          console.log('Failed to save output');
        }
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  const editOutput = () => {
    // Enable editing mode
    setEditingMode(true);
  };

  const saveEditedOutput = () => {
    // Make the API call to save the edited output
    fetch('http://127.0.0.1:5000/save_edited_output', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ output: response }),
    })
      .then((response) => {
        // Handle the response if needed
        if (response.ok) {
          console.log('Edited output saved successfully');
          // Disable editing mode
          setEditingMode(false);
        } else {
          console.log('Failed to save edited output');
        }
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  };

  return (
    <div className="App">
      <header className="header">
        <div className="hcontainer">
          <a href="#" className="logo">
            <img src="Logo.png" alt="Logo" />
          </a>
          <a href="#" className="support-link">
            <img src="call.svg" alt="Call Icon" />
            Help / Support
          </a>
        </div>
      </header>

      <div className="container">
        <main>
          <div className="column">
            <h2>Enter Your Transcript:</h2>

            <div className="card">
              <div className="input-container">
                <h3>Transcript</h3>
                <select
                  className="type-dropdown"
                  id="transcriptSelector"
                  onChange={handleTranscriptSelection}
                  value={transcriptType}
                >
                  <option value="file">Insert Transcript Location(.txt File)</option>
                  <option value="insert">Insert Transcript(Text)</option>
                </select>
              </div>
              {transcriptType === 'insert' && (
                <div className="input-container" id="userInputContainer">
                  <textarea
                    id="userInput"
                    placeholder="Enter your transcript"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                  ></textarea>
                </div>
              )}
              <div className="input-container">
                <h3>Select Template</h3>
                <select
                  id="promptSelector"
                  className="type-dropdown"
                  onChange={handlePromptSelection}
                  value={promptType}
                >
                  <option value="Please provide a detailed summary of the main discussion points covered in the discussion.">
                    summary of the main discussion points covered in the meeting.
                  </option>
                  <option value="Extract the action items or tasks that were assigned during the meeting from the discussion.">
                    Extract the action items or tasks that were assigned during the meeting from the transcript.
                  </option>
                  <option value="Highlight any key issues or challenges that were raised during the meeting based on the discussion.">
                    Highlight any key issues or challenges that were raised during the meeting based on the transcript.
                  </option>
                  {/* Add more options as needed */}
                  <option value="manual">Enter Your Custom Template</option>
                </select>
              </div>
              {promptType === 'manual' && (
                <div className="input-container" id="customTemplateInput">
                  <h3>Custom Template</h3>
                  <textarea
                    id="customTemplateText"
                    placeholder="Enter your custom template"
                    value={customTemplate}
                    onChange={handleCustomTemplateChange}
                  ></textarea>
                </div>
              )}
              {transcriptType === 'file' && (
                <div id="fileInput">
                  <div className="input-container">
                    <h3>Select transcript file</h3>
                    <input type="file" id="fileLocationInput" accept=".txt, .docx, .vtt" />
                  </div>
                </div>
              )}
              <div className="button-container">
                <button className="btn secondary">
                  Clear
                </button>
                <button className="btn primary" onClick={submitForm}>
                  Submit
                </button>
              </div>
              <div className="response-area">
                {editingMode ? (
                  <div>
                    <button className="icons-btn" onClick={() => setEditingMode(false)}>
                      Save Edited Output
                    </button>
                  </div>
                ) : (
                  <div className="controls">
                    <button className="icons-btn" onClick={editOutput}>
                      <svg
                        title="edit"
                        width="20"
                        height="20"
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* SVG path for the edit icon */}
                      </svg>
                    </button>
                  </div>
                )}
                <div id="responseArea" contentEditable={editingMode}>
                  {response}
                </div>
              </div>
              {!editingMode && (
                <div className="button-container">
                  <button className="btn secondary" onClick={saveOutput}>
                    Save Output
                  </button>
                  <button className="btn secondary">
                    Regenerate Response
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <footer>
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
