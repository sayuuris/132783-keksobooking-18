'use strict';
(function () {
  var NUMBER_ROOMS_NOT_FOR_GUESTS = 100;
  var CAPACITY_NOT_FOR_GUESTS = 0;
  var capacity = window.page.offerForm.querySelector('#capacity');
  var rooms = window.page.offerForm.querySelector('#room_number');
  var price = window.page.offerForm.querySelector('#price');
  var type = window.page.offerForm.querySelector('#type');
  var timeInField = window.page.offerForm.querySelector('select[name="timein"]');
  var timeOutField = window.page.offerForm.querySelector('select[name="timeout"]');
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
  window.page.offerForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    validateCapacity();
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
  var onTypeChange = function () {
    var minPrice = window.map.OFFER_TYPE_MAP[type.value];
    price.placeholder = minPrice;
    price.min = minPrice;
  };
  type.addEventListener('change', onTypeChange);
  onTypeChange();
  timeInField.addEventListener('change', function () {
    timeOutField.value = timeInField.value;
  });
  timeOutField.addEventListener('change', function () {
    timeInField.value = timeOutField.value;
  });

})();
