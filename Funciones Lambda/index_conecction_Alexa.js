const Alexa = require('ask-sdk-core');
const AWS = require('aws-sdk');
const IotData = new AWS.IotData({endpoint: 'a1wpqxeafukdx9-ats.iot.us-east-1.amazonaws.com'});
const dynamoDB = new AWS.DynamoDB.DocumentClient();

//const deviceName1 = Alexa.getSlotValue(handlerInput.requestEnvelope, 'deviceName');

// Parámetros para el dispositivo motorTemperature
const MotorParams = {
    thingName: 'motorTemperature',
    TurnOnPayload: '{"state": {"desired": {"builtInmotor": 1}}}',
    TurnOffPayload: '{"state": {"desired": {"builtInmotor": 0}}}',
};

// Parámetros para el dispositivo shower_0001
const ShowerParams = {
    thingName: 'shower_0001',
    TurnOnPayload: '{"state": {"desired": {"state_valve": 1, "state_cooler": 0, "state_heater": 0}}}',
    TurnOffPayload: '{"state": {"desired": {"state_valve": 0}}}',

    TurnOnPayloadCooler: '{"state": {"desired": {"state_valve": 0, "state_cooler": 1, "state_heater": 0}}}',
    TurnOffPayloadCooler: '{"state": {"desired": {"state_cooler": 0}}}',    

    TurnOnPayloadHeater: '{"state": {"desired": {"state_valve": 0, "state_cooler": 0, "state_heater": 1}}}',
    TurnOffPayloadHeater: '{"state": {"desired": {"state_heater": 0}}}',

};
const SetDeviceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetDeviceIntent';
    },
    handle(handlerInput) {
        const deviceName = Alexa.getSlotValue(handlerInput.requestEnvelope, 'deviceName');
        
        // Almacena el deviceName en el contexto de la sesión
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.deviceName = deviceName;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        const speakOutput = Dispositivo configurado a ${deviceName}. ¿Qué deseas hacer ahora?;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

function getShadowPromise(params) {
    return new Promise((resolve, reject) => {
        IotData.getThingShadow(params, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                reject('Failed to get thing shadow ${err.errorMessage}');
            } else {
                resolve(JSON.parse(data.payload));
            }
        });
    });
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {

        const speakOutput = 'Se bienvenido xd, ¿Qué deseas hacer?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/*
//------------------------------------------------------------------
const TurnOnVentiladorIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOnVentiladorIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const thingName = sessionAttributes.deviceName || MotorParams.thingName; // Usa el thingName almacenado o el predeterminado

        const params = {
            thingName:thingName,
            payload: MotorParams.TurnOnPayload
        };

        var speakOutput = "Error";
        IotData.updateThingShadow(params,(err, data) => {
            if (err) console.log(err);
        });
      
        speakOutput = 'Solicitaste encender el motor-ventilador!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const TurnOffVentiladorIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOffVentiladorIntent';
    },
    handle(handlerInput) {
        const params = {
            thingName:MotorParams.thingName,
            payload: MotorParams.TurnOffPayload
        };

        var speakOutput = "Error";
        IotData.updateThingShadow(params,(err, data) => {
            if (err) console.log(err);
        });
      
        speakOutput = 'Solicitaste apagar el motor :)   !';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
//----------------------------------------------------------------
const TurnOnIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOnValveIntent';
    },
    handle(handlerInput) {
        const params = {
            thingName:ShowerParams.thingName,
            payload: ShowerParams.TurnOnPayload
        };

        var speakOutput = "Error";
        IotData.updateThingShadow(params,(err, data) => {
            if (err) console.log(err);
        });
        

        speakOutput = 'Solicitaste encender el valve!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const TurnOffIntentHandler = {
    
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOffValveIntent';
    },
    handle(handlerInput) {
        const params = {
            thingName:ShowerParams.thingName,
            payload: ShowerParams.TurnOffPayload
        };
        var speakOutput = "Error";
        IotData.updateThingShadow(params,(err, data) => {
            if (err) console.log(err);
        });
      
        speakOutput = 'Solicitaste apagar el valve!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
//---------------------------------------------------------------------
const TurnOnCoolerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOnCoolerIntent';
    },
    handle(handlerInput) {
        const params = {
            thingName:ShowerParams.thingName,
            payload: ShowerParams.TurnOnPayloadCooler
        };

        var speakOutput = "Error";
        IotData.updateThingShadow(params,(err, data) => {
            if (err) console.log(err);
        });
      
        speakOutput = 'Solicitaste encender el cooler!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const TurnOffCoolerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOffCoolerIntent';
    },
    handle(handlerInput) {
        const params = {
            thingName:ShowerParams.thingName,
            payload: ShowerParams.TurnOffPayloadCooler
        };

        var speakOutput = "Error";
        IotData.updateThingShadow(params,(err, data) => {
            if (err) console.log(err);
        });
      
        speakOutput = 'Solicitaste apagar el cooler!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
//-----------------------------------------------------------------------------
const TurnOnHeaterIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOnHeaterIntent';
    },
    handle(handlerInput) {
        const params = {
            thingName:ShowerParams.thingName,
            payload: ShowerParams.TurnOnPayloadHeater
        };

        var speakOutput = "Error";
        IotData.updateThingShadow(params,(err, data) => {
            if (err) console.log(err);
        });
      
        speakOutput = 'Solicitaste encender el calentador!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const TurnOffHeaterIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOffHeaterIntent';
    },
    handle(handlerInput) {
        const params = {
            thingName:ShowerParams.thingName,
            payload: ShowerParams.TurnOffPayloadHeater
        };

        var speakOutput = "Error";
        IotData.updateThingShadow(params,(err, data) => {
            if (err) console.log(err);
        });
      
        speakOutput = 'Solicitaste apagar el calentador!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const StateIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StateValveIntent';
    },
    async handle(handlerInput) {
        var valve = 'unknown';
        await getShadowPromise(ShowerParams.thingName).then((result) => valve = result.state.reported.state_valve);
        console.log(valve);

        var speakOutput = 'Error';
        if (valve == 0) {
            speakOutput = 'La valvula se encuentra apagada';
        } else if (valve == 1) {
            speakOutput = 'La valvula se encuentra encendida';
        } else {
            speakOutput = 'No se pudo consultar el estado de la motor, por favor intente más tarde';
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const StateCoolerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StateCoolerIntent';
    },
    async handle(handlerInput) {
        var cooler = 'unknown';
        await getShadowPromise(ShowerParams.thingName).then((result) => cooler = result.state.reported.state_cooler);
        console.log(cooler);

        var speakOutput = 'Error';
        if (cooler == 0) {
            speakOutput = 'El enfriador se encuentra apagada';
        } else if (cooler == 1) {
            speakOutput = 'El enfriador se encuentra encendida';
        } else {
            speakOutput = 'No se pudo consultar el estado de la motor, por favor intente más tarde';
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const StateHeaterIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StateHeaterIntent';
    },
    async handle(handlerInput) {
        var cooler = 'unknown';
        await getShadowPromise(ShowerParams.thingName).then((result) => cooler = result.state.reported.state_heater);
        console.log(cooler);

        var speakOutput = 'Error';
        if (cooler == 0) {
            speakOutput = 'El calentador se encuentra apagada';
        } else if (cooler == 1) {
            speakOutput = 'El calentador se encuentra encendida';
        } else {
            speakOutput = 'No se pudo consultar el estado de la motor, por favor intente más tarde';
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const StateIntentTemperatureHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StateIntentTemperature';
    },
    async handle(handlerInput) {
        var temperature = 'unknown';
        await getShadowPromise(ShowerParams.thingName).then((result) => temperature = result.state.reported.temperature);
        console.log(temperature);

        var speakOutput = 'la temperatura actual es de: ' + temperature + ' centigrados ';
                

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const StateTemperatureWaterIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StateTemperatureWaterIntent';
    },
    async handle(handlerInput) {
        var temperature = 'unknown';
        await getShadowPromise(ShowerParams.thingName).then((result) => temperature = result.state.reported.temperature_water);
        console.log(temperature);

        var speakOutput = 'la temperatura actual del agua es de: ' + temperature + ' centigrados ';
                

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const PrepareShowerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PrepareShowerIntent';
    },
    handle(handlerInput) {

        var speakOutput = "Error";
        speakOutput = 'Como deseas que este el agua?. Fria, Caliente o segun la temperatura ambiente';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

function activateHeater() {
    const params = {
        thingName:ShowerParams.thingName,
        payload: ShowerParams.TurnOnPayloadHeater
    };
    
    IotData.updateThingShadow(params, (err, data) => {
        if (err) {
            console.log('Error al encender el calentador:', err);
        } else {
            console.log('Calentador activado:', data);
        }
    });
}

function activateCooler() {
    const params = {
        thingName:ShowerParams.thingName,
        payload: ShowerParams.TurnOnPayloadCooler
    };
    IotData.updateThingShadow(params, (err, data) => {
        if (err) {
            console.log('Error al encender el enfriador:', err);
        } else {
            console.log('Enfriador activado:', data);
        }
    });
}

*/
const StateTemperatureEnviromentIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StateTemperatureEnviromentIntent';
    },
    async handle(handlerInput) {
        var temperature = 'unknown';
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const thingName = sessionAttributes.deviceName || ShowerParams.thingName;
        await getShadowPromise({thingName: thingName}).then((result) => temperature = result.state.reported.temperature_enviroment);
        console.log(temperature);

        var speakOutput = 'la temperatura actual es de: ' + temperature + ' centigrados ';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }

    
};
const WaterAmbientTemperatureIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'WaterAmbientTemperatureIntent';
    },
    async handle(handlerInput) {
        var temperature = 'unknown';
        await getShadowPromise(ShowerParams.thingName).then((result) => temperature = result.state.reported.temperature_enviroment);
        let speakOutput = '';
        
        if (isNaN(temperature)) {
            speakOutput = 'Hubo un problema al obtener la temperatura ambiente. Intenta nuevamente más tarde.';
        } else {
            speakOutput = 'Estoy acondicionando el agua segun la temperatura ambiente. ';
            const testTemperature = parseFloat(temperature);
            if (testTemperature < 21.0) {
                speakOutput += ' El calentador se ha encendido para alcanzar la temperatura adecuada para el agua.';
                activateHeater();

            } else if (testTemperature >= 21.0) {
                speakOutput += ' El enfriador se ha encendido para alcanzar la temperatura adecuada para el agua.';
                activateCooler();
            } 
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Tienes las opciones de encender, apagar el motor y consultar el estado de la temperatura.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Hasta pronto!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Lo siento, no entendí, intenta de nuevo.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log('Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}');
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = 'Intentó ejecutar ${intentName}';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Disculpa, hubo un error. Intenta de nuevo.';
        console.log( 'Error handled: ${JSON.stringify(error)}');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/*
const ShowerValveStateIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ShowerValveStateIntent';
    },
    async handle(handlerInput) {
        var valveState = 'unknown';
        await getShadowPromise(ShowerParams.thingName).then((result) => valveState = result.state.reported.state_valve)
        console.log(valveState);    
        
        var speakOutput = valveState;
        if (valveState === 0) {
            speakOutput = 'La válvula está cerrada.';
        } else if (valveState === 1) {
            speakOutput = 'La válvula está abierta.';
        } else {
            speakOutput = 'No se pudo consultar el estado de la válvula. Por favor, intenta más tarde.';
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
*/
// Manejadores de encendido y apagado del ventilador
const TurnOnVentiladorIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOnVentiladorIntent';
    },
    async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        //const thingName = sessionAttributes.deviceName || MotorParams.thingName;
        const thingName = deviceName1;

        const params = {
            thingName: thingName,
            payload: MotorParams.TurnOnPayload
        };

        var speakOutput = "Error";
        IotData.updateThingShadow(params, (err, data) => {
            if (err) console.log(err);
        });

        speakOutput = 'Solicitaste encender el motor! de motor';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const TurnOffVentiladorIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOffVentiladorIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
       // const thingName = sessionAttributes.deviceName || MotorParams.thingName;
       const thingName = deviceName1;


        const params = {
            thingName: thingName,
            payload: MotorParams.TurnOffPayload
        };

        var speakOutput = "Error";
        IotData.updateThingShadow(params, (err, data) => {
            if (err) console.log(err);
        });

        speakOutput = 'Solicitaste apagar el motor :)!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Manejadores para el dispositivo de ducha
const TurnOnIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOnValveIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const thingName = sessionAttributes.deviceName || ShowerParams.thingName;

        const params = {
            thingName: thingName,
            payload: ShowerParams.TurnOnPayload
        };

        var speakOutput = "Error";
        IotData.updateThingShadow(params, (err, data) => {
            if (err) console.log(err);
        });

        speakOutput = 'Solicitaste encender la válvula ducha 001!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const TurnOffIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOffValveIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const thingName = sessionAttributes.deviceName || ShowerParams.thingName;

        const params = {
            thingName: thingName,
            payload: ShowerParams.TurnOffPayload
        };

        var speakOutput = "Error";
        IotData.updateThingShadow(params, (err, data) => {
            if (err) console.log(err);
        });

        speakOutput = 'Solicitaste apagar la válvula ducha 001!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Manejadores para el enfriador
const TurnOnCoolerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOnCoolerIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const thingName = sessionAttributes.deviceName || ShowerParams.thingName;

        const params = {
            thingName: thingName,
            payload: ShowerParams.TurnOnPayloadCooler
        };

        var speakOutput = "Error";
        IotData.updateThingShadow(params, (err, data) => {
            if (err) console.log(err);
        });

        speakOutput = 'Solicitaste encender el enfriador!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const TurnOffCoolerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOffCoolerIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const thingName = sessionAttributes.deviceName || ShowerParams.thingName;

        const params = {
            thingName: thingName,
            payload: ShowerParams.TurnOffPayloadCooler
        };

        var speakOutput = "Error";
        IotData.updateThingShadow(params, (err, data) => {
            if (err) console.log(err);
        });

        speakOutput = 'Solicitaste apagar el enfriador!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Manejadores para el calentador
const TurnOnHeaterIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOnHeaterIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const thingName = sessionAttributes.deviceName || ShowerParams.thingName;

        const params = {
            thingName: thingName,
            payload: ShowerParams.TurnOnPayloadHeater
        };

        var speakOutput = "Error";
        IotData.updateThingShadow(params, (err, data) => {
            if (err) console.log(err);
        });

        speakOutput = 'Solicitaste encender el calentador!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const TurnOffHeaterIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TurnOffHeaterIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const thingName = sessionAttributes.deviceName || ShowerParams.thingName;

        const params = {
            thingName: thingName,
            payload: ShowerParams.TurnOffPayloadHeater
        };

        var speakOutput = "Error";
        IotData.updateThingShadow(params, (err, data) => {
            if (err) console.log(err);
        });

        speakOutput = 'Solicitaste apagar el calentador!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Consultar el estado de la válvula
const StateIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StateValveIntent';
    },
    async handle(handlerInput) {
        var valve = 'unknown';
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const thingName = sessionAttributes.deviceName || ShowerParams.thingName;

        await getShadowPromise({ thingName: thingName }).then((result) => valve = result.state.reported.state_valve);
        console.log(valve);

        var speakOutput = 'Error';
        if (valve == 0) {
            speakOutput = 'La válvula se encuentra apagada';
        } else if (valve == 1) {
            speakOutput = 'La válvula se encuentra encendida';
        } else {
            speakOutput = 'No se pudo consultar el estado de la válvula, por favor intente más tarde';
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Consultar el estado del enfriador
const StateCoolerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StateCoolerIntent';
    },
    async handle(handlerInput) {
        var cooler = 'unknown';
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const thingName = sessionAttributes.deviceName || ShowerParams.thingName;

        await getShadowPromise({ thingName: thingName }).then((result) => cooler = result.state.reported.state_cooler);
        console.log(cooler);

        var speakOutput = 'Error';
        if (cooler == 0) {
            speakOutput = 'El enfriador se encuentra apagado';
        } else if (cooler == 1) {
            speakOutput = 'El enfriador se encuentra encendido';
        } else {
            speakOutput = 'No se pudo consultar el estado del enfriador, por favor intente más tarde';
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Consultar el estado del calentador
const StateHeaterIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StateHeaterIntent';
    },
    async handle(handlerInput) {
        var heater = 'unknown';
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const thingName = sessionAttributes.deviceName || ShowerParams.thingName;

        await getShadowPromise({ thingName: thingName }).then((result) => heater = result.state.reported.state_heater);
        console.log(heater);

        var speakOutput = 'Error';
        if (heater == 0) {
            speakOutput = 'El calentador se encuentra apagado';
        } else if (heater == 1) {
            speakOutput = 'El calentador se encuentra encendido';
        } else {
            speakOutput = 'No se pudo consultar el estado del calentador, por favor intente más tarde';
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const StateTemperatureWaterIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StateTemperatureWaterIntent';
    },
    async handle(handlerInput) {
        var temperature = 'unknown';
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const thingName = sessionAttributes.deviceName || ShowerParams.thingName;
        await getShadowPromise({thingName: thingName}).then((result) => temperature = result.state.reported.temperature_water);
        console.log(temperature);

        var speakOutput = 'la temperatura actual del agua es de: ' + temperature + ' centigrados ';
                

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */

/*************************************** SHOWER  ***********************************************************************/
const turnOnShowerHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'turnOnShowerIntent';
    },
    async handle(handlerInput) {
        const skillId = handlerInput.requestEnvelope.context.System.application.applicationId;
        const adviceName = handlerInput.requestEnvelope.request.intent.slots.deviceShower.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        if (!adviceName) {
            const speakOutput = 'No pude identificar el dispositivo. Por favor, intenta nuevamente especificando el nombre del dispositivo.';
            return handlerInput.responseBuilder.speak(speakOutput).getResponse();
        }
        const TurnOnPayload = '{"state": {"desired": {"state_valve": 1, "state_cooler": 0, "state_heater": 0}}}';
        const dynamoParams = {
            TableName: 'userAlexa', // Asegúrate de que el nombre de la tabla es correcto
            Key: { userId: skillId}
        };
        try {
            const data = await dynamoDB.get(dynamoParams).promise();
            if (data.Item && data.Item.adviceName.includes(adviceName)) {
                const params = {
                    thingName: adviceName,
                    payload: TurnOnPayload
                };
                await IotData.updateThingShadow(params).promise();
                const speakOutput = El valve de ${adviceName} se ha encendido correctamente. ¿Qué más deseas hacer?;
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt(speakOutput) 
                    .getResponse();
            } else {
                const speakOutput = No se encontró el dispositivo ${adviceName} asociado a tu cuenta.;
                return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput) // Repite la misma respuesta como reprompt
                .getResponse();            }
        } catch (err) {
            console.error('Error al consultar DynamoDB o actualizar la sombra del dispositivo:', err);
            const speakOutput = 'Hubo un error al intentar encender el ventilador. Intenta nuevamente.';
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput) // Repite la misma respuesta como reprompt
            .getResponse();        }
    }
};
const turnOffShowerHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'turnOffShowerIntent';
    },
    async handle(handlerInput) {
        const skillId = handlerInput.requestEnvelope.context.System.application.applicationId;
        const adviceName = handlerInput.requestEnvelope.request.intent.slots.deviceShower.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        if (!adviceName) {
            const speakOutput = 'No pude identificar el dispositivo. Por favor, intenta nuevamente especificando el nombre del dispositivo.';
            return handlerInput.responseBuilder.speak(speakOutput).getResponse();
        }
        const TurnOnPayload = '{"state": {"desired": {"state_valve": 0, "state_cooler": 0, "state_heater": 0}}}';
        const dynamoParams = {
            TableName: 'userAlexa', // Asegúrate de que el nombre de la tabla es correcto
            Key: { userId: skillId}
        };
        try {
            const data = await dynamoDB.get(dynamoParams).promise();
            if (data.Item && data.Item.adviceName.includes(adviceName)) {
                const params = {
                    thingName: adviceName,
                    payload: TurnOnPayload
                };
                await IotData.updateThingShadow(params).promise();
                const speakOutput = El valve de ${adviceName} se ha encendido correctamente. ¿Qué más deseas hacer?;
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt(speakOutput) 
                    .getResponse();
            } else {
                const speakOutput = No se encontró el dispositivo ${adviceName} asociado a tu cuenta.;
                return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput) // Repite la misma respuesta como reprompt
                .getResponse();            }
        } catch (err) {
            console.error('Error al consultar DynamoDB o actualizar la sombra del dispositivo:', err);
            const speakOutput = 'Hubo un error al intentar encender el ventilador. Intenta nuevamente.';
            return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput) // Repite la misma respuesta como reprompt
            .getResponse();        }
    }
};


exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        /*
        LaunchRequestHandler,
        TurnOnIntentHandler,
        TurnOffIntentHandler,
        StateIntentHandler,
        StateIntentTemperatureHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        ShowerValveStateIntentHandler,
        StateCoolerIntentHandler,
        StateHeaterIntentHandler,
        StateTemperatureWaterIntentHandler,
        TurnOnCoolerIntentHandler,
        TurnOffCoolerIntentHandler,
        TurnOnHeaterIntentHandler,
        TurnOffHeaterIntentHandler,
        TurnOnVentiladorIntentHandler,
        TurnOffVentiladorIntentHandler,
        PrepareShowerIntentHandler,
        WaterAmbientTemperatureIntentHandler,
        SetDeviceIntentHandler,
        IntentReflectorHandler*/
        LaunchRequestHandler,
        SetDeviceIntentHandler,
        StateTemperatureWaterIntentHandler,
        StateTemperatureEnviromentIntentHandler,
        TurnOnVentiladorIntentHandler,
        TurnOffVentiladorIntentHandler,
        TurnOnIntentHandler,
        TurnOffIntentHandler,
        TurnOnCoolerIntentHandler,
        TurnOffCoolerIntentHandler,
        TurnOnHeaterIntentHandler,
        TurnOffHeaterIntentHandler,
        StateIntentHandler,
        StateCoolerIntentHandler,
        StateHeaterIntentHandler,
        /** shower**/
        turnOnShowerHandler,
        turnOffShowerHandler,

        IntentReflectorHandler
    )
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();