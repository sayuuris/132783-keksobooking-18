'use strict';
(function () {
  var filter = document.querySelector('.map__filters');
  var filterItems = filter.querySelectorAll('select, input');
  var filterType = filter.querySelector('#housing-type');
  var filterPrice = filter.querySelector('#housing-price');
  var filterRoom = filter.querySelector('#housing-rooms');
  var filterGuest = filter.querySelector('#housing-guests');
  var houseFeatures = document.querySelector('#housing-features');
  var filterFeatureWIFI = houseFeatures.querySelector('#filter-wifi');
  var filterFeatureDishwasher = houseFeatures.querySelector('#filter-dishwasher');
  var filterFeatureParking = houseFeatures.querySelector('#filter-parking');
  var filterFeatureWasher = houseFeatures.querySelector('#filter-washer');
  var filterFeatureElevator = houseFeatures.querySelector('#filter-elevator');
  var filterFeatureConditioner = houseFeatures.querySelector('#filter-conditioner');

  var HousePrice = {
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
    if (offerPrice < HousePrice.LOW.max) {
      return 'low';
    }
    if (offerPrice > HousePrice.HIGH.min) {
      return 'high';
    }
    return 'middle';
  };

  var selectHouseFeatures = function (element, offerFeature) {
    return (offerFeature.offer.features.indexOf(element.value) !== -1) || (!element.checked);
  };

  var filterAds = function (offersData) {
    return offersData.filter(function (item) {
      return item.offer && filterByType(item.offer.type) && filterByRooms(item.offer.rooms) && filterByGuests(item.offer.guests) && filterByPrice(item.offer.price) && selectHouseFeatures(filterFeatureWIFI, item) && selectHouseFeatures(filterFeatureDishwasher, item) && selectHouseFeatures(filterFeatureParking, item) && selectHouseFeatures(filterFeatureWasher, item) && selectHouseFeatures(filterFeatureElevator, item) && selectHouseFeatures(filterFeatureConditioner, item);
    });
  };

  var updatePins = function () {
    window.map.removePopup();
    window.map.removePins();
    window.map.renderPins(filterAds(window.map.offers));
  };
  filter.addEventListener('change', window.utils.debounce(updatePins));

  var deactivateFilter = function () {
    filterItems.forEach(function (it) {

      it.disabled = true;
    });
    filter.reset();
  };

  var activateFilter = function () {
    filterItems.forEach(function (it) {
      it.disabled = false;
    });
  };

  window.filter = {
    filterAds: filterAds,
    activateFilter: activateFilter,
    deactivateFilter: deactivateFilter
  };
})();
