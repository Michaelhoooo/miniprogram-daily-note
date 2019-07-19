"use strict";

var _core = _interopRequireDefault(require('../vendor.js')(0));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_core["default"].page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  methods: {
    bindGetUserInfo: function bindGetUserInfo(e) {
      if (e.$wx.detail.userInfo) {
        wx.navigateBack({
          delta: 1
        });
      } else {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
          showCancel: false,
          confirmText: '返回授权',
          success: function success(res) {
            if (res.confirm) {
              return;
            }
          }
        });
      }
    }
  }
}, {info: {"components":{},"on":{}}, handlers: {'4-0': {"getuserinfo": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.bindGetUserInfo($event)
      })();
    
  }}}, models: {} });