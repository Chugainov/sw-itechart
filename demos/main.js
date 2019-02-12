let open = indexedDB.open('UnsyncData', 1);
let connectionStatus = document.getElementById('connectionStatus');
let wasSended = document.getElementById('wasSended');

open.onupgradeneeded = function() {
  const db = open.result;
  if (!db.objectStoreNames.contains('messages')) {
    db.createObjectStore('messages');
    objectStore.createIndex("message", "message", { unique: false });
  }
}

function putToLocal(data) {
  let open = indexedDB.open('UnsyncData')

  open.onsuccess = function() {
    const db = open.result;
    let tx = db.transaction(['messages'], 'readwrite');
    let store = tx.objectStore('messages');
    store.put({message: data});
  }
}

if ('serviceWorker' in navigator) {
  navigator
    .serviceWorker
    .register('./sw.js')
    .then( () => navigator.serviceWorker.ready)
    .then( (registration) => {
      document
        .getElementById('send')
        .addEventListener('click', (e) => {
          e.preventDefault();
          if (!navigator.onLine) {
            wasSended.innerHTML = "Сообщение будет отправлено, когда появится сеть!"
          }

          const textArea = document.getElementById('msg');
          const message = textArea.value;
          putToLocal(message);
          
          textArea.value = '';
          registration
            .sync
            .register(message)
            .then(() => {
              console.log('Sync registered');
            });
        });
    });
} else {
  document
    .getElementById('send')
    .addEventListener('click', () => {
      console.log('Fallback to fetch the image as usual');
    });
}

function isOnline () {
  if (navigator.onLine){
    connectionStatus.innerHTML = 'Вы в сети!';
  } else {
    connectionStatus.innerHTML = 'Вы вне сети!';
  }
}

window.addEventListener('online', isOnline);
window.addEventListener('offline', isOnline);
isOnline();