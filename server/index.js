const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;
const multer = require('multer');
const path = require('path');

const OpenAI = require('openai');

require ('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static( 'uploads'));
const storage = multer.diskStorage({
    destination: (res, file, cb)=> {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


const generatedId = () => Math.random().toString(36).substring(2,10);


const upload = multer({ storage: storage,
limits: { fieldSize: 1024 * 1024 * 5 },
});

const database= [];


const GPTFunction = async (text) => {
    const response = await openai.chat.completions.create({
    model :'gpt-3.5-turbo',
    prompt: text,
    temperature : 0.6,
    max_tokens: 250,
    top_p :1,
    frequency_penalty: 1,
    presence_penalty : 1
    })
    return response.data.choices[0].text
    }




app.get("/api", (req, res) => {
    res.json({ message: "Welcome to the API" });
});


app.post("/resume/create",upload.single("headshotImage"),async (req,res) => {
    const{fullname,currentPosition,currentLength,currentTechnologies,workHistory} = req.body;

    const workArray = JSON.parse(workHistory);

    const newEntry ={
        id: generatedId(),
        fullname,
        currentPosition,
        image_url: `http://localhost:4000/uploads/${req.file.filename}`,
        currentPosition,
        currentLength,
        currentTechnologies,
        workHistory: workArray
    }

const prompt1 = `i am writing a resume, my details are \n  Name: ${fullname} \n Current Position: ${currentPosition} \n Years of Experience: ${currentLength} \n i work with this technologies : ${currentTechnologies}. can you write me a 100 words description for the top of the resume(first person perspective)?`;

const prompt2 = `i am writing a resume, my details are \n Name: ${fullname} \n Current Position: ${currentPosition} \n Years of Experience: ${currentLength} \n i work with this technologies: ${currentTechnologies}. can you write me a 10 points for a resume what i am good at?`;

const remainderText= ()=>{
    let stringText  = "";
    for (let i=0 ;i < workArray.length;i++){
        stringText += `${workArray[i].name}  as ${workArray[i].position}`;
        return stringText;
    }
}

const prompt3= `i am writing a resume, my details are \n Name: ${fullname} \n Current Position: ${currentPosition} \n Years of Experience: ${currentLength} \n i have worked at ${workArray.length} companies. ${remainderText()} \n Can you write me  50 words for each comapny seperated in numbers of my succession(in first person perspective)?`;

const objective = await GPTFunction(prompt1);
const keypoints = await GPTFunction(prompt2);
const jobResponsiblities= await GPTFunction(prompt3);

const chatgptData = {objective,keypoints,jobResponsiblities};
const data = { ...newEntry, chatgptData};
database.push(data);



        console.log(chatgptData);
        res.json({
            message: "Resume created successfully",
            data
    });

});



app.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
})