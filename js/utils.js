'use strict';
(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500;

  var getRusApartamentType = function (engApartamentType) {
    switch (engApartamentType) {
      case 'flat':
        return 'Квартира';
      case 'bungalo':
        return 'Бунгало';
      case 'house':
        return 'Дом';
      case 'palace':
        return 'Дворец';
      default:
        return engApartamentType;
    }
  };
  var getEndingWordRoom = function (number) {
    var ending = '';
    if ((number < 10 || number > 20) && number % 10 === 1) {
      ending = 'а';
    } else if ((number < 10 || number > 20) && (number % 10 === 2 || number % 10 === 3 || number % 10 === 4)) {
      ending = 'ы';
    }
    return ending;
  };
  var debounce = function (cb) {
    var lastTimeout = null;
    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.utils = {
    ENTER_KEYCODE: ENTER_KEYCODE,
    ESC_KEYCODE: ESC_KEYCODE,
    getRusApartamentType: getRusApartamentType,
    getEndingWordRoom: getEndingWordRoom,
    debounce: debounce
  };
})();
