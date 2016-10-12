let data = {
  requestly: {
    id: 'requestly@sachinjain024',
    installURL: 'http://localhost:7070/firefox/requestly-4.1.5-an+fx.xpi?src=ss',
  }
}

function logEvent(e) {
  console.log(e);
}

function install(name) {
  return window.navigator.mozAddonManager.createInstall({url: data[name].installURL})
    .then(installobj => {
      installobj.addEventListener('onDownloadStarted', logEvent);
      installobj.addEventListener('onDownloadProgress', logEvent);
      installobj.addEventListener('onDownloadEnded', logEvent);

      installobj.addEventListener('onInstallStarted', logEvent);
      installobj.addEventListener('onInstallFailed', logEvent);
      installobj.addEventListener('onInstallEnded', logEvent);
      installobj.addEventListener('onInstallCancelled', logEvent);

      installobj.addEventListener('onExternalInstall', logEvent);
      installobj.install();
      return installobj;
    });
}

function lookup(name) {
  return window.navigator.mozAddonManager.getAddonByID(data[name].id)
    .then((addon) => { 
      addon ? console.log(addon) : console.log('no add-on found');  
    });
}

// UNINSTALL THE ADD-ON
function uninstall(name) {
  return lookup(name)
    .then((addon) => { 
     return addon.uninstall()
    });
}