'use strict';

System.register(['./datasource', './config_ctrl', './query_ctrl', './axios'], function (_export, _context) {
  "use strict";

  var EventStoreDatasource, EventStoreConfigCtrl, EventStoreQueryCtrl, axios, GenericQueryOptionsCtrl, GenericAnnotationsQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_datasource) {
      EventStoreDatasource = _datasource.EventStoreDatasource;
    }, function (_config_ctrl) {
      EventStoreConfigCtrl = _config_ctrl.EventStoreConfigCtrl;
    }, function (_query_ctrl) {
      EventStoreQueryCtrl = _query_ctrl.EventStoreQueryCtrl;
    }, function (_axios) {
      axios = _axios.axios;
    }],
    execute: function () {
      _export('QueryOptionsCtrl', GenericQueryOptionsCtrl = function GenericQueryOptionsCtrl() {
        _classCallCheck(this, GenericQueryOptionsCtrl);
      });

      GenericQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

      _export('AnnotationsQueryCtrl', GenericAnnotationsQueryCtrl = function GenericAnnotationsQueryCtrl() {
        _classCallCheck(this, GenericAnnotationsQueryCtrl);
      });

      GenericAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';

      _export('Datasource', EventStoreDatasource);

      _export('QueryCtrl', EventStoreQueryCtrl);

      _export('ConfigCtrl', EventStoreConfigCtrl);

      _export('QueryOptionsCtrl', GenericQueryOptionsCtrl);

      _export('AnnotationsQueryCtrl', GenericAnnotationsQueryCtrl);

      _export('axios', axios);
    }
  };
});
//# sourceMappingURL=module.js.map
