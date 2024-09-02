// Connect to the MongoDB database
use IoTSecuritySystem

// Setup Collections and Indexes
db.createCollection("DeviceLifecycle")
db.createCollection("DeviceHistory")
db.createCollection("DecommissionedDevices")

db.DeviceLifecycle.createIndex({ deviceId: 1 }, { unique: true })
db.DeviceHistory.createIndex({ deviceId: 1, timestamp: 1 })
db.DecommissionedDevices.createIndex({ deviceId: 1 })

// Register a new IoT device
function registerDevice(device) {
    device.registrationDate = new Date();
    device.status = "active";
    device.lastModified = new Date();
    try {
        db.DeviceLifecycle.insertOne(device);
        logDeviceHistory(device.deviceId, "Device registered", device);
        print("Device registered:", device.deviceId);
    } catch (e) {
        print("Error registering device:", e);
    }
}

// Update device information
function updateDevice(deviceId, updates) {
    updates.lastModified = new Date();
    const result = db.DeviceLifecycle.updateOne(
        { deviceId: deviceId, status: { $ne: "decommissioned" } },
        { $set: updates }
    );
    if (result.matchedCount > 0) {
        logDeviceHistory(deviceId, "Device updated", updates);
        print("Device updated:", deviceId);
    } else {
        print("Update failed: Device may be decommissioned or does not exist:", deviceId);
    }
}

// Decommission a device
function decommissionDevice(deviceId) {
    const device = db.DeviceLifecycle.findOne({ deviceId: deviceId });
    if (device) {
        device.decommissionDate = new Date();
        device.status = "decommissioned";
        db.DeviceLifecycle.deleteOne({ deviceId: deviceId });
        db.DecommissionedDevices.insertOne(device);
        logDeviceHistory(deviceId, "Device decommissioned", { status: "decommissioned" });
        print("Device decommissioned:", deviceId);
    } else {
        print("Decommission failed: Device does not exist or is already decommissioned:", deviceId);
    }
}

// Log device history
function logDeviceHistory(deviceId, action, details) {
    db.DeviceHistory.insertOne({
        deviceId: deviceId,
        action: action,
        timestamp: new Date(),
        details: details
    });
}

// Generate a device lifecycle report
function generateDeviceLifecycleReport(deviceId) {
    const lifecycleReport = db.DeviceHistory.find({ deviceId: deviceId }).sort({ timestamp: 1 }).toArray();
    print("Device Lifecycle Report for:", deviceId);
    printjson(lifecycleReport);
}

// Generate a summary of all active devices
function listActiveDevices() {
    const activeDevices = db.DeviceLifecycle.find({ status: "active" }).sort({ registrationDate: -1 }).toArray();
    print("Active Devices Summary:");
    printjson(activeDevices);
}

// Generate a report of all decommissioned devices
function listDecommissionedDevices() {
    const decommissionedDevices = db.DecommissionedDevices.find().sort({ decommissionDate: -1 }).toArray();
    print("Decommissioned Devices Report:");
    printjson(decommissionedDevices);
}

// Example usage
registerDevice({
    deviceId: "sensor_005",
    deviceName: "Indoor Humidity Sensor",
    location: "Office Building - 2nd Floor",
    firmwareVersion: "v1.0.0",
    manufacturer: "SensorTech Inc."
});

updateDevice("sensor_005", { firmwareVersion: "v1.1.0" });
decommissionDevice("sensor_005");

generateDeviceLifecycleReport("sensor_005");
listActiveDevices();
listDecommissionedDevices();
