#ifndef HEATERCONTROLLER_H
#define HEATERCONTROLLER_H

#include "MQTTHandler.h"
#include <ArduinoJson.h>

class HeaterController {
  private:
    int heaterPin;
    int heaterState = 0;
    MQTTHandler* mqttHandler;
    const char* UPDATE_TOPIC;

    StaticJsonDocument<128> outputDoc;
    char outputBuffer[128];

  public:
    HeaterController(int pin, MQTTHandler* mqttHandler, const char* UPDATE_TOPIC);
    void Begin();
    void SetHeaterState(int state);
    void ReportState();
    void HandleIncomingMessage(const String& MESSAGE);
};

#endif // HEATERCONTROLLER_H