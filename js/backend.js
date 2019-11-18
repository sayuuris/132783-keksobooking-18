'use strict';
(function () {
  var GET_ADS_URL = 'https://js.dump.academy/keksobooking/data';
  var POST_ADS_URL = 'https://js.dump.academy/keksobooking';
  var XHR_TIMEOUT = 10000;
  var HTTP_SUCCESS_CODE = 200;

  var createRequest = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_SUCCESS_CODE) {
        onSuccess(xhr.response);
      } else {
        onError('Упс! Что-то пошло не так!');
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = XHR_TIMEOUT;
    return xhr;
  };
  var load = function (onSuccess, onError) {
    var xhr = createRequest(onSuccess, onError);
    xhr.responseType = 'json';
    xhr.open('GET', GET_ADS_URL);
    xhr.send();
  };

  var save = function (data, onSuccess, onError) {
    var xhr = createRequest(onSuccess, onError);
    xhr.responseType = 'json';
    xhr.open('POST', POST_ADS_URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save,
  };
})();
