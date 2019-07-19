"use strict";

var _core = _interopRequireDefault(require('../vendor.js')(0));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_core["default"].component({
  data: {},
  props: {
    worklist: Array
  },
  methods: {
    handleItem: function handleItem(item) {
      wx.navigateTo({
        url: 'edit?id=' + item._id
      });
    }
  }
}, {info: {"components":{},"on":{}}, handlers: {'8-0': {"tap": function proxy (item) {
    
    var _vm=this;
      return (function () {
        _vm.handleItem(item)
      })();
    
  }}}, models: {} });