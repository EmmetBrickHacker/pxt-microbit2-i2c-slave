#include "pxt.h"
#include "NRF52TWIS.h"

// Hardware driver for BBC micro:bit v2 (nRF52 CODAL architecture)
namespace i2c_slave {
    static NRF52TWIS* slaveI2C = nullptr;
    static Action handlerAction;
    static uint8_t rxBuffer[64];
    static int rxLength = 0;

    /**
     * Initialize the hardware NRF52 TWIS (Two-Wire Interface Slave) peripheral.
     * Maps custom SCL and SDA pins and sets the 7-bit I2C Slave address.
     */
    //%
    void initSlaveCPP(int sclPin, int sdaPin, int addr) {
        // Retrieve pointers to NRF52Pin objects from MakeCode pin IDs
        NRF52Pin* scl = (NRF52Pin*)getPin(sclPin);
        NRF52Pin* sda = (NRF52Pin*)getPin(sdaPin);

        if (scl == nullptr || sda == nullptr) return;

        // Clean up previous instance if already allocated
        if (slaveI2C != nullptr) {
            delete slaveI2C;
            slaveI2C = nullptr;
        }

        // Instantiate hardware I2C Slave on nRF52833 using CODAL pin references
        slaveI2C = new NRF52TWIS(*scl, *sda, (uint16_t)addr);
    }

    /**
     * Register an event callback handler in TypeScript when data arrives.
     */
    //%
    void registerHandler(Action body) {
        pxt::incr(body);
        handlerAction = body;
    }

    /**
     * Fetch the received byte buffer.
     */
    //%
    Buffer getBufferCPP() {
        if (rxLength <= 0) return pxt::mkBuffer(NULL, 0);
        return pxt::mkBuffer(rxBuffer, rxLength);
    }
}
