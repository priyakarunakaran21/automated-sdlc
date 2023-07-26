const InputTemplate = ({display}) =>{

    return(
        <>
        {display === '1-layer template' && 
        <div className="template"><div className="prompt-field"><label>Input your prompt</label><textarea/></div></div>
        }  
        {display === '3-layer template' && 
         <div className="template">
         <div className="prompt-field">
             <label>Introduction: Provide the introductory content that sets the context for the prompt</label>
             <textarea/>
         </div>
         <div className="prompt-field">
             <label>Action: Provide the specific action or task you want the model to perform in response to the prompt</label>
             <textarea/>
         </div>
         <div className="prompt-field">
             <label>Conclusion: Provide any closing remarks or instructions or format to conclude the prompt</label>
             <textarea/>
         </div>
        </div>
        }
        {display === '5-layer template' && 
        <div className="template">
             <div className="prompt-field">
                <label>Introduction: Provide the introductory content that sets the context for the prompt</label>
                <textarea/>
            </div>
            <div className="prompt-field">
                <label>Context: Provide additional background information or context relevant to the prompt</label>
                <textarea/>
            </div>
            <div className="prompt-field">
                <label>Action: Provide the specific action or task you want the model to perform in response to the prompt</label>
                <textarea/>
            </div>
            <div className="prompt-field">
                <label>Variables: Provide the dynamic content or variables that the model can replace with actual values during prompt generation</label>
                <textarea/>
            </div>
            <div className="prompt-field">
                <label>Conclusion: Provide any closing remarks or instructions or format to conclude the prompt</label>
                <textarea/>
            </div>
            </div>
        }
    </>
    )
}

export default InputTemplate;