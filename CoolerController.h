#ifndef COOLERCONTROLLER_H
#define COOLERCONTROLLER_H

#include "MQTTHandler.h"
#include <ArduinoJson.h>

class CoolerController {
  private:
    int coolerPin;
    int coolerState = 0;
    MQTTHandler* mqttHandler;
    const char* UPDATE_TOPIC;

    StaticJsonDocument<128> outputDoc;
    char outputBuffer[128];

  public:
    CoolerController(int pin, MQTTHandler* mqttHandler, const char* UPDATE_TOPIC);
    void Begin();
    void SetCoolerState(int state);
    void ReportState();
    void HandleIncomingMessage(const String& MESSAGE);
};

#endif // COOLERCONTROLLER_H