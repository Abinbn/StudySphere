document.addEventListener('DOMContentLoaded', () => {
    // Global variables
    let is24Hour = true;
    let stopwatchRunning = false;
    let stopwatchInterval;
    let stopwatchStartTime = 0;
    let stopwatchElapsedTime = 0;
    let timerInterval;
    let pomodoroInterval;
    let countdownInterval;

    // Load saved data
    loadData();
    updateTime();
    setInterval(updateTime, 1000);

    // Stopwatch
    document.getElementById('startStopwatch')?.addEventListener('click', () => {
    if (stopwatchRunning) {
        clearInterval(stopwatchInterval);
        document.getElementById('startStopwatch').textContent = 'START';
    } else {
        stopwatchStartTime = Date.now() - stopwatchElapsedTime;
        stopwatchInterval = setInterval(() => {
            stopwatchElapsedTime = Date.now() - stopwatchStartTime;
            updateStopwatchDisplay(stopwatchElapsedTime);
        }, 10);
        document.getElementById('startStopwatch').textContent = 'STOP';
    }
    stopwatchRunning = !stopwatchRunning;
});

document.getElementById('resetStopwatch')?.addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchElapsedTime = 0;
    document.getElementById('stopwatchDisplay').textContent = '0.000s';
    document.getElementById('startStopwatch').textContent = 'START';
    stopwatchRunning = false;
});

// Function to update the stopwatch display
function updateStopwatchDisplay(elapsedTime) {
    let displayText = '';

    const milliseconds = elapsedTime % 1000;
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));

    if (days > 0) {
        displayText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
        displayText = `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0 || seconds >= 60) {
        displayText = `${minutes}m ${seconds}s`;
    } else {
        displayText = `${seconds}.${(milliseconds / 1000).toFixed(3).slice(2)}s`;
    }

    document.getElementById('stopwatchDisplay').textContent = displayText;
}

    // Timer
document.getElementById('startTimer')?.addEventListener('click', () => {
    const input = document.getElementById('timerInput').value;
    const timeParts = input.match(/(\d+)m\s*(\d+)s/);
    if (!timeParts) return;
    let totalSeconds = parseInt(timeParts[1]) * 60 + parseInt(timeParts[2]);

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            alert('Time is up!');
            document.getElementById('startTimer').textContent = 'START';
            return;
        }
        totalSeconds -= 1;
        updateTimerInput(totalSeconds);
    }, 1000);

    document.getElementById('startTimer').textContent = 'STOP';
});

document.getElementById('stopTimer')?.addEventListener('click', () => {
    clearInterval(timerInterval);
    document.getElementById('startTimer').textContent = 'START';
});

document.getElementById('resetTimer')?.addEventListener('click', () => {
    clearInterval(timerInterval);
    document.getElementById('timerInput').value = '5m 00s';
    document.getElementById('startTimer').textContent = 'START';
});

// Quick Timer Buttons
document.getElementById('quickTimer5')?.addEventListener('click', () => {
    setTimerInput(5, 0);
});

document.getElementById('quickTimer10')?.addEventListener('click', () => {
    setTimerInput(10, 0);
});

document.getElementById('quickTimer15')?.addEventListener('click', () => {
    setTimerInput(15, 0);
});

document.getElementById('quickTimer30')?.addEventListener('click', () => {
    setTimerInput(30, 0);
});

// Custom Timer Form
document.getElementById('toggleCustomTimerForm')?.addEventListener('click', () => {
    document.getElementById('customTimerForm').classList.toggle('hidden');
});

document.getElementById('setCustomTimer')?.addEventListener('click', () => {
    const customMinutes = parseInt(document.getElementById('customMinutes').value) || 0;
    const customSeconds = parseInt(document.getElementById('customSeconds').value) || 0;
    setTimerInput(customMinutes, customSeconds);
    document.getElementById('customMinutes').value = '';
    document.getElementById('customSeconds').value = '';
    document.getElementById('customTimerForm').classList.add('hidden');
});

// Function to set timer input
function setTimerInput(minutes, seconds) {
    const formattedTime = `${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    document.getElementById('timerInput').value = formattedTime;
}

// Function to update timer input during countdown
function updateTimerInput(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    document.getElementById('timerInput').value = formattedTime;
}


    
    
    
    
    // POMODORO
    let pomodoroTime = 25 * 60;
    let isPomodoroRunning = false;
    
    document.getElementById('startPomodoro')?.addEventListener('click', () => {
        clearInterval(pomodoroInterval); 
        startPomodoro();
    });
    document.getElementById('stopPomodoro')?.addEventListener('click', () => {
        clearInterval(pomodoroInterval);
        isPomodoroRunning = false;
        updatePomodoroStatus('');
        showWidgets(); 
    });
    document.getElementById('resetPomodoro')?.addEventListener('click', () => {
        clearInterval(pomodoroInterval);
        pomodoroTime = 25 * 60;
        document.getElementById('pomodoroDisplay').textContent = '25:00';
        isPomodoroRunning = false;
        updatePomodoroStatus('');
        showWidgets(); // Show other widgets when Pomodoro is reset
    });
    document.getElementById('focusBreakToggle')?.addEventListener('click', () => {
        toggleFocusBreak();
    });
    function startPomodoro() {
        isPomodoroRunning = true;
        hideWidgets(); // Hide other widgets when Pomodoro starts
        updatePomodoroStatus('FOCUS TIME');
        pomodoroInterval = setInterval(() => {
            if (pomodoroTime <= 0) {
                clearInterval(pomodoroInterval);
                alert('Pomodoro session completed!');
                pomodoroTime = 25 * 60; // Reset Pomodoro time to initial value
                document.getElementById('pomodoroDisplay').textContent = '25:00';
                updatePomodoroStatus('');
                showWidgets(); // Show other widgets when Pomodoro ends
                return;
            }
            pomodoroTime -= 1;
            document.getElementById('pomodoroDisplay').textContent = `${Math.floor(pomodoroTime / 60)}:${String(pomodoroTime % 60).padStart(2, '0')}`;
        }, 1000);
    }
    function toggleFocusBreak() {
        if (isPomodoroRunning) {
            clearInterval(pomodoroInterval);
            isPomodoroRunning = false;
            updatePomodoroStatus('BREAK TIME');
            showWidgets(); // Show other widgets when Pomodoro is on break
        } else {
            startPomodoro();
        }
    }
    function updatePomodoroStatus(status) {
        document.getElementById('pomodoroStatus').textContent = status;
    }
    function hideWidgets() {
        // Hide other widgets
        const widgets = document.querySelectorAll('.widget');
        widgets.forEach(widget => {
            if (!widget.classList.contains('pomodoro-container')) {
                widget.classList.add('hidden');
            }
        });
    }
    function showWidgets() {
        // Show other widgets
        const widgets = document.querySelectorAll('.widget');
        widgets.forEach(widget => {
            widget.classList.remove('hidden');
        });
    }





     // Countdown Timer
    document.getElementById('startCountdown')?.addEventListener('click', () => {
        const countdownInput = document.getElementById('countdownInput').value;
        const countdownParts = countdownInput.match(/(\d+)h\s*(\d+)m\s*(\d+)s/);
        if (!countdownParts) return;
        let countdownSeconds = parseInt(countdownParts[1]) * 3600 + parseInt(countdownParts[2]) * 60 + parseInt(countdownParts[3]);

        clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            if (countdownSeconds <= 0) {
                clearInterval(countdownInterval);
                alert('Countdown finished!');
                return;
            }
            countdownSeconds -= 1;
            const hours = Math.floor(countdownSeconds / 3600);
            const minutes = Math.floor((countdownSeconds % 3600) / 60);
            const seconds = countdownSeconds % 60;
            document.getElementById('countdownDisplay').textContent = `${hours}h ${minutes}m ${seconds}s`;
        }, 1000);
    });

    document.getElementById('stopCountdown')?.addEventListener('click', () => {
        clearInterval(countdownInterval);
    });

    document.getElementById('resetCountdown')?.addEventListener('click', () => {
        clearInterval(countdownInterval);
        document.getElementById('countdownDisplay').textContent = '0h 0m 0s';
        document.getElementById('countdownInput').value = '0h 0m 0s';
    });

    // Weather
    document.getElementById('getWeather')?.addEventListener('click', () => {
        const location = document.getElementById('weatherLocation').value || 'auto:ip';
        getWeather(location);
    });

    async function getWeather(location) {
        try {
            const apiKey = 'your_openweathermap_api_key'; // Replace with your OpenWeatherMap API key
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.cod === 200) {
                const temperature = `${data.main.temp}°C`;
                const condition = data.weather[0].description;
                document.getElementById('weatherInfo').textContent = `${temperature}, ${condition}`;
            } else {
                document.getElementById('weatherInfo').textContent = 'Location not found';
            }
        } catch (error) {
            document.getElementById('weatherInfo').textContent = 'Error fetching weather';
        }
    }

    // 12/24 Hour Toggle
document.getElementById('toggleTimeFormat')?.addEventListener('click', () => {
    is24Hour = !is24Hour;
    updateTime();
    
    // Update button text based on time format
    const button = document.getElementById('toggleTimeFormat');
    if (is24Hour) {
        button.textContent = '12 HR';
    } else {
        button.textContent = '24 HR';
    }
});



    // Function to update the time
    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        if (!is24Hour) {
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            document.getElementById('currentTime').textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
        } else {
            document.getElementById('currentTime').textContent = `${hours}:${minutes}:${seconds}`;
        }

        document.getElementById('currentDate').textContent = now.toDateString();
    }

    // Alarms
    document.getElementById('addAlarm')?.addEventListener('click', () => {
        const time = document.getElementById('newAlarmTime').value;
        if (!time) return;

        const alarm = { time, id: Date.now() };
        addAlarmToDOM(alarm);
        saveToLocalStorage('alarms', alarm);
    });

    setInterval(() => {
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5);
        const alarms = JSON.parse(localStorage.getItem('alarms')) || [];
        alarms.forEach(alarm => {
            if (alarm.time === currentTime) {
                alert('Alarm ringing!');
                removeAlarm(alarm.id);
            }
        });
    }, 60000);

    // To-Do List: Adding a Task
document.getElementById('addTask')?.addEventListener('click', () => {
    const taskText = document.getElementById('newTask').value.trim(); // Trim to remove extra whitespace
    if (!taskText) return;

    const task = { text: taskText, completed: false, id: Date.now() };
    addTaskToDOM(task);
    saveToLocalStorage('tasks', task);
    document.getElementById('newTask').value = ''; // Clear input field after adding task
});


    // Calendar
    buildCalendar();

    // Reminders
document.getElementById('toggleReminderForm')?.addEventListener('click', () => {
    document.getElementById('reminderForm').classList.toggle('hidden');
});

document.getElementById('addReminder')?.addEventListener('click', () => {
    const title = document.getElementById('reminderTitle').value;
    const date = document.getElementById('reminderDate').value;
    const time = document.getElementById('reminderTime').value;
    if (!title || !date || !time) return;

    const reminderDateTime = new Date(`${date}T${time}`);
    const currentTime = new Date();
    const timeDiffInSeconds = (reminderDateTime - currentTime) / 1000;

    if (timeDiffInSeconds <= 0) {
        alert('Reminder date and time should be in the future!');
        return;
    }

    clearInterval(countdownInterval); // Clear any existing countdown
    countdownInterval = setInterval(() => {
        if (timeDiffInSeconds <= 0) {
            clearInterval(countdownInterval);
            alert('Countdown finished!');
            return;
        }
        timeDiffInSeconds -= 1;
        const hours = Math.floor(timeDiffInSeconds / 3600);
        const minutes = Math.floor((timeDiffInSeconds % 3600) / 60);
        const seconds = Math.floor(timeDiffInSeconds % 60);
        document.getElementById('countdownDisplay').textContent = `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);

    const reminder = { title, date, time, id: Date.now() };
    addReminderToDOM(reminder);
    saveToLocalStorage('reminders', reminder);
    document.getElementById('reminderForm').classList.add('hidden');
});

    // Notes
    document.getElementById('toggleNoteForm')?.addEventListener('click', () => {
        document.getElementById('noteForm').classList.toggle('hidden');
    });

    document.getElementById('saveNote')?.addEventListener('click', () => {
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;
        if (!title || !content) return;

        const note = { title, content, id: Date.now() };
        addNoteToDOM(note);
        saveToLocalStorage('notes', note);
        document.getElementById('noteForm').classList.add('hidden');
    });

    // Helper functions
    function addAlarmToDOM(alarm) {
        const div = document.createElement('div');
        div.classList.add('alarm-item');
        div.innerHTML = `
            <span>${alarm.time}</span>
            <button class="deleteAlarm" data-id="${alarm.id}">Delete</button>
        `;
        document.getElementById('alarms')?.appendChild(div);
        div.querySelector('.deleteAlarm')?.addEventListener('click', () => {
            removeAlarm(alarm.id);
        });
    }

    // To-Do List: Updating DOM with Tasks
function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.completed) li.classList.add('completed');
    
    li.addEventListener('click', () => {
        task.completed = !task.completed;
        li.classList.toggle('completed');
        saveToLocalStorage('tasks', task); // Save updated task status
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('deleteTask');
    
    deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent li click event from firing
        li.remove();
        removeFromLocalStorage('tasks', task.id);
    });
    
    li.appendChild(deleteBtn);
    document.getElementById('tasks')?.appendChild(li);
}


    // Function to add reminder to DOM (assuming this function exists)
function addReminderToDOM(reminder) {
    const div = document.createElement('div');
    div.classList.add('reminder-item');
    div.innerHTML = `
        <strong>${reminder.title}</strong>
        <span>${reminder.date} ${reminder.time}</span>
        <button class="deleteReminder" data-id="${reminder.id}">Delete</button>
    `;
    document.getElementById('reminders').appendChild(div);
    div.querySelector('.deleteReminder').addEventListener('click', () => {
        removeReminder(reminder.id);
    });
}

    function addNoteToDOM(note) {
        const div = document.createElement('div');
        div.classList.add('note-item');
        div.innerHTML = `
            <strong>${note.title}</strong>
            <p>${note.content}</p>
            <button class="deleteNote" data-id="${note.id}">Delete</button>
        `;
        document.getElementById('notes')?.appendChild(div);
        div.querySelector('.deleteNote')?.addEventListener('click', () => {
            removeNote(note.id);
        });
    }

    function saveToLocalStorage(key, item) {
        let items = JSON.parse(localStorage.getItem(key)) || [];
        items = items.filter(i => i.id !== item.id);
        items.push(item);
        localStorage.setItem(key, JSON.stringify(items));
    }

    // Helper function to remove item from local storage (assuming this function exists)
function removeFromLocalStorage(key, id) {
    let items = JSON.parse(localStorage.getItem(key)) || [];
    items = items.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(items));
}

    function removeAlarm(id) {
        document.querySelector(`.deleteAlarm[data-id="${id}"]`)?.parentElement.remove();
        removeFromLocalStorage('alarms', id);
    }

    // Function to remove reminder (assuming this function exists)
function removeReminder(id) {
    document.querySelector(`.deleteReminder[data-id="${id}"]`)?.parentElement.remove();
    removeFromLocalStorage('reminders', id);
}

    function removeNote(id) {
        document.querySelector(`.deleteNote[data-id="${id}"]`)?.parentElement.remove();
        removeFromLocalStorage('notes', id);
    }

    function loadData() {
        if (document.getElementById('alarms')) {
            const alarms = JSON.parse(localStorage.getItem('alarms')) || [];
            alarms.forEach(alarm => addAlarmToDOM(alarm));
        }

        if (document.getElementById('tasks')) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTaskToDOM(task);
        });
    }

        if (document.getElementById('reminders')) {
            const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
            reminders.forEach(reminder => addReminderToDOM(reminder));
        }

        if (document.getElementById('notes')) {
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            notes.forEach(note => addNoteToDOM(note));
        }
    }

    function buildCalendar() {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const calendarBody = document.querySelector('#calendar tbody');

        if (!calendarBody) return;

        calendarBody.innerHTML = '';
        let currentRow = document.createElement('tr');

        // Fill the first row with blank cells until the first day of the month
        for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
            currentRow.appendChild(document.createElement('td'));
        }

        // Fill in the days of the month
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const cell = document.createElement('td');
            cell.textContent = day;
            if (day === now.getDate()) cell.classList.add('current-day');
            currentRow.appendChild(cell);

            // Start a new row at the end of the week
            if ((firstDayOfMonth.getDay() + day) % 7 === 0 || day === lastDayOfMonth.getDate()) {
                calendarBody.appendChild(currentRow);
                currentRow = document.createElement('tr');
            }
        }
    }
});
