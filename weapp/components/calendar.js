"use strict";

var _core = _interopRequireDefault(require('../vendor.js')(0));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_core["default"].component({
  data: {
    currentDay: new Date().getDate(),
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    currentItem: '',
    weekDay: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  props: {
    year: {
      type: Number
    },
    month: {
      type: Number
    },
    getList: {
      type: Array
    },
    flagList: {
      type: Object
    }
  },
  watch: {
    month: function month() {
      this.$emit('calculateHeight', this.getList);
    }
  },
  computed: {},
  methods: {
    handleDayClick: function handleDayClick(e) {
      if (e.$wx.currentTarget.dataset.item.content !== " ") {
        this.currentItem = e.$wx.currentTarget.dataset.item.content;
        this.$emit('day', this.currentItem);
      }
    },
    handlePre: function handlePre() {
      this.currentItem = '';
      this.$emit('pre');
    },
    handleNext: function handleNext() {
      this.currentItem = '';
      this.$emit('next');
    }
  }
}, {info: {"components":{},"on":{}}, handlers: {'7-0': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.handlePre($event)
      })();
    
  }},'7-1': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.handleNext($event)
      })();
    
  }},'7-2': {"tap": function proxy () {
    var $event = arguments[arguments.length - 1];
    var _vm=this;
      return (function () {
        _vm.handleDayClick($event)
      })();
    
  }}}, models: {} });