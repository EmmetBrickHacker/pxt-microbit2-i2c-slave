#include "pxt.h"
#include "codal-microbit-v2/inc/NRF52TWIS.h"

// Hardware driver for BBC micro:bit v2 (nRF52 CODAL architecture)
namespace i2c_slave {
    static NRF52TWIS * slaveI2C = nullptr;
    static Action handlerAction;
    static uint8_t rxBuffer[64];
    static int rxLength = 0;

    /**
     * Initialize the hardware NRF52 TWIS (Two-Wire Interface Slave) peripheral.
     * Maps custom SCL and SDA pins and sets the 7-bit I2C Slave address.
     */
    //%
    void initSlaveCPP(int sclPin, int sdaPin, int addr) {
        PinName scl = (PinName)getPin(sclPin) -> name;
        PinName sda = (PinName)getPin(sdaPin) -> name;

        // Clean up previous instance if already allocated
        if (slaveI2C != nullptr) {
            delete slaveI2C;
        }

        // Instantiate hardware I2C Slave on nRF52833
        slaveI2C = new NRF52TWIS((uint8_t)addr, scl, sda);
    }

    /**
     * Register a event callback handler in TypeScript when data arrives.
     */
    //%
    void registerHandler(Action body) {
        pxt:: incr(body);
        handlerAction = body;
    }

    /**
     * Fetch the received byte buffer.
     */
    //%
    Buffer getBufferCPP() {
        if (rxLength <= 0) return pxt:: mkBuffer(NULL, 0);
        return pxt:: mkBuffer(rxBuffer, rxLength);
    }
}