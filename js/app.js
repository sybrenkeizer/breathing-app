// TODO - ENHANCE: Animate color pointer
// TODO - ENHANCE: Add background music
// TODO - FIX: Fading out trouble with circle button

const settingsToggleBtn = document.getElementById('settings-toggle-btn');
const moveToggleBtn = document.getElementById('move-toggle-btn');
const settingsContainer = document.getElementById('settings');
const pageBackground = document.getElementById('page-background');
const circleToggleBtn = document.getElementById('circle-btn');
const indicatorText = document.getElementById('indicator-text');
const countdownNumber = document.getElementById('countdown-number');
const pointerContainer = document.getElementById('pointer-container');

const COUNTDOWN_VALUE = 5;
const INHALATION = 3;
const HOLD = 2;
const EXHALATION = 3;
let startNumber;
let isBreathing = false;

// Assisting functions
const showBreatherPointer = () => pointerContainer.classList.add('show');
const hideBreatherPointer = () => pointerContainer.classList.remove('show');
const showBreatherIndicatorText = () => indicatorText.classList.add('show');
const hideBreatherIndicatorText = () => indicatorText.classList.remove('show');
const showBreatherPlayIcon = () => {
  circleToggleBtn.firstElementChild.className = 'fa-solid fa-play play';
};
const showBreatherPauseIcon = () => {
  circleToggleBtn.firstElementChild.className = 'fa-solid fa-pause pause';
};
const showBreatherCountdown = () => countdownNumber.classList.add('show');
const hideBreatherCountdown = () => countdownNumber.classList.remove('show');
const addFadeBreatherCircleBtn = () => circleToggleBtn.classList.add('fade');
const removeFadeBreatherCircleBtn = () => circleToggleBtn.classList.remove('fade');
const changeFadeCircleBtnShort = () => {
  if (circleToggleBtn.classList.contains('fade')) {
    circleToggleBtn.style.transition = 'opacity 0.3s linear';
  };
};
const changeFadeCircleBtnLong = () => {
  if (circleToggleBtn.classList.contains('fade')) {
    circleToggleBtn.style.transition = `opacity ${COUNTDOWN_VALUE}s linear`
  };
};




// Footer function



// Settings functions
const toggleSettings = () => {
  if (settingsContainer.classList.contains('open')) {
    settingsToggleBtn.classList.remove('open');
    moveToggleBtn.classList.remove('move');
    settingsContainer.classList.remove('open');
    pageBackground.classList.remove('show');
  } else {
    settingsToggleBtn.classList.add('open');
    moveToggleBtn.classList.add('move');
    settingsContainer.classList.add('open');
    pageBackground.classList.add('show');
  };
};

// Breathe counting function
const inhalation = () => {
  if (!isBreathing) return;
  let timeInhalation = INHALATION;
  indicatorText.firstElementChild.textContent = timeInhalation;
  indicatorText.lastElementChild.textContent = 'Inhale';

  const interval = setInterval(() => {
    --timeInhalation;
    indicatorText.firstElementChild.textContent = timeInhalation;

    if (timeInhalation === 0) {
      clearInterval(interval);
      hold();
    };

  }, 1000);
};

const hold = () => {
  if (!isBreathing) return;
  let timeHold = HOLD;
  indicatorText.firstElementChild.textContent = timeHold;
  indicatorText.lastElementChild.textContent = 'Hold';

  const interval = setInterval(() => {
    timeHold--;
    indicatorText.firstElementChild.textContent = timeHold;

    if (timeHold === 0) {
      clearInterval(interval);
      exhalation();
    };

  }, 1000);
};

const exhalation = () => {
  if (!isBreathing) return;
  let timeExhalation = EXHALATION;
  indicatorText.firstElementChild.textContent = timeExhalation;
  indicatorText.lastElementChild.textContent = 'Exhale';

  const interval = setInterval(() => {
    timeExhalation--;
    indicatorText.firstElementChild.textContent = timeExhalation;

    if (timeExhalation === 0) {
      clearInterval(interval);
      inhalation();
    };

  }, 1000);

};


// Breathe interface control functions
const startBreathing = () => {
  isBreathing = true;
  showBreatherPauseIcon();
  showBreatherIndicatorText();
  showBreatherPointer();
  inhalation();
};

const stopBreathing = () => {
  isBreathing = false;
  showBreatherPlayIcon();
  hideBreatherIndicatorText();
  hideBreatherPointer();
  removeFadeBreatherCircleBtn();
};

const startCountdown = () => {
  startNumber = COUNTDOWN_VALUE;
  showBreatherCountdown();
  addFadeBreatherCircleBtn();
  changeFadeCircleBtnLong();


  
  countdownNumber.textContent = COUNTDOWN_VALUE

  const interval = setInterval(() => {
    countdownNumber.textContent = --startNumber;

    startNumber === 1 && hideBreatherCountdown();

    if (startNumber === 0) {
      clearInterval(interval);
      startBreathing();
    };
  
  }, 1000);
};

const startStopBreather = () => {
  circleToggleBtn.firstElementChild.classList.contains('pause')
    ? stopBreathing()
    : startCountdown();
};


// Event Listeners
settingsToggleBtn.addEventListener('click', toggleSettings);
circleToggleBtn.addEventListener('click', startStopBreather);
circleToggleBtn.addEventListener('mouseover', changeFadeCircleBtnShort);

