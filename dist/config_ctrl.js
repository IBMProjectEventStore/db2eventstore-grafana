"use strict";

System.register(["lodash", "./axios"], function (_export, _context) {
  "use strict";

  var _, axios, _createClass, EventStoreConfigCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_axios) {
      axios = _axios.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export("EventStoreConfigCtrl", EventStoreConfigCtrl = function () {

        /** @ngInject */
        function EventStoreConfigCtrl($scope) {
          _classCallCheck(this, EventStoreConfigCtrl);

          this.scope = $scope;

          this.current.jsonData = this.current.jsonData || {};
          this.current.jsonData.url = this.current.jsonData.url || "http://localhost:3020";
          this.current.jsonData.user = this.current.jsonData.user || "admin";
          this.current.jsonData.password = this.current.jsonData.password || "password";
          this.current.jsonData.selectedDatabase = this.current.jsonData.selectedDatabase || 0;
          this.current.jsonData.databases = this.current.jsonData.databases || { name: 'Select a Database', value: 0 };
          this.current.jsonData.securityToken = this.current.jsonData.securityToken || null;
          this.current.jsonData.headerConfig = this.current.jsonData.headerConfig || {
            headers: {
              'cache-control': 'no-cache',
              'content-type': 'application/json'
            }
          };
        }

        /**
         * Retrieve the Bearer Token to be used for all further requests with the server
         */


        _createClass(EventStoreConfigCtrl, [{
          key: "_retrieveBearerToken",
          value: function _retrieveBearerToken() {
            var username = this.current.jsonData.user;
            var password = this.current.jsonData.password;
            var url = this.current.jsonData.url;
            var stringToEncode = username + ":" + password;
            var auth = "Basic " + window.btoa(stringToEncode);
            console.log('Getting the Platform Bearer Token');
            console.log('====================================================');
            console.log(url + '/com/ibm/event/api/v1/init/user');

            var data = { username: username, password: password };
            var outerScope = this;

            axios({
              method: 'post',
              url: url + '/com/ibm/event/api/v1/init/user',
              data: data
            }).then(function (response) {
              var token = response.data.token;
              console.log('Token successfully retrieved:');
              console.log('====================================================');
              console.log(token);
              console.log('====================================================');
              console.log('');
              outerScope.current.jsonData.securityToken = 'bearer ' + token;
              outerScope.current.jsonData.headerConfig.headers['Authorization'] = outerScope.current.jsonData.securityToken;
              outerScope._getDatabasesList();
            }).catch(function (error) {
              console.log(error);
            });
          }
        }, {
          key: "_assignBearerToken",
          value: function _assignBearerToken() {
            var outerScope = this;
            outerScope.current.jsonData.securityToken = 'bearer token';
            outerScope.current.jsonData.headerConfig.headers['Authorization'] = outerScope.current.jsonData.securityToken;
            outerScope._getDatabasesList();
          }
        }, {
          key: "_getDatabasesList",
          value: function _getDatabasesList() {
            var outerScope = this;
            axios({
              url: this.current.jsonData.url + '/com/ibm/event/api/v1/oltp/databases',
              method: 'get',
              headers: this.current.jsonData.headerConfig.headers
            }).then(function (response) {
              outerScope.current.jsonData.databases = [];
              var database;
              var count = 0;
              var s = outerScope;
              /**
               * Wrap in scope, in order to make sure ng-options is properly updated, since the Array is directly populated.
               */
              outerScope.scope.$apply(function () {
                for (database in response.data.data) {
                  var db = response.data.data[database];
                  s.current.jsonData.databases.push({ name: db.name, value: count });
                  s.current.jsonData.selectedDatabase = count;
                  count++;
                }
              });
            }).catch(function (error) {
              console.log(error);
            });
          }
        }, {
          key: "populateDatabases",
          value: function populateDatabases() {
            if (_.startsWith(this.current.jsonData.url, 'https')) {
              this._retrieveBearerToken();
            } else {
              this._assignBearerToken();
            }
          }
        }]);

        return EventStoreConfigCtrl;
      }());

      _export("EventStoreConfigCtrl", EventStoreConfigCtrl);

      EventStoreConfigCtrl.templateUrl = 'partials/config.html';
    }
  };
});
//# sourceMappingURL=config_ctrl.js.map
