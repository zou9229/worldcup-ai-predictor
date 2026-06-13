import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const messagesDir = join(process.cwd(), 'messages');
const base = JSON.parse(readFileSync(join(messagesDir, 'en.json'), 'utf8'));
const criticalKeys = [
  'landing.hero.headline',
  'landing.hero.subheadline',
  'landing.hero.cta',
  'landing.pricing.title',
  'landing.pricing.description',
  'landing.faq.payment.answer',
  'worldcup.watch.index_title',
  'worldcup.watch.badge',
  'worldcup.watch.official_title',
  'worldcup.watch.official_body',
  'worldcup.match.disclaimer',
  'worldcup.match.final_score',
  'worldcup.match.model_estimate_note',
  'worldcup.data.source_title',
  'worldcup.data.source_note',
  'worldcup.data.prediction_note',
  'worldcup.assistant.title',
  'worldcup.assistant.description',
  'worldcup.assistant.sign_in_notice',
  'worldcup.assistant.credit_note',
  'worldcup.media.title',
  'worldcup.media.description',
  'worldcup.media.tactical_label',
  'worldcup.picks.title',
  'worldcup.picks.description',
  'worldcup.picks.rule',
];

const failures = [];

for (const file of readdirSync(messagesDir).filter((name) => name.endsWith('.json'))) {
  const locale = file.replace(/\.json$/, '');
  if (locale === 'en') continue;
  const data = JSON.parse(readFileSync(join(messagesDir, file), 'utf8'));

  for (const key of criticalKeys) {
    const value = base[key];
    if (typeof value !== 'string') continue;
    if (data[key] === value) {
      failures.push(`${locale}: ${key}`);
    }
    if (typeof data[key] === 'string' && /\?{3,}|rogrammatic match pages.*rogrammatic match pages/i.test(data[key])) {
      failures.push(`${locale}: ${key} contains corrupted copy`);
    }
  }
}

if (failures.length) {
  console.error('World Cup locale audit failed:');
  for (const failure of failures.slice(0, 80)) console.error(`- ${failure}`);
  if (failures.length > 80) console.error(`...and ${failures.length - 80} more`);
  process.exit(1);
}

console.log('World Cup locale audit passed.');
