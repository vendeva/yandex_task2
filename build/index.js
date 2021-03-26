function sort(t,e,r=!1){return t.sort(((t,a)=>{const i=Number(`${t[e]}`.match(/\d+/g)),o=Number(`${a[e]}`.match(/\d+/g));return i>o?r?1:-1:o>i?r?-1:1:0}))}function wordCommit(t,e){const r=Math.abs(t)%100,a=Math.abs(t)%10;return r>10&&r<20?e[2]:a>1&&a<5?e[1]:1==a?e[0]:e[2]}function commitsOfSprint(t,e,r){return t.filter((t=>{const{timestamp:a}=t;return e<=a&&a<=r}))}function commitsGroupBySize(t,e){return t.reduce(((t,r)=>{const{summaries:a}=r,i=e.filter((t=>a.includes(t.id))).map((t=>t.added+t.removed)).reduce(((t,e)=>t+e),0);switch(!0){case i>1001:++t["> 1001 строки"];break;case i>500&&i<=1e3:++t["501 — 1000 строк"];break;case i>100&&i<=500:++t["101 — 500 строк"];break;case i>=0&&i<=100:++t["1 — 100 строк"]}return t}),{"> 1001 строки":0,"501 — 1000 строк":0,"101 — 500 строк":0,"1 — 100 строк":0,countCommits:t.length})}function renderCategory(t,e){const r=e[1][t],a=e[0]?e[0][t]:0;return{title:t,valueText:`${r} ${wordCommit(r,["коммит","коммита","коммитов"])}`,differenceText:`${r>a?"+":r<a?"-":""}${Math.abs(r-a)} ${wordCommit(r-a,["коммит","коммита","коммитов"])}`}}function prepareData(t,{sprintId:e}){const r=t.find((t=>"Sprint"===t.type&&t.id===e)),{name:a,startAt:o,finishAt:s}=r;let[n,u,m,c,d]=[[],[],[],[],[]];t.forEach((t=>{const{type:e,createdAt:r,author:a,summaries:i}=t;"User"===e&&n.push(t),"Sprint"===e&&u.push(t),"Comment"===e&&o<=r&&r<=s&&(t.author="object"==typeof a?a.id:a,m.push(t)),"Commit"===e&&(t.author="object"==typeof a?a.id:a,t.summaries=i.map((t=>"object"==typeof t?t.id:t)),c.push(t)),"Summary"===e&&d.push(t)})),u=sort(u,"id",!0),n=sort(n,"id",!0);const l=m.reduce(((t,e)=>{let{author:r,likes:a}=e;return a&&(t[r]=(t[r]?t[r]:0)+a.length),t}),{}),p={alias:"vote",data:{title:"Самый внимательный разработчик",subtitle:a,emoji:"🔎",users:sort(n.map((t=>{const{id:e,name:r,avatar:a}=t;return{id:e,name:r,avatar:a,valueText:`${l[e]} ${wordCommit(l[e],["голос","голоса","голосов"])}`}})),"valueText")}},h=commitsOfSprint(c,o,s),f=h.reduce(((t,e)=>{let{author:r}=e;return t[r]=(t[r]?t[r]:0)+1,t}),{});let b=n.reduce(((t,e)=>{const{id:r,name:a,avatar:i}=e;return f[r]&&(t=[...t,{id:r,name:a,avatar:i,valueText:`${f[r]}`}]),t}),[]);const y={alias:"leaders",data:{title:"Больше всего коммитов",subtitle:a,emoji:"👑",users:sort(b,"valueText")}},C={alias:"chart",data:{title:"Коммиты",subtitle:a,values:u.map((t=>{const{id:r,name:a,startAt:i,finishAt:o}=t,s={title:`${r}`,hint:a,value:commitsOfSprint(c,i,o).length};return r===e&&(s.active=!0),s})),users:sort(b,"valueText")}},v=u.findIndex((t=>t.id===e)),$=[u[v-1],r].reduce(((t,e)=>{if(e){const{startAt:r,finishAt:a}=e;t=[...t,commitsGroupBySize(commitsOfSprint(c,r,a),d)]}else t=[...t,0];return t}),[]),g=$[1].countCommits,w=$[1].countCommits-($[0]?$[0].countCommits:0),x={alias:"diagram",data:{title:"Размер коммитов",subtitle:a,totalText:`${g} ${wordCommit(g,["коммит","коммита","коммитов"])}`,differenceText:`${w>0?"+":w<0?"-":""}${Math.abs(w)} с прошлого спринта`,categories:[renderCategory("> 1001 строки",$),renderCategory("501 — 1000 строк",$),renderCategory("101 — 500 строк",$),renderCategory("1 — 100 строк",$)]}},S={sun:[],mon:[],tue:[],wed:[],thu:[],fri:[],sat:[]};for(key in S)for(i=0;i<24;i++)S[key].push(0);return[p,y,C,x,{alias:"activity",data:{title:"Коммиты",subtitle:a,data:h.reduce(((t,e)=>{const{timestamp:r}=e,a=new Date(r),i=a.toLocaleString("en",{weekday:"short",timeZone:"Europe/Moscow"}).toLowerCase();let o=Number(a.toLocaleString("en",{hour12:!1,hour:"numeric",timeZone:"Europe/Moscow"}));return o=24!==o?o:0,t[i][o]=++t[i][o],t}),S)}}]}module.exports={prepareData};