if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js').then(function (registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// global variable for the event object
var installPromptEvent;
window.addEventListener('beforeinstallprompt', function (event) {
  event.preventDefault();
  installPromptEvent = event;
  if (installPromptEvent !== undefined) {
    window.callInstallPrompt = callInstallPrompt;
  }
});

function callInstallPrompt () {
  // We can't fire the dialog before preventing default browser dialog
  if (installPromptEvent !== undefined) {
    installPromptEvent.prompt();
  }
}
