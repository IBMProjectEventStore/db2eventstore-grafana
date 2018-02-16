import _ from "lodash";

export class EventStoreDatasource {

  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    var api = 'com/ibm/event/api/v1';
    var namespace = api + '/grafana';
    var databaseField = '?databaseName=';

    /**
     * Capture the settings information from the Data Source panel
     */
    if (instanceSettings !== undefined) {
      this.databaseParameter = databaseField + instanceSettings.jsonData.selectedDatabase;
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
    this.headers = {
      'Authorization': instanceSettings.jsonData.securityToken,
      'cache-control': 'no-cache',
      'content-type': 'application/json'
    };
  }

  /**
   * Send a query to the REST Server
   */
  query(options) {
    var query = this.buildQueryParameters(options);
    query.targets = query.targets.filter(t => !t.hide);

    if (query.targets.length <= 0 || query.targets[0].refId === undefined) {
      return this.q.when({
        data: []
      });
    }

    return this.doRequest({
      url: this.grafanaURL + '/query' + this.databaseParameter,
      data: query,
      method: 'POST'
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  /**
   * Test Connection
   */
  testDatasource() {
    return this.doRequest({
      url: this.grafanaURL + '/',
      method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        return {
          status: "success",
          message: "IBM Db2 Event Store Data source is working",
          title: "Success"
        };
      }
    });
  }

  annotationQuery(options) {
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
    }).then(result => {
      return result.data;
    });
  }

  metricFindQuery(query) {
    var interpolated = {
      target: this.templateSrv.replace(query, null, 'regex')
    };

    return this.doRequest({
      url: this.url + '/search',
      data: interpolated,
      method: 'POST',
    }).then(this.mapToTextValue);
  }

  /**
   * Common API to get all information from IBM Db2 Event Store
   */
  metricAPIQuery(api, callback, scope, parameter) {
    var queryParameter = this.databaseParameter;
    if (parameter !== undefined) {
      queryParameter += '&' + parameter;
    }
    return this.doRequest({
      url: this.apiURL + api + queryParameter,
      method: 'GET',
    })
    .then(function (response) {
      callback(response.data.data, scope);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  mapToTextValue(result) {
    return _.map(result.data, (d, i) => {
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

  doRequest(options) {
    options.withCredentials = this.withCredentials;
    options.headers = this.headers;

    return this.backendSrv.datasourceRequest(options);
  }

  buildQueryParameters(options) {
    //remove placeholder targets
  //  options.targets = _.filter(options.targets, target => {
  //    return target.target !== 'select metric';
  //  });

    var targets = _.map(options.targets, target => {
      return {
        target: this.templateSrv.replace(target.target, options.scopedVars, 'regex'),
        refId: target.refId,
        select: target.selectedColumn,
        from: target.selectedTable,
        selectedTable: target.selectedTable,
        ts: target.selectedTimestamp,
        readOption: target.readOption,
        queryType: target.type || 'timeseries'
      };
    });

    options.targets = targets;

    return options;
  }
}
