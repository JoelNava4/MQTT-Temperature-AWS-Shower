#include "WiFiConnection.h"

WiFiConnection::WiFiConnection() {
}

void WiFiConnection::Connect() {
  const char* apName = "AutoConnectAP";
  const char* apPassword = "password123";

  Serial.println("Starting captive portal...");

  if (!wifiManager.autoConnect(apName, apPassword)) {
    Serial.println("Connection failed, restarting...");
    delay(3000);
    ESP.restart();
  }

  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}



