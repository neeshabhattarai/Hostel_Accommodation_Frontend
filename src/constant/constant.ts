export const CURRENCY_SYMBOLS: Record<string, string> = {
    usd: "$",
    eur: "€",
    gbp: "£",
    jpy: "¥",
    aud: "A$",
    cad: "C$",
    chf: "CHF",
    inr: "₹",
    nzd: "NZ$",
    sgd: "S$",
    hkd: "HK$",
    sek: "kr",
  };
  
  export const ZERO_DECIMAL_CURRENCIES = new Set([
    "jpy",
    "krw",
    "vnd",
    "bif",
    "clp",
    "gnf",
    "mga",
    "pyg",
    "rwf",
    "ugx",
    "xaf",
    "xof",
  ]);