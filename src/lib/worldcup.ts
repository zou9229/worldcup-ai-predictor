import { envConfigs } from '@/config';
import { worldCupMatches, type WorldCupMatchSeed } from '@/data/worldcup-matches';

export interface PredictionResult {
  homeWin: number;
  draw: number;
  awayWin: number;
  predictedScore: string;
  confidence: 'Low' | 'Medium' | 'High';
  angle: string;
  keyBattle: string;
  totalGoalsLean: string;
}

const TEAM_RATINGS: Record<string, number> = {
  Argentina: 2105,
  France: 2090,
  Spain: 2060,
  Brazil: 2055,
  England: 2045,
  Portugal: 2025,
  Netherlands: 1985,
  Germany: 1970,
  Italy: 1965,
  Belgium: 1930,
  Croatia: 1905,
  Uruguay: 1895,
  Colombia: 1885,
  Morocco: 1875,
  USA: 1840,
  Mexico: 1835,
  Switzerland: 1825,
  Denmark: 1815,
  Japan: 1810,
  Senegal: 1800,
  'South Korea': 1785,
  Canada: 1765,
  Australia: 1750,
  Scotland: 1748,
  Norway: 1745,
  Austria: 1740,
  Ecuador: 1735,
  Paraguay: 1725,
  Turkey: 1720,
  Serbia: 1710,
  'Czech Republic': 1705,
  Nigeria: 1700,
  Ghana: 1685,
  Tunisia: 1680,
  Algeria: 1675,
  Egypt: 1670,
  'South Africa': 1665,
  Qatar: 1660,
  Iran: 1655,
  Sweden: 1650,
  'Saudi Arabia': 1645,
  'Bosnia & Herzegovina': 1640,
  Uzbekistan: 1635,
  'Ivory Coast': 1632,
  Iraq: 1628,
  Jamaica: 1625,
  Jordan: 1620,
  Panama: 1610,
  'Cape Verde': 1608,
  'DR Congo': 1605,
  Haiti: 1600,
  'Curaçao': 1598,
  'New Zealand': 1595,
};

const TEAM_FLAGS: Record<string, string> = {
  Argentina: 'ARG',
  France: 'FRA',
  Spain: 'ESP',
  Brazil: 'BRA',
  England: 'ENG',
  Portugal: 'POR',
  Netherlands: 'NED',
  Germany: 'GER',
  Italy: 'ITA',
  Belgium: 'BEL',
  Croatia: 'CRO',
  Uruguay: 'URU',
  Colombia: 'COL',
  Morocco: 'MAR',
  USA: 'USA',
  Mexico: 'MEX',
  Switzerland: 'SUI',
  Denmark: 'DEN',
  Japan: 'JPN',
  Senegal: 'SEN',
  'South Korea': 'KOR',
  Canada: 'CAN',
  Australia: 'AUS',
  Scotland: 'SCO',
  Norway: 'NOR',
  Austria: 'AUT',
  Ecuador: 'ECU',
  Paraguay: 'PAR',
  Turkey: 'TUR',
  Serbia: 'SRB',
  'Czech Republic': 'CZE',
  Nigeria: 'NGA',
  Ghana: 'GHA',
  Tunisia: 'TUN',
  Algeria: 'ALG',
  Egypt: 'EGY',
  'South Africa': 'RSA',
  Qatar: 'QAT',
  Iran: 'IRN',
  Sweden: 'SWE',
  'Saudi Arabia': 'KSA',
  'Bosnia & Herzegovina': 'BIH',
  Uzbekistan: 'UZB',
  'Ivory Coast': 'CIV',
  Iraq: 'IRQ',
  Jamaica: 'JAM',
  Jordan: 'JOR',
  Panama: 'PAN',
  'Cape Verde': 'CPV',
  'DR Congo': 'COD',
  Haiti: 'HAI',
  'Curaçao': 'CUW',
  'New Zealand': 'NZL',
};

const TEAM_FLAG_CODES: Record<string, string> = {
  Argentina: 'ar',
  France: 'fr',
  Spain: 'es',
  Brazil: 'br',
  England: 'gb-eng',
  Portugal: 'pt',
  Netherlands: 'nl',
  Germany: 'de',
  Italy: 'it',
  Belgium: 'be',
  Croatia: 'hr',
  Uruguay: 'uy',
  Colombia: 'co',
  Morocco: 'ma',
  USA: 'us',
  Mexico: 'mx',
  Switzerland: 'ch',
  Denmark: 'dk',
  Japan: 'jp',
  Senegal: 'sn',
  'South Korea': 'kr',
  Canada: 'ca',
  Australia: 'au',
  Scotland: 'gb-sct',
  Norway: 'no',
  Austria: 'at',
  Ecuador: 'ec',
  Paraguay: 'py',
  Turkey: 'tr',
  Serbia: 'rs',
  'Czech Republic': 'cz',
  Nigeria: 'ng',
  Ghana: 'gh',
  Tunisia: 'tn',
  Algeria: 'dz',
  Egypt: 'eg',
  'South Africa': 'za',
  Qatar: 'qa',
  Iran: 'ir',
  Sweden: 'se',
  'Saudi Arabia': 'sa',
  'Bosnia & Herzegovina': 'ba',
  Uzbekistan: 'uz',
  'Ivory Coast': 'ci',
  Iraq: 'iq',
  Jamaica: 'jm',
  Jordan: 'jo',
  Panama: 'pa',
  'Cape Verde': 'cv',
  'DR Congo': 'cd',
  Haiti: 'ht',
  'Curaçao': 'cw',
  'New Zealand': 'nz',
};

const HOST_HINTS: Record<string, string> = {
  Atlanta: 'Mercedes-Benz Stadium, Atlanta',
  Boston: 'Gillette Stadium area, Foxborough',
  Dallas: 'AT&T Stadium area, Arlington',
  Guadalajara: 'Estadio Akron, Zapopan',
  'Kansas City': 'Arrowhead Stadium area, Kansas City',
  'Los Angeles': 'SoFi Stadium area, Inglewood',
  Miami: 'Hard Rock Stadium area, Miami Gardens',
  Monterrey: 'Estadio BBVA, Guadalupe',
  'Mexico City': 'Estadio Azteca, Mexico City',
  'New York/New Jersey': 'MetLife Stadium area, East Rutherford',
  Philadelphia: 'Lincoln Financial Field, Philadelphia',
  Toronto: 'BMO Field, Toronto',
  Vancouver: 'BC Place, Vancouver',
  Seattle: 'Lumen Field, Seattle',
  Houston: 'NRG Stadium, Houston',
  'San Francisco Bay Area': "Levi's Stadium, Santa Clara",
};

export type WorldCupMatch = WorldCupMatchSeed & {
  slug: string;
  watchSlug: string;
  prediction: PredictionResult;
};

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function ratingFor(team: string) {
  if (/^[WL]\d+$/.test(team)) return 1780;
  return TEAM_RATINGS[team] ?? 1700;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundPercent(value: number) {
  return Math.round(value * 10) / 10;
}

export function getMatchSlug(match: Pick<WorldCupMatchSeed, 'teamA' | 'teamB'>) {
  return `${slugify(match.teamA)}-vs-${slugify(match.teamB)}-ai-prediction`;
}

export function getWatchSlug(match: Pick<WorldCupMatchSeed, 'teamA' | 'teamB'>) {
  return `how-to-watch-${slugify(match.teamA)}-vs-${slugify(match.teamB)}-official-viewing-guide`;
}

export function getLegacyWatchSlug(match: Pick<WorldCupMatchSeed, 'teamA' | 'teamB'>) {
  return `how-to-watch-${slugify(match.teamA)}-vs-${slugify(match.teamB)}-live-stream-free`;
}

export function predictMatch(match: WorldCupMatchSeed): PredictionResult {
  const ratingA = ratingFor(match.teamA);
  const ratingB = ratingFor(match.teamB);
  const expectedA = 1 / (1 + Math.pow(10, (ratingB - ratingA) / 420));
  const ratingGap = Math.abs(ratingA - ratingB);
  const draw = clamp(28 - ratingGap / 28, 16, 30);
  const decisive = 100 - draw;
  const homeWin = clamp(expectedA * decisive + 2.5, 8, 78);
  const awayWin = clamp(100 - draw - homeWin, 8, 78);
  const normalizedTotal = homeWin + draw + awayWin;
  const home = roundPercent((homeWin / normalizedTotal) * 100);
  const drawPct = roundPercent((draw / normalizedTotal) * 100);
  const away = roundPercent(100 - home - drawPct);
  const goalEdge = (ratingA - ratingB) / 240;
  const goalsA = clamp(1.35 + goalEdge, 0.4, 3.1);
  const goalsB = clamp(1.1 - goalEdge, 0.3, 2.7);
  const predictedScore = `${Math.round(goalsA)}-${Math.round(goalsB)}`;
  const confidence = ratingGap > 170 ? 'High' : ratingGap > 70 ? 'Medium' : 'Low';

  return {
    homeWin: home,
    draw: drawPct,
    awayWin: away,
    predictedScore,
    confidence,
    angle:
      ratingGap < 65
        ? 'The model sees this as a narrow-margin match where set pieces and first-goal timing matter more than raw squad strength.'
        : `${ratingA >= ratingB ? match.teamA : match.teamB} carries the stronger baseline profile, but tournament variance still keeps the underdog live.`,
    keyBattle: `The decisive zone is likely the first 25 minutes: if ${match.teamA} can control territory early, the probability curve tilts toward a lower-chaos game; if ${match.teamB} breaks pressure, transitions become the swing factor.`,
    totalGoalsLean: Math.round(goalsA + goalsB) >= 3 ? 'Over 2.5 goals lean' : 'Under 3.5 goals lean',
  };
}

export function buildWorldCupMatches(matches: WorldCupMatchSeed[]): WorldCupMatch[] {
  return matches.map((match) => ({
    ...match,
    slug: getMatchSlug(match),
    watchSlug: getWatchSlug(match),
    prediction: predictMatch(match),
  }));
}

export function getWorldCupMatches(): WorldCupMatch[] {
  return buildWorldCupMatches(worldCupMatches);
}

export function getMatchBySlug(slug: string) {
  return getWorldCupMatches().find((match) => match.slug === slug);
}

export function getMatchByWatchSlug(slug: string) {
  return getWorldCupMatches().find(
    (match) => match.watchSlug === slug || getLegacyWatchSlug(match) === slug
  );
}

export function getMatchKickoffDate(match: Pick<WorldCupMatchSeed, 'date' | 'time'>) {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(match.date);
  const timeMatch = /^(\d{1,2}):(\d{2})\s+UTC([+-]\d{1,2})$/.exec(match.time);
  if (!dateMatch || !timeMatch) return null;

  const [, year, month, day] = dateMatch;
  const [, hour, minute, offset] = timeMatch;
  const offsetHours = Number(offset);
  const utcHour = Number(hour) - offsetHours;

  return new Date(
    Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      utcHour,
      Number(minute),
      0
    )
  );
}

export function isFeaturedMatchCandidate(
  match: Pick<WorldCupMatchSeed, 'date' | 'time' | 'score'>,
  now = new Date()
) {
  if (match.score?.ft) return false;

  const kickoff = getMatchKickoffDate(match);
  if (!kickoff) return true;

  return kickoff.getTime() > now.getTime();
}

export function compareMatchesByKickoff(
  a: Pick<WorldCupMatchSeed, 'date' | 'time' | 'id'>,
  b: Pick<WorldCupMatchSeed, 'date' | 'time' | 'id'>
) {
  const kickoffA = getMatchKickoffDate(a)?.getTime() ?? Number.MAX_SAFE_INTEGER;
  const kickoffB = getMatchKickoffDate(b)?.getTime() ?? Number.MAX_SAFE_INTEGER;
  if (kickoffA !== kickoffB) return kickoffA - kickoffB;
  return a.id.localeCompare(b.id);
}

export function getFeaturedMatches(limit = 8) {
  return getWorldCupMatches()
    .filter((match) => isFeaturedMatchCandidate(match))
    .sort(compareMatchesByKickoff)
    .slice(0, limit);
}

export function getFinalScore(match: Pick<WorldCupMatchSeed, 'score'>) {
  return match.score?.ft ? `${match.score.ft[0]}-${match.score.ft[1]}` : null;
}

export function getDisplayScore(match: WorldCupMatch) {
  return getFinalScore(match) ?? match.prediction.predictedScore;
}

export function getMatchTitle(match: WorldCupMatch) {
  return `${match.teamA} vs ${match.teamB} AI Prediction, Score Simulator & Viewing Guide`;
}

export function getMatchDescription(match: WorldCupMatch) {
  if (match.score?.ft) {
    return `Review ${match.teamA} vs ${match.teamB} for World Cup 2026, including the recorded full-time score, model probability view, tactical notes, and official viewing guidance.`;
  }
  return `Get the AI-powered ${match.teamA} vs ${match.teamB} prediction for World Cup 2026, including win probability, predicted score, tactical notes, and official viewing guidance.`;
}

export function getWatchTitle(match: WorldCupMatch) {
  return `How to Watch ${match.teamA} vs ${match.teamB}: Official Viewing Guide`;
}

export function getWatchDescription(match: WorldCupMatch) {
  return `Find official ways to watch ${match.teamA} vs ${match.teamB}, match time, venue, travel notes, and an AI prediction before kickoff.`;
}

export function getTeamFlag(team: string) {
  return TEAM_FLAGS[team] ?? 'WC';
}

export function getTeamFlagImageUrl(team: string) {
  if (/^[WL]\d+$/.test(team) || /^\d/.test(team)) return null;
  const code = TEAM_FLAG_CODES[team];
  return code ? `https://flagcdn.com/${code}.svg` : null;
}

export function getVenueLabel(ground: string) {
  const key = Object.keys(HOST_HINTS).find((city) => ground.includes(city));
  return key ? HOST_HINTS[key] : ground;
}

export function getCanonicalUrl(path: string) {
  const base = envConfigs.app_url.replace(/\/+$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getVpnAffiliateUrl() {
  return (
    envConfigs.vpn_affiliate_url ||
    'https://go.nordvpn.net/aff_c?offer_id=15&aff_id=150474'
  );
}

export function buildSimulationPrompt(match: WorldCupMatch, scenario: string) {
  const prediction = match.prediction;
  return [
    'You are a cautious football analytics assistant for a World Cup fan site.',
    'Write useful analysis, but do not claim certainty and do not present this as betting advice.',
    'Use concise, concrete soccer language.',
    '',
    `Match: ${match.teamA} vs ${match.teamB}`,
    `Round: ${match.round}${match.group ? `, ${match.group}` : ''}`,
    `Date/time: ${match.date} ${match.time}`,
    `Venue: ${match.ground}`,
    `Baseline probabilities: ${match.teamA} ${prediction.homeWin}%, Draw ${prediction.draw}%, ${match.teamB} ${prediction.awayWin}%`,
    `Baseline predicted score: ${prediction.predictedScore}`,
    `User scenario: ${scenario}`,
    '',
    'Return a compact markdown report with:',
    '1. Updated probability view',
    '2. Updated score range',
    '3. Tactical explanation',
    '4. One practical caveat',
  ].join('\n');
}

export interface WorldCupAssistantTurn {
  role: 'user' | 'assistant';
  content: string;
}

export function buildWorldCupAssistantPrompt({
  message,
  history,
  matches = getWorldCupMatches(),
}: {
  message: string;
  history: WorldCupAssistantTurn[];
  matches?: WorldCupMatch[];
}) {
  const featured = matches
    .filter((match) => isFeaturedMatchCandidate(match))
    .sort(compareMatchesByKickoff)
    .slice(0, 10);
  const fixtureLines = featured.map((match) => {
    const prediction = match.prediction;
    return `- ${match.teamA} vs ${match.teamB}, ${match.date} ${match.time}, ${match.round}${match.group ? ` ${match.group}` : ''}, baseline ${match.teamA} ${prediction.homeWin}% / draw ${prediction.draw}% / ${match.teamB} ${prediction.awayWin}%, score ${prediction.predictedScore}`;
  });
  const historyLines = history.slice(-8).map((turn) => `${turn.role}: ${turn.content}`);

  return [
    'You are the floating AI assistant for WorldCupAI Predictor.',
    'Answer as a careful football analyst. Keep answers practical, concise, and useful for fans.',
    'Do not claim certainty. Do not present anything as betting advice. Do not recommend illegal streams.',
    'If the user asks for live scores, injuries, lineups, odds, or breaking news, explain that the site only has the fixture snapshot unless the user provides fresh facts.',
    'Prefer the user language. If the user writes Chinese, answer Chinese.',
    '',
    `Current server date: ${new Date().toISOString()}`,
    `Fixture snapshot loaded: ${matches.length} World Cup 2026 fixtures.`,
    '',
    'Upcoming fixture context:',
    ...fixtureLines,
    '',
    historyLines.length ? 'Recent conversation:' : '',
    ...historyLines,
    '',
    `User question: ${message}`,
    '',
    'Return markdown with short paragraphs or bullets. Keep it under 220 words unless the user asks for detail.',
  ].join('\n');
}
