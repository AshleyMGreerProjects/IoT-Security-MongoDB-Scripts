// Connect to the MongoDB database
use IoTSecuritySystem

// Setup Collections and Indexes
db.createCollection("Anomalies")
db.createCollection("IncidentResponses")
db.createCollection("ResolvedAnomalies")

db.Anomalies.createIndex({ deviceId: 1, timestamp: 1 })
db.IncidentResponses.createIndex({ incidentId: 1, timestamp: 1 })
db.ResolvedAnomalies.createIndex({ anomalyId: 1 })

// Monitor device data for anomalies
function monitorAnomalies() {
    db.DeviceData.watch().forEach(change => {
        const deviceData = change.fullDocument;

        // Detect various anomalies
        detectTemperatureSpike(deviceData);
        detectUnauthorizedAccess(deviceData);
        detectBatteryFailure(deviceData);
        detectNetworkAnomalies(deviceData);  // New function
    });
}

// Detect temperature spike
function detectTemperatureSpike(deviceData) {
    if (deviceData.readings.temperature > 50) {
        const anomaly = createAnomaly(deviceData, "Temperature Spike", `Temperature of ${deviceData.readings.temperature}°C detected.`);
        triggerAlert(anomaly);
        respondToIncident(anomaly);
    }
}

// Detect unauthorized access
function detectUnauthorizedAccess(deviceData) {
    if (deviceData.readings.motionDetected && deviceData.metadata.deviceType === "Security Camera") {
        const anomaly = createAnomaly(deviceData, "Unauthorized Access", "Motion detected in a restricted area.");
        triggerAlert(anomaly);
        respondToIncident(anomaly);
    }
}

// Detect battery failure
function detectBatteryFailure(deviceData) {
    if (deviceData.readings.battery < 10) {
        const anomaly = createAnomaly(deviceData, "Battery Failure", `Battery level critically low: ${deviceData.readings.battery}%`);
        triggerAlert(anomaly);
        respondToIncident(anomaly);
    }
}

// Detect network anomalies (e.g., unexpected traffic)
function detectNetworkAnomalies(deviceData) {
    if (deviceData.readings.networkTraffic > 1000) {  // Example threshold
        const anomaly = createAnomaly(deviceData, "Network Anomaly", `High network traffic detected: ${deviceData.readings.networkTraffic} MB.`);
        triggerAlert(anomaly);
        respondToIncident(anomaly);
    }
}

// Create an anomaly entry
function createAnomaly(deviceData, type, description) {
    const anomaly = {
        deviceId: deviceData.deviceId,
        timestamp: new Date(),
        type: type,
        description: description,
        status: "unresolved"
    };
    db.Anomalies.insertOne(anomaly);
    return anomaly;
}

// Trigger an alert for detected anomalies
function triggerAlert(anomaly) {
    print("ALERT: Anomaly detected!");
    printjson(anomaly);
    // Insert code to send email or post to Slack/Teams
}

// Automatically respond to critical incidents
function respondToIncident(anomaly) {
    const response = {
        incidentId: anomaly._id,
        deviceId: anomaly.deviceId,
        timestamp: new Date(),
        response: "Incident response initiated.",
        status: "in-progress"
    };
    db.IncidentResponses.insertOne(response);
    print("Incident response initiated for:", anomaly.deviceId);
}

// Resolve an anomaly
function resolveAnomaly(anomalyId) {
    const anomaly = db.Anomalies.findOne({ _id: anomalyId });
    if (anomaly) {
        anomaly.status = "resolved";
        db.ResolvedAnomalies.insertOne(anomaly);
        db.Anomalies.deleteOne({ _id: anomalyId });
        print("Anomaly resolved:", anomalyId);
    } else {
        print("Anomaly not found:", anomalyId);
    }
}

// Monitor for anomalies continuously
monitorAnomalies();