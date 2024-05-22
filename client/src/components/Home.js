import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

const Home = ({ setResult }) => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [github, setGithub] = useState("");
    const [currentPosition, setCurrentPosition] = useState("");
    const [currentLength, setCurrentLength] = useState("");
    const [currentTechnologies, setCurrentTechnologies] = useState("");
    const [headshot, setHeadshot] = useState(null);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [companyInfo, setCompanyInfo] = useState([{ name: "", position: "", duration: "" }]);
    const [education, setEducation] = useState([{ degree: "", institution: "", field: "", date: "", gpa: "" }]);
    const navigate = useNavigate();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setLoadingCreate(true);

        const formData = new FormData();
        formData.append("headshotImage", headshot);
        formData.append("fullname", fullName);
        formData.append("email", email);
        formData.append("phoneNumber", phoneNumber);
        formData.append("linkedin", linkedin);
        formData.append("github", github);
        formData.append("currentPosition", currentPosition);
        formData.append("currentLength", currentLength);
        formData.append("currentTechnologies", currentTechnologies);
        formData.append("workHistory", JSON.stringify(companyInfo));
        formData.append("education", JSON.stringify(education));

        axios.post("http://localhost:4000/resume/create", formData, {})
            .then((res) => {
                if (res.data.message) {
                    setResult(res.data.data);
                    navigate('/resume');
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoadingCreate(false);
            });
    };

    const handleAddCompany = () => {
        setCompanyInfo([...companyInfo, { name: "", position: "", duration: "" }]);
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

    const handleAddEducation = () => {
        setEducation([...education, { degree: "", institution: "", field: "", date: "", gpa: "" }]);
    };

    const handleRemoveEducation = (index) => {
        const list = [...education];
        list.splice(index, 1);
        setEducation(list);
    };

    const handleUpdateEducation = (e, index) => {
        const { name, value } = e.target;
        const list = [...education];
        list[index][name] = value;
        setEducation(list);
    };

    if (loadingCreate) {
        return <Loading message="Creating Resume, please wait ..." />;
    }

    return (
        <div className="app">
            <header>
                <h1>Resume Builder with OpenAi</h1>
                <h1>Resume Builder</h1>
                <p>Create Job Winning Resume with AI in Seconds</p>
            </header>
            <form onSubmit={handleFormSubmit} method='POST'>
                <section>
                    <h2>Personal Details</h2>
                    <div className="grid-container">
                        <div className="grid-item">
                            <label htmlFor="fullname">Enter your full name</label>
                            <input
                                name="fullname"
                                type='text'
                                required
                                id="fullname"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)} />
                        </div>
                        <div className="grid-item">
                            <label htmlFor="email">Email</label>
                            <input
                                name="email"
                                type='email'
                                required
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="grid-item">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input
                                name="phoneNumber"
                                type='tel'
                                required
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                        <div className="grid-item">
                            <label htmlFor="linkedin">LinkedIn Profile</label>
                            <input
                                name="linkedin"
                                type='url'
                                required
                                id="linkedin"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)} />
                        </div>
                        <div className="grid-item">
                            <label htmlFor="github">GitHub Profile</label>
                            <input
                                name="github"
                                type='url'
                                required
                                id="github"
                                value={github}
                                onChange={(e) => setGithub(e.target.value)} />
                        </div>
                    </div>
                </section>

                <section>
                    <h2>Current Position</h2>
                    <div className="grid-container">
                        <div className="grid-item">
                            <label htmlFor="currentPosition">Current Position</label>
                            <input
                                name="currentPosition"
                                type='text'
                                required
                                id="currentPosition"
                                value={currentPosition}
                                onChange={(e) => setCurrentPosition(e.target.value)} />
                        </div>
                        <div className="grid-item">
                            <label htmlFor="currentLength">For how long? (year)</label>
                            <input
                                name="currentLength"
                                type='number'
                                required
                                id="currentLength"
                                value={currentLength}
                                onChange={(e) => setCurrentLength(e.target.value)} />
                        </div>
                        <div className="grid-item">
                            <label htmlFor="currentTechnologies">Technologies used?</label>
                            <input
                                name="currentTechnologies"
                                type='text'
                                required
                                id="currentTechnologies"
                                value={currentTechnologies}
                                onChange={(e) => setCurrentTechnologies(e.target.value)} />
                        </div>
                        <div className="grid-item">
                            <label htmlFor="photo">Upload image</label>
                            <input
                                name="photo"
                                type='file'
                                required
                                id="photo"
                                accept='image/x-png,image/jpeg'
                                onChange={(e) => setHeadshot(e.target.files[0])} />
                        </div>
                    </div>
                </section>

                <section>
                    <h2>Work History</h2>
                    {companyInfo.map((company, index) => (
                        <div className='nestedContainer' key={index}>
                            <div className='companies'>
                                <label htmlFor="name">Company Name</label>
                                <input
                                    type='text'
                                    name="name"
                                    required
                                    value={company.name}
                                    onChange={(e) => handleUpdateCompany(e, index)}
                                />
                            </div>
                            <div className='companies'>
                                <label htmlFor="position">Position Held</label>
                                <input
                                    type='text'
                                    name="position"
                                    required
                                    value={company.position}
                                    onChange={(e) => handleUpdateCompany(e, index)}
                                />
                            </div>
                            <div className='companies'>
                                <label htmlFor="duration">Duration</label>
                                <input
                                    type='text'
                                    name="duration"
                                    required
                                    value={company.duration}
                                    onChange={(e) => handleUpdateCompany(e, index)}
                                />
                            </div>
                            <div className='btn_group'>
                                {companyInfo.length - 1 === index && companyInfo.length < 4 &&
                                    <button type="button" id="addBtn" onClick={handleAddCompany}>Add Company</button>}
                                {companyInfo.length > 1 &&
                                    <button type="button" id="deleteBtn" onClick={() => handleRemoveCompany(index)}>Remove</button>}
                            </div>
                        </div>
                    ))}
                </section>

                <section>
                    <h2>Education Details</h2>
                    {education.map((edu, index) => (
                        <div className='nestedContainer' key={index}>
                            <div className='companies'>
                                <label htmlFor="degree">Degree</label>
                                <input
                                    type='text'
                                    name="degree"
                                    required
                                    value={edu.degree}
                                    onChange={(e) => handleUpdateEducation(e, index)}
                                />
                            </div>
                            <div className='companies'>
                                <label htmlFor="institution">Institution</label>
                                <input
                                    type='text'
                                    name="institution"
                                    required
                                    value={edu.institution}
                                    onChange={(e) => handleUpdateEducation(e, index)}
                                />
                            </div>
                            <div className='companies'>
                                <label htmlFor="field">Field of Study</label>
                                <input
                                    type='text'
                                    name="field"
                                    required
                                    value={edu.field}
                                    onChange={(e) => handleUpdateEducation(e, index)}
                                />
                            </div>
                            <div className='companies'>
                                <label htmlFor="date">Date of Completion</label>
                                <input
                                    type='date'
                                    name="date"
                                    required
                                    value={edu.date}
                                    onChange={(e) => handleUpdateEducation(e, index)}
                                />
                            </div>
                            <div className='companies'>
                                <label htmlFor="gpa">GPA</label>
                                <input
                                    type='text'
                                    name="gpa"
                                    required
                                    value={edu.gpa}
                                    onChange={(e) => handleUpdateEducation(e, index)}
                                />
                            </div>
                            <div className='btn_group'>
                                {education.length - 1 === index && education.length < 4 &&
                                    <button type="button" id="addBtn" onClick={handleAddEducation}>Add Education</button>}
                                {education.length > 1 &&
                                    <button type="button" id="deleteBtn" onClick={() => handleRemoveEducation(index)}>Remove</button>}
                            </div>
                        </div>
                    ))}
                </section>

                <button type="submit">Create Resume</button>
            </form>
        </div>
    );
};

export default Home;
