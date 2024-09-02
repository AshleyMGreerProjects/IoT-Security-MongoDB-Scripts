// Connect to the MongoDB database
use IoTSecuritySystem

// Setup Collections and Indexes
db.createCollection("DeviceData")
db.createCollection("SecurityEvents", { capped: false })
db.createCollection("DeviceHealth")
db.createCollection("ArchivedSecurityEvents")

// Indexes for performance optimization
db.DeviceData.createIndex({ deviceId: 1 })
db.SecurityEvents.createIndex({ "details.ip": 1, timestamp: 1 })
db.DeviceHealth.createIndex({ deviceId: 1, timestamp: 1 })
db.ArchivedSecurityEvents.createIndex({ eventId: 1 })

// TTL index to auto-expire security events older than 90 days
db.SecurityEvents.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 7776000 }) // 90 days in seconds

// Insert IoT device data with extended metadata
db.DeviceData.insertMany([
    {
        deviceId: "temperature_sensor_001",
        deviceName: "Warehouse Temperature Sensor A",
        timestamp: ISODate(),
        readings: {
            temperature: 18.3,
            humidity: 55,
            battery: 78
        },
        metadata: {
            location: "Main Warehouse - North Wall",
            ip: "192.168.10.101",
            status: "active",
            firmwareVersion: "v2.1.4",
            lastMaintenance: ISODate("2024-07-15T00:00:00Z"),
            deviceType: "Temperature Sensor"
        }
    },
    {
        deviceId: "security_camera_045",
        deviceName: "Entrance Security Camera 45",
        timestamp: ISODate(),
        readings: {
            motionDetected: false,
            battery: 98
        },
        metadata: {
            location: "Headquarters - Main Entrance",
            ip: "192.168.10.202",
            status: "active",
            firmwareVersion: "v3.2.1",
            lastMaintenance: ISODate("2024-06-30T00:00:00Z"),
            deviceType: "Security Camera"
        }
    },
    {
        deviceId: "smoke_detector_003",
        deviceName: "Server Room Smoke Detector",
        timestamp: ISODate(),
        readings: {
            smokeLevel: 0,
            battery: 67
        },
        metadata: {
            location: "Data Center - Server Room 2",
            ip: "192.168.10.150",
            status: "maintenance required",
            firmwareVersion: "v1.9.9",
            lastMaintenance: ISODate("2024-05-12T00:00:00Z"),
            deviceType: "Smoke Detector"
        }
    }
])

// Log security events and trigger alerts for critical events
db.SecurityEvents.insertMany([
    {
        eventId: "event_101",
        deviceId: "security_camera_045",
        eventType: "unauthorized_access",
        timestamp: ISODate(),
        details: {
            description: "Unauthorized access attempt detected at the main entrance.",
            severity: "high",
            detectedBy: "motion_sensor",
            ip: "192.168.10.202"
        }
    },
    {
        eventId: "event_102",
        deviceId: "temperature_sensor_001",
        eventType: "anomaly_detected",
        timestamp: ISODate(),
        details: {
            description: "Temperature anomaly detected, deviating beyond acceptable thresholds.",
            severity: "medium",
            detectedBy: "temperature_sensor",
            ip: "192.168.10.101"
        }
    },
    {
        eventId: "event_103",
        deviceId: "smoke_detector_003",
        eventType: "low_battery",
        timestamp: ISODate(),
        details: {
            description: "Low battery alert for smoke detector in Server Room 2.",
            severity: "low",
            detectedBy: "smoke_detector",
            ip: "192.168.10.150"
        }
    }
])

// Automated alert for critical events
db.SecurityEvents.find({ "details.severity": "high" }).forEach(function(event) {
    sendAlert(event);
})

// Sample function for sending alerts
function sendAlert(event) {
    print("ALERT: Critical security event detected!");
    printjson(event);
    // Insert code to send email or post to Slack/Teams
}

// Enhanced monitoring of device health
db.DeviceData.find({ 
    $or: [
        { "readings.battery": { $lt: 20 } },
        { "metadata.status": "maintenance required" },
        { "metadata.lastMaintenance": { $lt: ISODate("2024-06-01T00:00:00Z") } } // Devices not maintained in the last 3 months
    ]
}).forEach(function(doc) {
    db.DeviceHealth.insertOne({
        deviceId: doc.deviceId,
        deviceName: doc.deviceName,
        timestamp: doc.timestamp,
        batteryLevel: doc.readings.battery,
        location: doc.metadata.location,
        status: doc.metadata.status,
        lastMaintenance: doc.metadata.lastMaintenance,
        firmwareVersion: doc.metadata.firmwareVersion
    })
})

// Log devices requiring attention
print("Devices requiring attention:")
db.DeviceHealth.find().pretty()

// Advanced security threat analysis
var threatAnalysis = db.SecurityEvents.aggregate([
    {
        $group: {
            _id: {
                ip: "$details.ip",
                eventType: "$eventType",
                hourOfDay: { $hour: "$timestamp" }
            },
            eventCount: { $sum: 1 },
            lastEvent: { $max: "$timestamp" }
        }
    },
    {
        $sort: { eventCount: -1 }
    },
    {
        $limit: 5
    }
]).toArray()

// Display the results of the threat analysis
print("Top 5 security threats based on IP, event type, and time of day:")
printjson(threatAnalysis)

// Generate a dynamic security report for a specified date range
function generateSecurityReport(startDate, endDate) {
    var securityReport = db.SecurityEvents.find({
        timestamp: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: -1 }).toArray()

    // Display the security report
    print("Security Events Report from " + startDate + " to " + endDate + ":")
    printjson(securityReport)

    // Export the report to a file
    var fileName = "Security_Report_" + startDate.toISOString().split('T')[0] + "_to_" + endDate.toISOString().split('T')[0] + ".json";
    runExport(securityReport, fileName);
}

// Sample function to export data to a file
function runExport(data, fileName) {
    print("Exporting report to " + fileName);
    // This command assumes the use of a MongoDB environment that supports file export
    // mongoexport --db IoTSecuritySystem --collection SecurityEvents --out fileName --jsonArray --pretty
}

// Example of generating a report for the last month
var startDate = ISODate("2024-08-01T00:00:00Z")
var endDate = ISODate("2024-08-31T23:59:59Z")
generateSecurityReport(startDate, endDate)

// Data cleanup: Archive and delete old events to manage database size
function archiveOldData(cutoffDate) {
    // Step 1: Copy old data to an archive collection
    db.SecurityEvents.find({ timestamp: { $lt: cutoffDate } }).forEach(function(doc) {
        db.ArchivedSecurityEvents.insertOne(doc);
    });

    // Step 2: Remove old data from the active SecurityEvents collection
    db.SecurityEvents.deleteMany({ timestamp: { $lt: cutoffDate } });

    print("Archived and deleted security events older than: " + cutoffDate);
}

// Example usage: Archive and delete events older than 6 months
var cutoffDate = new Date();
cutoffDate.setMonth(cutoffDate.getMonth() - 6);
archiveOldData(cutoffDate);

// Example cron job for automated maintenance
// # Example cron job (Linux) for running the archive script every first day of the month at midnight
// 0 0 1 * * mongo --eval "archiveOldData(new Date().setMonth(new Date().getMonth() - 6));" IoTSecuritySystem
