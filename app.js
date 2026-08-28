const languages = [
  ["🇮🇳","Marathi","मराठी"],["🇮🇳","Hindi","हिन्दी"],["🇮🇳","Bengali","বাংলা"],
  ["🇮🇳","Gujarati","ગુજરાતી"],["🇮🇳","Punjabi","ਪੰਜਾਬੀ"],["🇮🇳","Tamil","தமிழ்"],
  ["🇮🇳","Telugu","తెలుగు"],["🇮🇳","Kannada","ಕನ್ನಡ"],["🇮🇳","Malayalam","മലയാളം"],
  ["🇮🇳","Odia","ଓଡ଼ିଆ"],["🇮🇳","Assamese","অসমীয়া"],["🇮🇳","Urdu","اردو"],
  ["🇮🇳","Konkani","कोंकणी"],["🇮🇳","Maithili","मैथिली"],["🇮🇳","Nepali","नेपाली"],
  ["🇮🇳","Sindhi","सिन्धी"],["🇮🇳","Sanskrit","संस्कृत"],["🇬🇧","English","English"]
];

const $=s=>document.querySelector(s);
const pages=[...document.querySelectorAll(".page")];
const title=$("#pageTitle");
function showPage(name){
  pages.forEach(p=>p.classList.toggle("hidden",p.id!==name));
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===name));
  title.textContent=name[0].toUpperCase()+name.slice(1);
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>showPage(b.dataset.page));

const modal=$("#agentModal");
function openModal(){modal.classList.remove("hidden");$("#agentName").focus()}
function closeModal(){modal.classList.add("hidden")}
["createTop","startBuild","newAgent2","newAgent3","newAgent4","newAgent5"].forEach(id=>{const e=$("#"+id);if(e)e.onclick=openModal});
$("#closeModal").onclick=closeModal;$("#cancelModal").onclick=closeModal;

const langSelect=$("#languageSelect");
languages.forEach((l,i)=>{const o=document.createElement("option");o.value=l[1];o.textContent=`${l[0]} ${l[1]} — ${l[2]}`;if(i===0)o.selected=true;langSelect.appendChild(o)});
const lg=$("#languageGrid");
languages.forEach(l=>{const d=document.createElement("div");d.className="language";d.innerHTML=`<span class="flag">${l[0]}</span><div><b>${l[1]}</b><small>${l[2]}</small></div>`;d.onclick=()=>toast(`${l[1]} selected`);lg.appendChild(d)});

function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.remove("hidden");setTimeout(()=>t.classList.add("hidden"),2600)}
$("#saveAgent").onclick=()=>{
  const name=$("#agentName").value.trim()||"Untitled Agent";
  const url=$("#websiteUrl").value.trim();
  closeModal(); showPage("agents");
  toast(url?`${name} created. Website source ready to connect.`:`${name} created successfully.`);
};
$("#crawlBtn").onclick=()=>{const url=prompt("Website URL (e.g. https://example.com)"); if(url)toast(`Website queued for crawling: ${url}`)};
$("#addKnowledge").onclick=()=>showPage("knowledge");
$("#demoBtn").onclick=()=>{
  if(!("speechSynthesis" in window)){toast("Your browser does not support voice demo.");return}
  const u=new SpeechSynthesisUtterance("नमस्कार! मी Vaani AI आहे. तुमच्या website मधील माहितीवरून मी तुमच्या निवडलेल्या भाषेत उत्तर देऊ शकतो.");
  u.lang="mr-IN";u.rate=.95;speechSynthesis.speak(u);toast("Voice demo started");
};
