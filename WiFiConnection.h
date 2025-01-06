#ifndef WIFICONNECTION_H
#define WIFICONNECTION_H

#include <WiFiManager.h>

class WiFiConnection {
  private:
    WiFiManager wifiManager;

  public:
    WiFiConnection();
    void Connect();
};

#endif // WIFICONNECTION_H

