# **IoT Device Lifecycle Management**

## **Overview**
The IoT Device Lifecycle Management script is designed to handle the full lifecycle of IoT devices, from their initial registration to their eventual decommissioning. This script ensures that all device-related information is accurately tracked and maintained, providing a clear history of each device's operational lifecycle.

## **Key Features**
- **Device Registration:** Register new devices with complete metadata, including location, firmware version, and manufacturer details.
- **Device Updates:** Update and log any changes to device information, such as firmware updates or changes in status, ensuring that the device history is fully documented.
- **Decommissioning:** Safely retire devices from active service, moving them into an archived state while preserving their historical data.
- **Lifecycle Reporting:** Generate detailed reports on the lifecycle of individual devices, including their registration, updates, and decommissioning history.
- **Active and Decommissioned Device Summaries:** Generate summaries of all active and decommissioned devices, providing a clear overview of the current state of your IoT infrastructure.

## **Usage**

- **Register a New Device:**
  Use the `registerDevice()` function to add a new device to the system, including all relevant metadata.
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
  Use the `updateDevice()` function to update a device's information, such as its firmware version or operational status.
  ```javascript
  updateDevice("sensor_005", { firmwareVersion: "v1.1.0" });
  ```

- **Decommission a Device:**
  Safely retire a device using the `decommissionDevice()` function, moving it into an archived state.
  ```javascript
  decommissionDevice("sensor_005");
  ```

- **Generate Device Lifecycle Report:**
  Generate a detailed report on a device's lifecycle using the `generateDeviceLifecycleReport()` function.
  ```javascript
  generateDeviceLifecycleReport("sensor_005");
  ```

- **List All Active Devices:**
  Generate a summary of all active devices in the system with the `listActiveDevices()` function.
  ```javascript
  listActiveDevices();
  ```

- **List All Decommissioned Devices:**
  Generate a summary report of all decommissioned devices with the `listDecommissionedDevices()` function.
  ```javascript
  listDecommissionedDevices();