'use strict';

var OFFER_AMOUNT = 8;
var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var OFFER_TYPE_MAP = {
  'palace': {
    'minPrice': 10000,
  },
  'house': {
    'minPrice': 5000,
  },
  'flat': {
    'minPrice': 1000,
  },
  'bungalo': {
    'minPrice': 0,
  },
};
var OFFER_ROOMS = [1, 2, 3, 100];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var avatar = {
  WIDTH: 50,
  HEIGHT: 70
};

var centralPin = {
  WIDTH: 100,
  HEIGHT: 100,
  NIDDLE: 20
};
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;
var NUMBER_ROOMS_NOT_FOR_GUESTS = 100;
var CAPACITY_NOT_FOR_GUESTS = 0;

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
var offerForm = document.querySelector('.ad-form');
var filterForm = document.querySelector('.map__filters');
var adAddress = offerForm.querySelector('#address');
var capacity = offerForm.querySelector('#capacity');
var rooms = offerForm.querySelector('#room_number');
var mainPin = mapElem.querySelector('.map__pin--main');
var price = offerForm.querySelector('#price');
var type = offerForm.querySelector('#type');
var validateCapacity = function () {
  var roomsVal = parseInt(rooms.value, 10);
  var capacityVal = parseInt(capacity.value, 10);

  if (roomsVal === NUMBER_ROOMS_NOT_FOR_GUESTS && capacityVal === CAPACITY_NOT_FOR_GUESTS ||
    roomsVal !== NUMBER_ROOMS_NOT_FOR_GUESTS && capacityVal !== CAPACITY_NOT_FOR_GUESTS &&
    roomsVal >= capacity.value) {
    capacity.setCustomValidity('');
    return;
  }

  capacity.setCustomValidity('Количество гостей должно быть меньше или равно количеству комнат. 100 комнат не для гостей');
};
var getAddress = function () {
  var peak = mapElem.classList.contains('map--faded') ? 0 : centralPin.WIDTH;
  var x = Math.round(parseInt(mainPin.style.left, 10) + centralPin.HEIGHT / 2);
  var y = Math.round(parseInt(mainPin.style.top, 10) + centralPin.WIDTH / 2 + peak);
  return x + ', ' + y;
};
var activatePage = function () {
  var offers = getOffers();
  mapElem.classList.remove('map--faded');
  offerForm.classList.remove('ad-form--disabled');
  var formElements = offerForm.querySelectorAll('.ad-form__element');
  var pinContainerElem = mapElem.querySelector('.map__pins');
  pinContainerElem.appendChild(renderPins(offers));
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
  mapElem.classList.add('map--faded');
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

var onMainPinMouseDown = function () {
  activatePage();
};
var onMainPinKeyDown = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    activatePage();
  }
};
mainPin.addEventListener('mousedown', onMainPinMouseDown);

offerForm.addEventListener('submit', function (evt) {
  evt.preventDefault();
  validateCapacity();
  validatePrice();
  if (evt.currentTarget.checkValidity()) {
    evt.currentTarget.submit();
  }
  evt.currentTarget.reportValidity();
});

rooms.addEventListener('change', function () {
  validateCapacity();
});

capacity.addEventListener('change', function () {
  validateCapacity();
});

mainPin.addEventListener('keydown', onMainPinKeyDown);
deactivatePage();
adAddress.value = getAddress();

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
    var renderedPin = renderPinFromTemplate(offersData[i]);
    (function () {
      var data = offersData[i];
      renderedPin.addEventListener('click', function () {
        closeCard();
        renderCard(data);
      });
      renderedPin.addEventListener('keydown', function () {
        closeCard();
        renderCard(data);
      });
    })();
    result.appendChild(renderedPin);
  }
  return result;

};

var cardTemplate = document.querySelector('#card')
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
};
var validatePrice = function () {
  var priceVal = parseInt(price.value, 10);
  var minPrice = OFFER_TYPE_MAP[type.value].minPrice;
  price.setAttribute('placeholder', minPrice);
  if (price.validity.valueMissing) {
    price.setCustomValidity('Обязятельное поле');
  } else if (priceVal >= minPrice) {
    price.setCustomValidity('');
  } else {
    price.setCustomValidity('Минимальная цена за ночь ' + minPrice);
  }
};
type.addEventListener('change', function () {
  validatePrice();
});

var addFacilitiesToOffers = function (facilities) {
  var FacilitiesToOffers = document.createDocumentFragment();

  for (var i = 0; i < facilities.length; i++) {
    var FacilityToOffers = document.createElement('li');
    FacilityToOffers.classList.add('popup__feature', 'popup__feature--' + facilities[i]);

    FacilitiesToOffers.appendChild(FacilityToOffers);
  }
  return FacilitiesToOffers;
};

var renderCardFromTemplate = function (offerData) {
  var cardElem = cardTemplate.cloneNode(true);
  var cardPhotoTemplate = cardElem.querySelector('.popup__photo');
  cardElem.querySelector('.popup__title').textContent = offerData.offer.title;
  cardElem.querySelector('.popup__text--address').textContent = offerData.offer.address;
  cardElem.querySelector('.popup__text--price').innerHTML = offerData.offer.price + '&#8381;' + '/ночь';
  cardElem.querySelector('.popup__type').textContent = getRusApartamentType(offerData.offer.type);
  cardElem.querySelector('.popup__text--capacity').textContent = offerData.offer.rooms + ' комнат' + getEndingWordRoom(offerData.offer.rooms) + ' для ' + offerData.offer.guests + ' гост' + ((offerData.offer.guests === 1) ? 'я' : 'ей');
  cardElem.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
  cardElem.querySelector('.popup__features').innerHTML = '';
  cardElem.querySelector('.popup__features').appendChild(addFacilitiesToOffers(offerData.offer.features));
  cardElem.querySelector('.popup__description').textContent = offerData.offer.description;
  cardElem.querySelector('.popup__photos').innerHTML = '';
  cardElem.querySelector('.popup__avatar').setAttribute('src', offerData.author.avatar);

  for (var i = 0; i < offerData.offer.photos.length; i++) {
    var photo = cardPhotoTemplate.cloneNode(true);
    photo.src = offerData.offer.photos[i];
    cardElem.querySelector('.popup__photos').appendChild(photo);
  }
  var closeBtn = cardElem.querySelector('.popup__close');
  closeBtn.addEventListener('click', function () {
    closeCard();
  });
  return cardElem;
};
var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeCard();
  }
};
document.addEventListener('keydown', onPopupEscPress);
var closeCard = function () {
  var popup = mapElem.querySelector('.popup');
  if (popup) {
    popup.remove();
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
var timeInField = offerForm.querySelector('select[name="timein"]');
var timeOutField = offerForm.querySelector('select[name="timeout"]');

timeInField.addEventListener('change', function () {
  timeOutField.value = timeInField.value;
});

timeOutField.addEventListener('change', function () {
  timeInField.value = timeOutField.value;
});

var mapFilter = document.querySelector('.map__filters-container');
var renderCard = function (offerData) {
  return mapElem.insertBefore(renderCardFromTemplate(offerData), mapFilter);
};

