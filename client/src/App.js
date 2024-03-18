import './App.css';
import Home from './components/Home';
import Resume from './components/Resume';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  const [result , setResult] = useState({});

  return (
    <Router>
    
    <div className="App">
    <div className="wave"></div>
    <div className="wave"></div>
    <div className="wave"></div>
    <h1 className="rubik-maps-regular">Resume  Builder with OpenAi</h1>
    
  <Routes>
   <Route path='/' element={<Home setResult={setResult} />} />
   <Route path='/resume' element={<Resume result={result} />} />
  </Routes>


    </div>
    </Router>
  );
}

export default App;
