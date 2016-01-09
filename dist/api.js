'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API = function () {
    function API() {
        _classCallCheck(this, API);

        this.rootUrl = 'http://politicos.olhoneles.org/api/v0';
    }

    _createClass(API, [{
        key: 'getLegislators',
        value: function getLegislators(term) {
            return this.ajax('legislators/?name__istartswith=' + term);
        }
    }, {
        key: 'getLegislatorById',
        value: function getLegislatorById(id) {
            return this.ajax('legislators/' + id + '/');
        }
    }, {
        key: 'ajax',
        value: function ajax(path) {
            var _this = this;

            var promisse = new Promise(function (accept, reject) {
                var fullUrl = _this.rootUrl + '/' + path;

                var request = new XMLHttpRequest();
                request.open('GET', fullUrl, true);
                request.setRequestHeader('Content-Type', 'application/json');
                request.onload = function () {
                    if (request.status >= 200 && request.status < 400) {
                        var data = JSON.parse(request.responseText);
                        accept(data);
                    } else {
                        reject();
                    }
                };

                request.onerror = function () {
                    reject();
                };

                request.send();
            });

            return promisse;
        }
    }]);

    return API;
}();