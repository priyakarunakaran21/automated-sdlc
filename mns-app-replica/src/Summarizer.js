import React, { useState } from 'react';
import './App.css';

const Summarizer = () => {
  const [userInput, setUserInput] = useState('');
  const [transcriptType, setTranscriptType] = useState('file');
  const [promptType, setPromptType] = useState('');
  const [customTemplate, setCustomTemplate] = useState('');
  const [response, setResponse] = useState('');
  const [editingMode, setEditingMode] = useState(false);
  const email = 'kumars70@aetna.com';
  const subject = 'Meeting Summarizer notes';

  const handleTranscriptSelection = (event) => {
    setTranscriptType(event.target.value);
  };

  const handlePromptSelection = (event) => {
    setPromptType(event.target.value);
  };

  const handleCustomTemplateChange = (event) => {
    setCustomTemplate(event.target.value);
  };
  const handleResponseChange = (event) => {
    setResponse(event.target.textContent);
  };

  const clearForm = () => {
    setUserInput('');
    setCustomTemplate('');
    setResponse('');
  };

  const submitForm = () => {
    
    setResponse('Fetching Response...');
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

  const makeAPIRequest = async (userInput, promptType) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/process', {
        method: 'POST',
        headers: {
          //'Content-Type': 'application/json',
          "Content-Type": "application/x-www-form-urlencoded",
        },
        //body: JSON.stringify({ userInput, promptType }),
        body: "userInput=" + encodeURIComponent(userInput) + "&promptSelector=" + encodeURIComponent(promptType),
      });
  
      if (response.ok) {
        const data = await response.json();
        setResponse(data.formatted_text);
        console.log(data.formatted_text);
        console.log("Hello");
      } else {
        throw new Error('Failed to process transcript');
      }
    } catch (error) {
      setResponse(error, 'Please try after sometime');
      console.log('Error: ', error);
    }
  };
  

  const saveOutput = () => {
    // Make the API call to save the output
    console.log('Current value of response area:', response);
    fetch('http://localhost:5000/save_output', {
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
    setEditingMode(false);
    //console.log('edited value of response area:', response);
  };
  //send-email-start
  const sendEmail = async () => {
    // Make sure the email, subject, and response are not empty
    if (email.trim() === '' || subject.trim() === '' || response.trim() === '') {
      alert('Please fill in all fields');
      return;
    }

    const data = {
      to_address: email,
      subject: subject,
      response_body: response,
    };
    try {
      const response = await fetch('http://localhost:5000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log(responseData.message);
      alert(responseData.message);
      // Do something if the email was sent successfully (e.g., show a success message to the user)
    } catch (error) {
      console.error('Failed to send email:', error.message);
      alert(error.message);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };
  //send-email-End

  const resubmitInput = () => {
    // Make the API call to resubmit the input
    setResponse('Fetching Response...');
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
                  <option value="Please provide a detailed summary of the main discussion points covered in the discussion.">summary of the main discussion points covered in the meeting.</option>
              <option value="Extract the action items or tasks that were assigned during the meeting from the discussion.">Extract the action items or tasks that were assigned during the meeting from the transcript.</option>
              <option value="Highlight any key issues or challenges that were raised during the meeting based on the discussion.">Highlight any key issues or challenges that were raised during the meeting based on the transcript.</option>
              <option value="Outline the agenda items discussed in the meeting and provide a brief summary of each, as reflected in the discussion.">Outline the agenda items discussed in the meeting and provide a brief summary of each, as reflected in the transcript?</option>
              <option value="Were there any notable questions or concerns raised by participants during the meeting that should be included in the meeting notes?">Were there any notable questions or concerns raised by participants during the meeting that should be included in the meeting notes?</option>
              <option value="Please identify the key stakeholders or individuals present in the meeting, as mentioned in the discussion.">Please identify the key stakeholders or individuals present in the meeting, as mentioned in the transcript.</option>
              <option value="From the discussion, determine the roles or positions of the individuals who attended the meeting.">From the meeting transcript, determine the roles or positions of the individuals who attended the meeting.</option>
              <option value="What tasks or responsibilities were assigned to each individual during the meeting, as indicated in the discussion.?">What tasks or responsibilities were assigned to each individual during the meeting, as indicated in the transcript?</option>
              <option value="Based on discussion, please outline the responsibilities or assignments delegated to each participant.">Based on the transcript, please outline the responsibilities or assignments delegated to each participant in the meeting.</option>
              <option value="Were there any specific roles or functions discussed in the meeting(summary of the discussion) that were assigned to particular individuals? If so, please outline those details.">Were there any specific roles or functions discussed in the meeting that were assigned to particular individuals? If so, please outline those details.</option>
              <option value="provide action items assigned to each participant during the meeting in detail, as documented in the discussion.">Summarize the action items assigned to each participant during the meeting, as documented in the transcript.</option>
              <option value="Provide list of tasks or responsibilities assigned to each individual from the discussion.">provide list of tasks or responsibilities assigned to each individual during the meeting.</option>
              <option value="Generate minutes of meeting from summary of the discussion.:">Generate meeting minutes:</option>
              <option value="Generate verbatim from the discussion:">Generate verbatim</option>
              <option value="Generate action item from the discussion:">Generate action item</option>
              <option value="Generate key issues or challenges from the discussion:">Generate key issues or challenges</option>
              <option value="You're a Microsoft Teams Meeting Organizer. Generate the minutes of meeting and action items for the following transcript summary.The action items should have the assignee and the ETA.The discussion should have all details(from each part of transcript summary) combined in one paragraph with pointers. The output format of the meeting summary should be the following:

              Date:
              
              Time:
              
              Location:
              
              Attendees:
              
              Agenda:
              
              Discussion:
              
              Action Items:
              
              Next Meeting:\n">Generate the meeting minutes and action item which should include date,time,location,agenda,discussion,action items and next meeting date.</option>
              <option value="manual">Enter Your Custom Template</option>
                  <option value={customTemplate}>Custom Template</option>
                </select>
              </div>
              {promptType === 'Custom Template' && (
                <div id="customTemplateInput" className="input-container">
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
                <button className="btn secondary" onClick={clearForm}>
                  Clear
                </button>
                <button className="btn primary" onClick={submitForm}>
                  Submit
                </button>
              </div>
              <div className="response-area">
                {!editingMode &&
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
                       <path d="M4.375 25.4625V29.8958C4.375 30.3042 4.69583 30.625 5.10417 30.625H9.5375C9.72708 30.625 9.91667 30.5521 10.0479 30.4063L25.9729 14.4958L20.5042 9.02708L4.59375 24.9375C4.44792 25.0833 4.375 25.2583 4.375 25.4625ZM30.2021 10.2667C30.7708 9.69792 30.7708 8.77917 30.2021 8.21042L26.7896 4.79792C26.2208 4.22917 25.3021 4.22917 24.7333 4.79792L22.0646 7.46667L27.5333 12.9354L30.2021 10.2667Z" fill="black"/>
          
                      </svg>
                    </button>
                  </div>
                 }
                <div id="responseArea" contentEditable={editingMode} onInput={handleResponseChange}>
                  <p dangerouslySetInnerHTML={{ __html: response}}></p>
                </div>
              </div>
              
                <div className="button-container">
                {editingMode ? (
                  <>
                  <button className="btn primary" onClick={saveEditedOutput}>
                      Save Edited Output
                    </button></>):(
                      <>
                  <button className="btn secondary" onClick={saveOutput}>
                      Save Output
                  </button>
                <button className="btn secondary" onClick={resubmitInput}>
                  Regenerate Response
                </button>
                <button className="btn secondary" onClick={sendEmail}>
                  Send Email
                </button></>
                    )}
                </div>
                
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

export default Summarizer;
