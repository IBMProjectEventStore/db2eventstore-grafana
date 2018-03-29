'use strict';

System.register(['lodash'], function (_export, _context) {
  "use strict";

  var _, _createClass, EventStoreDatasource;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
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

      _export('EventStoreDatasource', EventStoreDatasource = function () {
        function EventStoreDatasource(instanceSettings, $q, backendSrv, templateSrv) {
          _classCallCheck(this, EventStoreDatasource);

          var api = 'com/ibm/event/api/v1';
          var namespace = api + '/grafana';
          var databaseField = '?databaseName=';

          /**
           * Capture the settings information from the Data Source panel
           */
          if (instanceSettings !== undefined) {
            this.databaseParameter = databaseField + instanceSettings.jsonData.databases[instanceSettings.jsonData.selectedDatabase].name;
            this.securityToken = instanceSettings.jsonData.securityToken;
            this.type = instanceSettings.type;
            if (_.endsWith(instanceSettings.jsonData.url, '/')) {
              this.grafanaURL = instanceSettings.jsonData.url + namespace;
              this.apiURL = instanceSettings.jsonData.url + api;
            } else {
              this.grafanaURL = instanceSettings.jsonData.url + '/' + namespace;
              this.apiURL = instanceSettings.jsonData.url + '/' + api;
            }
            this.name = instanceSettings.name;
          }

          this.q = $q;
          this.backendSrv = backendSrv;
          this.templateSrv = templateSrv;

          /**
           * Supported header, including the required security token
            */
          this.headers = {
            'Authorization': instanceSettings.jsonData.securityToken,
            'cache-control': 'no-cache',
            'content-type': 'application/json'
          };
        }

        /**
         * Send a query to the REST Server
         */


        _createClass(EventStoreDatasource, [{
          key: 'query',
          value: function query(options) {
            var query = this.buildQueryParameters(options);
            query.targets = query.targets.filter(function (t) {
              return !t.hide;
            });

            if (query.targets.length <= 0 || query.targets[0].refId === undefined) {
              return this.q.when({
                data: []
              });
            }

            return this.doRequest({
              url: this.grafanaURL + '/query' + this.databaseParameter,
              data: query,
              method: 'POST'
            }).then(function (response) {
              return response.data;
            }).catch(function (error) {
              console.log(error);
            });
          }
        }, {
          key: 'testDatasource',
          value: function testDatasource() {
            return this.doRequest({
              url: this.grafanaURL + '/',
              method: 'GET'
            }).then(function (response) {
              if (response.status === 200) {
                return {
                  status: "success",
                  message: "IBM Db2 Event Store Data source is working",
                  title: "Success"
                };
              }
            });
          }
        }, {
          key: 'annotationQuery',
          value: function annotationQuery(options) {
            var query = this.templateSrv.replace(options.annotation.query, {}, 'glob');
            var annotationQuery = {
              range: options.range,
              annotation: {
                name: options.annotation.name,
                datasource: options.annotation.datasource,
                enable: options.annotation.enable,
                iconColor: options.annotation.iconColor,
                query: query
              },
              rangeRaw: options.rangeRaw
            };

            return this.doRequest({
              url: this.url + '/annotations',
              method: 'POST',
              data: annotationQuery
            }).then(function (result) {
              return result.data;
            });
          }
        }, {
          key: 'metricFindQuery',
          value: function metricFindQuery(query) {
            var interpolated = {
              target: this.templateSrv.replace(query, null, 'regex')
            };

            return this.doRequest({
              url: this.url + '/search',
              data: interpolated,
              method: 'POST'
            }).then(this.mapToTextValue);
          }
        }, {
          key: 'metricAPIQuery',
          value: function metricAPIQuery(api, callback, scope, parameter) {
            var queryParameter = this.databaseParameter;
            if (parameter !== undefined) {
              queryParameter += '&' + parameter;
            }
            return this.doRequest({
              url: this.apiURL + api + queryParameter,
              method: 'GET'
            }).then(function (response) {
              callback(response.data.data, scope);
            }).catch(function (error) {
              console.log(error);
            });
          }
        }, {
          key: 'mapToTextValue',
          value: function mapToTextValue(result) {
            return _.map(result.data, function (d, i) {
              if (d && d.text && d.value) {
                return {
                  text: d.text,
                  value: d.value
                };
              } else if (_.isObject(d)) {
                return {
                  text: d,
                  value: i
                };
              }
              return {
                text: d,
                value: d
              };
            });
          }
        }, {
          key: 'doRequest',
          value: function doRequest(options) {
            options.withCredentials = this.withCredentials;
            options.headers = this.headers;

            return this.backendSrv.datasourceRequest(options);
          }
        }, {
          key: 'buildQueryParameters',
          value: function buildQueryParameters(options) {
            var _this = this;

            var targets = _.map(options.targets, function (target) {
              return {
                target: _this.templateSrv.replace(target.target, options.scopedVars, 'regex'),
                refId: target.refId,
                select: target.selectedColumn,
                from: target.selectedTable,
                selectedTable: target.selectedTable,
                equalPredicate: target.equalPredicate,
                equalPredicateValue: target.equalPredicateValue,
                ts: target.selectedTimestamp,
                readOption: target.readOption,
                queryType: target.type || 'timeseries'
              };
            });

            options.targets = targets;

            return options;
          }
        }]);

        return EventStoreDatasource;
      }());

      _export('EventStoreDatasource', EventStoreDatasource);
    }
  };
});
//# sourceMappingURL=datasource.js.map
