'use strict';
(function () {
  var filter = document.querySelector('.map__filters');
  var filterType = filter.querySelector('#housing-type');

  var filterByType = function (item) {
    return filterType.value === 'any' || item.offer.type === filterType.value;
  };
  var filterOffers = function (offersData) {
    return offersData.filter(function (item) {
      return item.offer && filterByType(item.offer.type);
    });
  };

  /* var updatePins = function () {
    window.map.removePopup();
    window.map.removePins();
    window.map.renderPinFromTemplate(filterOffers(window.map.ads));
  };
  filter.addEventListener('change', window.utils.debounce(updatePins)); */
  window.filter = {
    filterOffers: filterOffers
  };
})();
