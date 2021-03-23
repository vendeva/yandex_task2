function sort(t,e,r=!1){return t.sort(((t,a)=>{const o=Number(`${t[e]}`.match(/\d+/g)),i=Number(`${a[e]}`.match(/\d+/g));return o>i?r?1:-1:i>o?r?-1:1:0}))}function wordCommit(t,e){const r=Math.abs(t)%100,a=Math.abs(t)%10;return r>10&&r<20?e[2]:a>1&&a<5?e[1]:1==a?e[0]:e[2]}function commitsOfSprint(t,e,r){return t.filter((t=>{const{timestamp:a}=t;return e<=a&&a<=r}))}function commitsGroupBySize(t,e){return t.reduce(((t,r)=>{const{summaries:a}=r,o=e.filter((t=>a.includes(t.id))).map((t=>t.added+t.removed)).reduce(((t,e)=>t+e),0);switch(!0){case o>1001:++t["> 1001 строки"];break;case o>500&&o<=1e3:++t["501 — 1000 строк"];break;case o>100&&o<=500:++t["101 — 500 строк"];break;case o>=1&&o<=100:++t["1 — 100 строк"]}return t}),{"> 1001 строки":0,"501 — 1000 строк":0,"101 — 500 строк":0,"1 — 100 строк":0,countCommits:t.length})}function renderCategory(t,e){const r=e[1][t],a=e[0][t];return{title:t,valueText:`${r} ${wordCommit(r,["коммит","коммита","коммитов"])}`,differenceText:`${r-a} ${wordCommit(r-a,["коммит","коммита","коммитов"])}`}}function prepareData(t,{sprintId:e}){const r=t.find((t=>t.id===e)),{name:a,startAt:o,finishAt:n}=r;console.log(r);let[s,u,m,c,d]=[[],[],[],[],[]];t.forEach((t=>{const{type:e,createdAt:r,author:a,summaries:i}=t;"User"===e&&s.push(t),"Sprint"===e&&u.push(t),"Comment"===e&&o<=r&&r<=n&&(t.author="object"==typeof a?a.id:a,m.push(t)),"Commit"===e&&(t.author="object"==typeof a?a.id:a,t.summaries=i.map((t=>"object"==typeof t?t.id:t)),c.push(t)),"Summary"===e&&d.push(t)})),u=sort(u,"id",!0),s=sort(s,"id",!0);const l=m.reduce(((t,e)=>{let{author:r,likes:a}=e;return a&&(t[r]=(t[r]?t[r]:0)+a.length),t}),{}),p={alias:"vote",data:{title:"Самый внимательный разработчик",subtitle:a,emoji:"🔎",users:sort(s.map((t=>{const{id:e,name:r,avatar:a}=t;return{id:e,name:r,avatar:a,valueText:`${l[e]} голосов`}})),"valueText")}},h=commitsOfSprint(c,o,n),f=h.reduce(((t,e)=>{let{author:r}=e;return t[r]=(t[r]?t[r]:0)+1,t}),{}),b=s.map((t=>{const{id:e,name:r,avatar:a}=t;return{id:e,name:r,avatar:a,valueText:`${f[e]}`}})),v={alias:"leaders",data:{title:"Больше всего коммитов",subtitle:a,emoji:"👑",users:sort(b,"valueText")}},y={alias:"chart",data:{title:"Коммиты",subtitle:a,values:u.map((t=>{const{id:r,name:a,startAt:o,finishAt:i}=t,n=r===e?{active:!0}:{};return{id:r,hint:a,valueText:`${commitsOfSprint(c,o,i).length}`,...n}})),users:sort(b,"valueText")}},C=u.findIndex((t=>t.id===e)),g=[u[C-1],r].reduce(((t,e)=>{const{startAt:r,finishAt:a}=e;return[...t,commitsGroupBySize(commitsOfSprint(c,r,a),d)]}),[]),x=g[1].countCommits,$=g[1].countCommits-g[0].countCommits,w={alias:"diagram",data:{title:"Размер коммитов",subtitle:a,totalText:`${x} ${wordCommit(x,["коммит","коммита","коммитов"])}`,differenceText:`${$} с прошлого спринта`,categories:[renderCategory("> 1001 строки",g),renderCategory("501 — 1000 строк",g),renderCategory("101 — 500 строк",g),renderCategory("1 — 100 строк",g)]}},S={sun:[],mon:[],tue:[],wed:[],thu:[],fri:[],sat:[]};for(key in S)for(i=0;i<24;i++)S[key].push(0);return[p,v,y,w,{alias:"activity",data:{title:"Коммиты",subtitle:a,data:h.reduce(((t,e)=>{const{timestamp:r}=e,a=new Date(r),o=a.toLocaleString("en",{weekday:"short",timeZone:"Europe/Moscow"}).toLowerCase(),i=Number(a.toLocaleString("en",{hour12:!1,hour:"numeric",timeZone:"Europe/Moscow"}));return t[o][i]=t[o][i]?++t[o][i]:1,t}),S)}}]}module.exports={prepareData};