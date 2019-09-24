'use strict';


var OFFER_AMOUNT = 8;
var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_ROOMS = [1, 2, 3, 4];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var avatar = {
  WIDTH: 50,
  HEIGHT: 70
};
var locationCoordinates = {
  X_MIN: 40,
  X_MAX: 1220,
  Y_MIN: 0,
  Y_MAX: 730
};
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomArrFromParent = function (parentArray) {
  return parentArray.filter(function () {
    return getRandomInt(0, 1);
  });
};

var activateElem = function (elem, className) {
  elem.classList.remove(className);
};


var getOffers = function () {
  var result = [];
  var randomLocationX = 0;
  var randomLocationY = 0;
  for (var i = 1; i <= OFFER_AMOUNT; i++) {
    randomLocationX = getRandomInt(locationCoordinates.X_MIN, locationCoordinates.X_MAX);
    randomLocationY = getRandomInt(locationCoordinates.Y_MIN, locationCoordinates.Y_MAX);
    result.push({
      author: {
        'avatar': 'img/avatars/user0' + i + '.png'
      },
      offer: {
        title: 'заголовок предложения',
        address: randomLocationX + ',' + randomLocationY,
        price: getRandomInt(5000, 100000),
        type: OFFER_TYPE[getRandomInt(0, 3)],
        rooms: OFFER_ROOMS[getRandomInt(0, 3)],
        guests: getRandomInt(0, 3),
        checkin: '1' + getRandomInt(2, 4) + ':00',
        checkout: '1' + getRandomInt(2, 4) + ':00',
        features: getRandomArrFromParent(OFFER_FEATURES),
        description: 'строка с описанием',
        photos: getRandomArrFromParent(OFFER_PHOTOS)
      },
      location: {
        x: randomLocationX,
        y: randomLocationY
      }
    });
  }
  return result;
};

var mapElem = document.querySelector('.map');
activateElem(mapElem, 'map--faded');

var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

var renderPinFromTemplate = function (offersData) {
  var pinElem = pinTemplate.cloneNode(true);
  pinElem.style.left = (offersData.location.x - avatar.WIDTH / 2) + 'px';
  pinElem.style.top = (offersData.location.y - avatar.HEIGHT) + 'px';
  var pinImgElem = pinElem.querySelector('img');
  pinImgElem.src = offersData.author.avatar;
  pinImgElem.alt = offersData.offer.title;
  return pinElem;

};

var renderPins = function (offersData) {
  var result = document.createDocumentFragment();
  for (var i = 0; i < offersData.length; i++) {
    result.appendChild(renderPinFromTemplate(offersData[i]));
  }
  return result;

};

var pinContainerElem = mapElem.querySelector('.map__pins');
pinContainerElem.appendChild(renderPins(getOffers()));

