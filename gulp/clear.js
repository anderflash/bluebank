import fs         from 'fs';
import path       from 'path';
export default function clear(dir, regex){
  let files = fs.readdirSync(dir);
  files.filter(name => regex.test(name)).forEach(file=> fs.unlinkSync(path.join(dir, file)));
}
