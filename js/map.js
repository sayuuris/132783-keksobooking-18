'use strict';
(function () {
  var mapElem = document.querySelector('.map');
  var MAX_PINS = 5;
  var OFFER_TYPE_MAP = {
    'palace': 10000,
    'house': 5000,
    'flat': 1000,
    'bungalo': 0
  };
  var avatar = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var MAP_X_RANGE = {
    min: 0,
    max: mapElem.clientWidth
  };
  var MAP_Y_RANGE = {
    min: 130,
    max: 630
  };

  var mapFilter = document.querySelector('.map__filters-container');
  var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');


  var addFacilitiesToOffers = function (facilities) {
    var facilitiesToOffers = document.createDocumentFragment();
    for (var i = 0; i < facilities.length; i++) {
      var facilityToOffers = document.createElement('li');
      facilityToOffers.classList.add('popup__feature', 'popup__feature--' + facilities[i]);
      facilitiesToOffers.appendChild(facilityToOffers);
    }
    return facilitiesToOffers;
  };


  var renderPinFromTemplate = function (offerData) {
    var pinElem = pinTemplate.cloneNode(true);
    pinElem.style.left = (offerData.location.x - avatar.WIDTH / 2) + 'px';

    pinElem.style.top = (offerData.location.y - avatar.HEIGHT) + 'px';
    var pinImgElem = pinElem.querySelector('img');
    pinImgElem.src = offerData.author.avatar;
    pinImgElem.alt = offerData.offer.title;
    return pinElem;
  };
  var renderCard = function (offerData) {
    return mapElem.insertBefore(renderCardFromTemplate(offerData), mapFilter);
  };
  var renderCardFromTemplate = function (offerData) {
    var cardElem = cardTemplate.cloneNode(true);
    var cardPhotoTemplate = cardElem.querySelector('.popup__photo');
    cardElem.querySelector('.popup__title').textContent = offerData.offer.title;
    cardElem.querySelector('.popup__text--address').textContent = offerData.offer.address;
    cardElem.querySelector('.popup__text--price').innerHTML = offerData.offer.price + '&#8381;' + '/ночь';
    cardElem.querySelector('.popup__type').textContent = window.utils.getRusApartamentType(offerData.offer.type);
    cardElem.querySelector('.popup__text--capacity').textContent = offerData.offer.rooms + ' комнат' + window.utils.getEndingWordRoom(offerData.offer.rooms) + ' для ' + offerData.offer.guests + ' гост' + ((offerData.offer.guests === 1) ? 'я' : 'ей');
    cardElem.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
    cardElem.querySelector('.popup__features').innerHTML = '';
    cardElem.querySelector('.popup__features').appendChild(addFacilitiesToOffers(offerData.offer.features));
    cardElem.querySelector('.popup__description').textContent = offerData.offer.description;
    cardElem.querySelector('.popup__photos').innerHTML = '';
    if (offerData.author.avatar) {
      cardElem.querySelector('.popup__avatar').src = offerData.author.avatar;
    }
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
    if (evt.keyCode === window.utils.ESC_KEYCODE) {
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
  var renderPins = function (offersData) {
    var pinContainerElem = window.map.mapElem.querySelector('.map__pins');
    offersData = offersData.slice(0, MAX_PINS);
    var result = document.createDocumentFragment();
    offersData.forEach(function (offerData) {
      var renderedPin = renderPinFromTemplate(offerData);
      (function () {
        var data = offerData;
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
    });
    pinContainerElem.appendChild(result);
  };
  var filteredPins = function (offersData) {
    window.map.offers = offersData;
    var filteredOffers = window.filter.filterAds(offersData);
    renderPins(filteredOffers);
  };
  var removePins = function () {
    var pinButtons = document.querySelectorAll('.map__pin[type=button]');
    pinButtons.forEach(function (it) {
      it.remove();
    });
  };

  var removePopup = function () {
    var popup = document.querySelector('.popup');
    if (popup) {
      popup.remove();
    }
    var activePin = document.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
  };

  window.map = {
    mapElem: mapElem,
    OFFER_TYPE_MAP: OFFER_TYPE_MAP,
    renderPins: renderPins,
    removePins: removePins,
    removePopup: removePopup,
    MAP_X_RANGE: MAP_X_RANGE,
    MAP_Y_RANGE: MAP_Y_RANGE,
    avatar: avatar,
    renderPinFromTemplate: renderPinFromTemplate,
    filteredPins: filteredPins,
  };
})();
