// TODO - ENHANCE: Animate color pointer
// TODO - ENHANCE: Add background music
// TODO - ENHANCE: Add grow animation to circle without messing up z-index hierarchy
// TODO - ENHANCE: Add responsiveness
// TODO - ENHANCE: Reduce size menu toggle button
// TODO - FIX: Fading out trouble with circle button
// TODO - FIX: Cross browser compatibility 
// TODO - FIX: Deal with lost text anomaly background

const settingsToggleBtn = document.getElementById('settings-toggle-btn');
const moveToggleBtn = document.getElementById('move-toggle-btn');
const settingsContainer = document.getElementById('settings');
const settingRangeInputs = document.querySelectorAll('input[type=range]');
const settingNumberInputs = document.querySelectorAll('input[type=number]');
const settingSelect = document.getElementById('programs-select');
const pageBackground = document.getElementById('page-background');
const circleToggleBtn = document.getElementById('circle-btn');
const indicatorText = document.getElementById('indicator-text');
const countdownNumber = document.getElementById('countdown-number');
const pointerContainer = document.getElementById('pointer-container');
const pointer = document.getElementById('pointer');
const footerYearText = document.getElementById('footer-year');

const COUNTDOWN_VALUE = 5;
const INHALATION = 3;
const HOLD = 2;
const EXHALATION = 3;
let startNumber;
let isBreathing = false;



// ===== Assisting functions ======
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
    circleToggleBtn.style.transition = `opacity ${2}s linear`;
  };
};
const limitNumberLength = (number, maxLength) => {
  return number.length > maxLength ? number.slice(0, maxLength) : number;
}
const limitNumberValue = (number, maxValue) => {
  return number > maxValue ? number - (number - maxValue) : number;
}
const closeSettingsPanel = () => pageBackground.classList.contains('show') && toggleSettings();



// ===== Footer function =====
const setYearFooter = () => footerYearText.textContent = new Date().getFullYear();



// ===== Settings functions ===== 
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

const setFormInputValues = (e) => {
  let rangeInput;
  let numberInput;
  let value;

  if (e.target.type === 'range') {
    rangeInput = e.target;
    numberInput = e.target.nextElementSibling;
    value = rangeInput.value;
  };

  if (e.target.type === 'number') {
    rangeInput = e.target.previousElementSibling;
    numberInput = e.target;
    value = limitNumberLength(limitNumberValue(numberInput.value, 40), 2);
  };

  let min = rangeInput.min;
  let max = rangeInput.max;

  numberInput.value = value;
  rangeInput.value = numberInput.value === '' ? 0 : value;

  rangeInput.style.backgroundSize = (value - min) * 100 / (max - min) + '% 100%';
};

const colorFormSelectOption = () => {
  Array.from(settingSelect.children).forEach(option => {
    if (!option.disabled && option.selected) {
      option.style.color = 'hsl(359, 55%, 55%)';
      settingSelect.style.color = 'hsl(359, 55%, 55%';
    } else if (!option.disabled) {
      option.style.color = 'hsl(0, 38%, 54%)';
    }
  })
}


// ===== Breathe counting function =====
const inhalation = () => {
  if (!isBreathing) return;
  let timeInhalation = INHALATION;
  indicatorText.firstElementChild.textContent = timeInhalation;
  indicatorText.lastElementChild.textContent = 'Inhale';
  pointer.className = 'pointer grow-animation';
  
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
  pointer.className = 'pointer shrink-animation';
  

  const interval = setInterval(() => {
    timeExhalation--;
    indicatorText.firstElementChild.textContent = timeExhalation;

    if (timeExhalation === 0) {
      clearInterval(interval);
      inhalation();
    };

  }, 1000);

};



// ===== Breathe interface control functions =====
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

  countdownNumber.textContent = COUNTDOWN_VALUE;

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


const initialize = () => {
  setYearFooter();
}

// ===== Event Listeners =====
settingsToggleBtn.addEventListener('click', toggleSettings);
settingRangeInputs.forEach(range => range.addEventListener('input', setFormInputValues));
settingNumberInputs.forEach(number => number.addEventListener('input', setFormInputValues));
settingSelect.addEventListener('change', colorFormSelectOption);
circleToggleBtn.addEventListener('click', startStopBreather);
circleToggleBtn.addEventListener('mouseover', changeFadeCircleBtnShort);
window.addEventListener('DOMContentLoaded', initialize);
pageBackground.addEventListener('click', closeSettingsPanel);
