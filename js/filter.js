'use strict';
(function () {
  var filter = document.querySelector('.map__filters');
  var filterType = filter.querySelector('#housing-type');
  /* var filterPrice = filter.querySelector('#housing-price'); */
  var filterRoom = filter.querySelector('#housing-rooms');
  /* var filterGuest = filter.querySelector('#housing-guests'); */


  var filterByType = function (offerType) {
    return filterType.value === 'any' || offerType === filterType.value;
  };
  var filterByRooms = function (offerRoom) {
    var offerRoomValue = filterRoom.value === 'any' ? 'any' : parseInt(filterRoom.value, 10);
    return offerRoomValue === 'any' || offerRoom === offerRoomValue;
  };

  var filterOffers = function (offersData) {
    return offersData.filter(function (item) {
      return item.offer && filterByType(item.offer.type) && filterByRooms(item.offer.rooms);
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
