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
  var browser = RQ.Methods.getBrowser(),
    installButton;

  switch (browser) {
    case 'firefox':
      break;
    case 'chrome':
      installButton = document.getElementById('firefox-install-btn');
      installButton.setAttribute('disabled', true);
      installButton.removeAttribute('href');
      break;
    default:
      installButton = document.getElementById('firefox-install-btn');
      installButton.setAttribute('disabled', true);
      installButton.removeAttribute('href');
  }
};

RQ.Methods.init = function() {
  RQ.Methods.populateEmptyRulesArea();
};

RQ.Methods.init();
