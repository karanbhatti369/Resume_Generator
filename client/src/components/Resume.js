
import React, { useRef } from 'react';
import ErrorPage from './ErrorPage';


import {useReactToPrint} from 'react-to-print';

const Resume = ({ result }) => {
  const componentRef = useRef();
  const handleprint =   useReactToPrint({
    content: () => componentRef.current,
    documentTitle : `${result.fullname} Resume`,
    onAfterPrint  : () => alert("Printing Successful")
  });

 
if (JSON.stringify(result) === '{}') {
    return <ErrorPage />
  }

  const replaceWithBr = (string) => {
    if (!string) return;
    return string.replace(/\n/g, '<br>');
  };
  
  console.log("Objective before replaceWithBr:", result.objective);

  return (
    <>
      <button onClick={handleprint}  >
        Print Resume
      </button>

      <main className='container' ref={componentRef}>
        <header className='header' >
          <div>
            <h1>{result.fullname}</h1>
            <p className='resumeTitle headerTitle'>
              {result.currentPosition}( {result.currentTechnologies})
            </p>

            <p className="resumeTitle">
              {result.currentLength} years of experience
            </p>
          </div>

          <div>
            <img
              className='resumeImage'
              src={result.image_url}
              alt={result.fullname}
            />
          </div>
        </header>

        <div className='resumeBody'>
          <div>
            <h2 className='resumeBodyTitle' >
              PROFILE SUMMARY
            </h2>
            <p dangerouslySetInnerHTML={{
              __html: replaceWithBr(result.chatgptData.objective),
            }}
              className='resumeBodycontent'
            />
          </div>

          <div>
            <h2 className='resumeBodyTitle'>
              WORK HISTORY
            </h2>
            {
              result.workHistory.map((work) => (
                <p className='resumeBodycontent' key={work.name}>
                  <span style={{ fontWeight: 'bold' }}>{work.name}</span> -   {" "}
                  {work.position}
                </p>
              ))
            }
          </div>

          <div>

            <h2 className="resumeBodyTitle">
              JOB PROFILE
            </h2>
            <p dangerouslySetInnerHTML={{
              __html: replaceWithBr(result.chatgptData.jobResponsiblities ),
            }}
              className='resumeBodycontent'
            />

          </div>

          <div>

            <h2 className="resumeBodyTitle">
              JOB RESPONSIBILITIES
            </h2>
            <p dangerouslySetInnerHTML={{
  __html: replaceWithBr(result.chatgptData.keypoints),
}} className='resumeBodycontent' />


          </div>
        </div>
      </main>

    </>
  );
}

export default Resume;