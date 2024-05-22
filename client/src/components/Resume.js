import React, { useRef, useState } from 'react';
import ErrorPage from './ErrorPage';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import Loading from './Loading';

const Resume = ({ result }) => {
    const [translatedResult, setTranslatedResult] = useState(null);
    const [loadingTranslate, setLoadingTranslate] = useState(false);
    const componentRef = useRef();
    const translateRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => (translatedResult ? translateRef.current : componentRef.current),
        documentTitle: `${result.fullname} Resume`,
        onAfterPrint: () => alert("Printing Successful")
    });

    const handleTranslate = async () => {
        setLoadingTranslate(true);
        try {
            const response = await axios.post("http://localhost:4000/translate", { data: result, language: "fr" });
            setTranslatedResult(response.data);
        } catch (error) {
            console.error("Translation Error:", error);
        }
        setLoadingTranslate(false);
    };

    if (JSON.stringify(result) === '{}') {
        return <ErrorPage />;
    }

    const replaceWithBr = (string) => {
        if (!string) return;
        return string.replace(/\n/g, '<br>');
    };

    const renderResume = (data, ref) => (
        <main className='container' ref={ref}>
            <header className='header'>
                <div>
                    <h1>{data.fullname}</h1>
                    <p className='resumeTitle headerTitle'>
                        {data.currentPosition} ({data.currentTechnologies})
                    </p>
                    <p className="resumeTitle">
                        {data.currentLength} years of experience
                    </p>
                    <p className="resumeTitle">
                        Email: {data.email}
                    </p>
                    <p className="resumeTitle">
                        Phone: {data.phoneNumber}
                    </p>
                    <p className="resumeTitle">
                        LinkedIn: <a href={data.linkedin} target="_blank" rel="noopener noreferrer">{data.linkedin}</a>
                    </p>
                    <p className="resumeTitle">
                        GitHub: <a href={data.github} target="_blank" rel="noopener noreferrer">{data.github}</a>
                    </p>
                </div>
                <div>
                    <img className='resumeImage' src={data.image_url} alt={data.fullname} />
                </div>
            </header>

            <div className='resumeBody'>
                <div>
                    <h2 className='resumeBodyTitle'>PROFILE SUMMARY</h2>
                    <p dangerouslySetInnerHTML={{ __html: replaceWithBr(data.chatgptData.objective) }} className='resumeBodycontent' />
                </div>

                <div>
                    <h2 className='resumeBodyTitle'>WORK HISTORY</h2>
                    {data.workHistory.map((work, index) => (
                        <p className='resumeBodycontent' key={index}>
                            <span style={{ fontWeight: 'bold' }}>{work.name}</span> - {" "}
                            {work.position} ({work.duration})
                        </p>
                    ))}
                </div>

                <div>
                    <h2 className="resumeBodyTitle">JOB PROFILE</h2>
                    <p dangerouslySetInnerHTML={{ __html: replaceWithBr(data.chatgptData.jobResponsibilities) }} className='resumeBodycontent' />
                </div>

                <div>
                    <h2 className="resumeBodyTitle">JOB RESPONSIBILITIES</h2>
                    <p dangerouslySetInnerHTML={{ __html: replaceWithBr(data.chatgptData.keypoints) }} className='resumeBodycontent' />
                </div>

                <div>
                    <h2 className="resumeBodyTitle">EDUCATION</h2>
                    {data.education.map((edu, index) => (
                        <p className='resumeBodycontent' key={index}>
                            <span style={{ fontWeight: 'bold' }}>{edu.degree}</span> in {" "}
                            {edu.field} from {edu.institution} ({edu.date}) - GPA: {edu.gpa}
                        </p>
                    ))}
                </div>
            </div>
        </main>
    );

    return (
        <div className="resumeContainer">
            {loadingTranslate ? (
                <Loading message="Translating, please wait ..." />
            ) : (
                translatedResult ? renderResume(translatedResult, translateRef) : renderResume(result, componentRef)
            )}
            <div className="buttonContainer">
                <button className='translateButton' onClick={handleTranslate}>Translate</button>
                <button className='printButton' onClick={handlePrint}>Print Resume</button>
            </div>
        </div>
    );
};

export default Resume;
