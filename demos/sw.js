self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  if (self.clients && clients.claim) {
      clients.claim();
  }
});

self.addEventListener('sync', function(event) {
  event.waitUntil(sendToChat());
});

function sendToChat()
{
  getFromLocal().then((result) => {
    const token = "696487450:AAGmtw4zV9YS1PtMgmsFLyw9tg_I5HnSUHI";
    const text = result[0].message;
    const chat_id = "@kirchuga";
    const params = {
      method: 'POST',
    };
    
    return fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${text}`, params);
  }).then(() => {
    return clearLocal();
  });

}

function getFromLocal() {
  return new Promise((resolve, reject) => {

    let open = self.indexedDB.open('UnsyncData', 1)

    open.onsuccess = function() {
      const db = open.result;
      let tx = db.transaction(['messages'], 'readonly');
      let store = tx.objectStore('messages');
      store.getAll().onsuccess = function(event) {
        resolve(event.target.result);
      }
    }
  })
}
function clearLocal() {
  return new Promise((resolve, reject) => {

    let open = self.indexedDB.open('UnsyncData', 1)

    open.onsuccess = function() {
      const db = open.result;
      let tx = db.transaction(['messages'], 'readwrite');
      let store = tx.objectStore('messages');
      store.clear().onsuccess = function(event) {
        resolve(event.target.result);
      }
    }
  })
}