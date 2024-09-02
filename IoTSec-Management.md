# **IoT Security Management System**

## **Overview**
The IoT Security Management System is a MongoDB-based solution designed to manage and monitor IoT devices. This script helps in logging security events, analyzing potential threats, monitoring device health, generating reports, and automating data cleanup tasks.

## **Features**

- **Collection Setup and Indexing**
  - Initializes collections (`DeviceData`, `SecurityEvents`, `DeviceHealth`, `ArchivedSecurityEvents`) and sets up indexes for efficient querying.
  - Implements a TTL (Time-To-Live) index to automatically remove old security events after 90 days.

- **Data Insertion**
  - Inserts IoT device data, including sensor readings, device metadata, and maintenance information.

- **Security Event Logging and Alerts**
  - Logs security events with details like severity, detection method, and IP address.
  - Automatically triggers alerts for critical events, such as unauthorized access attempts.

- **Device Health Monitoring**
  - Monitors device health by checking battery levels, maintenance status, and last maintenance date.
  - Logs and identifies devices requiring attention.

- **Advanced Threat Analysis**
  - Aggregates and analyzes security events based on IP address, event type, and time of day.
  - Displays the top 5 security threats based on event frequency.

- **Dynamic Report Generation**
  - Generates and exports security reports for specified date ranges.
  - Supports exporting reports to JSON files for further analysis or archiving.

- **Automated Data Cleanup**
  - Archives old security events to a separate collection and deletes them from the active collection.
  - Example provided for setting up a cron job to automate this task on a regular basis.