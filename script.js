
let chart;
let historico = [];

function get(id){
return parseFloat(document.getElementById(id).value) || 0;
}

function calcular(){

const quantidade = get("quantidade");
const metroPorPeca = get("metroPorPeca");
const defeitos = get("defeitos");
const metaHora = get("metaHora");

const producao = quantidade * metroPorPeca;

const qualidade = quantidade > 0 
? ((quantidade - defeitos) / quantidade) * 100 
: 0;

const atingimento = metaHora ? (producao / metaHora) * 100 : 0;

// Gradiente dinâmico fundo
let cor;
if(atingimento >= 100){
cor = "#16a34a20";
}
else if(atingimento >= 80){
cor = "#f59e0b20";
}
else{
cor = "#dc262620";
}
document.body.style.background = `linear-gradient(180deg, ${cor}, var(--bg))`;

atualizarCard("producao", `Produção: ${producao.toFixed(2)} m²`);
atualizarCard("qualidade",
`Qualidade: ${qualidade.toFixed(1)}%`,
qualidade >= 95
);

atualizarCard("atingimento",
`Atingimento: ${atingimento.toFixed(1)}%`,
atingimento >= 100
);

const porcentagem = Math.min(atingimento,100);
const barra = document.getElementById("barraMeta");
barra.style.width = porcentagem + "%";
barra.style.background =
atingimento >= 100
? "linear-gradient(90deg,#16a34a,#34d399)"
: "linear-gradient(90deg,#dc2626,#f87171)";
}

function registrar(){
calcular();

historico.push({
hora:new Date().toLocaleTimeString(),
meta:get("metaHora"),
real:get("quantidade") * get("metroPorPeca")
});

atualizarGrafico();
}

function atualizarCard(id,texto,status){
const el=document.getElementById(id);
el.innerHTML=texto;
if(status===undefined){
el.className="card";
}else{
el.className="card " + (status?"green":"red");
}
}

function atualizarGrafico(){
if(chart) chart.destroy();

chart=new Chart(document.getElementById("grafico"),{
type:"bar",
data:{
labels:historico.map(h=>h.hora),
datasets:[
{
label:"Meta",
data:historico.map(h=>h.meta),
backgroundColor:"#3b82f6"
},
{
label:"Real",
data:historico.map(h=>h.real),
backgroundColor:historico.map(h=>h.real>=h.meta?"#16a34a":"#dc2626")
}
]
},
options:{
responsive:true,
animation:{duration:800},
scales:{y:{beginAtZero:true}}
}
});
}

function limparTudo(){
historico=[];
if(chart) chart.destroy();
}

function exportarExcel(){
if(historico.length===0){alert("Sem dados!");return;}
const dados=historico.map(h=>({
Hora:h.hora,
Meta:h.meta,
Real:h.real,
Atingimento:h.meta?((h.real/h.meta)*100).toFixed(1):0
}));
const ws=XLSX.utils.json_to_sheet(dados);
const wb=XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb,ws,"Produção");
XLSX.writeFile(wb,"Producao.xlsx");
}

function toggleTheme(){
document.body.classList.toggle("dark");
const isDark=document.body.classList.contains("dark");
document.getElementById("themeBtn").innerText=
isDark?"☀️ Modo Claro":"🌙 Modo Escuro";
}