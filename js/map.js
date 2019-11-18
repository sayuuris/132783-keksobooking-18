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
  var Avatar = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var MapRangeX = {
    MIN: 0,
    MAX: mapElem.clientWidth
  };
  var MapRangeY = {
    MIN: 130,
    MAX: 630
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
    pinElem.style.left = (offerData.location.x - Avatar.WIDTH / 2) + 'px';

    pinElem.style.top = (offerData.location.y - Avatar.HEIGHT) + 'px';
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
    var title = cardElem.querySelector('.popup__title');
    var address = cardElem.querySelector('.popup__text--address');
    var price = cardElem.querySelector('.popup__text--price');
    var type = cardElem.querySelector('.popup__type');
    var capacity = cardElem.querySelector('.popup__text--capacity');
    var time = cardElem.querySelector('.popup__text--time');
    var features = cardElem.querySelector('.popup__features');
    var description = cardElem.querySelector('.popup__description');
    var avatar = cardElem.querySelector('.popup__avatar');
    var photos = cardElem.querySelector('.popup__photos');

    if (!offerData.offer.title) {
      title.classList.add('visually-hidden');
    } else {
      title.textContent = offerData.offer.title;
    }
    if (!offerData.offer.address) {
      address.classList.add('visually-hidden');
    } else {
      address.textContent = offerData.offer.address;
    }
    if (!offerData.offer.price) {
      price.classList.add('visually-hidden');
    } else {
      price.innerHTML = offerData.offer.price + '&#8381;' + '/ночь';
    }
    if (!offerData.offer.type) {
      type.classList.add('visually-hidden');
    } else {
      type.textContent = window.utils.getRusApartamentType(offerData.offer.type);
    }
    if (!offerData.offer.rooms || !offerData.offer.guests) {
      capacity.classList.add('visually-hidden');
    } else {
      capacity.textContent = offerData.offer.rooms + ' комнат' + window.utils.getEndingWordRoom(offerData.offer.rooms) + ' для ' + offerData.offer.guests + ' гост' + ((offerData.offer.guests === 1) ? 'я' : 'ей');
    }
    if (!offerData.offer.checkin || !offerData.offer.checkout) {
      time.classList.add('visually-hidden');
    } else {
      time.textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;
    }
    if (!offerData.offer.features) {
      features.classList.add('visually-hidden');
    } else {
      features.innerHTML = '';
      features.appendChild(addFacilitiesToOffers(offerData.offer.features));
    }
    if (!offerData.offer.description) {
      description.classList.add('visually-hidden');
    } else {
      description.textContent = offerData.offer.description;
    }
    if (!offerData.author.avatar) {
      avatar.classList.add('visually-hidden');
    } else {
      avatar.src = offerData.author.avatar;
    }
    if (!offerData.offer.photos) {
      photos.classList.add('visually-hidden');
    } else {
      photos.innerHTML = '';
      for (var i = 0; i < offerData.offer.photos.length; i++) {
        var photo = document.createElement('img');
        photo.classList.add('popup__photo');
        photo.src = offerData.offer.photos[i];
        photo.width = '45';
        photo.height = '40';
        photos.appendChild(photo);
      }
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
    MapRangeX: MapRangeX,
    MapRangeY: MapRangeY,
    Avatar: Avatar,
    renderPinFromTemplate: renderPinFromTemplate,
    filteredPins: filteredPins,
  };
})();
