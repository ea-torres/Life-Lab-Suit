// ============================================================
// CONFIG.JS · Aquí editas los datos de CURIOSITY EVA sin tocar la lógica.
// Guarda y recarga la página para ver los cambios.
// ============================================================

// ---- PAISAJE (gráficos) ----
// heading: hacia dónde mira el astronauta al abrir (0-359 grados); sun: dirección del sol
// sky: 3 colores del cielo; ridges: montañas [color, altura, frecuencia, paralaje, semilla, desplazamiento]
// ground: colores del suelo; rock: sombra y luz de las rocas; rocks: cantidad de rocas
const SCENE={heading:15,sun:40,rocks:70,
  sky:["#76574d","#c68d68","#ecbf8f"],
  ridges:[["#bd8260",.09,.06,1,1,0],["#a2603f",.06,.14,1.6,4,.01],["#8a4a2f",.035,.3,2.4,9,.04]],
  ground:["#b3643a","#5a2917"],
  rock:["#3f1d11","#7a3f26"]};

// ---- FATIGA: se calcula a partir de 4 lecturas del parche ----
// [nombre, unidad, sensor, rango normal]
const LABELS={glu:["Glucose","mg/dL","patch","80–110"],lac:["Lactate","mmol/L","patch","0.5–2"],temp:[" H₂O₂","","patch","100-120"],hyd:["","","",""]};
// ok: valor sin estrés; bad: valor con estrés máximo; w: peso en el índice (suman 1)
// (la glucosa baja y el lactato, la temperatura y la deshidratación altos aumentan la fatiga)
const FAT={glu:{ok:90,bad:55,w:.25},lac:{ok:2,bad:8,w:.3},temp:{ok:37,bad:39,w:.2},hyd:{ok:85,bad:55,w:.25}};
// Niveles del índice 0-100: [hasta, nombre, color de alerta]
const LEVELS=[[25,"Low",""],[50,"Moderate","warn"],[75,"High","warn"],[101,"Severe","crit"]];

// ---- MARCADORES AR (sin distancias) ----
// b: dirección en grados (0 N, 90 E, 180 S, 270 O); n: texto; k: color (w turquesa, s ámbar, h rojo); s: escenario donde aparece
const M=[{b:70,n:"Dust front",k:"h",s:"dust"}];

// ---- PROTECCIÓN AUTOMÁTICA ----
// [nombre, escenarios que la activan (separados por coma), efecto]. Se activan una por una, solas.
const PROT=[["Visor dust shield","dust","shield"],["Joint covers","dust",""],["Sealed air filter","dust",""],["Hydration reserve","mod,severe",""],["Cooling flow boost","severe",""]];

// ---- ESCENARIOS ----
// v: lecturas; calc: el título y color salen del índice de fatiga; dust: nivel de polvo 0-1
// acts: botones [texto, tipo] con tipo guide (guía holográfica) o doc (llamar a Tierra)
const NOM={glu:92,lac:1.4,temp:36.9,hyd:88};
const SCEN={
nominal:{calc:true,lvl:"",v:{...NOM},dust:0,title:"Rested",msg:"All four readings are in range. Dust protection is on standby.",acts:[]},
mod:{calc:true,lvl:"",v:{glu:74,lac:3.6,temp:37.6,hyd:72},dust:0,title:"",msg:"Your readings are drifting out of range. Sip water, slow your pace and take a glucose gel.",acts:[["Start recovery guide","guide"],["Call flight surgeon","doc"]],guide:"fatigue",doc:"Flight surgeon"},
severe:{calc:true,lvl:"",v:{glu:58,lac:6.8,temp:38.4,hyd:58},dust:0,title:"",msg:"Your body is under heavy strain. Stop, cool down and recover before you continue.",acts:[["Start recovery guide","guide"],["Call flight surgeon","doc"]],guide:"fatigue",doc:"Flight surgeon"},
dust:{calc:false,lvl:"warn",v:{...NOM},dust:1,title:"Heavy dust detected",msg:"A dust front is arriving. HoloConnect AI is protecting the suit automatically. Head back to the airlock.",acts:[["Open decontamination guide","guide"],["Call suit engineer","doc"]],guide:"dust",doc:"Suit engineer"}
};

// ---- GUÍAS HOLOGRÁFICAS ----
// base: dibujo SVG fijo (viewBox 200x190); steps: [título, texto, dibujo SVG del paso]
const GAUGE=`<path d="M70 70a34 34 0 0 1 60 0" fill="none" stroke="#ffb347" stroke-width="3"/><circle class="pulse" cx="100" cy="42" r="4" fill="#ffb347"/>`;
const GUIDES={
fatigue:{doneTitle:"Recovered",doneMsg:"Your fatigue index is back to low and your readings are in range.",
 base:`<g fill="none" stroke="#5fe3d0" stroke-width="2" opacity=".8"><circle cx="100" cy="42" r="24"/><path d="M60 150c0-34 18-56 40-56s40 22 40 56z"/></g>`,
 steps:[["Slow down or stop","Stop moving and let your heart rate settle. HoloConnect AI is already adjusting the suit for you.",`<circle class="pulse" cx="100" cy="95" r="70" fill="none" stroke="#ffb347" stroke-width="3"/>`],
 ["Sip water","Drink from the in-suit bag. The hydration reserve is open.",`<path class="pulse" d="M108 54l26 22h26" fill="none" stroke="#5fe3d0" stroke-width="3"/><rect class="pulse" x="140" y="70" width="34" height="18" rx="4" fill="rgba(95,227,208,.3)" stroke="#5fe3d0" stroke-width="2"/>`],
 ["Take glucose","Use the feeding port by your chin for the glucose gel.",`<circle class="pulse" cx="100" cy="64" r="7" fill="rgba(255,179,71,.4)" stroke="#ffb347" stroke-width="2"/><path d="M100 71v24" stroke="#ffb347" stroke-width="2"/>`],
 ["Check your index","Watch the fatigue index fall. If it stays above 50 after 10 minutes, return to the habitat.",`<path d="M60 150l25-20 20 12 35-35" fill="none" stroke="#5fe3d0" stroke-width="4"/><path class="pulse" d="M125 107h18v18" fill="none" stroke="#5fe3d0" stroke-width="4"/>`]]},
dust:{doneTitle:"Decontamination complete",doneMsg:"Dust load is back to normal. You can enter the airlock.",
 base:`<g fill="none" stroke="#5fe3d0" stroke-width="2" opacity=".85"><rect x="55" y="80" width="90" height="85" rx="22"/><rect x="58" y="22" width="16" height="68" rx="8"/><rect x="80" y="12" width="16" height="78" rx="8"/><rect x="102" y="16" width="16" height="74" rx="8"/><rect x="124" y="28" width="16" height="62" rx="8"/><path d="M58 130l-24-22 10-10 20 14"/></g><g fill="#c97a4a" opacity=".9"><circle cx="70" cy="60" r="3"/><circle cx="92" cy="50" r="2.5"/><circle cx="112" cy="70" r="3"/><circle cx="132" cy="58" r="2.5"/><circle cx="80" cy="120" r="3"/><circle cx="120" cy="135" r="3"/><circle cx="100" cy="105" r="2.5"/></g>`,
 steps:[["Let the suit blow it off","Hold your arms out. The suit releases an electrostatic pulse that lifts loose dust.",`<path class="pulse" d="M50 60l-18-12M150 60l18-12M40 120H18M160 120h22" stroke="#ffb347" stroke-width="3" fill="none" stroke-linecap="round"/>`],
 ["Brush the wrist seals","Use the airlock brush on the glove and wrist seals, where dust hides.",`<rect class="pulse" x="55" y="140" width="90" height="26" rx="6" fill="rgba(95,227,208,.25)" stroke="#5fe3d0" stroke-width="2"/>`],
 ["Check the dust sensor","Wait until your dust load reads under 10% in the visor.",GAUGE],
 ["Enter the airlock","The hologram marks the door. HoloConnect AI tells Mission Control you are in.",`<rect class="pulse" x="70" y="40" width="60" height="100" rx="6" fill="none" stroke="#5fe3d0" stroke-width="3"/><path d="M100 40v100" stroke="#5fe3d0"/>`]]}
};
