import {useState} from 'react';
import './style.scss';
import InputTemplate from './InputTemplate';

const templateOptions = ["1-layer template","3-layer template","5-layer template" ];

const Prompt = () =>{
  const [template, setTemplate] = useState(templateOptions[2]);
   
      const handleTemplateChange = (event) =>{
          setTemplate(event.target.value);
      }
     
    return(
        <>
        <h2>Prompt</h2>
        <div className="prompt-contianer">
            <div className="config-wrapper">
              <div className="config-section">
                  <h2>Project details</h2>
                  <div className="form-group">
                    <label>Categories</label>
                    <select>
                      <option>Requirement phase</option>
                      <option>Development phase</option>
                      <option>Support and testing phase</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Task</label>
                    <select>
                      <option>task 1</option>
                      <option>task 2</option>
                      <option>task 3</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Project Name</label>
                    <span>Automated member response</span>
                  </div>
              </div>
                <div className="config-section">
                <h2>Settings</h2>
                        <div className="form-group">
                            <label>Modal</label>
                            <select>
                      <option>gpt-3.5-turbo</option>
                      <option>davinci</option>
                      <option>text-davinci-002</option>
                      <option>curie</option>
                    </select>
                        </div>
                        <div className="form-group">
                            <label>Temp</label>
                            <input type="text" defaultValue="0.7"/>
                        </div>
                </div>
                <div className="config-section">
                <h2>Template</h2>
                        
                        <div className="form-group">
                            <label>Select Template</label>
                            <select id="template" value={template} onChange={handleTemplateChange}>
                        {templateOptions.map((tem, index) => (
                            <option key={index} value={tem}>
                            {tem}
                            </option>
                        ))}
                    </select>
                           
                        </div>
                </div>
                
            </div>
            
            <div className="right-wrapper">
            <div className="prompt-area">
              <InputTemplate display={template}/>
              <div className="btn-container-right">
              <input type="button" className="primary-btn" value="Generate"/>
              </div>        
            </div>
            
            </div>
           
        </div>
        <h2>Response</h2>
        <div className="response-area">
            <div>Response:: "See your responses here.."</div>
                
            </div>
         <div className="full-column">
         <div className="btn-container-right">
         <input className="secondary-btn" type="button" value="cancel"/><input className="primary-btn" disabled type="submit" value="Commit"/>
         </div>
     </div>
     </>
    )
}

export default Prompt;