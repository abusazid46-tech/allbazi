// AllBazi Sportsbook & Exchange Live Fixtures & Casino Catalog

const INITIAL_DATA = {
  user: {
    username: "allbazi_pro",
    name: "VIP Member",
    accountId: "ABZ-902184",
    balance: 10000.00,
    exposure: 0.00,
    availableLimit: 10000.00,
    currency: "₹"
  },
  
  trendingEvents: [
    { id: "c1", label: "IND vs AUS • 2nd ODI (Live)" },
    { id: "c2", label: "CSK vs MI • IPL 2026" },
    { id: "s1", label: "Arsenal vs Chelsea • Premier League" },
    { id: "t1", label: "Djokovic vs Alcaraz • Wimbledon Final" },
    { id: "c3", label: "RCB vs KKR • IPL 2026" }
  ],

  matches: [
    {
      id: "c1",
      sport: "cricket",
      tournament: "ICC Champions Trophy 2026",
      teams: "India v Australia",
      team1: "India",
      team2: "Australia",
      isLive: true,
      statusDesc: "IND: 214/3 (31.2 ov) • AUS: Yet to bat",
      liveScore: {
        team1Runs: "214/3",
        team1Overs: "31.2",
        team2Runs: "Yet to bat",
        team2Overs: "Target: 50 ov",
        currentOver: ["1", "4", "0", "6", "1", "W"],
        crr: "6.83",
        batsman1: "V. Kohli 78* (64)",
        batsman2: "H. Pandya 24* (14)",
        bowler: "P. Cummins 2/42 (6.2)"
      },
      hasTv: true,
      hasBm: true,
      hasFancy: true,
      matchOdds: {
        runners: [
          { name: "India", backPrice: 1.62, backSize: "142.5K", layPrice: 1.64, laySize: "88.2K" },
          { name: "Australia", backPrice: 2.56, backSize: "75.0K", layPrice: 2.60, laySize: "51.4K" }
        ]
      },
      bookmaker: {
        minStake: 100,
        maxStake: 500000,
        runners: [
          { name: "India", backPrice: 62, layPrice: 64 },
          { name: "Australia", backPrice: 156, layPrice: 160 }
        ]
      },
      fancy: [
        { title: "35 Over IND Total Runs", noRuns: 242, noRate: 100, yesRuns: 244, yesRate: 100, min: 100, max: 250000 },
        { title: "V. Kohli Total 50 Runs", noRuns: 79, noRate: 90, yesRuns: 81, yesRate: 110, min: 100, max: 100000 },
        { title: "Fall of 4th Wicket IND", noRuns: 235, noRate: 95, yesRuns: 238, yesRate: 105, min: 100, max: 200000 },
        { title: "Australia 6 Over Runs", noRuns: 48, noRate: 90, yesRuns: 50, yesRate: 100, min: 100, max: 150000 }
      ]
    },
    {
      id: "c2",
      sport: "cricket",
      tournament: "Indian Premier League 2026",
      teams: "Chennai Super Kings v Mumbai Indians",
      team1: "Chennai Super Kings",
      team2: "Mumbai Indians",
      isLive: true,
      statusDesc: "CSK: 178/5 (18.4 ov) • MI: In-Play",
      liveScore: {
        team1Runs: "178/5",
        team1Overs: "18.4",
        team2Runs: "MI",
        team2Overs: "Starts 2nd Innings",
        currentOver: ["2", "6", "1", "4", "0", "."],
        crr: "9.53",
        batsman1: "MS Dhoni 18* (7)",
        batsman2: "R. Jadeja 32* (18)",
        bowler: "J. Bumrah 2/28 (3.4)"
      },
      hasTv: true,
      hasBm: true,
      hasFancy: true,
      matchOdds: {
        runners: [
          { name: "Chennai Super Kings", backPrice: 1.88, backSize: "320.1K", layPrice: 1.90, laySize: "195.4K" },
          { name: "Mumbai Indians", backPrice: 2.12, backSize: "210.0K", layPrice: 2.16, laySize: "145.2K" }
        ]
      },
      bookmaker: {
        minStake: 100,
        maxStake: 1000000,
        runners: [
          { name: "Chennai Super Kings", backPrice: 88, layPrice: 90 },
          { name: "Mumbai Indians", backPrice: 112, layPrice: 116 }
        ]
      },
      fancy: [
        { title: "20 Over CSK Total Runs", noRuns: 194, noRate: 100, yesRuns: 196, yesRate: 100, min: 100, max: 500000 },
        { title: "Total Match Sixes", noRuns: 16, noRate: 90, yesRuns: 17, yesRate: 110, min: 100, max: 200000 },
        { title: "MI 6 Over Powerplay Runs", noRuns: 54, noRate: 100, yesRuns: 56, yesRate: 100, min: 100, max: 250000 }
      ]
    },
    {
      id: "c3",
      sport: "cricket",
      tournament: "Indian Premier League 2026",
      teams: "Royal Challengers Bengaluru v Kolkata Knight Riders",
      team1: "RCB",
      team2: "KKR",
      isLive: false,
      statusDesc: "Today, 07:30 PM • M. Chinnaswamy Stadium",
      hasTv: true,
      hasBm: true,
      hasFancy: true,
      matchOdds: {
        runners: [
          { name: "RCB", backPrice: 1.95, backSize: "85.2K", layPrice: 1.97, laySize: "62.0K" },
          { name: "KKR", backPrice: 2.04, backSize: "91.8K", layPrice: 2.08, laySize: "55.4K" }
        ]
      },
      bookmaker: {
        minStake: 100,
        maxStake: 500000,
        runners: [
          { name: "RCB", backPrice: 95, layPrice: 97 },
          { name: "KKR", backPrice: 104, layPrice: 108 }
        ]
      },
      fancy: [
        { title: "Toss Winner - RCB", noRuns: 1, noRate: 90, yesRuns: 1, yesRate: 100, min: 100, max: 100000 },
        { title: "1st Over Runs RCB", noRuns: 8, noRate: 95, yesRuns: 9, yesRate: 105, min: 100, max: 150000 }
      ]
    },
    {
      id: "s1",
      sport: "soccer",
      tournament: "English Premier League",
      teams: "Arsenal v Chelsea",
      team1: "Arsenal",
      team2: "Chelsea",
      isLive: true,
      statusDesc: "68' 2nd Half • 2 - 1",
      hasTv: true,
      hasBm: true,
      hasFancy: false,
      matchOdds: {
        runners: [
          { name: "Arsenal", backPrice: 1.34, backSize: "185.0K", layPrice: 1.36, laySize: "92.0K" },
          { name: "Draw", backPrice: 4.80, backSize: "45.2K", layPrice: 5.10, laySize: "28.5K" },
          { name: "Chelsea", backPrice: 8.40, backSize: "32.1K", layPrice: 9.00, laySize: "18.7K" }
        ]
      }
    },
    {
      id: "s2",
      sport: "soccer",
      tournament: "UEFA Champions League",
      teams: "Real Madrid v Manchester City",
      team1: "Real Madrid",
      team2: "Manchester City",
      isLive: false,
      statusDesc: "Tomorrow, 12:30 AM • Santiago Bernabéu",
      hasTv: true,
      hasBm: true,
      hasFancy: false,
      matchOdds: {
        runners: [
          { name: "Real Madrid", backPrice: 2.40, backSize: "110.0K", layPrice: 2.45, laySize: "75.0K" },
          { name: "Draw", backPrice: 3.50, backSize: "55.0K", layPrice: 3.65, laySize: "34.0K" },
          { name: "Manchester City", backPrice: 2.90, backSize: "88.0K", layPrice: 3.00, laySize: "52.0K" }
        ]
      }
    },
    {
      id: "t1",
      sport: "tennis",
      tournament: "Wimbledon Championship Final",
      teams: "Novak Djokovic v Carlos Alcaraz",
      team1: "Novak Djokovic",
      team2: "Carlos Alcaraz",
      isLive: true,
      statusDesc: "Set 3 (1-1) • 4-4 (30-15)",
      hasTv: true,
      hasBm: true,
      hasFancy: false,
      matchOdds: {
        runners: [
          { name: "Novak Djokovic", backPrice: 1.91, backSize: "125.0K", layPrice: 1.94, laySize: "78.0K" },
          { name: "Carlos Alcaraz", backPrice: 2.02, backSize: "115.0K", layPrice: 2.06, laySize: "70.0K" }
        ]
      }
    }
  ],

  casinoGames: [
    {
      id: "cas1",
      name: "Teen Patti 20-20",
      category: "cards",
      isLive: true,
      provider: "SuperSpade",
      badge: "HOT",
      icon: "style",
      image: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "cas2",
      name: "Speed Andar Bahar",
      category: "cards",
      isLive: true,
      provider: "Evolution",
      badge: "LIVE",
      icon: "playing_cards",
      image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "cas3",
      name: "Lightning Roulette",
      category: "roulette",
      isLive: true,
      provider: "Evolution",
      badge: "500X",
      icon: "casino",
      image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "cas4",
      name: "Dragon Tiger 2",
      category: "cards",
      isLive: true,
      provider: "Ezugi",
      badge: "LIVE",
      icon: "bolt",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "cas5",
      name: "Aviator Crash 🚀",
      category: "crash",
      isLive: true,
      provider: "Spribe",
      badge: "CRASH",
      icon: "rocket_launch",
      image: "https://images.unsplash.com/photo-1517976487507-5b3b4a45091c?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "cas6",
      name: "7 Up 7 Down",
      category: "dice",
      isLive: true,
      provider: "Pragmatic",
      badge: "DICE",
      icon: "casino",
      image: "https://images.unsplash.com/photo-1570303345338-e1f0eddf4946?auto=format&fit=crop&w=400&q=80"
    }
  ],

  activeBets: [],
  
  passbookHistory: [
    {
      betId: "ABZ-948102",
      date: "2026-09-20 18:30",
      event: "India v Australia",
      market: "Match Odds - India",
      type: "BACK",
      odds: 1.62,
      stake: 1000,
      pnl: "+₹620.00",
      status: "WON"
    },
    {
      betId: "ABZ-947881",
      date: "2026-09-20 16:15",
      event: "Arsenal v Chelsea",
      market: "Match Odds - Arsenal",
      type: "BACK",
      odds: 1.45,
      stake: 500,
      pnl: "+₹225.00",
      status: "WON"
    },
    {
      betId: "ABZ-946520",
      date: "2026-09-19 20:00",
      event: "Teen Patti Live",
      market: "Player A Winner",
      type: "BACK",
      odds: 1.95,
      stake: 1000,
      pnl: "-₹1,000.00",
      status: "LOST"
    }
  ]
};

if (typeof module !== 'undefined') {
  module.exports = INITIAL_DATA;
}
