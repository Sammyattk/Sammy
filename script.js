'use strict';

/* ═══════════════════════════════════════════════════
   1. DADOS AGRONÔMICOS DE REFERÊNCIA
   Fonte: Embrapa, IAC, CONAB, Código Florestal
   ═══════════════════════════════════════════════════ */
const CULTURAS = {
  soja:      { nome:'Soja',           emoji:'🌱', aguaMin:450, aguaMax:700,  aguaIdeal:575,  fertilizMin:280, fertilizMax:400,  fertilizIdeal:340, prodMin:3.0, prodMax:4.5,  prodIdeal:3.8,  ciclo:'120–140 dias',
               tags:['Leguminosa','Fixação N₂','Exportação'], soloIdeal:['argiloso','misto'],
               tracos:{ rotacaoBonus:0.10, monoCulturaPenalty:0.08, aguaSensivel:true, geladaSensivel:false, drenagemCritica:false, manejoIntensivo:false },
               descricao:'Boa resposta à rotação. Fixa nitrogênio via simbiose com rizóbios, reduzindo necessidade de N mineral.' },
  milho:     { nome:'Milho',          emoji:'🌽', aguaMin:500, aguaMax:800,  aguaIdeal:650,  fertilizMin:380, fertilizMax:600,  fertilizIdeal:490, prodMin:6.0, prodMax:12.0, prodIdeal:8.5,  ciclo:'110–130 dias',
               tags:['Alta exigência N','Safrinha','Rotação'],  soloIdeal:['misto','argiloso'],
               tracos:{ rotacaoBonus:0.06, monoCulturaPenalty:0.05, aguaSensivel:false, geladaSensivel:false, drenagemCritica:false, manejoIntensivo:false },
               descricao:'Alta exigência nutricional, especialmente em nitrogênio. Excelente em solos férteis e bem drenados.' },
  trigo:     { nome:'Trigo',          emoji:'🌾', aguaMin:400, aguaMax:600,  aguaIdeal:500,  fertilizMin:250, fertilizMax:380,  fertilizIdeal:310, prodMin:2.0, prodMax:4.0,  prodIdeal:3.0,  ciclo:'100–120 dias',
               tags:['Inverno','Sequeiro','Rotação'],          soloIdeal:['misto','argiloso'],
               tracos:{ rotacaoBonus:0.07, monoCulturaPenalty:0.06, aguaSensivel:false, geladaSensivel:false, drenagemCritica:false, manejoIntensivo:false },
               descricao:'Cultura de inverno. Excelente na rotação com soja. Tolera geadas moderadas e solos com boa drenagem.' },
  feijao:    { nome:'Feijão',         emoji:'🫘', aguaMin:300, aguaMax:500,  aguaIdeal:380,  fertilizMin:180, fertilizMax:320,  fertilizIdeal:240, prodMin:1.5, prodMax:3.0,  prodIdeal:2.2,  ciclo:'75–100 dias',
               tags:['Leguminosa','Pequenos prod.','Rápido'],  soloIdeal:['misto'],
               tracos:{ rotacaoBonus:0.08, monoCulturaPenalty:0.07, aguaSensivel:true,  geladaSensivel:false, drenagemCritica:false, manejoIntensivo:false },
               descricao:'Leguminosa de ciclo curto. Sensível ao encharcamento e estresse hídrico na floração. Fixa nitrogênio.' },
  laranja:   { nome:'Laranja',        emoji:'🍊', aguaMin:900, aguaMax:1400, aguaIdeal:1100, fertilizMin:350, fertilizMax:550,  fertilizIdeal:440, prodMin:20,  prodMax:40,   prodIdeal:28,   ciclo:'Perene',
               tags:['Perene','Citrus','Drenagem'],            soloIdeal:['misto','arenoso'],
               tracos:{ rotacaoBonus:0.00, monoCulturaPenalty:0.00, aguaSensivel:false, geladaSensivel:true,  drenagemCritica:true,  manejoIntensivo:false },
               descricao:'Exige boa drenagem — encharcamento causa podridão radicular. Sensível a geadas fortes. Pomar perene.' },
  hortalicas:{ nome:'Hortaliças',     emoji:'🥬', aguaMin:400, aguaMax:700,  aguaIdeal:550,  fertilizMin:300, fertilizMax:500,  fertilizIdeal:400, prodMin:10,  prodMax:30,   prodIdeal:18,   ciclo:'30–90 dias',
               tags:['Alto valor','Intensivo','Mais água'],    soloIdeal:['misto'],
               tracos:{ rotacaoBonus:0.05, monoCulturaPenalty:0.09, aguaSensivel:true,  geladaSensivel:false, drenagemCritica:false, manejoIntensivo:true  },
               descricao:'Manejo intensivo, maiores demandas de água e nutrientes. Alta rentabilidade por hectare. Rotação frequente essencial.' },
  tabaco:    { nome:'Tabaco',         emoji:'🚬', aguaMin:500, aguaMax:750,  aguaIdeal:620,  fertilizMin:350, fertilizMax:550,  fertilizIdeal:440, prodMin:1.8, prodMax:3.5,  prodIdeal:2.5,  ciclo:'90–110 dias',
               tags:['Alto insumo','Contratado','Sul PR'],     soloIdeal:['arenoso','misto'],
               tracos:{ rotacaoBonus:0.05, monoCulturaPenalty:0.12, aguaSensivel:false, geladaSensivel:false, drenagemCritica:false, manejoIntensivo:true  },
               descricao:'Alta demanda de manejo e insumos. Monocultura contínua degrada rapidamente o solo. Integração obrigatória nas contratos.' },
  cafe:      { nome:'Café',           emoji:'☕', aguaMin:1200,aguaMax:2000, aguaIdeal:1600, fertilizMin:400, fertilizMax:650,  fertilizIdeal:520, prodMin:1.5, prodMax:3.0,  prodIdeal:2.2,  ciclo:'Perene',
               tags:['Perene','Geada','Norte PR'],             soloIdeal:['argiloso','misto'],
               tracos:{ rotacaoBonus:0.00, monoCulturaPenalty:0.00, aguaSensivel:false, geladaSensivel:true,  drenagemCritica:false, manejoIntensivo:false },
               descricao:'Sensível a geadas — cultivo concentrado no norte do Paraná. Exige planejamento de longo prazo por ser perene.' },
  uva:       { nome:'Uva',            emoji:'🍇', aguaMin:500, aguaMax:850,  aguaIdeal:680,  fertilizMin:280, fertilizMax:480,  fertilizIdeal:370, prodMin:8.0, prodMax:20.0, prodIdeal:13,   ciclo:'Perene',
               tags:['Perene','Vinicultura','Drenagem'],       soloIdeal:['arenoso','misto'],
               tracos:{ rotacaoBonus:0.00, monoCulturaPenalty:0.00, aguaSensivel:true,  geladaSensivel:false, drenagemCritica:true,  manejoIntensivo:false },
               descricao:'Sensível ao excesso de umidade — favorece doenças fúngicas. Exige boa drenagem e exposição solar adequada.' },
  morango:   { nome:'Morango',        emoji:'🍓', aguaMin:350, aguaMax:600,  aguaIdeal:480,  fertilizMin:250, fertilizMax:420,  fertilizIdeal:330, prodMin:20,  prodMax:50,   prodIdeal:32,   ciclo:'6–8 meses',
               tags:['Intensivo','Alto valor','Acompanhamento'],soloIdeal:['misto'],
               tracos:{ rotacaoBonus:0.08, monoCulturaPenalty:0.10, aguaSensivel:true,  geladaSensivel:false, drenagemCritica:false, manejoIntensivo:true  },
               descricao:'Manejo muito intensivo. Alta produtividade por área. Sensível a variações hídricas. Área média por produtor: 0,5–3 ha.' },
  algodao:   { nome:'Algodão',        emoji:'🤍', aguaMin:700, aguaMax:1300, aguaIdeal:950,  fertilizMin:500, fertilizMax:700,  fertilizIdeal:600, prodMin:1.5, prodMax:3.0,  prodIdeal:2.2,  ciclo:'150–180 dias',
               tags:['Alta exigência','Longo ciclo','Fibra'],  soloIdeal:['argiloso'],
               tracos:{ rotacaoBonus:0.05, monoCulturaPenalty:0.06, aguaSensivel:false, geladaSensivel:false, drenagemCritica:false, manejoIntensivo:false },
               descricao:'Alta exigência hídrica e nutricional. Ciclo longo. Mais adaptado ao Cerrado.' },
  cana:      { nome:'Cana-de-açúcar', emoji:'🎋', aguaMin:1200,aguaMax:1500, aguaIdeal:1350, fertilizMin:450, fertilizMax:700,  fertilizIdeal:570, prodMin:60,  prodMax:100,  prodIdeal:80,   ciclo:'12 meses',
               tags:['Perene','Alta demanda','Biocombustível'],soloIdeal:['argiloso','misto'],
               tracos:{ rotacaoBonus:0.00, monoCulturaPenalty:0.04, aguaSensivel:false, geladaSensivel:false, drenagemCritica:false, manejoIntensivo:false },
               descricao:'Cultura semiperene de alta demanda hídrica e nutricional. Típica do interior de São Paulo e norte do Paraná.' },
  arroz:     { nome:'Arroz',          emoji:'🍚', aguaMin:900, aguaMax:1500, aguaIdeal:1150, fertilizMin:300, fertilizMax:500,  fertilizIdeal:390, prodMin:4.0, prodMax:8.0,  prodIdeal:5.5,  ciclo:'100–120 dias',
               tags:['Aquático','Várzea','Sul'],               soloIdeal:['argiloso'],
               tracos:{ rotacaoBonus:0.04, monoCulturaPenalty:0.05, aguaSensivel:false, geladaSensivel:false, drenagemCritica:false, manejoIntensivo:false },
               descricao:'Alta demanda hídrica. Cultivado em várzeas e terras de baixo do Sul do Brasil.' }
};

/* ── MATRIZ DE INTERAÇÕES ENTRE CULTURAS ── */
const INTERACOES = {
  'soja+milho':      { tipo:'positiva', score:+12, msg:'✅ Combinação clássica do Paraná — favorece rotação, fixa N para o milho e diversifica riscos.' },
  'milho+soja':      { tipo:'positiva', score:+12, msg:'✅ Combinação clássica do Paraná — favorece rotação, fixa N para o milho e diversifica riscos.' },
  'soja+trigo':      { tipo:'positiva', score:+10, msg:'✅ Excelente prática: soja de verão + trigo de inverno maximiza uso da terra e melhora o solo.' },
  'trigo+soja':      { tipo:'positiva', score:+10, msg:'✅ Excelente prática: soja de verão + trigo de inverno maximiza uso da terra e melhora o solo.' },
  'milho+feijao':    { tipo:'positiva', score:+8,  msg:'✅ Consórcio tradicional. Feijão fixa N que beneficia o milho. Alta diversificação de renda.' },
  'feijao+milho':    { tipo:'positiva', score:+8,  msg:'✅ Consórcio tradicional. Feijão fixa N que beneficia o milho. Alta diversificação de renda.' },
  'soja+feijao':     { tipo:'positiva', score:+7,  msg:'✅ Ambas fixam N₂. Boa diversificação, especialmente para agricultores familiares.' },
  'feijao+soja':     { tipo:'positiva', score:+7,  msg:'✅ Ambas fixam N₂. Boa diversificação, especialmente para agricultores familiares.' },
  'cafe+milho':      { tipo:'positiva', score:+6,  msg:'✅ Milho como cultura intercalar no pomar jovem de café é prática comum no norte do Paraná.' },
  'milho+cafe':      { tipo:'positiva', score:+6,  msg:'✅ Milho como cultura intercalar no pomar jovem de café é prática comum no norte do Paraná.' },
  'laranja+hortalicas':{ tipo:'neutra',  score:+2,  msg:'ℹ️ Combinação possível, mas exige manejo hídrico cuidadoso pois as demandas são bem diferentes.' },
  'hortalicas+laranja':{ tipo:'neutra',  score:+2,  msg:'ℹ️ Combinação possível, mas exige manejo hídrico cuidadoso pois as demandas são bem diferentes.' },
  'tabaco+milho':    { tipo:'positiva', score:+5,  msg:'✅ Rotação tradicional no sudoeste do Paraná. Milho após tabaco recupera matéria orgânica do solo.' },
  'milho+tabaco':    { tipo:'positiva', score:+5,  msg:'✅ Rotação tradicional no sudoeste do Paraná. Milho após tabaco recupera matéria orgânica do solo.' },
  'uva+morango':     { tipo:'neutra',   score:+1,  msg:'ℹ️ Fruticultura diversificada. Atenção para não competirem por mão de obra na mesma época de colheita.' },
  'morango+uva':     { tipo:'neutra',   score:+1,  msg:'ℹ️ Fruticultura diversificada. Atenção para não competirem por mão de obra na mesma época de colheita.' },
  'cana+soja':       { tipo:'neutra',   score:-3,  msg:'⚠️ Cana e soja têm ciclos e manejos muito distintos. Difícil gerenciamento integrado na mesma propriedade.' },
  'soja+cana':       { tipo:'neutra',   score:-3,  msg:'⚠️ Cana e soja têm ciclos e manejos muito distintos. Difícil gerenciamento integrado na mesma propriedade.' },
};

/* ── PALETA DE CORES POR CULTURA (para chips) ── */
const CULTURA_CORES = {
  soja:'#4ade80', milho:'#fbbf24', trigo:'#f59e0b', feijao:'#a78bfa',
  laranja:'#fb923c', hortalicas:'#34d399', tabaco:'#94a3b8', cafe:'#92400e',
  uva:'#c084fc', morango:'#f43f5e', algodao:'#e2e8f0', cana:'#86efac', arroz:'#67e8f9'
};

/* ═══════════════════════════════════════════════════
   MATRIZ SOLO × CULTURA — COMPATIBILIDADE TÉCNICA
   Cada entrada: { mod: pts, sinergia, texto, risco }
   ═══════════════════════════════════════════════════ */
const SOLO_CULTURA_MATRIZ = {
  argiloso: {
    soja:       { mod:+5,  sinergia:'positiva', risco:'baixo',
                  texto:'Solo argiloso é adequado para soja — boa fertilidade natural e retenção hídrica favorecem o desenvolvimento radicular e a nodulação de rizóbios.' },
    milho:      { mod:+9,  sinergia:'positiva', risco:'baixo',
                  texto:'Combinação excelente: milho prospera em solo argiloso, que oferece alta disponibilidade de nutrientes e boa capacidade hídrica — condições ideais para altas produtividades.' },
    trigo:      { mod:+6,  sinergia:'positiva', risco:'baixo',
                  texto:'Solo argiloso favorece trigo com boa disponibilidade de nutrientes. Atenção ao manejo no plantio para evitar compactação superficial em solos úmidos.' },
    feijao:     { mod:+2,  sinergia:'neutra',   risco:'medio',
                  texto:'Feijão tolera solo argiloso, mas exige atenção à drenagem — encharcamentos mesmo breves na fase de floração podem causar queda brusca de produtividade.' },
    laranja:    { mod:-10, sinergia:'negativa', risco:'alto',
                  texto:'Incompatibilidade elevada: solo argiloso retém água excessivamente para citros, causando asfixia radicular e podridão de raízes. Drenagem artificial é imprescindível.' },
    hortalicas: { mod:+3,  sinergia:'neutra',   risco:'medio',
                  texto:'Hortaliças em solo argiloso exigem manejo de irrigação cuidadoso. A boa fertilidade natural é vantagem, mas compactação prejudica o desenvolvimento de raízes.' },
    tabaco:     { mod:+1,  sinergia:'neutra',   risco:'medio',
                  texto:'Tabaco em solo argiloso requer manejo de compactação — o sistema radicular pivotante exige boa aeração e estrutura porosa que pode ser comprometida com maquinário pesado.' },
    cafe:       { mod:+7,  sinergia:'positiva', risco:'baixo',
                  texto:'Solo argiloso com boa drenagem é ideal para café — alta fertilidade natural e boa retenção hídrica favorecem o desenvolvimento do pomar e a qualidade dos grãos.' },
    uva:        { mod:-7,  sinergia:'negativa', risco:'alto',
                  texto:'Uva prefere solos drenados — solo argiloso retém umidade elevada favorecendo doenças fúngicas como míldio e botrytis, que são os principais inimigos do vinhedo.' },
    morango:    { mod:-3,  sinergia:'negativa', risco:'medio',
                  texto:'Morango em solo argiloso exige manejo intensivo de irrigação e drenagem. O excesso de umidade favore podridões radiculares e doenças de solo.' },
    algodao:    { mod:+8,  sinergia:'positiva', risco:'baixo',
                  texto:'Algodão tem desempenho excelente em solo argiloso — sua cultura preferencial. Alta retenção hídrica reduz estresse em veranicos.' },
    cana:       { mod:+6,  sinergia:'positiva', risco:'baixo',
                  texto:'Cana-de-açúcar prospera em solo argiloso com boa estrutura, aproveitando a alta fertilidade e capacidade hídrica para seu ciclo de 12 meses.' },
    arroz:      { mod:+12, sinergia:'positiva', risco:'baixo',
                  texto:'Combinação ideal: solo argiloso é o ambiente natural do arroz irrigado — a baixa permeabilidade mantém a lâmina de água necessária para o cultivo em taipas.' },
    pastagem:   { mod:+4,  sinergia:'neutra',   risco:'baixo',
                  texto:'Solo argiloso comporta bem pastagem desde que se evite superpastejo que compacte as camadas superficiais, reduzindo a infiltração de água.' },
    cobertura:  { mod:+8,  sinergia:'positiva', risco:'baixo',
                  texto:'Excelente combinação: cobertura verde em solo argiloso reduz erosão laminar, melhora porosidade e adiciona matéria orgânica que estrutura o solo a longo prazo.' }
  },
  arenoso: {
    soja:       { mod:-6,  sinergia:'negativa', risco:'alto',
                  texto:'Solo arenoso reduz o potencial produtivo da soja: baixa retenção de água gera estresse hídrico em veranicos e a lixiviação de nutrientes exige adubações mais parceladas.' },
    milho:      { mod:-7,  sinergia:'negativa', risco:'alto',
                  texto:'Milho em solo arenoso sofre com baixa retenção hídrica e nutricional. A alta demanda de N do milho agrava a lixiviação. Requer irrigação suplementar e adubação nitrogenada parcelada.' },
    trigo:      { mod:-4,  sinergia:'negativa', risco:'medio',
                  texto:'Trigo tolera solo arenoso, mas exige adubação parcelada e monitoramento hídrico. A lixiviação de fósforo e potássio pode limitar a produtividade.' },
    feijao:     { mod:-2,  sinergia:'neutra',   risco:'medio',
                  texto:'Feijão tem tolerância moderada ao solo arenoso. O curto ciclo da cultura reduz a exposição ao déficit hídrico, mas exige manejo de irrigação criterioso.' },
    laranja:    { mod:+7,  sinergia:'positiva', risco:'baixo',
                  texto:'Boa combinação: solo arenoso favorece laranja pela excelente drenagem — elimina o principal risco da cultura (podridão radicular) e promove boa aeração do sistema radicular.' },
    hortalicas: { mod:-5,  sinergia:'negativa', risco:'alto',
                  texto:'Hortaliças em solo arenoso exigem irrigação mais frequente (intervalos menores) e adubação parcelada em até 5 aplicações por ciclo para compensar a lixiviação acelerada.' },
    tabaco:     { mod:+4,  sinergia:'positiva', risco:'baixo',
                  texto:'Tabaco tem bom desempenho em solo arenoso — a boa aeração do sistema radicular favorece o desenvolvimento das raízes fasciculadas e o secamento natural das folhas.' },
    cafe:       { mod:-3,  sinergia:'negativa', risco:'medio',
                  texto:'Café em solo arenoso necessita de irrigação suplementar — a baixa retenção hídrica pode causar estresse nos períodos secos, afetando a floração e o enchimento de frutos.' },
    uva:        { mod:+8,  sinergia:'positiva', risco:'baixo',
                  texto:'Solo arenoso é favorável para uva — boa drenagem reduz drasticamente a incidência de doenças fúngicas e favorece a concentração de açúcares nos frutos.' },
    morango:    { mod:+3,  sinergia:'neutra',   risco:'medio',
                  texto:'Morango tolera solo arenoso com irrigação controlada. A boa drenagem reduz podridões, mas exige maior frequência de irrigação e fertilização.' },
    algodao:    { mod:-5,  sinergia:'negativa', risco:'alto',
                  texto:'Algodão em solo arenoso sofre com baixa retenção hídrica em seus longos 150–180 dias de ciclo. Demanda irrigação complementar e adubação parcelada.' },
    cana:       { mod:-6,  sinergia:'negativa', risco:'alto',
                  texto:'Cana-de-açúcar em solo arenoso necessita de irrigação intensiva. A alta demanda hídrica da cultura não é bem suportada pela baixa capacidade de campo do solo arenoso.' },
    arroz:      { mod:-12, sinergia:'negativa', risco:'alto',
                  texto:'Incompatibilidade crítica: solo arenoso não retém a lâmina de água necessária para arroz inundado. A água percola antes de ser aproveitada, tornando o cultivo inviável sem impermeabilização.' },
    pastagem:   { mod:-2,  sinergia:'neutra',   risco:'medio',
                  texto:'Pastagem em solo arenoso exige manejo da lotação para evitar degradação — a cobertura vegetal é o principal protetor contra a erosão eólica e hídrica.' },
    cobertura:  { mod:+10, sinergia:'positiva', risco:'baixo',
                  texto:'Cobertura verde é especialmente importante em solo arenoso — protege contra erosão, acumula matéria orgânica que melhora a estrutura e aumenta a CTC do solo.' }
  },
  misto: {
    soja:       { mod:+4,  sinergia:'positiva', risco:'baixo',
                  texto:'Solo franco (misto) é adequado para soja — equilíbrio entre retenção hídrica e drenagem favorece o desenvolvimento das raízes e a nodulação de rizóbios.' },
    milho:      { mod:+6,  sinergia:'positiva', risco:'baixo',
                  texto:'Solo franco é excelente para milho — boa fertilidade natural, estrutura adequada e equilíbrio hídrico favorecem altas produtividades com manejo eficiente.' },
    trigo:      { mod:+6,  sinergia:'positiva', risco:'baixo',
                  texto:'Solo franco é ideal para trigo — equilibra bem as demandas hídricas da cultura ao longo do ciclo sem os extremos de encharcamento (argiloso) ou déficit (arenoso).' },
    feijao:     { mod:+7,  sinergia:'positiva', risco:'baixo',
                  texto:'Feijão tem excelente desempenho em solo franco — as condições de drenagem e retenção são próximas das ideais para esta leguminosa sensível ao encharcamento.' },
    laranja:    { mod:+4,  sinergia:'positiva', risco:'baixo',
                  texto:'Solo franco com boa drenagem é adequado para laranja — oferece retenção hídrica suficiente sem o risco de encharcamento presente em solos muito argilosos.' },
    hortalicas: { mod:+8,  sinergia:'positiva', risco:'baixo',
                  texto:'Solo franco é o tipo preferencial para hortaliças — estrutura física favorável, boa drenagem, fácil preparo e resposta eficiente à adubação constituem o ambiente ideal.' },
    tabaco:     { mod:+5,  sinergia:'positiva', risco:'baixo',
                  texto:'Tabaco tem bom desempenho em solo franco — boa aeração, retenção hídrica moderada e estrutura favorável ao desenvolvimento do sistema radicular.' },
    cafe:       { mod:+7,  sinergia:'positiva', risco:'baixo',
                  texto:'Solo franco argiloso (misto) é considerado ideal para café — excelente retenção de nutrientes e umidade, boa drenagem e estrutura que suporta o pomar perene.' },
    uva:        { mod:+5,  sinergia:'positiva', risco:'baixo',
                  texto:'Solo franco com drenagem adequada é ótimo para uva — equilibra a disponibilidade hídrica sem os problemas de encharcamento que favorecem doenças fúngicas.' },
    morango:    { mod:+8,  sinergia:'positiva', risco:'baixo',
                  texto:'Solo franco é excelente para morango — estrutura, drenagem e retenção equilibradas criam as condições ideais para o desenvolvimento das plantas e qualidade dos frutos.' },
    algodao:    { mod:+4,  sinergia:'positiva', risco:'baixo',
                  texto:'Algodão tolera bem solo franco — a boa estrutura e retenção hídrica equilibrada suportam o longo ciclo da cultura sem os extremos hídricos prejudiciais.' },
    cana:       { mod:+5,  sinergia:'positiva', risco:'baixo',
                  texto:'Cana-de-açúcar tem bom desempenho em solo franco — retenção hídrica equilibrada e boa estrutura suportam o ciclo anual e permitem boa mecanização da colheita.' },
    arroz:      { mod:+1,  sinergia:'neutra',   risco:'medio',
                  texto:'Solo franco pode funcionar para arroz de sequeiro ou com irrigação, mas solo argiloso seria mais adequado para o cultivo inundado por melhor reter a lâmina de água.' },
    pastagem:   { mod:+6,  sinergia:'positiva', risco:'baixo',
                  texto:'Solo franco é excelente para pastagem — boa estrutura, resistência à compactação moderada e retenção hídrica adequada favorecem a produção de forragem.' },
    cobertura:  { mod:+7,  sinergia:'positiva', risco:'baixo',
                  texto:'Cobertura verde em solo franco apresenta excelente resultado — facilidade de decomposição, incorporação de matéria orgânica e proteção contra erosão.' }
  }
};

/* ── Multiplicador de desgaste acumulado por tipo de solo ──
   Indica o quanto a monocultura danifica MAIS em solos frágeis */
const DESGASTE_SOLO = {
  arenoso:  { mult: 1.6, desc: 'Solo arenoso amplifica os efeitos da monocultura pela baixa CTC e rápida lixiviação de nutrientes.' },
  misto:    { mult: 1.0, desc: 'Solo franco tem resiliência moderada à repetição de culturas.' },
  argiloso: { mult: 0.8, desc: 'Solo argiloso tem maior resiliência à monocultura pela alta CTC e reserva de nutrientes.' }
};

const BIOMAS_PRESERV = {
  cerrado:      { min: 20, nome: 'Cerrado' },
  mata_atlantica:{ min: 20, nome: 'Mata Atlântica' },
  amazonia:     { min: 80, nome: 'Amazônia' },
  caatinga:     { min: 20, nome: 'Caatinga' },
  pampa:        { min: 20, nome: 'Pampa' }
};

/* ═══════════════════════════════════════════════════
   REGIÕES, BIOMAS E SOLOS DO PARANÁ
   Fonte: EMBRAPA / IAT / SEAB-PR
   ═══════════════════════════════════════════════════ */
const REGIOES_PARANA = {
  norte_noroeste: {
    nome: 'Norte e Noroeste do Paraná',
    emoji: '🌾',
    cor: '#f59e0b',
    biomas: ['Floresta Estacional Semidecidual', 'Mata Atlântica (transição)'],
    solosPred: ['Terra Roxa (Nitossolo Vermelho)', 'Latossolo Vermelho Eutroférrico'],
    soloResumo: 'Terra Roxa / Latossolo Vermelho',
    clima: 'Subtropical úmido — verões quentes (22–26 °C), invernos amenos',
    chuva: '1.200–1.500 mm/ano',
    geadaRisco: 'baixo',
    encharcRisco: 'baixo',
    cultivosIdeal: ['soja','milho','cafe','cana','algodao','feijao'],
    cultivosRisco: ['trigo'],
    riscos: [],
    descClimatico: 'Região mais quente do Paraná, com solos de alta fertilidade natural. A Terra Roxa é considerada um dos solos mais produtivos do Brasil.',
    modProdutividade: +0.08,   // +8% na eficiência produtiva
    modPreservacao:   +0,      // sem bônus especial de bioma
    modScore:         +5,      // bônus ao score final
    alertaGeada: [],
    alertaEncharcamento: [],
    alertaEspecial: []
  },
  oeste: {
    nome: 'Oeste do Paraná',
    emoji: '🌽',
    cor: '#22c55e',
    biomas: ['Mata Atlântica', 'Floresta Estacional Semidecidual'],
    solosPred: ['Latossolo Vermelho', 'Nitossolo Háplico'],
    soloResumo: 'Latossolo Vermelho / Nitossolo',
    clima: 'Subtropical úmido — precipitação bem distribuída, sem estação seca definida',
    chuva: '1.500–2.000 mm/ano',
    geadaRisco: 'moderado',
    encharcRisco: 'moderado',
    cultivosIdeal: ['soja','milho','trigo','feijao','hortalicas'],
    cultivosRisco: ['cafe','algodao','cana'],
    riscos: ['excesso_umidade'],
    descClimatico: 'Principal região produtora de soja e milho do Paraná. Alta pluviosidade e solos de excelente estrutura favorecem as culturas de grãos.',
    modProdutividade: +0.05,
    modPreservacao:   +2,      // Mata Atlântica presente
    modScore:         +3,
    alertaGeada: ['cafe','algodao'],
    alertaEncharcamento: ['laranja','uva'],
    alertaEspecial: []
  },
  centro_sul: {
    nome: 'Centro-Sul do Paraná',
    emoji: '🌳',
    cor: '#16a34a',
    biomas: ['Floresta com Araucárias', 'Campos Naturais', 'Mata Atlântica'],
    solosPred: ['Nitossolo Bruno', 'Cambissolo Húmico', 'Latossolo Bruno'],
    soloResumo: 'Nitossolo Bruno / Cambissolo',
    clima: 'Subtropical úmido — invernos frios, geadas frequentes (jun–ago)',
    chuva: '1.400–1.800 mm/ano',
    geadaRisco: 'alto',
    encharcRisco: 'baixo',
    cultivosIdeal: ['soja','trigo','feijao','hortalicas','morango','milho'],
    cultivosRisco: ['cafe','laranja','cana','algodao'],
    riscos: ['geada_severa','frio_intenso'],
    descClimatico: 'Região símbolo do Paraná, com a Floresta com Araucárias como ecossistema dominante. Invernos severos limitam culturas tropicais, mas favorecem cereais de inverno e fruticultura temperada.',
    modProdutividade: -0.03,
    modPreservacao:   +6,      // Araucárias — alto valor conservacionista
    modScore:         +2,
    alertaGeada: ['cafe','laranja','cana','algodao'],
    alertaEncharcamento: [],
    alertaEspecial: ['cafe','laranja']
  },
  sul: {
    nome: 'Sul do Paraná',
    emoji: '🌲',
    cor: '#0d9488',
    biomas: ['Floresta com Araucárias', 'Campos Naturais do Sul', 'Mata Atlântica'],
    solosPred: ['Cambissolo Háplico', 'Nitossolo Húmico', 'Gleissolo (várzeas)'],
    soloResumo: 'Cambissolo / Nitossolo Húmico',
    clima: 'Subtropical úmido frio — geadas severas e frequentes (mai–set)',
    chuva: '1.600–2.200 mm/ano',
    geadaRisco: 'muito alto',
    encharcRisco: 'moderado',
    cultivosIdeal: ['trigo','soja','feijao','morango','hortalicas','uva'],
    cultivosRisco: ['cafe','laranja','cana','algodao','milho'],
    riscos: ['geada_severa','frio_intenso','excesso_umidade'],
    descClimatico: 'Região com os invernos mais rigorosos do Paraná e alto potencial para vinicultura artesanal e culturas de clima temperado. A Floresta com Araucárias é protegida por legislação federal específica.',
    modProdutividade: -0.06,
    modPreservacao:   +7,
    modScore:         0,
    alertaGeada: ['cafe','laranja','cana','algodao','milho'],
    alertaEncharcamento: ['laranja','uva','tabaco'],
    alertaEspecial: ['cafe','laranja']
  },
  litoral: {
    nome: 'Litoral do Paraná',
    emoji: '🌊',
    cor: '#0ea5e9',
    biomas: ['Mata Atlântica', 'Restinga', 'Manguezal'],
    solosPred: ['Neossolo Quartzarênico (Areias)', 'Gleissolo Háplico', 'Organossolo'],
    soloResumo: 'Neossolo Arenoso / Gleissolo',
    clima: 'Tropical úmido — alta umidade, chuvas intensas, sem geadas',
    chuva: '2.000–3.500 mm/ano',
    geadaRisco: 'nenhum',
    encharcRisco: 'muito alto',
    cultivosIdeal: ['arroz','hortalicas','morango','pastagem','cobertura'],
    cultivosRisco: ['soja','milho','trigo','cafe','cana','uva','algodao','laranja'],
    riscos: ['encharcamento','excesso_umidade','salinidade'],
    descClimatico: 'Região com as maiores restrições agrícolas do Paraná, mas com altíssimo valor ambiental. Mata Atlântica, restinga e manguezais formam os ecossistemas mais biodiversos e sensíveis do estado.',
    modProdutividade: -0.12,
    modPreservacao:   +10,     // Mata Atlântica + restinga + manguezal
    modScore:         -5,
    alertaGeada: [],
    alertaEncharcamento: ['soja','milho','trigo','cafe','cana','uva','algodao','laranja'],
    alertaEspecial: ['soja','milho']
  }
};

/* ── Solos reais do Paraná → classe textural usada nos cálculos ── */
const SOLOS_PARANA_MAP = {
  terra_roxa: {
    nome: 'Terra Roxa', emoji: '🔴', classe: 'argiloso', fertBonus: +10,
    desc: 'Nitossolo Vermelho derivado do basalto. Um dos solos mais férteis do Brasil — alta CTC, excelente estrutura e retenção hídrica. Base da agricultura histórica do norte paranaense.',
    regioes: ['norte_noroeste']
  },
  latossolo_v: {
    nome: 'Latossolo Vermelho', emoji: '🟤', classe: 'argiloso', fertBonus: +5,
    desc: 'Solo profundo e bem drenado. Predominante no Oeste e Norte do Paraná. Alta capacidade produtiva para soja, milho e trigo com manejo adequado.',
    regioes: ['norte_noroeste', 'oeste']
  },
  nitossolo_b: {
    nome: 'Nitossolo / Latossolo Bruno', emoji: '🟣', classe: 'misto', fertBonus: +3,
    desc: 'Solo de transição argiloso-franco, característico do Centro-Sul do Paraná. Boa fertilidade, porém mais frio e com risco de compactação superficial em plantio direto mal manejado.',
    regioes: ['centro_sul', 'sul']
  },
  cambissolo: {
    nome: 'Cambissolo', emoji: '🔵', classe: 'misto', fertBonus: 0,
    desc: 'Solo jovem, pouco desenvolvido e mais raso. Ocorre nos planaltos do Sul. Fertilidade variável, exige manejo conservacionista para evitar erosão laminar em relevo ondulado.',
    regioes: ['centro_sul', 'sul']
  },
  neossolo_ar: {
    nome: 'Neossolo Arenoso', emoji: '🟡', classe: 'arenoso', fertBonus: -5,
    desc: 'Areias quartzosas de baixíssima fertilidade e retenção hídrica. Frequente no litoral e alguns pontos do noroeste. Exige adubação parcelada e cobertura vegetal permanente.',
    regioes: ['litoral']
  },
  gleissolo: {
    nome: 'Gleissolo / Hidromórfico', emoji: '💙', classe: 'argiloso', fertBonus: -3, encharcRisco: true,
    desc: 'Solo saturado de água quase permanentemente. Típico de várzeas e do litoral. Extremamente limitante — exige drenagem artificial intensiva para qualquer cultivo comercial.',
    regioes: ['litoral']
  },
};

const EFIC_IRRIG = {
  gotejamento:   { efic: 0.93, nome: 'Gotejamento' },
  microaspersao: { efic: 0.82, nome: 'Microaspersão' },
  aspersao:      { efic: 0.70, nome: 'Aspersão' },
  pivo:          { efic: 0.77, nome: 'Pivô central' },
  inundacao:     { efic: 0.45, nome: 'Inundação/sulcos' },
  nenhum:        { efic: 1.00, nome: 'Sem irrigação (sequeiro)' }
};

/* ═══════════════════════════════════════════════════
   2. ESTADO DA APLICAÇÃO (SPA)
   ═══════════════════════════════════════════════════ */
let currentPage = 'home';
let currentStep = 1;
let formState   = {
  solo: null, rotacao: null, cobertura: null,
  culturas: [],
  regiao: null,
  soloParanaKey: null   // chave real do solo paranaense
};

/* ═══════════════════════════════════════════════════
   3. NAVEGAÇÃO SPA
   ═══════════════════════════════════════════════════ */
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  currentPage = pageId;

  document.querySelectorAll('[id^="nav-"]').forEach(b => b.classList.remove('active'));
  const navBtn = document.getElementById('nav-' + pageId);
  if (navBtn) navBtn.classList.add('active');

  // Reset wizard quando navega para análise
  if (pageId === 'analise') {
    goStep(1);
    formState.culturas      = [];
    formState.regiao        = null;
    formState.soloParanaKey = null;
    formState.solo          = null;
    renderCulturasAdicionadas();
    document.getElementById('area-distribuicao').style.display = 'none';
    document.getElementById('culturas-interacao-box').classList.remove('show');
    document.getElementById('field-culturas-erro').style.display = 'none';
    document.getElementById('regiao-info-box').style.display = 'none';
    document.getElementById('solo-sugestao-regiao').style.display = 'none';
    document.getElementById('solo-detalhe-box').style.display = 'none';
    document.querySelectorAll('.regiao-btn, .solo-card-btn').forEach(b => b.classList.remove('active','sugerido'));
    atualizarHintsPonderados();
  }

  // Re-renderiza histórico ao abrir a página
  if (pageId === 'historico') {
    setTimeout(() => renderHistorico(), 50);
  }
}

/* ═══════════════════════════════════════════════════
   4. WIZARD — STEPS
   ═══════════════════════════════════════════════════ */
function goStep(n) {
  if (n > currentStep && !validateCurrentStep()) return;

  document.querySelectorAll('.wizard-step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('step-panel-' + n).classList.add('active');

  // Atualizar stepper visual
  for (let i = 1; i <= 3; i++) {
    const circle = document.getElementById('sc-' + i);
    const name   = document.getElementById('sn-' + i);
    circle.classList.remove('done', 'active');
    name.classList.remove('done', 'active');
    if (i < n)      { circle.classList.add('done');   circle.textContent = '✓'; name.classList.add('done'); }
    else if (i === n){ circle.classList.add('active'); circle.textContent = i;  name.classList.add('active'); }
    else            { circle.textContent = i; }
  }

  for (let i = 1; i <= 2; i++) {
    const conn = document.getElementById('stc-' + i);
    conn.classList.toggle('done', i < n);
  }

  const progMap = { 1: '33%', 2: '66%', 3: '100%' };
  document.getElementById('wizard-progress').style.width = progMap[n];

  currentStep = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ═══════════════════════════════════════════════════
   5. VALIDAÇÃO
   ═══════════════════════════════════════════════════ */
function validateCurrentStep() {
  let ok = true;

  if (currentStep === 1) {
    const hectares = document.getElementById('inp-hectares').value;
    const field    = document.getElementById('field-hectares');
    if (!hectares || parseFloat(hectares) <= 0) {
      field.classList.add('invalid'); ok = false;
    } else { field.classList.remove('invalid'); }

    if (!formState.solo) {
      document.getElementById('field-solo').classList.add('invalid'); ok = false;
    } else { document.getElementById('field-solo').classList.remove('invalid'); }
  }

  if (currentStep === 2) {
    const agua    = document.getElementById('inp-agua').value;
    const fertiliz= document.getElementById('inp-fertiliz').value;

    if (formState.culturas.length === 0) {
      document.getElementById('field-culturas-erro').style.display = 'block'; ok = false;
    } else {
      document.getElementById('field-culturas-erro').style.display = 'none';
    }
    // Validate area doesn't exceed property
    const hectares = parseFloat(document.getElementById('inp-hectares').value) || 0;
    const totalCult = formState.culturas.reduce((s,c) => s + c.area, 0);
    if (totalCult > hectares && hectares > 0) {
      document.getElementById('area-dist-erro').classList.add('show'); ok = false;
    } else {
      document.getElementById('area-dist-erro').classList.remove('show');
    }
    if (!agua || parseFloat(agua)<0) { document.getElementById('field-agua').classList.add('invalid'); ok=false; }
    else                             { document.getElementById('field-agua').classList.remove('invalid'); }
    if (!fertiliz||parseFloat(fertiliz)<0){ document.getElementById('field-fertiliz').classList.add('invalid'); ok=false; }
    else                             { document.getElementById('field-fertiliz').classList.remove('invalid'); }
  }

  if (currentStep === 3) {
    const pres = document.getElementById('inp-pres').value;
    if (!pres || parseFloat(pres) < 0) {
      document.getElementById('field-pres').classList.add('invalid'); ok = false;
    } else { document.getElementById('field-pres').classList.remove('invalid'); }
  }

  return ok;
}

/* ═══════════════════════════════════════════════════
   6. TOGGLE BUTTONS (solo, rotação, cobertura)
   ═══════════════════════════════════════════════════ */
function selectToggle(group, el) {
  el.closest('.toggle-pair').querySelectorAll('.toggle-opt').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  formState[group] = el.dataset.val;

  if (group === 'solo') {
    ['argiloso','arenoso','misto'].forEach(t => {
      const box = document.getElementById('info-solo-' + t);
      if (box) box.style.display = (t === el.dataset.val) ? 'block' : 'none';
    });
    document.getElementById('field-solo').classList.remove('invalid');
  }
}

/* ═══════════════════════════════════════════════════
   7. GESTÃO DE MÚLTIPLAS CULTURAS
   ═══════════════════════════════════════════════════ */

function adicionarCultura() {
  const key  = document.getElementById('sel-nova-cultura').value;
  const area = parseFloat(document.getElementById('inp-nova-area').value);
  if (!key) { alert('Selecione uma cultura.'); return; }
  if (!area || area <= 0) { alert('Informe uma área válida (em hectares).'); return; }
  if (formState.culturas.find(c => c.key === key)) {
    alert('Esta cultura já foi adicionada. Você pode editar a área diretamente no card.'); return;
  }
  formState.culturas.push({ key, area });
  document.getElementById('sel-nova-cultura').value = '';
  document.getElementById('inp-nova-area').value = '';
  renderCulturasAdicionadas();
  atualizarHintsPonderados();
}

function removerCultura(key) {
  formState.culturas = formState.culturas.filter(c => c.key !== key);
  renderCulturasAdicionadas();
  atualizarHintsPonderados();
}

function atualizarAreaCultura(key, novaArea) {
  const entry = formState.culturas.find(c => c.key === key);
  if (entry) entry.area = parseFloat(novaArea) || 0;
  atualizarBarraArea();
  atualizarHintsPonderados();
}

function renderCulturasAdicionadas() {
  const container = document.getElementById('culturas-adicionadas');
  container.innerHTML = '';

  formState.culturas.forEach(item => {
    const c = CULTURAS[item.key];
    if (!c) return;

    const div = document.createElement('div');
    div.className = 'cultura-card-item';
    div.innerHTML = `
      <div class="cci-emoji">${c.emoji}</div>
      <div class="cci-info">
        <div class="cci-nome">${c.nome}</div>
        <div class="cci-tags">
          ${c.tags.map(t => `<span class="cci-tag verde">${t}</span>`).join('')}
          ${c.tracos.geladaSensivel ? '<span class="cci-tag terra">❄️ Geada</span>' : ''}
          ${c.tracos.drenagemCritica ? '<span class="cci-tag azul">💧 Drenagem</span>' : ''}
          ${c.tracos.manejoIntensivo ? '<span class="cci-tag ambar">⚡ Intensivo</span>' : ''}
        </div>
      </div>
      <div class="cci-area">
        <input type="number" value="${item.area}" min="1"
          onchange="atualizarAreaCultura('${item.key}', this.value)"
          oninput="atualizarAreaCultura('${item.key}', this.value)">
        <span class="cci-area-unit">ha</span>
      </div>
      <button class="cci-remove" onclick="removerCultura('${item.key}')" title="Remover">✕</button>
    `;
    container.appendChild(div);
  });

  atualizarBarraArea();
  atualizarInteracoes();

  const distEl = document.getElementById('area-distribuicao');
  if (formState.culturas.length > 0) distEl.style.display = 'block';
  else distEl.style.display = 'none';
}

function atualizarBarraArea() {
  const hectares = parseFloat(document.getElementById('inp-hectares').value) || 0;
  const total = formState.culturas.reduce((s, c) => s + c.area, 0);
  const pct = hectares > 0 ? Math.min(120, (total / hectares) * 100) : 0;
  const sobrou = hectares - total;

  const fill = document.getElementById('area-dist-fill');
  fill.style.width = Math.min(100, pct) + '%';
  fill.className = 'area-dist-bar-fill' + (pct > 100 ? ' over' : pct > 85 ? ' warn' : '');

  const totalEl = document.getElementById('area-dist-total');
  totalEl.textContent = total.toFixed(1) + ' ha usados';
  totalEl.className = 'area-dist-total ' + (pct > 100 ? 'perigo' : pct > 85 ? 'alerta' : 'ok');

  document.getElementById('area-dist-usado').textContent   = total.toFixed(1) + ' ha em culturas';
  document.getElementById('area-dist-restante').textContent = (sobrou >= 0 ? sobrou.toFixed(1) : '0') + ' ha livres';
  document.getElementById('area-dist-max').textContent      = 'Total: ' + (hectares || '—') + ' ha';

  const erroEl = document.getElementById('area-dist-erro');
  erroEl.classList.toggle('show', total > hectares && hectares > 0);

  // Chips de porcentagem por cultura
  const chipsEl = document.getElementById('area-dist-chips');
  chipsEl.innerHTML = formState.culturas.map(item => {
    const c = CULTURAS[item.key];
    const pctC = hectares > 0 ? ((item.area / hectares) * 100).toFixed(0) : 0;
    const cor = CULTURA_CORES[item.key] || '#94a3b8';
    return `<span class="area-dist-pct-chip" style="background:${cor}22;color:${cor};border:1px solid ${cor}44">${c.emoji} ${c.nome}: ${pctC}%</span>`;
  }).join('');
}

function atualizarInteracoes() {
  const box = document.getElementById('culturas-interacao-box');
  const items = document.getElementById('ci-items');
  if (formState.culturas.length < 2) { box.classList.remove('show'); return; }

  const msgs = new Set();
  for (let i = 0; i < formState.culturas.length; i++) {
    for (let j = i+1; j < formState.culturas.length; j++) {
      const chave = formState.culturas[i].key + '+' + formState.culturas[j].key;
      if (INTERACOES[chave]) msgs.add(INTERACOES[chave].msg);
    }
  }
  // Diversificação geral
  if (formState.culturas.length >= 3) msgs.add('✅ Propriedade com alta diversificação — redução de riscos climáticos e de mercado.');
  else if (formState.culturas.length === 2) msgs.add('ℹ️ Duas culturas. Considere adicionar uma terceira para maximizar a diversificação e resiliência.');

  items.innerHTML = [...msgs].map(m => `<div class="ci-item">${m}</div>`).join('');
  box.classList.add('show');
}

function atualizarHintsPonderados() {
  if (formState.culturas.length === 0) {
    document.getElementById('agua-ref-hint').textContent = 'Adicione culturas para ver a referência ponderada.';
    document.getElementById('fertiliz-ref-hint').textContent = 'Adicione culturas para ver a referência ponderada.';
    return;
  }
  const pond = calcularPonderadoMulti();
  document.getElementById('agua-ref-hint').innerHTML =
    `<span style="color:var(--verde-medio);font-weight:600">🌾 Referência ponderada (${formState.culturas.length} cultura${formState.culturas.length>1?'s':''}):</span> ` +
    `${pond.aguaMin.toFixed(0)}–${pond.aguaMax.toFixed(0)} mm/safra (ideal médio: ~${pond.aguaIdeal.toFixed(0)} mm).`;
  document.getElementById('fertiliz-ref-hint').innerHTML =
    `<span style="color:var(--verde-medio);font-weight:600">🧪 Referência ponderada:</span> ` +
    `${pond.fertilizMin.toFixed(0)}–${pond.fertilizMax.toFixed(0)} kg NPK/ha (ideal médio: ~${pond.fertilizIdeal.toFixed(0)} kg/ha).`;
}

/* Calcula a referência agronômica ponderada pela área de cada cultura */
function calcularPonderadoMulti() {
  const total = formState.culturas.reduce((s, c) => s + c.area, 0) || 1;
  let aguaMin = 0, aguaMax = 0, aguaIdeal = 0;
  let fertilizMin = 0, fertilizMax = 0, fertilizIdeal = 0;
  let prodIdeal = 0, prodMin = 0, prodMax = 0;

  formState.culturas.forEach(item => {
    const c   = CULTURAS[item.key];
    const w   = item.area / total;
    aguaMin      += c.aguaMin      * w;
    aguaMax      += c.aguaMax      * w;
    aguaIdeal    += c.aguaIdeal    * w;
    fertilizMin  += c.fertilizMin  * w;
    fertilizMax  += c.fertilizMax  * w;
    fertilizIdeal+= c.fertilizIdeal* w;
    prodMin      += c.prodMin      * w;
    prodMax      += c.prodMax      * w;
    prodIdeal    += c.prodIdeal    * w;
  });
  return { aguaMin, aguaMax, aguaIdeal, fertilizMin, fertilizMax, fertilizIdeal, prodMin, prodMax, prodIdeal };
}

/* Calcula bônus/penalidade de interação entre culturas */
function calcularInteracaoScore() {
  if (formState.culturas.length <= 1) return 0;
  let bonus = 0;
  const keys = formState.culturas.map(c => c.key);
  for (let i = 0; i < keys.length; i++) {
    for (let j = i+1; j < keys.length; j++) {
      const chave = keys[i] + '+' + keys[j];
      if (INTERACOES[chave]) bonus += INTERACOES[chave].score;
    }
  }
  return Math.min(15, Math.max(-10, bonus)); // cap ±15
}

/* Calcula nível de diversificação */
function calcularDiversificacao() {
  const n = formState.culturas.length;
  if (n >= 3) return { nivel: 'alta',  label: '🌈 Alta diversificação',  cls: 'alta',  bonus: 10 };
  if (n === 2) return { nivel: 'media', label: '🔄 Diversificação moderada', cls: 'media', bonus: 4  };
  return           { nivel: 'baixa', label: '⚠️ Monocultura — baixa diversificação', cls: 'baixa', bonus: -6 };
}

/* Verifica se há culturas incompatíveis com o solo selecionado */
function alertasSoloXCultura(solo) {
  const avisos = [];
  formState.culturas.forEach(item => {
    const c = CULTURAS[item.key];
    if (c.soloIdeal && c.soloIdeal.length > 0 && !c.soloIdeal.includes(solo)) {
      avisos.push(`⚠️ ${c.nome}: prefere solo ${c.soloIdeal.join(' ou ')}, não ${solo}.`);
    }
    if (solo === 'argiloso' && c.tracos.drenagemCritica) {
      avisos.push(`⚠️ ${c.nome}: solo argiloso tem drenagem lenta — risco de encharcamento para esta cultura.`);
    }
  });
  return avisos;
}

/* Keep onCulturaChange as a no-op for backward compat */
function onCulturaChange() {}

/* ── Seleção de solo paranaense ── */
function selectSoloParana(btn) {
  document.querySelectorAll('.solo-card-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const key = btn.dataset.val;
  formState.soloParanaKey = key;
  const s = SOLOS_PARANA_MAP[key];
  formState.solo = s.classe;           // argiloso / arenoso / misto para os cálculos
  document.getElementById('field-solo').classList.remove('invalid');

  // Mostra detalhe do solo
  const box = document.getElementById('solo-detalhe-box');
  box.style.display = 'block';
  box.innerHTML = `
    <div class="solo-detalhe-header">
      <span style="font-size:1.3rem">${s.emoji}</span>
      <div>
        <div class="solo-detalhe-nome">${s.nome}</div>
        <span class="solo-detalhe-classe">Classe textural: <strong>${s.classe}</strong></span>
        ${s.fertBonus > 0 ? `<span class="solo-detalhe-bonus pos">+${s.fertBonus} fertilidade</span>` :
          s.fertBonus < 0 ? `<span class="solo-detalhe-bonus neg">${s.fertBonus} fertilidade</span>` : ''}
        ${s.encharcRisco ? `<span class="solo-detalhe-bonus neg">⚠️ Risco encharcamento</span>` : ''}
      </div>
    </div>
    <div class="solo-detalhe-desc">${s.desc}</div>
  `;
}

/* ── Seleção de região ── */
function selectRegiao(btn) {
  document.querySelectorAll('.regiao-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  formState.regiao = btn.dataset.val;
  renderRegiaoInfoBox(btn.dataset.val);
  destacarSolosRegiao(btn.dataset.val);
}

function renderRegiaoInfoBox(key) {
  const r   = REGIOES_PARANA[key];
  const box = document.getElementById('regiao-info-box');
  if (!r || !box) return;

  const adaptados = r.cultivosIdeal.map(k =>
    `<span class="reg-cult-chip verde">${CULTURAS[k]?.emoji||''} ${CULTURAS[k]?.nome||k}</span>`).join('');
  const riscoChips = r.cultivosRisco.map(k =>
    `<span class="reg-cult-chip vermelho">${CULTURAS[k]?.emoji||''} ${CULTURAS[k]?.nome||k}</span>`).join('');
  const biomaChips = r.biomas.map(b =>
    `<span class="reg-bioma-chip">${b}</span>`).join('');
  const geadaEmoji = { nenhum:'✅', baixo:'🟡', moderado:'🟠', alto:'🔴', 'muito alto':'🔴' };
  const encharcEmoji = { nenhum:'✅', baixo:'🟡', moderado:'🟠', alto:'🔴', 'muito alto':'🔴' };

  box.style.display = 'block';
  box.innerHTML = `
    <div class="regiao-info-header" style="border-left:4px solid ${r.cor}">
      <div class="regiao-info-title">${r.emoji} ${r.nome}</div>
      <div class="regiao-info-biomas">${biomaChips}</div>
    </div>
    <div class="regiao-info-grid">
      <div class="regiao-info-col">
        <div class="regiao-info-label">🌡️ Clima</div>
        <div class="regiao-info-val">${r.clima}</div>
        <div class="regiao-info-sub">Chuva: ${r.chuva}</div>
      </div>
      <div class="regiao-info-col">
        <div class="regiao-info-label">🌱 Solo Predominante</div>
        <div class="regiao-info-val">${r.soloResumo}</div>
        <div class="regiao-info-sub">${r.solosPred.join(', ')}</div>
      </div>
      <div class="regiao-info-col">
        <div class="regiao-info-label">❄️ Risco Geada</div>
        <div class="regiao-info-val">${geadaEmoji[r.geadaRisco]||'🟡'} ${r.geadaRisco.charAt(0).toUpperCase()+r.geadaRisco.slice(1)}</div>
        <div class="regiao-info-label" style="margin-top:.5rem">💧 Risco Encharcamento</div>
        <div class="regiao-info-val">${encharcEmoji[r.encharcRisco]||'🟡'} ${r.encharcRisco.charAt(0).toUpperCase()+r.encharcRisco.slice(1)}</div>
      </div>
      <div class="regiao-info-col">
        <div class="regiao-info-label">📊 Impacto no Score</div>
        <div class="regiao-info-val" style="color:${r.modScore>=0?'var(--ok)':'var(--perigo)'}">${r.modScore>=0?'+':''}${r.modScore} pts</div>
        <div class="regiao-info-sub">Prod.: ${r.modProdutividade>=0?'+':''}${(r.modProdutividade*100).toFixed(0)}%</div>
      </div>
    </div>
    <div style="margin-top:.85rem">
      <div class="regiao-info-label" style="margin-bottom:.4rem">✅ Culturas bem adaptadas</div>
      <div class="reg-cult-chips">${adaptados}</div>
    </div>
    ${riscoChips ? `<div style="margin-top:.6rem">
      <div class="regiao-info-label" style="margin-bottom:.4rem">⚠️ Culturas com risco nesta região</div>
      <div class="reg-cult-chips">${riscoChips}</div>
    </div>` : ''}
    <div class="regiao-info-desc">${r.descClimatico}</div>
  `;
}

/* ── Destaca solos típicos da região no selector ── */
function destacarSolosRegiao(regiaoKey) {
  // Remove todas as tags anteriores
  Object.keys(SOLOS_PARANA_MAP).forEach(sk => {
    const tag = document.getElementById('stag-' + sk);
    const btn = document.querySelector(`.solo-card-btn[data-val="${sk}"]`);
    if (!tag || !btn) return;
    if (SOLOS_PARANA_MAP[sk].regioes.includes(regiaoKey)) {
      tag.textContent = '✅ Típico desta região';
      tag.style.display = 'block';
      btn.classList.add('sugerido');
    } else {
      tag.textContent = '';
      tag.style.display = 'none';
      btn.classList.remove('sugerido');
    }
  });

  // Mostra banner de sugestão
  const reg = REGIOES_PARANA[regiaoKey];
  const box = document.getElementById('solo-sugestao-regiao');
  if (!reg || !box) return;
  const tipicos = Object.entries(SOLOS_PARANA_MAP)
    .filter(([,s]) => s.regioes.includes(regiaoKey))
    .map(([,s]) => `<strong>${s.emoji} ${s.nome}</strong>`).join(' e ');
  box.style.display = 'block';
  box.innerHTML = `<span style="font-size:1rem">${reg.emoji}</span> <div><strong>Solos típicos do ${reg.nome}:</strong> ${tipicos || reg.soloResumo}. Esses solos estão destacados abaixo.</div>`;
}
function calcularImpactoRegional(d, regiao) {
  if (!regiao) return { alertasGeada: [], alertasEncharcamento: [], modProd: 0, modScore: 0 };

  const alertasGeada         = [];
  const alertasEncharcamento = [];

  d.culturas.forEach(item => {
    const c = CULTURAS[item.key];
    if (!c) return;

    // Geada
    if (regiao.alertaGeada.includes(item.key)) {
      const nivel = regiao.geadaRisco;
      const grave = nivel === 'muito alto' || regiao.alertaEspecial.includes(item.key);
      alertasGeada.push(
        `${grave?'🚨':'⚠️'} ${c.nome}: ${grave?'INVIÁVEL':'risco elevado'} por geadas severas na ${regiao.nome}. ${
          item.key === 'cafe' ? 'Café necessita ao menos 10°C na mínima — esta região registra temperaturas abaixo de 0°C.' :
          item.key === 'laranja' ? 'Citros sofrem dano irreversível abaixo de -3°C.' :
          'Avalie cultivares mais resistentes ao frio.'}`
      );
    }

    // Encharcamento
    if (regiao.alertaEncharcamento.includes(item.key)) {
      const grave = regiao.encharcRisco === 'muito alto';
      alertasEncharcamento.push(
        `${grave?'🚨':'⚠️'} ${c.nome}: ${grave?'alto':'moderado'} risco de encharcamento na ${regiao.nome} (${regiao.chuva}). ${
          c.tracos?.drenagemCritica ? 'Esta cultura é especialmente sensível ao encharcamento.' :
          'Instale drenos superficiais e monitore o nível de água no solo.'}`
      );
    }
  });

  return {
    alertasGeada,
    alertasEncharcamento,
    modProd:  regiao.modProdutividade,
    modScore: regiao.modScore
  };
}

/* ═══════════════════════════════════════════════════
   ANÁLISE INTEGRADA SOLO × CULTURA × HISTÓRICO
   ═══════════════════════════════════════════════════ */

/**
 * Calcula o impacto combinado de solo + cultura + histórico
 * Retorna: { modScore, linhas, narrativa, nivelRisco, titulo }
 */
function calcularCombinacaoIntegrada(d) {
  const histDados   = histCarregarDados();
  const histAnalise = analisarHistorico(histDados);
  const soloMatrix  = SOLO_CULTURA_MATRIZ[d.solo] || SOLO_CULTURA_MATRIZ['misto'];
  const desgaste    = DESGASTE_SOLO[d.solo] || DESGASTE_SOLO['misto'];

  let modTotal = 0;
  const linhas  = [];   // Para o bloco "como chegamos aqui"

  // ── 1. Solo × cada cultura ──────────────────────
  const soloLines = [];
  d.culturas.forEach(item => {
    const compat = soloMatrix[item.key];
    if (!compat) return;
    const peso = item.area / (d.hectares || 1);
    const modPonderado = Math.round(compat.mod * Math.min(1, peso + 0.3)); // pelo menos 30% de peso
    modTotal += modPonderado * 0.4; // solo×cultura vale 40% do bonus
    soloLines.push({
      cultura: CULTURAS[item.key]?.nome || item.key,
      emoji:   CULTURAS[item.key]?.emoji || '🌾',
      sinergia: compat.sinergia,
      mod: modPonderado,
      texto: compat.texto,
      risco: compat.risco
    });
  });

  // ── 2. Histórico × Cultura atual ────────────────
  const histLines = [];
  if (histAnalise) {
    d.culturas.forEach(item => {
      // Conta quantas vezes essa cultura aparece no histórico
      const repeticoes = histDados.filter(r => r.cultura === item.key).length;
      const consecAtual = histAnalise.culturaMono === item.key ? histAnalise.maxConsec : 0;

      if (consecAtual >= 3) {
        // Monocultura prolongada + esta cultura está sendo plantada agora = risco amplificado
        const penalidade = Math.round(-(consecAtual * 3) * desgaste.mult);
        modTotal += penalidade * 0.35;
        histLines.push({
          tipo: 'perigo',
          texto: `${CULTURAS[item.key]?.emoji} ${CULTURAS[item.key]?.nome}: ${consecAtual} safras consecutivas no histórico. ${desgaste.desc} Penalidade amplificada em solo ${d.solo}: ${penalidade} pts.`,
          mod: penalidade
        });
      } else if (consecAtual >= 2) {
        const penalidade = Math.round(-4 * desgaste.mult);
        modTotal += penalidade * 0.35;
        histLines.push({
          tipo: 'alerta',
          texto: `${CULTURAS[item.key]?.emoji} ${CULTURAS[item.key]?.nome}: 2 safras seguidas no histórico. Atenção ao desgaste do solo ${d.solo}.`,
          mod: penalidade
        });
      } else if (histAnalise.idxRotacao >= 60 && repeticoes > 0) {
        // Boa rotação E usa esta cultura = reconhece o equilíbrio
        const bonus = Math.round(+6 * (1 / desgaste.mult));
        modTotal += bonus * 0.35;
        histLines.push({
          tipo: 'ok',
          texto: `${CULTURAS[item.key]?.emoji} ${CULTURAS[item.key]?.nome}: bem integrada no esquema de rotação do histórico (${histAnalise.idxRotacao}% de rotação). Bônus de resiliência para solo ${d.solo}: +${bonus} pts.`,
          mod: bonus
        });
      }
    });

    // ── 3. Solo + Histórico (estado geral do solo) ──
    const saudePenalidade = histAnalise.saudeSolo < 50
      ? Math.round(-(50 - histAnalise.saudeSolo) * 0.15 * desgaste.mult)
      : histAnalise.saudeSolo > 75
        ? Math.round(+(histAnalise.saudeSolo - 75) * 0.08)
        : 0;

    if (Math.abs(saudePenalidade) >= 2) {
      modTotal += saudePenalidade * 0.25;
      histLines.push({
        tipo: saudePenalidade < 0 ? 'alerta' : 'ok',
        texto: `Saúde histórica do solo: ${histAnalise.saudeSolo}/100 em solo ${d.solo}. ${desgaste.desc} Impacto: ${saudePenalidade > 0 ? '+' : ''}${saudePenalidade.toFixed(0)} pts.`,
        mod: Math.round(saudePenalidade)
      });
    }
  }

  modTotal = Math.round(Math.max(-20, Math.min(18, modTotal)));

  // ── 4. Nível de risco geral ─────────────────────
  const temRiscoAlto = soloLines.some(l => l.risco === 'alto');
  const temPerigo    = histLines.some(l => l.tipo === 'perigo');
  const nivelRisco   = temRiscoAlto || temPerigo ? 'alto' : modTotal >= 5 ? 'baixo' : 'medio';

  // ── 5. Narrativa integrada ──────────────────────
  const narrativa = gerarNarrativaIntegrada(d, soloLines, histLines, histAnalise, modTotal, desgaste);

  // Monta linhas para "Como chegamos"
  linhas.push(...soloLines.map(l => ({
    icon: l.emoji, label: `Solo ${d.solo} × ${l.cultura}`,
    mod: l.mod, tipo: l.sinergia === 'positiva' ? 'ok' : l.sinergia === 'negativa' ? 'perigo' : 'neutro',
    desc: l.texto
  })));
  linhas.push(...histLines.map(l => ({
    icon: '📋', label: 'Histórico',
    mod: l.mod, tipo: l.tipo === 'ok' ? 'ok' : l.tipo === 'perigo' ? 'perigo' : 'neutro',
    desc: l.texto
  })));

  return { modTotal, linhas, narrativa, nivelRisco, histAnalise, soloLines, histLines };
}

function gerarNarrativaIntegrada(d, soloLines, histLines, histAnalise, modTotal, desgaste) {
  const soloNome = { argiloso: 'argiloso', arenoso: 'arenoso', misto: 'franco (misto)' }[d.solo] || d.solo;
  const cultNomes = d.culturas.map(c => (CULTURAS[c.key]?.emoji || '') + ' ' + (CULTURAS[c.key]?.nome || c.key)).join(', ');
  const positivas = soloLines.filter(l => l.sinergia === 'positiva');
  const negativas = soloLines.filter(l => l.sinergia === 'negativa');
  const consecAtual = histAnalise?.culturaMono && d.culturas.map(c=>c.key).includes(histAnalise.culturaMono) ? histAnalise.maxConsec : 0;

  let paragrafos = [];

  // Parágrafo 1: Solo + Cultura
  if (positivas.length > 0 && negativas.length === 0) {
    paragrafos.push(`A propriedade apresenta combinação favorável entre solo ${soloNome} e as culturas selecionadas (${cultNomes}). ` +
      positivas.map(l => l.texto).join(' ') +
      ` Essa sinergia tende a resultar em menor necessidade de insumos corretivos e melhor aproveitamento dos nutrientes naturais do solo.`);
  } else if (negativas.length > 0 && positivas.length === 0) {
    paragrafos.push(`Há incompatibilidade técnica entre o solo ${soloNome} e as culturas selecionadas (${cultNomes}). ` +
      negativas.map(l => l.texto).join(' ') +
      ` Isso implica necessidade de manejo corretivo adicional para minimizar os riscos identificados.`);
  } else if (negativas.length > 0 && positivas.length > 0) {
    paragrafos.push(`A combinação solo ${soloNome} com as culturas escolhidas (${cultNomes}) apresenta resultados mistos. ` +
      `Por um lado: ${positivas.map(l=>l.texto).join(' ')} ` +
      `Por outro: ${negativas.map(l=>l.texto).join(' ')}`);
  } else {
    paragrafos.push(`A combinação solo ${soloNome} com ${cultNomes} é tecnicamente neutra — com o manejo adequado é possível obter bons resultados, embora sem as vantagens de uma sinergia natural positiva.`);
  }

  // Parágrafo 2: Histórico
  if (histAnalise && histAnalise.sorted.length >= 2) {
    if (consecAtual >= 3) {
      const cultMonoNome = CULTURAS[histAnalise.culturaMono]?.nome || histAnalise.culturaMono;
      paragrafos.push(`O histórico de plantio registra ${consecAtual} safras consecutivas de ${cultMonoNome} nesta propriedade. ` +
        `Em solo ${soloNome}, ${desgaste.desc.toLowerCase()} ` +
        `A repetição prolongada desta cultura aumenta o risco de acúmulo de patógenos específicos, desequilíbrio nutricional e redução gradual da produtividade — processo que pode ser irreversível sem intervenção.`);
    } else if (histAnalise.idxRotacao >= 60) {
      paragrafos.push(`O histórico registrado demonstra boa prática de rotação de culturas (índice de ${histAnalise.idxRotacao}%), o que contribui positivamente para a manutenção da fertilidade do solo ${soloNome}. ` +
        `A alternância de culturas favorece o equilíbrio nutricional, reduz a pressão de pragas e doenças e melhora a estrutura do solo ao longo do tempo.`);
    } else if (histAnalise.idxRotacao > 0) {
      paragrafos.push(`O histórico mostra rotação parcial (${histAnalise.idxRotacao}% das safras com mudança de cultura). ` +
        `Para solo ${soloNome}, recomenda-se aumentar a diversificação entre safras para preservar a fertilidade e reduzir riscos de degradação acumulada.`);
    }
  } else if (!histAnalise) {
    paragrafos.push(`Não há histórico de plantio cadastrado para esta propriedade. Recomenda-se registrar os anos anteriores na seção Histórico de Plantio para que o sistema possa oferecer um diagnóstico ainda mais preciso sobre o estado atual do solo.`);
  }

  // Conclusão
  if (modTotal >= 8) {
    paragrafos.push(`📊 <strong>Diagnóstico integrado positivo:</strong> a combinação solo × cultura × histórico contribui com +${modTotal} pontos ao score final. A propriedade está em um caminho tecnicamente favorável — mantenha as boas práticas para maximizar os resultados.`);
  } else if (modTotal >= 2) {
    paragrafos.push(`📊 <strong>Diagnóstico integrado moderado:</strong> a combinação solo × cultura × histórico contribui com +${modTotal} pontos. Há espaço para melhorias pontuais que podem aumentar significativamente a eficiência produtiva.`);
  } else if (modTotal >= -4) {
    paragrafos.push(`📊 <strong>Diagnóstico integrado neutro:</strong> a combinação solo × cultura × histórico tem impacto próximo de zero no score (${modTotal} pts). As práticas atuais não potencializam nem degradam o sistema produtivo de forma significativa.`);
  } else {
    paragrafos.push(`📊 <strong>Diagnóstico integrado de atenção:</strong> a combinação solo × cultura × histórico resulta em ${modTotal} pontos, indicando fatores de risco que, se não corrigidos, podem comprometer progressivamente a produtividade e a saúde ambiental da propriedade.`);
  }

  return paragrafos;
}


/* ═══════════════════════════════════════════════════
   8. MOTOR DE DIAGNÓSTICO — CORAÇÃO DO SISTEMA
   ═══════════════════════════════════════════════════ */
function gerarDiagnostico() {
  if (!validateCurrentStep()) return;

  const btn = document.getElementById('btn-gerar');
  btn.innerHTML = '<span class="spinner">⚙️</span> Gerando...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '⚡ Gerar Diagnóstico Completo';
    btn.disabled = false;

    const dados = coletarDados();
    const diag  = calcularDiagnostico(dados);
    renderizarResultado(dados, diag);
    showPage('resultado');
  }, 900);
}

function coletarDados() {
  const culturas = formState.culturas.length > 0
    ? formState.culturas
    : [{ key: 'soja', area: parseFloat(document.getElementById('inp-hectares').value) || 100 }];

  return {
    nome:           document.getElementById('inp-nome').value || 'Propriedade Rural',
    hectares:       parseFloat(document.getElementById('inp-hectares').value) || 100,
    solo:           formState.solo || 'misto',
    soloParanaKey:  formState.soloParanaKey || null,
    regiao:         formState.regiao || null,
    culturas,
    culturaKey:     culturas[0].key,
    agua:           parseFloat(document.getElementById('inp-agua').value) || 0,
    irrigFonte:     document.getElementById('inp-irrigacao-fonte').value,
    fertiliz:       parseFloat(document.getElementById('inp-fertiliz').value) || 0,
    fertilizTipo:   document.getElementById('inp-fertiliz-tipo').value,
    pres:           parseFloat(document.getElementById('inp-pres').value) || 0,
    bioma:          document.getElementById('inp-bioma').value,
    rotacao:        formState.rotacao || 'nao',
    cobertura:      formState.cobertura || 'nao',
    irrigSistema:   document.getElementById('inp-irrig-sistema').value,
  };
}

function calcularDiagnostico(d) {
  const pond  = calcularPonderadoMulti();
  const c     = pond;
  const cPrim = CULTURAS[d.culturas[0].key];
  const bioma = BIOMAS_PRESERV[d.bioma] || BIOMAS_PRESERV['cerrado'];
  const irrig = EFIC_IRRIG[d.irrigSistema] || EFIC_IRRIG['aspersao'];
  const divers= calcularDiversificacao();
  const interScore = calcularInteracaoScore();
  const avisosSolo = alertasSoloXCultura(d.solo);

  // ── ANÁLISE INTEGRADA Solo × Cultura × Histórico ──
  const combInt = calcularCombinacaoIntegrada(d);

  // ── ANÁLISE REGIONAL ──────────────────────────────
  const regiao = d.regiao ? (REGIOES_PARANA[d.regiao] || null) : null;
  const impactoReg = calcularImpactoRegional(d, regiao);

  const nomesCulturas = d.culturas.map(ci => CULTURAS[ci.key]?.nome || ci.key).join(' + ');

  // ── Dimensão: ÁGUA ─────────────────────────────
  let scoreAgua = 100;
  let statusAgua, diagAgua, consequenciaAgua, tipoAgua;

  if (d.irrigSistema === 'nenhum') {
    scoreAgua = 80; statusAgua = 'info'; diagAgua = 'ok'; tipoAgua = 'info';
    consequenciaAgua = `A propriedade opera em regime de sequeiro. O desenvolvimento das culturas (${nomesCulturas}) depende exclusivamente das chuvas, reduzindo custos mas aumentando vulnerabilidade a veranicos.`;
  } else if (d.agua > c.aguaMax * 1.2) {
    const excesso = d.agua - c.aguaMax;
    scoreAgua = 30; statusAgua = 'perigo'; diagAgua = 'perigo'; tipoAgua = 'perigo';
    consequenciaAgua = `Excesso de ${excesso.toFixed(0)} mm acima do máximo ponderado para ${nomesCulturas}. Em ${d.hectares} ha, equivale a ${((excesso*10000*d.hectares)/1e6).toFixed(1)} milhões de litros desperdiçados por safra, causando lixiviação de nutrientes.`;
  } else if (d.agua > c.aguaMax) {
    const excesso = d.agua - c.aguaMax;
    scoreAgua = 60; statusAgua = 'alerta'; diagAgua = 'alerta'; tipoAgua = 'alerta';
    consequenciaAgua = `Consumo ${excesso.toFixed(0)} mm acima do máximo ponderado. Risco moderado de lixiviação de fertilizantes em ${(excesso*10000*d.hectares/1e6).toFixed(1)} milhões de litros excedentes.`;
  } else if (d.agua < c.aguaMin * 0.8) {
    const deficit = c.aguaMin - d.agua;
    scoreAgua = 55; statusAgua = 'alerta'; diagAgua = 'alerta'; tipoAgua = 'alerta';
    consequenciaAgua = `Aplicação ${deficit.toFixed(0)} mm abaixo do mínimo ponderado para ${nomesCulturas}. Estresse hídrico pode reduzir produtividade em 15–35%.`;
  } else {
    scoreAgua = d.agua <= c.aguaIdeal ? 95 : 85;
    statusAgua = 'ok'; diagAgua = 'ok'; tipoAgua = 'ok';
    consequenciaAgua = `Consumo hídrico dentro da faixa ideal ponderada para ${nomesCulturas}. Sistema ${irrig.nome} (${(irrig.efic*100).toFixed(0)}% eficiência) bem dimensionado.`;
  }

  // ── Dimensão: FERTILIZANTE ──────────────────────
  let scoreFertiliz = 100;
  let statusFertiliz, diagFertiliz, consequenciaFertiliz, tipoFertiliz;

  if (d.fertiliz > c.fertilizMax * 1.25) {
    const excesso = d.fertiliz - c.fertilizMax;
    scoreFertiliz = 25; statusFertiliz = 'perigo'; diagFertiliz = 'perigo'; tipoFertiliz = 'perigo';
    consequenciaFertiliz = `Excesso de ${excesso.toFixed(0)} kg/ha acima do máximo ponderado. ${(excesso*d.hectares).toLocaleString('pt-BR')} kg de nutrientes não absorvidos causam eutrofização e acúmulo tóxico no solo. Custo desnecessário: ~R$ ${(excesso*d.hectares*3).toLocaleString('pt-BR')}/safra.`;
  } else if (d.fertiliz > c.fertilizMax) {
    const excesso = d.fertiliz - c.fertilizMax;
    scoreFertiliz = 60; statusFertiliz = 'alerta'; diagFertiliz = 'alerta'; tipoFertiliz = 'alerta';
    consequenciaFertiliz = `Fertilizante ${excesso.toFixed(0)} kg/ha acima do recomendado ponderado para o mix de culturas. Gasto extra: ~R$ ${(excesso*d.hectares*3).toLocaleString('pt-BR')}/safra.`;
  } else if (d.fertiliz < c.fertilizMin * 0.8) {
    const deficit = c.fertilizMin - d.fertiliz;
    scoreFertiliz = 55; statusFertiliz = 'alerta'; diagFertiliz = 'alerta'; tipoFertiliz = 'alerta';
    consequenciaFertiliz = `Adubação ${deficit.toFixed(0)} kg/ha abaixo do mínimo ponderado. Limita desenvolvimento e reduz produtividade potencial.`;
  } else {
    scoreFertiliz = 90; statusFertiliz = 'ok'; diagFertiliz = 'ok'; tipoFertiliz = 'ok';
    consequenciaFertiliz = `Fertilização dentro da faixa recomendada para o mix ${nomesCulturas}.` +
      (d.fertilizTipo === 'organico' ? ' Fertilizante orgânico: excelente para saúde do solo a longo prazo.' :
       d.fertilizTipo === 'misto'    ? ' Combinação químico + orgânico: boa prática.' : '');
  }

  // ── Dimensão: PRESERVAÇÃO ───────────────────────
  let scorePres = 100;
  let statusPres, diagPres, consequenciaPres, tipoPres;
  const presMin      = d.hectares * (bioma.min / 100);
  const presAtualPct = (d.pres / d.hectares) * 100;

  if (d.pres < presMin * 0.5) {
    scorePres = 10; statusPres = 'perigo'; diagPres = 'perigo'; tipoPres = 'perigo';
    consequenciaPres = `Área preservada (${d.pres} ha = ${presAtualPct.toFixed(1)}%) gravemente abaixo do mínimo legal de ${presMin.toFixed(1)} ha (${bioma.min}% — ${bioma.nome}). Déficit de ${(presMin-d.pres).toFixed(1)} ha. Sujeito a multa de R$ 5.000–R$ 10.000/ha irregular.`;
  } else if (d.pres < presMin) {
    scorePres = 45; statusPres = 'alerta'; diagPres = 'alerta'; tipoPres = 'alerta';
    consequenciaPres = `Área preservada abaixo do mínimo legal. Déficit de ${(presMin-d.pres).toFixed(1)} ha para atingir os ${bioma.min}% exigidos no ${bioma.nome}. Regularize via CAR e PRA.`;
  } else if (d.pres >= presMin && d.pres < presMin * 1.1) {
    scorePres = 78; statusPres = 'ok'; diagPres = 'ok'; tipoPres = 'ok';
    consequenciaPres = `Área preservada atende ao mínimo legal (${bioma.min}% — ${bioma.nome}). Propriedade regular. Para renda extra, considere créditos de carbono pelo excedente.`;
  } else {
    scorePres = 100; statusPres = 'ok'; diagPres = 'ok'; tipoPres = 'info';
    const excedente = d.pres - presMin;
    consequenciaPres = `Excelente! ${presAtualPct.toFixed(1)}% preservado — supera o mínimo em ${excedente.toFixed(1)} ha. Potencial de R$ ${(excedente*10*25).toLocaleString('pt-BR')}/ano em créditos de carbono.`;
  }

  // ── Dimensão: SOLO ──────────────────────────────
  let scoreSolo = 75, soloObs;
  const soloParana = d.soloParanaKey ? SOLOS_PARANA_MAP[d.soloParanaKey] : null;
  const soloNomeDisplay = soloParana ? soloParana.nome : d.solo;

  if (d.solo === 'misto')     { scoreSolo = 85; soloObs = `Solo ${soloNomeDisplay}: equilíbrio ideal entre retenção hídrica e drenagem — adequado para a maioria das culturas.`; }
  else if (d.solo === 'argiloso') { scoreSolo = 75; soloObs = `Solo ${soloNomeDisplay}: boa fertilidade, mas exige atenção à compactação e drenagem.`; }
  else { scoreSolo = 60; soloObs = `Solo ${soloNomeDisplay}: baixa retenção de água e nutrientes. Recomenda-se adubação parcelada e incorporação de matéria orgânica.`; }

  // Bônus/penalidade de fertilidade específica do solo paranaense
  if (soloParana) {
    scoreSolo = Math.max(20, Math.min(100, scoreSolo + soloParana.fertBonus));
    if (soloParana.encharcRisco) scoreSolo = Math.max(20, scoreSolo - 8);
  }

  // Penalidade de incompatibilidade solo × cultura
  if (avisosSolo.length > 0) scoreSolo = Math.max(40, scoreSolo - avisosSolo.length * 8);

  // ── Dimensão: ROTAÇÃO ───────────────────────────
  // Com múltiplas culturas, a rotação já existe implicitamente
  let scoreRotacao = d.rotacao === 'sim' ? 90 : 35;
  let rotacaoObs;
  if (d.culturas.length >= 2 && d.rotacao !== 'sim') {
    scoreRotacao = 70; // bonus por diversificação
    rotacaoObs = `A propriedade cultiva ${d.culturas.length} culturas diferentes simultaneamente, o que já reduz os riscos da monocultura. Declarar rotação formal entre safras trará ganhos adicionais de 15–25% em eficiência de fertilizantes.`;
  } else if (d.rotacao === 'sim') {
    rotacaoObs = `Rotação praticada com ${d.culturas.length > 1 ? d.culturas.length + ' culturas' : 'culturas alternadas'}. Excelente para saúde do solo, controle de pragas e economia de insumos.`;
  } else {
    rotacaoObs = 'Monocultura contínua favorece acúmulo de patógenos e esgota nutrientes de forma desequilibrada. Introduza pelo menos uma cultura rotacionada a cada duas safras.';
  }

  // ── Dimensão: COBERTURA ──────────────────────────
  let scoreCobertura = d.cobertura === 'sim' ? 85 : 40;

  // ── BÔNUS DE DIVERSIFICAÇÃO E INTERAÇÃO ──────────
  const bonusDiversif  = divers.bonus;
  const bonusInteracao = interScore;

  // ── SCORE GERAL ─────────────────────────────────
  let score = Math.round(
    scoreAgua      * 0.22 +
    scoreFertiliz  * 0.19 +
    scorePres      * 0.22 +
    scoreSolo      * 0.09 +
    scoreRotacao   * 0.11 +
    scoreCobertura * 0.05 +
    Math.max(0, bonusDiversif)  * 0.04 +
    Math.max(0, bonusInteracao) * 0.02
  );
  score += Math.min(0, bonusDiversif) + Math.min(0, bonusInteracao * 0.5);
  // Aplica ajuste integrado Solo × Cultura × Histórico (8% do score)
  score += Math.round(combInt.modTotal * 0.08 * 10) / 10;
  // Aplica modificador regional
  if (regiao) score += regiao.modScore;
  score = Math.max(0, Math.min(100, Math.round(score)));

  // ── PRODUÇÃO ESTIMADA (por cultura) ──────────────
  let eficienciaProd = 1.0;
  if (diagAgua === 'perigo')        eficienciaProd -= 0.30;
  else if (diagAgua === 'alerta')   eficienciaProd -= 0.10;
  if (diagFertiliz === 'perigo')    eficienciaProd -= 0.20;
  else if (diagFertiliz === 'alerta') eficienciaProd -= 0.08;
  if (d.solo === 'arenoso')         eficienciaProd -= 0.08;
  if (d.rotacao === 'sim')          eficienciaProd += 0.08;
  if (d.cobertura === 'sim')        eficienciaProd += 0.05;
  if (d.fertilizTipo === 'organico' || d.fertilizTipo === 'misto') eficienciaProd += 0.04;
  if (d.culturas.length >= 2)       eficienciaProd += 0.04; // bonus diversif.
  if (d.culturas.length >= 3)       eficienciaProd += 0.03;
  eficienciaProd = Math.max(0.3, Math.min(1.2, eficienciaProd));

  // ── Aplica modificador regional de produtividade ──
  if (regiao) eficienciaProd = Math.max(0.3, Math.min(1.3, eficienciaProd + regiao.modProdutividade));
  // ── Aplica bônus de fertilidade do solo paranaense ──
  if (soloParana && soloParana.fertBonus > 0) eficienciaProd = Math.min(1.3, eficienciaProd + soloParana.fertBonus * 0.005);
  if (soloParana && soloParana.encharcRisco)  eficienciaProd = Math.max(0.3, eficienciaProd - 0.06);

  // Produção por cultura
  const producaoPorCultura = d.culturas.map(item => {
    const cult = CULTURAS[item.key];
    const prod = cult.prodIdeal * eficienciaProd;
    return { key: item.key, nome: cult.nome, emoji: cult.emoji, area: item.area, prodHa: prod, prodTotal: prod * item.area };
  });
  const prodEstimadaMedia = pond.prodIdeal * eficienciaProd;
  const prodTotalGeral = producaoPorCultura.reduce((s, p) => s + p.prodTotal, 0);

  // ── SUGESTÕES ───────────────────────────────────
  const sugestoes = [];

  if (diagAgua === 'perigo' || diagAgua === 'alerta') {
    const meta = c.aguaIdeal;
    const dif  = d.agua - meta;
    sugestoes.push({
      prioridade: diagAgua === 'perigo' ? 1 : 2, tipo: diagAgua,
      titulo: 'Reduzir consumo de água',
      texto: ` Reduza a irrigação de ${d.agua} mm para ${meta.toFixed(0)} mm/safra (média ponderada para ${nomesCulturas}). Economia de ${(dif*10000*d.hectares/1e6).toFixed(1)} milhões de litros/safra.` +
        (irrig.efic < 0.80 ? ` Migrar para gotejamento (92% efic.) economiza mais ${((d.agua*(0.92-irrig.efic))*10000*d.hectares/1e6).toFixed(1)} milhões de litros.` : '')
    });
  }

  if (diagFertiliz === 'perigo' || diagFertiliz === 'alerta') {
    const meta = c.fertilizIdeal;
    const dif  = d.fertiliz - meta;
    sugestoes.push({
      prioridade: diagFertiliz === 'perigo' ? 1 : 2, tipo: diagFertiliz,
      titulo: 'Otimizar adubação por cultura',
      texto: ` Reduza de ${d.fertiliz} para ${meta.toFixed(0)} kg NPK/ha (média ponderada). Economia: R$ ${(dif*d.hectares*3).toLocaleString('pt-BR')}/safra. Realize análise de solo por talhão — cada cultura exige doses específicas.`
    });
  }

  if (d.pres < presMin) {
    const falta = presMin - d.pres;
    sugestoes.push({
      prioridade: 1, tipo: 'perigo',
      titulo: 'Regularizar Reserva Legal',
      texto: ` Faltam ${falta.toFixed(1)} ha para atingir o mínimo legal (${bioma.min}% = ${presMin.toFixed(1)} ha no ${bioma.nome}). Cadastre-se no CAR (sicar.gov.br) e adira ao PRA se necessário.`
    });
  }

  if (avisosSolo.length > 0) {
    sugestoes.push({
      prioridade: 2, tipo: 'alerta',
      titulo: 'Compatibilidade solo × culturas',
      texto: ' ' + avisosSolo.join(' ')
    });
  }

  if (d.rotacao === 'nao' && d.culturas.length === 1) {
    sugestoes.push({
      prioridade: 3, tipo: 'alerta',
      titulo: 'Implementar rotação de culturas',
      texto: ` Na próxima safra, introduza uma cultura complementar (ex: milho após soja, trigo no inverno). Em 3 safras, a economia em fertilizantes pode chegar a 25–30%.`
    });
  }

  if (d.cobertura === 'nao') {
    sugestoes.push({
      prioridade: 4, tipo: 'alerta',
      titulo: 'Adotar cobertura do solo no entre-safra',
      texto: ' Plante braquiária, aveia preta ou crotalária entre safras. Reduz erosão, melhora infiltração e adiciona matéria orgânica.'
    });
  }

  if (d.solo === 'arenoso') {
    sugestoes.push({
      prioridade: 4, tipo: 'info',
      titulo: 'Manejo especial para solo arenoso',
      texto: ' Incorpore 5–8 t/ha de composto orgânico. Parcele fertilizantes em 3–4 aplicações para reduzir lixiviação.'
    });
  }

  // Sugestão de diversificação se monocultura
  if (d.culturas.length === 1) {
    sugestoes.push({
      prioridade: 3, tipo: 'alerta',
      titulo: 'Considere diversificar as culturas',
      texto: ` A propriedade depende de apenas uma cultura (${CULTURAS[d.culturas[0].key].nome}), aumentando riscos de mercado e degradação do solo. Adicionar uma segunda cultura pode melhorar o score em até 14 pontos.`
    });
  }

  sugestoes.sort((a, b) => a.prioridade - b.prioridade);

  // ── Sugestões regionais (inseridas no início após ordenação) ──
  if (impactoReg.alertasEncharcamento.length > 0) {
    sugestoes.unshift({
      prioridade: 1, tipo: 'perigo',
      titulo: `💧 Risco de encharcamento (${regiao ? regiao.nome : 'região'})`,
      texto: ` ${impactoReg.alertasEncharcamento.join(' ')}`
    });
  }
  if (impactoReg.alertasGeada.length > 0) {
    sugestoes.unshift({
      prioridade: 1, tipo: 'perigo',
      titulo: `❄️ Risco climático regional (${regiao ? regiao.nome : 'região'})`,
      texto: ` ${impactoReg.alertasGeada.join(' ')}`
    });
  }

  return {
    score, c: pond, cPrim, nomesCulturas, divers, interScore,
    combInt, regiao, impactoReg,
    soloNomeDisplay, soloParana,
    agua:      { score: scoreAgua,     status: statusAgua,     diag: diagAgua,     consequencia: consequenciaAgua,     tipo: tipoAgua     },
    fertiliz:  { score: scoreFertiliz, status: statusFertiliz, diag: diagFertiliz, consequencia: consequenciaFertiliz, tipo: tipoFertiliz },
    pres:      { score: scorePres,     status: statusPres,     diag: diagPres,     consequencia: consequenciaPres,     tipo: tipoPres,    presMin, presAtualPct },
    solo:      { score: scoreSolo,     obs: soloObs, avisos: avisosSolo },
    rotacao:   { score: scoreRotacao,  obs: rotacaoObs },
    cobertura: { score: scoreCobertura },
    producao:  { estimada: prodEstimadaMedia, total: prodTotalGeral, eficiencia: eficienciaProd, porCultura: producaoPorCultura },
    sugestoes, irrig, bioma
  };
}

/* ═══════════════════════════════════════════════════
   DIAGNÓSTICO INTEGRADO — HELPERS
   ═══════════════════════════════════════════════════ */

function gerarPontosFortes(d, diag, combInt) {
  const f = [];
  const ha = combInt.histAnalise;

  if (diag.agua.score >= 80)        f.push({ icon:'💧', texto:`Consumo hídrico adequado para o mix de culturas (${Math.round(d.agua)} mm/safra dentro da faixa ideal).` });
  if (d.irrigSistema === 'gotejamento') f.push({ icon:'💧', texto:'Sistema de gotejamento com 92% de eficiência — uso racional da água.' });
  if (diag.fertiliz.score >= 80)    f.push({ icon:'🧪', texto:'Fertilização equilibrada e dentro da faixa recomendada para as culturas.' });
  if (d.fertilizTipo === 'organico') f.push({ icon:'🌿', texto:'Fertilizante orgânico: melhora a microbiota e a estrutura do solo a longo prazo.' });
  if (d.fertilizTipo === 'misto')   f.push({ icon:'🌿', texto:'Combinação orgânico + químico: sustentabilidade aliada à eficiência produtiva.' });
  if (diag.pres.score >= 78) {
    const exc = (d.pres - diag.pres.presMin).toFixed(1);
    f.push({ icon:'🌳', texto:`Área preservada supera o mínimo legal em ${exc} ha — potencial de créditos de carbono e serviços ecossistêmicos.` });
  } else if (diag.pres.score >= 60) f.push({ icon:'🌳', texto:`Área preservada (${d.pres} ha) atende à legislação ambiental vigente.` });
  if (d.solo === 'misto')           f.push({ icon:'🌍', texto:'Solo franco (misto): equilíbrio natural entre drenagem e retenção hídrica — tipo ideal para a maioria das culturas.' });
  if (d.solo === 'argiloso')        f.push({ icon:'🌍', texto:'Solo argiloso: alta fertilidade natural e boa capacidade de troca de cátions (CTC).' });
  if (d.rotacao === 'sim')          f.push({ icon:'🔄', texto:'Rotação de culturas praticada: reduz pragas, equilibra nutrientes e pode economizar até 25% em fertilizantes.' });
  if (d.cobertura === 'sim')        f.push({ icon:'🌿', texto:'Cobertura do solo no entre-safra: protege contra erosão, adiciona matéria orgânica e melhora a infiltração.' });
  if (d.culturas.length >= 3)       f.push({ icon:'🌾', texto:`Alta diversificação: ${d.culturas.length} culturas cultivadas simultaneamente — redução de riscos climáticos e de mercado.` });
  else if (d.culturas.length === 2) f.push({ icon:'🌾', texto:`Duas culturas combinadas: diversificação moderada da produção e dos riscos.` });
  combInt.soloLines.filter(l=>l.sinergia==='positiva').forEach(l =>
    f.push({ icon: l.emoji, texto:`Solo ${d.solo} é naturalmente compatível com ${l.cultura}: ${l.texto.split('.')[0]}.` })
  );
  if (ha && ha.idxRotacao >= 60)    f.push({ icon:'📋', texto:`Histórico com ${ha.idxRotacao}% de rotação: excelente diversificação registrada ao longo dos anos.` });
  if (ha && ha.saudeSolo >= 70)     f.push({ icon:'🏥', texto:`Saúde histórica do solo em ${ha.saudeSolo}/100: manejo acumulado preservou bem a fertilidade.` });
  if (ha && ha.tendencia === 'melhorando') f.push({ icon:'📈', texto:'Tendência de melhora de produtividade detectada no histórico: as práticas adotadas estão dando resultado.' });

  // Regional
  if (diag.regiao) {
    const reg = diag.regiao;
    if (reg.modProdutividade > 0.04) f.push({ icon:reg.emoji, texto:`Localização privilegiada: ${reg.nome} — ${reg.soloResumo} com alta fertilidade natural contribui com +${(reg.modProdutividade*100).toFixed(0)}% na produtividade.` });
    if (reg.modPreservacao >= 5) f.push({ icon:'🌿', texto:`Bioma de alto valor: ${reg.biomas[0]} — preservação nesta região tem peso ambiental superior à média nacional.` });
    const cultBonus = d.culturas.filter(c => reg.cultivosIdeal.includes(c.key));
    cultBonus.forEach(c => f.push({ icon: CULTURAS[c.key]?.emoji||'🌾', texto:`${CULTURAS[c.key]?.nome} é cultura bem adaptada à ${reg.nome} — menor risco climático e melhor desempenho esperado.` }));
  }
  return f;
}

function gerarPontosAtencao(d, diag, combInt) {
  const a = [];
  const ha = combInt.histAnalise;
  const safe = v => (typeof v === 'number' && isFinite(v)) ? Math.round(v) : '—';

  if (diag.agua.score < 50)         a.push({ icon:'💧', texto:`Consumo hídrico crítico (${safe(d.agua)} mm) — risco de desperdício severo ou estresse nas culturas.` });
  else if (diag.agua.score < 70)    a.push({ icon:'💧', texto:`Uso de água acima do recomendado — reduzir para a faixa ideal (${safe(diag.c.aguaMin)}–${safe(diag.c.aguaMax)} mm) pode economizar insumos.` });
  if (diag.fertiliz.score < 50)     a.push({ icon:'🧪', texto:'Fertilização fora da faixa segura — risco de contaminação do lençol freático ou deficiência nutricional grave.' });
  else if (diag.fertiliz.score < 70) a.push({ icon:'🧪', texto:`Adubação acima do ideal — custo extra e risco de acúmulo de nutrientes no solo.` });
  if (diag.pres.score < 45)         a.push({ icon:'🌳', texto:`Área preservada (${d.pres} ha) gravemente abaixo do mínimo legal (${diag.pres.presMin.toFixed(1)} ha) — risco de autuação.` });
  else if (diag.pres.score < 65)    a.push({ icon:'🌳', texto:`Área preservada próxima ao limite mínimo — amplie para garantir segurança legal e ambiental.` });
  if (d.solo === 'arenoso')         a.push({ icon:'🌍', texto:'Solo arenoso: baixa retenção de água e nutrientes exige manejo mais intensivo e adubação parcelada.' });
  if (d.rotacao === 'nao' && d.culturas.length === 1) a.push({ icon:'🔄', texto:'Ausência de rotação em monocultura: risco crescente de pragas específicas e desgaste desequilibrado do solo.' });
  if (d.cobertura === 'nao')        a.push({ icon:'🌿', texto:'Solo exposto no entre-safra: vulnerável a erosão laminar, perda de matéria orgânica e ressecamento.' });
  if (d.culturas.length === 1) {
    const n = CULTURAS[d.culturas[0]?.key]?.nome || 'cultura';
    a.push({ icon:'⚠️', texto:`Propriedade com cultura única (${n}): maior vulnerabilidade a oscilações de preço, clima e pragas.` });
  }
  combInt.soloLines.filter(l=>l.sinergia==='negativa').forEach(l =>
    a.push({ icon: l.emoji, texto:`Incompatibilidade: solo ${d.solo} × ${l.cultura} — ${l.texto.split('.')[0]}.` })
  );
  if (ha && ha.temMonocultura) {
    const n = CULTURAS[ha.culturaMono]?.nome || ha.culturaMono;
    a.push({ icon:'📋', texto:`Histórico: ${ha.maxConsec} safras consecutivas de ${n} — desgaste acumulado do solo aumenta a cada ciclo.` });
  }
  if (ha && ha.cargaMedia >= 6)     a.push({ icon:'🧪', texto:`Carga química histórica crítica (índice ${ha.cargaMedia.toFixed(1)}) — risco para a microbiota e a fertilidade do solo.` });
  else if (ha && ha.cargaMedia >= 3) a.push({ icon:'🧪', texto:`Carga química histórica elevada (índice ${ha.cargaMedia.toFixed(1)}) — monitorar para evitar acúmulo prejudicial.` });
  if (ha && ha.tendencia === 'declinio') a.push({ icon:'📉', texto:'Tendência de queda de produtividade no histórico: revisar urgentemente as práticas de manejo.' });

  // Regional
  if (diag.regiao) {
    const reg = diag.regiao;
    if (reg.modProdutividade < -0.04) a.push({ icon:reg.emoji, texto:`${reg.nome}: condições edafoclimáticas limitam o potencial produtivo (${(reg.modProdutividade*100).toFixed(0)}%). Considere culturas mais adaptadas à região.` });
    diag.impactoReg?.alertasGeada?.forEach(msg => a.push({ icon:'❄️', texto: msg.replace(/^[🚨⚠️]\s*/,'') }));
    diag.impactoReg?.alertasEncharcamento?.forEach(msg => a.push({ icon:'💧', texto: msg.replace(/^[🚨⚠️]\s*/,'') }));
  }
  return a;
}

function gerarConexoes8(d, diag, combInt) {
  const ha = combInt.histAnalise;
  const safe = v => (typeof v === 'number' && isFinite(v)) ? Math.round(v) : '—';
  const conn = [];

  // 1 Solo × Cultura
  const melhor = combInt.soloLines[0];
  if (melhor) {
    const cls = melhor.sinergia === 'positiva' ? 'ok' : melhor.sinergia === 'negativa' ? 'perigo' : 'neutro';
    conn.push({ icon:'🌍🌾', titulo:'Solo × Cultura', cls,
      mod: melhor.mod,
      desc: melhor.sinergia === 'positiva' ? `Solo ${d.solo} é naturalmente compatível com ${melhor.cultura}` :
            melhor.sinergia === 'negativa' ? `Solo ${d.solo} não é ideal para ${melhor.cultura}` :
            `Combinação neutra: solo ${d.solo} com ${melhor.cultura}` });
  }

  // 2 Solo × Histórico
  if (ha) {
    const mult = (DESGASTE_SOLO[d.solo]||DESGASTE_SOLO.misto).mult;
    const cls  = ha.temMonocultura && mult > 1 ? 'perigo' : ha.idxRotacao >= 60 ? 'ok' : 'neutro';
    conn.push({ icon:'🌍📋', titulo:'Solo × Histórico', cls,
      mod: ha.temMonocultura ? -Math.round(mult * 5) : +4,
      desc: ha.temMonocultura
        ? `Solo ${d.solo} amplifica (${mult}×) o dano da monocultura prolongada`
        : `Bom histórico de rotação preservou a fertilidade do solo ${d.solo}` });
  }

  // 3 Solo × Água
  const aguaS = diag.agua.score;
  conn.push({ icon:'🌍💧', titulo:'Solo × Água', cls: aguaS>=75?'ok':aguaS>=50?'neutro':'perigo',
    mod: aguaS>=75?+3:aguaS>=50?0:-4,
    desc: d.solo === 'arenoso' && aguaS < 70
      ? 'Solo arenoso + irrigação elevada = lixiviação de nutrientes acelerada'
      : d.solo === 'argiloso' && aguaS >= 70
        ? 'Solo argiloso retém água eficientemente com a irrigação atual'
        : 'Irrigação compatível com a capacidade de retenção do solo' });

  // 4 Solo × Fertilizantes
  const fertS = diag.fertiliz.score;
  conn.push({ icon:'🌍🧪', titulo:'Solo × Fertilizantes', cls: fertS>=75?'ok':fertS>=50?'neutro':'perigo',
    mod: fertS>=75?+3:fertS>=50?0:-4,
    desc: d.solo === 'arenoso' && fertS < 70
      ? 'Solo arenoso + excesso de fertilizante = risco de lixiviação para o lençol freático'
      : d.solo === 'argiloso' && fertS >= 70
        ? 'Solo argiloso aproveita bem a dosagem de fertilizantes aplicada'
        : 'Fertilização ajustada à capacidade de absorção do solo' });

  // 5 Cultura × Histórico
  if (ha) {
    const rep  = combInt.histLines.some(l => l.tipo === 'perigo');
    const rot  = combInt.histLines.some(l => l.tipo === 'ok');
    conn.push({ icon:'🌾📋', titulo:'Cultura × Histórico', cls: rep?'perigo':rot?'ok':'neutro',
      mod: rep?-8:rot?+6:0,
      desc: rep  ? 'Cultura atual repetida por muitas safras — risco crescente de desgaste' :
            rot  ? 'Cultura atual bem integrada no esquema de rotação histórica' :
                   'Sem histórico relevante de repetição ou rotação para esta cultura' });
  }

  // 6 Cultura × Água
  conn.push({ icon:'🌾💧', titulo:'Cultura × Água', cls: diag.agua.diag==='ok'?'ok':diag.agua.diag==='alerta'?'neutro':'perigo',
    mod: diag.agua.diag==='ok'?+4:diag.agua.diag==='alerta'?-2:-6,
    desc: diag.agua.diag === 'ok'
      ? `Irrigação dentro da faixa ideal ponderada (${safe(diag.c.aguaMin)}–${safe(diag.c.aguaMax)} mm) para o mix`
      : diag.agua.diag === 'alerta'
        ? `Irrigação (${safe(d.agua)} mm) levemente acima do ideal para as culturas selecionadas`
        : `Consumo hídrico (${safe(d.agua)} mm) compromete o potencial produtivo` });

  // 7 Preservação × Sustentabilidade
  const presS = diag.pres.score;
  conn.push({ icon:'🌳🌱', titulo:'Preservação × Sustentabilidade', cls: presS>=78?'ok':presS>=45?'neutro':'perigo',
    mod: presS>=78?+6:presS>=45?0:-8,
    desc: presS >= 78
      ? `${diag.pres.presAtualPct.toFixed(0)}% preservado — equilíbrio entre produção e conservação`
      : presS >= 45
        ? 'Preservação no limite mínimo — sustentabilidade ambiental vulnerável'
        : 'Preservação insuficiente — risco ambiental e jurídico relevante' });

  // 8 Histórico × Saúde do Solo
  if (ha) {
    const s = ha.saudeSolo;
    conn.push({ icon:'📋🏥', titulo:'Histórico × Saúde Solo', cls: s>=70?'ok':s>=50?'neutro':'perigo',
      mod: s>=70?+6:s>=50?0:-8,
      desc: s >= 70
        ? `Saúde do solo em ${s}/100 — manejo histórico preservou bem a fertilidade`
        : s >= 50
          ? `Saúde do solo em ${s}/100 — sinais de atenção no manejo acumulado`
          : `Saúde do solo em ${s}/100 — solo em degradação pelo histórico de manejo` });
  }

  return conn;
}

function gerarNarrativaCompleta(d, diag, combInt) {
  const ha  = combInt.histAnalise;
  const safe = v => (typeof v === 'number' && isFinite(v)) ? Math.round(v) : '—';
  const soloNome = { argiloso:'argiloso', arenoso:'arenoso', misto:'franco (misto)' }[d.solo] || d.solo;
  const cultNomes = d.culturas.map(c => (CULTURAS[c.key]?.emoji||'') + ' ' + (CULTURAS[c.key]?.nome||c.key)).join(', ');
  const paras = [];

  // § 0 Abertura
  const posCount = combInt.soloLines.filter(l=>l.sinergia==='positiva').length;
  const negCount = combInt.soloLines.filter(l=>l.sinergia==='negativa').length;
  if (posCount > negCount) {
    paras.push(`A propriedade apresenta uma combinação tecnicamente favorável. O solo ${soloNome} e as culturas selecionadas (${cultNomes}) formam uma sinergia positiva que favorece a produtividade com menor necessidade de insumos corretivos.`);
  } else if (negCount > posCount) {
    paras.push(`A análise identificou pontos de atenção importantes na composição desta propriedade. A combinação de solo ${soloNome} com as culturas escolhidas (${cultNomes}) requer práticas de manejo específicas para compensar as incompatibilidades identificadas.`);
  } else {
    paras.push(`A propriedade apresenta uma composição equilibrada. A combinação de solo ${soloNome} com as culturas (${cultNomes}) tem potencial produtivo que depende diretamente da qualidade do manejo adotado.`);
  }

  // § 1 Solo × Cultura (detalhado)
  const positivas = combInt.soloLines.filter(l=>l.sinergia==='positiva');
  const negativas  = combInt.soloLines.filter(l=>l.sinergia==='negativa');
  if (positivas.length && !negativas.length) {
    paras.push(`<strong>Solo e culturas:</strong> ${positivas.map(l=>l.texto).join(' ')} Essa compatibilidade natural reduz a necessidade de corretivos e favorece a absorção eficiente de nutrientes.`);
  } else if (negativas.length && !positivas.length) {
    paras.push(`<strong>Solo e culturas:</strong> ${negativas.map(l=>l.texto).join(' ')} É necessário adotar práticas corretivas específicas — como calagem, gessagem ou ajuste do sistema de drenagem — para viabilizar o cultivo com produtividade adequada.`);
  } else if (negativas.length && positivas.length) {
    paras.push(`<strong>Solo e culturas:</strong> O resultado é misto. <em>Compatível:</em> ${positivas.map(l=>l.texto).join(' ')} <em>Atenção:</em> ${negativas.map(l=>l.texto).join(' ')}`);
  }

  // § 2 Água × Solo × Fertilizantes (conexão tripla)
  const aguaOk   = diag.agua.diag === 'ok';
  const fertOk   = diag.fertiliz.diag === 'ok';
  const arenoso  = d.solo === 'arenoso';
  if (!aguaOk || !fertOk) {
    let txt = `<strong>Uso de insumos e solo:</strong> `;
    if (!aguaOk && arenoso)  txt += `O uso de ${safe(d.agua)} mm de água em solo arenoso é particularmente problemático — a baixa capacidade de campo do solo faz com que o excesso percole rapidamente, arrastando nutrientes para o lençol freático. `;
    else if (!aguaOk)        txt += `O consumo hídrico atual (${safe(d.agua)} mm) está fora da faixa ideal (${safe(diag.c.aguaMin)}–${safe(diag.c.aguaMax)} mm) para este mix de culturas. `;
    if (!fertOk && arenoso)  txt += `Da mesma forma, a fertilização acima do ideal em solo arenoso resulta em custo elevado e contaminação — o nitrato não absorvido migra para águas subterrâneas. `;
    else if (!fertOk)        txt += `A fertilização fora da faixa ideal pode comprometer o equilíbrio nutricional do solo e onerar o custo de produção sem ganho proporcional de produtividade. `;
    paras.push(txt.trim());
  } else {
    paras.push(`<strong>Uso de insumos e solo:</strong> O consumo hídrico (${safe(d.agua)} mm) e a fertilização (${safe(d.fertiliz)} kg NPK/ha) estão dentro das faixas recomendadas para este solo e este mix de culturas. Esse equilíbrio é fundamental para preservar a microbiota do solo e evitar desperdícios financeiros e ambientais.`);
  }

  // § 3 Histórico × Saúde do Solo
  if (ha && ha.sorted.length >= 2) {
    const desgMult = (DESGASTE_SOLO[d.solo]||DESGASTE_SOLO.misto).mult;
    const consecAtual = ha.culturaMono && d.culturas.map(c=>c.key).includes(ha.culturaMono) ? ha.maxConsec : 0;
    if (consecAtual >= 3) {
      const n = CULTURAS[ha.culturaMono]?.nome || ha.culturaMono;
      paras.push(`<strong>Histórico e saúde do solo:</strong> O histórico registra ${consecAtual} safras consecutivas de ${n}. Em solo ${soloNome} (fator de desgaste ${desgMult}×), a repetição desta cultura acelera o empobrecimento de nutrientes específicos, favorece o acúmulo de patógenos e pode tornar a recuperação do solo progressivamente mais custosa. A saúde histórica do solo está em ${ha.saudeSolo}/100 — ${ha.saudeSolo < 50 ? 'situação de atenção que requer intervenção' : ha.saudeSolo < 70 ? 'razoável, mas com margem clara de melhoria' : 'relativamente preservada, mas o risco da monocultura é crescente'}.`);
    } else if (ha.idxRotacao >= 60) {
      paras.push(`<strong>Histórico e saúde do solo:</strong> O histórico demonstra boa prática de rotação de culturas (${ha.idxRotacao}% das safras com mudança de espécie). Essa diversificação ao longo do tempo é a principal responsável pela saúde histórica do solo em ${ha.saudeSolo}/100 — acima da média para este tipo de solo. A rotação praticada quebra ciclos de pragas, equilibra o perfil nutricional e melhora a estrutura física do solo a cada ciclo.`);
    } else {
      paras.push(`<strong>Histórico e saúde do solo:</strong> O histórico registrado mostra rotação parcial (${ha.idxRotacao}% das safras com alternância de cultura). A saúde do solo está em ${ha.saudeSolo}/100 — ${ha.saudeSolo < 50 ? 'preocupante' : 'em nível razoável'}. Aumentar a diversificação entre safras é a principal ação para melhorar este indicador.`);
    }
  } else if (!ha || ha.sorted.length < 2) {
    paras.push(`<strong>Histórico e saúde do solo:</strong> Não há histórico de plantio suficiente cadastrado para esta propriedade. Recomenda-se registrar os anos anteriores na seção Histórico de Plantio — esse dado tornará esta análise consideravelmente mais precisa e personalizada, especialmente em relação ao estado atual do solo.`);
  }

  // § 4 Preservação × Sustentabilidade
  const presAtual = diag.pres.presAtualPct.toFixed(0);
  const presMin   = diag.bioma.min;
  const biomaNome = diag.bioma.nome;
  if (diag.pres.score < 45) {
    paras.push(`<strong>Preservação e sustentabilidade:</strong> A área preservada atual (${presAtual}%) está significativamente abaixo do mínimo legal de ${presMin}% exigido para o bioma ${biomaNome}. Além do risco jurídico, a ausência de vegetação nativa reduz os serviços ecossistêmicos que beneficiam diretamente a produção agrícola: polinização, controle biológico natural, regulação hídrica de nascentes e proteção contra erosão em períodos de chuva intensa.`);
  } else if (diag.pres.score < 70) {
    paras.push(`<strong>Preservação e sustentabilidade:</strong> A área preservada (${presAtual}%) atende ao mínimo legal do ${biomaNome} (${presMin}%), mas com margem estreita. Para garantir a sustentabilidade de longo prazo da atividade agrícola nesta propriedade, considere ampliar gradualmente as áreas de preservação — as bordas de preservação têm efeito positivo direto sobre a produtividade das áreas cultivadas vizinhas.`);
  } else {
    const exc = (d.pres - diag.pres.presMin).toFixed(1);
    paras.push(`<strong>Preservação e sustentabilidade:</strong> A propriedade preserva ${presAtual}% da área — ${exc} ha acima do mínimo legal. Esse excedente representa serviços ecossistêmicos ativos: regulação hídrica, habitat para polinizadores e predadores naturais de pragas, além do potencial de monetização via mercado de créditos de carbono (estimativa: ~R$ ${(parseFloat(exc)*10*25).toLocaleString('pt-BR')}/ano a R$ 25/tCO₂).`);
  }

  // § 5 Contexto Regional
  if (diag.regiao) {
    const reg = diag.regiao;
    const cultRisco = d.culturas.filter(c => reg.cultivosRisco.includes(c.key)).map(c => CULTURAS[c.key]?.nome).filter(Boolean);
    const cultIdeal = d.culturas.filter(c => reg.cultivosIdeal.includes(c.key)).map(c => CULTURAS[c.key]?.nome).filter(Boolean);
    let textoReg = `<strong>Contexto regional — ${reg.nome}:</strong> `;
    textoReg += reg.descClimatico + ' ';
    if (cultIdeal.length > 0) textoReg += `As culturas ${cultIdeal.join(', ')} estão bem adaptadas a esta região. `;
    if (cultRisco.length > 0) textoReg += `<strong>Atenção:</strong> ${cultRisco.join(', ')} apresentam risco elevado nesta região — ${reg.geadaRisco !== 'nenhum' && reg.geadaRisco !== 'baixo' ? 'risco de geada' : 'risco de encharcamento'} pode comprometer a produção. `;
    if (reg.modProdutividade > 0) textoReg += `A fertilidade dos solos desta região contribui com +${(reg.modProdutividade*100).toFixed(0)}% na produtividade estimada. `;
    else if (reg.modProdutividade < 0) textoReg += `As condições edafoclimáticas desta região resultam em ${(reg.modProdutividade*100).toFixed(0)}% no potencial produtivo. `;
    paras.push(textoReg.trim());
  }

  // § 6 Conclusão geral
  if (combInt.modTotal >= 8 && diag.score >= 70) {
    paras.push(`📊 <strong>Conclusão:</strong> O diagnóstico integrado revela uma propriedade bem gerida, com conexões positivas entre os seus fatores produtivos e ambientais. O score de ${diag.score}/100 reflete este equilíbrio. Mantenha as boas práticas e considere as melhorias pontuais identificadas para elevar ainda mais a sustentabilidade da operação.`);
  } else if (diag.score >= 55) {
    paras.push(`📊 <strong>Conclusão:</strong> A propriedade possui uma base produtiva sólida, com pontos fortes identificados que equilibram as áreas de atenção. O score de ${diag.score}/100 pode ser melhorado significativamente com ajustes específicos de manejo — especialmente nos fatores sinalizados como críticos nesta análise.`);
  } else {
    paras.push(`📊 <strong>Conclusão:</strong> A análise integrada identificou múltiplos fatores de risco que, em conjunto, explicam o score de ${diag.score}/100. As incompatibilidades entre solo, culturas e histórico de manejo estão se potencializando — a intervenção em pelo menos dois dos pontos críticos identificados pode reverter significativamente essa tendência.`);
  }

  return paras;
}

function gerarRecomendacoesEspecificas(d, diag, combInt) {
  const recs = [];
  const ha   = combInt.histAnalise;
  const safe = v => (typeof v === 'number' && isFinite(v)) ? Math.round(v) : '—';

  // Água
  if (diag.agua.diag === 'perigo' || diag.agua.diag === 'alerta') {
    const metaAgua = safe(diag.c.aguaIdeal);
    const economia = ((d.agua - diag.c.aguaIdeal) * 10000 * d.hectares / 1e6).toFixed(1);
    recs.push({ prioridade:1, tipo:'perigo',
      titulo:'Reduzir irrigação para ' + metaAgua + ' mm/safra',
      texto:`A faixa ideal ponderada para este mix é ${safe(diag.c.aguaMin)}–${safe(diag.c.aguaMax)} mm. Reduzindo de ${safe(d.agua)} para ${metaAgua} mm, a propriedade economizará ${economia > 0 ? economia + ' milhões de litros' : 'recursos hídricos significativos'} por safra${d.irrigSistema !== 'gotejamento' ? ' — considere também migrar para gotejamento (92% eficiência) para ampliar o ganho' : ''}.` });
  }
  if (diag.fertiliz.diag === 'perigo' || diag.fertiliz.diag === 'alerta') {
    const metaFert = safe(diag.c.fertilizIdeal);
    const economia = Math.round((d.fertiliz - diag.c.fertilizIdeal) * d.hectares * 3);
    recs.push({ prioridade:1, tipo:'perigo',
      titulo:'Ajustar adubação para ' + metaFert + ' kg NPK/ha após análise de solo',
      texto:`Realize análise de solo por talhão (custo: ~R$ 60–100/amostra) antes da próxima safra. A redução da dosagem para o ideal economizaria ~R$ ${economia.toLocaleString('pt-BR')}/safra sem perda de produtividade — o excesso não é aproveitado pela planta e contamina o solo.` });
  }

  // Preservação
  if (diag.pres.score < 60) {
    const falta = (diag.pres.presMin - d.pres).toFixed(1);
    recs.push({ prioridade:1, tipo:'perigo',
      titulo:'Regularizar ' + falta + ' ha de Reserva Legal',
      texto:`Acesse o CAR (sicar.gov.br) para cadastrar a propriedade. Se necessário, adira ao PRA (Programa de Regularização Ambiental) para recompor a vegetação nativa no déficit identificado. Prazo para evitar autuação: imediato.` });
  }

  // Solo × Cultura
  combInt.soloLines.filter(l=>l.sinergia==='negativa').forEach(l => {
    recs.push({ prioridade:2, tipo:'alerta',
      titulo:`Manejo específico: ${l.cultura} em solo ${d.solo}`,
      texto:`${l.texto} Para minimizar o risco, adote: ${
        d.solo === 'arenoso' ? 'adubação parcelada em 3–4 aplicações, irrigação mais frequente em doses menores e incorporação de 5 t/ha de composto orgânico para elevar a CTC' :
        d.solo === 'argiloso' ? 'instalação de drenos superficiais, subsolagem a cada 3 anos para romper a camada compactada e monitoramento constante do nível freático' :
        'análise de solo específica e ajuste do manejo hídrico e nutricional'}.` });
  });

  // Rotação
  if (d.rotacao === 'nao' || (ha && ha.temMonocultura)) {
    const cultAtual = CULTURAS[d.culturas[0]?.key]?.nome || 'cultura atual';
    const sugestaoRot = d.culturas.some(c=>c.key==='soja') ? 'milho ou trigo' :
                        d.culturas.some(c=>c.key==='milho') ? 'soja ou feijão' :
                        d.culturas.some(c=>c.key==='tabaco') ? 'milho ou feijão' : 'leguminosas';
    recs.push({ prioridade:2, tipo:'alerta',
      titulo:`Iniciar rotação: alternar ${cultAtual} com ${sugestaoRot}`,
      texto:`A rotação de culturas é a ação com melhor custo-benefício para recuperar e manter a fertilidade do solo. Em 3 safras, a economia em fertilizantes pode chegar a 25% e a incidência de pragas específicas pode cair 40–60%. Comece na próxima safrinha ou safra de inverno.` });
  }

  // Cobertura
  if (d.cobertura === 'nao') {
    recs.push({ prioridade:3, tipo:'alerta',
      titulo:'Implementar cobertura verde no entre-safra',
      texto:`Plante braquiária, aveia preta, crotalária ou nabo forrageiro após a colheita. O investimento é de ~R$ 80–150/ha e o retorno inclui: redução de erosão em até 80%, incorporação de 1–3 t/ha de matéria orgânica, supressão de plantas daninhas e melhoria da infiltração de água.` });
  }

  // Solo arenoso
  if (d.solo === 'arenoso') {
    recs.push({ prioridade:3, tipo:'info',
      titulo:'Elevar matéria orgânica do solo arenoso',
      texto:`Incorpore 5–8 t/ha de composto orgânico por 2–3 anos consecutivos. Isso eleva a Capacidade de Troca de Cátions (CTC) — medida de quanto nutriente o solo consegue reter — de 2–4 para 8–12 cmolc/dm³, reduzindo a lixiviação e o custo com fertilizantes em 20–30%.` });
  }

  // Histórico
  if (ha && ha.cargaMedia >= 5) {
    recs.push({ prioridade:2, tipo:'alerta',
      titulo:'Reduzir carga química nas próximas 2 safras',
      texto:`O índice de carga química acumulada (${ha.cargaMedia.toFixed(1)}) está acima do nível seguro. Introduza ao menos 1 safra com defensivos exclusivamente biológicos. Faça análise microbiológica do solo para verificar o impacto na biota. A recuperação completa pode levar 2–4 anos com manejo adequado.` });
  }

  return recs.slice(0, 5); // máximo 5 recomendações
}

/* ═══════════════════════════════════════════════════
   9. RENDERIZAÇÃO DO RESULTADO
   ═══════════════════════════════════════════════════ */
function renderizarResultado(d, diag) {
  const c = diag.c;
  const now = new Date();

  // Cabeçalho
  document.getElementById('res-fazenda-label').textContent = d.nome.toUpperCase() + ' — DIAGNÓSTICO TÉCNICO';
  document.getElementById('res-titulo').textContent = 'Relatório de Sustentabilidade — ' + diag.nomesCulturas;
  document.getElementById('res-meta').textContent =
    `${d.hectares} ha · Solo ${d.solo} · Bioma: ${diag.bioma.nome} · ${d.culturas.length} cultura(s) · Gerado em ${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'})}`;

  // Score ring
  const ring = document.getElementById('score-ring-fill');
  const circ = 2 * Math.PI * 42;
  ring.style.strokeDasharray = circ;
  ring.style.strokeDashoffset = circ;
  ring.style.stroke = diag.score >= 70 ? '#4ade80' : diag.score >= 50 ? '#fbbf24' : '#f87171';
  setTimeout(() => {
    ring.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.34,1.1,.64,1)';
    ring.style.strokeDashoffset = circ * (1 - diag.score / 100);
  }, 200);

  // Score número
  const scoreEl = document.getElementById('res-score-num');
  animNum(scoreEl, 0, diag.score, 1200);

  // Badge classificação
  const badge = document.getElementById('res-classif-badge');
  badge.className = 'score-classif-badge';
  let classif, headline, summary;
  if (diag.score >= 75) {
    badge.classList.add('sustentavel'); classif = '🌟 SUSTENTÁVEL';
    headline = 'Propriedade com boa gestão ambiental e produtiva';
    summary  = 'Os principais indicadores estão dentro dos parâmetros técnicos. Foque nas melhorias pontuais indicadas para atingir excelência.';
  } else if (diag.score >= 50) {
    badge.classList.add('atencao'); classif = '⚠️ ATENÇÃO';
    headline = 'Existem problemas que precisam de correção';
    summary  = 'Alguns indicadores estão fora dos parâmetros recomendados. As ações sugeridas podem melhorar significativamente a sustentabilidade e a rentabilidade.';
  } else {
    badge.classList.add('critico'); classif = '🚨 SITUAÇÃO CRÍTICA';
    headline = 'Riscos ambientais e produtivos significativos identificados';
    summary  = 'Múltiplos indicadores estão em nível crítico. Ação imediata é necessária para evitar degradação do solo, riscos legais e perda de produtividade.';
  }
  badge.textContent = classif;
  document.getElementById('res-headline').textContent = headline;
  document.getElementById('res-summary').textContent = summary;

  document.getElementById('res-stat-producao').textContent = diag.producao.estimada.toFixed(1);
  document.getElementById('res-stat-agua').textContent = d.agua;
  document.getElementById('res-stat-pres').textContent = d.pres;

  // ── CARD DE MIX DE CULTURAS (antes do grid) ──
  const gridContainer = document.getElementById('diag-grid-container');

  // Diversificação badge + cards das culturas
  const mixHtml = `
    <div class="culturas-mix-card">
      <div class="culturas-mix-title">🌾 Mix de Culturas da Propriedade
        <span class="diversificacao-badge ${diag.divers.cls}" style="margin-left:auto">${diag.divers.label}</span>
      </div>
      <div class="culturas-mix-grid">
        ${diag.producao.porCultura.map(pc => {
          const pct = d.hectares > 0 ? ((pc.area / d.hectares) * 100).toFixed(0) : 0;
          return `<div class="cmg-item">
            <span class="cmg-emoji">${pc.emoji}</span>
            <div class="cmg-nome">${pc.nome}</div>
            <div class="cmg-area">${pc.area} ha</div>
            <span class="cmg-pct">${pct}% da área</span>
          </div>`;
        }).join('')}
      </div>
      ${diag.interScore !== 0 ? `<div style="margin-top:1rem;font-size:.82rem;color:var(--verde-medio);padding:.75rem;background:var(--verde-palido);border-radius:8px">
        🔬 <strong>Interação entre culturas:</strong> bônus de +${diag.interScore} pontos no score pela combinação.
      </div>` : ''}
    </div>`;
  gridContainer.innerHTML = '';
  gridContainer.insertAdjacentHTML('beforeend', mixHtml);


  // Helpers de formatação seguros — nunca retornam undefined/NaN/float longo
  const r    = v => (typeof v === 'number' && isFinite(v)) ? Math.round(v) : '—';
  const rf1  = v => (typeof v === 'number' && isFinite(v)) ? v.toFixed(1)  : '—';
  const cultLabel = d.culturas.length > 1
    ? `mix ponderado (${d.culturas.length} culturas)`
    : (CULTURAS[d.culturas[0]?.key]?.nome || 'cultura');

  const cards = [
    {
      key: 'agua',
      icon: '💧', iconClass: 'agua',
      title: 'Consumo de Água',
      sub: `${r(d.agua)} mm/safra · Sistema: ${diag.irrig.nome} (${(diag.irrig.efic*100).toFixed(0)}% eficiência) · Ref. ponderada: ${r(c.aguaMin)}–${r(c.aguaMax)} mm`,
      status: diag.agua.status,
      content: () => {
        const aguaMinR  = r(c.aguaMin);
        const aguaMaxR  = r(c.aguaMax);
        const pct       = (c.aguaMax && isFinite(c.aguaMax)) ? Math.min(100, (d.agua / (c.aguaMax * 1.3)) * 100) : 0;
        const idealPct  = (c.aguaMax && isFinite(c.aguaMax)) ? (c.aguaIdeal / (c.aguaMax * 1.3)) * 100 : 0;
        const cls = diag.agua.diag === 'ok' ? 'ok' : diag.agua.diag === 'alerta' ? 'alerta' : 'perigo';
        const faixaLabel = (aguaMinR !== '—' && aguaMaxR !== '—')
          ? `${aguaMinR}–${aguaMaxR} mm/safra`
          : 'Referência não disponível';
        return `
          <div class="value-comparator">
            <div class="vc-row">
              <span class="vc-label">Você usa</span>
              <span class="vc-val ${cls}">${r(d.agua)}<span class="vc-unit">mm/safra</span></span>
            </div>
            <div class="vc-row" style="margin-top:.25rem">
              <span class="vc-label">Ref. para ${cultLabel}</span>
              <span class="vc-val ok">${faixaLabel !== 'Referência não disponível' ? `${aguaMinR}–${aguaMaxR}` : '—'}<span class="vc-unit">${faixaLabel !== 'Referência não disponível' ? 'mm/safra' : faixaLabel}</span></span>
            </div>
            <div class="vc-bar-wrap" style="margin-top:.75rem">
              <div class="vc-bar-ideal" style="width:${idealPct}%"></div>
              <div class="vc-bar-actual ${cls}" style="width:0%" data-target="${pct}"></div>
            </div>
            <div class="vc-legend">
              <div class="vc-legend-item"><div class="vc-legend-dot" style="background:rgba(64,145,108,.4)"></div>Zona ideal</div>
              <div class="vc-legend-item"><div class="vc-legend-dot" style="background:${cls==='ok'?'#22c55e':cls==='alerta'?'#f59e0b':'#ef4444'}"></div>Seu consumo</div>
            </div>
          </div>
          <div class="diag-text">${getAguaDiagText(d, c, diag)}</div>
          <div class="diag-consequence ${diag.agua.tipo}"><span class="diag-consequence-icon">${diag.agua.tipo==='ok'?'✅':diag.agua.tipo==='alerta'?'⚠️':diag.agua.tipo==='perigo'?'🚨':'ℹ️'}</span><div>${diag.agua.consequencia}</div></div>`;
      }
    },
    {
      key: 'fertiliz',
      icon: '🧪', iconClass: 'fertiliz',
      title: 'Fertilização',
      sub: `${r(d.fertiliz)} kg NPK/ha · Ref. ponderada: ${r(c.fertilizMin)}–${r(c.fertilizMax)} kg/ha · ${d.fertilizTipo === 'quimico' ? 'Químico' : d.fertilizTipo === 'organico' ? 'Orgânico' : d.fertilizTipo === 'misto' ? 'Misto' : 'Biofertilizante'}`,
      status: diag.fertiliz.status,
      content: () => {
        const fertMinR  = r(c.fertilizMin);
        const fertMaxR  = r(c.fertilizMax);
        const pct       = (c.fertilizMax && isFinite(c.fertilizMax)) ? Math.min(100, (d.fertiliz / (c.fertilizMax * 1.4)) * 100) : 0;
        const idealPct  = (c.fertilizMax && isFinite(c.fertilizMax)) ? (c.fertilizIdeal / (c.fertilizMax * 1.4)) * 100 : 0;
        const cls = diag.fertiliz.diag === 'ok' ? 'ok' : diag.fertiliz.diag === 'alerta' ? 'alerta' : 'perigo';
        const faixaOk   = fertMinR !== '—' && fertMaxR !== '—';
        return `
          <div class="value-comparator">
            <div class="vc-row">
              <span class="vc-label">Você aplica</span>
              <span class="vc-val ${cls}">${r(d.fertiliz)}<span class="vc-unit">kg NPK/ha</span></span>
            </div>
            <div class="vc-row" style="margin-top:.25rem">
              <span class="vc-label">Ref. para ${cultLabel}</span>
              <span class="vc-val ok">${faixaOk ? `${fertMinR}–${fertMaxR}` : '—'}<span class="vc-unit">${faixaOk ? 'kg NPK/ha' : 'Referência não disponível'}</span></span>
            </div>
            <div class="vc-bar-wrap" style="margin-top:.75rem">
              <div class="vc-bar-ideal" style="width:${idealPct}%"></div>
              <div class="vc-bar-actual ${cls}" style="width:0%" data-target="${pct}"></div>
            </div>
            <div class="vc-legend">
              <div class="vc-legend-item"><div class="vc-legend-dot" style="background:rgba(64,145,108,.4)"></div>Zona recomendada</div>
              <div class="vc-legend-item"><div class="vc-legend-dot" style="background:${cls==='ok'?'#22c55e':cls==='alerta'?'#f59e0b':'#ef4444'}"></div>Sua aplicação</div>
            </div>
          </div>
          <div class="diag-text">${getFertilizDiagText(d, c, diag)}</div>
          <div class="diag-consequence ${diag.fertiliz.tipo}"><span class="diag-consequence-icon">${diag.fertiliz.tipo==='ok'?'✅':diag.fertiliz.tipo==='alerta'?'⚠️':'🚨'}</span><div>${diag.fertiliz.consequencia}</div></div>`;
      }
    },
    {
      key: 'pres',
      icon: '🌳', iconClass: 'pres',
      title: 'Área de Preservação', sub: `${d.pres} ha preservados de ${d.hectares} ha total (${diag.pres.presAtualPct.toFixed(1)}%) · ${diag.bioma.nome}`,
      status: diag.pres.status,
      content: () => {
        const pct = Math.min(100, (d.pres / d.hectares) * 100);
        const legalPct = diag.bioma.min;
        const cls = diag.pres.diag === 'ok' ? 'ok' : diag.pres.diag === 'alerta' ? 'alerta' : 'perigo';
        return `
          <div class="value-comparator">
            <div class="vc-row">
              <span class="vc-label">Área preservada</span>
              <span class="vc-val ${cls}">${d.pres}<span class="vc-unit">ha (${pct.toFixed(1)}%)</span></span>
            </div>
            <div class="vc-row" style="margin-top:.25rem">
              <span class="vc-label">Mínimo legal (${diag.bioma.nome})</span>
              <span class="vc-val" style="color:var(--info)">${diag.pres.presMin.toFixed(1)}<span class="vc-unit">ha (${legalPct}%)</span></span>
            </div>
            <div class="vc-bar-wrap" style="margin-top:.75rem">
              <div class="vc-bar-ideal" style="width:${Math.min(100,legalPct*1.5)}%"></div>
              <div class="vc-bar-actual ${cls}" style="width:0%" data-target="${Math.min(100,pct*1.5)}"></div>
            </div>
          </div>
          <div class="diag-text">${getPresDiagText(d, diag)}</div>
          <div class="diag-consequence ${diag.pres.tipo}"><span class="diag-consequence-icon">${diag.pres.tipo==='ok'?'✅':diag.pres.tipo==='alerta'?'⚠️':diag.pres.tipo==='perigo'?'🚨':'ℹ️'}</span><div>${diag.pres.consequencia}</div></div>`;
      }
    },
    {
      key: 'solo-rotacao',
      icon: '🌱', iconClass: 'rotacao',
      title: 'Solo & Manejo', sub: `Solo ${d.solo} · Rotação: ${d.rotacao === 'sim' ? 'Praticada' : 'Não praticada'} · Cobertura: ${d.cobertura === 'sim' ? 'Adotada' : 'Solo exposto'}`,
      status: diag.rotacao.score >= 70 && diag.solo.score >= 70 ? 'ok' : diag.rotacao.score >= 50 ? 'alerta' : 'perigo',
      content: () => `
        <div class="diag-text"><strong>Solo ${d.solo}:</strong> ${diag.solo.obs}</div>
        <div class="diag-consequence ${d.rotacao === 'sim' ? 'ok' : 'alerta'}"><span class="diag-consequence-icon">${d.rotacao === 'sim' ? '✅' : '⚠️'}</span><div>${diag.rotacao.obs}</div></div>
        ${d.cobertura === 'nao' ? `<div class="diag-consequence alerta"><span class="diag-consequence-icon">⚠️</span><div><strong>Solo exposto no entre-safra:</strong> Aumenta erosão em até 80%, perde matéria orgânica e reduz fertilidade para a próxima safra. Plante braquiária ou aveia preta como cobertura.</div></div>` : `<div class="diag-consequence ok"><span class="diag-consequence-icon">✅</span><div><strong>Cobertura do solo adotada:</strong> Excelente prática. Protege contra erosão, melhora infiltração de água e adiciona matéria orgânica ao solo.</div></div>`}`
    }
  ];

  const g = document.createElement('div');
  g.className = 'diag-grid';
  gridContainer.appendChild(g);

  cards.forEach(card => {
    const el = document.createElement('div');
    el.className = 'diag-card';
    el.innerHTML = `
      <div class="diag-card-header">
        <div class="diag-card-icon ${card.iconClass}">${card.icon}</div>
        <div>
          <div class="diag-card-title">${card.title}</div>
          <div class="diag-card-sub">${card.sub}</div>
        </div>
        <span class="status-pill ${card.status}">${card.status==='ok'?'✓ Adequado':card.status==='alerta'?'⚠ Atenção':'✗ Crítico'}</span>
      </div>
      <div class="diag-card-body">${card.content()}</div>
    `;
    g.appendChild(el);
  });

  // ── PRODUÇÃO ESTIMADA (por cultura) ──
  const prodNums = document.getElementById('producao-numbers');
  prodNums.innerHTML = `
    <div class="prod-num-item">
      <div class="prod-num-val">${diag.producao.total.toFixed(0)}<span class="prod-num-unit"> t</span></div>
      <div class="prod-num-label">Produção total estimada</div>
    </div>
    <div class="prod-num-item">
      <div class="prod-num-val">${diag.producao.estimada.toFixed(1)}<span class="prod-num-unit"> t/ha</span></div>
      <div class="prod-num-label">Produtividade média ponderada</div>
    </div>
    <div class="prod-num-item">
      <div class="prod-num-val" style="color:${diag.producao.eficiencia>0.9?'var(--ok)':diag.producao.eficiencia>0.7?'var(--alerta)':'var(--perigo)'}">${(diag.producao.eficiencia*100).toFixed(0)}<span class="prod-num-unit"> %</span></div>
      <div class="prod-num-label">Eficiência do potencial</div>
    </div>
    <div class="prod-num-item">
      <div class="prod-num-val">${d.culturas.length}<span class="prod-num-unit"> cultura${d.culturas.length>1?'s':''}</span></div>
      <div class="prod-num-label">Diversificação da propriedade</div>
    </div>
  `;

  const detalhePorCultura = diag.producao.porCultura.map(pc =>
    `${pc.emoji} <strong>${pc.nome}</strong> (${pc.area} ha): ~${pc.prodHa.toFixed(1)} t/ha = ${pc.prodTotal.toFixed(0)} t`
  ).join(' &nbsp;|&nbsp; ');

  document.getElementById('producao-obs').innerHTML =
    `<strong>Por cultura:</strong> ${detalhePorCultura}<br><br>` +
    `<strong>Como foi calculado:</strong> Produtividade base ponderada pela área de cada cultura, ajustada em ${((diag.producao.eficiencia-1)*100>0?'+':'')}${((diag.producao.eficiencia-1)*100).toFixed(0)}% considerando: uso de água (${diag.agua.status}), fertilização (${diag.fertiliz.status}), solo (${d.solo}), rotação (${d.rotacao}), diversificação (${diag.divers.nivel}). <em>Estimativa orientativa.</em>`;

  // Animar barras
  setTimeout(() => {
    document.querySelectorAll('.vc-bar-actual[data-target], .bar-diag-bar[data-target]').forEach(b => {
      b.style.width = b.dataset.target + '%';
    });
  }, 400);

  // ── DIAGNÓSTICO INTEGRADO FEATURED ─────────────
  const combInt  = diag.combInt;
  const pontosFt = gerarPontosFortes(d, diag, combInt);
  const pontosAt = gerarPontosAtencao(d, diag, combInt);
  const conexoes = gerarConexoes8(d, diag, combInt);
  const narrativa= gerarNarrativaCompleta(d, diag, combInt);
  const recs     = gerarRecomendacoesEspecificas(d, diag, combInt);

  const scoreCls = diag.score >= 70 ? 'ok' : diag.score >= 50 ? 'alerta' : 'perigo';
  const scoreLabel = diag.score >= 80 ? 'Excelente' : diag.score >= 70 ? 'Bom' : diag.score >= 55 ? 'Regular' : diag.score >= 40 ? 'Atenção' : 'Crítico';

  const conexaoHtml = conexoes.map(c => `
    <div class="integ8-chip ${c.cls}">
      <div class="integ8-chip-icons">${c.icon}</div>
      <div class="integ8-chip-titulo">${c.titulo}</div>
      <div class="integ8-chip-desc">${c.desc}</div>
      <div class="integ8-chip-mod ${c.mod>=0?'pos':'neg'}">${c.mod>=0?'+':''}${c.mod}</div>
    </div>`).join('');

  const fortesHtml = pontosFt.slice(0, 6).map(p =>
    `<div class="integ-pt-item forte"><span class="integ-pt-icon">${p.icon}</span><span>${p.texto}</span></div>`
  ).join('');

  const atencaoHtml = pontosAt.slice(0, 6).map(p =>
    `<div class="integ-pt-item atencao"><span class="integ-pt-icon">${p.icon}</span><span>${p.texto}</span></div>`
  ).join('');

  const narrativaHtml = narrativa.map(p =>
    `<p class="integ-narrativa-p">${p}</p>`).join('');

  const recsHtml = recs.map((r, i) => `
    <div class="integ-rec-item ${r.tipo}">
      <div class="integ-rec-num">${i+1}</div>
      <div class="integ-rec-body">
        <div class="integ-rec-titulo">${r.tipo==='perigo'?'🚨':r.tipo==='alerta'?'⚠️':'ℹ️'} ${r.titulo}</div>
        <div class="integ-rec-texto">${r.texto}</div>
      </div>
    </div>`).join('');

  document.getElementById('diag-integrado-featured').innerHTML = `
    <div class="integ-featured-card">

      <!-- HEADER -->
      <div class="integ-featured-header">
        <div class="integ-featured-header-left">
          <div class="integ-featured-eyebrow">Análise Completa</div>
          <h2 class="integ-featured-titulo">🌾 Diagnóstico Integrado da Propriedade</h2>
          <p class="integ-featured-sub">Como solo, culturas, histórico, água, fertilizantes e preservação se relacionam nesta propriedade</p>
        </div>
        <div class="integ-featured-score-wrap">
          <div class="integ-featured-score ${scoreCls}">${diag.score}</div>
          <div class="integ-featured-score-label">${scoreLabel}</div>
          <div class="integ-featured-score-sub">Score Integrado</div>
        </div>
      </div>

      <!-- PONTOS FORTES × ATENÇÃO -->
      <div class="integ-pt-grid">
        <div class="integ-pt-col forte-col">
          <div class="integ-pt-col-header forte">✅ Pontos Fortes</div>
          <div class="integ-pt-list">
            ${fortesHtml || '<div class="integ-pt-item" style="opacity:.5">Nenhum ponto forte identificado com os dados informados.</div>'}
          </div>
        </div>
        <div class="integ-pt-col atencao-col">
          <div class="integ-pt-col-header atencao">⚠️ Pontos de Atenção</div>
          <div class="integ-pt-list">
            ${atencaoHtml || '<div class="integ-pt-item" style="opacity:.5">Nenhum ponto de atenção identificado.</div>'}
          </div>
        </div>
      </div>

      <!-- 8 CONEXÕES -->
      <div class="integ8-secao">
        <div class="integ-secao-label">🔗 Conexões Identificadas pelo Sistema</div>
        <div class="integ8-grid">${conexaoHtml}</div>
      </div>

      <!-- NARRATIVA INTEGRADA -->
      <div class="integ-narrativa-secao">
        <div class="integ-secao-label">📝 Análise Narrativa Integrada</div>
        <div class="integ-narrativa">${narrativaHtml}</div>
      </div>

      <!-- RECOMENDAÇÕES ESPECÍFICAS -->
      ${recsHtml ? `<div class="integ-recs-secao">
        <div class="integ-secao-label">💡 Recomendações Específicas para Esta Propriedade</div>
        <div class="integ-recs-list">${recsHtml}</div>
      </div>` : ''}

    </div>
  `;

  // Remove references to old cards (they no longer exist in DOM)
  // sugestoes-list now populated without dedicated card — embed in sidebar
  const sugList = document.getElementById('sugestoes-list');
  if (sugList) {
    sugList.innerHTML = diag.sugestoes.map(s => `
      <li class="sugestao-item ${s.tipo === 'alerta' ? 'ambar' : ''}">
        <span class="sug-icon">${s.tipo === 'perigo' ? '🚨' : s.tipo === 'alerta' ? '⚠️' : s.tipo === 'info' ? 'ℹ️' : '✅'}</span>
        <div class="sug-text"><strong>${s.titulo}</strong>${s.texto}</div>
      </li>
    `).join('') || '<li class="sugestao-item"><span class="sug-icon">🌟</span><div class="sug-text"><strong>Excelente gestão!</strong> Propriedade dentro dos parâmetros ideais.</div></li>';
  }
  const fatores = [
    { icon:'💧', label:'Consumo de Água',      score: diag.agua.score,     peso:22,
      desc: diag.agua.diag==='ok'?'Dentro da faixa ideal ponderada':diag.agua.diag==='alerta'?'Acima do recomendado — risco de lixiviação':'Consumo crítico — desperdício severo' },
    { icon:'🧪', label:'Fertilização',         score: diag.fertiliz.score, peso:19,
      desc: diag.fertiliz.diag==='ok'?'Adubação dentro do recomendado':'Fora da faixa ideal ponderada para as culturas' },
    { icon:'🌳', label:'Preservação Legal',    score: diag.pres.score,     peso:22,
      desc: diag.pres.diag==='ok'?`${diag.pres.presAtualPct.toFixed(1)}% preservado — atende ao mínimo legal`:`Déficit de ${(diag.pres.presMin - d.pres).toFixed(1)} ha para o mínimo legal` },
    { icon:'🌍', label:`Solo ${d.solo}`,       score: diag.solo.score,     peso:9,
      desc: diag.solo.obs },
    { icon:'🔄', label:'Rotação de Culturas',  score: diag.rotacao.score,  peso:11,
      desc: diag.rotacao.obs },
    { icon:'🌿', label:'Cobertura do Solo',    score: diag.cobertura.score,peso:5,
      desc: d.cobertura==='sim'?'Cobertura praticada — protege e melhora o solo':'Cobertura não praticada — solo exposto entre safras' },
    { icon:'🌾', label:'Diversificação',       score: diag.divers.bonus>0?Math.min(100,50+diag.divers.bonus*3):Math.max(10,50+diag.divers.bonus*3), peso:4,
      desc: diag.divers.label },
    { icon:'🔗', label:'Solo × Cultura × Histórico', score: combInt.modTotal>=0?Math.min(100,65+combInt.modTotal*2):Math.max(10,65+combInt.modTotal*2), peso:8,
      desc: `Análise integrada: ${combInt.modTotal>=0?'+':''}${combInt.modTotal} pts — ${combInt.nivelRisco==='baixo'?'baixo risco integrado':combInt.nivelRisco==='alto'?'atenção a incompatibilidades':'risco moderado — manejo recomendado'}` },
  ];

  const pontContrib = fatores.map(f => {
    const contrib = Math.round((f.score / 100) * f.peso);
    const cls = f.score >= 70 ? 'ok' : f.score >= 45 ? 'alerta' : 'perigo';
    return `
      <div class="cc-linha">
        <div class="cc-linha-icon">${f.icon}</div>
        <div class="cc-linha-info">
          <div class="cc-linha-label">${f.label}</div>
          <div class="cc-linha-desc">${f.desc}</div>
        </div>
        <div class="cc-linha-direita">
          <div class="cc-bar-bg"><div class="cc-bar-fill ${cls}" style="width:0%" data-target="${f.score}"></div></div>
          <div class="cc-pontos ${cls}">+${contrib}<span style="font-weight:400;opacity:.6">/${f.peso}</span></div>
        </div>
      </div>`;
  }).join('');

  document.getElementById('como-chegamos-linhas').innerHTML = pontContrib;
  document.getElementById('cc-score-final').innerHTML = `
    <div class="cc-total-label">Score Final de Sustentabilidade</div>
    <div class="cc-total-num" style="color:${diag.score>=70?'var(--ok)':diag.score>=50?'var(--alerta)':'var(--perigo)'}">${diag.score}<span style="font-size:1.2rem;opacity:.5">/100</span></div>
    <div class="cc-total-sub">${combInt.modTotal!==0?`Inclui ${combInt.modTotal>=0?'+':''}${combInt.modTotal} pts do diagnóstico integrado Solo × Cultura × Histórico.`:''}</div>
  `;

  // Animar barras do "como chegamos"
  setTimeout(() => {
    document.querySelectorAll('.cc-bar-fill[data-target]').forEach(b => {
      b.style.transition = 'width 1.1s cubic-bezier(.34,1.1,.64,1)';
      b.style.width = b.dataset.target + '%';
    });
  }, 500);

  // ── SIDEBAR: RESUMO ──
  const resumo = document.getElementById('resumo-rapido');
  const culturasResumo = d.culturas.map(ci => `${CULTURAS[ci.key]?.emoji||''} ${CULTURAS[ci.key]?.nome||ci.key} (${ci.area} ha)`).join(', ');
  const soloLabel       = diag.soloParana ? `${diag.soloParana.emoji} ${diag.soloParana.nome} (${d.solo})` : d.solo.charAt(0).toUpperCase() + d.solo.slice(1);
  const regiaoLabel     = diag.regiao ? `${diag.regiao.emoji} ${diag.regiao.nome}` : '—';
  const biomaRegiaoLabel = diag.regiao ? diag.regiao.biomas[0] : diag.bioma.nome;
  resumo.innerHTML = [
    ['Área total', d.hectares + ' ha'],
    ['Culturas', culturasResumo],
    ['Diversificação', diag.divers.label],
    ['Solo', soloLabel],
    ...(diag.regiao ? [['Região', regiaoLabel], ['Bioma', biomaRegiaoLabel]] : [['Bioma', diag.bioma.nome]]),
    ['Irrigação', diag.irrig.nome],
    ['Rotação', d.rotacao === 'sim' ? '✅ Sim' : '❌ Não'],
    ['Cobertura', d.cobertura === 'sim' ? '✅ Sim' : '❌ Não'],
  ].map(([l,v]) => `<div class="quick-sum-item"><span class="quick-sum-label">${l}</span><span class="quick-sum-val">${v}</span></div>`).join('');

  // ── SIDEBAR: STATUS AMBIENTAL ──
  const statusAmb = document.getElementById('status-ambiental');
  statusAmb.innerHTML = [
    { icon:'💧', name:'Uso da água', cls: diag.agua.status },
    { icon:'🧪', name:'Fertilização', cls: diag.fertiliz.status },
    { icon:'🌳', name:'Preservação', cls: diag.pres.status },
    { icon:'🔄', name:'Rotação', cls: diag.rotacao.score >= 70 ? 'ok' : diag.rotacao.score >= 50 ? 'alerta' : 'perigo' },
    { icon:'🌿', name:'Cobertura do solo', cls: diag.cobertura.score >= 70 ? 'ok' : 'alerta' },
  ].map(e => `
    <div class="env-status-item">
      <div class="env-status-left"><span class="env-status-icon">${e.icon}</span><span class="env-status-name">${e.name}</span></div>
      <span class="env-status-badge ${e.cls}">${e.cls === 'ok' ? 'Adequado' : e.cls === 'alerta' ? 'Atenção' : 'Crítico'}</span>
    </div>
  `).join('');

  // ── SIDEBAR: RADAR ──
  const radarEl = document.getElementById('radar-dimensoes');
  const dims = [
    { name:'Água', score: diag.agua.score },
    { name:'Fertilizante', score: diag.fertiliz.score },
    { name:'Preservação', score: diag.pres.score },
    { name:'Solo', score: diag.solo.score },
    { name:'Rotação', score: diag.rotacao.score },
    { name:'Cobertura', score: diag.cobertura.score },
  ];

  radarEl.innerHTML = dims.map(dm => {
    const cls = dm.score >= 70 ? '#22c55e' : dm.score >= 50 ? '#f59e0b' : '#ef4444';
    return `
      <div class="radar-item">
        <span class="radar-name">${dm.name}</span>
        <div class="radar-bar-bg"><div class="radar-bar-fill" style="width:0%;background:${cls}" data-target="${dm.score}"></div></div>
        <span class="radar-score" style="color:${cls}">${dm.score}</span>
      </div>
    `;
  }).join('');

  setTimeout(() => {
    document.querySelectorAll('.radar-bar-fill[data-target]').forEach(b => {
      b.style.transition = 'width 1s cubic-bezier(.34,1.1,.64,1)';
      b.style.width = b.dataset.target + '%';
    });
  }, 400);
}

/* Textos de diagnóstico verboso */
function getAguaDiagText(d, c, diag) {
  const safe  = v => (typeof v === 'number' && isFinite(v)) ? Math.round(v) : '—';
  const nomes = d.culturas.map(ci => CULTURAS[ci.key]?.nome).filter(Boolean).join(' + ') || 'culturas';
  if (d.irrigSistema === 'nenhum') return `A lavoura opera em regime de sequeiro. A produtividade de ${nomes} está condicionada às chuvas naturais.`;
  if (diag.agua.diag === 'perigo') return `<strong>Consumo de água crítico:</strong> ${safe(d.agua)} mm/safra está ${safe(d.agua - c.aguaMax)} mm acima do máximo ponderado para ${nomes} (${safe(c.aguaMax)} mm). Em ${d.hectares} ha, o desperdício chega a ${((d.agua - c.aguaMax) * 10000 * d.hectares / 1e6).toFixed(1)} milhões de litros/safra.`;
  if (diag.agua.diag === 'alerta') return `<strong>Consumo de água elevado:</strong> ${safe(d.agua)} mm está acima do máximo ponderado (${safe(c.aguaMax)} mm) para o mix de culturas. O excedente percola para o solo, lixiviando fertilizantes.`;
  if (d.agua < c.aguaMin) return `<strong>Possível estresse hídrico:</strong> ${safe(d.agua)} mm está abaixo da necessidade mínima ponderada de ${nomes} (${safe(c.aguaMin)} mm). Monitore os estágios críticos e ajuste a irrigação.`;
  return `<strong>Consumo de água adequado:</strong> ${safe(d.agua)} mm está dentro da faixa recomendada para ${nomes} (${safe(c.aguaMin)}–${safe(c.aguaMax)} mm). Sistema ${diag.irrig.nome} com ${(diag.irrig.efic*100).toFixed(0)}% de eficiência bem dimensionado.`;
}

function getFertilizDiagText(d, c, diag) {
  const safe  = v => (typeof v === 'number' && isFinite(v)) ? Math.round(v) : '—';
  const nomes = d.culturas.map(ci => CULTURAS[ci.key]?.nome).filter(Boolean).join(' + ') || 'culturas';
  if (diag.fertiliz.diag === 'perigo') return `<strong>Excesso crítico de fertilizante:</strong> ${safe(d.fertiliz)} kg/ha excede em ${safe(d.fertiliz - c.fertilizMax)} kg/ha o máximo ponderado para ${nomes} (${safe(c.fertilizMax)} kg/ha). Custo desnecessário: ~R$ ${((d.fertiliz - c.fertilizMax) * d.hectares * 3).toLocaleString('pt-BR')}/safra.`;
  if (diag.fertiliz.diag === 'alerta') return `<strong>Fertilização acima do recomendado:</strong> ${safe(d.fertiliz)} kg/ha ultrapassa o máximo ponderado de ${safe(c.fertilizMax)} kg/ha para ${nomes}. Realize análise de solo por talhão.`;
  if (d.fertiliz < c.fertilizMin) return `<strong>Adubação insuficiente:</strong> ${safe(d.fertiliz)} kg/ha está abaixo do mínimo ponderado de ${safe(c.fertilizMin)} kg/ha. Isso pode limitar a produtividade das culturas.`;
  return `<strong>Fertilização dentro do recomendado:</strong> ${safe(d.fertiliz)} kg NPK/ha está na faixa ideal ponderada para ${nomes} (${safe(c.fertilizMin)}–${safe(c.fertilizMax)} kg/ha).`;
}

function getPresDiagText(d, diag) {
  const pct = diag.pres.presAtualPct.toFixed(1);
  if (diag.pres.diag === 'perigo') return `<strong>Déficit grave de preservação:</strong> ${d.pres} ha (${pct}%) está muito abaixo do mínimo legal de ${diag.pres.presMin.toFixed(1)} ha (${diag.bioma.min}%) exigido para o ${diag.bioma.nome}. Situação de risco legal e ambiental.`;
  if (diag.pres.diag === 'alerta') return `<strong>Área preservada insuficiente:</strong> ${d.pres} ha (${pct}%) está abaixo do mínimo de ${diag.pres.presMin.toFixed(1)} ha. É necessário regularizar para cumprir o Código Florestal.`;
  return `<strong>Preservação adequada:</strong> ${d.pres} ha (${pct}%) atende à legislação. A vegetação nativa preservada presta serviços ecossistêmicos valiosos à produção agrícola circundante.`;
}

/* ═══════════════════════════════════════════════════
   10. UTILITÁRIOS
   ═══════════════════════════════════════════════════ */
function animNum(el, start, end, dur) {
  const step = (end - start) / (dur / 16);
  let cur = start;
  const t = setInterval(() => {
    cur = Math.min(cur + step, end);
    el.textContent = Math.round(cur);
    if (Math.round(cur) >= end) clearInterval(t);
  }, 16);
}

/* ═══════════════════════════════════════════════════
   11. TABS EDUCATIVO
   ═══════════════════════════════════════════════════ */
function showEduTab(tabId, btn) {
  document.querySelectorAll('.edu-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.edu-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('edu-' + tabId).classList.add('active');
  btn.classList.add('active');
}

/* ═══════════════════════════════════════════════════
   12. INPUTS DINÂMICOS — LIMPAR ERROS
   ═══════════════════════════════════════════════════ */
document.querySelectorAll('.form-input, .form-input-group input, .form-select').forEach(el => {
  el.addEventListener('input', () => {
    const field = el.closest('.form-field');
    if (field) field.classList.remove('invalid');
  });
});

/* ═══════════════════════════════════════════════════
   HISTÓRICO DE PLANTIO — ENGINE COMPLETO
   ═══════════════════════════════════════════════════ */

const HIST_KEY = 'agrofield_historico_v1';

/* ── Pesos de carga química por tipo de defensivo e frequência ── */
const CARGA_DEFENSIVO = {
  nenhum: 0, biologico: 1, herbicida: 3, fungicida: 3, inseticida: 4, multiplo: 6
};
const MULT_FREQ = { nenhum: 0, baixa: 0.5, media: 1.0, alta: 1.8, muito_alta: 3.0 };

/* ── Pontuação de diversificação por número de culturas únicas ── */
function histCarregarDados() {
  try { return JSON.parse(localStorage.getItem(HIST_KEY) || '[]'); }
  catch(e) { return []; }
}
function histSalvarDados(arr) {
  localStorage.setItem(HIST_KEY, JSON.stringify(arr));
}

/* ─── MODAL ───────────────────────────────────── */
function abrirModalHistorico(id) {
  const modal = document.getElementById('modal-historico');
  const campos = ['mh-id','mh-ano','mh-safra','mh-cultura','mh-area','mh-solo',
                  'mh-hidrico','mh-fertiliz-tipo','mh-fertiliz-qtd',
                  'mh-defensivo-tipo','mh-defensivo-freq','mh-produtividade','mh-cobertura','mh-obs'];

  if (id) {
    // Editar existente
    const dados = histCarregarDados();
    const reg   = dados.find(r => r.id === id);
    if (!reg) return;
    document.getElementById('modal-hist-title').textContent = '✏️ Editar Registro de Plantio';
    document.getElementById('mh-id').value              = reg.id;
    document.getElementById('mh-ano').value             = reg.ano;
    document.getElementById('mh-safra').value           = reg.safra;
    document.getElementById('mh-cultura').value         = reg.cultura;
    document.getElementById('mh-area').value            = reg.area || '';
    document.getElementById('mh-solo').value            = reg.solo || '';
    document.getElementById('mh-hidrico').value         = reg.hidrico || 'sequeiro';
    document.getElementById('mh-fertiliz-tipo').value   = reg.fertilizTipo || 'quimico';
    document.getElementById('mh-fertiliz-qtd').value    = reg.fertilizQtd || '';
    document.getElementById('mh-defensivo-tipo').value  = reg.defensivoTipo || 'nenhum';
    document.getElementById('mh-defensivo-freq').value  = reg.defensivoFreq || 'nenhum';
    document.getElementById('mh-produtividade').value   = reg.produtividade || '';
    document.getElementById('mh-cobertura').value       = reg.cobertura || 'nao';
    document.getElementById('mh-obs').value             = reg.obs || '';
  } else {
    // Novo
    document.getElementById('modal-hist-title').textContent = '＋ Novo Registro de Plantio';
    campos.forEach(f => {
      const el = document.getElementById(f);
      if (!el) return;
      if (el.tagName === 'SELECT') { el.selectedIndex = 0; }
      else { el.value = ''; }
    });
    document.getElementById('mh-hidrico').value = 'sequeiro';
    document.getElementById('mh-fertiliz-tipo').value = 'quimico';
    document.getElementById('mh-defensivo-tipo').value = 'nenhum';
    document.getElementById('mh-defensivo-freq').value = 'nenhum';
    document.getElementById('mh-cobertura').value = 'nao';
    // Default: ano atual
    document.getElementById('mh-ano').value = new Date().getFullYear();
  }
  modal.classList.add('show');
}

function fecharModalHistorico(evt) {
  if (evt && evt.target !== document.getElementById('modal-historico')) return;
  document.getElementById('modal-historico').classList.remove('show');
}

function salvarRegistroHistorico() {
  const ano     = parseInt(document.getElementById('mh-ano').value);
  const safra   = document.getElementById('mh-safra').value;
  const cultura = document.getElementById('mh-cultura').value;
  if (!ano || ano < 1900 || ano > 2030) { alert('Informe um ano válido (1900–2030).'); return; }
  if (!safra) { alert('Selecione a safra/período.'); return; }
  if (!cultura) { alert('Selecione a cultura.'); return; }

  const dados = histCarregarDados();
  const editId = document.getElementById('mh-id').value;

  const reg = {
    id:           editId || 'h_' + Date.now(),
    ano,
    safra,
    cultura,
    area:         parseFloat(document.getElementById('mh-area').value)    || 0,
    solo:         document.getElementById('mh-solo').value                || '',
    hidrico:      document.getElementById('mh-hidrico').value             || 'sequeiro',
    fertilizTipo: document.getElementById('mh-fertiliz-tipo').value       || 'quimico',
    fertilizQtd:  parseFloat(document.getElementById('mh-fertiliz-qtd').value) || 0,
    defensivoTipo:document.getElementById('mh-defensivo-tipo').value      || 'nenhum',
    defensivoFreq:document.getElementById('mh-defensivo-freq').value      || 'nenhum',
    produtividade:parseFloat(document.getElementById('mh-produtividade').value) || 0,
    cobertura:    document.getElementById('mh-cobertura').value           || 'nao',
    obs:          document.getElementById('mh-obs').value.trim()          || '',
    criadoEm:     editId ? (dados.find(r=>r.id===editId)||{}).criadoEm || Date.now() : Date.now()
  };

  if (editId) {
    const idx = dados.findIndex(r => r.id === editId);
    if (idx !== -1) dados[idx] = reg;
  } else {
    dados.push(reg);
  }

  histSalvarDados(dados);
  fecharModalHistorico();
  document.getElementById('modal-historico').classList.remove('show');
  renderHistorico();
}

function excluirRegistro(id) {
  if (!confirm('Excluir este registro permanentemente?')) return;
  const dados = histCarregarDados().filter(r => r.id !== id);
  histSalvarDados(dados);
  renderHistorico();
}

/* ─── ENGINE ANALÍTICO ──────────────────────────── */
function analisarHistorico(dados) {
  if (!dados.length) return null;

  // Ordena por ano
  const sorted = [...dados].sort((a,b) => a.ano - b.ano);
  const anos   = [...new Set(sorted.map(r => r.ano))].sort();
  const culturas = sorted.map(r => r.cultura);
  const uniqCult = [...new Set(culturas)];

  // Frequência de cultura
  const freqCult = {};
  culturas.forEach(c => freqCult[c] = (freqCult[c]||0) + 1);
  const topCultura = Object.entries(freqCult).sort((a,b)=>b[1]-a[1])[0];

  // Detecção de monocultura (3+ registros consecutivos mesma cultura)
  let maxConsec = 1, atualConsec = 1, culturaMono = null;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].cultura === sorted[i-1].cultura) {
      atualConsec++;
      if (atualConsec > maxConsec) { maxConsec = atualConsec; culturaMono = sorted[i].cultura; }
    } else { atualConsec = 1; }
  }
  const temMonocultura = maxConsec >= 3;

  // Índice de rotação: % de safras em que houve mudança de cultura
  let mudancas = 0;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].cultura !== sorted[i-1].cultura) mudancas++;
  }
  const idxRotacao = sorted.length > 1 ? Math.round((mudancas / (sorted.length-1)) * 100) : 0;

  // Carga química acumulada média
  let cargaTotal = 0;
  sorted.forEach(r => {
    const cargaD = (CARGA_DEFENSIVO[r.defensivoTipo]||0) * (MULT_FREQ[r.defensivoFreq]||1);
    const cargaF = r.fertilizQtd > 500 ? 3 : r.fertilizQtd > 350 ? 1.5 : r.fertilizQtd > 0 ? 0.5 : 0;
    cargaTotal += cargaD + cargaF;
  });
  const cargaMedia = sorted.length ? cargaTotal / sorted.length : 0;

  // Saúde do solo (0–100)
  let saudeSolo = 70;
  // Rotação melhora
  saudeSolo += idxRotacao * 0.2;
  // Monocultura penaliza
  if (temMonocultura) saudeSolo -= maxConsec * 5;
  // Carga química alta penaliza
  saudeSolo -= cargaMedia * 4;
  // Cobertura do solo melhora
  const coberturas = sorted.filter(r => r.cobertura === 'sim').length;
  saudeSolo += (coberturas / sorted.length) * 15;
  // Fertilizante orgânico/misto melhora
  const organicos = sorted.filter(r => r.fertilizTipo === 'organico' || r.fertilizTipo === 'misto').length;
  saudeSolo += (organicos / sorted.length) * 10;
  // Diversidade de culturas
  saudeSolo += Math.min(15, uniqCult.length * 4);
  saudeSolo = Math.max(5, Math.min(100, Math.round(saudeSolo)));

  let classSaude, labelSaude;
  if (saudeSolo >= 80)     { classSaude = 'excelente'; labelSaude = '🌟 Excelente';   }
  else if (saudeSolo >= 65){ classSaude = 'boa';       labelSaude = '✅ Boa';          }
  else if (saudeSolo >= 50){ classSaude = 'regular';   labelSaude = '📊 Regular';      }
  else if (saudeSolo >= 35){ classSaude = 'atencao';   labelSaude = '⚠️ Em Atenção';   }
  else                     { classSaude = 'critica';   labelSaude = '🚨 Crítica';      }

  // Tendência: compara produtividade das últimas 2 vs primeiras 2 safras
  const comProd = sorted.filter(r => r.produtividade > 0);
  let tendencia = 'estavel', labelTend = '➡️ Estável';
  if (comProd.length >= 4) {
    const primMedia = comProd.slice(0,2).reduce((s,r)=>s+r.produtividade,0)/2;
    const ultMedia  = comProd.slice(-2).reduce((s,r)=>s+r.produtividade,0)/2;
    const delta     = ((ultMedia - primMedia) / primMedia) * 100;
    if      (delta >  10) { tendencia = 'melhorando'; labelTend = '📈 Melhorando'; }
    else if (delta < -10) { tendencia = 'declinio';   labelTend = '📉 Em Declínio'; }
    else if (delta < -20) { tendencia = 'critica';    labelTend = '🚨 Crítica'; }
  } else if (comProd.length >= 2) {
    const delta = comProd[comProd.length-1].produtividade - comProd[0].produtividade;
    if      (delta > 0.3)  { tendencia = 'melhorando'; labelTend = '📈 Melhorando'; }
    else if (delta < -0.3) { tendencia = 'declinio';   labelTend = '📉 Em Declínio'; }
  }

  // Impacto no score da análise principal (usado em calcularDiagnostico)
  let scoreHistImpacto = 0;
  if (idxRotacao > 60)      scoreHistImpacto += 10;
  else if (idxRotacao > 30) scoreHistImpacto += 4;
  if (temMonocultura)       scoreHistImpacto -= 8 + maxConsec * 2;
  if (cargaMedia > 8)       scoreHistImpacto -= 12;
  else if (cargaMedia > 4)  scoreHistImpacto -= 5;
  if (saudeSolo >= 70)      scoreHistImpacto += 6;
  else if (saudeSolo < 40)  scoreHistImpacto -= 8;
  if (tendencia === 'melhorando') scoreHistImpacto += 5;
  if (tendencia === 'declinio')   scoreHistImpacto -= 7;
  scoreHistImpacto = Math.max(-25, Math.min(20, scoreHistImpacto));

  return {
    sorted, anos, uniqCult, freqCult, topCultura,
    maxConsec, culturaMono, temMonocultura,
    idxRotacao, mudancas,
    cargaMedia, cargaTotal,
    saudeSolo, classSaude, labelSaude,
    tendencia, labelTend,
    scoreHistImpacto
  };
}

/* ─── RENDER PRINCIPAL ──────────────────────────── */
function renderHistorico() {
  const dados = histCarregarDados();
  const analise = analisarHistorico(dados);
  renderKPIs(dados, analise);
  renderAnaliseInteligente(dados, analise);
  renderTimeline(dados, analise);
  renderTabelaHistorico();
  atualizarFiltros(dados);
}

/* ── KPIs ── */
function renderKPIs(dados, analise) {
  document.getElementById('hkpi-registros').textContent = dados.length;

  if (!analise) {
    ['hkpi-anos','hkpi-culturas','hkpi-rotacao','hkpi-saude','hkpi-tendencia']
      .forEach(id => document.getElementById(id).textContent = '—');
    return;
  }
  document.getElementById('hkpi-anos').textContent      = analise.anos.length;
  document.getElementById('hkpi-culturas').textContent  = analise.topCultura ? (CULTURAS[analise.topCultura[0]]?.emoji||'') + ' ' + (CULTURAS[analise.topCultura[0]]?.nome || analise.topCultura[0]) : '—';
  document.getElementById('hkpi-rotacao').textContent   = analise.idxRotacao + '%';
  document.getElementById('hkpi-saude').textContent     = analise.labelSaude;
  document.getElementById('hkpi-tendencia').textContent = analise.labelTend;
}

/* ── ANÁLISE INTELIGENTE ── */
function renderAnaliseInteligente(dados, analise) {
  const el = document.getElementById('hist-analise-content');
  if (!analise || dados.length < 2) {
    el.innerHTML = `<div class="hist-empty-state">
      <div class="hist-empty-icon">🔬</div>
      <div class="hist-empty-title">Análise não disponível</div>
      <div class="hist-empty-desc">Adicione ao menos 2 anos de plantio para gerar o diagnóstico inteligente.</div>
    </div>`;
    return;
  }

  const topNome = CULTURAS[analise.topCultura[0]]?.nome || analise.topCultura[0];
  const topEmoji= CULTURAS[analise.topCultura[0]]?.emoji || '🌾';

  // Bloco 1: Rotação
  const rotLabel = analise.idxRotacao >= 70 ? ['ok','✅ Rotação Ativa'] :
                   analise.idxRotacao >= 40 ? ['alerta','⚠️ Rotação Parcial'] :
                                              ['perigo','🚨 Monocultura Predominante'];
  const rotImpacto = analise.idxRotacao >= 60 ? '+10 pts no score' : analise.idxRotacao >= 30 ? '+4 pts' : '−8 pts no score';
  const rotImpactoCls = analise.idxRotacao >= 30 ? 'positivo' : 'negativo';

  // Bloco 2: Saúde do Solo
  // Bloco 3: Carga Química
  const cargaLabel = analise.cargaMedia < 3 ? ['ok','✅ Carga Química Adequada'] :
                     analise.cargaMedia < 6 ? ['alerta','⚠️ Carga Química Elevada'] :
                                              ['perigo','🚨 Carga Química Crítica'];

  el.innerHTML = `
    <!-- ROTAÇÃO -->
    <div class="hist-analise-bloco">
      <div class="hist-analise-subtitulo">Rotação de Culturas</div>
      <div class="hist-badge ${rotLabel[0]}">${rotLabel[1]}</div>
      <div class="hist-analise-texto">
        <strong>Índice de rotação: ${analise.idxRotacao}%</strong> — em ${analise.sorted.length} safra${analise.sorted.length>1?'s':''}, houve mudança de cultura em ${analise.mudancas} delas.
        ${analise.temMonocultura ? `<div class="hist-monocultura-warn">
          ⚠️ <strong>Monocultura detectada:</strong> ${topEmoji} ${topNome} foi plantada por <strong>${analise.maxConsec} safras consecutivas</strong>. Isso aumenta o risco de pragas específicas, degrada a estrutura do solo e reduz a eficiência dos fertilizantes. Considere alternar com milho, trigo ou uma leguminosa.
        </div>` : `<br>Propriedade com boa diversificação. Continue alternando culturas para maximizar a saúde do solo.`}
      </div>
      <span class="hist-score-impacto ${rotImpactoCls}">${rotImpacto}</span>
    </div>

    <!-- SAÚDE DO SOLO -->
    <div class="hist-analise-bloco">
      <div class="hist-analise-subtitulo">Saúde do Solo</div>
      <div class="hist-badge ${analise.classSaude}">${analise.labelSaude} — ${analise.saudeSolo}/100</div>
      <div class="hist-saude-bar-wrap">
        <div class="hist-saude-bar-bg">
          <div class="hist-saude-bar-fill" id="saude-bar-fill" style="width:0%;background:${analise.saudeSolo>=70?'var(--ok)':analise.saudeSolo>=50?'var(--alerta)':'var(--perigo)'}"></div>
        </div>
        <span class="hist-saude-pct" style="color:${analise.saudeSolo>=70?'var(--ok)':analise.saudeSolo>=50?'var(--alerta)':'var(--perigo)'}">${analise.saudeSolo}%</span>
      </div>
      <div class="hist-analise-texto">
        Calculado com base em: rotação (${analise.idxRotacao}%), cobertura do solo, tipo de fertilizante e carga química acumulada ao longo de ${analise.anos.length} ano${analise.anos.length>1?'s':''}.
        ${analise.saudeSolo < 50 ? '<br><strong>Atenção:</strong> Solo em estado crítico — considere pousio, adubação verde e redução de químicos por ao menos 1–2 safras.' : ''}
      </div>
    </div>

    <!-- CARGA QUÍMICA -->
    <div class="hist-analise-bloco">
      <div class="hist-analise-subtitulo">Carga Química Acumulada</div>
      <div class="hist-badge ${cargaLabel[0]}">${cargaLabel[1]}</div>
      <div class="hist-analise-texto">
        Índice médio de carga química: <strong>${analise.cargaMedia.toFixed(1)}</strong> por safra.
        ${analise.cargaMedia >= 6 ? `<div class="hist-monocultura-warn">🧪 Uso excessivo de defensivos e fertilizantes detectado. O acúmulo de agroquímicos destrói a microbiota do solo, contamina lençóis freáticos e pode tornar o solo improdutivo. Recomenda-se uma análise de solo e revisão do programa de adubação.</div>` :
          analise.cargaMedia >= 3 ? 'Carga elevada. Monitore os índices de solo e prefira defensivos biológicos quando possível.' :
          'Bom equilíbrio no uso de insumos. Continue monitorando para manter essa tendência.'}
      </div>
      <span class="hist-score-impacto ${analise.cargaMedia<3?'positivo':analise.cargaMedia<6?'neutro':'negativo'}">${analise.cargaMedia<3?'+6 pts (insumos equilibrados)':analise.cargaMedia<6?'Impacto moderado no score':'−12 pts (excesso químico)'}</span>
    </div>

    <!-- TENDÊNCIA -->
    <div class="hist-analise-bloco">
      <div class="hist-analise-subtitulo">Tendência da Propriedade</div>
      <div class="hist-badge ${analise.tendencia==='melhorando'?'ok':analise.tendencia==='estavel'?'info':'perigo'}">${analise.labelTend}</div>
      <div class="hist-analise-texto">
        ${analise.tendencia === 'melhorando' ? 'As práticas de manejo estão produzindo resultados positivos. A produtividade tende a crescer com a continuidade do bom manejo.' :
          analise.tendencia === 'estavel'    ? 'A propriedade mantém produtividade estável. Considere introduzir práticas inovadoras para melhorar os resultados.' :
          analise.tendencia === 'declinio'   ? '<strong>Queda de produtividade detectada.</strong> Revise as práticas de manejo: rotação, adubação e uso de defensivos. O solo pode estar dando sinais de desgaste.' :
          '<strong>Situação crítica.</strong> Queda acentuada de produtividade. Avalie urgentemente a saúde do solo com análise laboratorial.'}
      </div>
      <span class="hist-score-impacto ${analise.tendencia==='melhorando'?'positivo':analise.tendencia==='estavel'?'neutro':'negativo'}">${analise.tendencia==='melhorando'?'+5 pts':analise.tendencia==='estavel'?'Neutro':'−7 pts no score'}</span>
    </div>

    <!-- IMPACTO TOTAL NO SCORE -->
    <div style="background:${analise.scoreHistImpacto>=0?'var(--verde-palido)':'#fee2e2'};border:1px solid ${analise.scoreHistImpacto>=0?'var(--borda-verde)':'#fca5a5'};border-radius:var(--radius);padding:1rem 1.25rem;">
      <div class="hist-analise-subtitulo" style="color:${analise.scoreHistImpacto>=0?'var(--verde-claro)':'var(--perigo)'}">Impacto no Score de Análise</div>
      <div style="font-family:var(--display);font-size:1.5rem;font-weight:700;color:${analise.scoreHistImpacto>=0?'var(--ok)':'var(--perigo)'}">
        ${analise.scoreHistImpacto>=0?'+':''}${analise.scoreHistImpacto} pontos
      </div>
      <div style="font-size:.82rem;color:var(--texto-medio);margin-top:.3rem">Este histórico ${analise.scoreHistImpacto>=0?'adiciona':'reduz'} ${Math.abs(analise.scoreHistImpacto)} pontos no Score de Sustentabilidade quando você executa a Análise da Propriedade.</div>
    </div>
  `;

  // Anima barra de saúde
  setTimeout(() => {
    const bar = document.getElementById('saude-bar-fill');
    if (bar) bar.style.width = analise.saudeSolo + '%';
  }, 200);
}

/* ── TIMELINE ── */
function renderTimeline(dados, analise) {
  const el = document.getElementById('hist-timeline');
  if (!dados.length) {
    el.innerHTML = `<div class="hist-empty-state"><div class="hist-empty-icon">🗓️</div><div class="hist-empty-title">Nenhum ano registrado</div><div class="hist-empty-desc">Adicione registros para visualizar a evolução.</div></div>`;
    return;
  }

  // Agrupa por ano
  const porAno = {};
  dados.forEach(r => { if (!porAno[r.ano]) porAno[r.ano] = []; porAno[r.ano].push(r); });
  const anosDesc = Object.keys(porAno).map(Number).sort((a,b)=>b-a);

  el.innerHTML = `<div class="hist-timeline-list">${anosDesc.map(ano => {
    const regs = porAno[ano];
    const culturas = [...new Set(regs.map(r=>r.cultura))];
    const emojis   = culturas.map(c => CULTURAS[c]?.emoji||'🌾').join(' ');
    const nomes    = culturas.map(c => CULTURAS[c]?.nome||c).join(', ');

    // Detecta se houve repetição ou diversificação
    const anoPrev = anosDesc[anosDesc.indexOf(ano)+1];
    let tag = '';
    if (analise && anoPrev) {
      const regsPrev = porAno[anoPrev];
      const cultPrev = [...new Set(regsPrev.map(r=>r.cultura))];
      const mesmaCult = culturas.every(c => cultPrev.includes(c)) && cultPrev.length === culturas.length;
      if (mesmaCult) tag = '<span class="hist-tl-tag ambar">⚠️ Repetição</span>';
      else           tag = '<span class="hist-tl-tag verde">✅ Rotação</span>';
    }

    const temMonoAno = analise && analise.culturaMono && culturas.includes(analise.culturaMono) && analise.temMonocultura;
    const dotCls = tag.includes('Repetição') ? 'mono' : tag.includes('Rotação') ? 'boa' : '';

    // Produtividade média do ano
    const prods = regs.filter(r=>r.produtividade>0);
    const prodStr = prods.length ? ` · ${(prods.reduce((s,r)=>s+r.produtividade,0)/prods.length).toFixed(1)} t/ha` : '';

    return `<div class="hist-tl-item">
      <div class="hist-tl-dot ${dotCls}">${emojis.split(' ')[0]||'🌾'}</div>
      <div class="hist-tl-content">
        <div class="hist-tl-ano">${ano}${prodStr}</div>
        <div class="hist-tl-culturas">${nomes}</div>
        <div class="hist-tl-tags">${tag}${regs.some(r=>r.cobertura==='sim')?'<span class="hist-tl-tag verde">🌿 Cobertura</span>':''}${regs.some(r=>r.hidrico==='irrigado')?'<span class="hist-tl-tag azul">💧 Irrigado</span>':''}</div>
      </div>
    </div>`;
  }).join('')}</div>`;
}

/* ── TABELA ── */
function renderTabelaHistorico() {
  const todos  = histCarregarDados();
  const filtAno    = document.getElementById('filtro-ano')?.value || '';
  const filtCultura= document.getElementById('filtro-cultura')?.value || '';
  const filtSolo   = document.getElementById('filtro-solo')?.value || '';

  const filtrados = todos.filter(r =>
    (!filtAno     || r.ano == filtAno) &&
    (!filtCultura || r.cultura === filtCultura) &&
    (!filtSolo    || r.solo === filtSolo)
  ).sort((a,b) => b.ano - a.ano || b.criadoEm - a.criadoEm);

  const wrapper = document.getElementById('hist-tabela-wrapper');
  if (!filtrados.length) {
    wrapper.innerHTML = `<div class="hist-empty-state" style="padding:2.5rem">
      <div class="hist-empty-icon">🔍</div>
      <div class="hist-empty-title">Nenhum registro encontrado</div>
      <div class="hist-empty-desc">${todos.length ? 'Tente mudar os filtros.' : 'Adicione registros para visualizá-los aqui.'}</div>
      ${!todos.length?'<button class="btn btn-verde" style="margin-top:1rem" onclick="abrirModalHistorico()">＋ Adicionar</button>':''}
    </div>`;
    return;
  }

  const safraLabel = { verao:'☀️ Verão', inverno:'❄️ Inverno', anual:'📅 Anual', '1sem':'1º Sem.', '2sem':'2º Sem.' };
  const freqLabel  = { nenhum:'—', baixa:'Baixa', media:'Média', alta:'Alta', muito_alta:'Muito Alta' };

  wrapper.innerHTML = `<div style="overflow-x:auto"><table class="hist-table">
    <thead><tr>
      <th>Ano</th><th>Safra</th><th>Cultura</th><th>Área</th>
      <th>Solo</th><th>Hídrico</th><th>Fertiliz.</th>
      <th>Defensivo</th><th>Produt.</th><th>Cobertura</th><th>Ações</th>
    </tr></thead>
    <tbody>${filtrados.map(r => {
      const c = CULTURAS[r.cultura];
      const cargaD = (CARGA_DEFENSIVO[r.defensivoTipo]||0)*(MULT_FREQ[r.defensivoFreq]||1);
      const cargaF = r.fertilizQtd > 500 ? 3 : r.fertilizQtd > 350 ? 1.5 : 0.5;
      const cargaT = r.defensivoTipo === 'nenhum' && r.fertilizQtd === 0 ? 0 : cargaD + cargaF;
      const cargaCls = cargaT < 3 ? 'baixa' : cargaT < 6 ? 'media' : 'alta';
      const cargaTxt = cargaT < 3 ? 'Baixa' : cargaT < 6 ? 'Média' : 'Alta';
      return `<tr>
        <td><strong>${r.ano}</strong></td>
        <td>${safraLabel[r.safra]||r.safra}</td>
        <td>${c?c.emoji:''} ${c?c.nome:r.cultura}</td>
        <td>${r.area?r.area+' ha':'—'}</td>
        <td>${r.solo||'—'}</td>
        <td>${r.hidrico==='irrigado'?'💧 Irrigado':'🌧️ Sequeiro'}</td>
        <td><span class="hist-carga-chip ${r.fertilizQtd>500?'alta':r.fertilizQtd>200?'media':'baixa'}">${r.fertilizQtd?r.fertilizQtd+' kg/ha':'—'}</span></td>
        <td><span class="hist-carga-chip ${cargaCls}">${cargaTxt}</span></td>
        <td>${r.produtividade?r.produtividade+' t/ha':'—'}</td>
        <td>${r.cobertura==='sim'?'✅':'❌'}</td>
        <td><div class="hist-table-actions">
          <button class="btn-tbl edit" onclick="abrirModalHistorico('${r.id}')">✏️</button>
          <button class="btn-tbl del"  onclick="excluirRegistro('${r.id}')">🗑️</button>
        </div></td>
      </tr>`;
    }).join('')}</tbody>
  </table></div>`;
}

/* ── FILTROS ── */
function atualizarFiltros(dados) {
  const anos    = [...new Set(dados.map(r=>r.ano))].sort((a,b)=>b-a);
  const culturas= [...new Set(dados.map(r=>r.cultura))];

  const selAno = document.getElementById('filtro-ano');
  if (selAno) {
    const val = selAno.value;
    selAno.innerHTML = '<option value="">Todos os anos</option>' + anos.map(a=>`<option value="${a}" ${val==a?'selected':''}>${a}</option>`).join('');
  }
  const selCult = document.getElementById('filtro-cultura');
  if (selCult) {
    const val = selCult.value;
    selCult.innerHTML = '<option value="">Todas as culturas</option>' + culturas.map(c=>`<option value="${c}" ${val===c?'selected':''}>${CULTURAS[c]?.emoji||''} ${CULTURAS[c]?.nome||c}</option>`).join('');
  }
}

/* ─── INTEGRAÇÃO COM SCORE PRINCIPAL ─────────────── */
/* Hook: quando renderizarResultado roda, aplica impacto do histórico */
const _origRenderizar = window.renderizarResultado;
window.renderizarResultado = function(d, diag) {
  const hist   = histCarregarDados();
  const analise= analisarHistorico(hist);
  if (analise && analise.scoreHistImpacto !== 0) {
    diag.score = Math.max(0, Math.min(100, diag.score + analise.scoreHistImpacto));
    // Adiciona bloco de histórico nas sugestões
    if (analise.temMonocultura) {
      diag.sugestoes.unshift({
        prioridade: 1, tipo: 'alerta',
        titulo: '📋 Histórico: Monocultura Prolongada',
        texto: ` Histórico registrado indica ${analise.maxConsec} safras consecutivas de ${CULTURAS[analise.culturaMono]?.nome||analise.culturaMono}. Isso reduz ${8+analise.maxConsec*2} pts do score. Introduza culturas rotacionadas na próxima safra.`
      });
    }
    if (analise.cargaMedia >= 6) {
      diag.sugestoes.unshift({
        prioridade: 1, tipo: 'perigo',
        titulo: '📋 Histórico: Carga Química Crítica',
        texto: ` Índice de carga química acumulada ${analise.cargaMedia.toFixed(1)} — acima do limite seguro. Reduza o uso de agroquímicos por ao menos 2 safras consecutivas para recuperar a microbiota do solo.`
      });
    }
    if (analise.tendencia === 'declinio') {
      diag.sugestoes.push({
        prioridade: 2, tipo: 'alerta',
        titulo: '📋 Histórico: Tendência de Declínio',
        texto: ` A produtividade registrada nos últimos anos apresenta queda. Revise urgentemente as práticas de manejo — o solo pode estar em processo de degradação.`
      });
    }
  }
  _origRenderizar(d, diag);

  // Exibe bloco de histórico no resultado
  if (analise) {
    const grid = document.getElementById('diag-grid-container');
    if (grid) {
      const blocoHist = document.createElement('div');
      blocoHist.className = 'culturas-mix-card';
      blocoHist.innerHTML = `
        <div class="culturas-mix-title">📋 Histórico de Plantio
          <span style="font-size:.8rem;font-weight:500;color:var(--texto-suave);margin-left:auto">${hist.length} registro${hist.length!==1?'s':''} · ${analise.anos.length} ano${analise.anos.length!==1?'s':''}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem">
          <div style="background:var(--creme-suave);border-radius:var(--radius);padding:1rem;text-align:center">
            <div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--texto-suave);font-weight:700;margin-bottom:.4rem">Rotação</div>
            <div style="font-family:var(--display);font-size:1.3rem;font-weight:700;color:${analise.idxRotacao>=50?'var(--ok)':'var(--alerta)'}">${analise.idxRotacao}%</div>
          </div>
          <div style="background:var(--creme-suave);border-radius:var(--radius);padding:1rem;text-align:center">
            <div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--texto-suave);font-weight:700;margin-bottom:.4rem">Saúde Solo</div>
            <div style="font-family:var(--display);font-size:1.3rem;font-weight:700;color:${analise.saudeSolo>=65?'var(--ok)':analise.saudeSolo>=45?'var(--alerta)':'var(--perigo)'}">${analise.saudeSolo}/100</div>
          </div>
          <div style="background:var(--creme-suave);border-radius:var(--radius);padding:1rem;text-align:center">
            <div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--texto-suave);font-weight:700;margin-bottom:.4rem">Impacto</div>
            <div style="font-family:var(--display);font-size:1.3rem;font-weight:700;color:${analise.scoreHistImpacto>=0?'var(--ok)':'var(--perigo)'}">${analise.scoreHistImpacto>=0?'+':''}${analise.scoreHistImpacto} pts</div>
          </div>
        </div>
        <div style="margin-top:.75rem;font-size:.8rem;color:var(--texto-suave)">
          Tendência: <strong style="color:${analise.tendencia==='melhorando'?'var(--ok)':analise.tendencia==='declinio'?'var(--perigo)':'var(--texto-medio)'}">${analise.labelTend}</strong>
          &nbsp;·&nbsp; Carga química: <strong>${analise.cargaMedia.toFixed(1)}</strong>
          &nbsp;·&nbsp; <a href="javascript:void(0)" onclick="showPage('historico')" style="color:var(--verde-claro);text-decoration:underline">Ver histórico completo →</a>
        </div>`;
      grid.insertBefore(blocoHist, grid.firstChild);
    }
  }
};

/* ─── INICIALIZAÇÃO ── */
document.addEventListener('DOMContentLoaded', () => {
  renderHistorico();
});


/* ═══════════════════════════════════════════════════
   INTRO — LÓGICA DAS 5 TELAS
   ═══════════════════════════════════════════════════ */

(function() {
  const scroller   = document.getElementById('intro-scroller');
  const dots       = document.querySelectorAll('.intro-dot');
  const screens    = document.querySelectorAll('.intro-screen');
  const numCards   = document.querySelectorAll('.is-num-card');
  const dCards     = document.querySelectorAll('.is-d-card');
  const decItems   = document.querySelectorAll('.is-dec-item');
  const revealEls  = document.querySelectorAll('.reveal-item');

  let currentScreen = 0;
  let countStarted  = {};

  /* ── Contagem animada ── */
  function animateCount(el) {
    const target   = parseFloat(el.dataset.target);
    const isFloat  = target % 10 !== 0; // 19.9, 7.8, etc.
    const realVal  = target / 10;       // stored as int * 10
    const duration = 1400;
    const steps    = 60;
    const increment = realVal / steps;
    let current = 0;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, realVal);
      el.textContent = current.toFixed(1);
      if (step >= steps) {
        clearInterval(timer);
        el.textContent = realVal.toFixed(1);
      }
    }, duration / steps);
  }

  /* ── Actualiza paginação ── */
  function updateDots(index) {
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentScreen = index;
  }

  /* ── Scroll para tela específica ── */
  window.introScrollTo = function(index) {
    if (!scroller) return;
    const target = screens[index];
    if (target) scroller.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
  };

  /* ── Lança análise: esconde intro, mostra sistema ── */
  window.launchAnalise = function() {
    document.getElementById('page-intro').classList.remove('active');
    document.getElementById('page-intro').style.display = 'none';
    document.getElementById('topbar').style.display = '';
    document.getElementById('page-analise').classList.add('active');
    // Actualiza nav
    document.querySelectorAll('.topbar-nav-btn').forEach(b => b.classList.remove('active'));
    const navAnalise = document.getElementById('nav-analise');
    if (navAnalise) navAnalise.classList.add('active');
    window.scrollTo(0, 0);
  };

  /* Expõe showPage para botões já existentes, garantindo que topbar apareça */
  const _origShowPage = window.showPage;
  window.showPage = function(name) {
    const introPage = document.getElementById('page-intro');
    if (introPage && introPage.classList.contains('active')) {
      introPage.classList.remove('active');
      introPage.style.display = 'none';
      document.getElementById('topbar').style.display = '';
    }
    if (_origShowPage) _origShowPage(name);
  };

  /* ── Observer para reveal + contagem ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      // Reveal genérico
      el.classList.add('visible');

      // Cards de números — escalonados
      if (el.classList.contains('is-num-card')) {
        const idx = Array.from(numCards).indexOf(el);
        setTimeout(() => {
          el.classList.add('revealed');
          const counter = el.querySelector('.is-count');
          const key = counter.dataset.target;
          if (!countStarted[key]) {
            countStarted[key] = true;
            animateCount(counter);
          }
        }, idx * 120);
      }

      // Cards de pilares — escalonados
      if (el.classList.contains('is-d-card')) {
        const idx = Array.from(dCards).indexOf(el);
        setTimeout(() => el.classList.add('revealed'), idx * 100);
      }

      // Itens de decisões — escalonados
      if (el.classList.contains('is-dec-item')) {
        const idx = Array.from(decItems).indexOf(el);
        setTimeout(() => el.classList.add('revealed'), idx * 130);
      }
    });
  }, { threshold: 0.2 });

  // Observa todos os elementos animados
  [...revealEls, ...numCards, ...dCards, ...decItems].forEach(el => observer.observe(el));

  /* ── Detecta tela visível para paginação ── */
  if (scroller) {
    const screenObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const idx = Array.from(screens).indexOf(entry.target);
          if (idx !== -1) updateDots(idx);
        }
      });
    }, { root: scroller, threshold: 0.5 });

    screens.forEach(s => screenObserver.observe(s));
  }

  /* ── Garante topbar oculta enquanto intro está activa ── */
  const topbar = document.getElementById('topbar');
  if (topbar) topbar.style.display = 'none';

})();
