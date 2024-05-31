if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, (err) => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

let installPromptEvent;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPromptEvent = event;
  if (installPromptEvent !== undefined) {
    window.callInstallPrompt = callInstallPrompt;
  }
});

function callInstallPrompt () {
  if (installPromptEvent !== undefined) {
    installPromptEvent.prompt();
  }
}
