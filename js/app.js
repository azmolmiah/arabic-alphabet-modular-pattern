// ================================= STORAGE CONTROLLER ========================================= //

// ================================= ITEM CONTROLLER ============================================ //
const letterCtrl = (function() {
  // letter constructor
  const Letters = function(letters) {
    this.letters = letters;
  };
  // Section Constructor
  const Section = function(outputNum, sectionNum) {
    this.outputNum = outputNum;
    this.sectionNum = sectionNum;
  };

  // Data or Data Structure
  const data = {
    letters: letters,
    current: 0,
    output: null,
    outputTwo: null,
    outputThree: null
  };

  // Public Methods and variables
  return {
    // Put letters into sections if needed on the page
    sectionletters: function(pg) {
      this.letters = pg;

      // const sectionone = new Section(output, currentPage),
      //   sectiontwo = new Section(outputTwo, sectionTwo),
      //   sectionthree = new Section(outputThree, sectionThree);

      if (this.letters.length == 2) {
        // If page has two sectins
        this.letters[0].sectOne.forEach(one => {
          sectionone.sections(one);
        });
        this.letters[1].sectTwo.forEach(two => {
          sectiontwo.sections(two);
        });
      } else if (this.letters.length == 3) {
        // If page has three sections
        this.letters[0].sectOne.forEach(one => {
          sectionone.sections(one);
        });
        this.letters[1].sectTwo.forEach(two => {
          sectiontwo.sections(two);
        });
        this.letters[2].sectThree.forEach(three => {
          sectionthree.sections(three);
        });
      } else {
        // if page has one section
        uiCtrl.oneSectionOnly(pg);
      }
    },
    getLetters: async function(pageNum) {
      const response = await fetch('js/qaida.json');
      const letters = await response.json();
      const obj = Object.values(letters);
      data.letters = obj;
      const getAllLetters = new Letters(data.letters[pageNum]);
      letterCtrl.sectionletters(getAllLetters);
    },
    startQaida: function() {
      letterCtrl.getLetters(data.current);
    },
    nextPage: function() {
      const uiSelectors = uiCtrl.getSelectors();
      document.querySelector(uiSelectors.option).selectedIndex =
        data.current + 1;
      letterCtrl.getLetters(data.current + 1);
      data.current++;
    },
    prevPage: function() {
      const uiSelectors = uiCtrl.getSelectors();
      document.querySelector(uiSelectors.option).selectedIndex =
        data.current - 1;
      letterCtrl.getLetters(data.current - 1);
      data.current--;
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
    prev: '#prev'
  };

  // Public Methods and variables
  return {
    // Populate letters when ther's more than one section on the page
    section: function(letterNum) {
      this.outputNum += `<td id="${letterNum.name}"><img src="
      ${letterNum.image}"></td>`;
      this.sectionNum.innerHTML = this.outputNum;
    },
    // Populate letters if there's  just the one section on the page
    oneSectionOnly: function(pgOne) {
      let output;
      const currentPage = document.querySelector(uiSelectors.letters);
      for (let i = 0; i < pgOne.letters.length; i++) {
        output += `<td id="${pgOne.letters[i].name}" ><img src="${
          pgOne.letters[i].image
        }"></td>`;
        currentPage.innerHTML = output;
      }
    },
    //Populate options indexes
    populateOptionNumbers: function() {
      const currentPageNumber = document.querySelector(uiSelectors.option);
      let options;
      for (let i = 0; i <= 40; i++) {
        options += `<option>${i}</option>`;
      }
      currentPageNumber.innerHTML += options;
    },
    // Change the letter sizes based on
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
    const UISelectors = uiCtrl.getSelectors();
    // Option
    document
      .querySelector(UISelectors.option)
      .addEventListener('change', selectOptions);

    // Get next Button
    document
      .querySelector(UISelectors.next)
      .addEventListener('click', getNextPage);

    // Get prev button
    document
      .querySelector(UISelectors.prev)
      .addEventListener('click', getPrevPage);
  };

  // Options
  const selectOptions = function(e) {
    const lettersData = letterCtrl.getData();
    lettersData.current = Number(e.target.value);
    letterCtrl.getLetters(lettersData.current);
  };

  // Got to next page
  const getNextPage = function() {
    const lettersData = letterCtrl.getData();
    if (lettersData.current === lettersData.letters.length - 1) {
      return (lettersData.current = -1);
    }
    letterCtrl.nextPage();
  };

  // Go to prev page
  const getPrevPage = function() {
    const lettersData = letterCtrl.getData();
    if (lettersData.current === 0) {
      lettersData.current = lettersData.length;
    }
    letterCtrl.prevPage();
  };

  //   //Public Methods
  return {
    init: function() {
      // Start qaida app
      letterCtrl.startQaida();
      // Populate Options Numbers
      uiCtrl.populateOptionNumbers();
      // Load event listeners
      loadEventlisteners();
    }
  };
})(letterCtrl, uiCtrl);

// Initialise App
appCtrl.init();
