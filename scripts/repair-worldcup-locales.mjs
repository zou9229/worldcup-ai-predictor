import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const messagesDir = join(process.cwd(), 'messages');
const locales = ['es', 'pt-BR', 'fr', 'de', 'it', 'ja', 'ko', 'ar'];

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function previousLocale(locale) {
  try {
    return JSON.parse(
      execFileSync('git', ['show', `HEAD^:messages/${locale}.json`], {
        encoding: 'utf8',
      })
    );
  } catch {
    return {};
  }
}

const localizedCompliance = {
  es: {
    'landing.pricing.description': 'Las predicciones públicas siguen siendo gratis. Los planes premium añaden simulaciones de IA y consultas para patrocinadores.',
    'landing.faq.payment.answer': 'Las predicciones públicas y las guías para ver partidos son gratis. Los créditos premium desbloquean simulaciones de IA para escenarios específicos.',
    'worldcup.ads.placeholder': 'Espacio publicitario: AdSense, Ezoic, afiliado o patrocinador directo',
    'worldcup.visual.live_model': 'Instantánea del modelo',
    'worldcup.watch.index_title': 'Guía para ver el Mundial 2026',
    'worldcup.watch.badge': 'Guía oficial para ver',
    'worldcup.watch.official_title': 'Opciones oficiales de visualización',
    'worldcup.watch.official_body': 'Consulta primero el titular de derechos de tu país: cadenas nacionales, canales deportivos y aplicaciones oficiales suelen publicar la cobertura antes del inicio.',
    'worldcup.watch.broadcasters_badge': 'Emisoras oficiales',
    'worldcup.watch.broadcasters_title': 'Empieza por emisoras con licencia',
    'worldcup.watch.broadcasters_description': 'Usa estos puntos de partida oficiales y confirma la cobertura de cada partido en tu país antes del inicio.',
    'worldcup.watch.broadcasters_source_note': 'Los derechos y la asignación de partidos pueden cambiar por país. Esta guía enlaza referencias oficiales y no incrusta streams no autorizados.',
    'worldcup.match.disclaimer': 'Esta página es análisis futbolístico informativo y entretenimiento. No es consejo de apuestas y no garantiza resultados.',
    'worldcup.match.final_score': 'Resultado final',
    'worldcup.match.final_score_prefix': 'Resultado final de la instantánea actual del calendario:',
    'worldcup.match.model_estimate_note': 'El panel de probabilidades sigue siendo una estimación del modelo; no es un resultado oficial, una fuente de cuotas ni datos en vivo.',
    'worldcup.data.sync_badge': 'Instantánea de datos',
    'worldcup.data.source_title': 'Fuente de datos',
    'worldcup.data.source_note': 'Los calendarios y resultados completados se cargan desde la instantánea del sitio, sincronizada desde el conjunto de datos JSON de openfootball World Cup 2026 cuando se ejecuta el endpoint de sincronización. Si falla, el sitio usa la instantánea local incluida.',
    'worldcup.data.prediction_note': 'Las probabilidades, marcadores previstos, confianza y notas tácticas se generan localmente con puntuaciones de equipos. Son estimaciones editoriales/modelo, no datos oficiales de FIFA, cuotas de mercado ni telemetría en vivo.',
    'worldcup.assistant.description': 'Pregunta sobre calendario, predicciones, opciones para ver partidos y escenarios de jornada.',
    'worldcup.assistant.sign_in_notice': 'Inicia sesión para usar el asistente IA del Mundial.',
    'worldcup.assistant.credit_note': 'Cada respuesta del asistente consume 1 crédito. Las llamadas de IA fallidas se reembolsan automáticamente.',
  },
  'pt-BR': {
    'landing.pricing.description': 'As previsões públicas continuam gratuitas. Planos premium adicionam simulações de IA e fluxos para consulta de patrocinadores.',
    'landing.faq.payment.answer': 'Previsões públicas e guias para assistir são gratuitos. Créditos premium desbloqueiam simulações de IA para cenários específicos.',
    'worldcup.ads.placeholder': 'Espaço de anúncio: AdSense, Ezoic, afiliado ou patrocinador direto',
    'worldcup.visual.live_model': 'Snapshot do modelo',
    'worldcup.watch.index_title': 'Guia para assistir à Copa do Mundo 2026',
    'worldcup.watch.badge': 'Guia oficial para assistir',
    'worldcup.watch.official_title': 'Opções oficiais para assistir',
    'worldcup.watch.official_body': 'Verifique primeiro o detentor de direitos no seu país: emissoras nacionais, canais esportivos e apps oficiais costumam publicar a cobertura antes do jogo.',
    'worldcup.watch.broadcasters_badge': 'Transmissoras oficiais',
    'worldcup.watch.broadcasters_title': 'Comece por transmissoras licenciadas',
    'worldcup.watch.broadcasters_description': 'Use estes pontos de partida oficiais e confirme a cobertura jogo a jogo no seu país antes do início.',
    'worldcup.watch.broadcasters_source_note': 'Direitos e alocação de partidas podem mudar por país. Este guia linka referências oficiais e não incorpora transmissões não autorizadas.',
    'worldcup.match.disclaimer': 'Esta página é análise informativa de futebol e entretenimento. Não é conselho de apostas e não garante resultados.',
    'worldcup.match.final_score': 'Placar final',
    'worldcup.match.final_score_prefix': 'Placar final no snapshot atual da tabela:',
    'worldcup.match.model_estimate_note': 'O painel de probabilidades continua sendo uma estimativa do modelo; não é resultado oficial, fonte de odds ou dados ao vivo.',
    'worldcup.data.sync_badge': 'Snapshot de dados',
    'worldcup.data.source_title': 'Fonte dos dados',
    'worldcup.data.source_note': 'Tabela e placares finalizados vêm do snapshot do site, sincronizado do dataset JSON openfootball World Cup 2026 quando o endpoint roda. Se a sincronização falhar, o site usa o snapshot local incluído.',
    'worldcup.data.prediction_note': 'Probabilidades, placares previstos, confiança e notas táticas são gerados localmente a partir de ratings de equipes. São estimativas editoriais/modelo, não dados oficiais da FIFA, odds de mercado ou telemetria ao vivo.',
    'worldcup.assistant.description': 'Pergunte sobre jogos, previsões, opções para assistir e cenários de partida.',
    'worldcup.assistant.sign_in_notice': 'Entre para usar o assistente de IA da Copa.',
    'worldcup.assistant.credit_note': 'Cada resposta do assistente consome 1 crédito. Chamadas de IA com falha são reembolsadas automaticamente.',
  },
  fr: {
    'landing.pricing.description': 'Les prédictions publiques restent gratuites. Les offres premium ajoutent des simulations IA et des demandes sponsor.',
    'landing.faq.payment.answer': 'Les prédictions publiques et les guides de visionnage sont gratuits. Les crédits premium débloquent des simulations IA pour des scénarios précis.',
    'worldcup.ads.placeholder': 'Emplacement publicitaire : AdSense, Ezoic, affilié ou sponsor direct',
    'worldcup.visual.live_model': 'Instantané du modèle',
    'worldcup.watch.index_title': 'Guide de visionnage Coupe du Monde 2026',
    'worldcup.watch.badge': 'Guide officiel de visionnage',
    'worldcup.watch.official_title': 'Options officielles de visionnage',
    'worldcup.watch.official_body': 'Vérifiez d’abord le détenteur des droits dans votre pays : chaînes nationales, chaînes sportives et applications officielles publient généralement leur couverture avant le coup d’envoi.',
    'worldcup.watch.broadcasters_badge': 'Diffuseurs officiels',
    'worldcup.watch.broadcasters_title': 'Commencez par les diffuseurs licenciés',
    'worldcup.watch.broadcasters_description': 'Utilisez ces points d’entrée officiels, puis vérifiez la couverture match par match dans votre pays avant le coup d’envoi.',
    'worldcup.watch.broadcasters_source_note': 'Les droits et allocations de matchs peuvent changer selon le pays. Ce guide renvoie vers des références officielles et n’intègre pas de flux non autorisés.',
    'worldcup.match.disclaimer': 'Cette page fournit une analyse footballistique informative et divertissante. Ce n’est pas un conseil de pari et elle ne garantit aucun résultat.',
    'worldcup.match.final_score': 'Score final',
    'worldcup.match.final_score_prefix': 'Score final dans l’instantané actuel du calendrier :',
    'worldcup.match.model_estimate_note': 'Le panneau de probabilités reste une estimation du modèle ; ce n’est pas un résultat officiel, un flux de cotes ou des données en direct.',
    'worldcup.data.sync_badge': 'Instantané des données',
    'worldcup.data.source_title': 'Source des données',
    'worldcup.data.source_note': 'Les calendriers et scores terminés viennent de l’instantané du site, synchronisé depuis le dataset JSON openfootball World Cup 2026 lorsque l’endpoint fonctionne. En cas d’échec, le site utilise l’instantané local inclus.',
    'worldcup.data.prediction_note': 'Les probabilités, scores prévus, niveaux de confiance et notes tactiques sont générés localement à partir de notes d’équipes. Ce sont des estimations éditoriales/modèle, pas des données FIFA, des cotes de marché ou une télémétrie en direct.',
    'worldcup.assistant.description': 'Posez des questions sur le calendrier, les prédictions, les options de visionnage et les scénarios de match.',
    'worldcup.assistant.sign_in_notice': 'Connectez-vous pour utiliser l’assistant IA Coupe du Monde.',
    'worldcup.assistant.credit_note': 'Chaque réponse de l’assistant consomme 1 crédit. Les appels IA échoués sont remboursés automatiquement.',
  },
  de: {
    'landing.pricing.description': 'Öffentliche Prognosen bleiben kostenlos. Premium-Pläne bieten KI-Simulationen und Sponsoring-Anfragen.',
    'landing.faq.payment.answer': 'Öffentliche Spielprognosen und Viewing-Guides sind kostenlos. Premium-Credits schalten KI-Simulationen für konkrete Spielszenarien frei.',
    'worldcup.ads.placeholder': 'Werbefläche: AdSense, Ezoic, Affiliate-Partner oder direkter Sponsor',
    'worldcup.visual.live_model': 'Modell-Snapshot',
    'worldcup.watch.index_title': 'WM 2026 TV- und Streaming-Guide',
    'worldcup.watch.badge': 'Offizieller Viewing-Guide',
    'worldcup.watch.official_title': 'Offizielle Viewing-Optionen',
    'worldcup.watch.official_body': 'Prüfe zuerst den Rechteinhaber in deinem Land: nationale Sender, Sportsender und offizielle Apps veröffentlichen die Spielabdeckung meist vor Anpfiff.',
    'worldcup.watch.broadcasters_badge': 'Offizielle Sender',
    'worldcup.watch.broadcasters_title': 'Beginne bei lizenzierten Sendern',
    'worldcup.watch.broadcasters_description': 'Nutze diese offiziellen Einstiegspunkte und prüfe die Spielabdeckung in deinem Land vor Anpfiff.',
    'worldcup.watch.broadcasters_source_note': 'Rechte und Spielzuweisungen können je nach Land wechseln. Dieser Guide verlinkt offizielle Quellen und bindet keine unautorisierten Streams ein.',
    'worldcup.match.disclaimer': 'Diese Seite dient der informativen Fußballanalyse und Unterhaltung. Sie ist keine Wettberatung und garantiert keine Spielergebnisse.',
    'worldcup.match.final_score': 'Endstand',
    'worldcup.match.final_score_prefix': 'Endstand aus dem aktuellen Spielplan-Snapshot:',
    'worldcup.match.model_estimate_note': 'Das Wahrscheinlichkeitsfeld bleibt eine Modellschätzung; es ist kein offizielles Ergebnis, kein Quoten-Feed und kein Live-Datenfeed.',
    'worldcup.data.sync_badge': 'Daten-Snapshot',
    'worldcup.data.source_title': 'Datenquelle',
    'worldcup.data.source_note': 'Spielpläne und abgeschlossene Ergebnisse stammen aus dem Website-Snapshot, der beim Sync vom openfootball World Cup 2026 JSON-Datensatz geladen wird. Wenn der Sync fehlschlägt, nutzt die Website den lokalen Snapshot.',
    'worldcup.data.prediction_note': 'Siegwahrscheinlichkeiten, erwartete Ergebnisse, Konfidenz und taktische Notizen werden lokal aus Teamratings erzeugt. Sie sind redaktionelle Modellschätzungen, keine FIFA-Daten, Marktquoten oder Live-Telemetrie.',
    'worldcup.assistant.description': 'Frage nach Spielplan, Prognosen, Viewing-Optionen und Matchday-Szenarien.',
    'worldcup.assistant.sign_in_notice': 'Melde dich an, um den WM-KI-Assistenten zu nutzen.',
    'worldcup.assistant.credit_note': 'Jede Assistenten-Antwort verbraucht 1 Credit. Fehlgeschlagene KI-Aufrufe werden automatisch erstattet.',
  },
  it: {
    'landing.pricing.description': 'I pronostici pubblici restano gratuiti. I piani premium aggiungono simulazioni IA e richieste sponsor.',
    'landing.faq.payment.answer': 'Pronostici pubblici e guide alla visione sono gratuiti. I crediti premium sbloccano simulazioni IA per scenari specifici.',
    'worldcup.ads.placeholder': 'Spazio pubblicitario: AdSense, Ezoic, partner affiliato o sponsor diretto',
    'worldcup.visual.live_model': 'Snapshot del modello',
    'worldcup.watch.index_title': 'Guida per vedere i Mondiali 2026',
    'worldcup.watch.badge': 'Guida ufficiale alla visione',
    'worldcup.watch.official_title': 'Opzioni ufficiali per la visione',
    'worldcup.watch.official_body': 'Controlla prima il titolare dei diritti nel tuo paese: emittenti nazionali, canali sportivi e app ufficiali pubblicano di solito la copertura prima del calcio d’inizio.',
    'worldcup.watch.broadcasters_badge': 'Emittenti ufficiali',
    'worldcup.watch.broadcasters_title': 'Parti dalle emittenti autorizzate',
    'worldcup.watch.broadcasters_description': 'Usa questi punti di partenza ufficiali e verifica la copertura partita per partita nel tuo paese prima del calcio d’inizio.',
    'worldcup.watch.broadcasters_source_note': 'Diritti e assegnazioni possono cambiare per paese. Questa guida collega fonti ufficiali e non incorpora stream non autorizzati.',
    'worldcup.match.disclaimer': 'Questa pagina offre analisi calcistica informativa e intrattenimento. Non è consiglio di scommessa e non garantisce risultati.',
    'worldcup.match.final_score': 'Risultato finale',
    'worldcup.match.final_score_prefix': 'Risultato finale nello snapshot attuale del calendario:',
    'worldcup.match.model_estimate_note': 'Il pannello probabilità resta una stima del modello; non è un risultato ufficiale, un feed quote o dati live.',
    'worldcup.data.sync_badge': 'Snapshot dati',
    'worldcup.data.source_title': 'Fonte dati',
    'worldcup.data.source_note': 'Calendario e risultati finali vengono caricati dallo snapshot del sito, sincronizzato dal dataset JSON openfootball World Cup 2026 quando l’endpoint viene eseguito. Se la sincronizzazione fallisce, il sito usa lo snapshot locale incluso.',
    'worldcup.data.prediction_note': 'Probabilità, risultati previsti, fiducia e note tattiche sono generati localmente dai rating delle squadre. Sono stime editoriali/modello, non dati FIFA, quote di mercato o telemetria live.',
    'worldcup.assistant.description': 'Chiedi informazioni su calendario, pronostici, opzioni di visione e scenari di giornata.',
    'worldcup.assistant.sign_in_notice': 'Accedi per usare l’assistente IA dei Mondiali.',
    'worldcup.assistant.credit_note': 'Ogni risposta dell’assistente consuma 1 credito. Le chiamate IA fallite vengono rimborsate automaticamente.',
  },
  ja: {
    'landing.pricing.description': '公開予測は無料です。プレミアムプランでは AI シミュレーションとスポンサー問い合わせ機能を利用できます。',
    'landing.faq.payment.answer': '公開試合予測と視聴ガイドは無料です。プレミアムクレジットで特定シナリオの AI シミュレーションを利用できます。',
    'worldcup.ads.placeholder': '広告枠：AdSense、Ezoic、アフィリエイト、または直接スポンサー',
    'worldcup.visual.live_model': 'モデルスナップショット',
    'worldcup.watch.index_title': '2026年ワールドカップ視聴ガイド',
    'worldcup.watch.badge': '公式視聴ガイド',
    'worldcup.watch.official_title': '公式視聴オプション',
    'worldcup.watch.official_body': 'まず各国・地域の権利保有者を確認してください。国内放送局、スポーツチャンネル、公式配信アプリは通常、キックオフ前に試合ごとの配信予定を公開します。',
    'worldcup.watch.broadcasters_badge': '公式放送局',
    'worldcup.watch.broadcasters_title': '認可された放送・配信元から確認',
    'worldcup.watch.broadcasters_description': 'これらの公式入口を起点に、キックオフ前に各国・地域での試合別配信予定を確認してください。',
    'worldcup.watch.broadcasters_source_note': '放映権と試合ごとの割り当ては国や地域で変わる場合があります。このガイドは公式参照先にリンクし、未許可ストリームは埋め込みません。',
    'worldcup.match.disclaimer': 'このページはサッカー分析とエンターテインメントを目的とした情報です。賭けの助言ではなく、試合結果を保証するものではありません。',
    'worldcup.match.final_score': '最終スコア',
    'worldcup.match.final_score_prefix': '現在のスケジュールスナップショット上の最終スコア：',
    'worldcup.match.model_estimate_note': '確率パネルはモデル推定であり、公式結果、オッズ配信、ライブデータではありません。',
    'worldcup.data.sync_badge': 'データスナップショット',
    'worldcup.data.source_title': 'データソース',
    'worldcup.data.source_note': '日程と終了済みスコアはサイトのスケジュールスナップショットから読み込まれます。同期エンドポイント実行時に openfootball World Cup 2026 JSON データセットから同期し、失敗時は同梱のローカルスナップショットに戻ります。',
    'worldcup.data.prediction_note': '勝率、予想スコア、信頼度、戦術メモはアプリ内のチーム評価からローカル生成される編集・モデル推定です。FIFA公式データ、市場オッズ、ライブ試合データではありません。',
    'worldcup.assistant.description': '日程、予測、視聴方法、試合当日のシナリオについて質問できます。',
    'worldcup.assistant.sign_in_notice': 'ワールドカップ AI アシスタントを使うにはログインしてください。',
    'worldcup.assistant.credit_note': 'AI アシスタントの回答は 1 回につき 1 クレジットを消費します。AI 呼び出しに失敗した場合は自動返金されます。',
  },
  ko: {
    'landing.pricing.description': '공개 예측은 무료로 유지됩니다. 프리미엄 플랜은 AI 시뮬레이션과 스폰서 문의 기능을 제공합니다.',
    'landing.faq.payment.answer': '공개 경기 예측과 시청 가이드는 무료입니다. 프리미엄 크레딧으로 특정 경기 시나리오의 AI 시뮬레이션을 사용할 수 있습니다.',
    'worldcup.ads.placeholder': '광고 슬롯: AdSense, Ezoic, 제휴 파트너 또는 직접 스폰서',
    'worldcup.visual.live_model': '모델 스냅샷',
    'worldcup.watch.index_title': '2026 월드컵 시청 가이드',
    'worldcup.watch.badge': '공식 시청 가이드',
    'worldcup.watch.official_title': '공식 시청 옵션',
    'worldcup.watch.official_body': '먼저 거주 국가의 중계권 보유자를 확인하세요. 국가 방송사, 스포츠 채널, 공식 스트리밍 앱은 보통 경기 전 중계 일정을 공개합니다.',
    'worldcup.watch.broadcasters_badge': '공식 중계사',
    'worldcup.watch.broadcasters_title': '허가된 중계사부터 확인하세요',
    'worldcup.watch.broadcasters_description': '아래 공식 출발점을 사용하고, 킥오프 전 국가별 경기 중계 여부를 다시 확인하세요.',
    'worldcup.watch.broadcasters_source_note': '중계권과 경기 배정은 국가별로 달라질 수 있습니다. 이 가이드는 공식 참고 링크만 제공하며 무단 스트림을 임베드하지 않습니다.',
    'worldcup.match.disclaimer': '이 페이지는 정보성 축구 분석과 엔터테인먼트를 위한 것입니다. 베팅 조언이 아니며 경기 결과를 보장하지 않습니다.',
    'worldcup.match.final_score': '최종 스코어',
    'worldcup.match.final_score_prefix': '현재 일정 스냅샷의 최종 스코어:',
    'worldcup.match.model_estimate_note': '확률 패널은 여전히 모델 추정치이며 공식 결과, 배당 데이터, 실시간 데이터 피드가 아닙니다.',
    'worldcup.data.sync_badge': '데이터 스냅샷',
    'worldcup.data.source_title': '데이터 출처',
    'worldcup.data.source_note': '일정과 종료된 경기 스코어는 사이트 일정 스냅샷에서 로드됩니다. 동기화 엔드포인트가 실행될 때 openfootball World Cup 2026 JSON 데이터셋에서 동기화하며, 실패하면 포함된 로컬 스냅샷을 사용합니다.',
    'worldcup.data.prediction_note': '승률, 예상 스코어, 신뢰도, 전술 메모는 앱 내부 팀 평점으로 로컬 생성되는 편집/모델 추정치입니다. FIFA 공식 데이터, 시장 배당, 실시간 경기 데이터가 아닙니다.',
    'worldcup.assistant.description': '일정, 예측, 시청 옵션, 경기일 시나리오에 대해 질문하세요.',
    'worldcup.assistant.sign_in_notice': '월드컵 AI 어시스턴트를 사용하려면 로그인하세요.',
    'worldcup.assistant.credit_note': 'AI 어시스턴트 답변은 1회당 1 크레딧을 사용합니다. AI 호출 실패 시 자동 환불됩니다.',
  },
  ar: {
    'landing.pricing.description': 'تبقى التوقعات العامة مجانية. تضيف الخطط المميزة محاكاة بالذكاء الاصطناعي ومسارات للاستفسار عن الرعاية.',
    'landing.faq.payment.answer': 'توقعات المباريات العامة وأدلة المشاهدة مجانية. تفتح الأرصدة المميزة محاكاة ذكاء اصطناعي لسيناريوهات محددة.',
    'worldcup.ads.placeholder': 'مساحة إعلانية: AdSense أو Ezoic أو شريك تابع أو راع مباشر',
    'worldcup.visual.live_model': 'لقطة النموذج',
    'worldcup.watch.index_title': 'دليل مشاهدة كأس العالم 2026',
    'worldcup.watch.badge': 'دليل مشاهدة رسمي',
    'worldcup.watch.official_title': 'خيارات المشاهدة الرسمية',
    'worldcup.watch.official_body': 'تحقق أولا من صاحب الحقوق في بلدك: القنوات الوطنية والقنوات الرياضية والتطبيقات الرسمية تنشر عادة تغطية كل مباراة قبل انطلاقها.',
    'worldcup.watch.broadcasters_badge': 'جهات البث الرسمية',
    'worldcup.watch.broadcasters_title': 'ابدأ بجهات البث المرخصة',
    'worldcup.watch.broadcasters_description': 'استخدم هذه المداخل الرسمية ثم تحقق من تغطية كل مباراة في بلدك قبل انطلاقها.',
    'worldcup.watch.broadcasters_source_note': 'قد تختلف الحقوق وتوزيع المباريات حسب البلد. يربط هذا الدليل بمراجع رسمية ولا يدمج بثا غير مصرح به.',
    'worldcup.match.disclaimer': 'هذه الصفحة مخصصة لتحليل كرة القدم والمحتوى الترفيهي. ليست نصيحة مراهنة ولا تضمن نتائج المباريات.',
    'worldcup.match.final_score': 'النتيجة النهائية',
    'worldcup.match.final_score_prefix': 'النتيجة النهائية من لقطة الجدول الحالية:',
    'worldcup.match.model_estimate_note': 'تبقى لوحة الاحتمالات تقديرا من النموذج؛ وليست نتيجة رسمية أو مصدر احتمالات سوقية أو بيانات مباشرة.',
    'worldcup.data.sync_badge': 'لقطة بيانات',
    'worldcup.data.source_title': 'مصدر البيانات',
    'worldcup.data.source_note': 'يتم تحميل الجداول والنتائج المكتملة من لقطة جدول الموقع، والتي تتم مزامنتها من مجموعة بيانات openfootball World Cup 2026 JSON عند تشغيل نقطة المزامنة. إذا فشلت المزامنة، يستخدم الموقع اللقطة المحلية المرفقة.',
    'worldcup.data.prediction_note': 'يتم إنشاء احتمالات الفوز والنتائج المتوقعة ومستويات الثقة والملاحظات التكتيكية محليا من تقييمات الفرق داخل التطبيق. إنها تقديرات تحريرية/نموذجية وليست بيانات FIFA رسمية أو احتمالات سوقية أو بيانات مباشرة للمباراة.',
    'worldcup.assistant.description': 'اسأل عن الجداول والتوقعات وخيارات المشاهدة وسيناريوهات يوم المباراة.',
    'worldcup.assistant.sign_in_notice': 'سجل الدخول لاستخدام مساعد كأس العالم بالذكاء الاصطناعي.',
    'worldcup.assistant.credit_note': 'تستهلك كل إجابة من المساعد رصيدا واحدا. يتم رد الرصيد تلقائيا عند فشل استدعاء الذكاء الاصطناعي.',
  },
};

for (const locale of locales) {
  const file = join(messagesDir, `${locale}.json`);
  if (!existsSync(file)) continue;
  const current = readJson(file);
  const previous = previousLocale(locale);
  const next = { ...current };

  // Restore the localized hero copy that was accidentally overwritten by the
  // last data-source commit, then apply localized compliance-safe labels.
  if (previous['landing.hero.subheadline']) {
    next['landing.hero.subheadline'] = previous['landing.hero.subheadline'];
  }
  Object.assign(next, localizedCompliance[locale]);

  writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
}

console.log(`Repaired ${locales.length} World Cup locale files.`);
