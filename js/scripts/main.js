window.RQ = window.RQ || {};
RQ.Methods = RQ.Methods || {};

// http://stackoverflow.com/a/34840631/816213
RQ.Methods.getBrowser = function() {
  if (typeof InstallTrigger !== 'undefined') {
    return 'firefox';
  } else if (!!window.chrome && !!window.chrome.webstore) {
    return 'chrome';
  } else {
    return 'unsupported';
  }
};

RQ.Methods.populateEmptyRulesArea = function() {
  var browser = RQ.Methods.getBrowser();

  switch (browser) {
    case 'firefox':
      console.log('Browser is firefox');
      break;
    case 'chrome':
      console.log('Browser is chrome');
      break;
    default:
      console.log('Unsupported browser');
  }
};

RQ.Methods.init = function() {
  RQ.Methods.populateEmptyRulesArea();
};

RQ.Methods.init();
