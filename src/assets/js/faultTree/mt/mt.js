export default {
  $ : function(s) { // querySelectorAll
    if (typeof s === 'string' ) {
      let a = document.querySelectorAll(s);
      return a.length <= 1 ? a[0] : a;
    } else {
      return s;
    }
  },
  extend : function(t, o) {
    if (t) {
      for (let n in t) {
        o[n] = t[n];
      }
    }
  }
}
