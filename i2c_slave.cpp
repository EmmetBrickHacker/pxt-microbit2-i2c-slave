#include "pxt.h"

using namespace pxt;

namespace i2c_slave {
    static uint8_t rxBuffer[64];
    static int rxLength = 0;
    static Action handlerAction = 0;

    /**
     * Initialize hardware TWIS directly via nRF52 registers (bypassing CODAL).
     */
    //%
    void initSlaveCPP(int sclPin, int sdaPin, int addr) {
        // Retrieve internal pin objects safely
        auto scl = getPin(sclPin);
        auto sda = getPin(sdaPin);
        if (!scl || !sda) return;

        // 1. Disable TWIS peripheral before configuration
        NRF_TWIS1->ENABLE = 0;

        // 2. Map GPIO pins directly to the hardware peripheral
        NRF_TWIS1->PSEL.SCL = scl->name;
        NRF_TWIS1->PSEL.SDA = sda->name;

        // 3. Set the 7-bit slave address
        NRF_TWIS1->ADDRESS[0] = addr;
        NRF_TWIS1->CONFIG = 1; // Enable listening on ADDRESS[0]
        NRF_TWIS1->ORC = 0x00; // Over-read character (sent if Master reads too much)

        // 4. Assign the RX memory buffer using internal EasyDMA
        NRF_TWIS1->RXD.PTR = (uint32_t)rxBuffer;
        NRF_TWIS1->RXD.MAXCNT = sizeof(rxBuffer);

        // 5. Enable the TWIS peripheral (value 6 = TWIS Enabled)
        NRF_TWIS1->ENABLE = 6;

        // 6. Clear state flags and prepare EasyDMA for the first incoming packet
        NRF_TWIS1->EVENTS_STOPPED = 0;
        NRF_TWIS1->TASKS_PREPARERX = 1;
    }

    /**
     * Store the TypeScript callback function pointer.
     */
    //%
    void registerHandler(Action body) {
        if (handlerAction != 0) {
            pxt::decr(handlerAction);
        }
        pxt::incr(body);
        handlerAction = body;
    }

    /**
     * Polled from a TypeScript background thread to check for new data.
     * Prevents interrupt priority crashes in MakeCode.
     */
    //%
    void pollCPP() {
        // If a transaction has completed (STOP condition detected on the I2C bus)
        if (NRF_TWIS1->EVENTS_STOPPED) {
            NRF_TWIS1->EVENTS_STOPPED = 0;

            // Read how many bytes were actually received by DMA
            rxLength = NRF_TWIS1->RXD.AMOUNT;

            // Fire the TypeScript event if data exists and handler is bound
            if (rxLength > 0 && handlerAction != 0) {
                pxt::runAction0(handlerAction);
            }

            // Prepare DMA memory for the next incoming packet
            NRF_TWIS1->TASKS_PREPARERX = 1;
        }
    }

    /**
     * Return the populated buffer to MakeCode.
     */
    //%
    Buffer getBufferCPP() {
        if (rxLength <= 0) return pxt::mkBuffer(NULL, 0);
        return pxt::mkBuffer(rxBuffer, rxLength);
    }
}
