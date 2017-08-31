var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { SPLIT } from './constants';

var Action = function () {
  function Action(key, actionName, payload, error, meta) {
    _classCallCheck(this, Action);

    this.type = key + SPLIT + actionName;
    this.payload = payload;
    this.error = error;
    this.meta = meta;
  }

  _createClass(Action, [{
    key: 'matchType',
    value: function matchType(key, actionName) {
      return key + SPLIT + actionName === this.type;
    }
  }]);

  return Action;
}();

export default Action;