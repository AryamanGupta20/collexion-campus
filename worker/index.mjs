import { handleApi } from '../server/api.mjs';
import { fileBucket } from './d1-files.mjs';
export default {
 async fetch(request,env){
  if(new URL(request.url).pathname.startsWith('/api/'))return handleApi(request,{DB:env.DB,BUCKET:fileBucket(env.DB),ADMIN_SETUP_TOKEN:env.ADMIN_SETUP_TOKEN,TRUST_SITES_AUTH:false});
  return env.ASSETS.fetch(request);
 }
};
