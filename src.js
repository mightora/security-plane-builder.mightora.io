(()=>{'use strict';
const planes=[['privileged','Privileged Access','High impact administrator identities & privileged access'],['control','Control Plane','Identity, tenant policy and policy enforcement'],['management','Management Plane','Operations, monitoring, lifecycle and governance'],['workload','Data / Workload Plane','Power Platform applications, data and integrated services'],['access','User & App Access','Human and non-human users of the solution']];
const types=['User / audience','Privileged administrator','Entra ID','Conditional Access','PIM / privileged access','Tenant / environment policy','DLP policy','Power Platform admin centre','ALM / pipelines','Monitoring / auditing','Model-driven app','Canvas app','Power Pages','Power Automate','Copilot Studio','Dataverse','SharePoint','External system / API','Azure API Management','Custom connector','Azure Function','Service principal / managed identity','Gateway','Device / browser','Security roles','Other'];
const N=(id,name,plane,type,detail='')=>({id,name,plane,type,detail}); const E=(from,to,label,kind='data')=>({from,to,label,kind});
const base=(workload,actors,integrations=[],extras=[])=>{let nodes=[N('pa','Platform administrators','privileged','Privileged administrator','Use least privilege and time-bound elevation where appropriate'),N('pim','Privileged Identity Management','privileged','PIM / privileged access'),N('entra','Microsoft Entra ID','control','Entra ID'),N('ca','Conditional Access','control','Conditional Access'),N('dlp','Connector data policies','control','DLP policy'),N('ppac','Power Platform admin centre','management','Power Platform admin centre'),N('alm','Solution lifecycle / pipelines','management','ALM / pipelines'),N('audit','Monitoring & audit','management','Monitoring / auditing'),...actors,...workload,...integrations,...extras];let edges=[E('pa','pim','role elevation','identity'),E('pim','ppac','administration','management'),E('ppac','dlp','governs','management'),E('ppac','audit','management telemetry','management'),E('alm',workload[0].id,'deploys','management'),E(actors[0].id,'entra','sign-in','identity'),E('entra','ca','policy evaluation','identity'),E('ca',workload[0].id,'authorised access','identity')];return {nodes,edges};};
const samples={
internal:()=>{let m=base([N('app','Case management app','workload','Model-driven app'),N('dv','Dataverse','workload','Dataverse','Data access is governed by configured security roles')],[N('staff','Internal employees','access','User / audience'),N('device','Managed browser/device','access','Device / browser')],[N('roles','Dataverse security roles','control','Security roles')]);m.edges.push(E('staff','device','uses','identity'),E('device','app','browser access','identity'),E('app','dv','business records'),E('roles','dv','authorisation','identity'));return m;},
canvas:()=>{let m=base([N('app','Team requests canvas app','workload','Canvas app'),N('sp','SharePoint list','workload','SharePoint')],[N('staff','Internal employees','access','User / audience')],[N('flow','Approval flow','workload','Power Automate')]);m.edges.push(E('app','sp','read/write'),E('app','flow','submit request'),E('flow','sp','update status'));return m;},
pages:()=>{let m=base([N('portal','Public-facing Power Pages site','workload','Power Pages'),N('dv','Dataverse','workload','Dataverse')],[N('guest','External customers/partners','access','User / audience')],[N('extid','External identity provider','control','Entra ID','Configure the supported authentication provider and external user lifecycle')]);m.edges=m.edges.filter(x=>!(x.from==='guest'&&x.to==='entra')&&!(x.from==='ca'&&x.to==='portal'));m.edges.push(E('guest','extid','external sign-in','identity'),E('extid','portal','authenticated session','identity'),E('portal','dv','table permissions'),E('ppac','portal','administers','management'));return m;},
integration:()=>{let m=base([N('flow','Integration cloud flow','workload','Power Automate'),N('dv','Dataverse','workload','Dataverse')],[N('maker','Business process owner','access','User / audience')],[N('api','Partner business API','workload','External system / API'),N('conn','Custom connector','workload','Custom connector'),N('spn','Application identity','control','Service principal / managed identity')]);m.edges.push(E('dv','flow','business trigger'),E('flow','conn','invokes API'),E('conn','api','HTTPS request'),E('spn','conn','connection identity','identity'));return m;},
copilot:()=>{let m=base([N('agent','Employee assistant','workload','Copilot Studio'),N('flow','Agent-triggered flow','workload','Power Automate')],[N('staff','Employees','access','User / audience')],[N('api','Line-of-business API','workload','External system / API')]);m.edges.push(E('agent','flow','approved action'),E('flow','api','retrieves status'),E('api','flow','response'));return m;},
enterprise:()=>{let m=base([N('mda','Operations model-driven app','workload','Model-driven app'),N('dv','Dataverse','workload','Dataverse')],[N('staff','Internal employees','access','User / audience'),N('partner','External partners','access','User / audience')],[N('pages','Partner Power Pages site','workload','Power Pages'),N('flow','Business automation','workload','Power Automate'),N('api','Enterprise integration API','workload','External system / API'),N('apim','API Management','workload','Azure API Management'),N('spn','Application identity','control','Service principal / managed identity'),N('roles','Dataverse roles','control','Security roles')]);m.edges.push(E('mda','dv','application data'),E('pages','dv','table permissions'),E('partner','pages','external session','identity'),E('dv','flow','event trigger'),E('flow','apim','API call'),E('apim','api','forward request'),E('spn','flow','app connection','identity'),E('roles','dv','data authorisation','identity'));return m;},
community:()=>{const nodes=[
 N('sysadmin','Platform administrators','privileged','Privileged administrator'),N('elevation','Privileged Identity Management','privileged','PIM / privileged access'),
 N('staffid','Microsoft Entra ID','control','Entra ID','Workforce sign-in and group membership'),N('publicid','Entra External ID','control','Entra ID','External account identity and lifecycle'),
 N('capolicy','Conditional Access','control','Conditional Access'),N('dlppolicy','Power Platform data policies','control','DLP policy'),
 N('roles','Dataverse security roles','control','Security roles'),N('gateway','Public web routing','control','Gateway','Routes the static information website'),
 N('ppac','Power Platform admin centre','management','Power Platform admin centre'),N('pipeline','Managed solution pipeline','management','ALM / pipelines'),
 N('staticdeploy','Website build pipeline','management','ALM / pipelines'),N('monitor','Audit and observability','management','Monitoring / auditing'),
 {...N('info','Community information website','workload','Other','Static Web App: guidance and eligibility information'),group:'Public experience'},
 {...N('pages','Support request portal','workload','Power Pages','External form and request registration'),group:'Public experience'},
 {...N('mda','Support team workbench','workload','Model-driven app','Review and case progression'),group:'Casework'},
 {...N('dv','Support request records','workload','Dataverse','Dataverse case records and permissions'),group:'Casework'},
 {...N('flow','Notification and case workflow','workload','Power Automate','Event-based internal workflows'),group:'Automation'},
 {...N('apim','Integration API gateway','workload','Azure API Management','Controls calls to reference data service'),group:'Integrations'},
 {...N('external','Reference data service','workload','External system / API','Fictional external address validation service'),group:'Integrations'},
 {...N('files','Private uploaded documents','workload','Other','Azure Blob Storage behind secured application integration'),group:'Documents'},
 {...N('share','Team document workspace','workload','SharePoint'),group:'Documents'},
 {...N('mail','Notification service','workload','Other','Exchange Online'),group:'Documents'},
 N('citizen','Community member','access','User / audience'),N('officer','Support adviser','access','User / audience'),N('device','Managed work device','access','Device / browser')];
 const edges=[
 E('sysadmin','elevation','elevates role','identity'),E('elevation','ppac','administers','management'),E('ppac','dlppolicy','connector governance','management'),
 E('ppac','monitor','telemetry','management'),E('staticdeploy','info','deploys','management'),E('pipeline','pages','deploys','management'),E('pipeline','mda','deploys','management'),
 E('citizen','gateway','visits guidance','data'),E('gateway','info','routes','data'),E('info','pages','starts request','data'),
 E('citizen','publicid','external sign-in','identity'),E('publicid','pages','authenticated session','identity'),
 E('officer','device','uses','identity'),E('device','staffid','workforce sign-in','identity'),E('staffid','capolicy','assesses sign-in','identity'),E('capolicy','mda','authorised access','identity'),
 E('pages','dv','creates requests','data'),E('mda','dv','reviews records','data'),E('roles','dv','authorises records','identity'),
 E('pages','files','uploads via secured integration','data'),E('dv','flow','business events','data'),
 E('flow','share','updates team materials','data'),E('flow','mail','sends notifications','data'),
 E('flow','apim','calls service','data'),E('apim','external','verifies reference data','data'),E('flow','files','processes files','data'),
 E('dlppolicy','flow','connector policy','management')];
 return {nodes,edges};}
};
let model=samples.internal(),selected=null,view='all',sequence=0;
const $=id=>document.getElementById(id);const escaped=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function validate(m){if(!m||!Array.isArray(m.nodes)||!Array.isArray(m.edges)||m.nodes.length>130||m.edges.length>300)throw Error('Invalid architecture or size limit exceeded');let ids=new Set();for(let n of m.nodes){if(!n||typeof n.id!=='string'||n.id.length>80||ids.has(n.id)||!planes.some(p=>p[0]===n.plane)||!['name','type','detail','group'].every(k=>typeof(n[k]??'')==='string'&&(n[k]??'').length<=550))throw Error('Invalid component data');ids.add(n.id)}for(let e of m.edges){if(!ids.has(e.from)||!ids.has(e.to)||!['identity','data','management'].includes(e.kind)||typeof e.label!=='string'||e.label.length>100)throw Error('Invalid connection data')}return m;}
function populate(){let t=$('nodeType'),p=$('nodePlane');types.forEach(s=>t.add(new Option(s,s)));planes.forEach(([id,name])=>p.add(new Option(name,id)));}
function options(){for(let id of ['fromNode','toNode']){let el=$(id),old=el.value;el.replaceChildren();model.nodes.forEach(n=>el.add(new Option(n.name,n.id)));if(model.nodes.some(n=>n.id===old))el.value=old;}}
function edit(id){selected=id;let n=model.nodes.find(n=>n.id===id);$('nodeName').value=n?.name||'';$('nodeType').value=n?.type||types[0];$('nodePlane').value=n?.plane||'workload';$('nodeDetail').value=n?.detail||'';$('nodeGroup').value=n?.group||'';$('saveNode').textContent=n?'Update component':'Add component';$('deleteNode').disabled=!n;render();}
function wrap(s,width=21,max=3){let words=String(s).split(/\s+/),out=[''];for(let w of words){if((out.at(-1)+' '+w).trim().length>width&&out.at(-1))out.push('');out[out.length-1]+=(out.at(-1)?' ':'')+w;}if(out.length>max){out=out.slice(0,max);out[max-1]=out[max-1].slice(0,width-1)+'…';}return out;}
function render(){
 const palette={privileged:['#edf1f8','#29486f','#c5d0e2'],control:['#e7f5fc','#0876a7','#a4d7ed'],management:['#f0f2f6','#4c6177','#cbd4de'],workload:['#e6f6ed','#176c4e','#a4d9bc'],access:['#e7f1ff','#1966a8','#bad7f5']};
 const width=1390,colStart=235,nodeW=206,nodeH=60,dx=228,dy=77,cols=5;
 const layer=[],cards=[],arrows=[],labels=[],loc={};
 let currentY=18;
 const layoutNodes=(nodes,top,fg)=>{
   nodes.forEach((n,i)=>{let x=colStart+(i%cols)*dx,y=top+Math.floor(i/cols)*dy;loc[n.id]={x:x+nodeW/2,y:y+nodeH/2};
   let lines=wrap(n.name,27,2);
   cards.push('<g class="node '+(n.id===selected?'selected':'')+'" data-id="'+escaped(n.id)+'" tabindex="0" role="button" aria-label="Edit '+escaped(n.name)+'"><rect x="'+x+'" y="'+y+'" width="'+nodeW+'" height="'+nodeH+'" rx="9" fill="#fff" stroke="'+fg+'"/><text x="'+(x+nodeW/2)+'" y="'+(y+21)+'" text-anchor="middle" font-size="12.5" font-weight="730" fill="'+fg+'">'+lines.map((s,j)=>'<tspan x="'+(x+nodeW/2)+'" dy="'+(j?14:0)+'">'+escaped(s)+'</tspan>').join('')+'</text><text x="'+(x+nodeW/2)+'" y="'+(y+49)+'" text-anchor="middle" font-size="10" fill="#5c7080">'+escaped(n.type.slice(0,27))+'</text><title>'+escaped(n.detail||n.name)+'</title></g>')});
   return Math.ceil(nodes.length/cols)*dy;
 };
 const order=['access','privileged','control','management','workload'];
 for(const key of order){
   const [,name,subtitle]=planes.find(p=>p[0]===key),colors=palette[key],nodes=model.nodes.filter(n=>n.plane===key);
   const bg=colors[0],fg=colors[1],stroke=colors[2],start=currentY;
   let rects='';
   if(key==='workload'&&nodes.some(n=>n.group)){
      const groups=new Map();nodes.forEach(n=>{let group=n.group||'Other workload components';if(!groups.has(group))groups.set(group,[]);groups.get(group).push(n)});
      let innerY=start+61;
      for(const [name,items] of groups){
        const sh=40+Math.ceil(items.length/cols)*dy;
        rects+='<rect x="'+(colStart-12)+'" y="'+innerY+'" width="1146" height="'+sh+'" rx="10" fill="#fafffc" stroke="'+stroke+'"/><text x="'+colStart+'" y="'+(innerY+23)+'" fill="'+fg+'" font-weight="740" font-size="13">'+escaped(name)+'</text>';
        layoutNodes(items,innerY+34,fg);innerY+=sh+13;
      }
      currentY=Math.max(start+140,innerY+5);
   }else{
      let h=Math.max(135,72+Math.ceil(nodes.length/cols)*dy);
      if(nodes.length)layoutNodes(nodes,start+60,fg);
      currentY=start+h;
   }
   layer.push('<rect x="12" y="'+start+'" width="'+(width-24)+'" height="'+(currentY-start)+'" rx="13" fill="'+bg+'" stroke="'+stroke+'"/><text x="29" y="'+(start+28)+'" fill="'+fg+'" font-weight="760" font-size="18">'+escaped(name)+'</text><text x="29" y="'+(start+48)+'" fill="'+fg+'" font-size="11">'+escaped(subtitle)+'</text>'+rects);
   currentY+=13;
 }
 const edges=model.edges.filter(e=>view==='all'||e.kind===view);
 let used=[];
 for(const [i,e] of edges.entries()){
   let a=loc[e.from],b=loc[e.to];if(!a||!b)continue;
   const same=Math.abs(a.y-b.y)<60,goingDown=b.y>a.y;
   let x1=a.x,y1=a.y+(same?0:goingDown?nodeH/2:-nodeH/2),x2=b.x,y2=b.y+(same?0:goingDown?-nodeH/2:nodeH/2);
   if(same){x1+=Math.sign(x2-x1)*nodeW/2;x2-=Math.sign(x2-x1)*nodeW/2;}
   let mid=(y1+y2)/2,shift=(i%5-2)*9;
   let d='M '+x1+' '+y1+' C '+(x1+shift)+' '+mid+' '+(x2+shift)+' '+mid+' '+x2+' '+y2;
   let color=e.kind==='identity'?'#216aa9':e.kind==='management'?'#76579b':'#23815b';
   arrows.push('<path d="'+d+'" stroke="'+color+'" stroke-width="2.2" opacity=".69" fill="none" marker-end="url(#arrow)"><title>'+escaped(e.label||e.kind)+'</title></path>');
   if($('showLabels').checked&&edges.length<=22&&e.label){
     const lx=(x1+x2)/2,ly=(y1+y2)/2;if(!used.some(p=>Math.abs(p[0]-lx)<138&&Math.abs(p[1]-ly)<22)){used.push([lx,ly]);const label=e.label.slice(0,32);
     labels.push('<g pointer-events="none"><rect x="'+(lx-label.length*3.1-9)+'" y="'+(ly-11)+'" width="'+(label.length*6.2+18)+'" height="22" rx="7" fill="white" stroke="#c6d8e3"/><text x="'+lx+'" y="'+(ly+4)+'" text-anchor="middle" font-size="10" fill="#35536f">'+escaped(label)+'</text></g>')};
   }
 }
 $('viz').innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+width+' '+(currentY+20)+'" role="img" aria-label="Power Platform five security planes and grouped application workloads"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L7 4 L0 8" fill="#55768c"/></marker></defs>'+layer.join('')+'<g class="connections">'+arrows.join('')+'</g>'+cards.join('')+labels.join('')+'</svg>';
 $('viz').querySelectorAll('.node').forEach(el=>{el.addEventListener('click',()=>edit(el.dataset.id));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();edit(el.dataset.id)}})});
 $('counts').textContent=model.nodes.length+' components · '+model.edges.length+' connections';options();edgesList();assess();
}
function edgesList(){$('edgeList').replaceChildren();model.edges.forEach((e,i)=>{let row=document.createElement('div');row.className='edge-entry';let t=document.createElement('span'),btn=document.createElement('button');let a=model.nodes.find(n=>n.id===e.from)?.name||e.from,b=model.nodes.find(n=>n.id===e.to)?.name||e.to;t.textContent=`${a} → ${b} · ${e.label||e.kind} [${e.kind}]`;t.title=e.label||e.kind;btn.textContent='×';btn.setAttribute('aria-label',`Remove connection ${a} to ${b}`);btn.addEventListener('click',()=>{model.edges.splice(i,1);render()});row.append(t,btn);$('edgeList').append(row)})}
function assess(){let t=new Set(model.nodes.map(n=>n.type)),findings=[];let has=(...list)=>list.some(x=>t.has(x));if(!has('PIM / privileged access'))findings.push(['Privileged access','No privileged access elevation or review component is represented.']);if(!has('Conditional Access'))findings.push(['Authentication policy','No Conditional Access component is represented for internal interactive access.']);if(!has('DLP policy'))findings.push(['Connector governance','No Power Platform connector data policy is represented.']);if(!has('ALM / pipelines'))findings.push(['Application lifecycle','No solution deployment or ALM component is represented.']);if(!has('Monitoring / auditing'))findings.push(['Operational visibility','No monitoring or auditing component is represented.']);if(has('Power Pages')&&!model.nodes.some(n=>n.type==='Entra ID'&&n.detail.toLowerCase().includes('external')))findings.push(['External identity','Confirm the selected external identity provider, authentication options and contact lifecycle.']);if(has('External system / API'))findings.push(['Integration trust','Document credential ownership, least privilege, API authentication, data boundaries and failure handling for external connections.']);if(has('Dataverse'))findings.push(['Dataverse authorisation','Review security roles, ownership, record access and any sensitive fields.']);let target=$('findings');target.replaceChildren();if(!findings.length)findings.push(['Initial coverage','The basic architectural control categories are represented. Review their actual configuration and effectiveness.']);findings.forEach(([title,txt],i)=>{let el=document.createElement('div');el.className='finding'+(findings.length===1&&title==='Initial coverage'?' ok':'');let s=document.createElement('strong'),p=document.createElement('span');s.textContent=title;p.textContent=txt;el.append(s,p);target.append(el)})}
function toPlantUml(){
 const safe=s=>String(s||'').replace(/[\r\n]+/g,' ').replace(/"/g,"'").replace(/\\/g,'/').slice(0,100);
 const names={access:'User and Application Access',privileged:'Privileged Access',control:'Control Plane',management:'Management Plane',workload:'Data and Workload Plane'};
 const out=['@startuml','title Power Platform Solution - Illustrative Security Planes','skinparam shadowing false','skinparam linetype ortho','skinparam packageStyle rectangle'];
 const aliases=new Map(model.nodes.map((n,i)=>[n.id,'N'+(i+1)]));
 for(const plane of ['access','privileged','control','management','workload']){
   out.push('package "'+names[plane]+'" {');
   const groups=new Map();
   model.nodes.filter(n=>n.plane===plane).forEach(n=>{const key=plane==='workload'?(n.group||'Other components'):'';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(n)});
   for(const [group,items] of groups){
     if(group)out.push('  package "'+safe(group)+'" {');
     items.forEach(n=>out.push('    rectangle "'+safe(n.name)+'" as '+aliases.get(n.id)));
     if(group)out.push('  }');
   }
   out.push('}');
 }
 model.edges.forEach(e=>out.push(aliases.get(e.from)+' --> '+aliases.get(e.to)+' : '+safe(e.label||e.kind)));
 out.push('legend bottom','Illustrative model. Validate controls, permissions, and integrations for the actual solution.','endlegend','@enduml');
 return out.join('\n');
}
function download(name,text,mime){let blob=new Blob([text],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function loadSample(){model=validate(samples[$('samples').value]());selected=null;edit(null)}
populate();$('samples').addEventListener('change',loadSample);$('reset').addEventListener('click',loadSample);$('nodeForm').addEventListener('submit',e=>{e.preventDefault();let id=selected||'custom-'+(++sequence),n=N(id,$('nodeName').value.trim(),$('nodePlane').value,$('nodeType').value,$('nodeDetail').value.trim());n.group=$('nodeGroup').value.trim();if(!n.name)return;if(selected){model.nodes[model.nodes.findIndex(x=>x.id===id)]=n}else{model.nodes.push(n)}edit(id)});$('clearSelection').addEventListener('click',()=>edit(null));$('deleteNode').addEventListener('click',()=>{model.nodes=model.nodes.filter(n=>n.id!==selected);model.edges=model.edges.filter(e=>e.from!==selected&&e.to!==selected);edit(null)});$('addEdge').addEventListener('click',()=>{let a=$('fromNode').value,b=$('toNode').value;if(!a||!b||a===b){alert('Choose two different components.');return}let label=$('connectionLabel').value.trim(),kind=$('connectionKind').value;model.edges.push(E(a,b,label||'connection',kind));$('connectionLabel').value='';render()});document.querySelectorAll('[data-view]').forEach(btn=>btn.addEventListener('click',()=>{view=btn.dataset.view;document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',b===btn?'true':'false'));render()}));$('exportSvg').addEventListener('click',()=>{let svg=$('viz').querySelector('svg').cloneNode(true);svg.setAttribute('xmlns','http://www.w3.org/2000/svg');svg.setAttribute('width','1080');svg.setAttribute('height','800');download('power-platform-planes.svg',new XMLSerializer().serializeToString(svg),'image/svg+xml')});$('exportPuml').addEventListener('click',()=>download('power-platform-solution.puml',toPlantUml(),'text/plain'));$('showLabels').addEventListener('change',render);$('exportJson').addEventListener('click',()=>download('power-platform-architecture.json',JSON.stringify({format:'mightora-power-platform-planes',version:1,...model},null,2),'application/json'));$('importBtn').addEventListener('click',()=>$('fileInput').click());$('fileInput').addEventListener('change',async e=>{let file=e.target.files?.[0];if(!file)return;try{let m=JSON.parse(await file.text());model=validate({nodes:m.nodes,edges:m.edges});edit(null)}catch(err){alert('Cannot import architecture: '+err.message)}e.target.value=''});let resources=performance.getEntriesByType('resource').map(x=>{try{return new URL(x.name).hostname}catch{return 'local'}});$('networkSummary').textContent=resources.length?'Observed resource domains: '+[...new Set(resources)].join(', '):'No external resource entries reported by this browser.';edit(null);
})();
