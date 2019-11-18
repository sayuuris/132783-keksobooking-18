'use strict';
(function () {
  var NUMBER_ROOMS_NOT_FOR_GUESTS = 100;
  var CAPACITY_NOT_FOR_GUESTS = 0;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var DEFAULT_AVATAR_SRC = 'img/muffin-grey.svg';

  var offerForm = document.querySelector('.ad-form');
  var avatarPreview = offerForm.querySelector('.ad-form-header__preview img');
  var adPreview = offerForm.querySelector('.ad-form__photo');
  var avatar = offerForm.querySelector('#avatar');
  var images = offerForm.querySelector('#images');

  var capacity = offerForm.querySelector('#capacity');
  var rooms = offerForm.querySelector('#room_number');
  var price = offerForm.querySelector('#price');
  var type = offerForm.querySelector('#type');
  var timeInField = offerForm.querySelector('select[name="timein"]');
  var timeOutField = offerForm.querySelector('select[name="timeout"]');

  var resetPreview = function () {
    avatarPreview.src = DEFAULT_AVATAR_SRC;
    var image = adPreview.querySelector('img');
    if (image) {
      image.remove();
    }
  };

  var showPreview = function (input, preview) {
    var file = input.files[0];
    var fileName = file.name.toLocaleLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        preview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  avatar.addEventListener('change', function () {
    showPreview(avatar, avatarPreview);
  });

  images.addEventListener('change', function () {
    var preview = adPreview.querySelector('img');
    if (!preview) {
      preview = document.createElement('img');
      preview.style.width = '100%';
      adPreview.appendChild(preview);
    }
    showPreview(images, preview);
  });

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
  offerForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    validateCapacity();
    if (evt.currentTarget.checkValidity()) {
      window.backend.save(new FormData(offerForm), window.page.showSuccess, window.page.getError);
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
  window.form = {
    resetPreview: resetPreview
  };
})();
