import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import Login from './pages/Login';
import Home from './components/Home';
import MeetingSummaraizer from './pages/MeetingSummaraizer';
import PromptEngineering from './pages/PromptEngineering';
import PersonalAssistant from './pages/PersonalAssistant';

function App() {
  // You can implement a basic authentication state here
  const isLoggedIn = false; // Replace with your authentication logic

  const PrivateRoute = ({ element: Element, ...rest }) => {
    return isLoggedIn ? <Element /> : <Navigate to="/automated-sdlc/app/" replace />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/automated-sdlc/app/" element={<Login />} />
        <Route path="/automated-sdlc/app/home" element={<Home />} />

         {/* with login navigate to modules */}
        <Route path="/automated-sdlc/app/meetingsummaraizer" element={<PrivateRoute element={<MeetingSummaraizer />} />} />
        <Route path="/automated-sdlc/app/promptengineering" element={<PrivateRoute element={<PromptEngineering />} />} />
        <Route path="/automated-sdlc/app/personalassistant" element={<PrivateRoute element={<PersonalAssistant />} />} />

      {/* without login navigate to modules */}
        {/* <Route path="/meetingsummaraizer" element={<MeetingSummaraizer />} />
        <Route path="/promptengineering" element={<PromptEngineering />} />
        <Route path="/personalassistant" element={<PersonalAssistant />}/> */}


      </Routes>
    </Router>
  );
}

export default App;
