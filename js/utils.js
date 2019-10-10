'use strict';
(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  var getRandomArrFromParent = function (parentArray) {
    return parentArray.filter(function () {
      return getRandomInt(0, 1);
    });
  };
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
  window.utils = {
    ENTER_KEYCODE: ENTER_KEYCODE,
    ESC_KEYCODE: ESC_KEYCODE,
    getRandomInt: getRandomInt,
    getRandomArrFromParent: getRandomArrFromParent,
    getRusApartamentType: getRusApartamentType,
    getEndingWordRoom: getEndingWordRoom
  };
})();
