import React from 'react';
import { Link } from 'react-router-dom';
import ms_icon from '../assets/images/meeting_summaraizer.png'
import mr_icon from '../assets/images/member_response.png'
import pe_icon from '../assets/images/prompt_engineering.png'
import pa_icon from '../assets/images/personal_assistant.png'
import pm_icon from '../assets/images/project_management.png'
import rg_icon from '../assets/images/requirement_gathering.png'

function Home() {
  return (
    <div className="home-wrapper">
      <div className="home-title">
      <h1>Automated SDLC Hub</h1>
      <span>"Your Smart Workspace for Enhanced Productivity and Collaboration"</span>
      </div>
      <ul>
        <li>
          <Link to="/automated-sdlc/app/meetingsummaraizer"><img src={ms_icon} alt=""/><span>Meeting Summaraizer</span></Link>
        </li>
        <li>
          <Link to="/automated-sdlc/app/requirementgathering"><img src={rg_icon} alt=""/><span>Requirement Gathering Form</span></Link>
        </li>
        <li>
          <Link to="/automated-sdlc/app/automatedresponse"><img src={mr_icon} alt=""/><span>Automated Member response</span></Link>
        </li>
        <li>
          <Link to="/automated-sdlc/app/personalassistant"><img src={pa_icon} alt=""/><span>Personal Assistant</span></Link>
        </li>
        <li>
          <Link to="/automated-sdlc/app/promptengineering"><img src={pe_icon} alt=""/><span>Prompt Engineering</span></Link>
        </li>
        <li>
          <Link to="/automated-sdlc/app/personalassistant"><img src={pm_icon} alt=""/><span>Project Management</span></Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;
