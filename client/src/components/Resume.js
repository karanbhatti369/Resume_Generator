
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
  
 

  return (
    <>
      <button onClick={handleprint}  >
        Print Resume
      </button>

      <main className='container' ref={componentRef}>
        <header className='header' >
          <div>
            <h1>{result.fullname}</h1>
            <p className='resumeTitle heaherTitle'>
              {result.currentPosition}( {result.currentTechnologies})
            </p>

            <p className="resumeTitle">
              {result.currentLength} years of experience
            </p>
          </div>

          <div>
            <img
              src={result.image_url}
              alt={result.fullname}
              className='resumeImage'
            />
          </div>
        </header>

        <div className='resumeBody'>
          <div>
            <h2 className='resumeBodyTitle' >
              PROFILE SUMMARY
            </h2>
            <p dangerouslySetInnerHTML={{
              __html: replaceWithBr(result.objective),
            }}
              className='resumeBodycontent'
            />
          </div>

          <div>
            <h2 className='resumeBodyTitle'>
              WORK EXPERIENCE
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
              __html: replaceWithBr(result.jobResponsibilties),
            }}
              className='resumeBodycontent'
            />

          </div>

          <div>

            <h2 className="resumeBodyTitle">
              JOB RESPONSIBILITIES
            </h2>
            <p dangerouslySetInnerHTML={{
  __html: replaceWithBr(result.objective),
}} className='resumeBodycontent' />


          </div>
        </div>
      </main>

    </>
  );
}

export default Resume;