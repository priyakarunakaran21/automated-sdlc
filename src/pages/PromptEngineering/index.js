import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Prompt from './Prompt';

function PromptEngineering() {
  return (
    <>
    <Header/>
    <div className="main-wrapper">
      <h1>Generate prompts using Prompt Engineering</h1>
    
      <Prompt/>
    </div>
    <Footer/>
    </>
  );
}

export default PromptEngineering;
