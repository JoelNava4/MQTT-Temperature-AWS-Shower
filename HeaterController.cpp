#include "HeaterController.h"
#include <Arduino.h>

HeaterController::HeaterController(int pin, MQTTHandler* mqttHandler, const char* UPDATE_TOPIC)
    : heaterPin(pin), mqttHandler(mqttHandler), UPDATE_TOPIC(UPDATE_TOPIC) {}

void HeaterController::Begin() {
    pinMode(heaterPin, OUTPUT);
    digitalWrite(heaterPin, LOW); 
    Serial.println("Heater initialized and set to OFF");
    ReportState();
}

void HeaterController::SetHeaterState(int state) {
    if (heaterState != state) {
        heaterState = state;
        digitalWrite(heaterPin, heaterState ? HIGH : LOW);
        if (heaterState) {
            Serial.println("Heater is ON");
        } else {
            Serial.println("Heater is OFF");
        }
        ReportState();
    }
}

void HeaterController::ReportState() {
    outputDoc["state"]["reported"]["state_heater"] = heaterState;
    serializeJson(outputDoc, outputBuffer);
    mqttHandler->Publish(UPDATE_TOPIC, outputBuffer);
    Serial.println("Heater state reported to MQTT");
}

void HeaterController::HandleIncomingMessage(const String& MESSAGE) {
    StaticJsonDocument<128> inputDoc;
    DeserializationError error = deserializeJson(inputDoc, MESSAGE);
    if (!error) {
        int newState = inputDoc["state"]["state_heater"].as<int>();
        SetHeaterState(newState);
    } else {
        Serial.println("Failed to parse JSON message for heater state");
    }
}
