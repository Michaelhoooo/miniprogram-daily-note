"use strict";

var _core = _interopRequireDefault(require('../vendor.js')(0));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_core["default"].page({
  data: {
    list: [],
    worklist: [],
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    headerImg: '',
    flagList: {},
    show: false
  },
  onLoad: function onLoad() {
    wx.cloud.init();
  },
  onShow: function onShow() {
    var _this = this;

    wx.cloud.callFunction({
      name: 'michael',
      success: function success(res) {
        _this.show = res.result;

        if (_this.show) {
          if (_this.$app.$options.globalData.userInfo && _this.$app.$options.globalData.userInfo.openid) {
            _this.headerImg = _this.$app.$options.globalData.userInfo.avatarUrl;

            _this.getAllList();

            _this.getWorkList();

            return;
          } else {
            _this.getUserInfo();
          }
        }
      }
    });
  },
  computed: {
    heigthFlag: function heigthFlag() {
      if (this.list.length === 35) {
        return false;
      } else {
        return true;
      }
    },
    getList: function getList() {
      var year = this.year;
      var month = this.month - 1;
      var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

      if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
        daysInMonth[1] = 29;
      } // 获得指定年月的1号是星期几


      var targetDay = new Date(year, month, 1).getDay(); // 将要在calendar__main中渲染的列表

      var total_calendar_list = [];
      var preNum = targetDay; // 首先先说一下，我们的日期是(日--六)这个顺序也就是(0--6)
      // 有了上述的前提我们可以认为targetDay为多少，我们就只需要在total_calendar_list的数组中push几个content为''的obj作为占位

      if (targetDay > 0) {
        for (var i = 0; i < preNum; i++) {
          var obj = {
            type: "pre",
            content: " "
          };
          total_calendar_list.push(obj);
        }
      }

      for (var _i = 0; _i < daysInMonth[month]; _i++) {
        var _obj = {
          type: "normal",
          content: _i + 1
        };
        total_calendar_list.push(_obj);
      }

      var nextNum = 6 - new Date(year, month + 1, 0).getDay(); // 与上面的type=pre同理

      for (var _i2 = 0; _i2 < nextNum; _i2++) {
        var _obj2 = {
          type: "next",
          content: " "
        };
        total_calendar_list.push(_obj2);
      }

      this.list = total_calendar_list;
      return total_calendar_list;
    }
  },
  methods: {
    getAllList: function getAllList() {
      var _this2 = this;

      var payload = {
        openId: this.$app.$options.globalData.userInfo.openid,
        year: this.year,
        month: this.month
      };
      wx.cloud.callFunction({
        name: 'getall',
        data: payload,
        success: function success(res) {
          console.log('[云函数] [getalllist] user openid: ', res.result);
          _this2.flagList = res.result;
        },
        fail: function fail(err) {
          wx.showModal({
            title: '警告',
            content: '服务异常，请重新调用[getalllist]',
            showCancel: false,
            confirmText: '确定',
            success: function success(res) {
              if (res.confirm) {
                return;
              }
            }
          });
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
    getDay: function getDay(currentItem) {
      this.day = currentItem;

      if (this.$app.$options.globalData.userInfo && this.$app.$options.globalData.userInfo.openid) {
        this.getWorkList();
      }
    },
    getWorkList: function getWorkList() {
      var _this3 = this;

      this.showloading();
      var payload = {
        openId: this.$app.$options.globalData.userInfo.openid,
        year: this.year,
        month: this.month,
        day: this.day
      };
      console.log(payload);
      wx.cloud.callFunction({
        name: 'getlist',
        data: payload,
        success: function success(res) {
          console.log('[云函数] [getlist] user openid: ', res.result.data);
          _this3.worklist = res.result.data;

          _this3.hideloading();
        },
        fail: function fail(err) {
          _this3.hideloading();

          wx.showModal({
            title: '警告',
            content: '服务异常，请重新调用[getlist]',
            showCancel: false,
            confirmText: '确定',
            success: function success(res) {
              if (res.confirm) {
                return;
              }
            }
          });
        }
      });
    },
    getUserInfo: function getUserInfo() {
      var that = this;
      this.showloading();
      wx.getSetting({
        success: function success(res) {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function success(res) {
                console.log(res);
                var userInfo = res.userInfo;
                wx.cloud.callFunction({
                  name: 'login',
                  data: {},
                  success: function success(res) {
                    console.log('[云函数] [login] user openid: ', res.result.openid);
                    userInfo.openid = res.result.openid;
                    that.$app.$options.globalData.userInfo = userInfo;
                    that.headerImg = userInfo.avatarUrl;
                    that.getWorkList();
                    that.getAllList();
                  },
                  fail: function fail(err) {
                    wx.showModal({
                      title: '警告',
                      content: '服务异常，请重新调用[login]',
                      showCancel: false,
                      confirmText: '确定',
                      success: function success(res) {
                        if (res.confirm) {
                          return;
                        }
                      }
                    });
                  }
                });
              }
            });
          } else {
            that.hideloading();
          }
        }
      });
    },
    handleAdd: function handleAdd(flag) {
      if (this.$app.$options.globalData.userInfo && this.$app.$options.globalData.userInfo.openid) {
        wx.navigateTo({
          url: "edit?day=".concat(this.day, "&year=").concat(this.year, "&month=").concat(this.month)
        });
      } else {
        wx.navigateTo({
          url: 'login'
        });
      }
    },
    handleNext: function handleNext() {
      this.worklist = [];
      this.flagList = [];

      if (this.month === 12) {
        this.year = this.year + 1;
        this.month = 1;
      } else {
        this.month = this.month + 1;
      }

      this.getAllList();
    },
    handlePre: function handlePre() {
      this.worklist = [];
      this.flagList = [];

      if (this.month === 1) {
        this.year = this.year - 1;
        this.month = 12;
      } else {
        this.month = this.month - 1;
      }

      this.getAllList();
    },
    calculateHeight: function calculateHeight(list) {
      this.list = list;
    }
  },
  onReady: function onReady() {}
}, {info: {"components":{"calendar":{"path":"../components/calendar"},"worklist":{"path":"../components/worklist"}},"on":{"2-0":["calculateHeight","pre","next","day"]}}, handlers: {'2-0': {"calculateHeight": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.calculateHeight($event)
      })();
    
  }, "pre": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.handlePre($event)
      })();
    
  }, "next": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.handleNext($event)
      })();
    
  }, "day": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.getDay($event)
      })();
    
  }},'2-4': {"tap": function proxy () {
    
    var _vm=this;
      return (function () {
        _vm.handleAdd(false)
      })();
    
  }}}, models: {} });