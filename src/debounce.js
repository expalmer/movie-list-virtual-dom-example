module.exports = function ( fn, wait ) {
  var timeout;

  return function() {
    var context = this;
    var args = arguments;
    var later = function () {
      timeout = null;
      fn.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }
};