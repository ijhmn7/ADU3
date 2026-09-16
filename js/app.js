let records=[];let collections=[];
const $=s=>document.querySelector(s);
const unique=a=>[...new Set(a)].sort((x,y)=>String(x).localeCompare(String(y)));
async function init(){
  [records,collections]=await Promise.all([fetch('data/records.json').then(r=>r.json()),fetch('data/collections.json').then(r=>r.json())]);
  fillStats();fillCollections();fillFilters();bind();apply();
}
function fillStats(){
  $('#stat-records').textContent=records.length.toLocaleString();
  $('#stat-collections').textContent=unique(records.map(r=>r.collection)).length;
  $('#stat-places').textContent=unique(records.flatMap(r=>r.places||[])).length;
}
function fillCollections(){
  $('#collection-grid').innerHTML=collections.map(c=>{const count=records.filter(r=>r.collection===c.name).length;return `<article class="collection-card" tabindex="0" data-collection="${esc(c.name)}"><div class="count">${count} record${count===1?'':'s'}</div><div><h3>${esc(c.name)}</h3><p>${esc(c.description)}</p></div></article>`}).join('');
}
function optionize(sel,items){sel.insertAdjacentHTML('beforeend',items.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join(''))}
function fillFilters(){optionize($('#filter-collection'),unique(records.map(r=>r.collection)));optionize($('#filter-place'),unique(records.flatMap(r=>r.places||[])));optionize($('#filter-type'),unique(records.map(r=>r.type)));optionize($('#filter-subject'),unique(records.flatMap(r=>r.subjects||[])))}
function bind(){
  $('#hero-search').addEventListener('submit',e=>{e.preventDefault();$('#catalogue-q').value=$('#hero-q').value;location.hash='catalogue';apply()});
  $('#catalogue-search').addEventListener('submit',e=>{e.preventDefault();apply()});
  ['filter-collection','filter-place','filter-type','filter-subject','filter-from','filter-to','filter-digital','sort-results'].forEach(id=>$('#'+id).addEventListener('change',apply));
  $('#clear-filters').addEventListener('click',()=>{['filter-collection','filter-place','filter-type','filter-subject','filter-from','filter-to'].forEach(id=>$('#'+id).value='');$('#filter-digital').checked=false;$('#catalogue-q').value='';apply()});
  document.querySelectorAll('[data-quick]').forEach(a=>a.addEventListener('click',()=>{$('#catalogue-q').value=a.dataset.quick;setTimeout(apply,0)}));
  document.querySelectorAll('[data-collection]').forEach(c=>c.addEventListener('click',()=>{$('#filter-collection').value=c.dataset.collection;location.hash='catalogue';apply()}));
}
function hay(r){return [r.title,r.description,r.reference,r.source,r.collection,r.type,...(r.places||[]),...(r.people||[]),...(r.subjects||[])].join(' ').toLowerCase()}
function score(r,q){if(!q)return 0;const terms=q.toLowerCase().trim().split(/\s+/).filter(Boolean);const h=hay(r);let s=0;for(const t of terms){if(r.title.toLowerCase().includes(t))s+=8;if((r.people||[]).join(' ').toLowerCase().includes(t))s+=7;if((r.places||[]).join(' ').toLowerCase().includes(t))s+=5;if((r.subjects||[]).join(' ').toLowerCase().includes(t))s+=4;if(h.includes(t))s+=1;else return -999}return s}
function apply(){
  const q=$('#catalogue-q').value.trim(),collection=$('#filter-collection').value,place=$('#filter-place').value,type=$('#filter-type').value,subject=$('#filter-subject').value,from=+$('#filter-from').value||null,to=+$('#filter-to').value||null,digital=$('#filter-digital').checked;
  let out=records.map(r=>({...r,_score:score(r,q)})).filter(r=>r._score>-999&&(!collection||r.collection===collection)&&(!place||(r.places||[]).includes(place))&&(!type||r.type===type)&&(!subject||(r.subjects||[]).includes(subject))&&(!from||r.year_end>=from)&&(!to||r.year_start<=to)&&(!digital||r.digital));
  const sort=$('#sort-results').value;if(sort==='date-asc')out.sort((a,b)=>a.year_start-b.year_start);else if(sort==='date-desc')out.sort((a,b)=>b.year_start-a.year_start);else if(sort==='title')out.sort((a,b)=>a.title.localeCompare(b.title));else out.sort((a,b)=>b._score-a._score||a.year_start-b.year_start);
  render(out,q);
}
function render(out,q){$('#result-count').textContent=out.length;$('#active-query').textContent=q?`for “${q}”`:'';$('#results').innerHTML=out.length?out.map(r=>`<a class="result-card" href="record.html?id=${encodeURIComponent(r.id)}"><div class="thumb">${r.image?`<img src="${esc(r.image)}" alt=""/>`:`${esc(r.type)}<br>${esc(r.date_display)}`}</div><div class="result-main"><div class="result-kicker">${esc(r.collection)} · ${esc(r.date_display)}</div><h3>${esc(r.title)}</h3><p>${esc(r.description)}</p><div class="chips">${[...(r.places||[]).slice(0,3),...(r.subjects||[]).slice(0,2)].map(x=>`<span class="chip">${esc(x)}</span>`).join('')}</div></div><div class="result-ref">${esc(r.reference)}</div></a>`).join(''):`<div class="empty">No catalogue records match those filters.</div>`}
function esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
init().catch(err=>{$('#results').innerHTML=`<div class="empty">Could not load catalogue data. ${esc(err.message)}</div>`});
