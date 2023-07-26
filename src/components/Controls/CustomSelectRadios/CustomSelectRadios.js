import React, { useState } from 'react';
import './CustomSelectRadios.scss';

const CustomSelectRadios = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown-radio">
      <div className="selected-option" onClick={toggleDropdown}>
        {selectedOption}
      </div>
      {isOpen && (
        <ul className="dropdown-options">
          {options.map((option) => (
            <li key={option} onClick={() => handleOptionClick(option)}>
               <input
                  type="radio"
                  name="dropdownOption"
                  value={option}
                  checked={option === selectedOption}
                  onChange={() => handleOptionClick(option)}
                />
              <label className="radio-label">{option}</label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelectRadios;
