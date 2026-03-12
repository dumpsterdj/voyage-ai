// ─────────────────────────────────────────────────────────────────
//  Famous world destinations shown as suggestions on the globe
//  These are NOT your personal blogs — they're inspiration points
// ─────────────────────────────────────────────────────────────────

export const worldDestinations = [
  // Asia
  { name: "Bali, Indonesia",       lat: -8.4095,   lng: 115.1889,  emoji: "🌺", tag: "Tropical Paradise",    category: "Beach"     },
  { name: "Tokyo, Japan",          lat: 35.6762,   lng: 139.6503,  emoji: "🗼", tag: "Urban Wonder",         category: "City"      },
  { name: "Kyoto, Japan",          lat: 35.0116,   lng: 135.7681,  emoji: "⛩️", tag: "Ancient Temples",      category: "Culture"   },
  { name: "Bangkok, Thailand",     lat: 13.7563,   lng: 100.5018,  emoji: "🛕", tag: "Street Food Capital",  category: "Food"      },
  { name: "Luang Prabang, Laos",   lat: 19.8845,   lng: 102.1348,  emoji: "🌿", tag: "Hidden Gem",           category: "Nature"    },
  { name: "Ha Long Bay, Vietnam",  lat: 20.9101,   lng: 107.1839,  emoji: "🚢", tag: "Limestone Karsts",     category: "Nature"    },
  { name: "Kathmandu, Nepal",      lat: 27.7172,   lng: 85.3240,   emoji: "🏔️", tag: "Gateway to Himalayas", category: "Adventure" },
  { name: "Bhutan",                lat: 27.5142,   lng: 90.4336,   emoji: "🏯", tag: "Happiness Kingdom",    category: "Culture"   },
  { name: "Maldives",              lat: 3.2028,    lng: 73.2207,   emoji: "🐠", tag: "Crystal Waters",       category: "Beach"     },
  { name: "Sri Lanka",             lat: 7.8731,    lng: 80.7718,   emoji: "🫖", tag: "Pearl of the Ocean",   category: "Nature"    },

  // Europe
  { name: "Santorini, Greece",     lat: 36.3932,   lng: 25.4615,   emoji: "🏛️", tag: "Clifftop Villages",    category: "Beach"     },
  { name: "Amalfi Coast, Italy",   lat: 40.6340,   lng: 14.6027,   emoji: "🍋", tag: "Dramatic Coastline",   category: "Beach"     },
  { name: "Paris, France",         lat: 48.8566,   lng: 2.3522,    emoji: "🗽", tag: "City of Light",        category: "City"      },
  { name: "Dubrovnik, Croatia",    lat: 42.6507,   lng: 18.0944,   emoji: "🏰", tag: "Pearl of the Adriatic",category: "Heritage"  },
  { name: "Iceland",               lat: 64.9631,   lng: -19.0208,  emoji: "🌌", tag: "Northern Lights",      category: "Adventure" },
  { name: "Swiss Alps",            lat: 46.8182,   lng: 8.2275,    emoji: "⛷️", tag: "Alpine Grandeur",      category: "Adventure" },
  { name: "Prague, Czechia",       lat: 50.0755,   lng: 14.4378,   emoji: "🏙️", tag: "City of Spires",       category: "Heritage"  },
  { name: "Lisbon, Portugal",      lat: 38.7223,   lng: -9.1393,   emoji: "🚃", tag: "Hills & Tiles",        category: "City"      },
  { name: "Cappadocia, Turkey",    lat: 38.6431,   lng: 34.8289,   emoji: "🎈", tag: "Hot Air Balloons",     category: "Adventure" },
  { name: "Tuscany, Italy",        lat: 43.7711,   lng: 11.2486,   emoji: "🍷", tag: "Rolling Vineyards",    category: "Food"      },

  // Africa
  { name: "Serengeti, Tanzania",   lat: -2.3333,   lng: 34.8333,   emoji: "🦁", tag: "Great Migration",      category: "Wildlife"  },
  { name: "Marrakech, Morocco",    lat: 31.6295,   lng: -7.9811,   emoji: "🕌", tag: "Ancient Medina",       category: "Culture"   },
  { name: "Victoria Falls, Zambia",lat: -17.9243,  lng: 25.8572,   emoji: "💧", tag: "World's Largest Falls",category: "Nature"    },
  { name: "Zanzibar, Tanzania",    lat: -6.1659,   lng: 39.2026,   emoji: "🏖️", tag: "Spice Island",         category: "Beach"     },
  { name: "Cape Town, S. Africa",  lat: -33.9249,  lng: 18.4241,   emoji: "🏔️", tag: "Mountain meets Ocean", category: "City"      },

  // Americas
  { name: "Machu Picchu, Peru",    lat: -13.1631,  lng: -72.5450,  emoji: "🏛️", tag: "Lost Inca City",       category: "Heritage"  },
  { name: "Patagonia, Argentina",  lat: -51.6230,  lng: -72.7037,  emoji: "🧊", tag: "Edge of the World",    category: "Adventure" },
  { name: "New York, USA",         lat: 40.7128,   lng: -74.0060,  emoji: "🌆", tag: "The City That Never Sleeps", category: "City" },
  { name: "Banff, Canada",         lat: 51.1784,   lng: -115.5708, emoji: "🦌", tag: "Turquoise Lakes",      category: "Nature"    },
  { name: "Amazon, Brazil",        lat: -3.4653,   lng: -62.2159,  emoji: "🌳", tag: "Lungs of the Earth",   category: "Nature"    },
  { name: "Cartagena, Colombia",   lat: 10.3910,   lng: -75.4794,  emoji: "🌸", tag: "Colonial Charm",       category: "Heritage"  },
  { name: "Galapagos Islands",     lat: -0.9538,   lng: -90.9656,  emoji: "🦎", tag: "Evolution in Action",  category: "Wildlife"  },

  // Middle East & Oceania
  { name: "Petra, Jordan",         lat: 30.3285,   lng: 35.4444,   emoji: "🪨", tag: "Rose-Red City",        category: "Heritage"  },
  { name: "Dubai, UAE",            lat: 25.2048,   lng: 55.2708,   emoji: "🏙️", tag: "Futuristic Desert",    category: "City"      },
  { name: "Great Barrier Reef",    lat: -18.2871,  lng: 147.6992,  emoji: "🐠", tag: "Coral Kingdom",        category: "Wildlife"  },
  { name: "Queenstown, NZ",        lat: -45.0312,  lng: 168.6626,  emoji: "🎿", tag: "Adventure Capital",    category: "Adventure" },
  { name: "Uluru, Australia",      lat: -25.3444,  lng: 131.0369,  emoji: "🪨", tag: "Sacred Monolith",      category: "Culture"   },
];