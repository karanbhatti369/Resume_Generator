import './App.css';
import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen.js';
import Home from './components/Home';
import Resume from './components/Resume';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [result, setResult] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Simulate loading completion
    }, 3000); // Adjust loading time as needed
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="App">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
        <h1 className="rubik-maps-regular">Resume Builder with OpenAi</h1>
        <Routes>
          <Route path='/' element={<Home setResult={setResult} />} />
          <Route path='/resume' element={<Resume result={result} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
