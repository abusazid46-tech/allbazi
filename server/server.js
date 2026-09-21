const express = require('express');
const cors = require('cors');
const path = require('path');
const initialData = require('../public/js/data.js');

const app = express();
const PORT = process.env.PORT || 3030;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// In-Memory Database / State
let db = {
  user: { ...initialData.user },
  matches: JSON.parse(JSON.stringify(initialData.matches)),
  activeBets: [...initialData.activeBets],
  passbook: [...initialData.passbookHistory]
};

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// Get All Matches
app.get('/api/matches', (req, res) => {
  const { sport, inplay } = req.query;
  let result = db.matches;
  if (sport) result = result.filter(m => m.sport === sport);
  if (inplay === 'true') result = result.filter(m => m.isLive);
  res.json({ success: true, count: result.length, data: result });
});

// Get Match by ID
app.get('/api/matches/:id', (req, res) => {
  const match = db.matches.find(m => m.id === req.params.id);
  if (!match) return res.status(404).json({ success: false, error: 'Match not found' });
  res.json({ success: true, data: match });
});

// Get User Wallet State
app.get('/api/user/wallet', (req, res) => {
  res.json({ success: true, data: db.user });
});

// Place Bet
app.post('/api/bets/place', (req, res) => {
  const { matchId, runnerName, type, odds, stake, market } = req.body;

  if (!runnerName || !odds || !stake || stake <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid bet parameters' });
  }

  const liability = type === 'BACK' ? stake : stake * (odds - 1);
  if (db.user.balance < liability) {
    return res.status(400).json({ success: false, error: 'Insufficient balance' });
  }

  // Deduct balance and update exposure
  db.user.balance -= liability;
  db.user.exposure += liability;

  const match = db.matches.find(m => m.id === matchId);
  const betRecord = {
    betId: `ABZ-${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    event: match ? match.teams : 'Live Event',
    market: `${market || 'Match Odds'} - ${runnerName}`,
    type: type || 'BACK',
    odds: parseFloat(odds),
    stake: parseFloat(stake),
    liability,
    pnl: 'OPEN',
    status: 'PENDING'
  };

  db.activeBets.unshift(betRecord);
  db.passbook.unshift(betRecord);

  res.json({
    success: true,
    message: 'Bet placed successfully',
    data: betRecord,
    wallet: db.user
  });
});

// Get Active Bets
app.get('/api/bets/active', (req, res) => {
  res.json({ success: true, count: db.activeBets.length, data: db.activeBets });
});

// Get Passbook Statement
app.get('/api/bets/history', (req, res) => {
  res.json({ success: true, count: db.passbook.length, data: db.passbook });
});

// Deposit Funds
app.post('/api/wallet/deposit', (req, res) => {
  const { amount } = req.body;
  const amt = parseFloat(amount);
  if (!amt || amt <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid deposit amount' });
  }

  db.user.balance += amt;
  res.json({
    success: true,
    message: `Deposited ₹${amt.toLocaleString()} successfully`,
    wallet: db.user
  });
});

// Withdraw Funds
app.post('/api/wallet/withdraw', (req, res) => {
  const { amount, account } = req.body;
  const amt = parseFloat(amount);

  if (!amt || amt <= 0 || amt > db.user.balance) {
    return res.status(400).json({ success: false, error: 'Insufficient balance or invalid amount' });
  }
  if (!account) {
    return res.status(400).json({ success: false, error: 'Account/UPI details required' });
  }

  db.user.balance -= amt;
  res.json({
    success: true,
    message: `Withdrawal request of ₹${amt.toLocaleString()} processed`,
    wallet: db.user
  });
});

// Live Casino Games Catalog
app.get('/api/casino/games', (req, res) => {
  res.json({ success: true, data: initialData.casinoGames });
});

// Real-Time Server-Sent Events (SSE) for Odds Ticker
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const intervalId = setInterval(() => {
    // Generate random micro-fluctuation in live match odds
    const updates = db.matches.filter(m => m.isLive).map(m => {
      const runner = m.matchOdds.runners[Math.floor(Math.random() * m.matchOdds.runners.length)];
      const delta = (Math.random() - 0.5) * 0.04;
      runner.backPrice = Math.max(1.05, parseFloat((runner.backPrice + delta).toFixed(2)));
      runner.layPrice = parseFloat((runner.backPrice + 0.02).toFixed(2));
      return {
        matchId: m.id,
        runnerName: runner.name,
        backPrice: runner.backPrice,
        layPrice: runner.layPrice
      };
    });

    res.write(`data: ${JSON.stringify({ type: 'ODDS_UPDATE', updates })}\n\n`);
  }, 3000);

  req.on('close', () => clearInterval(intervalId));
});

// Single Page Application Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 AllBazi Sportsbook & Exchange Platform Running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`⚡ Brand: AllBazi | All Original ID panels`);
  console.log(`====================================================`);
});
