// ================================= STORAGE CONTROLLER ========================================= //
const storageCtrl = (function() {
  // Public Methods
  return {
    setStorageLetters: function() {
      const data = letterCtrl.getData();
      localStorage.setItem('pageNumber', JSON.stringify(data.current));
    },
    getStorageLetters: function() {
      const data = letterCtrl.getData();
      data.current = JSON.parse(localStorage.getItem('pageNumber'));
      letterCtrl.getLetters(data.current);
    },
    setStorageLoopIndex: function(loopIndex, currentPageIndex) {
      const data = letterCtrl.getData();

      const storeloopingIndex = {
        loopingIndex: loopIndex,
        loopingIndexPageNumber: currentPageIndex
      };

      if (localStorage.getItem('loopIndex') === null) {
        localStorage.setItem('loopIndex', JSON.stringify(loopIndex));
        localStorage.setItem(
          'currentPageIndex',
          JSON.stringify(currentPageIndex)
        );
        data.playIndexArr.push(storeloopingIndex);
      } else {
        data.playIndexArr.forEach(index => {
          if (data.playIndexArr[currentPageIndex]) {
            if (
              data.playIndexArr[currentPageIndex] ===
              data.playIndexArr[index.loopingIndexPageNumber]
            ) {
              index.loopingIndex = loopIndex;
              index.loopingIndexPageNumber = currentPageIndex;
            }
          } else {
            data.playIndexArr.push(storeloopingIndex);
          }
        });
        localStorage.setItem(
          'loopIndexArray',
          JSON.stringify(data.playIndexArr)
        );
      }
    },
    getStorageLoopIndex: function(current) {
      const data = letterCtrl.getData();
      const playIndexArray = JSON.parse(localStorage.getItem('loopIndexArray'));

      if (
        localStorage.getItem('loopIndexArray') !== null &&
        playIndexArray[current]
      ) {
        data.playIndex = playIndexArray[current].loopingIndex - 1;
      } else if (
        localStorage.getItem('loopIndex') !== null &&
        localStorage.getItem('loopIndexArray') === null
      ) {
        data.playIndex = JSON.parse(localStorage.getItem('loopIndex')) - 1;
      } else {
        data.playIndex = 0;
      }
    },
    getData: function() {
      const current = JSON.parse(localStorage.getItem('pageNumber'));
      return current;
    }
  };
})();

// ================================= LETTER DATA CONTROLLER ============================================ //
const letterCtrl = (function() {
  // letter constructor
  const Letters = function(letters) {
    this.letters = letters;
  };

  // Data or Data Structure
  const data = {
    letters: letters,
    current: 0,
    output: '',
    loopSound: new Audio(),
    playIndex: 0,
    playIndexArr: []
  };

  // Public Methods and variables
  return {
    // Output the letters from data
    getLetters: async function(pageNum) {
      const response = await fetch('js/qaida.json');
      const letters = await response.json();
      const obj = Object.values(letters);
      data.letters = obj;
      const getAllLetters = new Letters(data.letters[pageNum]);
      uiCtrl.output(getAllLetters);
      uiCtrl.currentPageLetterSize(pageNum);
    },
    startQaida: function() {
      letterCtrl.getLetters(data.current);
      storageCtrl.getStorageLoopIndex(data.current);
    },
    getNextPage: function() {
      if (data.current === data.letters.length - 1) {
        data.current = -1;
      }
      appCtrl.nextPage();
    },
    getPrevPage: function() {
      if (data.current === 0) {
        data.current = data.letters.length;
      }
      appCtrl.prevPage();
    },

    getData: function() {
      return data;
    }
  };
})();

// ================================= UI CONTROLLER ============================================== //
const uiCtrl = (function() {
  const uiSelectors = {
    letters: '#letters',
    option: '#options',
    next: '#next',
    prev: '#prev',
    image: 'img',
    playBtn: '#playBtn',
    stopBtn: '#stopBtn',
    setBookMark: '#setBookMark',
    getBookMark: '#getBookMark'
  };

  // Public Methods and variables
  return {
    // Populate letters in UI
    output: function(pgOne) {
      let output = letterCtrl.getData().output;
      const currentPage = document.querySelector(uiSelectors.letters);
      for (let i = 0; i < pgOne.letters.length; i++) {
        output += `<img id="${pgOne.letters[i].name}" src="img/${
          pgOne.letters[i].image
        }.png">`;
        currentPage.innerHTML = output;
      }
    },
    //Populate options indexes
    populateOptionNumbers: function() {
      const currentPageNumber = document.querySelector(uiSelectors.option);
      let options;
      for (let i = 0; i <= 26; i++) {
        options += `<option>${i}</option>`;
      }
      currentPageNumber.innerHTML += options;
    },
    // Change the letter sizes
    changeLetterSize: function(letterWidth, letterHeight) {
      const letterImg = document.getElementsByTagName(uiSelectors.image);
      const img = Array.from(letterImg);
      img.forEach(image => {
        image.style.width = letterWidth;
        image.style.height = letterHeight;
      });
    },
    // Change the letter sizes depending on current page
    currentPageLetterSize: function(current) {
      const data = letterCtrl.getData();
      const letterImg = document.getElementsByTagName(uiSelectors.image);
      const img = Array.from(letterImg);
      // Change letter size depending on page
      if (data.letters[current] === data.letters[0]) {
        // Page 0 letter sizes
        uiCtrl.changeLetterSize('5.5rem', '4.71rem');
        letterImg[0].style.width = '99.9%';
        letterImg[0].style.padding = '5px';
      } else if (data.letters[current] === data.letters[1]) {
        // Page 1 letter sizes
        uiCtrl.changeLetterSize('4.58rem', '3.3rem');
        letterImg[0].style.width = '99.9%';
        letterImg[0].style.padding = '5px';
      } else if (data.letters[current] === data.letters[2]) {
        // Page 2 letter sizes
        uiCtrl.changeLetterSize('4.58rem', '3.3rem');
      } else if (data.letters[current] === data.letters[3]) {
        // Page 3
        // All letter sizes
        uiCtrl.changeLetterSize('5.5rem', '4.125rem');
        letterImg[10].style.width = '9.16rem';
        letterImg[11].style.width = '9.16rem';
        letterImg[12].style.width = '9.16rem';
        letterImg[13].style.width = '99.9%';
        letterImg[13].style.padding = '5px';
        const secondHalfLetters = img.slice(14);
        secondHalfLetters.forEach(letters => {
          letters.style.width = '6.87rem';
        });
        letterImg[18].style.width = '13.75rem';

        letterImg[25].style.width = '13.75rem';
      }
    },
    highlightLetter: function(index) {
      const letterImg = document.getElementsByTagName(uiSelectors.image);
      const img = Array.from(letterImg);
      img[index].classList.add('bgBlue');
      setTimeout(function() {
        img[index--].classList.remove('bgBlue');
      }, 1900);
    },
    pauseIcon: function() {
      document.querySelector(uiSelectors.playBtn).classList.remove('fa-play');
      document.querySelector(uiSelectors.playBtn).classList.add('fa-pause');
    },
    playIcon: function() {
      document.querySelector(uiSelectors.playBtn).classList.remove('fa-pause');
      document.querySelector(uiSelectors.playBtn).classList.add('fa-play');
    },
    bookMarkIcon: function(localStorageCurrent, current) {
      if (localStorageCurrent !== current) {
        document
          .querySelector(uiSelectors.setBookMark)
          .classList.remove('fas', 'fa-bookmark');
        document
          .querySelector(uiSelectors.setBookMark)
          .classList.add('far', 'fa-bookmark');
      } else {
        document
          .querySelector(uiSelectors.setBookMark)
          .classList.remove('far', 'fa-bookmark');
        document
          .querySelector(uiSelectors.setBookMark)
          .classList.add('fas', 'fa-bookmark');
        document.querySelector(
          uiSelectors.option
        ).selectedIndex = storageCtrl.getData();
      }
    },
    getSelectors: function() {
      return uiSelectors;
    }
  };
})();

// // // ================================= APP CONTROLLER ============================================ //
const appCtrl = (function(letterCtrl, uiCtrl) {
  // Load event listeners
  const loadEventlisteners = function() {
    // Get ui Selector(s)
    const uiSelectors = uiCtrl.getSelectors();

    // Get next letter sound when current letter sound ends
    const data = letterCtrl.getData();
    data.loopSound.addEventListener('ended', nextSound);

    // init Loop
    document
      .querySelector(uiSelectors.playBtn)
      .addEventListener('click', initLoop);

    // Stop Loop or Restart loop from beginning
    document
      .querySelector(uiSelectors.stopBtn)
      .addEventListener('click', stopLoop);

    //Get each letter sound
    document
      .querySelector(uiSelectors.letters)
      .parentElement.addEventListener('click', individualSound);

    // Option
    document
      .querySelector(uiSelectors.option)
      .addEventListener('change', selectOptions);

    // Get next Button
    document
      .querySelector(uiSelectors.next)
      .addEventListener('click', nextPage);

    // Get prev button
    document
      .querySelector(uiSelectors.prev)
      .addEventListener('click', prevPage);

    // Set local storage on current page
    document
      .querySelector(uiSelectors.setBookMark)
      .addEventListener('click', setBookMark);

    // Get local storage for saved page index
    document
      .querySelector(uiSelectors.getBookMark)
      .addEventListener('click', getBookMark);
  };

  // Set book mark of just the page number in local storage
  const setBookMark = function() {
    storageCtrl.setStorageLetters();
    const data = letterCtrl.getData();
    uiCtrl.bookMarkIcon(storageCtrl.getData(), data.current);
  };

  // Get bookmark of just the page number and feed to the output
  const getBookMark = function() {
    storageCtrl.getStorageLetters();
    const data = letterCtrl.getData();
    uiCtrl.bookMarkIcon(storageCtrl.getData(), data.current);
    storageCtrl.getStorageLoopIndex(data.current);
  };

  // Get next letter sound in loop
  const nextSound = function() {
    const data = letterCtrl.getData();
    if (data.playIndex === data.letters[data.current].length) {
      uiCtrl.playIcon();
      data.loopSound.pause();
      stopLoop();
    } else {
      uiCtrl.highlightLetter(data.playIndex);
      data.loopSound.src = `audio/${
        data.letters[data.current][data.playIndex++].name
      }.mp3`;
      data.loopSound.play();
    }
  };

  // Init Loop to play all letter sound
  const initLoop = function() {
    const data = letterCtrl.getData();
    if (data.loopSound.paused) {
      uiCtrl.pauseIcon();
      nextSound();
    } else {
      // When clicking on pause button whilst looping
      uiCtrl.playIcon();
      data.loopSound.pause();
      //Store current pause index
      storageCtrl.setStorageLoopIndex(data.playIndex, data.current);
    }
  };

  // Resets the play index to 0 or start
  const stopLoop = function() {
    const data = letterCtrl.getData();
    data.playIndex = 0;
    localStorage.removeItem('loopIndex');
    localStorage.removeItem('currentPageIndex');
    localStorage.removeItem('loopIndexArray');
    data.loopSound.pause();
    uiCtrl.playIcon();
  };

  // Play clicking individual sounds
  const individualSound = function(e) {
    const clickSound = new Audio();
    // Get id name of each sound image thats outputed
    clickSound.src = `audio/${e.path[0].id}.mp3`;
    if (clickSound.paused) {
      clickSound.play();
    }
  };

  // Options
  const selectOptions = function(e) {
    const data = letterCtrl.getData();
    data.current = Number(e.target.value);
    letterCtrl.getLetters(data.current);
    uiCtrl.bookMarkIcon(storageCtrl.getData(), data.current);
    storageCtrl.getStorageLoopIndex(data.current);
  };

  // Got to next page
  const nextPage = function() {
    const data = letterCtrl.getData();
    const uiSelectors = uiCtrl.getSelectors();
    document.querySelector(uiSelectors.option).selectedIndex = data.current + 1;
    letterCtrl.getLetters(data.current + 1);
    data.current++;
    uiCtrl.bookMarkIcon(storageCtrl.getData(), data.current);
    storageCtrl.getStorageLoopIndex(data.current);
  };

  // Go to prev page
  const prevPage = function() {
    const data = letterCtrl.getData();
    const uiSelectors = uiCtrl.getSelectors();
    document.querySelector(uiSelectors.option).selectedIndex = data.current - 1;
    letterCtrl.getLetters(data.current - 1);
    data.current--;
    uiCtrl.bookMarkIcon(storageCtrl.getData(), data.current);
    storageCtrl.getStorageLoopIndex(data.current);
  };

  //Public Methods
  return {
    init: function() {
      const data = letterCtrl.getData();

      // Start qaida app
      letterCtrl.startQaida();

      // Populate Options Numbers
      uiCtrl.populateOptionNumbers();

      // If first page bookmarked then show bookmark
      uiCtrl.bookMarkIcon(storageCtrl.getData(), data.current);

      // Load event listeners
      loadEventlisteners();
    }
  };
})(letterCtrl, uiCtrl);

// Initialise App
appCtrl.init();
