import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <ul>
        <li>
          <Link to="/meetingsummaraizer">MeetingSummaraizer</Link>
        </li>
        <li>
          <Link to="/promptengineering">PromptEngineering</Link>
        </li>
        <li>
          <Link to="/personalassistant">PersonalAssistant</Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;
