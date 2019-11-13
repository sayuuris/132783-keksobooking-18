'use strict';
(function () {
  var filter = document.querySelector('.map__filters');
  var filterType = filter.querySelector('#housing-type');
  var filterPrice = filter.querySelector('#housing-price');
  var filterRoom = filter.querySelector('#housing-rooms');
  var filterGuest = filter.querySelector('#housing-guests');
  var housePrice = {
    LOW: {
      max: 10000,
    },
    MIDDLE: {
      min: 10000,
      max: 50000,
    },
    HIGH: {
      min: 50000,
    }
  };

  var filterByType = function (offerType) {
    return filterType.value === 'any' || offerType === filterType.value;
  };
  var filterByGuests = function (offerGuest) {
    var offerGuestValue = filterGuest.value === 'any' ? 'any' : parseInt(filterGuest.value, 10);
    return offerGuestValue === 'any' || offerGuest === offerGuestValue;
  };

  var filterByRooms = function (offerRoom) {
    var offerRoomValue = filterRoom.value === 'any' ? 'any' : parseInt(filterRoom.value, 10);
    return offerRoomValue === 'any' || offerRoom === offerRoomValue;
  };
  var filterByPrice = function (offerPrice) {
    if (filterPrice.value === 'any') {
      return true;
    }
    return filterPrice.value === selectPrice(offerPrice);
  };

  var selectPrice = function (offerPrice) {
    if (offerPrice < housePrice.LOW.max) {
      return 'low';
    }
    if (offerPrice > housePrice.HIGH.min) {
      return 'high';
    }
    return 'middle';
  };
  var filterOffers = function (offersData) {
    return offersData.filter(function (item) {
      return item.offer && filterByType(item.offer.type) && filterByRooms(item.offer.rooms) && filterByGuests(item.offer.guests) && filterByPrice(item.offer.price);
    });
  };

  var updatePins = function () {
    window.map.removePopup();
    window.map.removePins();
    window.map.renderPins(filterOffers(window.map.ads));
  };
  filter.addEventListener('change', window.utils.debounce(updatePins));
  window.filter = {
    filterOffers: filterOffers
  };
})();
