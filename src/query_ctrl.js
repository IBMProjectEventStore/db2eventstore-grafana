import {QueryCtrl} from 'app/plugins/sdk';
import './css/query-editor.css!'

export class EventStoreQueryCtrl extends QueryCtrl {

  constructor($scope, $injector)  {
    super($scope, $injector);

    this.scope = $scope;
    this.target.selectedTable;
    this.target.selectedColumn;
    this.target.queryString;
    this.target.selectedTimestamp;
    this.target.readOption = 'SnapshotAny';
    this.target.tables = [];
    this.target.columns = [];
    this.target.target = this.target.target || 'select metric';
    this.target.type = this.target.type || 'timeseries';
    this.target.resultFormats = [{ name: 'Time series', value: 'time_series' }, { name: 'Table', value: 'table' }];
    this.target.readOptions = [{name: 'SnapshotAny', value: 'SnapshotAny'}, {name: 'SnapshotNow', value: 'SnapshotNow'}, {name: 'SnapshotNone', value: 'SnapshotNone'}];
    this.datasource.metricAPIQuery('/oltp/tables', this.displayTables, this);
  }

  displayTables (tables, scope) {
    var table;
    for (table in tables) {
      var t = tables[table];
      scope.target.tables.push ({name: t.name, value: t.name});
    }
  }

  onTableSelected () {
    this.refresh();
    this.datasource.metricAPIQuery('/oltp/table/columns', this.displayColumns, this, 'tableName=' + this.target.selectedTable);
  }

  displayColumns (columns, scope) {
    var column;
    for (column in columns) {
      var c = columns[column];
      scope.target.columns.push ({name: c.name, value: c.name});
    }
  }

  onColumnSelected () {
  }

  getOptions(query) {
    return this.datasource.metricFindQuery(query || '');
  }

  toggleEditorMode() {
    this.target.rawQuery = !this.target.rawQuery;
  }

  onChangeInternal() {
    this.panelCtrl.refresh(); // Asks the panel to refresh data.
  }

  getCollapsedText() {
    this.target.queryString = 'SELECT ' + this.target.selectedColumn + ' FROM ' + this.target.selectedTable;
    return this.target.queryString;
  }
}

EventStoreQueryCtrl.templateUrl = 'partials/query.editor.html';
