#include "SensorDS18B20.h"
#include <Arduino.h>

SensorDS18B20::SensorDS18B20(int pin, MQTTHandler* mqttHandler, const char* UPDATE_TOPIC)
    : ds18b20Pin(pin), ds18b20(ds18b20Pin), sensorDs18b20(&ds18b20), mqttHandler(mqttHandler), UPDATE_TOPIC(UPDATE_TOPIC) {
}

void SensorDS18B20::Begin() {
    sensorDs18b20.begin();
    Serial.println("DS18B20 sensor initialized");
}

float SensorDS18B20::GetTemperature() {
    sensorDs18b20.requestTemperatures();
    return sensorDs18b20.getTempCByIndex(0);
}

void SensorDS18B20::UpdateTemperature() {
    float currentTemperature = GetTemperature();

    if (currentTemperature != DEVICE_DISCONNECTED_C) {
        if (((currentTemperature - lastTemperature)>= 1.00) || ((currentTemperature - lastTemperature) <= -1.00)) {
            lastTemperature = currentTemperature;
            outputDoc["state"]["reported"]["temperature_water"] = currentTemperature;
            serializeJson(outputDoc, outputBuffer);
            mqttHandler->Publish(UPDATE_TOPIC, outputBuffer);

            Serial.print("Temperature water updated in shadow: ");
            Serial.println(currentTemperature);
        }
    } else {
        Serial.println("Failed to read temperature from DS18B20 sensor");
    }
}
