// Connect to the MongoDB database
use IoTSecuritySystem

// Setup Collections and Indexes
db.createCollection("PerformanceAnalytics")
db.createCollection("MaintenanceLogs")

db.PerformanceAnalytics.createIndex({ deviceId: 1 })
db.MaintenanceLogs.createIndex({ deviceId: 1, timestamp: 1 })

// Track device uptime
function trackDeviceUptime() {
    const uptimeData = db.DeviceData.aggregate([
        { $group: { _id: "$deviceId", totalUptime: { $sum: "$readings.uptime" }, count: { $sum: 1 } } },
        { $project: { deviceId: "$_id", averageUptime: { $divide: ["$totalUptime", "$count"] }, _id: 0 } }
    ]).toArray();

    db.PerformanceAnalytics.insertMany(uptimeData);
    print("Device uptime tracked.");
}

// Analyze battery usage patterns
function analyzeBatteryUsage() {
    const batteryData = db.DeviceData.aggregate([
        { $group: { _id: "$deviceId", averageBattery: { $avg: "$readings.battery" }, minBattery: { $min: "$readings.battery" }, maxBattery: { $max: "$readings.battery" } } },
        { $project: { deviceId: "$_id", averageBattery: 1, minBattery: 1, maxBattery: 1, _id: 0 } }
    ]).toArray();

    db.PerformanceAnalytics.insertMany(batteryData);
    print("Battery usage patterns analyzed.");
}

// Identify frequently maintained devices
function identifyFrequentMaintenance() {
    const maintenanceData = db.DeviceHealth.aggregate([
        { $match: { "metadata.status": "maintenance required" } },
        { $group: { _id: "$deviceId", maintenanceCount: { $sum: 1 } } },
        { $sort: { maintenanceCount: -1 } },
        { $limit: 5 }
    ]).toArray();

    db.MaintenanceLogs.insertMany(maintenanceData);
    print("Frequently maintained devices identified.");
}

// Predict maintenance needs based on usage patterns (New Feature)
function predictMaintenanceNeeds() {
    const predictiveData = db.DeviceData.aggregate([
        { $group: { _id: "$deviceId", avgUsage: { $avg: "$readings.uptime" }, avgBattery: { $avg: "$readings.battery" } } },
        { $project: { deviceId: "$_id", predictedMaintenance: { $cond: [{ $lt: ["$avgBattery", 20] }, "Immediate", { $cond: [{ $lt: ["$avgUsage", 10] }, "Soon", "Normal"] }] } } }
    ]).toArray();

    db.PerformanceAnalytics.insertMany(predictiveData);
    print("Maintenance needs predicted based on usage patterns.");
}

// Generate performance analytics report
function generatePerformanceReport() {
    const performanceReport = db.PerformanceAnalytics.find({}).toArray();
    print("Device Performance Report:");
    printjson(performanceReport);
}

// Generate detailed maintenance report (New Feature)
function generateMaintenanceReport() {
    const maintenanceReport = db.MaintenanceLogs.find({}).sort({ timestamp: -1 }).toArray();
    print("Maintenance Report:");
    printjson(maintenanceReport);
}

// Example usage
trackDeviceUptime();
analyzeBatteryUsage();
identifyFrequentMaintenance();
predictMaintenanceNeeds();
generatePerformanceReport();
generateMaintenanceReport();
