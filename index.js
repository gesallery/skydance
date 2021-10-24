import net from 'net';

console.log('running');
const socket = net.Socket();
let seq = 0;

const incSeq = () => {
  seq = seq + 1;
  if (seq > 255) seq = 0;
  return seq;
};

export const zonePower = (zone, onOff) => {
  console.log('Connection made');
  const dataWritten = () => console.log('Data written');

  const prefixBuffer = Buffer.from('55AA5AA57E', 'hex');
  const seqBuf = Buffer.allocUnsafe(1);
  seqBuf.writeUInt8(incSeq);
  const fixedBuf = Buffer.from('8011803071537B', 'hex');
  const zoneBuf = Buffer.allocUnsafe(1);
  zoneBuf.writeUInt8(zone);
  const functionBuf = Buffer.from('000A0100', 'hex');
  const onOffBuf = Buffer.allocUnsafe(1);
  onOffBuf.writeUInt8(onOff);
  const postfixBuffer = Buffer.from('007E', 'hex');

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
    dataWritten
  );
};

socket.on('data', (data) => console.log(data));

socket.connect('8899', '192.168.1.159', () => {
  zonePower(4, 1);
});
