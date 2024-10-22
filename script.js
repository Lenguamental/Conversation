// Global Variables
let currentLesson = null;
let currentTopic = null;
let currentQuestionIndex = 0;
let recordingChunks = [];
let mediaRecorder = null;
let audioBlob = null;

// Questions for each level and topic
const questions = {
    Basic: {
        "Introductions": [
            "What is your name?",
            "How old are you?",
            "Where are you from?",
            "What do you do?",
            "What are your hobbies?",
            "What is your favorite food?",
            "Do you have any pets?",
            "What is your favorite movie?"
        ],
        "Daily Routines": [
            "What time do you wake up?",
            "What do you eat for breakfast?",
            "How do you get to work/school?",
            "What do you do in your free time?",
            "What time do you go to bed?",
            "What is your favorite day of the week?",
            "What do you do on weekends?",
            "What is your favorite season?"
        ],
        // Add more topics here
    },
    Intermediate: {
        "Travel": [
            "Have you ever traveled abroad?",
            "What is your favorite travel destination?",
            "What do you like to do while traveling?",
            "How do you usually travel?",
            "What was your most memorable trip?",
            "Do you prefer beach or mountain vacations?",
            "What is your dream travel destination?",
            "What travel tips would you give to someone?"
        ],
        "Food": [
            "What is your favorite type of cuisine?",
            "Can you cook? What do you like to make?",
            "What is a traditional dish from your country?",
            "Do you prefer sweet or savory foods?",
            "What food do you dislike?",
            "What is the best meal you've ever had?",
            "What is your favorite dessert?",
            "Do you like trying new foods?"
        ],
        // Add more topics here
    },
    Advanced: {
        "Technology": [
            "How has technology changed your life?",
            "What is your favorite gadget?",
            "Do you think technology makes life easier?",
            "What are the downsides of technology?",
            "How do you keep up with new technology?",
            "What is the next big thing in tech?",
            "How do you feel about social media?",
            "What is your opinion on virtual reality?"
        ],
        "Environment": [
            "What do you think about climate change?",
            "What can we do to help the environment?",
            "How important is recycling to you?",
            "What is your favorite nature spot?",
            "Do you think we can save the planet?",
            "What is your opinion on renewable energy?",
            "How does pollution affect us?",
            "What is your favorite outdoor activity?"
        ],
        // Add more topics here
    }
};

// Event Listener for Level Selection
function showLessonOptions(level) {
    currentLesson = level;
    currentQuestionIndex = 0; // Reset the question index
    const topics = Object.keys(questions[level]);
    let lessonContainer = document.getElementById('lessonContainer');
    lessonContainer.innerHTML = ''; // Clear previous options

    topics.forEach(topic => {
        const button = document.createElement('button');
        button.className = 'button';
        button.innerText = topic;
        button.onclick = () => startRecording(topic);
        lessonContainer.appendChild(button);
    });
}

// Function to Start Recording
function startRecording(topic) {
    currentTopic = topic;
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = `<div id="question">Haga clic en "START" para comenzar</div>`;
    
    const startButton = document.createElement('button');
    startButton.className = 'button';
    startButton.innerText = 'START';
    startButton.onclick = () => {
        startButton.style.display = 'none'; // Hide start button
        startQuestion();
    };
    questionContainer.appendChild(startButton);
}

// Function to Start Question Flow
function startQuestion() {
    const timer = document.createElement('div');
    timer.className = 'timer';
    const timerBar = document.createElement('div');
    timerBar.className = 'timer-bar';
    timer.appendChild(timerBar);
    document.getElementById('questionContainer').appendChild(timer);
    
    askQuestion();
}

// Function to Ask Questions
function askQuestion() {
    if (currentQuestionIndex < questions[currentLesson][currentTopic].length) {
        const question = questions[currentLesson][currentTopic][currentQuestionIndex];
        const questionContainer = document.getElementById('question');
        questionContainer.innerText = question;

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = e => {
                    recordingChunks.push(e.data);
                };
                mediaRecorder.onstop = () => {
                    audioBlob = new Blob(recordingChunks, { type: 'audio/webm' });
                    recordingChunks = []; // Reset for next recording
                };

                const recordButton = document.createElement('button');
                recordButton.className = 'button';
                recordButton.innerText = 'Empezar a grabar';
                recordButton.onclick = () => {
                    recordButton.style.display = 'none'; // Hide record button
                    mediaRecorder.start();
                    startTimer(5); // Set time limit for each question
                };
                document.getElementById('questionContainer').appendChild(recordButton);
            });
    } else {
        finishRecording(); // If no more questions, finish recording
    }
}

// Timer Function
function startTimer(duration) {
    const timerBar = document.querySelector('.timer-bar');
    let timeLeft = duration;
    timerBar.style.animationDuration = `${duration}s`; // Set animation duration

    const interval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(interval);
            mediaRecorder.stop();
            currentQuestionIndex++;
            setTimeout(askQuestion, 1000); // Delay before next question
        }
    }, 1000);
}

// Finish Recording
function finishRecording() {
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = `<h2>Grabación completa</h2>`;

    const playButton = document.createElement('button');
    playButton.className = 'button';
    playButton.innerText = 'Escuchar la Grabación';
    playButton.onclick = () => {
        const audioURL = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioURL);
        audio.play();
    };
    questionContainer.appendChild(playButton);

    const downloadButton = document.createElement('button');
    downloadButton.className = 'button';
    downloadButton.innerText = 'Descargar Grabación';
    downloadButton.onclick = () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(audioBlob);
        a.download = 'recording.webm';
        a.click();
    };
    questionContainer.appendChild(downloadButton);

    const restartButton = document.createElement('button');
    restartButton.className = 'button';
    restartButton.innerText = 'Empezar de Nuevo';
    restartButton.onclick = () => {
        currentQuestionIndex = 0; // Reset question index
        questionContainer.innerHTML = ''; // Clear previous content
        startRecording(currentTopic); // Restart recording for the same topic
    };
    questionContainer.appendChild(restartButton);
}

// Initialize the App
function init() {
    const basicButton = document.createElement('button');
    basicButton.className = 'button';
    basicButton.innerText = 'Conversación Básica';
    basicButton.onclick = () => showLessonOptions('Basic');

    const intermediateButton = document.createElement('button');
    intermediateButton.className = 'button';
    intermediateButton.innerText = 'Conversación Intermedia';
    intermediateButton.onclick = () => showLessonOptions('Intermediate');

    const advancedButton = document.createElement('button');
    advancedButton.className = 'button';
    advancedButton.innerText = 'Conversación Avanzada';
    advancedButton.onclick = () => showLessonOptions('Advanced');

    const app = document.getElementById('app');
    app.appendChild(basicButton);
    app.appendChild(intermediateButton);
    app.appendChild(advancedButton);
}

// Run the app on page load
window.onload = init;
