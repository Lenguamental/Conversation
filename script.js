// Global Variables
let currentLesson = null;
let currentTopic = null;
let currentQuestionIndex = 0;
let recordingChunks = [];  // Stores chunks for all questions
let mediaRecorder = null;
let combinedBlob = null;  // Blob for the final combined recording
let timerInterval = null;

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
        ]
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
        ]
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
        ]
    }
};

// Event Listener for Level Selection
function showLessonOptions(level) {
    currentLesson = level;
    currentQuestionIndex = 0; // Reset the question index
    const topics = Object.keys(questions[level]);
    const lessonContainer = document.getElementById('lessonContainer');
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
        askQuestion(); // Start asking questions
    };
    questionContainer.appendChild(startButton);
}

// Function to Show Timer and Ensure Only One Timer is Visible
function showTimer(duration) {
    const previousTimer = document.querySelector('.timer');
    if (previousTimer) previousTimer.remove(); // Remove the previous timer

    const timer = document.createElement('div');
    timer.className = 'timer';
    const timerBar = document.createElement('div');
    timerBar.className = 'timer-bar';
    timer.appendChild(timerBar);
    document.getElementById('questionContainer').appendChild(timer);

    timerBar.style.animationDuration = `${duration}s`; // Set animation duration

    let timeLeft = duration;
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            mediaRecorder.stop();
            currentQuestionIndex++;
            setTimeout(askQuestion, 1000); // Delay before next question
        }
    }, 1000);
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
                    recordingChunks.push(e.data); // Add data to the global array
                };

                mediaRecorder.onstop = () => {
                    // Nothing special here for now, but recording stops after the timer ends.
                };

                const recordButton = document.createElement('button');
                recordButton.className = 'button';
                recordButton.innerText = 'Empezar a grabar';
                recordButton.onclick = () => {
                    recordButton.style.display = 'none'; // Hide record button
                    mediaRecorder.start();
                    showTimer(5); // Set time limit for each question
                };
                document.getElementById('questionContainer').appendChild(recordButton);
            });
    } else {
        finishRecording(); // If no more questions, finish recording
    }
}

// Function to Combine All Recordings into One Blob
function finishRecording() {
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = `<h2>Grabación completa</h2>`;

    // Combine all chunks into one blob
    combinedBlob = new Blob(recordingChunks, { type: 'audio/webm' });

    const playButton = document.createElement('button');
    playButton.className = 'button';
    playButton.innerText = 'Escuchar la Grabación';
    playButton.onclick = () => {
        const audioURL = URL.createObjectURL(combinedBlob);
        const audio = new Audio(audioURL);
        audio.play();
    };
    questionContainer.appendChild(playButton);

    const downloadButton = document.createElement('button');
    downloadButton.className = 'button';
    downloadButton.innerText = 'Descargar Grabación';
    downloadButton.onclick = () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(combinedBlob);
        a.download = 'recording.webm';
        a.click();
    };
    questionContainer.appendChild(downloadButton);
}

// Start Application
document.addEventListener('DOMContentLoaded', () => {
    const levelButtonsContainer = document.createElement('div');
    Object.keys(questions).forEach(level => {
        const button = document.createElement('button');
        button.className = 'button';
        button.innerText = level;
        button.onclick = () => {
            levelButtonsContainer.innerHTML = ''; // Hide level buttons
            showLessonOptions(level);
        };
        levelButtonsContainer.appendChild(button);
    });
    document.getElementById('lessonContainer').appendChild(levelButtonsContainer);
});
