/**
 * I2C Slave extension for BBC micro:bit v2
 */
//% color="#0fbc11" icon="\uf1ec" block="I2C Slave"
namespace i2c_slave {
    export enum SlavePins {
        //% block="Pin 1 (P1)"
        P1 = DigitalPin.P1,
        //% block="Pin 2 (P2)"
        P2 = DigitalPin.P2,
        //% block="Pin 8 (P8)"
        P8 = DigitalPin.P8,
        //% block="Pin 12 (P12)"
        P12 = DigitalPin.P12
    }

    let isPolling = false;

    // C++ function shims
    //% shim=i2c_slave::initSlaveCPP
    function initSlaveCPP(scl: number, sda: number, addr: number): void { }

    //% shim=i2c_slave::registerHandler
    function registerHandler(a: () => void): void { }

    //% shim=i2c_slave::pollCPP
    function pollCPP(): void { }

    //% shim=i2c_slave::getBufferCPP
    function getBufferCPP(): Buffer { return pins.createBuffer(0) }

    /**
     * Initialize I2C Slave receiver on micro:bit v2.
     * Note: Supported on micro:bit v2 (nRF52) only.
     * @param scl Clock line pin for I2C Slave
     * @param sda Data line pin for I2C Slave
     * @param addr 7-bit target I2C address (default: 16 / 0x10)
     */
    //% block="start I2C slave | SCL %scl | SDA %sda | address %addr"
    //% scl.defl=i2c_slave.SlavePins.P1 sda.defl=i2c_slave.SlavePins.P2 addr.defl=16
    //% weight=100
    export function startSlave(scl: SlavePins, sda: SlavePins, addr: number): void {
        initSlaveCPP(scl, sda, addr);

        // Start a background thread to poll the hardware registers safely.
        // This avoids interrupt context issues in CODAL.
        if (!isPolling) {
            isPolling = true;
            control.inBackground(function () {
                while (true) {
                    pollCPP();
                    basic.pause(5); // 5 ms interval is fast enough for EV3 packets
                }
            })
        }
    }

    /**
     * Event triggered when data is received from an I2C Master
     */
    //% block="on I2C data received"
    //% weight=90
    export function onDataReceived(handler: () => void): void {
        registerHandler(handler);
    }

    /**
     * Get the last received raw data buffer
     */
    //% block="received buffer"
    //% weight=80
    export function getReceivedBuffer(): Buffer {
        return getBufferCPP();
    }
}
