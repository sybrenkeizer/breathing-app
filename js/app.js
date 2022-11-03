// TODO - ENHANCE: Animate color pointer
// TODO - ENHANCE: Add background music
// TODO - ENHANCE: Add grow animation to circle without messing up z-index hierarchy
// TODO - ENHANCE: Add responsiveness
// TODO - ENHANCE: Reduce size menu toggle button
// TODO - ENHANCE: Look into better stop/start icons
// TODO - ENHANCE: Improve gradient system of indicator circle 
// TODO - FIX: Fading out trouble with circle button
// TODO - FIX: Cross browser compatibility 
// TODO - FIX: Deal with lost text anomaly background
// TODO - FIX: Timer moves out of sync (after some time)

const settingsToggleBtn = document.getElementById('settings-toggle-btn');
const moveToggleBtn = document.getElementById('move-toggle-btn');
const settingsContainer = document.getElementById('settings');
const settingSelect = document.getElementById('programs-select');
const settingRangeInputs = document.querySelectorAll('input[type=range]');
const settingNumberInputs = document.querySelectorAll('input[type=number]');
const inhalationNumberInput = document.getElementById('inhalation-text');
const exhalationNumberInput = document.getElementById('exhalation-text');
const inhaledRetentionText = document.getElementById('inhaled-retention-text');
const exhaledRetentionText = document.getElementById('exhaled-retention-text');
const settingStartSessionsBtn = document.getElementById('save-session-btn');
const settingsSaveProgramBtn = document.getElementById('save-program-btn');
const pageBackground = document.getElementById('page-background');
const circleToggleBtn = document.getElementById('circle-btn');
const indicatorText = document.getElementById('indicator-text');
const countdownNumber = document.getElementById('countdown-number');
const pointerContainer = document.getElementById('pointer-container');
const pointer = document.getElementById('pointer');
const footerYearText = document.getElementById('footer-year');

let setting_countdownValue = 5;
let setting_inhalationValue = 3;
let setting_exhalationValue = 3;
let setting_inhaledRetentionValue = 2;
let setting_exhaledRetentionValue = 0;

let startNumber;
let isBreathing = false;
let isGradient;

const breathPrograms = [
  {
    id: 'sv-b',
    name: 'Sama vritti',
    level: 'beginner',
    breath: {
      inhalation: 3,
      exhalation: 3,
      inhaledRetention: 3,
      exhaledRetention: 3,
    }
  },
  {
    id: 'sv-i',
    name: 'Sama vritti',
    level: 'intermediate',
    breath: {
      inhalation: 5,
      exhalation: 5,
      inhaledRetention: 5,
      exhaledRetention: 5,
    }
  },
  {
    id: 'sv-a',
    name: 'Sama vritti',
    level: 'advanced',
    breath: {
      inhalation: 10,
      exhalation: 10,
      inhaledRetention: 10,
      exhaledRetention: 10,
    }
  },
  {
    id: 'sv-e',
    name: 'Sama vritti',
    level: 'expert',
    breath: {
      inhalation: 20,
      exhalation: 20,
      inhaledRetention: 20,
      exhaledRetention: 20,
    }
  },
  {
    id: 'av-b',
    name: 'Anulom vilom',
    level: 'beginner',
    breath: {
      inhalation: 1,
      exhalation: 4,
      inhaledRetention: 2,
      exhaledRetention: 2,
    }
  },
  {
    id: 'av-i',
    name: 'Anulom vilom',
    level: 'intermediate',
    breath: {
      inhalation: 2,
      exhalation: 8,
      inhaledRetention: 4,
      exhaledRetention: 4,
    }
  },
  {
    id: 'av-a',
    name: 'Anulom vilom',
    level: 'advanced',
    breath: {
      inhalation: 3,
      exhalation: 9,
      inhaledRetention: 6,
      exhaledRetention: 6,
    }
  },
  {
    id: 'av-e',
    name: 'Anulom vilom',
    level: 'expert',
    breath: {
      inhalation: 4,
      exhalation: 16,
      inhaledRetention: 8,
      exhaledRetention: 8,
    }
  },
]



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




// ==================== 
// ===== Settings ===== 
// ==================== 
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

const setStyleCircleSectionBorders = () => {
  isGradient = document.getElementById('radio-input-gradient').checked;
}


const initializeSettings = (e) => {
  e.preventDefault();
  if (!validateSettingsFormInput()) return;
  stopBreathing();
  setting_inhalationValue = +inhalationNumberInput.value;
  setting_exhalationValue = +exhalationNumberInput.value;
  setting_inhaledRetentionValue = inhaledRetentionText.value ? +inhaledRetentionText.value : 0;
  setting_exhaledRetentionValue = exhaledRetentionText.value ? +exhaledRetentionText.value : 0;
  exhaledRetentionText;
  setStyleCircleSectionBorders();
  setRotationTimePointer();  
  setCircleSections();
  closeSettingsPanel();
}

const validateSettingsFormInput = () => {
  return (inhalationNumberInput.value && exhalationNumberInput.value) 
}

const controlInputSettings = () => {
  const setSelectedToCustoms = () => settingSelect.value = 'custom';

  
  settingRangeInputs.forEach(rangeInput => {
    rangeInput.addEventListener('input', setSelectedToCustoms);
  });

  settingNumberInputs.forEach(numberInput => {
    numberInput.addEventListener('input', setSelectedToCustoms);
  });

  settingSelect.addEventListener('click', (e) => {
    if (e.target.value !== 'custom') setBreathInputsToProgram(e);
  })
}

const setBreathInputsToProgram = (e) => {
  const selectedProgram = e.target.value;

  for (let key in breathPrograms) {
    if (selectedProgram === breathPrograms[key].id) {
      const program = breathPrograms[key];
      inhalationNumberInput.value = program.breath.inhalation;
      exhalationNumberInput.value = program.breath.exhalation;
      inhaledRetentionText.value = program.breath.inhaledRetention;
      exhaledRetentionText.value = program.breath.exhaledRetention;
    };
  };

  settingRangeInputs.forEach(rangeInput => {
    const setRangeInput = (range, number) => {
      const value = number.value;
      const min = range.min;
      const max = range.max;
      range.value = value;
      range.style.backgroundSize = (value - min) * 100 / (max - min) + '% 100%';
    }
    if (rangeInput.dataset.breath === inhalationNumberInput.dataset.breath) {
      setRangeInput(rangeInput, inhalationNumberInput);
    };
    if (rangeInput.dataset.breath === exhalationNumberInput.dataset.breath) {
      setRangeInput(rangeInput, exhalationNumberInput);
    };
    if (rangeInput.dataset.breath === inhaledRetentionText.dataset.breath) {
      setRangeInput(rangeInput, inhaledRetentionText);
    };
    if (rangeInput.dataset.breath === exhaledRetentionText.dataset.breath) {
      setRangeInput(rangeInput, exhaledRetentionText);
    };

  })

};



const saveProgramSettings = (e) => {
  e.preventDefault();
}


// ==========================
// ===== Breathe circle =====
// ==========================
const inhalation = () => {
  if (!isBreathing) return;

  console.log(setting_inhalationValue);
  console.log(setting_exhalationValue);
  console.log(setting_inhaledRetentionValue);
  console.log(setting_exhaledRetentionValue);




  let timeInhalation = setting_inhalationValue;
  indicatorText.firstElementChild.textContent = timeInhalation;
  indicatorText.lastElementChild.textContent = 'Inhale';
  pointer.className = 'pointer grow-animation';
  
  const interval = setInterval(() => {
    --timeInhalation;
    indicatorText.firstElementChild.textContent = timeInhalation;
    
    if (timeInhalation === 0) {
      clearInterval(interval);
      inhaledRetention();
    };
    
  }, 1000);
};

const inhaledRetention = () => {
  if (!isBreathing) return;
  let timeRetention = setting_inhaledRetentionValue;
  indicatorText.firstElementChild.textContent = timeRetention;
  indicatorText.lastElementChild.textContent = 'Hold';
  
  
  const interval = setInterval(() => {
    timeRetention--;
    indicatorText.firstElementChild.textContent = timeRetention;
    
    if (timeRetention === 0) {
      clearInterval(interval);
      exhalation();
    };
    
  }, 1000);
};

const exhalation = () => {
  if (!isBreathing) return;
  let timeExhalation = setting_exhalationValue;
  indicatorText.firstElementChild.textContent = timeExhalation;
  indicatorText.lastElementChild.textContent = 'Exhale';
  pointer.className = 'pointer shrink-animation';
  

  const interval = setInterval(() => {
    timeExhalation--;
    indicatorText.firstElementChild.textContent = timeExhalation;

    if (timeExhalation === 0) {
      clearInterval(interval);
      exhaledRetention();
    };

  }, 1000);
};

const exhaledRetention = () => {
  if (!isBreathing) return;
  if (setting_exhaledRetentionValue === 0) return inhalation();
  let timeRetention = setting_exhaledRetentionValue;
  indicatorText.firstElementChild.textContent = timeRetention;
  indicatorText.lastElementChild.textContent = 'Hold';
  
  
  const interval = setInterval(() => {
    timeRetention--;
    indicatorText.firstElementChild.textContent = timeRetention;
    
    if (timeRetention === 0) {
      clearInterval(interval);
      inhalation();
    };
    
  }, 1000);
}


// ===== Set animation timing ===== 
const setRotationTimePointer = () => {
  const rotateAnimation = document.querySelector('.rotate-animation');
  const animationDuration = setting_inhalationValue + setting_inhaledRetentionValue + setting_exhalationValue + setting_exhaledRetentionValue;
  rotateAnimation.style.animationDuration = `${animationDuration}s`;
};

// ===== Set UI according to breathe settings ===== 
const setCircleSections = () => {
  const circleGradient = document.querySelector('.circle__gradient');
  const inhalationTime = setting_inhalationValue;
  const exhalationTime = setting_exhalationValue;
  const inhaledRetentionTime = setting_inhaledRetentionValue;
  const exhaledRetentionTime = setting_exhaledRetentionValue;
  const totalBreathTime = inhalationTime + inhaledRetentionTime + exhalationTime + exhaledRetentionTime;

  let startInhale = 0;
  let endInhale = inhalationTime / totalBreathTime * 100;
  let startInhaledRetention = endInhale;
  let endInhaledRetention = (inhaledRetentionTime / totalBreathTime * 100) + startInhaledRetention;
  let startExhale = endInhaledRetention;
  let endExhale = (exhalationTime / totalBreathTime * 100) + endInhaledRetention;
  let startExhaledRetention = endExhale;
  let endExhaledRetention = 100;
  let overlap = 100;

  const colorInhale = 'hsl(354, 8%, 25%)';
  const colorExhale= 'hsl(332, 24%, 12%)';
  const colorRetention = 'hsl(0, 0%, 67%)';
  const colorInhaledRetentionStart = !inhaledRetentionTime ? colorInhale : colorRetention;
  const colorInhaledRetentionEnd = !inhaledRetentionTime ? colorExhale : colorRetention;
  const colorExhaledRetentionStart = !exhaledRetentionTime ? colorInhale : colorRetention;
  const colorExhaledRetentionEnd = !exhaledRetentionTime ? colorExhale : colorRetention;

  if (isGradient) {
    startInhale += 1.5;
    endInhale -= 4.5;
    startInhaledRetention += 1.5;
    endInhaledRetention -= 4.5;
    startExhale += 1.5;
    endExhale -= 4.5;
    startExhaledRetention += 1.5;
    endExhaledRetention -= 4.5;

    if (!inhaledRetentionTime) {
      startInhaledRetention = endInhale;
      endInhaledRetention = startExhale
    }
    
    if (!exhaledRetentionTime) {
      startExhaledRetention = startExhaledRetention
      endExhaledRetention - 3.5;
    }

    circleGradient.style.transform = 'rotate(calc(360deg / 100 * 1.5))';
  } else {
    circleGradient.style.transform = 'rotate(0)';
  }

  circleGradient.style.backgroundImage = `conic-gradient(
      ${colorInhale} ${startInhale}%,
      ${colorInhale} ${endInhale}%,
      ${colorInhaledRetentionStart} ${startInhaledRetention}%,
      ${colorInhaledRetentionEnd} ${endInhaledRetention}%,
      ${colorExhale} ${startExhale}%,
      ${colorExhale} ${endExhale}%,
      ${colorExhaledRetentionStart} ${startExhaledRetention}%,
      ${colorExhaledRetentionEnd} ${endExhaledRetention}%,
      ${colorInhale} ${overlap}%)
    `;
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
  startNumber = setting_countdownValue;
  showBreatherCountdown();
  addFadeBreatherCircleBtn();
  changeFadeCircleBtnLong();

  countdownNumber.textContent = setting_countdownValue;

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
  controlInputSettings();
}


// ===========================
// ===== Event Listeners =====
// ===========================
settingsToggleBtn.addEventListener('click', toggleSettings);
settingRangeInputs.forEach(range => range.addEventListener('input', setFormInputValues));
settingNumberInputs.forEach(number => number.addEventListener('input', setFormInputValues));
settingSelect.addEventListener('change', colorFormSelectOption);
settingStartSessionsBtn.addEventListener('click', initializeSettings);
settingsSaveProgramBtn.addEventListener('click', saveProgramSettings);
circleToggleBtn.addEventListener('click', startStopBreather);
circleToggleBtn.addEventListener('mouseover', changeFadeCircleBtnShort);
window.addEventListener('DOMContentLoaded', initialize);
pageBackground.addEventListener('click', closeSettingsPanel);
