#include "ValveController.h"
#include <Arduino.h>

ValveController::ValveController(int pin, MQTTHandler* mqttHandler, const char* UPDATE_TOPIC)
    : valvePin(pin), mqttHandler(mqttHandler), UPDATE_TOPIC(UPDATE_TOPIC) {}

void ValveController::Begin() {
    pinMode(valvePin, OUTPUT);
    digitalWrite(valvePin, LOW); 
    Serial.println("Valve initialized and set to OFF");
    ReportState();
}

void ValveController::SetValveState(int state) {
    if (valveState != state) {
        valveState = state;
        digitalWrite(valvePin, valveState ? HIGH : LOW);
        if (valveState) {
            Serial.println("Valve is ON");
        } else {
            Serial.println("Valve is OFF");
        }
        ReportState();
    }
}

void ValveController::ReportState() {
    outputDoc["state"]["reported"]["state_valve"] = valveState;
    serializeJson(outputDoc, outputBuffer);
    mqttHandler->Publish(UPDATE_TOPIC, outputBuffer);
    Serial.println("Valve state reported to MQTT");
}

void ValveController::HandleIncomingMessage(const String& MESSAGE) {
    StaticJsonDocument<128> inputDoc;
    DeserializationError error = deserializeJson(inputDoc, MESSAGE);
    if (!error) {
        int newState = inputDoc["state"]["state_valve"].as<int>();
        SetValveState(newState);
    } else {
        Serial.println("Failed to parse JSON message for valve state");
    }
}
