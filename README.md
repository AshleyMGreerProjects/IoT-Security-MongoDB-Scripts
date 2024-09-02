# **IoT-Security-MongoDB-Scripts**

## **Overview**
The **IoT-Security-MongoDB-Scripts** repository is a collection of MongoDB-based scripts tailored for comprehensive IoT security management. These scripts cover various aspects of managing IoT devices, including lifecycle management, real-time anomaly detection, performance analytics, and centralized security event logging. The goal of this repository is to provide robust and scalable solutions to ensure the security, efficiency, and reliability of IoT environments.

## **Repository Structure**

### **1. IoT Device Lifecycle Management**
- **Filename:** `IoTSec-Lifecycle.js`
- **Description:** Handles the entire lifecycle of IoT devices from registration through updates to decommissioning. This script ensures that all device-related activities are logged, providing a complete operational history.
- **Key Features:**
  - Register new devices with detailed metadata.
  - Update and log device information changes.
  - Safely decommission devices and archive their histories.
  - Generate detailed lifecycle and status reports.

### **2. Real-Time Anomaly Detection and Incident Response**
- **Filename:** `IoTSec-AD_IS.js`
- **Description:** Monitors IoT devices continuously for real-time anomalies. The script detects events such as temperature spikes, unauthorized access, and battery failures, triggering alerts and initiating automatic incident responses.
- **Key Features:**
  - Continuous real-time monitoring of device data.
  - Detection and alerting of various anomaly types.
  - Automated incident response and logging.
  - Anomaly resolution and historical reporting.

### **3. Comprehensive Device Performance Analytics**
- **Filename:** `IoTSec-DataInfo_Collection.js`
- **Description:** Provides analytics on device performance, including uptime tracking, battery usage analysis, and predictive maintenance needs. The script helps optimize the operational efficiency of IoT devices.
- **Key Features:**
  - Uptime tracking and performance analysis.
  - Battery usage monitoring and reporting.
  - Identification of devices with frequent maintenance issues.
  - Predictive maintenance analytics based on historical data.
  - Comprehensive performance and maintenance reports.

### **4. Centralized Security Event Management**
- **Filename:** `IoTSec-Management.js`
- **Description:** Centralizes the management of security events, including logging, alerting, and threat analysis. It also provides tools for generating security reports and archiving old events to maintain database performance.
- **Key Features:**
  - Centralized logging and analysis of security events.
  - Automated alerts for critical security incidents.
  - Dynamic security report generation.
  - Data cleanup and archiving of outdated security events.

## **Usage**

### **IoT Device Lifecycle Management**
- **Register a New Device:**
  ```javascript
  registerDevice({
      deviceId: "sensor_005",
      deviceName: "Indoor Humidity Sensor",
      location: "Office Building - 2nd Floor",
      firmwareVersion: "v1.0.0",
      manufacturer: "SensorTech Inc."
  });
  ```
- **Update Device Information:**
  ```javascript
  updateDevice("sensor_005", { firmwareVersion: "v1.1.0" });
  ```
- **Decommission a Device:**
  ```javascript
  decommissionDevice("sensor_005");
  ```

### **Real-Time Anomaly Detection and Incident Response**
- **Monitor Anomalies:**
  ```javascript
  monitorAnomalies();
  ```
- **Resolve an Anomaly:**
  ```javascript
  resolveAnomaly(anomalyId);
  ```

### **Comprehensive Device Performance Analytics**
- **Track Device Uptime:**
  ```javascript
  trackDeviceUptime();
  ```
- **Analyze Battery Usage:**
  ```javascript
  analyzeBatteryUsage();
  ```
- **Generate Performance Report:**
  ```javascript
  generatePerformanceReport();
  ```

### **Centralized Security Event Management**
- **Log Security Events:**
  ```javascript
  db.SecurityEvents.insertMany([...]);
  ```
- **Generate Security Report:**
  ```javascript
  generateSecurityReport(startDate, endDate);
  ```
- **Archive Old Security Events:**
  ```javascript
  archiveOldData(cutoffDate);
  ```

## **Contributing**

Contributions are welcome! If you have ideas for new features or improvements, feel free to submit issues or pull requests.

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## **Contact**

For any questions or support, you can reach out via [ashleymgreerjr@gmail.com](mailto:ashleymgreerjr@gmail.com).
