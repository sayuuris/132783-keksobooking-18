'use strict';

/*
/* var OFFER_AMOUNT = 8;
var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_ROOMS = [1, 2, 3, 100];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
/* var avatar = {
  WIDTH: 50,
  HEIGHT: 70
}; */
var centralPin = {
  WIDTH: 100,
  HEIGHT: 100,
  NIDDLE: 20
};
var ENTER_KEYCODE = 13;

/* var locationCoordinates = {
  X_MIN: 40,
  X_MAX: 1220,
  Y_MIN: 0,
  Y_MAX: 730
};  */
/* var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
/*
var getRandomArrFromParent = function (parentArray) {
  return parentArray.filter(function () {
    return getRandomInt(0, 1);
  });
}; */

/* var activateElem = function (elem, className) {
  elem.classList.remove(className);
}; */

// var deactivateElem = function (elem, className) {
// elem.classList.add(className);
// };

/* var getOffers = function () {
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
}; */

var mapElem = document.querySelector('.map');
var OfferForm = document.querySelector('.ad-form');

var getAddress = function () {
  var peak = mapElem.classList.contains('map--faded') ? 0 : centralPin.NIDDLE;
  var x = Math.round(parseInt(mainPin.style.left, 10) + centralPin.HEIGHT / 2);
  var y = Math.round(parseInt(mainPin.style.top, 10) + centralPin.WIDTH / 2 + peak);
  return x + ', ' + y;
};

var adAddress = OfferForm.querySelector('#address');
var filterForm = document.querySelector('.map__filters');
var activatePage = function () {
  mapElem.classList.remove('map--faded');
  OfferForm.classList.remove('ad-form--disabled');
  var formElements = OfferForm.querySelectorAll('.ad-form__element');
  formElements.forEach(function (item) {
    item.disabled = false;
  });
  var featuresElement = filterForm.querySelector('.map__features');
  featuresElement.disabled = false;
  adAddress.value = getAddress();
};
var deactivatePage = function () {
  mapElem.classList.add('map--faded');
  OfferForm.classList.add('ad-form--disabled');
  var formElements = OfferForm.querySelectorAll('.ad-form__element');
  formElements.forEach(function (item) {
    item.disabled = true;
  });
  var featuresElement = filterForm.querySelector('.map__features');
  featuresElement.disabled = true;
  adAddress.value = getAddress();
};

var mainPin = document.querySelector('.map__pin--main');
mainPin.addEventListener('mousedown', function () {
  activatePage();
});
mainPin.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    activatePage();
  }
});
var validateRoomsNumber = function () {
  var roomsCapacityMap = {
    '1': {
      'guests': ['1'],
      'errorText': '1 комната для 1 гостя'
    },
    '2': {
      'guests': ['1', '2'],
      'errorText': '2 комнаты для 1 или 2 гостей'
    },
    '3': {
      'guests': ['1', '2', '3'],
      'errorText': '3 комнаты для 1, 2 или 3 гостей'
    },
    '100': {
      'guests': ['0'],
      'errorText': '100 комнат не для гостей'
    },
  };
  var roomsSelect = document.querySelector('[name="rooms"]');
  var rooms = roomsSelect.value;
  var guests = document.querySelector('[name= "capacity"]').value;
  roomsSelect.setCustomValidity(roomsCapacityMap[rooms].guests.includes(guests) ? '' : roomsCapacityMap[rooms].errorText);
};
OfferForm.addEventListener('submit', function (evt) {
  evt.preventDefault();
  validateRoomsNumber();
  if (evt.currentTarget.checkValidity()) {
    evt.currentTarget.submit();
  }
  evt.currentTarget.reportValidity();
});


/* var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

/* var renderPinFromTemplate = function (offersData) {
  var pinElem = pinTemplate.cloneNode(true);
  pinElem.style.left = (offersData.location.x - avatar.WIDTH / 2) + 'px';
  pinElem.style.top = (offersData.location.y - avatar.HEIGHT) + 'px';
  var pinImgElem = pinElem.querySelector('img');
  pinImgElem.src = offersData.author.avatar;
  pinImgElem.alt = offersData.offer.title;
  return pinElem;

}; */
/* var renderPins = function (offersData) {
  var result = document.createDocumentFragment();
  for (var i = 0; i < offersData.length; i++) {
    result.appendChild(renderPinFromTemplate(offersData[i]));
  }
  return result;

}; */

// var pinContainerElem = mapElem.querySelector('.map__pins');
// pinContainerElem.appendChild(renderPins(getOffers()));


/* var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');

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
}; */

/* var addFacilitiesToOffers = function (facilities) {
  var FacilitiesToOffers = document.createDocumentFragment();

  for (var i = 0; i < facilities.length; i++) {
    var FacilityToOffers = document.createElement('li');
    FacilityToOffers.classList.add('popup__feature', 'popup__feature--' + facilities[i]);

    FacilitiesToOffers.appendChild(FacilityToOffers);
  }
  return FacilitiesToOffers;
};
 */
/* var renderCardFromTemplate = function (offersData) {
  var cardElem = cardTemplate.cloneNode(true);
  var cardPhotoTemplate = cardElem.querySelector('.popup__photo');
  cardElem.querySelector('.popup__title').textContent = offersData.offer.title;
  cardElem.querySelector('.popup__text--address').textContent = offersData.offer.address;
  cardElem.querySelector('.popup__text--price').innerHTML = offersData.offer.price + '&#8381;' + '/ночь';
  cardElem.querySelector('.popup__type').textContent = getRusApartamentType(offersData.offer.type);
  cardElem.querySelector('.popup__text--capacity').textContent = offersData.offer.rooms + ' комнаты для ' + offersData.offer.guests + ' гостей';
  cardElem.querySelector('.popup__text--time').textContent = 'Заезд после ' + offersData.offer.checkin + ', выезд до ' + offersData.offer.checkout;
  cardElem.querySelector('.popup__features').innerHTML = '';
  cardElem.querySelector('.popup__features').appendChild(addFacilitiesToOffers(offersData.offer.features));
  cardElem.querySelector('.popup__description').textContent = offersData.offer.description;
  cardElem.querySelector('.popup__photos').innerHTML = '';
  cardElem.querySelector('.popup__avatar').setAttribute('src', offersData.author.avatar);

  for (var i = 0; i < offersData.offer.photos.length; i++) {
    var photo = cardPhotoTemplate.cloneNode(true);
    photo.src = offersData.offer.photos[i];
    cardElem.querySelector('.popup__photos').appendChild(photo);
  }
  return cardElem; */

/* }; */
/* var mapFilter = document.querySelector('.map__filters-container');
/* var renderCard = function (offersData) {

  var result = document.createDocumentFragment();
  result.appendChild(renderCardFromTemplate(offersData[0]));
  return mapElem.insertBefore(result, mapFilter);
}; */
// pinContainerElem.appendChild(renderCard(getOffers())); */
deactivatePage();
