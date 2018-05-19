import {EventStoreDatasource} from './datasource';
import {EventStoreConfigCtrl} from './config_ctrl';
import {EventStoreQueryCtrl} from './query_ctrl';
import {axios} from './axios';

class GenericQueryOptionsCtrl {}
GenericQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

class GenericAnnotationsQueryCtrl {}
GenericAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html'

export {
  EventStoreDatasource as Datasource,
  EventStoreQueryCtrl as QueryCtrl,
  EventStoreConfigCtrl as ConfigCtrl,
  GenericQueryOptionsCtrl as QueryOptionsCtrl,
  GenericAnnotationsQueryCtrl as AnnotationsQueryCtrl,
  axios as axios,
};
