import fs from 'fs'; import path from 'path'; const root=path.resolve('./backend/.data'); fs.mkdirSync(root,{recursive:true});
const f=p=>path.join(root,p), R=p=>fs.existsSync(p)?JSON.parse(fs.readFileSync(p,'utf8')):[], W=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2));
const U=f('users.json'), S=f('subs.json'), O=f('orders.json'), E=f('events.json');
export default {
  users:{
    list(){return R(U)}, find(email){return R(U).find(x=>x.email===email)},
    upsert(u){const a=R(U); const i=a.findIndex(x=>x.email===u.email); i>=0?a[i]={...a[i],...u}:a.push(u); W(U,a); return u;}
  },
  subs:{
    list(){return R(S)}, get(email){return R(S).find(x=>x.email===email)},
    upsert(s){const a=R(S); const i=a.findIndex(x=>x.email===s.email);
      const v={email:s.email,plan:s.plan,expiresAt:new Date(s.expiresAt).toISOString(),status:s.status||'active'};
      i>=0?a[i]=v:a.push(v); W(S,a); return v;}
  },
  orders:{
    list(){return R(O)}, upsert(o){const a=R(O); const i=a.findIndex(x=>x.id===o.id); i>=0?a[i]={...a[i],...o}:a.push(o); W(O,a); return o;},
    byRz(id){return R(O).find(x=>x.rz_order_id===id)}
  },
  events:{
    push(e){const a=R(E); a.push({...e,ts:new Date().toISOString()}); W(E,a); return e;}, list(){return R(E)}
  }
}
