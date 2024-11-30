#ifndef SENSORDS18B20_H
#define SENSORDS18B20_H

#include <OneWire.h>
#include <DallasTemperature.h>
#include "MQTTHandler.h"
#include <ArduinoJson.h>

class SensorDS18B20 {
  private:
    int ds18b20Pin;
    float lastTemperature;
    OneWire ds18b20;
    DallasTemperature sensorDs18b20;
    MQTTHandler* mqttHandler;
    const char* UPDATE_TOPIC;

    StaticJsonDocument<128> outputDoc;
    char outputBuffer[128];

  public:
    SensorDS18B20(int pin, MQTTHandler* mqttHandler, const char* UPDATE_TOPIC);
    void Begin();
    void UpdateTemperature();
    float GetTemperature();
};

#endif // SENSORDS18B20_H
