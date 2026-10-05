import { Buffer } from 'node:buffer';
// Small class-project uploads share the free D1 database. File access is
// still checked by the API before this adapter returns any bytes.
export function fileBucket(db){return {
 async put(key,data){if(data.byteLength>1024*1024)throw Error('Files must be 1 MB or smaller.');await db.prepare('INSERT INTO file_objects(object_key,data) VALUES (?,?)').bind(key,Buffer.from(data).toString('base64')).run();},
 async get(key){const row=await db.prepare('SELECT data FROM file_objects WHERE object_key=?').bind(key).first();return row?{body:Buffer.from(row.data,'base64')}:null;},
 async delete(key){await db.prepare('DELETE FROM file_objects WHERE object_key=?').bind(key).run();}
};}
