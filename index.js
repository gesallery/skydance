import net from 'net';

const PORT = '8899';

export const zonePower = (zone, onOff) => {
    const prefixBuffer = Buffer.from('55AA5AA57E', 'hex');
    const seqBuf = Buffer.allocUnsafe(1);
    // seqBuf.writeUInt8(incSeq);
    seqBuf.writeUInt8(new Date().getTime() % 255);
    const fixedBuf = Buffer.from('8011803071537B', 'hex');
    const zoneBuf = Buffer.allocUnsafe(1);
    zoneBuf.writeUInt8(zone);
    const functionBuf = Buffer.from('000A0100', 'hex');
    const onOffBuf = Buffer.allocUnsafe(1);
    onOffBuf.writeUInt8(onOff);
    const postfixBuffer = Buffer.from('007E', 'hex');

    const socket = net.Socket();
    socket.setNoDelay(true);

    // socket.on('data', (data) => console.log(data));

    socket.connect(PORT, '192.168.1.159', () => {
        socket.write(
            Buffer.concat([
                prefixBuffer,
                seqBuf,
                fixedBuf,
                zoneBuf,
                functionBuf,
                onOffBuf,
                postfixBuffer,
            ]),
            () => {
                socket.end();
            }
        );
    });
};

if (process.argv.length > 2) {
    const args = process.argv.slice(2);

    zonePower(args[0], args[1]);
}
