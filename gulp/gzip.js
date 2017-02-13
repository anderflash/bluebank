import fs   from 'fs';
import zlib from 'zlib';

export default function gzip(inName, outName){
  const gzip      = zlib.createGzip();
  const inStream  = fs.createReadStream(inName);
  const outStream = fs.createWriteStream(outName);
  inStream.pipe(gzip).pipe(outStream);
}