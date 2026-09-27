// Auto-generated. Do not edit.
declare namespace i2c_slave {

    /**
     * Initialize the hardware NRF52 TWIS (Two-Wire Interface Slave) peripheral.
     * Maps custom SCL and SDA pins and sets the 7-bit I2C Slave address.
     */
    //% shim=i2c_slave::initSlaveCPP
    function initSlaveCPP(sclPin: int32, sdaPin: int32, addr: int32): void;

    /**
     * Register an event callback handler in TypeScript when data arrives.
     */
    //% shim=i2c_slave::registerHandler
    function registerHandler(body: () => void): void;

    //% shim=i2c_slave::pollCPP
    function pollCPP(): void;

    /**
     * Fetch the received byte buffer.
     */
    //% shim=i2c_slave::getBufferCPP
    function getBufferCPP(): Buffer;
}

// Auto-generated. Do not edit. Really.
