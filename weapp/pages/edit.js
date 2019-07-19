"use strict";

var _core = _interopRequireDefault(require('../vendor.js')(0));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_core["default"].page({
  data: {
    id: '',
    currentDay: new Date().getDate(),
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    content: '',
    radioValue: 1,
    items: [{
      value: 1,
      color: '#87CEFA'
    }, {
      value: 2,
      color: '#FFD700'
    }],
    show: false
  },
  onLoad: function onLoad(option) {
    var _this = this;

    wx.cloud.callFunction({
      name: 'michael',
      success: function success(res) {
        _this.show = res.result;
      }
    });
    this.id = option.id;

    if (this.id) {
      this.showloading();
      wx.cloud.callFunction({
        name: 'getDetail',
        data: {
          id: this.id
        },
        success: function success(res) {
          console.log('[云函数] [getDetail]: ', res.result);
          var data = res.result.data;
          _this.currentDay = data.day;
          _this.currentYear = data.year;
          _this.currentMonth = data.month;
          _this.content = data.content;
          _this.radioValue = data.flag;

          _this.hideloading();
        },
        fail: function fail(err) {
          _this.hideloading();

          wx.showModal({
            title: '警告',
            content: '服务异常，请重新调用[getDetail]',
            showCancel: false,
            confirmText: '确定',
            success: function success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                });
              }
            }
          });
        }
      });
    } else {
      this.currentDay = option.day;
      this.currentYear = option.year;
      this.currentMonth = option.month;
    }
  },
  computed: {
    userInfo: function userInfo() {
      return this.$app.$options.globalData.userInfo;
    }
  },
  methods: {
    handleDelete: function handleDelete() {
      var that = this;
      wx.showModal({
        title: '温馨提示',
        content: '确定删除吗',
        showCancel: true,
        confirmText: '确定',
        success: function success(res) {
          if (res.confirm) {
            that.showloading();
            wx.cloud.callFunction({
              name: 'delete',
              data: {
                id: that.id
              },
              success: function success(res) {
                console.log('[云函数] [delete]: ', res.result);
                that.hideloading();
                wx.navigateBack({
                  delta: 1
                });
              },
              fail: function fail(err) {
                that.hideloading();
                wx.showModal({
                  title: '温馨提示',
                  content: '服务异常，请重新调用[delete]',
                  showCancel: false,
                  confirmText: '确定',
                  success: function success(res) {
                    if (res.confirm) {
                      wx.navigateBack({
                        delta: 1
                      });
                    }
                  }
                });
              }
            });
          }
        }
      });
    },
    showloading: function showloading() {
      wx.showLoading({
        mask: true
      });
    },
    hideloading: function hideloading() {
      wx.hideLoading();
    },
    radioChange: function radioChange(e) {
      this.radioValue = e.$wx.detail.value;
      console.log('radio发生change事件，携带value值为：', e.$wx.detail.value);
    },
    bindinput: function bindinput(e) {
      this.content = e.$wx.detail.value;
    },
    handleSubmit: function handleSubmit() {
      var _this2 = this;

      if (!this.content) {
        return;
      }

      this.showloading();
      var payload = {
        content: this.content,
        flag: this.radioValue,
        year: this.currentYear,
        month: this.currentMonth,
        day: this.currentDay,
        userName: this.userInfo.nickName,
        openId: this.userInfo.openid
      };

      if (this.id) {
        payload.id = this.id;
      }

      wx.cloud.callFunction({
        name: 'createContent',
        data: payload,
        success: function success(res) {
          _this2.hideloading();

          console.log('[云函数] [createContent] user openid: ', res.result);

          if (res.result.code === 200) {
            wx.navigateBack({
              delta: 1
            });
          }
        },
        fail: function fail(err) {
          _this2.hideloading();

          wx.showModal({
            title: '警告',
            content: '服务异常，请重新调用',
            showCancel: false,
            confirmText: '确定',
            success: function success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                });
              }
            }
          });
        }
      });
    }
  }
}, {info: {"components":{},"on":{}}, handlers: {'3-0': {"change": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.radioChange($event)
      })();
    
  }},'3-1': {"input": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.bindinput($event)
      })();
    
  }},'3-2': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.handleDelete($event)
      })();
    
  }},'3-3': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.handleSubmit($event)
      })();
    
  }}}, models: {} });