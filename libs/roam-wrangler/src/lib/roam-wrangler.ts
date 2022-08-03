import parser from 'athens-roam-parser';

interface Athens {
  parse: (text: string) => Record<string, string>;
}

export function roamWrangler(): Athens {
  return parser.athens as Athens;
}
