// const socket = io();

// if (navigator.geolocation) {
//   navigator.geolocation.watchPosition((position) => {
//     const { latitude, longitude } = position.coords;
//     socket.emit("send-location", { latitude, longitude });
//   },
//   (error) => {
//     console.error("Error getting location:", error);
//   }, {
//     enableHighAccuracy: true,
//     timeout: 5000,
//     maximumAge: 0,
//   });
// }

// const map = L.map("map").setView([0, 0], 10);

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution : "Abhishe kumar"
// }).addTo(map);

// const marker = {}

// socket.on("receive-location", (location) => {
//   const { id, latitude, longitude } = location;
//   map.setView([latitude, longitude]);

//   if(marker[id]) {
//     marker[id].setLatLng([latitude, longitude]);
//   }
//   else {
//     marker[id] = L.marker([latitude, longitude]).addTo(map)
//   }
// });

// socket.on("disconnect", (id) => {
//   if(marker[id]) {
//     map.removeLayer(marker[id]);
//     delete marker[id];
//   }
// });

const socket = io();

const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution : "Abhishe Kumar"
}).addTo(map);

const markers = {}; // use plural to manage multiple markers

// Emit location with your socket.id once connected
socket.on("connect", () => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
      
      // Optionally update your own marker
      if (markers["me"]) {
        markers["me"].setLatLng([latitude, longitude]);
      } else {
        markers["me"] = L.marker([latitude, longitude], {
          title: "You",
          opacity: 0.8
        }).addTo(map);
        map.setView([latitude, longitude], 10);
      }

    }, (error) => {
      console.error("Error getting location:", error);
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  }
});

// Listen for other users' locations
socket.on("receive-location", ({ id, latitude, longitude }) => {
  if (id === socket.id) return; // Avoid duplicate for yourself

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude], {
      title: `User ${id}`
    }).addTo(map);
  }
});

// Remove marker on disconnect
socket.on("remove-user", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
