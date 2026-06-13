export type BroadcasterLink = {
  name: string;
  url: string;
  note: string;
};

export type BroadcasterRegion = {
  region: string;
  note: string;
  links: BroadcasterLink[];
};

export const WORLD_CUP_BROADCASTER_GUIDES: BroadcasterRegion[] = [
  {
    region: 'United States',
    note: 'Check English and Spanish-language rightsholders before kickoff.',
    links: [
      {
        name: 'FOX Sports',
        url: 'https://www.foxsports.com/soccer/2026-fifa-world-cup',
        note: 'English-language match coverage and TV/app listings.',
      },
      {
        name: 'Telemundo Deportes',
        url: 'https://www.telemundo.com/deportes/copa-mundial-fifa-2026',
        note: 'Spanish-language coverage and streaming notes.',
      },
    ],
  },
  {
    region: 'Canada',
    note: 'Verify English and French coverage by match.',
    links: [
      {
        name: 'TSN',
        url: 'https://www.tsn.ca/soccer',
        note: 'English-language sports coverage and schedules.',
      },
      {
        name: 'CTV',
        url: 'https://www.ctv.ca/sports',
        note: 'Canadian broadcast and streaming listings.',
      },
      {
        name: 'RDS',
        url: 'https://www.rds.ca/soccer',
        note: 'French-language sports coverage.',
      },
    ],
  },
  {
    region: 'United Kingdom',
    note: 'Check match-by-match allocation on public broadcaster schedules.',
    links: [
      {
        name: 'BBC Sport',
        url: 'https://www.bbc.com/sport/football',
        note: 'BBC football coverage and iPlayer listings.',
      },
      {
        name: 'ITV',
        url: 'https://www.itv.com/football',
        note: 'ITV football coverage and ITVX listings.',
      },
    ],
  },
  {
    region: 'Brazil',
    note: 'Check TV and streaming schedules in Portuguese before each match.',
    links: [
      {
        name: 'Globo',
        url: 'https://ge.globo.com/futebol/',
        note: 'Brazil football coverage and broadcaster updates.',
      },
      {
        name: 'Globoplay',
        url: 'https://globoplay.globo.com/',
        note: 'Streaming availability varies by rights and package.',
      },
    ],
  },
  {
    region: 'Mexico',
    note: 'Check local TV and app listings close to kickoff.',
    links: [
      {
        name: 'TUDN',
        url: 'https://www.tudn.com/futbol',
        note: 'Spanish-language football coverage and listings.',
      },
      {
        name: 'TV Azteca Deportes',
        url: 'https://www.tvazteca.com/aztecadeportes/',
        note: 'Mexican sports broadcast updates.',
      },
    ],
  },
  {
    region: 'Global reference',
    note: 'If your country is not listed, start from FIFA and your local rights holder.',
    links: [
      {
        name: 'FIFA fixtures',
        url: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures',
        note: 'Official tournament fixture reference.',
      },
    ],
  },
];
