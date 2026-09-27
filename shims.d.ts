// Auto-generated. Do not edit.
declare namespace i2c_slave {

    /**
     * Initialize hardware TWIS directly via nRF52 registers (bypassing CODAL).
     */
    //% shim=i2c_slave::initSlaveCPP
    function initSlaveCPP(sclPin: int32, sdaPin: int32, addr: int32): void;

    /**
     * Store the TypeScript callback function pointer.
     */
    //% shim=i2c_slave::registerHandler
    function registerHandler(body: () => void): void;

    /**
     * Polled from a TypeScript background thread to check for new data.
     * Prevents interrupt priority crashes in MakeCode.
     */
    //% shim=i2c_slave::pollCPP
    function pollCPP(): void;

    /**
     * Return the populated buffer to MakeCode.
     */
    //% shim=i2c_slave::getBufferCPP
    function getBufferCPP(): Buffer;
}

// Auto-generated. Do not edit. Really.
