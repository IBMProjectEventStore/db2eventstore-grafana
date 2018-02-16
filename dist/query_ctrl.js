'use strict';

System.register(['app/plugins/sdk', './css/query-editor.css!'], function (_export, _context) {
  "use strict";

  var QueryCtrl, _createClass, EventStoreQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      QueryCtrl = _appPluginsSdk.QueryCtrl;
    }, function (_cssQueryEditorCss) {}],
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

      _export('EventStoreQueryCtrl', EventStoreQueryCtrl = function (_QueryCtrl) {
        _inherits(EventStoreQueryCtrl, _QueryCtrl);

        function EventStoreQueryCtrl($scope, $injector) {
          _classCallCheck(this, EventStoreQueryCtrl);

          var _this = _possibleConstructorReturn(this, (EventStoreQueryCtrl.__proto__ || Object.getPrototypeOf(EventStoreQueryCtrl)).call(this, $scope, $injector));

          _this.scope = $scope;
          _this.target.selectedTable;
          _this.target.selectedColumn;
          _this.target.queryString;
          _this.target.selectedTimestamp;
          _this.target.readOption = 'SnapshotAny';
          _this.target.tables = [];
          _this.target.columns = [];
          _this.target.target = _this.target.target || 'select metric';
          _this.target.type = _this.target.type || 'timeseries';
          _this.target.resultFormats = [{ name: 'Time series', value: 'time_series' }, { name: 'Table', value: 'table' }];
          _this.target.readOptions = [{ name: 'SnapshotAny', value: 'SnapshotAny' }, { name: 'SnapshotNow', value: 'SnapshotNow' }, { name: 'SnapshotNone', value: 'SnapshotNone' }];
          _this.datasource.metricAPIQuery('/oltp/tables', _this.displayTables, _this);
          return _this;
        }

        _createClass(EventStoreQueryCtrl, [{
          key: 'displayTables',
          value: function displayTables(tables, scope) {
            var table;
            for (table in tables) {
              var t = tables[table];
              scope.target.tables.push({ name: t.name, value: t.name });
            }
          }
        }, {
          key: 'onTableSelected',
          value: function onTableSelected() {
            this.refresh();
            this.datasource.metricAPIQuery('/oltp/table/columns', this.displayColumns, this, 'tableName=' + this.target.selectedTable);
          }
        }, {
          key: 'displayColumns',
          value: function displayColumns(columns, scope) {
            var column;
            for (column in columns) {
              var c = columns[column];
              scope.target.columns.push({ name: c.name, value: c.name });
            }
          }
        }, {
          key: 'onColumnSelected',
          value: function onColumnSelected() {}
        }, {
          key: 'getOptions',
          value: function getOptions(query) {
            return this.datasource.metricFindQuery(query || '');
          }
        }, {
          key: 'toggleEditorMode',
          value: function toggleEditorMode() {
            this.target.rawQuery = !this.target.rawQuery;
          }
        }, {
          key: 'onChangeInternal',
          value: function onChangeInternal() {
            this.panelCtrl.refresh(); // Asks the panel to refresh data.
          }
        }, {
          key: 'getCollapsedText',
          value: function getCollapsedText() {
            this.target.queryString = 'SELECT ' + this.target.selectedColumn + ' FROM ' + this.target.selectedTable;
            return this.target.queryString;
          }
        }]);

        return EventStoreQueryCtrl;
      }(QueryCtrl));

      _export('EventStoreQueryCtrl', EventStoreQueryCtrl);

      EventStoreQueryCtrl.templateUrl = 'partials/query.editor.html';
    }
  };
});
//# sourceMappingURL=query_ctrl.js.map
