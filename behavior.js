// very basic document.getElementsByClassName polyfill
if (!document.getElementsByClassName) {
  document.getElementsByClassName = function (el) {
    document.body.querySelectorAll('.'+el)
  };
}

// https://developer.mozilla.org/en-US/docs/DOM/Storage
// very basic localStorage polyfill
if (!window.localStorage) {
  window.localStorage = {
    getItem: function (sKey) {
      if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
      return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
    },
    key: function (nKeyId) {
      return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
    },
    setItem: function (sKey, sValue) {
      if(!sKey) { return; }
      document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
      this.length = document.cookie.match(/\=/g).length;
    },
    length: 0,
    removeItem: function (sKey) {
      if (!sKey || !this.hasOwnProperty(sKey)) { return; }
      document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      this.length--;
    },
    hasOwnProperty: function (sKey) {
      return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    }
  };
  window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
}

function updateStepsStatus() {
  var steps = document.getElementsByClassName('step');
  var storedStepNumber = function () { return parseInt(window.localStorage.getItem('stepNumber'),10) };
  for(var i=0,im=steps.length; i<im; i++) {
    steps[i].className = 'step ' + (function () {
      if(i < storedStepNumber()) { return ' past'; }
      if(i === storedStepNumber()) { return ' current'; }
      if(i > storedStepNumber()) { return ' futur'; }
    })();
  }
}

function toogleStep(event) {
  var step = event.currentTarget.parentNode.parentNode;
  var stepNumber = parseInt(step.id.match(/[0-9]+$/)[0], 10);
  var storedStepNumber = function () { return parseInt(window.localStorage.getItem('stepNumber'),10) };
  if( stepNumber === storedStepNumber() ) {
    window.localStorage.setItem('stepNumber', stepNumber + 1)
    updateStepsStatus();
  }
  else if( stepNumber < storedStepNumber() ) {
    window.localStorage.setItem('stepNumber', stepNumber)
    updateStepsStatus();
  }
}

function init() {
  var storedStepNumber = function () { return parseInt(window.localStorage.getItem('stepNumber'),10) };
  // load stepNumber to localStorage
  window.localStorage.setItem( 'stepNumber', storedStepNumber() || 0 );

  // add checkboxes to the document
  var container,
  title,
  checkbox,
  steps = document.getElementsByClassName('step');
  for(var i=0,im=steps.length; i<im; i++) {
    steps[i].id = 'step' + i;
    container = document.createElement('h2');
    title = document.createElement('span');
    // replace the former h2 tag by a new empty one,
    // puts its content into the title variable.
    title.innerHTML = steps[i].replaceChild(
      container,
      steps[i].getElementsByTagName('h2')[0]
    ).innerHTML;
    checkbox = document.createElement('span');
    checkbox.className = 'checkbox';
    checkbox.addEventListener('click', toogleStep, false);
    container.appendChild(checkbox);
    container.appendChild(title);
  }

  updateStepsStatus();
}

// Run !
init();

