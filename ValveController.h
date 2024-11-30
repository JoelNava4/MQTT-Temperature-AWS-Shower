#ifndef VALVECONTROLLER_H
#define VALVECONTROLLER_H

#include "MQTTHandler.h"
#include <ArduinoJson.h>

class ValveController {
  private:
    int valvePin;
    int valveState = 0;
    MQTTHandler* mqttHandler;
    const char* UPDATE_TOPIC;

    StaticJsonDocument<128> outputDoc;
    char outputBuffer[128];

  public:
    ValveController(int pin, MQTTHandler* mqttHandler, const char* UPDATE_TOPIC);
    void Begin();
    void SetValveState(int state);
    void ReportState();
    void HandleIncomingMessage(const String& MESSAGE);
};

#endif // VALVECONTROLLER_H
