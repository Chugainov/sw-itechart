importScripts('./dexie.js');

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
  new Dexie('UnsyncData').open().then(function (db) {
    const token = "696487450:AAGmtw4zV9YS1PtMgmsFLyw9tg_I5HnSUHI";
    const text = "it is me!";
    const chat_id = "@sw_testing";
    const params = {
      method: 'POST',
    }

    db.table('messages').each(function (item) {

      fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${item.text}`, params);
    });

    db.table('messages').clear();
  });

  // const db = new Dexie("UnsyncData");
  // db.messages.get(1).then(function (item) {
  //   alert("Friend with id 1: " + item.text);
  // });
}