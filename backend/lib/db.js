import fs from 'fs'; import path from 'path';
const root = path.resolve('./backend/.data'); if(!fs.existsSync(root)) fs.mkdirSync(root,{recursive:true});
const f = p=>path.join(root,p);
const read = p => fs.existsSync(p)?JSON.parse(fs.readFileSync(p,'utf8')):[];
const write = (p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2));
const U = f('users.json'), S=f('subs.json');

export default {
  users:{
    list(){ return read(U); },
    upsert(u){ const a=read(U); const i=a.findIndex(x=>x.email===u.email); i>=0?a[i]={...a[i],...u}:a.push(u); write(U,a); return u;}
  },
  subs:{
    list(){ return read(S); },
    upsert(s){ const a=read(S); const i=a.findIndex(x=>x.email===s.email);
      const v={email:s.email,plan:s.plan,expiresAt:s.expiresAt}; i>=0?a[i]=v:a.push(v); write(S,a); return v;}
  }
}
