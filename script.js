const lessons = {
    basic: {
        title: "Conversación Básica",
        topics: {
            "Introducing Yourself": {
                questions: [
                    { text: "What is your name?", time: 5 },
                    { text: "How old are you?", time: 5 },
                    { text: "Where are you from?", time: 7 },
                    { text: "Do you have any siblings?", time: 8 },
                    { text: "What do you do for a living?", time: 8 },
                    { text: "What do you like to do in your free time?", time: 7 },
                    { text: "Do you have any hobbies?", time: 8 },
                    { text: "What kind of music do you enjoy?", time: 8 }
                ]
            },
            "Daily Routines": {
                questions: [
                    { text: "What time do you usually wake up?", time: 10 },
                    { text: "What do you usually have for breakfast?", time: 8 },
                    { text: "How do you get to work/school?", time: 8 },
                    { text: "What do you do in the morning at work/school?", time: 9 },
                    { text: "What time do you usually have lunch?", time: 8 },
                    { text: "What do you do after lunch?", time: 7 },
                    { text: "What time do you finish work/school?", time: 7 },
                    { text: "What do you do in the evening?", time: 8 }
                ]
            },
            "Using Time Expressions": {
                questions: [
                    { text: "What do you usually do in the morning?", time: 10 },
                    { text: "What do you like to do after lunch?", time: 8 },
                    { text: "What do you do in the afternoon?", time: 8 },
                    { text: "What do you do in the evening?", time: 9 },
                    { text: "Do you ever take a nap?", time: 8 },
                    { text: "What time do you go to bed?", time: 8 },
                    { text: "How do you spend your weekends?", time: 10 },
                    { text: "What is your favorite time of day?", time: 9 }
                ]
            }
        }
    },
    intermediate: {
        title: "Conversación Intermedia",
        topics: {
            "Traveling": {
                questions: [
                    { text: "Where was your last vacation?", time: 8 },
                    { text: "What is your dream destination?", time: 9 },
                    { text: "Do you prefer the beach or the mountains?", time: 7 },
                    { text: "How do you usually travel?", time: 8 },
                    { text: "What is your favorite way to travel?", time: 7 },
                    { text: "What is your favorite travel memory?", time: 10 },
                    { text: "Have you ever traveled abroad?", time: 8 },
                    { text: "What do you enjoy most about traveling?", time: 9 }
                ]
            },
            "Hobbies": {
                questions: [
                    { text: "What is your favorite hobby?", time: 6 },
                    { text: "How often do you practice your hobby?", time: 7 },
                    { text: "What do you enjoy most about it?", time: 8 },
                    { text: "Have you ever shared your hobby with others?", time: 8 },
                    { text: "What hobbies would you like to try?", time: 8 },
                    { text: "Do you prefer indoor or outdoor hobbies?", time: 7 },
                    { text: "What skills have you gained from your hobby?", time: 9 },
                    { text: "What hobby do you think is overrated?", time: 8 }
                ]
            }
        }
    },
    advanced: {
        title: "Conversación Avanzada",
        topics: {
            "Career Goals": {
                questions: [
                    { text: "What are your career aspirations?", time: 10 },
                    { text: "What skills are essential for your job?", time: 8 },
                    { text: "How do you handle work-related stress?", time: 9 },
                    { text: "What is your dream job?", time: 8 },
                    { text: "How do you plan to achieve your goals?", time: 10 },
                    { text: "What are the challenges in your career?", time: 9 },
                    { text: "How do you stay motivated at work?", time: 8 },
                    { text: "What advice would you give to someone starting in your field?", time: 9 }
                ]
            },
            "Future Trends": {
                questions: [
                    { text: "What technological trends do you foresee?", time: 10 },
                    { text: "How do you think the job market will change?", time: 8 },
                    { text: "What skills will be in demand in the future?", time: 9 },
                    { text: "How can we prepare for future challenges?", time: 8 },
                    { text: "What do you think about remote work?", time: 10 },
                    { text: "How will AI impact our lives?", time: 9 },
                    { text: "What is your opinion on sustainable living?", time: 8 },
                    { text: "What trends do you see in education?", time: 9 }
                ]
            }
        }
    }
};

let currentLesson = null;
let currentTopic = null;
let currentQuestionIndex = 0;
let mediaRecorder;
let audioChunks = [];
let timerInterval;

function showLesson(lesson) {
    currentLesson = lessons[lesson];
    currentTopic = null;
    currentQuestionIndex = 0;
    audioChunks = []; // Reset audio chunks
    document.getElementById('lessonContainer').innerHTML = `
        <h2>${currentLesson.title}</h2>
        <h3>Select a topic:</h3>
        <div class="menu">
            ${Object.keys(currentLesson.topics).map(topicKey => `
                <button class="button" onclick="showTopic('${topicKey}')">
                    ${topicKey}
                </button>
            `).join('')}
        </div>
    `;
}

function showTopic(topicKey) {
    currentTopic = currentLesson.topics[topicKey];
    currentQuestionIndex = 0;
    audioChunks = []; // Reset audio chunks
    document.getElementById('lessonContainer').innerHTML = `
        <h2>${topicKey}</h2>
        <h3>Click "START" to begin</h3>
        <button class="button" onclick="startRecording()">START</button>
        <div id="questionContainer" style="display:none;">
            <div id="question" class="question">${currentTopic.questions[currentQuestionIndex].text}</div>
            <div id="timer" class="countdown"></div>
        </div>
    `;
}

function startRecording() {
    document.getElementById('questionContainer').style.display = 'block';
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.start();
            startTimer(currentTopic.questions[currentQuestionIndex].time);
            setTimeout(stopRecording, currentTopic.questions[currentQuestionIndex].time * 1000);
        });
}

function stopRecording() {
    mediaRecorder.stop();
    clearInterval(timerInterval);
    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Proceed to next question
        currentQuestionIndex++;
        if (currentQuestionIndex < currentTopic.questions.length) {
            showNextQuestion();
        } else {
            showOptions(audioUrl); // Pass audioUrl to showOptions
        }
    };
}

function showNextQuestion() {
    const question = currentTopic.questions[currentQuestionIndex];
    document.getElementById('question').innerText = question.text;
    startTimer(question.time);
    setTimeout(stopRecording, question.time * 1000);
}

function startTimer(time) {
    const timerDisplay = document.getElementById('timer');
    timerDisplay.innerHTML = `<div class="rectangle"></div>`; // Use rectangle animation
    let countdown = time;
    
    timerInterval = setInterval(() => {
        if (countdown <= 0) {
            clearInterval(timerInterval);
        }
        countdown--;
    }, 1000);
}

function showOptions(audioUrl) {
    document.getElementById('questionContainer').innerHTML = `
        <h3>Recording complete! What would you like to do next?</h3>
        <audio controls src="${audioUrl}" style="display: block; margin: 20px auto;"></audio>
        <button class="button" onclick="restartTopic()">RESTART TOPIC</button>
        <button class="button" onclick="showLesson(currentLesson.title.toLowerCase())">SELECT ANOTHER TOPIC</button>
    `;
}

function restartTopic() {
    showTopic(currentTopic);
}

function init() {
    document.getElementById('lessonContainer').innerHTML = `
        <h2>Select a level:</h2>
        <div class="menu">
            <button class="button" onclick="showLesson('basic')">Conversación Básica</button>
            <button class="button" onclick="showLesson('intermediate')">Conversación Intermedia</button>
            <button class="button" onclick="showLesson('advanced')">Conversación Avanzada</button>
        </div>
    `;
}

init();
