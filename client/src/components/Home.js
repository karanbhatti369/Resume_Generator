import Loading from './Loading';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

const Home = ({setResult}) => {
    const [fullName, setFullName] = useState("");
    const [currentPosition, setCurrentPosition] = useState(""); // Changed to setCurrentPosition
    const [currentLength, setCurrentLength] = useState(""); // Changed to setCurrentLength
    const [currentTechnologies, setCurrentTechnologies] = useState(""); // Changed to setCurrentTechnologies
    const [headshot, setHeadshot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [companyInfo, setCompanyInfo] = useState([{ name: "", position: "", duration: "" }]); // Changed to setCompanyInfo
    const navigate = useNavigate();





    // Function to handle form submission.
    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log({
            fullName,
            currentPosition,
            currentLength,
            currentTechnologies,
            headshot
        });

        const formData = new FormData();
        formData.append("headshotImage", headshot);
        formData.append("fullname", fullName);
        formData.append("currentPosition", currentPosition); // Corrected to "currentPosition"
        formData.append("currentLength", currentLength); // Corrected to "currentLength"
        formData.append("currentTechnologies", currentTechnologies);
        formData.append("workHistory", JSON.stringify(companyInfo));

        axios.post("http://localhost:4000/resume/create", formData, {})
            .then((res) => {
                if (res.data.message) {
                    console.log(res.data.data);
                    setResult(res.data.data);
                    navigate('/resume'); // Changed to window.location.href
                }
            })
            .catch((err) => {
                console.log(err);
            });

        setLoading(true);
    };

    const handleAddCompany = () => {
        setCompanyInfo([...companyInfo, { name: "", position: "" }]);
    };

    const handleRemoveCompany = (index) => {
        const list = [...companyInfo];
        list.splice(index, 1);
        setCompanyInfo(list);
    };

    const handleUpdateCompany = (e, index) => {
        const { name, value } = e.target;
        const list = [...companyInfo];
        list[index][name] = value;
        setCompanyInfo(list);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="app">
          <p>Create Job Winning Resume with AI in Seconds</p>
          <form onSubmit={handleFormSubmit} method='POST' className="resume-form">
            <div className="form-group">
              <label htmlFor="fullname">Enter your full name</label>
              <input
                name="fullname"
                type='text'
                required
                id="fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)} />
            </div>
    
            <div className="form-group">
              <label htmlFor="currentPosition">Current Position</label>
              <input
                name="currentPosition"
                type='text'
                required
                id="currentPosition"
                value={currentPosition}
                onChange={(e) => setCurrentPosition(e.target.value)} />
            </div>
    
            <div className="form-group">
              <label htmlFor="currentLength">For how long?(year)</label>
              <input
                name="currentLength"
                type='number'
                required
                id="currentLength"
                value={currentLength}
                onChange={(e) => setCurrentLength(e.target.value)} />
            </div>
    
            <div className="form-group">
              <label htmlFor="currentTechnologies">Technologies used?</label>
              <input
                name="currentTechnologies"
                type='text'
                required
                id="currentTechnologies"
                value={currentTechnologies}
                onChange={(e) => setCurrentTechnologies(e.target.value)} />
            </div>
    
            <div className="form-group">
              <label htmlFor="photo">Upload image</label>
              <input
                name="photo"
                type='file'
                required
                id="photo"
                accept='image/x-png,image/jpeg'
                onChange={(e) => setHeadshot(e.target.files[0])} />
            </div>
    
            {companyInfo.map((company, index) => (
              <div className="form-group" key={index}>
                <label htmlFor={`name-${index}`}>Company Name</label>
                <input
                  type='text'
                  name="name"
                  required
                  id={`name-${index}`}
                  value={company.name}
                  onChange={(e) => handleUpdateCompany(e, index)} />
    
                <label htmlFor={`position-${index}`}>Position Held</label>
                <input
                  type='text'
                  name="position"
                  required
                  id={`position-${index}`}
                  value={company.position}
                  onChange={(e) => handleUpdateCompany(e, index)} />
    
                {companyInfo.length - 1 === index && companyInfo.length < 4 &&
                  <button type="button" className="add-btn" onClick={handleAddCompany}>Add Company</button>}
    
                {companyInfo.length > 1 &&
                  <button type="button" className="delete-btn" onClick={() => handleRemoveCompany(index)}>Remove</button>}
              </div>
            ))}
    
            <button type="submit" className="create-resume-btn">Create Resume</button>
          </form>
        </div>
      );
    };
    
    export default Home;