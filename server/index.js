
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;
const multer = require('multer');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const generatedId = () => Math.random().toString(36).substring(2, 10);

const upload = multer({
    storage: storage,
    limits: { fieldSize: 1024 * 1024 * 5 },
});

const database = [];

const GPTFunction = async (text, language = 'en') => {
    const prompts = {
        en: "I am writing a resume, my details are...",
        fr: "Je rédige un CV, mes détails sont..."
    };

    const promptText = prompts[language] + text;

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
            role: "user",
            content: promptText
        }],
        temperature: 0.6,
        max_tokens: 250
    });

    if (!response || !response.choices || response.choices.length === 0) {
        throw new Error('No response from OpenAI API');
    }

    return response.choices[0].message.content;
};

app.get("/api", (req, res) => {
    res.json({ message: "Welcome to the API" });
});

app.post("/resume/create", upload.single("headshotImage"), async (req, res) => {
    const { fullname, email, phoneNumber, linkedin, github, currentPosition, currentLength, currentTechnologies, workHistory, education } = req.body;

    const workArray = JSON.parse(workHistory);
    const educationArray = JSON.parse(education);

    const newEntry = {
        id: generatedId(),
        fullname,
        email,
        phoneNumber,
        linkedin,
        github,
        currentPosition,
        image_url: `http://localhost:4000/uploads/${req.file.filename}`,
        currentLength,
        currentTechnologies,
        workHistory: workArray,
        education: educationArray
    };

    const prompt1 = `I am writing a resume, my details are \n 
    Name: ${fullname} \n 
    Email: ${email} \n 
    Phone Number: ${phoneNumber} \n 
    LinkedIn: ${linkedin} \n 
    GitHub: ${github} \n 
    Current Position: ${currentPosition} \n 
    Years of Experience: ${currentLength} \n 
    I work with these technologies: ${currentTechnologies}. 
    Can you write me a 100 words description for the top of the resume (first person perspective)?`;

    const prompt2 = `I am writing a resume, my details are \n 
    Name: ${fullname} \n 
    Email: ${email} \n 
    Phone Number: ${phoneNumber} \n 
    LinkedIn: ${linkedin} \n 
    GitHub: ${github} \n 
    Current Position: ${currentPosition} \n 
    Years of Experience: ${currentLength} \n 
    I work with these technologies: ${currentTechnologies}. 
    Can you write me 10 points for a resume on what I am good at?`;

    const remainderText = () => {
        let stringText = "";
        for (let i = 0; i < workArray.length; i++) {
            stringText += `${workArray[i].name} as ${workArray[i].position}, `;
        }
        return stringText;
    };

    const educationText = () => {
        let stringText = "";
        for (let i = 0; i < educationArray.length; i++) {
            stringText += `${educationArray[i].degree} in ${educationArray[i].field} from ${educationArray[i].institution}, `;
        }
        return stringText;
    };

    const prompt3 = `I am writing a resume, my details are \n 
    Name: ${fullname} \n 
    Email: ${email} \n 
    Phone Number: ${phoneNumber} \n 
    LinkedIn: ${linkedin} \n 
    GitHub: ${github} \n 
    Current Position: ${currentPosition} \n 
    Years of Experience: ${currentLength} \n 
    I have worked at ${workArray.length} companies: ${remainderText()} \n 
    My education background includes: ${educationText()} \n 
    Can you write me 50 words for each company separated in numbers of my succession (in first person perspective)?`;

    const objective = await GPTFunction(prompt1);
    const keypoints = await GPTFunction(prompt2);
    const jobResponsibilities = await GPTFunction(prompt3);

    const chatgptData = { objective, keypoints, jobResponsibilities };
    const data = { ...newEntry, chatgptData };
    database.push(data);

    console.log(chatgptData);
    res.json({
        message: "Resume created successfully",
        data
    });
});

// app.post("/translate", async (req, res) => {
//     const { data, language } = req.body;

//     const translateText = async (text) => {
//         const response = await openai.chat.completions.create({
//             model: 'gpt-3.5-turbo',
//             messages: [{
//                 role: "user",
//                 content: `Translate this text to ${language}: ${text}`
//             }],
//             temperature: 0.6,
//             max_tokens: 250
//         });

//         if (!response || !response.choices || response.choices.length === 0) {
//             throw new Error('No response from OpenAI API');
//         }

//         return response.choices[0].message.content;
//     };

//     try {
//         const translatedData = { ...data };
//         translatedData.fullname = await translateText(data.fullname);
//         translatedData.currentPosition = await translateText(data.currentPosition);
//         translatedData.currentLength = await translateText(`${data.currentLength} years of experience`);
//         translatedData.currentTechnologies = await translateText(data.currentTechnologies);
//         translatedData.chatgptData.objective = await translateText(data.chatgptData.objective);
//         translatedData.chatgptData.keypoints = await translateText(data.chatgptData.keypoints);
//         translatedData.chatgptData.jobResponsibilities = await translateText(data.chatgptData.jobResponsibilities);
//         translatedData.headers = {
//             profileSummary: await translateText("PROFILE SUMMARY"),
//             workHistory: await translateText("WORK HISTORY"),
//             jobProfile: await translateText("JOB PROFILE"),
//             jobResponsibilities: await translateText("JOB RESPONSIBILITIES")
//         };
//         res.json(translatedData);
//     } catch (error) {
//         console.error("Translation Error:", error);
//         res.status(500).json({ message: "Error translating resume" });
//     }
// });

app.post("/translate", async (req, res) => {
    const { data, language } = req.body;

    const translateText = async (text) => {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: "user",
                content: `Translate the following text to ${language}, provide only the translation without any explanations or comments: ${text}`
            }],
            temperature: 0.6,
            max_tokens: 250
        });

        if (!response || !response.choices || response.choices.length === 0) {
            throw new Error('No response from OpenAI API');
        }

        const translatedText = response.choices[0].message.content;
        // Ensure we filter out any unintended explanations or comments
        const filteredText = translatedText.split('\n')
            .filter(line => !line.includes('(') && !line.includes(')') && !line.toLowerCase().includes('sorry') && !line.toLowerCase().includes('clarify'))
            .join(' ');

        return filteredText;
    };

    try {
        const translatedData = { ...data };
        translatedData.fullname = await translateText(data.fullname);
        translatedData.currentPosition = await translateText(data.currentPosition);
        translatedData.currentLength = await translateText(`${data.currentLength} years of experience`);
        translatedData.currentTechnologies = await translateText(data.currentTechnologies);
        translatedData.chatgptData.objective = await translateText(data.chatgptData.objective);
        translatedData.chatgptData.keypoints = await translateText(data.chatgptData.keypoints);
        translatedData.chatgptData.jobResponsibilities = await translateText(data.chatgptData.jobResponsibilities);
        translatedData.headers = {
            profileSummary: await translateText("PROFILE SUMMARY"),
            workHistory: await translateText("WORK HISTORY"),
            jobProfile: await translateText("JOB PROFILE"),
            jobResponsibilities: await translateText("JOB RESPONSIBILITIES")
        };

        // Translate each entry in the work history and education arrays
        translatedData.workHistory = await Promise.all(data.workHistory.map(async (work) => ({
            name: await translateText(work.name),
            position: await translateText(work.position),
            duration: await translateText(work.duration)
        })));

        translatedData.education = await Promise.all(data.education.map(async (edu) => ({
            degree: await translateText(edu.degree),
            field: await translateText(edu.field),
            institution: await translateText(edu.institution),
            date: await translateText(edu.date),
            gpa: await translateText(edu.gpa)
        })));

        res.json(translatedData);
    } catch (error) {
        console.error("Translation Error:", error);
        res.status(500).json({ message: "Error translating resume" });
    }
});



app.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});


