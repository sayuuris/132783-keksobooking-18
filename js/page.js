'use strict';
(function () {
  var OFFER_AMOUNT = 8;
  var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var OFFER_ROOMS = [1, 2, 3, 100];
  var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var mainPin = window.map.mapElem.querySelector('.map__pin--main');
  var offerForm = document.querySelector('.ad-form');
  var adAddress = offerForm.querySelector('#address');
  var filterForm = document.querySelector('.map__filters');
  var centralPin = {
    WIDTH: 65,
    HEIGHT: 65,
    NIDDLE: 20
  };

  var locationCoordinates = {
    X_MIN: 40,
    X_MAX: 1220,
    Y_MIN: 130,
    Y_MAX: 630
  };

  var getOffers = function () {
    var result = [];
    var randomLocationX = 0;
    var randomLocationY = 0;
    for (var i = 1; i <= OFFER_AMOUNT; i++) {
      randomLocationX = window.utils.getRandomInt(locationCoordinates.X_MIN, locationCoordinates.X_MAX);
      randomLocationY = window.utils.getRandomInt(locationCoordinates.Y_MIN, locationCoordinates.Y_MAX);
      result.push({
        author: {
          'avatar': 'img/avatars/user0' + i + '.png'
        },
        offer: {
          title: 'заголовок предложения',
          address: randomLocationX + ',' + randomLocationY,
          price: window.utils.getRandomInt(5000, 100000),
          type: OFFER_TYPE[window.utils.getRandomInt(0, 3)],
          rooms: OFFER_ROOMS[window.utils.getRandomInt(0, 3)],
          guests: window.utils.getRandomInt(0, 3),
          checkin: '1' + window.utils.getRandomInt(2, 4) + ':00',
          checkout: '1' + window.utils.getRandomInt(2, 4) + ':00',
          features: window.utils.getRandomArrFromParent(OFFER_FEATURES),
          description: 'строка с описанием',
          photos: window.utils.getRandomArrFromParent(OFFER_PHOTOS)
        },
        location: {
          x: randomLocationX,
          y: randomLocationY
        }
      });
    }
    return result;
  };
  var getAddress = function () {
    var peak = window.map.mapElem.classList.contains('map--faded') ? 0 : centralPin.WIDTH;
    var x = Math.round(parseInt(mainPin.style.left, 10) + centralPin.HEIGHT / 2);
    var y = Math.round(parseInt(mainPin.style.top, 10) + centralPin.WIDTH / 2 + peak);
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
      if (mainPin.offsetTop - shift.y > window.map.MAP_Y_RANGE.min - window.map.avatar.HEIGHT && mainPin.offsetTop - shift.y < window.map.MAP_Y_RANGE.max) {
        mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      }
      if (mainPin.offsetLeft - shift.x > window.map.MAP_X_RANGE.min - centralPin.WIDTH / 2 && mainPin.offsetLeft - shift.x < window.map.MAP_X_RANGE.max - centralPin.WIDTH / 2) {
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
    var offers = getOffers();
    window.map.mapElem.classList.remove('map--faded');
    offerForm.classList.remove('ad-form--disabled');
    var formElements = offerForm.querySelectorAll('.ad-form__element');
    var pinContainerElem = window.map.mapElem.querySelector('.map__pins');
    pinContainerElem.appendChild(window.map.renderPins(offers));
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
    adAddress.value = getAddress();
  };

  deactivatePage();
  adAddress.value = getAddress();
  window.page = {
    offerForm: offerForm,
  };
})();

