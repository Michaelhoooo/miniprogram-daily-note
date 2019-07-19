"use strict";

var _core = _interopRequireDefault(require('vendor.js')(0));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_core["default"].app({
  hooks: {
    'before-setData': function beforeSetData(dirty) {
      return dirty;
    }
  },
  globalData: {
    userInfo: null,
    wx: true
  },
  methods: {}
}, {a: 1});