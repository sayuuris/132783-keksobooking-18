'use strict';
(function () {
  var GET_ADS_URL = 'https://js.dump.academy/keksobooking/data';
  var POST_ADS_URL = 'https://js.dump.academy/keksobooking';
  var XHR_TIMEOUT = 10000;
  var HTTP_SUCCESS_CODE = 200;

  var sendRequest = function (data, onSuccess, onError) {
    console.log(onError);

    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

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
    if (data) {
      xhr.open('POST', POST_ADS_URL);
      xhr.send(data);
    } else {
      xhr.open('GET', GET_ADS_URL);
      xhr.send();
    }
  };
  window.backend = {
    sendRequest: sendRequest
  };
})();
