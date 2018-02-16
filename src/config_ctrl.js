import _ from "lodash";
import * as axios from './axios';

export class EventStoreConfigCtrl {

  /** @ngInject */
  constructor($scope) {
    this.scope = $scope;

    this.current.jsonData = {};
    this.current.jsonData.url = "http://localhost:3020";
    this.current.jsonData.user = "admin";
    this.current.jsonData.password = "";
    this.current.jsonData.selectedDatabase = "";
    this.current.jsonData.databases = [];

    //TODO -- Need to automatically fetch the security token
    this.current.jsonData.securityToken = "bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6IkFkbWluIiwidWlkIjoiOTk5IiwiaWF0IjoxNTE4NjI4NzcxLCJleHAiOjE1MTg2NzU1NzF9.ZKN5ussntpiHOuVf8_gl_RdA4ikcacXT0nUxh9o90bs4W2xS9SoQru9QRtadaNGBEsxAUzwuXRTsHQFEpUrpQ2n7os8fJv_SOSkcDIXlvifIaF-iqWEtcJ8uptLOZBqURl59mYPexLVVbc8iVzEraEA8uG_Az1_HPxL0RO6ZwZhNvHA16r89aPmYHDNfowS0wyJnj1h3VYkRQao49Nx7amoVsmjRbJc4-O7X5W3eI8M8lNVNh3o7MaoQO1QjGni--Rac4okRPbgVCgUX5kODHBnUzsrpsDt7eAzr4aRrQTciZwMftyC_yAA9SkP80b68qtdGccHET70RD7Q_0wH7AQ";
  }

  /**
   * Retrieve the Bearer Token to be used for all further requests with the server
   */
  retrieveBearerToken() {
    var username = this.current.jsonData.user;
    var password = this.current.jsonData.password;
    var url = this.current.jsonData.url
    var stringToEncode = username + ":" + password
    var auth = "Basic " + window.btoa(stringToEncode);
    console.log('Getting the IDP Bearer Token')
    console.log('====================================================')
    console.log(url + '/v1/preauth/validateAuth')

    var headerConfig = {
      headers: {
        Accept: 'application/json',
        'Authorization': auth
      }
    };

    /*
     * Problem is that browser will first make an OPTIONS request
     * Authorization header forces the extra negotiation
     */
    axios.get(url + '/v1/preauth/validateAuth', headerConfig)
    .then(function (response) {
      var token = JSON.parse(response.data).accessToken
      console.log('Token from Cluster successfully retrieved:')
      console.log('====================================================')
      console.log(token)
      console.log('====================================================')
      console.log('')
      this.current.jsonData.securityToken = 'bearer ' + token;
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  /**
   * Retrieve the list of Databases currently managed by the store
   */
  populateDatabases() {
    // TODO - Fix me
    /*
    if (_.startsWith(this.current.jsonData.url, 'https')) {
      this.retrieveBearerToken();
    }
    */

    // Fetch the current database list
    var headerConfig = {
      headers: {
        'Authorization': this.current.jsonData.securityToken,
        'cache-control': 'no-cache',
        'content-type': 'application/json'
      }
    };
    var outerScope = this;
    axios.get(this.current.jsonData.url + '/com/ibm/event/api/v1/oltp/databases', headerConfig)
    .then(function (response) {
      outerScope.current.jsonData.databases = [];
      var database;
      for (database in response.data.data) {
        var db = response.data.data[database];
        outerScope.current.jsonData.databases.push ({name: db.name, value: db.name});
      }
      if (outerScope.current.jsonData.databases.length > 0) {
        outerScope.current.jsonData.selectedDatabase = outerScope.current.jsonData.databases[0].name;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

EventStoreConfigCtrl.templateUrl = 'partials/config.html';
