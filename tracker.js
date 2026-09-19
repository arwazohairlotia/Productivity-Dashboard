const dateElement = document.getElementById("date");
const greetingElement = document.getElementById("greeting");

const taskInput = document.getElementById("taskInput");
const addTaskbutton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

const timerElement = document.getElementById("timer");

const today = new Date();
dateElement.textContent = today.toDateString();

const hour = today.getHours();
if (hour < 12) {
    greetingElement.textContent = "Good Morning!";
}
else if (hour < 18) {
    greetingElement.textContent = "Good Afternoon!";
}
else {
    greetingElement.textContent = "Good Night!";
}

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function displayTask(taskText) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = taskText;

    const deletebutton = document.createElement("button");
    deletebutton.textContent = "Delete";

    span.addEventListener("click", function () {
        span.classList.toggle("completed");
    });

    deletebutton.addEventListener("click", function () {
        li.remove();

        tasks = tasks.filter(function (task) {
            return task !== taskText;
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
    });

    li.appendChild(span);
    li.appendChild(deletebutton);

    taskList.appendChild(li);
}

tasks.forEach(function (task) {
    displayTask(task);
});

addTaskbutton.addEventListener("click", addtask);

function addtask() {
    console.log("addTask was called");

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    tasks.push(taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTask(taskText);

    taskInput.value = "";
}
//TIMER
//Initialize variables
const startTimerbutton = document.getElementById("startTimerbutton");
const pauseTimerbutton = document.getElementById("pauseTimerbutton");
const resetTimerbutton = document.getElementById("resetTimerbutton");
const customMinutes = document.getElementById("customtime");
const setTimerbutton = document.getElementById("settimerbutton");
let timeleft = 30 * 60;
let timerinterval = null;
function updatetimer() {
    const minutes = Math.floor(timeleft / 60);
    const seconds = timeleft % 60;
    const formattedseconds = seconds < 10 ? "0" + seconds : seconds;
    timerElement.textContent = minutes + ":" + formattedseconds;
}
//START TIMER
function startTimer() {
    if (timerinterval !== null) {
        return;
    }
    timerinterval = setInterval(function () {
        if (timeleft > 0) {
            timeleft--;
            updatetimer();
        }
        else {
            clearInterval(timerinterval);
            timerinterval = null;
            alert("Time complete!");
        }
    }, 1000);
}
//PAUSE TIMER
function pauseTimer() {
    clearInterval(timerinterval);
    timerinterval = null;
}
//RESET TIMER
function resetTimer() {
    clearInterval(timerinterval);
    timerinterval = null;
    timeleft = 30 * 60;
    updatetimer();
}
setTimerbutton.addEventListener("click", function () {
    const minutes = Number(customMinutes.value);
    if (minutes <= 0 || customMinutes.value === "") {
        alert("Please enter a valid number of minutes");
        return;
    }
    clearInterval(timerinterval);
    timerinterval = null;

    timeleft = minutes * 60;
    updatetimer();

    customMinutes.value = "";
});
startTimerbutton.addEventListener("click", startTimer);
pauseTimerbutton.addEventListener("click", pauseTimer);
resetTimerbutton.addEventListener("click", resetTimer);
updatetimer();
//MOOD
const moodButtons = document.querySelectorAll(".mood")
const moodMessage = document.getElementById("moodMessage");
let savedmood = localStorage.getItem("mood") || "";
moodButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const mood = button.textContent;
        if (mood === "😊") {
            moodMessage.textContent = "Yay! Keep that energy going! 🌷";
        }
        else if (mood === "😐") {
            moodMessage.textContent = "It's okay to have an average day. 💗";

        }
        else if (mood === "😴") {
            moodMessage.textContent = "Maybe you need a little rest. 💤";

        }
        else if (mood === "😭") {
            moodMessage.textContent = "Take a breath. Tomorrow is another day. 🌸";

        }
        else if (mood === "😤") {
            moodMessage.textContent = "Okay. Deep breath. You've got this. 💪";

        }
        localStorage.setItem("mood", mood);
    });
});
if (savedmood !== "") {
    moodMessage.textContent = "Your saved mood:" + savedmood;
}

updatetimer();
// STUDY PROGRESS: SUBJECTS AND CHAPTERS
//  HTML ELEMENTS 
const subjectname = document.getElementById("subjectname");
const progressbutton = document.getElementById("progressbutton");
const subjectlist = document.getElementById("subjectlist");
//  LOAD SAVED SUBJECTS 
let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
//  CREATE A CHAPTER 
function createChapter(chapdata, subjectdata, Chaplist) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = chapdata.completed;
    const chapter = document.createElement("div");
    const chaplabel = document.createElement("span");
    chaplabel.textContent = chapdata.name;
    const deleteChapterbutton = document.createElement("button");
    deleteChapterbutton.textContent = "Delete";
    // Restore completed appearance
    if (chapdata.completed) {
        chaplabel.classList.add("completed");
    }
    // Add chapter elements
    chapter.appendChild(checkbox);
    chapter.appendChild(chaplabel);
    chapter.appendChild(deleteChapterbutton);
    // Display chapter
    Chaplist.appendChild(chapter);
    //  MARK CHAPTER AS COMPLETED 
    checkbox.addEventListener("change", function () {

        chapdata.completed = checkbox.checked;

        chaplabel.classList.toggle("completed", checkbox.checked);

        localStorage.setItem("subjects", JSON.stringify(subjects));
    });
    //  DELETE CHAPTER 
    deleteChapterbutton.addEventListener("click", function () {
        // Remove chapter from the page
        chapter.remove();
        // Remove chapter from its subject's array
        subjectdata.chapters = subjectdata.chapters.filter(function (item) {
            return item !== chapdata;
        });
        // Save updated subjects
        localStorage.setItem("subjects", JSON.stringify(subjects));
    });
}
//  DISPLAY A SUBJECT 
function displaySubject(subjectdata) {
    // Make sure chapters exists
    subjectdata.chapters = subjectdata.chapters || [];
    // Main subject container
    const subject = document.createElement("div");
    subject.className = "study-subject";
    // Subject title
    const subjecttitle = document.createElement("strong");
    subjecttitle.className = "subject-title";
    subjecttitle.textContent = subjectdata.name;
    // Delete subject button
    const deleteSubjectbutton = document.createElement("button");
    deleteSubjectbutton.className = "delete-subject";
    deleteSubjectbutton.textContent = "Delete Subject";
    // Chapter input
    const chapname = document.createElement("input");
    chapname.className = "chapter-input";
    chapname.type = "text";
    chapname.placeholder = "Assignments or chapters";
    // Add chapter button
    const Chapbutton = document.createElement("button");
    Chapbutton.className = "add-chapter";
    Chapbutton.textContent = "Add";
    // Chapter list
    const Chaplist = document.createElement("div");
    Chaplist.className = "chapter-list";
    //  ADD ELEMENTS TO SUBJECT CONTAINER 
    subject.appendChild(subjecttitle);
    subject.appendChild(deleteSubjectbutton);
    subject.appendChild(chapname);
    subject.appendChild(Chapbutton);
    subject.appendChild(Chaplist);
    //  DELETE SUBJECT 
    deleteSubjectbutton.addEventListener("click", function () {
        // Remove subject from page
        subject.remove();
        // Remove subject from subjects array
        subjects = subjects.filter(function (item) {
            return item !== subjectdata;
        });
        // Save updated subjects
        localStorage.setItem("subjects", JSON.stringify(subjects));
    });
    //  ADD A NEW CHAPTER 
    Chapbutton.addEventListener("click", function () {
        const chaptext = chapname.value.trim();
        if (chaptext === "") {
            return;
        }
        const chapdata = {
            name: chaptext,
            completed: false
        };
        // Add chapter to this subject
        subjectdata.chapters.push(chapdata);
        // Save updated subjects
        localStorage.setItem("subjects", JSON.stringify(subjects));
        // Display the new chapter
        createChapter(chapdata, subjectdata, Chaplist);
        // Clear input
        chapname.value = "";
    });
    //  DISPLAY SAVED CHAPTERS 
    subjectdata.chapters.forEach(function (chapdata) {
        createChapter(chapdata, subjectdata, Chaplist);
    });
    //  DISPLAY COMPLETE SUBJECT 
    subjectlist.appendChild(subject);
}
//  LOAD SUBJECTS WHEN PAGE OPENS 
subjects.forEach(function (subjectdata) {
    displaySubject(subjectdata);
});
//  ADD A NEW SUBJECT 
progressbutton.addEventListener("click", function () {
    const subjecttext = subjectname.value.trim();
    if (subjecttext === "") {
        return;
    }
    const subjectdata = {
        name: subjecttext,
        chapters: []
    };
    // Add subject to array
    subjects.push(subjectdata);
    // Save subjects
    localStorage.setItem("subjects", JSON.stringify(subjects));
    // Display subject
    displaySubject(subjectdata);
    // Clear input
    subjectname.value = "";
});
