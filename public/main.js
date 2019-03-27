import app from './js/app';
import pushnotification from './js/pushnotification';
import storage from './js/storage';
import camera from './js/camera';
import geolocation from './js/geolocation';
import morefeatures from './js/morefeatures';
import './style/main.css';

// globally accessible
window.baseUrl = "https://58821a93.ngrok.io";
app.init()

// pathname based operation
switch(location.pathname){ // TODO: run this in one line
    case "/storage": 
        storage.init();
        break;
    case "/pushnotification":
        pushnotification.init();
        break;
    case "/camera":
        camera.init();
        break;
    case "/geolocation":
        geolocation.init();
        break;
    case "/morefeatures":
        morefeatures.init();
        break;
}


// -------------------------------------
// Menu controller
// -------------------------------------

var menuIconElement = document.querySelector('.header__icon');
var menuElement = document.querySelector('.menu');
var menuOverlayElement = document.querySelector('.menu__overlay');

//Menu click event
menuIconElement.addEventListener('click', showMenu, false);
menuOverlayElement.addEventListener('click', hideMenu, false);
menuElement.addEventListener('transitionend', onTransitionEnd, false);

 //To show menu
function showMenu() {
  menuElement.style.transform = "translateX(0)";
  menuElement.classList.add('menu--show');
  menuOverlayElement.classList.add('menu__overlay--show');
}

//To hide menu
function hideMenu() {
  menuElement.style.transform = "translateX(-110%)";
  menuElement.classList.remove('menu--show');
  menuOverlayElement.classList.remove('menu__overlay--show');
  menuElement.addEventListener('transitionend', onTransitionEnd, false);
}

var touchStartPoint, touchMovePoint;

/*Swipe from edge to open menu*/

//`TouchStart` event to find where user start the touch
document.body.addEventListener('touchstart', function(event) {
  touchStartPoint = event.changedTouches[0].pageX;
  touchMovePoint = touchStartPoint;
}, false);

//`TouchMove` event to determine user touch movement
document.body.addEventListener('touchmove', function(event) {
  touchMovePoint = event.touches[0].pageX;
  if (touchStartPoint < 10 && touchMovePoint > 30) {          
    menuElement.style.transform = "translateX(0)";
  }
}, false);

function onTransitionEnd() {
  if (touchStartPoint < 10) {
    menuElement.style.transform = "translateX(0)";
    menuOverlayElement.classList.add('menu__overlay--show');
    menuElement.removeEventListener('transitionend', onTransitionEnd, false); 
  }
}



// -------------------------------------
// Toaster notification
// -------------------------------------

var toastContainer = document.querySelector('.toast__container');
 
  //To show notification
  function toast(msg, options) {
    if (!msg) return;

    options = options || 3000;

    var toastMsg = document.createElement('div');
    
    toastMsg.className = 'toast__msg';
    toastMsg.textContent = msg;

    toastContainer.appendChild(toastMsg);

    //Show toast for 3secs and hide it
    setTimeout(function () {
      toastMsg.classList.add('toast__msg--hide');
    }, options);

    //Remove the element after hiding
    toastMsg.addEventListener('transitionend', function (event) {
      event.target.parentNode.removeChild(event.target);
    });
  }

  window.toast = toast; //Make this method available in global



