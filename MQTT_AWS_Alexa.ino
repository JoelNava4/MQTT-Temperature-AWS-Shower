#include <Arduino.h>
#include "WiFiConnection.h"
#include "MQTTHandler.h"
#include "SensorDHT.h"
#include "SensorDS18B20.h"
#include "ValveController.h"
#include "CoolerController.h"
#include "HeaterController.h"

const char* WIFI_SSID = "jota";
const char* WIFI_PASS = "joelnava4";
const char* MQTT_BROKER = "a1wpqxeafukdx9-ats.iot.us-east-1.amazonaws.com";
const int MQTT_PORT = 8883;
const char* CLIENT_ID = "ESP-32-SHORWER";
const char* UPDATE_TOPIC = "$aws/things/shower_0001/shadow/update";
const char* UPDATE_DELTA_TOPIC = "$aws/things/shower_0001/shadow/update/delta";

const int DHT_PIN = 4;
const int DHT_TYPE = DHT22;
const int DS18B20_PIN = 5;
const int VALVE_PIN = 14;
const int COOLER_PIN = 26;
const int HEATER_PIN = 32;

const char AMAZON_ROOT_CA1[] PROGMEM = R"EOF(-----BEGIN CERTIFICATE-----
MIIDQTCCAimgAwIBAgITBmyfz5m/jAo54vB4ikPmljZbyjANBgkqhkiG9w0BAQsF
ADA5MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRkwFwYDVQQDExBBbWF6
b24gUm9vdCBDQSAxMB4XDTE1MDUyNjAwMDAwMFoXDTM4MDExNzAwMDAwMFowOTEL
MAkGA1UEBhMCVVMxDzANBgNVBAoTBkFtYXpvbjEZMBcGA1UEAxMQQW1hem9uIFJv
b3QgQ0EgMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALJ4gHHKeNXj
ca9HgFB0fW7Y14h29Jlo91ghYPl0hAEvrAIthtOgQ3pOsqTQNroBvo3bSMgHFzZM
9O6II8c+6zf1tRn4SWiw3te5djgdYZ6k/oI2peVKVuRF4fn9tBb6dNqcmzU5L/qw
IFAGbHrQgLKm+a/sRxmPUDgH3KKHOVj4utWp+UhnMJbulHheb4mjUcAwhmahRWa6
VOujw5H5SNz/0egwLX0tdHA114gk957EWW67c4cX8jJGKLhD+rcdqsq08p8kDi1L
93FcXmn/6pUCyziKrlA4b9v7LWIbxcceVOF34GfID5yHI9Y/QCB/IIDEgEw+OyQm
jgSubJrIqg0CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMC
AYYwHQYDVR0OBBYEFIQYzIU07LwMlJQuCFmcx7IQTgoIMA0GCSqGSIb3DQEBCwUA
A4IBAQCY8jdaQZChGsV2USggNiMOruYou6r4lK5IpDB/G/wkjUu0yKGX9rbxenDI
U5PMCCjjmCXPI6T53iHTfIUJrU6adTrCC2qJeHZERxhlbI1Bjjt/msv0tadQ1wUs
N+gDS63pYaACbvXy8MWy7Vu33PqUXHeeE6V/Uq2V8viTO96LXFvKWlJbYK8U90vv
o/ufQJVtMVT8QtPHRh8jrdkPSHCa2XV4cdFyQzR1bldZwgJcJmApzyMZFo6IQ6XU
5MsI+yMRQ+hDKXJioaldXgjUkK642M4UwtBV8ob2xJNDd2ZhwLnoQdeXeGADbkpy
rqXRfboQnoZsG4q5WTP468SQvvG5
-----END CERTIFICATE-----)EOF";

const char CERTIFICATE[] PROGMEM = R"KEY(-----BEGIN CERTIFICATE-----
MIIDWjCCAkKgAwIBAgIVANxrxnZuaIiOFaXr2RBH0UZ3YkYdMA0GCSqGSIb3DQEB
CwUAME0xSzBJBgNVBAsMQkFtYXpvbiBXZWIgU2VydmljZXMgTz1BbWF6b24uY29t
IEluYy4gTD1TZWF0dGxlIFNUPVdhc2hpbmd0b24gQz1VUzAeFw0yNDExMjkxNDU0
MzZaFw00OTEyMzEyMzU5NTlaMB4xHDAaBgNVBAMME0FXUyBJb1QgQ2VydGlmaWNh
dGUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCk2CVn/NNaOoO/0nlE
2oqPWeFkblP2r7z9cntl+peDWu5ybQuIIfgSpufCXwajGgRSD7ocnLV+7gOaIIrV
qRXyMfQ8Bcb0DL9B1TLU4DWRKuzkhY6YpmO3eUjzKc4ibaiSTlNguLT2ox9Vrnnh
10DM0pOxor7kKW5bk2PjUSEQdBbBN2KSp0V+K+GtT24mx8I2dXilz4ry3LMAu/rm
4M1eToDCM8PfE33UyLqfuY4VYHpfO8R3VAbQQVtEByPM7VCaGUjGgPbwpzsAhTVK
YO/o074/GjTP/gWEmsXOsaeWLiX0yFCsOfkat0/DNjsszleYT9o9ivqOvj4ReBU9
ZMkbAgMBAAGjYDBeMB8GA1UdIwQYMBaAFH2221VucWhrelvO5bdq8VFsrZFtMB0G
A1UdDgQWBBRyzF/pkEkUqYTMeqnsaeB7Nt0dJzAMBgNVHRMBAf8EAjAAMA4GA1Ud
DwEB/wQEAwIHgDANBgkqhkiG9w0BAQsFAAOCAQEASPo1zr2hffaSl4XHug1oqHEE
UPzyCJrj2+/otBZjDWGnrFJmp2UZB9eJwm7/zFw2TYgapyLzcbz082WOxUCX6liK
+6FTtndU4k+k6G7EZ/uInOhg4G2mjA1AByQ1Wz91M8Or56hLWn0WppCS6dW3aA5n
bRFfNvY0gUUXGDeUBGyrzE60OAnChZwmQ3JLlTRQLYoxavcvmxLOH35FXLgmqf+o
YO424lP80CwMOySdhaVRaM3rio4uRQLKP4zoehNhe+FmaHNq1paV/cajbmum0CT6
jYDO5qL9MW78i2i2sWAN7afIumZZZrHwWRnzRE4JoJLRl2w2/UHOY5ePBowxtg==
-----END CERTIFICATE-----
)KEY";

const char PRIVATE_KEY[] PROGMEM = R"KEY(
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEApNglZ/zTWjqDv9J5RNqKj1nhZG5T9q+8/XJ7ZfqXg1rucm0L
iCH4Eqbnwl8GoxoEUg+6HJy1fu4DmiCK1akV8jH0PAXG9Ay/QdUy1OA1kSrs5IWO
mKZjt3lI8ynOIm2okk5TYLi09qMfVa554ddAzNKTsaK+5CluW5Nj41EhEHQWwTdi
kqdFfivhrU9uJsfCNnV4pc+K8tyzALv65uDNXk6AwjPD3xN91Mi6n7mOFWB6XzvE
d1QG0EFbRAcjzO1QmhlIxoD28Kc7AIU1SmDv6NO+Pxo0z/4FhJrFzrGnli4l9MhQ
rDn5GrdPwzY7LM5XmE/aPYr6jr4+EXgVPWTJGwIDAQABAoIBAQCM/eqQlKhZRi8l
xGnAwIM+tQuZENxz5D/rLx3oTXuF+CJ2cFoqp5M8sNENaKWOn1QOtDDlBAwgcodW
LntQ3/xLWPqi0/YlCzoSnr2JYfOvJF3V333lhntHlE8W3CzZOZ2y9ZdO5Oyy/zZv
3HmW9rsP9RQqHR7Um7MuVFRdOyjinmjkEBU1nvgig5lJ8lTu4qY2jCrsNumoUWZ8
j6pPiILno/dq88YXyoFoz9KZ6tvBdVL33J08Ia01HLqfVM0SLVMnabFpQNbLDpJy
GAw236z1RTH2Ar4fLf0zBWxx4P4luZaCQY381AEKfWVnPeu68BRQwfe5jQdHiP7R
MBHd+jXRAoGBAM8hLOPiGCHmYF64yLMGE701496TvIcn/i9OWVi8oVKSVSPGiMDL
B/6pfVth+M7R8b27wWGUZSfC8YTkWeizvBsjLXU/1INo+56C5J/+z28Ihjk+inkT
/J8V2AmTfJkIjLtnVNK6gC9J8a1eaZKziLijmuraTB8Vkqp8V8hvkdHlAoGBAMu8
5m/d0Un3qstV4PP9o7XSpBnH+HHHcGiwByuU0f84tgD/vtiuFoHGg0jDdahYOdJF
kE2QbiFAgi0lnTnluquS1LtMWgHUbTpepsZQPIMJYMAOtPaO2vixCyu01r0QqzdL
ACoS2t9Z8fZeiVz1Z5EDdPxE1bh6a5rFKs75Hn7/AoGACYNajnTZ6uSr1G3kOeSz
j2MkPhrG8+YwVHfivqKbPjGeW3BI46HvkhCywzmytb0Kv04aSaMJKlRXx2S9hGSM
5Souck4mMorl05frbDXFzTG1CHgI4Bq85YmZTIdLl7O+0vSh/rO2I3Xf9bh6XNSG
GQTanqK8EElrXQ0s8vW82skCgYEAyRuez5/CfmQF6I7N7apZ1hmluHkm6ZD3ia7w
dPmCzI57QcMw7IvzVYjRgJrH4jOsZ74Y8id2PkaB+PSfHU6CE+htKrD0S8gXRb22
nB0JjkNMiGg8AwECbue74hmwupHgoETdVaqk+EG90PaCWws2fvNNn9KGsIHPA8hK
OGG505sCgYBqxCFCezojfgm3Hm6I3+Yke+ne3jUM+qQyrpHMG/C70NXOcZO1yja2
573jR/2K3sjs2VZUzHA869OoxlmT15vuubgY3EUbGQ5FfufzkGRSy2T+9nmDA0pW
SuiiIbtNPz6hzAyFV4p7O4o1ORpuoBtQxshp3sFiJjNc7VR/FRHELA==
-----END RSA PRIVATE KEY-----
)KEY";

WiFiConnection wifi(WIFI_SSID, WIFI_PASS);
MQTTHandler mqttHandler(MQTT_BROKER, MQTT_PORT, CLIENT_ID, UPDATE_TOPIC, UPDATE_DELTA_TOPIC);
SensorDHT sensorDHT(DHT_PIN, DHT_TYPE, &mqttHandler, UPDATE_TOPIC);
SensorDS18B20 sensorDS18B20(DS18B20_PIN, &mqttHandler, UPDATE_TOPIC);
ValveController valveController(VALVE_PIN, &mqttHandler, UPDATE_TOPIC);
CoolerController coolerController(COOLER_PIN, &mqttHandler, UPDATE_TOPIC);
HeaterController heaterController(HEATER_PIN, &mqttHandler, UPDATE_TOPIC);

void callback(char* topic, byte* payload, unsigned int length) {
    String message;
    for (unsigned int i = 0; i < length; i++) {
        message += (char)payload[i];
    }
    Serial.println("Message received on topic " + String(topic) + ": " + message);

    if (String(topic) == UPDATE_DELTA_TOPIC) {
        StaticJsonDocument<256> doc;
        DeserializationError error = deserializeJson(doc, message);
        
        if (doc.containsKey("state")) {
            JsonObject state = doc["state"];

            if (state.containsKey("state_valve")) {
                coolerController.SetCoolerState(0); 
                heaterController.SetHeaterState(0);
                valveController.HandleIncomingMessage(message);
            }

            if (state.containsKey("state_cooler")) {
                valveController.SetValveState(0); 
                heaterController.SetHeaterState(0);
                coolerController.HandleIncomingMessage(message);
            }

            if (state.containsKey("state_heater")) {
                valveController.SetValveState(0); 
                coolerController.SetCoolerState(0);
                heaterController.HandleIncomingMessage(message);
            }
        } else {
            Serial.println("No valid 'state' key found in the message");
        }
    }
}

void setup() {
    Serial.begin(115200);
    wifi.Connect();
    mqttHandler.SetCertificates(AMAZON_ROOT_CA1, CERTIFICATE, PRIVATE_KEY);
    mqttHandler.SetCallback(callback);
    mqttHandler.Connect();

    sensorDHT.Begin();
    sensorDS18B20.Begin();
    valveController.Begin();
    coolerController.Begin();
    heaterController.Begin();
}

void loop() {
    if (!mqttHandler.IsConnected()) {
        mqttHandler.Connect();
    }
    mqttHandler.Loop();
    sensorDHT.UpdateTemperature();
    sensorDS18B20.UpdateTemperature();

    delay(5000); 
}