var module = angular.module('filters', []),
    webutil = require('../util/web'),
    Amount = ripple.Amount;

var iso4217 = require('../data/iso4217');

/**
 * Format a ripple.Amount.
 */
module.filter('rpamount', function () {
  return function (input, opts) {
    if ("number" === typeof opts) {
      opts = {
        precision: opts
      };
    } else if ("object" !== typeof opts) {
      opts = {};
    }

    if (!input) return "n/a";

    var amount = Amount.from_json(input);
    if (!amount.is_valid()) return "n/a";

    var currency = amount.currency().to_json();
    if ("number" !== typeof opts.precision) {
      // If no precision is given, we'll default to the currency's default
      // precision.
      opts.precision = ("undefined" !== typeof iso4217[currency]) ?
        iso4217[currency][1] : 2;
    }

    var out = amount.to_human(opts);

    return out;
  };
});

/**
 * Get the currency from an Amount.
 */
module.filter('rpcurrency', function () {
  return function (input) {
    if (!input) return "";

    var amount = Amount.from_json(input);
    return amount.currency().to_json();
  };
});

/**
 * Get the full currency name from an Amount.
 */
module.filter('rpcurrencyfull', function () {
  return function (input) {
    if (!input) return "";

    var amount = Amount.from_json(input);
    var currency = $.grep(rippleclient.$scope.currencies, function(e){ return e.value == amount.currency().to_json(); })[0];

    if (currency) {
      return currency.name;
    } else {
      return amount.currency().to_json();
    }
  };
});

/**
 * Calculate a ratio of two Amounts.
 */
module.filter('rpamountratio', function () {
  return function (numerator, denominator) {
    if (!(numerator instanceof ripple.Amount)) return Amount.NaN();
    if (!(denominator instanceof ripple.Amount)) return Amount.NaN();

    return numerator.ratio_human(denominator);
  };
});

/**
 * Angular filter for Moment.js.
 *
 * Displays a timestamp as "x minutes ago".
 */
module.filter('rpfromnow', function () {
  return function (input) {
    return moment(input).fromNow();
  };
});

/**
 * Show contact name or short address
 */
module.filter('rpcontactname', function () {
  return function (address) {
    address = address ? ""+address : "";

    var contact = webutil.getContact(rippleclient.$scope.userBlob.data.contacts,address);

    if (!contact) {
      return "" + address.substring(0,7) + "…";
    }

    return contact.name;
  };
});

module.filter('rpcontactnamefull', function () {
  return function (address) {
    address = address ? ""+address : "";

    var contact = webutil.getContact(rippleclient.$scope.userBlob.data.contacts,address);

    if (!contact) {
      return "" + address;
    }

    return contact.name;
  };
});

/**
 * Masks a string like so: •••••.
 *
 * The number of the bullets will correspond to the length of the string.
 */
module.filter('rpmask', function () {
  return function (pass) {
    pass = ""+pass;
    return Array(pass.length+1).join("•");
  };
});

/**
 * Crops a string to len characters
 *
 * The number of the bullets will correspond to the length of the string.
 */
module.filter('rptruncate', function () {
  return function (str, len) {
    return str ? str.slice(0, len) : '';
  };
});

/**
 * Format a file size.
 *
 * Based on code by aioobe @ StackOverflow.
 * @see http://stackoverflow.com/questions/3758606
 */
module.filter('rpfilesize', function () {
  function number_format( number, decimals, dec_point, thousands_sep ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +     bugfix by: Michael White (http://crestidg.com)
    // +     bugfix by: Benjamin Lupton
    // +     bugfix by: Allan Jensen (http://www.winternet.no)
    // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // *     example 1: number_format(1234.5678, 2, '.', '');
    // *     returns 1: 1234.57

    var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
    var d = dec_point === undefined ? "," : dec_point;
    var t = thousands_sep === undefined ? "." : thousands_sep, s = n < 0 ? "-" : "";
    var i = parseInt(n = Math.abs(+n || 0).toFixed(c), 10) + "", j = (j = i.length) > 3 ? j % 3 : 0;

    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  }

  // SI (International System of Units)
  // e.g. 1000 bytes = 1 kB
  var unit = 1000;
  var prefixes = "kMGTPE";
  var common = "B";

  // Binary system
  // e.g. 1024 bytes = 1 KiB
  //var unit = 1024
  //var prefixes = "KMGTPE";
  //var common = "iB";

  return function (str) {
    var bytes = +str;
    if (bytes < unit) return bytes + " B";
    var exp = Math.floor(Math.log(bytes) / Math.log(unit));
    var pre = " "+prefixes[exp-1] + common;
    return number_format(bytes / Math.pow(unit, exp), 2, '.', '')+pre;
  };
});

/**
 * Uppercase the first letter.
 */
module.filter('rpucfirst', function () {
  return function (str) {
    str = ""+str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
});

