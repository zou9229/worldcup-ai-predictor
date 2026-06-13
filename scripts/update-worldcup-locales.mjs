import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const messagesDir = join(process.cwd(), 'messages');
const en = JSON.parse(readFileSync(join(messagesDir, 'en.json'), 'utf8'));

const userFacingEn = {
  'landing.nav.features': 'Predictions',
  'landing.hero.secondary': 'See plans',
  'landing.features.title': 'Built for World Cup match days',
  'landing.features.description':
    'Find match predictions, score probabilities, legal watch notes, and AI what-if simulations in one place.',
  'landing.features.auth.title': '104 match pages',
  'landing.features.auth.description':
    'Every fixture has a dedicated prediction page with win probability, predicted score, venue details, and watch-guide links.',
  'landing.features.payment.title': 'Legal watch guides',
  'landing.features.payment.description':
    'Each match links to official broadcaster notes and licensed streaming options for fans at home or traveling.',
  'landing.features.rbac.title': 'AI score simulator',
  'landing.features.rbac.description':
    'Ask custom match-day scenarios such as injuries, weather, lineups, red cards, or tactical changes.',
  'landing.features.i18n.title': 'Global language support',
  'landing.features.i18n.description':
    'Follow the tournament in English, Chinese, Spanish, Portuguese, French, German, Italian, Japanese, Korean, and Arabic.',
  'landing.features.cms.title': 'Daily media slot',
  'landing.features.cms.description':
    'Add licensed photos or short clips for daily match-day context while keeping the prediction pages fast.',
  'landing.features.credits.title': 'Cloudflare-fast',
  'landing.features.credits.description':
    'Pages are deployed close to fans worldwide and refreshed from the World Cup sync pipeline.',
  'landing.pricing.title': 'Fan access plans',
  'landing.pricing.description':
    'Public predictions stay free. Premium plans add AI simulations and sponsor inquiry workflows.',
  'landing.pricing.monthly': 'Plans',
  'landing.pricing.yearly': 'Credits',
  'landing.pricing.lifetime': 'Sponsor',
  'landing.pricing.buy_lifetime': 'Buy once',
  'landing.pricing.starter': 'Credit Pack',
  'landing.pricing.starter_desc':
    'For fans who want a few premium AI simulations',
  'landing.pricing.pro': 'Tournament Pass',
  'landing.pricing.pro_desc':
    'For fans following many matches across the tournament',
  'landing.pricing.enterprise': 'Sponsor Inquiry',
  'landing.pricing.enterprise_desc':
    'For brands or affiliates that want placement review',
  'landing.pricing.feature_1_project': '20 AI simulations',
  'landing.pricing.feature_5k_credits': 'Valid through the tournament',
  'landing.pricing.feature_email_support': 'Use on any fixture page',
  'landing.pricing.feature_unlimited_projects': '100 AI simulations',
  'landing.pricing.feature_50k_credits': 'All fixture pages included',
  'landing.pricing.feature_priority_support': 'Best for knockout stages',
  'landing.pricing.feature_api_access': 'Priority model capacity when busy',
  'landing.pricing.feature_everything_pro': 'Sponsored placement review',
  'landing.pricing.feature_unlimited_credits':
    'Homepage/sidebar availability check',
  'landing.pricing.feature_dedicated_support': 'UTM link setup guidance',
  'landing.pricing.feature_custom_integrations': 'Affiliate copy review',
  'landing.faq.title': 'World Cup AI FAQ',
  'landing.faq.description':
    'What fans should know before using match predictions, watch guides, and AI simulations.',
  'landing.faq.stack.question': 'How are AI predictions generated?',
  'landing.faq.stack.answer':
    'We combine fixture data, team-strength priors, venue context, and model prompts to produce probabilities, score leans, and tactical notes. The output is analytical, not guaranteed.',
  'landing.faq.payment.question': 'What is free and what is paid?',
  'landing.faq.payment.answer':
    'Public match predictions and watch guides are free. Premium credits unlock custom AI what-if simulations for specific match scenarios.',
  'landing.faq.database.question': 'Are the watch guides legal?',
  'landing.faq.database.answer':
    'The watch pages point fans toward official broadcasters and licensed streaming services. We do not link to pirated streams.',
  'landing.faq.customize.question': 'How often is match data updated?',
  'landing.faq.customize.answer':
    'The fixture sync is designed to run daily, and important match pages can be refreshed more often during busy match days.',
  'landing.faq.license.question': 'Is this betting advice?',
  'landing.faq.license.answer':
    'No. Predictions are for football analysis and entertainment only. They should not be treated as betting, financial, or guaranteed outcome advice.',
  'landing.cta.headline': 'Find your next World Cup prediction.',
  'landing.cta.subheadline':
    'Open a match page, compare probabilities, check official viewing notes, and run a custom AI scenario when you need deeper context.',
  'landing.cta.button': 'Open all matches',
  'worldcup.media.description':
    'Use licensed match-day photos or your own short clips here. Until then, the site shows a native stadium visual.',
  'worldcup.media.image_note': 'Daily match-day image slot.',
  'worldcup.media.video_note': 'Daily short clip slot.',
};

const localePacks = {
  en: userFacingEn,
  zh: {
    'landing.nav.features': '预测',
    'landing.nav.pricing': '价格',
    'landing.hero.headline': '2026 世界杯每场比赛 AI 预测。',
    'landing.hero.subheadline':
      '查看胜率、预测比分、战术分析、合法观赛指南，并用 Vertex AI 进行自定义赛事情景模拟。',
    'landing.hero.cta': '查看比赛',
    'landing.hero.secondary': '查看方案',
    'landing.features.title': '为世界杯比赛日准备',
    'landing.features.description':
      '在一个页面里查看比赛预测、比分概率、合法观赛信息和 AI 情景模拟。',
    'landing.features.auth.title': '104 个比赛页面',
    'landing.features.auth.description':
      '每场比赛都有独立预测页，包含胜率、预测比分、球场信息和观赛指南链接。',
    'landing.features.payment.title': '合法观赛指南',
    'landing.features.payment.description':
      '每场比赛都提供官方转播和授权流媒体方向，适合本地球迷和旅行中的球迷。',
    'landing.features.rbac.title': 'AI 比分模拟器',
    'landing.features.rbac.description':
      '可以输入伤病、天气、阵容、红牌、战术变化等场景，让 AI 重新分析。',
    'landing.features.i18n.title': '全球多语言支持',
    'landing.features.i18n.description':
      '支持英语、中文、西语、葡语、法语、德语、意语、日语、韩语和阿语。',
    'landing.features.cms.title': '每日媒体位',
    'landing.features.cms.description':
      '可以加入授权图片或短视频，补充比赛日氛围，同时保持页面加载速度。',
    'landing.features.credits.title': 'Cloudflare 快速部署',
    'landing.features.credits.description':
      '页面部署在 Cloudflare Workers，并通过世界杯数据同步流程保持更新。',
    'landing.pricing.title': '球迷访问方案',
    'landing.pricing.description':
      '公开预测保持免费，高级方案用于 AI 情景模拟和赞助位咨询。',
    'landing.pricing.monthly': '方案',
    'landing.pricing.yearly': '积分',
    'landing.pricing.lifetime': '赞助',
    'landing.pricing.buy_lifetime': '一次购买',
    'landing.pricing.starter': '积分包',
    'landing.pricing.starter_desc': '适合只想做几次高级 AI 模拟的球迷',
    'landing.pricing.pro': '赛事通行证',
    'landing.pricing.pro_desc': '适合关注多场比赛和淘汰赛的球迷',
    'landing.pricing.enterprise': '赞助咨询',
    'landing.pricing.enterprise_desc':
      '适合希望评估广告位的品牌或 affiliate',
    'landing.pricing.feature_1_project': '20 次 AI 模拟',
    'landing.pricing.feature_5k_credits': '世界杯期间有效',
    'landing.pricing.feature_email_support': '可用于任意比赛页',
    'landing.pricing.feature_unlimited_projects': '100 次 AI 模拟',
    'landing.pricing.feature_50k_credits': '覆盖全部赛程页面',
    'landing.pricing.feature_priority_support': '适合淘汰赛阶段',
    'landing.pricing.feature_api_access': '高峰期优先模型容量',
    'landing.pricing.feature_everything_pro': '赞助展示位评估',
    'landing.pricing.feature_unlimited_credits': '首页/侧栏库存检查',
    'landing.pricing.feature_dedicated_support': 'UTM 链接设置建议',
    'landing.pricing.feature_custom_integrations': 'Affiliate 文案审核',
    'landing.faq.title': '世界杯 AI 常见问题',
    'landing.faq.description':
      '使用比赛预测、观赛指南和 AI 模拟前需要了解的信息。',
    'landing.faq.stack.question': 'AI 预测是怎么生成的？',
    'landing.faq.stack.answer':
      '我们结合赛程、球队强度先验、场地信息和模型提示词，生成胜率、比分倾向和战术要点。结果是分析，不是保证。',
    'landing.faq.payment.question': '哪些免费，哪些付费？',
    'landing.faq.payment.answer':
      '公开比赛预测和观赛指南免费。高级积分用于解锁具体比赛的 AI 情景模拟。',
    'landing.faq.database.question': '观赛指南合法吗？',
    'landing.faq.database.answer':
      '观赛页会引导用户优先查看官方转播方和授权流媒体服务，不提供盗版直播链接。',
    'landing.faq.customize.question': '比赛数据多久更新一次？',
    'landing.faq.customize.answer':
      '赛程同步设计为每日运行；比赛密集时，重点页面可以更频繁刷新。',
    'landing.faq.license.question': '这是投注建议吗？',
    'landing.faq.license.answer':
      '不是。预测仅用于足球分析和娱乐，不应被视为投注、金融或保证赛果建议。',
    'landing.cta.headline': '找到下一场世界杯预测。',
    'landing.cta.subheadline':
      '打开比赛页，对比概率，查看官方观赛信息，并在需要时运行自定义 AI 场景。',
    'worldcup.prediction.draw': '平局',
    'worldcup.match_card.open': '打开预测',
    'worldcup.match.analysis_title': 'AI 比赛分析报告',
    'worldcup.match.probability_title': 'AI 胜率',
    'worldcup.match.hero_suffix': 'AI 预测和比分模拟器',
    'worldcup.match.disclaimer':
      '本页仅用于足球分析和娱乐，不是投注建议，也不保证比赛结果。',
    'worldcup.watch.title': '如何观看 {teamA} vs {teamB}',
    'worldcup.watch.open_guide': '打开观赛指南',
    'worldcup.assistant.title': '世界杯 AI 助手',
    'worldcup.assistant.welcome':
      '可以问我世界杯赛程、比分预测、观赛指南、小组形势或战术假设。',
    'worldcup.media.description':
      '可在这里使用授权比赛日图片或自己的短视频。在未添加媒体前，页面会显示原生球场视觉。',
    'worldcup.media.image_note': '每日比赛日图片位。',
    'worldcup.media.video_note': '每日短视频位。',
  },
  es: {
    'landing.nav.features': 'Predicciones',
    'landing.nav.pricing': 'Precios',
    'landing.hero.headline':
      'Predicciones IA del Mundial 2026 para cada partido.',
    'landing.hero.subheadline':
      'Consulta probabilidades, marcador previsto, notas tácticas, guías legales para ver el partido y un simulador Vertex AI.',
    'landing.hero.cta': 'Ver partidos',
    'landing.hero.secondary': 'Ver planes',
    'landing.features.title': 'Diseñado para los días de Mundial',
    'landing.features.description':
      'Predicciones, probabilidades, guía legal para ver partidos y simulaciones IA en un solo lugar.',
    'landing.pricing.title': 'Planes para fans',
    'landing.pricing.description':
      'Las predicciones públicas son gratis. Los planes premium añaden simulaciones IA y consultas de patrocinio.',
    'landing.pricing.monthly': 'Planes',
    'landing.pricing.starter': 'Paquete de créditos',
    'landing.pricing.pro': 'Pase del torneo',
    'landing.pricing.enterprise': 'Consulta de patrocinio',
    'landing.faq.title': 'Preguntas frecuentes de World Cup AI',
    'landing.faq.description':
      'Lo que debes saber antes de usar predicciones, guías y simulaciones IA.',
    'landing.faq.stack.question': '¿Cómo se generan las predicciones IA?',
    'landing.faq.payment.question': '¿Qué es gratis y qué es de pago?',
    'landing.faq.database.question': '¿Las guías para ver son legales?',
    'landing.faq.customize.question': '¿Cada cuánto se actualizan los datos?',
    'landing.faq.license.question': '¿Esto es consejo de apuestas?',
    'landing.cta.headline': 'Encuentra tu próxima predicción del Mundial.',
    'worldcup.prediction.draw': 'Empate',
    'worldcup.match_card.open': 'Abrir predicción',
    'worldcup.match.analysis_title': 'Informe de análisis IA',
    'worldcup.match.probability_title': 'Probabilidad IA de victoria',
    'worldcup.match.hero_suffix': 'Predicción IA y simulador de marcador',
    'worldcup.watch.title': 'Cómo ver {teamA} vs {teamB}',
    'worldcup.watch.open_guide': 'Abrir guía para ver',
    'worldcup.assistant.title': 'Asistente IA del Mundial',
  },
  'pt-BR': {
    'landing.nav.features': 'Previsões',
    'landing.nav.pricing': 'Preços',
    'landing.hero.headline':
      'Previsões com IA para cada jogo da Copa 2026.',
    'landing.hero.subheadline':
      'Veja probabilidades, placar previsto, notas táticas, guias legais para assistir e simulações Vertex AI.',
    'landing.hero.cta': 'Ver jogos',
    'landing.hero.secondary': 'Ver planos',
    'landing.features.title': 'Feito para dias de Copa',
    'landing.features.description':
      'Previsões, probabilidades, guia legal para assistir e simulações de IA em um só lugar.',
    'landing.pricing.title': 'Planos para torcedores',
    'landing.pricing.description':
      'Previsões públicas continuam grátis. Planos premium adicionam simulações IA e consultas de patrocínio.',
    'landing.pricing.monthly': 'Planos',
    'landing.pricing.starter': 'Pacote de créditos',
    'landing.pricing.pro': 'Passe do torneio',
    'landing.pricing.enterprise': 'Consulta de patrocínio',
    'landing.faq.title': 'Perguntas frequentes do World Cup AI',
    'landing.cta.headline': 'Encontre sua próxima previsão da Copa.',
    'worldcup.prediction.draw': 'Empate',
    'worldcup.match_card.open': 'Abrir previsão',
    'worldcup.match.analysis_title': 'Relatório de análise IA',
    'worldcup.match.probability_title': 'Probabilidade IA de vitória',
    'worldcup.match.hero_suffix': 'Previsão IA e simulador de placar',
    'worldcup.watch.title': 'Como assistir {teamA} vs {teamB}',
    'worldcup.watch.open_guide': 'Abrir guia para assistir',
    'worldcup.assistant.title': 'Assistente IA da Copa',
  },
  fr: {
    'landing.nav.features': 'Prédictions',
    'landing.nav.pricing': 'Tarifs',
    'landing.hero.headline':
      'Prédictions IA pour chaque match de la Coupe du monde 2026.',
    'landing.hero.subheadline':
      'Consultez les probabilités, le score prévu, les notes tactiques, les guides légaux de diffusion et les simulations Vertex AI.',
    'landing.hero.cta': 'Voir les matchs',
    'landing.hero.secondary': 'Voir les offres',
    'landing.features.title': 'Conçu pour les jours de Coupe du monde',
    'landing.features.description':
      'Prédictions, probabilités, guides de visionnage légaux et simulations IA au même endroit.',
    'landing.pricing.title': 'Offres pour les fans',
    'landing.pricing.description':
      'Les prédictions publiques restent gratuites. Les offres premium ajoutent des simulations IA et des demandes de sponsoring.',
    'landing.pricing.monthly': 'Offres',
    'landing.pricing.starter': 'Pack de crédits',
    'landing.pricing.pro': 'Pass tournoi',
    'landing.pricing.enterprise': 'Demande sponsor',
    'landing.faq.title': 'FAQ World Cup AI',
    'landing.cta.headline': 'Trouvez votre prochaine prédiction du Mondial.',
    'worldcup.prediction.draw': 'Nul',
    'worldcup.match_card.open': 'Ouvrir la prédiction',
    'worldcup.match.analysis_title': 'Rapport d’analyse IA',
    'worldcup.match.probability_title': 'Probabilité IA de victoire',
    'worldcup.match.hero_suffix': 'Prédiction IA et simulateur de score',
    'worldcup.watch.title': 'Comment regarder {teamA} vs {teamB}',
    'worldcup.watch.open_guide': 'Ouvrir le guide',
    'worldcup.assistant.title': 'Assistant IA Coupe du monde',
  },
  de: {
    'landing.nav.features': 'Prognosen',
    'landing.nav.pricing': 'Preise',
    'landing.hero.headline': 'KI-Prognosen für jedes Spiel der WM 2026.',
    'landing.hero.subheadline':
      'Sieh Gewinnwahrscheinlichkeiten, erwartete Ergebnisse, taktische Notizen, legale Watch-Guides und Vertex-AI-Simulationen.',
    'landing.hero.cta': 'Spiele ansehen',
    'landing.hero.secondary': 'Pläne ansehen',
    'landing.features.title': 'Gebaut für WM-Spieltage',
    'landing.pricing.title': 'Zugang für Fans',
    'landing.pricing.monthly': 'Pläne',
    'landing.pricing.starter': 'Credit-Paket',
    'landing.pricing.pro': 'Turnierpass',
    'landing.pricing.enterprise': 'Sponsoring-Anfrage',
    'landing.faq.title': 'World Cup AI FAQ',
    'landing.cta.headline': 'Finde deine nächste WM-Prognose.',
    'worldcup.prediction.draw': 'Unentschieden',
    'worldcup.match_card.open': 'Prognose öffnen',
    'worldcup.match.analysis_title': 'KI-Spielanalyse',
    'worldcup.match.probability_title': 'KI-Siegwahrscheinlichkeit',
    'worldcup.match.hero_suffix': 'KI-Prognose und Ergebnis-Simulator',
    'worldcup.watch.title': 'So siehst du {teamA} gegen {teamB}',
    'worldcup.assistant.title': 'WM-KI-Assistent',
  },
  it: {
    'landing.nav.features': 'Pronostici',
    'landing.nav.pricing': 'Prezzi',
    'landing.hero.headline':
      'Pronostici IA per ogni partita dei Mondiali 2026.',
    'landing.hero.subheadline':
      'Probabilità, risultato previsto, note tattiche, guide legali e simulazioni Vertex AI.',
    'landing.hero.cta': 'Vedi partite',
    'landing.hero.secondary': 'Vedi piani',
    'landing.features.title': 'Creato per i giorni dei Mondiali',
    'landing.pricing.title': 'Piani per tifosi',
    'landing.pricing.monthly': 'Piani',
    'landing.pricing.starter': 'Pacchetto crediti',
    'landing.pricing.pro': 'Pass torneo',
    'landing.pricing.enterprise': 'Richiesta sponsor',
    'landing.faq.title': 'FAQ World Cup AI',
    'landing.cta.headline': 'Trova il tuo prossimo pronostico mondiale.',
    'worldcup.prediction.draw': 'Pareggio',
    'worldcup.match_card.open': 'Apri pronostico',
    'worldcup.match.analysis_title': 'Report analisi IA',
    'worldcup.match.probability_title': 'Probabilità IA di vittoria',
    'worldcup.match.hero_suffix': 'Pronostico IA e simulatore risultato',
    'worldcup.watch.title': 'Come guardare {teamA} vs {teamB}',
    'worldcup.assistant.title': 'Assistente IA Mondiali',
  },
  ja: {
    'landing.nav.features': '予測',
    'landing.nav.pricing': '料金',
    'landing.hero.headline': '2026年ワールドカップ全試合のAI予測。',
    'landing.hero.subheadline':
      '勝率、予想スコア、戦術メモ、合法視聴ガイド、Vertex AIのシナリオ分析を確認できます。',
    'landing.hero.cta': '試合を見る',
    'landing.hero.secondary': 'プランを見る',
    'landing.features.title': 'ワールドカップ観戦日に最適化',
    'landing.pricing.title': 'ファン向けプラン',
    'landing.pricing.monthly': 'プラン',
    'landing.pricing.starter': 'クレジットパック',
    'landing.pricing.pro': 'トーナメントパス',
    'landing.pricing.enterprise': 'スポンサー問い合わせ',
    'landing.faq.title': 'World Cup AI よくある質問',
    'landing.cta.headline': '次のワールドカップ予測を見つけよう。',
    'worldcup.prediction.draw': '引き分け',
    'worldcup.match_card.open': '予測を開く',
    'worldcup.match.analysis_title': 'AI試合分析レポート',
    'worldcup.match.probability_title': 'AI勝率',
    'worldcup.match.hero_suffix': 'AI予測とスコアシミュレーター',
    'worldcup.watch.title': '{teamA} vs {teamB} の視聴方法',
    'worldcup.assistant.title': 'ワールドカップAIアシスタント',
  },
  ko: {
    'landing.nav.features': '예측',
    'landing.nav.pricing': '요금',
    'landing.hero.headline': '2026 월드컵 모든 경기 AI 예측.',
    'landing.hero.subheadline':
      '승률, 예상 스코어, 전술 메모, 합법 시청 가이드와 Vertex AI 시나리오 분석을 확인하세요.',
    'landing.hero.cta': '경기 보기',
    'landing.hero.secondary': '플랜 보기',
    'landing.features.title': '월드컵 경기일을 위한 구성',
    'landing.pricing.title': '팬 이용 플랜',
    'landing.pricing.monthly': '플랜',
    'landing.pricing.starter': '크레딧 팩',
    'landing.pricing.pro': '토너먼트 패스',
    'landing.pricing.enterprise': '스폰서 문의',
    'landing.faq.title': 'World Cup AI FAQ',
    'landing.cta.headline': '다음 월드컵 예측을 찾아보세요.',
    'worldcup.prediction.draw': '무승부',
    'worldcup.match_card.open': '예측 열기',
    'worldcup.match.analysis_title': 'AI 경기 분석 리포트',
    'worldcup.match.probability_title': 'AI 승리 확률',
    'worldcup.match.hero_suffix': 'AI 예측 및 스코어 시뮬레이터',
    'worldcup.watch.title': '{teamA} vs {teamB} 시청 방법',
    'worldcup.assistant.title': '월드컵 AI 어시스턴트',
  },
  ar: {
    'landing.nav.features': 'التوقعات',
    'landing.nav.pricing': 'الأسعار',
    'landing.hero.headline':
      'توقعات ذكاء اصطناعي لكل مباراة في كأس العالم 2026.',
    'landing.hero.subheadline':
      'اطلع على احتمالات الفوز، النتيجة المتوقعة، الملاحظات التكتيكية، طرق المشاهدة القانونية ومحاكاة Vertex AI.',
    'landing.hero.cta': 'عرض المباريات',
    'landing.hero.secondary': 'عرض الخطط',
    'landing.features.title': 'مصمم لأيام مباريات كأس العالم',
    'landing.pricing.title': 'خطط للجماهير',
    'landing.pricing.monthly': 'الخطط',
    'landing.pricing.starter': 'حزمة رصيد',
    'landing.pricing.pro': 'تذكرة البطولة',
    'landing.pricing.enterprise': 'استفسار رعاية',
    'landing.faq.title': 'أسئلة World Cup AI',
    'landing.cta.headline': 'اعثر على توقع مباراتك التالية.',
    'worldcup.prediction.draw': 'تعادل',
    'worldcup.match_card.open': 'فتح التوقع',
    'worldcup.match.analysis_title': 'تقرير تحليل الذكاء الاصطناعي',
    'worldcup.match.probability_title': 'احتمال الفوز بالذكاء الاصطناعي',
    'worldcup.match.hero_suffix': 'توقع الذكاء الاصطناعي ومحاكي النتيجة',
    'worldcup.watch.title': 'كيفية مشاهدة {teamA} ضد {teamB}',
    'worldcup.assistant.title': 'مساعد كأس العالم AI',
  },
};

const locales = ['en', 'zh', 'es', 'pt-BR', 'fr', 'de', 'it', 'ja', 'ko', 'ar'];

for (const locale of locales) {
  const file = join(messagesDir, `${locale}.json`);
  const current = existsSync(file)
    ? JSON.parse(readFileSync(file, 'utf8'))
    : {};
  const next = {
    ...en,
    ...current,
    ...userFacingEn,
    ...(localePacks[locale] ?? {}),
  };
  writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
}
