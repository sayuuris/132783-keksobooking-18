'use strict';
(function () {
  var mainPin = window.map.mapElem.querySelector('.map__pin--main');
  var offerForm = document.querySelector('.ad-form');
  var adAddress = offerForm.querySelector('#address');
  var mainPage = document.querySelector('main');
  var filterForm = document.querySelector('.map__filters');
  var MAIN_PIN_START_LEFT = 570;
  var MAIN_PIN_START_TOP = 375;
  var CentralPin = {
    WIDTH: 65,
    HEIGHT: 65,
    NIDDLE: 20
  };
  var setMainPinStartCoords = function () {
    mainPin.style.left = MAIN_PIN_START_LEFT + 'px';
    mainPin.style.top = MAIN_PIN_START_TOP + 'px';
  };
  var removeSuccessPopup = function () {
    var popup = mainPage.querySelector('.success');
    if (popup) {
      popup.remove();
    }
  };

  var onSuccessPopupKeydown = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      removeSuccessPopup();
    }
    document.removeEventListener('keydown', onSuccessPopupKeydown);
  };

  var onSuccessPopupClick = function () {
    removeSuccessPopup();
    document.removeEventListener('keydown', onSuccessPopupClick);
  };
  var getAddress = function () {
    var peak = window.map.mapElem.classList.contains('map--faded') ? 0 : CentralPin.WIDTH;
    var x = Math.round(parseInt(mainPin.style.left, 10) + CentralPin.HEIGHT / 2);
    var y = Math.round(parseInt(mainPin.style.top, 10) + CentralPin.WIDTH / 2 + peak);
    return x + ', ' + y;
  };
  var onMainPinMouseDown = function () {
    activatePage();
  };
  var onMainPinKeyDown = function (evt) {
    if (evt.keyCode === window.utils.ENTER_KEYCODE) {
      activatePage();
    }
  };
  mainPin.addEventListener('mousedown', onMainPinMouseDown);
  mainPin.addEventListener('keydown', onMainPinKeyDown);
  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var dragged = false;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;
      adAddress.value = getAddress();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      if (mainPin.offsetTop - shift.y > window.map.MapRangeY.MIN - window.map.Avatar.HEIGHT && mainPin.offsetTop - shift.y < window.map.MapRangeY.MAX) {
        mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      }
      if (mainPin.offsetLeft - shift.x > window.map.MapRangeX.MIN - CentralPin.WIDTH / 2 && mainPin.offsetLeft - shift.x < window.map.MapRangeX.MAX - CentralPin.WIDTH / 2) {
        mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      }

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (ev) {
          ev.preventDefault();
          mainPin.removeEventListener('click', onClickPreventDefault);
        };
        mainPin.addEventListener('click', onClickPreventDefault);
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
  var activatePage = function () {
    window.map.mapElem.classList.remove('map--faded');
    offerForm.classList.remove('ad-form--disabled');
    var formElements = offerForm.querySelectorAll('.ad-form__element');
    window.backend.load(function (responce) {
      window.map.filteredPins(responce);
      // window.filter.activateFilter();
    }, getError);
    formElements.forEach(function (item) {
      item.disabled = false;
    });

    var avatarElement = offerForm.querySelector('.ad-form-header');
    avatarElement.disabled = false;

    var filterElements = filterForm.querySelectorAll('.map__filter');
    filterElements.forEach(function (item) {
      item.disabled = false;
    });
    var featuresElement = filterForm.querySelector('.map__features');
    featuresElement.disabled = false;
    adAddress.value = getAddress();
    mainPin.removeEventListener('mousedown', onMainPinMouseDown);
    mainPin.removeEventListener('keydown', onMainPinKeyDown);
  };

  var deactivatePage = function () {
    window.map.mapElem.classList.add('map--faded');
    offerForm.classList.add('ad-form--disabled');
    var formElements = offerForm.querySelectorAll('.ad-form__element');
    formElements.forEach(function (item) {
      item.disabled = true;
    });

    var avatarElement = offerForm.querySelector('.ad-form-header');
    avatarElement.disabled = true;

    var filterElements = offerForm.querySelectorAll('.map__filter');
    filterElements.forEach(function (item) {
      item.disabled = true;
    });

    var featuresElement = filterForm.querySelector('.map__features');
    featuresElement.disabled = true;
    offerForm.reset();
    window.filter.deactivateFilter();
    window.map.removePins();
    window.map.removePopup();
    window.form.resetPreview();
    setMainPinStartCoords();
    adAddress.value = getAddress();
    mainPin.addEventListener('mousedown', onMainPinMouseDown);
    mainPin.addEventListener('keydown', onMainPinKeyDown);
  };

  var removeErrorPopup = function () {
    var popup = mainPage.querySelector('.error');
    if (popup) {
      var errorButton = popup.querySelector('.error__button');
      errorButton.removeEventListener('click', onErrorButtonClick);
      popup.remove();
    }
    document.removeEventListener('keydown', onErrorPopupKeydown);
    document.removeEventListener('keydown', onErrorPopupClick);
  };

  var onErrorPopupKeydown = function (evt) {
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
      removeErrorPopup();
    }
  };

  var onErrorPopupClick = function () {
    removeErrorPopup();
  };

  var onErrorButtonClick = function () {
    removeErrorPopup();
    document.removeEventListener('keydown', onErrorButtonClick);
  };
  var getError = function (message) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorElement = errorTemplate.cloneNode(true);
    var errorButton = errorElement.querySelector('.error__button');
    errorElement.querySelector('.error__message').textContent = message;
    mainPage.insertBefore(errorElement, mainPage.firstChild);
    errorButton.addEventListener('click', onErrorButtonClick);
    errorElement.addEventListener('click', onErrorPopupClick);
    document.addEventListener('keydown', onErrorPopupKeydown);
  };
  var showSuccess = function () {
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var successElement = successTemplate.cloneNode(true);
    document.addEventListener('keydown', onSuccessPopupKeydown);
    successElement.addEventListener('click', onSuccessPopupClick);
    mainPage.insertBefore(successElement, mainPage.firstChild);
    deactivatePage();
  };
  deactivatePage();
  adAddress.value = getAddress();
  window.page = {
    offerForm: offerForm,
    getError: getError,
    showSuccess: showSuccess
  };
})();

