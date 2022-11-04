// TODO - ENHANCE: Animate color pointer
// TODO - ENHANCE: Add background music
// TODO - ENHANCE: Add grow animation to circle without messing up z-index hierarchy
// TODO - ENHANCE: Add responsiveness
// TODO - ENHANCE: Reduce size menu toggle button
// TODO - ENHANCE: Look into better stop/start icons
// TODO - ENHANCE: Improve gradient system of indicator circle 
// TODO - ENHANCE: Add more fluent exit from settings modal
// TODO - FIX: Fading out trouble with circle button
// TODO - FIX: Cross browser compatibility 
// TODO - FIX: Deal with lost text anomaly background
// TODO - FIX: Timer moves out of sync (after some time)
// TODO - FIX: Do not allow the same name as custom program
// TODO - FIX: DO not allow double timing sequences being stored as program

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
const settingsSaveProgramBtn = document.getElementById('store-program-btn');

const settingsModal = document.getElementById('settings-modal');
const modalSaveBtn = document.getElementById('modal-save-btn');
const cancelSettingsModal = document.getElementById('cancel-settings-modal');
const backgroundSettings = document.getElementById('background-settings');
const backgroundModal = document.getElementById('background-modal');
const modalCustomProgramName = document.getElementById('name-custom-program-text');

const circleToggleBtn = document.getElementById('circle-btn');
const indicatorText = document.getElementById('indicator-text');
const countdownNumber = document.getElementById('countdown-number');
const pointerContainer = document.getElementById('pointer-container');
const pointer = document.getElementById('pointer');

const footerYearText = document.getElementById('footer-year');

const MAX_TIME_VALUE = 30;

let setting_countdownValue = 5;
let setting_inhalationValue = 3;
let setting_exhalationValue = 3;
let setting_inhaledRetentionValue = 2;
let setting_exhaledRetentionValue = 0;

let startNumber;
let isBreathing = false;
let isGradient;
let isSettingsOpened = false;
let isSettingsModalOpened = false;



getCustomProgramFromLS = () => {
  customBreathPrograms = localStorage.getItem('programs')
    ? JSON.parse(localStorage.getItem('programs'))
    : [];
};

let customBreathPrograms;

const presetBreathPrograms = [
  {
    id: 'sv-i',
    name: 'Sama vritti',
    breath: {
      inhalation: 5,
      exhalation: 5,
      inhaledRetention: 5,
      exhaledRetention: 5,
    }, 
    datatype: 'preset'
  },
  {
    id: 'av-e',
    name: 'Anulom vilom',
    breath: {
      inhalation: 4,
      exhalation: 16,
      inhaledRetention: 8,
      exhaledRetention: 8,
    }, 
    datatype: 'preset'
  }
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
const limitNumberValue = (number) => {
  return number > MAX_TIME_VALUE ? number - (number - MAX_TIME_VALUE) : number;
}
const closeSettingsPanel = () => {
  if (isSettingsOpened && !isSettingsModalOpened) {
    toggleSettings();
  };
};




// ===== Footer function =====
const setYearFooter = () => footerYearText.textContent = new Date().getFullYear();




// ==================== 
// ===== Settings ===== 
// ==================== 
const toggleSettings = () => {
  if (settingsContainer.classList.contains('open')) {
    isSettingsOpened = false;
    settingsToggleBtn.classList.remove('open');
    moveToggleBtn.classList.remove('move');
    settingsContainer.classList.remove('open');
    backgroundSettings.classList.remove('show');
  } else {
    isSettingsOpened = true;
    settingsToggleBtn.classList.add('open');
    moveToggleBtn.classList.add('move');
    settingsContainer.classList.add('open');
    backgroundSettings.classList.add('show');
    backgroundSettings.addEventListener('click', closeSettingsPanel);
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
    value = limitNumberLength(limitNumberValue(numberInput.value), 2);
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
};

const validateSettingsFormInput = () => {
  return (inhalationNumberInput.value > 0 && exhalationNumberInput.value > 0);
};

const controlInputSettings = () => {
  const setSelectedToCustoms = () => settingSelect.value = 'custom';

  settingRangeInputs.forEach(rangeInput => {
    rangeInput.addEventListener('input', setSelectedToCustoms);
  });

  settingNumberInputs.forEach(numberInput => {
    numberInput.addEventListener('input', setSelectedToCustoms);
  });

  settingSelect.addEventListener('click', (e) => {
    if (e.target.value !== 'custom') {
      const targetDatatype = e.target.options[e.target.selectedIndex].dataset.datatype
      targetDatatype === 'preset'
        ? setBreathInputsToProgram(e, presetBreathPrograms)
        : targetDatatype === 'custom'
        ? setBreathInputsToProgram(e, customBreathPrograms)
        : console.error('Datatype not found');
    };
  });
};

const setBreathInputsToProgram = (e, data) => {
  const selectedProgram = e.target.value;

  for (let key in data) {
    if (selectedProgram === data[key].id) {
      const program = data[key];
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

  });

};

const setMaxTimeValueInput = () => {
  settingRangeInputs.forEach(rangeInput => rangeInput.max = MAX_TIME_VALUE);
  settingNumberInputs.forEach(numberInput => numberInput.max = MAX_TIME_VALUE);
};

const openProgramNameModal = (e) => {
  if (!validateSettingsFormInput()) return;
  e.preventDefault();
  isSettingsModalOpened = true;
  moveToggleBtn.style.opacity = '0';
  settingsModal.classList.add('show');
  modalCustomProgramName.select();
  backgroundModal.classList.add('show');
  cancelSettingsModal.addEventListener('click', cancelProgramNameModal);
};

const createCustomProgram = (e) =>{
  e.preventDefault();
  saveCustomProgramToLS(e);
  getCustomProgramFromLS();
  clearProgramsFromUI();
  populateUIPresetPrograms();
  populateUICustomPrograms();
  closeProgramNameModal();
  selectNewlyCreatedProgram();
};

const closeProgramNameModal = () => {
  modalCustomProgramName.value = '';
  isSettingsModalOpened = false;
  settingsModal.classList.remove('show');
  backgroundModal.classList.remove('show');
  moveToggleBtn.style.opacity = '1';
};

const cancelProgramNameModal = () => {
  closeProgramNameModal();
};

const populateUIPresetPrograms = () => {
  let optgroupElPreset;

  if (!!customBreathPrograms.length) {
    optgroupElPreset = document.createElement('optgroup');
    optgroupElPreset.label = 'Preset Programs';
  };

  presetBreathPrograms.forEach(program => {
    const optionEl = document.createElement('option');
    optionEl.value = program.id;
    optionEl.textContent = program.name;
    optionEl.dataset.datatype = 'preset' 

    !!customBreathPrograms.length
      ? optgroupElPreset.appendChild(optionEl)
      : settingSelect.appendChild(optionEl);
    });

    optgroupElPreset && settingSelect.appendChild(optgroupElPreset);
};

const populateUICustomPrograms = () => {
  let optgroupElCustom;
  if (!!customBreathPrograms.length) {
    optgroupElCustom = document.createElement('optgroup');
    optgroupElCustom.label = 'Custom Programs';
  };

  customBreathPrograms.forEach(program => {
    const optionEl = document.createElement('option');
    optionEl.value = program.id;
    optionEl.textContent = program.name;
    optionEl.dataset.datatype = 'custom' 

    !!customBreathPrograms.length
      ? optgroupElCustom.appendChild(optionEl)
      : settingSelect.appendChild(optionEl);
    });

    optgroupElCustom && settingSelect.appendChild(optgroupElCustom);
};

const clearProgramsFromUI = () => {
  Array.from(settingSelect.children).forEach((child, index) => {
  index > 1 && child.remove();
  });
};

const selectNewlyCreatedProgram = () => {
  settingSelect.selectedIndex = settingSelect.options.length - 1;
};




// =========================
// ===== Local Storage =====
// =========================

const saveCustomProgramToLS = (e) => {
  e.preventDefault();
  const inhalation = +inhalationNumberInput.value;
  const exhalation = +exhalationNumberInput.value;
  const inhaledRetention = inhaledRetentionText.value ? +inhaledRetentionText.value : 0;
  const exhaledRetention = exhaledRetentionText.value ? +exhaledRetentionText.value : 0;
  const programName = modalCustomProgramName.value;

  const newProgram = {
    id: programName,
    name: programName,
    breath: {
      inhalation: inhalation,
      exhalation: exhalation,
      inhaledRetention: inhaledRetention,
      exhaledRetention: exhaledRetention,
    }, 
    datatype: 'custom'
  };
  const customProgramsLS = localStorage.getItem('programs')
                          ? JSON.parse(localStorage.getItem('programs'))
                          : [];
  customProgramsLS.push(newProgram);
  localStorage.setItem('programs', JSON.stringify(customProgramsLS));
};




// ==========================
// ===== Breathe circle =====
// ==========================
const inhalation = () => {
  if (!isBreathing) return;
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
  setMaxTimeValueInput();
  getCustomProgramFromLS();
  populateUIPresetPrograms();
  populateUICustomPrograms();
}


// ===========================
// ===== Event Listeners =====
// ===========================
settingsToggleBtn.addEventListener('click', toggleSettings);
settingRangeInputs.forEach(range => range.addEventListener('input', setFormInputValues));
settingNumberInputs.forEach(number => number.addEventListener('input', setFormInputValues));
settingSelect.addEventListener('change', colorFormSelectOption);
settingStartSessionsBtn.addEventListener('click', initializeSettings);
settingsSaveProgramBtn.addEventListener('click', openProgramNameModal);
modalSaveBtn.addEventListener('click', createCustomProgram);
circleToggleBtn.addEventListener('click', startStopBreather);
circleToggleBtn.addEventListener('mouseover', changeFadeCircleBtnShort);
window.addEventListener('DOMContentLoaded', initialize);
