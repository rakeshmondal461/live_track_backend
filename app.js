require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { createServer } = require("http");
const { Server } = require("socket.io");

const DeviceModel = require("./models/DeviceModel");
const deviceM = new DeviceModel();

const DeviceLocationModel = require("./models/LocationModel");
const locationM = new DeviceLocationModel();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(express.json());

/* REST API ROUTES */

app.get("/api/devices", async (req, res) => {
  const devices = await deviceM.getDevices();
  res.json(devices);
});

// Register a new device
app.post("/api/devices", async (req, res) => {
  const { name, type, ip } = req.body;
  const result = await deviceM.addNewDevice(name, type, ip);
  res.json(result);
});

// Fetch location history of a device
app.get("/api/location/:deviceId", async (req, res) => {
  const { deviceId } = req.params;
  const result = await locationM.getDeviceLocation(deviceId);
  res.json(result);
});

/* WEBSOCKET EVENTS */

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);



  // Listen for location updates from devices
  socket.on("sendLocation", async (data) => {
    const { deviceIp, latitude, longitude } = data;
    console.log(
      `Received location from ${deviceIp}: (${latitude}, ${longitude})`
    );

    await locationM.addDeviceLocation(deviceIp, latitude, longitude);
    // Broadcast to all clients
    io.emit("locationUpdate", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
