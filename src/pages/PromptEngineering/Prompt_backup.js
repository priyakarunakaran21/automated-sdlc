import {useState} from 'react';
import axios from 'axios';
import './style.scss';
import CustomDropdownLabels from '../../components/Controls/CustomSelectLabels/CustomSelectLabels';
import CustomSelectRadios from '../../components/Controls/CustomSelectRadios/CustomSelectRadios';
import ThreeLayerTemplate from './ThreeLayerTemplate';
import FiveLayerTemplate from './FiveLayerTemplate';

const baseURL = "https://api.openai.com/v1/engines/text-davinci-003/completions";

    const openaiApiKey = "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"; // Replace with your OpenAI API key
const options = ['Option 1', 'Option 2', 'Option 3'];
const templateOptions = ["1-layer template","3-layer template","5-layer template" ];
const categoriesData = [
    {
      id: 1,
      name: 'Planning Phase',
      subcategories: ["Requirements Gathering", "Project Scope", "Project Timeline", "Resource Allocation"],
    },
    {
      id: 2,
      name: 'Analysis and Design Phase',
      subcategories: ["System Analysis", "System Design"],
    },
    {
      id: 3,
      name: 'Development Phase',
      subcategories: ["Coding Practices", "Unit Testing", "Integration Testing", "Version Control"],
    },
    {
        id: 4,
        name: 'Testing and Quality Assurance Phase',
        subcategories: ["Functional Testing", "Performance Testing", "Security Testing", "User Acceptance Testing"],
      },
    {
    id: 5,
    name: 'Deployment Phase',
    subcategories: ["Release Management", "Deployment Automation", "Documentation"],
    }, 
    {
    id: 6,
    name: 'Maintenance and Support Phase',
    subcategories: ["Bug Fixing", "Enhancements", "User Support"],
    },
  ];

const Prompt = () =>{

    const [tempate, setTemplate] = useState(templateOptions[0]);
    const [modal, setModal] = useState();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [input, setInput] = useState("");
    const [response, setResponse] = useState('');

    const handleCategoryChange = (event) => {
        const selectedCategory = event.target.value;
        setSelectedCategory(selectedCategory);
        setSelectedSubcategory(''); // Reset subcategory when category changes
        setResponse('');
      };
    const filteredSubcategories = categoriesData.find((category) => category.name === selectedCategory)?.subcategories || [];

    const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
    setResponse(''); 
    };
    const handleInputChange = (event) =>{
        setInput(event.target.value);
    }
      
    const handleOptionChange = (option) => {
        setTemplate(option);
      };
    const handleModalChange = (option) =>{
    setModal(option);  
    }
    const generateResponse = async () => {
        const prompt = `User input: ${input}. Please generate a response.`;
        try {
          const response = await axios.post(
            baseURL,
            {
              prompt,
              max_tokens: 100,
              temperature: 0.7,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${openaiApiKey}`
              },
            }
          );
          setResponse(response.data.choices[0].text);
        } catch (error) {
          console.error('Error generating response:', error);
          setResponse('Error generating response. Please try again later.');
        }
      };

      const renderComponent = () => {
        switch (tempate) {
          case '1-layer template':
            return  <div className="template one"><textarea onChange={handleInputChange} placeholder="Enter your prompt here..."/></div>;
          case '3-layer template':
            return <ThreeLayerTemplate/>;
          case '5-layer template':
            return <FiveLayerTemplate/>;
          default:
            return null;
        }
      };

    return(
        <>
        <div className="prompt-contianer">
            <div className="config-wrapper">
                <div className="config-items">
                        <div className="form-group">
                            <label>Modal</label>
                            <CustomDropdownLabels options={options} onChange={handleModalChange}/>
                        </div>
                        <div className="form-group">
                            <label>Temp</label>
                            <input type="text"  defaultValue="0.7"/>
                        </div>
                </div>
                <div className="template-btn"><button>Select Template</button>
                <CustomSelectRadios options={templateOptions} onChange={handleOptionChange}/>
                </div>
            </div>
            <div>
            <div className="prompt-area">
                <div className="category-controls">
                    <label>Category</label>
                {/* <CustomDropdownLabels options={categories} onChange={handleCategoryChange}/> */}
                    <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
                        <option value="">Select a category</option>
                        {categoriesData.map((category) => (
                            <option key={category.id} value={category.name}>
                            {category.name}
                            </option>
                        ))}
                    </select>
                    {selectedCategory && (
                    <>
                    <label htmlFor="subcategory">Select Subcategory:</label>
                    <select id="subcategory" value={selectedSubcategory} onChange={handleSubcategoryChange}>
                        <option value="">Select a subcategory</option>
                        {filteredSubcategories.map((subcategory) => (
                        <option key={subcategory} value={subcategory}>
                            {subcategory}
                        </option>
                        ))}
                    </select>
                    </>
                    )}
                </div>

            {renderComponent()}
            <div className="btn-container-right">
            <input type="button" className="primary-btn" value="Generate" onClick={generateResponse}/>  </div>        
            </div>
            <div className="response-area">
            {response ?<div>Response: {response}</div>: "See your responses here.."}
                
            </div>
            </div>
           
        </div>
         <div className="full-column">
         <div className="btn-container">
         <input className="secondary-btn" type="button" value="cancel"/><input className="primary-btn" disabled type="submit" value="Commit"/>
         </div>
     </div>
     </>
    )
}

export default Prompt;