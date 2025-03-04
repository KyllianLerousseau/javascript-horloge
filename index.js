const clock = document.getElementById('clock');
const mainMenu = document.getElementById('mainMenu');
const clockContainer = document.getElementById('horloge-container');

const chronoButton = document.getElementById('chrono');  
const chronoMenu = document.getElementById('chronoMenu');
const backChrono = document.getElementById('backChrono');  

const minuteurMenu = document.getElementById('minuteurMenu');
const minuteurButton = document.getElementById('minuteur');
const backMinuteur = document.getElementById('backMinuteur');

const countdownMenu = document.getElementById('countdownMenu');
const countdownButton = document.getElementById('countdown');
const backCountdown = document.getElementById('backCountdown');

let clockInterval;
let elapsedTime = 0;
let selectedTime = 0;

clockInterval = setInterval(updateClock, 1000);

chronoButton.addEventListener('click', () => {
    stopClock();
    mainMenu.style.display = 'none';
    chronoMenu.style.display = 'flex';
});

minuteurButton.addEventListener('click', () => {
    stopClock();
    mainMenu.style.display = 'none';
    minuteurMenu.style.display = 'flex';
    backMinuteur.style.display = 'block';
});

countdownButton.addEventListener('click', () => {
    stopClock();
    mainMenu.style.display = 'none';
    clockContainer.style.display = 'none';
    countdownMenu.style.display = 'flex';
});

backChrono.addEventListener('click', () => {
    stopChrono();                        
    resetChrono();
    startClock();            
    chronoMenu.style.display = 'none';  
    mainMenu.style.display = 'block';
});

backMinuteur.addEventListener('click', () => {
    stopMinuteur();
    resetMinuteur();
    startClock(); 
    minuteurMenu.style.display = 'none';
    mainMenu.style.display = 'block';
    backMinuteur.style.display = 'none'; 
});

backCountdown.addEventListener('click', () => {
    startClock();
    countdownMenu.style.display = 'none';
    mainMenu.style.display = 'block';
    clockContainer.style.display = 'flex';
});

function updateClock() {
    const date = new Date();
    clock.innerHTML = date.toLocaleTimeString();
}

function startClock() {
    clockInterval = setInterval(updateClock, 1000);
}

function stopClock() {
    clearInterval(clockInterval);
}

document.getElementById('startChrono').addEventListener('click', startChrono);
document.getElementById('stopChrono').addEventListener('click', stopChrono);
document.getElementById('resetChrono').addEventListener('click', resetChrono);

function startChrono() {
    clock.innerHTML = "00:00.00";
    if(clockInterval) {
        clearInterval(clockInterval);
    }  clockInterval = setInterval(() => {
        elapsedTime++;
        clock.innerHTML = formatTime(elapsedTime);
    }, 10);
}

function stopChrono() {
    clearInterval(clockInterval);
    clockInterval = null;
}

function resetChrono() {
    stopChrono();
    elapsedTime = 0;
    clock.innerHTML = "00:00.00";
};

function formatTime(totalMilliseconds) {
    const minutes = Math.floor(totalMilliseconds / 60000);                  
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000);          
    const milliseconds = Math.floor((totalMilliseconds % 1000) / 10);         

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
}

document.getElementById('addSeconds').addEventListener('click', addSeconds);
document.getElementById('addMinutes').addEventListener('click', addMinutes);
document.getElementById('addHours').addEventListener('click', addHours);

document.getElementById('startMinuteur').addEventListener('click', startMinuteur);
document.getElementById('stopMinuteur').addEventListener('click', stopMinuteur);
document.getElementById('resetMinuteur').addEventListener('click', resetMinuteur);

function addSeconds() {
    selectedTime++;
    clock.innerHTML = formatMinuteur(selectedTime);
}

function addMinutes() {
    selectedTime+=60;
    clock.innerHTML = formatMinuteur(selectedTime);
}

function addHours() {
    selectedTime+=3600;
    clock.innerHTML = formatMinuteur(selectedTime);
}

function startMinuteur() {
    if(clockInterval) {
        clearInterval(clockInterval);
    } clockInterval = setInterval(() => {
        selectedTime--;
        clock.innerHTML = formatMinuteur(selectedTime);
        if(selectedTime === 0) {
            alert('Minuterie fini..');
            stopMinuteur();
        }
    }, 1000);
}

function stopMinuteur() {
    clearInterval(clockInterval);
    clockInterval = null;
};

function resetMinuteur() {
    stopMinuteur();
    selectedTime = 0;
    clock.innerHTML = "00:00:00";
};

function formatMinuteur(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

document.getElementById('startCountdown').addEventListener('click', startCountdown);
document.getElementById('stopCountdown').addEventListener('click', stopCountdown);
document.getElementById('resetCountdown').addEventListener('click', resetCountdown);

let countdownInterval;

function startCountdown() {
    const input = document.getElementById('dateInput').value;
    const countdownDate = new Date(input).getTime();
    const now = new Date().getTime();

    if (!input) {
        alert('Veuillez entrer une date valide.');
        return;
    }

    if (countdownDate <= now) {
        alert('La date doit être dans le futur !');
        return;
    }

    localStorage.setItem('countdownDate', countdownDate);
    runCountdown(countdownDate);
}

function runCountdown(countdownDate) {
    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown-container').innerHTML = '⏰<br>Temps écoulé !';
            document.getElementById('progressCircle').style.strokeDashoffset = 0;
            localStorage.removeItem('countdownDate');
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('countdown-container').innerHTML = `${days}j ${hours}h ${minutes}m ${seconds}s`;

        const progressCircle = document.getElementById('progressCircle');
        const totalLength = 2 * Math.PI * 90;
        const totalDuration = countdownDate - new Date(parseInt(localStorage.getItem('countdownDate'))).getTime();
        const progress = ((totalDuration - distance) / totalDuration) * totalLength;
        progressCircle.style.strokeDashoffset = totalLength - progress;
    }, 1000);
}

function stopCountdown() {
    clearInterval(countdownInterval);
    localStorage.removeItem('countdownDate');
}

function resetCountdown() {
    clearInterval(countdownInterval);
    document.getElementById('countdown-container').innerHTML = '';
    document.getElementById('dateInput').value = '';
    document.getElementById('progressCircle').style.strokeDashoffset = '565.48';
    localStorage.removeItem('countdownDate');
}

window.onload = function() {
    const savedCountdownDate = localStorage.getItem('countdownDate');
    if (savedCountdownDate) {
        runCountdown(parseInt(savedCountdownDate));
    }
};


function stopCountdown() {
    clearInterval(countdownInterval);
    localStorage.removeItem('countdownDate');
}

function resetCountdown() {
    clearInterval(countdownInterval);
    document.getElementById('countdown-container').innerHTML = '';
    document.getElementById('dateInput').value = '';
    document.getElementById('progressCircle').style.strokeDashoffset = '565.48';
    localStorage.removeItem('countdownDate');
}

window.onload = function() {
    const savedCountdownDate = localStorage.getItem('countdownDate');
    if (savedCountdownDate) {
        runCountdown(parseInt(savedCountdownDate));
    }
};
