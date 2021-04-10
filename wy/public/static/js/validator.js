Validator = {
  require: function (value, text) {
    if (Tool.isEmpty(value)) {
      return false;
    } else {
      return true
    }
  },
  length: function (value, text, min, max) {
    if (Tool.isEmpty(value)) {
      return false;
    }
    if (!Tool.isLength(value, min, max)) {
      return false;
    } else {
      return true
    }
  }
};