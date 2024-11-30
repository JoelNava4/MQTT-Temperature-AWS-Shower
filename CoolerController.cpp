#include "CoolerController.h"
#include <Arduino.h>

CoolerController::CoolerController(int pin, MQTTHandler* mqttHandler, const char* UPDATE_TOPIC)
    : coolerPin(pin), mqttHandler(mqttHandler), UPDATE_TOPIC(UPDATE_TOPIC) {}

void CoolerController::Begin() {
    pinMode(coolerPin, OUTPUT);
    digitalWrite(coolerPin, LOW); 
    Serial.println("Cooler initialized and set to OFF");
    ReportState();
}

void CoolerController::SetCoolerState(int state) {
    if (coolerState != state) {
        coolerState = state;
        digitalWrite(coolerPin, coolerState ? HIGH : LOW);
        if (coolerState) {
            Serial.println("Cooler is ON");
        } else {
            Serial.println("Cooler is OFF");
        }
        ReportState();
    }
}

void CoolerController::ReportState() {
    outputDoc["state"]["reported"]["state_cooler"] = coolerState;
    serializeJson(outputDoc, outputBuffer);
    mqttHandler->Publish(UPDATE_TOPIC, outputBuffer);
    Serial.println("Cooler state reported to MQTT");
}

void CoolerController::HandleIncomingMessage(const String& MESSAGE) {
    StaticJsonDocument<128> inputDoc;
    DeserializationError error = deserializeJson(inputDoc, MESSAGE);
    if (!error) {
        int newState = inputDoc["state"]["state_cooler"].as<int>();
        SetCoolerState(newState);
    } else {
        Serial.println("Failed to parse JSON message for cooler state");
    }
}
