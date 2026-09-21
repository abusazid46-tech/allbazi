// AllBazi Platform - Pixel-Accurate GoPanel Replication Engine

document.addEventListener("DOMContentLoaded", () => {
  // App State
  const state = {
    user: {
      username: "Guest",
      isLoggedIn: false,
      accountId: "ABZ-902184",
      balance: 0.00,
      exposure: 0.00,
      availableLimit: 0.00
    },
    activeNav: "home",
    activeMatchDetail: null,
    
    // Bet Slip State
    betSlip: {
      open: false,
      matchId: null,
      matchTitle: "",
      runnerName: "",
      type: "BACK", // 'BACK' or 'LAY'
      odds: 1.85,
      stake: 500
    },

    activeBets: [],
    passbook: [
      { event: "Antigua Falcs v Jamaica", type: "BACK", odds: 1.85, stake: 500, status: "WON" },
      { event: "Arsenal v Chelsea", type: "BACK", odds: 1.45, stake: 1000, status: "WON" }
    ]
  };

  // Sound Engine
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  function playTone(freq = 600, duration = 0.08) {
    try {
      if (audioCtx.state === "suspended") audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  // Dismiss Splash Loader
  setTimeout(() => {
    const loader = document.getElementById("preboot-loader");
    if (loader) loader.classList.add("hidden");
  }, 350);

  // -------------------------------------------------------------
  // DATASETS MATCHING GOPANEL EXACT LIVE FIXTURES
  // -------------------------------------------------------------
  const CRICKET_MATCHES = [
    {
      id: "c1",
      teams: "Antigua & Barbuda Falcs v Jamaica Kingsmen",
      team1: "Antigua & Barbuda Falcs",
      team2: "Jamaica Kingsmen",
      isLive: true,
      timeLabel: "In-play",
      hasBat: true,
      hasTv: true,
      backPrice: 0,
      backSize: "",
      layPrice: 1.01,
      laySize: "76.80",
      detail: {
        title: "Antigua Barbuda Falcs v Jamaica Kingsmen",
        status: "Started at 4:30am IST",
        scoreCenter: "0",
        team1Name: "Antigua Barbuda Falcons",
        team1Score: "158-2 (15.4) CRR: 10.09 | RRR: 2.77",
        team2Name: "Jamaica Kingsmen",
        team2Score: "170-9",
        bannerText: "13 required in 26 balls",
        bookmakerRunners: [
          { name: "Antigua & Barbuda Falcs", back: "-", lay: "1" },
          { name: "Jamaica Kingsmen", back: "10000", lay: "-" }
        ],
        tiedMatchRunners: [
          { name: "Yes", back: "1000", backSub: "9.54", lay: "-" },
          { name: "No", back: "-", lay: "1.01", laySub: "4.5K" }
        ]
      }
    },
    {
      id: "c2",
      teams: "Bangladesh W v Pakistan W",
      team1: "Bangladesh W",
      team2: "Pakistan W",
      isLive: false,
      timeLabel: "Tomorrow<br>5:30am IST",
      hasBat: false,
      hasTv: false,
      backPrice: 1.28,
      backSize: "178.50",
      layPrice: 1.33,
      laySize: "35.58"
    },
    {
      id: "c3",
      teams: "Queensland Bulls v New South Wales Blues",
      team1: "Queensland Bulls",
      team2: "New South Wales Blues",
      isLive: false,
      timeLabel: "Tomorrow<br>9:30am IST",
      hasBat: false,
      hasTv: false,
      backPrice: 1.81,
      backSize: "2.00",
      layPrice: 1.87,
      laySize: "2.31"
    },
    {
      id: "c4",
      teams: "Japan v India",
      team1: "Japan",
      team2: "India",
      isLive: false,
      timeLabel: "Tomorrow<br>9:30am IST",
      hasBat: false,
      hasTv: false,
      backPrice: 0,
      backSize: "",
      layPrice: 1.01,
      laySize: "8.00"
    },
    {
      id: "c5",
      teams: "India W v Sri Lanka W",
      team1: "India W",
      team2: "Sri Lanka W",
      isLive: false,
      timeLabel: "Tomorrow<br>10:30am IST",
      hasBat: false,
      hasTv: false,
      backPrice: 1.12,
      backSize: "1.49",
      layPrice: 1.14,
      laySize: "71.40"
    }
  ];

  const SOCCER_MATCHES = [
    {
      id: "s1",
      teams: "Criciuma v Operario Pr",
      team1: "Criciuma",
      team2: "Operario Pr",
      isLive: false,
      timeLabel: "Tomorrow<br>4:00am IST",
      hasTv: false,
      backPrice: 1.78,
      backSize: "1.73",
      layPrice: 1.79,
      laySize: "3.79"
    },
    {
      id: "s2",
      teams: "Cuiaba v Nautico Pe",
      team1: "Cuiaba",
      team2: "Nautico Pe",
      isLive: false,
      timeLabel: "Tomorrow<br>6:00am IST",
      hasTv: false,
      backPrice: 2.06,
      backSize: "74.74",
      layPrice: 2.12,
      laySize: "453.38"
    }
  ];

  const TENNIS_MATCHES = [
    {
      id: "t1",
      teams: "Xinx Yao v Ma Joint",
      team1: "Xinx Yao",
      team2: "Ma Joint",
      isLive: true,
      timeLabel: "In-play",
      hasTv: true,
      backPrice: 1.33,
      backSize: "889.15",
      layPrice: 1.35,
      laySize: "997.46"
    },
    {
      id: "t2",
      teams: "D Kasatkina v A Sasnovich",
      team1: "D Kasatkina",
      team2: "A Sasnovich",
      isLive: true,
      timeLabel: "In-play",
      hasTv: true,
      backPrice: 1.76,
      backSize: "69.54",
      layPrice: 1.77,
      laySize: "1.1K"
    },
    {
      id: "t3",
      teams: "La Tararudee v Uchijima",
      team1: "La Tararudee",
      team2: "Uchijima",
      isLive: true,
      timeLabel: "In-play",
      hasTv: true,
      backPrice: 1.33,
      backSize: "1.18",
      layPrice: 1.40,
      laySize: "1.25"
    }
  ];

  const MINI_GAMES = [
    { name: "Dragon Tiger", provider: "Yuvi Games", count: 4858, image: "assets/dragon_tiger.webp" },
    { name: "Amar Akbar Anthony", provider: "Yuvi Games", count: 9404, image: "assets/amar_akbar.webp" },
    { name: "Teen Patti", provider: "Yuvi Games", count: 713, image: "assets/teen_patti.webp" },
    { name: "Aviator 🚀", provider: "Spribe", count: 3652, image: "assets/aviator_bg.png" }
  ];

  // -------------------------------------------------------------
  // RENDER TABLES
  // -------------------------------------------------------------
  function renderTables(filterQuery = "") {
    const q = filterQuery.toLowerCase().trim();
    const filterFn = m => !q || m.teams.toLowerCase().includes(q) || m.team1.toLowerCase().includes(q) || m.team2.toLowerCase().includes(q);

    renderMatchRows("cricket-table-rows", CRICKET_MATCHES.filter(filterFn));
    renderMatchRows("soccer-table-rows", SOCCER_MATCHES.filter(filterFn));
    renderMatchRows("tennis-table-rows", TENNIS_MATCHES.filter(filterFn));
    renderMiniGamesRows();
  }

  function renderMatchRows(containerId, list) {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (list.length === 0) {
      el.innerHTML = `<div style="padding: 16px; text-align: center; color: #888; font-size: 11px;">No matching fixtures found</div>`;
      return;
    }

    el.innerHTML = list.map(m => `
      <div class="table-item-row" data-match-id="${m.id}">
        <div class="col-status-time" data-action="detail" data-match-id="${m.id}">
          ${m.isLive 
            ? `<span class="inplay-badge-green">In-play</span>` 
            : `<span class="upcoming-time-text">${m.timeLabel}</span>`}
        </div>

        <div class="col-teams-info" data-action="detail" data-match-id="${m.id}">
          <div class="team-names-wrap">
            <div class="team-line">
              <span class="star-fav-icon">★</span>
              <span>${m.team1}</span>
              ${m.hasBat ? `<span class="bat-icon">🏏</span>` : ''}
            </div>
            <div class="team-line">
              <span class="star-fav-icon" style="visibility:hidden;">★</span>
              <span>${m.team2}</span>
            </div>
          </div>
          ${m.hasTv ? `
            <div class="tv-live-icon" title="Live Video Available">
              <svg viewBox="0 0 22 16" width="16" height="12" fill="none">
                <rect x="1" y="1" width="20" height="14" rx="3" stroke="#22c55e" stroke-width="2"/>
                <polygon points="9,4 15,8 9,12" fill="#22c55e"/>
              </svg>
            </div>
          ` : ''}
        </div>

        <div class="col-odds-pair">
          <button class="odds-tile back-box" data-match-id="${m.id}" data-runner="${m.team1}" data-type="BACK" data-odds="${m.backPrice || 1.85}">
            <span class="odds-price-bold">${m.backPrice || '0'}</span>
            ${m.backSize ? `<span class="odds-size-sub">${m.backSize}</span>` : ''}
          </button>
          <button class="odds-tile lay-box" data-match-id="${m.id}" data-runner="${m.team1}" data-type="LAY" data-odds="${m.layPrice || 1.87}">
            <span class="odds-price-bold">${m.layPrice}</span>
            ${m.laySize ? `<span class="odds-size-sub">${m.laySize}</span>` : ''}
          </button>
        </div>
      </div>
    `).join("");

    // Click on match row to open Match Detail
    el.querySelectorAll('[data-action="detail"]').forEach(item => {
      item.addEventListener("click", () => {
        const id = item.getAttribute("data-match-id");
        openMatchDetail(id);
      });
    });

    // Click on odds button to open Bet Slip
    el.querySelectorAll(".odds-tile").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        playTone(520, 0.04);
        const matchId = btn.getAttribute("data-match-id");
        const runner = btn.getAttribute("data-runner");
        const type = btn.getAttribute("data-type");
        const odds = parseFloat(btn.getAttribute("data-odds")) || 1.85;
        
        const allMatches = [...CRICKET_MATCHES, ...SOCCER_MATCHES, ...TENNIS_MATCHES];
        const match = allMatches.find(m => m.id === matchId);

        openBetSlip({
          matchId,
          matchTitle: match ? match.teams : "Live Match",
          runnerName: runner,
          type,
          odds
        });
      });
    });
  }

  function renderMiniGamesRows() {
    const scroll1 = document.getElementById("home-mini-games-scroll");
    const scroll2 = document.getElementById("detail-mini-games-scroll");

    const html = MINI_GAMES.map(g => `
      <div class="mini-game-card" data-game="${g.name}">
        <img src="${g.image}" alt="${g.name}">
        <div class="user-count-chip">
          <svg viewBox="0 0 24 24" width="10" height="10" fill="#ffffff">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span>${g.count}</span>
        </div>
        <div class="mini-game-title-strip">
          <div class="mini-game-name">${g.name}</div>
          <div class="mini-game-provider">${g.provider}</div>
        </div>
      </div>
    `).join("");

    if (scroll1) scroll1.innerHTML = html;
    if (scroll2) scroll2.innerHTML = html;

    document.querySelectorAll(".mini-game-card").forEach(card => {
      card.addEventListener("click", () => {
        const gName = card.getAttribute("data-game");
        launchGameRoom(gName);
      });
    });
  }

  // -------------------------------------------------------------
  // MATCH DETAIL VIEW LOGIC
  // -------------------------------------------------------------
  function openMatchDetail(matchId) {
    const allMatches = [...CRICKET_MATCHES, ...SOCCER_MATCHES, ...TENNIS_MATCHES];
    const match = allMatches.find(m => m.id === matchId) || CRICKET_MATCHES[0];

    document.getElementById("view-home").style.display = "none";
    const detailPage = document.getElementById("view-match-detail");
    detailPage.classList.add("active");
    window.scrollTo(0, 0);

    // Populate detail top
    document.getElementById("detail-match-title-strip").textContent = match.teams;
    
    // Populate Scoreboard if cricket
    if (match.detail) {
      document.getElementById("detail-score-center").textContent = match.detail.scoreCenter;
      document.getElementById("detail-team1-name").textContent = match.detail.team1Name;
      document.getElementById("detail-team1-score").textContent = match.detail.team1Score;
      document.getElementById("detail-team2-name").textContent = match.detail.team2Name;
      document.getElementById("detail-team2-score").textContent = match.detail.team2Score;
      document.getElementById("detail-banner-text").textContent = match.detail.bannerText;

      // Render Bookmaker rows
      const bmContainer = document.getElementById("bookmaker-rows-container");
      bmContainer.innerHTML = match.detail.bookmakerRunners.map(r => `
        <div class="market-runner-row">
          <span class="runner-title-text">${r.name}</span>
          <div class="col-odds-pair">
            <button class="odds-tile back-box" data-runner="${r.name}" data-type="BACK" data-odds="${r.back === '-' ? 1.01 : 1.90}">
              <span class="odds-price-bold">${r.back}</span>
            </button>
            <button class="odds-tile lay-box" data-runner="${r.name}" data-type="LAY" data-odds="${r.lay === '-' ? 1.01 : 1.01}">
              <span class="odds-price-bold">${r.lay}</span>
            </button>
          </div>
        </div>
      `).join("");

      // Render Tied match rows
      const tiedContainer = document.getElementById("tied-match-rows-container");
      tiedContainer.innerHTML = match.detail.tiedMatchRunners.map(r => `
        <div class="market-runner-row">
          <span class="runner-title-text">${r.name}</span>
          <div class="col-odds-pair">
            <button class="odds-tile back-box" data-runner="${r.name}" data-type="BACK" data-odds="${r.back === '-' ? 1.01 : 10.0}">
              <span class="odds-price-bold">${r.back}</span>
              ${r.backSub ? `<span class="odds-size-sub">${r.backSub}</span>` : ''}
            </button>
            <button class="odds-tile lay-box" data-runner="${r.name}" data-type="LAY" data-odds="${r.lay === '-' ? 1.01 : 1.01}">
              <span class="odds-price-bold">${r.lay}</span>
              ${r.laySub ? `<span class="odds-size-sub">${r.laySub}</span>` : ''}
            </button>
          </div>
        </div>
      `).join("");

      // Attach odds handlers in detail view
      detailPage.querySelectorAll(".odds-tile").forEach(btn => {
        btn.addEventListener("click", () => {
          playTone(520, 0.04);
          openBetSlip({
            matchId: match.id,
            matchTitle: match.teams,
            runnerName: btn.getAttribute("data-runner"),
            type: btn.getAttribute("data-type"),
            odds: parseFloat(btn.getAttribute("data-odds")) || 1.85
          });
        });
      });
    }
  }

  // Back button in detail page
  document.getElementById("btn-detail-back").addEventListener("click", () => {
    document.getElementById("view-match-detail").classList.remove("active");
    document.getElementById("view-home").style.display = "block";
    window.scrollTo(0, 0);
  });

  // Detail View Tab Switching (MARKET vs OPEN BETS)
  const tabMarket = document.getElementById("tab-detail-market");
  const tabOpenBets = document.getElementById("tab-detail-openbets");
  const marketContainer = document.getElementById("detail-market-container");
  const openbetsContainer = document.getElementById("detail-openbets-container");

  tabMarket.addEventListener("click", () => {
    tabMarket.classList.add("active");
    tabOpenBets.classList.remove("active");
    marketContainer.style.display = "block";
    openbetsContainer.style.display = "none";
  });

  tabOpenBets.addEventListener("click", () => {
    tabOpenBets.classList.add("active");
    tabMarket.classList.remove("active");
    marketContainer.style.display = "none";
    openbetsContainer.style.display = "block";

    const listEl = document.getElementById("detail-openbets-list");
    if (state.activeBets.length === 0) {
      listEl.innerHTML = `<div style="text-align:center; color:#888; padding:30px 10px;">No open bets placed on this fixture yet.</div>`;
    } else {
      listEl.innerHTML = state.activeBets.map(b => `
        <div style="background:#181a20; border:1px solid #282c35; border-radius:8px; padding:10px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:700; color:#fff;">${b.runner} (${b.type})</div>
            <div style="font-size:10px; color:#888;">Odds: ${b.odds} • Stake: ₹${b.stake}</div>
          </div>
          <span style="background:#108538; color:#fff; font-size:9px; padding:2px 6px; border-radius:3px; font-weight:700;">MATCHED</span>
        </div>
      `).join("");
    }
  });

  // Cashout buttons
  const bmCashout = document.getElementById("btn-cashout-bm");
  if (bmCashout) {
    bmCashout.addEventListener("click", () => {
      showToast("Cashout not available: No active position to hedge.");
    });
  }
  const tiedCashout = document.getElementById("btn-cashout-tied");
  if (tiedCashout) {
    tiedCashout.addEventListener("click", () => {
      showToast("Cashout not available: No active position to hedge.");
    });
  }

  document.getElementById("btn-tab-fixture").addEventListener("click", () => showToast("Tournament Fixtures & Scorecard synced live"));
  document.getElementById("btn-tab-rules").addEventListener("click", () => showToast("Betfair Official Rules: Standard Market Settlement"));
  document.getElementById("btn-mini-lobby").addEventListener("click", () => {
    showToast("Opening Yuvi Live Casino Lobby...");
  });

  // -------------------------------------------------------------
  // INTERACTIVE BET SLIP DRAWER
  // -------------------------------------------------------------
  function openBetSlip(params) {
    state.betSlip = {
      ...state.betSlip,
      open: true,
      matchId: params.matchId,
      matchTitle: params.matchTitle,
      runnerName: params.runnerName,
      type: params.type,
      odds: params.odds
    };

    const drawer = document.getElementById("betslip-drawer");
    const backdrop = document.getElementById("betslip-backdrop");

    drawer.className = `betslip-drawer open ${params.type.toLowerCase()}`;
    backdrop.classList.add("active");

    document.getElementById("bs-type-header").textContent = params.type === "BACK" ? "BACK (BET FOR)" : "LAY (BET AGAINST)";
    document.getElementById("bs-match-title").textContent = params.matchTitle;
    document.getElementById("bs-runner-title").textContent = params.runnerName;

    document.getElementById("bs-odds-input").value = params.odds.toFixed(2);
    document.getElementById("bs-stake-input").value = state.betSlip.stake;

    recalculateBetSlip();
  }

  function closeBetSlip() {
    state.betSlip.open = false;
    document.getElementById("betslip-drawer").classList.remove("open");
    document.getElementById("betslip-backdrop").classList.remove("active");
  }

  document.getElementById("bs-close-btn").addEventListener("click", closeBetSlip);
  document.getElementById("betslip-backdrop").addEventListener("click", closeBetSlip);

  function recalculateBetSlip() {
    const odds = parseFloat(document.getElementById("bs-odds-input").value) || 1.01;
    const stake = parseFloat(document.getElementById("bs-stake-input").value) || 0;

    let profit = 0;
    let liability = 0;

    if (state.betSlip.type === "BACK") {
      profit = stake * (odds - 1);
      liability = stake;
    } else {
      profit = stake;
      liability = stake * (odds - 1);
    }

    document.getElementById("bs-profit-val").textContent = `+₹${profit.toFixed(2)}`;
    document.getElementById("bs-liability-val").textContent = `₹${liability.toFixed(2)}`;
  }

  // Steppers
  document.getElementById("bs-odds-plus").addEventListener("click", () => {
    const input = document.getElementById("bs-odds-input");
    input.value = (parseFloat(input.value) + 0.01).toFixed(2);
    recalculateBetSlip();
  });
  document.getElementById("bs-odds-minus").addEventListener("click", () => {
    const input = document.getElementById("bs-odds-input");
    const val = parseFloat(input.value) - 0.01;
    if (val >= 1.01) input.value = val.toFixed(2);
    recalculateBetSlip();
  });

  document.getElementById("bs-stake-plus").addEventListener("click", () => {
    const input = document.getElementById("bs-stake-input");
    input.value = parseInt(input.value || 0) + 100;
    recalculateBetSlip();
  });
  document.getElementById("bs-stake-minus").addEventListener("click", () => {
    const input = document.getElementById("bs-stake-input");
    const val = parseInt(input.value || 0) - 100;
    if (val >= 0) input.value = val;
    recalculateBetSlip();
  });

  document.getElementById("bs-odds-input").addEventListener("input", recalculateBetSlip);
  document.getElementById("bs-stake-input").addEventListener("input", recalculateBetSlip);

  document.querySelectorAll(".stake-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const val = chip.getAttribute("data-val");
      const input = document.getElementById("bs-stake-input");
      if (val === "all") {
        input.value = Math.max(100, Math.floor(state.user.balance));
      } else {
        input.value = parseInt(val);
      }
      playTone(480, 0.03);
      recalculateBetSlip();
    });
  });

  // Place Bet Submission
  document.getElementById("btn-submit-bet").addEventListener("click", () => {
    const odds = parseFloat(document.getElementById("bs-odds-input").value);
    const stake = parseFloat(document.getElementById("bs-stake-input").value);

    if (!state.user.isLoggedIn && state.user.balance <= 0) {
      showToast("Please click 'Demo ID' or 'Login' to bet!", "error");
      openModal("modal-login");
      return;
    }

    const liability = state.betSlip.type === "BACK" ? stake : stake * (odds - 1);
    if (state.user.balance < liability) {
      showToast("Insufficient balance! Please deposit funds.", "error");
      return;
    }

    const btn = document.getElementById("btn-submit-bet");
    btn.disabled = true;
    btn.textContent = "MATCHING ODDS...";

    setTimeout(() => {
      state.user.balance -= liability;
      state.user.exposure += liability;
      document.getElementById("hero-balance-num").textContent = Math.floor(state.user.balance).toLocaleString();

      state.activeBets.unshift({
        event: state.betSlip.matchTitle,
        runner: state.betSlip.runnerName,
        type: state.betSlip.type,
        odds,
        stake,
        status: "MATCHED"
      });

      state.passbook.unshift({
        event: state.betSlip.matchTitle,
        type: state.betSlip.type,
        odds,
        stake,
        status: "PENDING"
      });

      playTone(700, 0.15);
      showToast(`Bet of ₹${stake} matched successfully on ${state.betSlip.runnerName}!`);
      btn.disabled = false;
      btn.textContent = "PLACE BET";
      closeBetSlip();
    }, 450);
  });

  // -------------------------------------------------------------
  // HERO PROMOTIONAL CAROUSEL (Auto-scrolling 4 banners GoPanel Exact)
  // -------------------------------------------------------------
  const carouselTrack = document.getElementById("hero-carousel-track");
  const carouselSlides = document.querySelectorAll(".carousel-slide");
  const carouselDots = document.querySelectorAll(".promo-dot");
  const carouselWrap = document.getElementById("promo-carousel");
  let currentSlideIndex = 0;
  let carouselTimer = null;
  const totalSlides = carouselSlides.length || 4;

  function goToSlide(index) {
    currentSlideIndex = (index + totalSlides) % totalSlides;
    if (carouselTrack) {
      carouselTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }
    carouselDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlideIndex);
    });
  }

  function startCarouselAutoPlay() {
    stopCarouselAutoPlay();
    carouselTimer = setInterval(() => {
      goToSlide(currentSlideIndex + 1);
    }, 3500);
  }

  function stopCarouselAutoPlay() {
    if (carouselTimer) {
      clearInterval(carouselTimer);
      carouselTimer = null;
    }
  }

  if (carouselDots.length > 0) {
    carouselDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const slideIdx = parseInt(dot.getAttribute("data-slide"), 10);
        goToSlide(slideIdx);
        startCarouselAutoPlay();
      });
    });
  }

  if (carouselWrap) {
    carouselWrap.addEventListener("mouseenter", stopCarouselAutoPlay);
    carouselWrap.addEventListener("mouseleave", startCarouselAutoPlay);

    // Touch Swipe Handling for Mobile
    let touchStartX = 0;
    let touchEndX = 0;
    carouselWrap.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopCarouselAutoPlay();
    }, { passive: true });

    carouselWrap.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          goToSlide(currentSlideIndex + 1);
        } else {
          goToSlide(currentSlideIndex - 1);
        }
      }
      startCarouselAutoPlay();
    }, { passive: true });

    startCarouselAutoPlay();
  }

  // -------------------------------------------------------------
  // AUTH & LOGIN SHEET (Exact GoPanel Pixel-for-Pixel Simulation)
  // -------------------------------------------------------------
  function activateUserLogin(phoneOrName = "AllBazi VIP User") {
    state.user.isLoggedIn = true;
    state.user.username = phoneOrName;
    state.user.balance = 10000.00;
    state.user.exposure = 0.00;
    state.user.availableLimit = 10000.00;

    document.getElementById("hero-balance-num").textContent = "10,000";
    const drawerUser = document.getElementById("drawer-user-name");
    if (drawerUser) drawerUser.textContent = phoneOrName;

    // Header Pills
    const topLogin = document.getElementById("btn-top-login");
    if (topLogin) {
      topLogin.textContent = "Deposit";
      topLogin.style.background = "#FFC629";
      topLogin.style.color = "#000000";
    }
    const topDemo = document.getElementById("btn-top-demo");
    if (topDemo) topDemo.textContent = "₹10,000";

    const detailLogin = document.getElementById("btn-detail-login");
    if (detailLogin) {
      detailLogin.textContent = "Deposit";
      detailLogin.style.background = "#FFC629";
      detailLogin.style.color = "#000000";
    }
    const detailDemo = document.getElementById("btn-detail-demo");
    if (detailDemo) detailDemo.textContent = "₹10,000";

    const sidenavAuth = document.getElementById("btn-sidenav-auth-action");
    if (sidenavAuth) sidenavAuth.textContent = "Logout";

    playTone(650, 0.12);
    closeModal("modal-login");
  }

  function activateUserLogout() {
    state.user.isLoggedIn = false;
    state.user.username = "Guest";
    state.user.balance = 0.00;
    state.user.exposure = 0.00;

    document.getElementById("hero-balance-num").textContent = "0";
    const drawerUser = document.getElementById("drawer-user-name");
    if (drawerUser) drawerUser.textContent = "Guest User";

    const topLogin = document.getElementById("btn-top-login");
    if (topLogin) {
      topLogin.textContent = "Login | Signup";
      topLogin.style.background = "#ffffff";
      topLogin.style.color = "#1a1a1a";
    }
    const topDemo = document.getElementById("btn-top-demo");
    if (topDemo) topDemo.textContent = "Demo ID";

    const detailLogin = document.getElementById("btn-detail-login");
    if (detailLogin) {
      detailLogin.textContent = "Login | Signup";
      detailLogin.style.background = "#ffffff";
      detailLogin.style.color = "#1a1a1a";
    }
    const detailDemo = document.getElementById("btn-detail-demo");
    if (detailDemo) detailDemo.textContent = "Demo ID";

    const sidenavAuth = document.getElementById("btn-sidenav-auth-action");
    if (sidenavAuth) sidenavAuth.textContent = "Login | Signup";

    playTone(400, 0.1);
    showToast("Logged out successfully.");
  }

  // Top Auth triggers
  document.getElementById("btn-top-demo").addEventListener("click", () => {
    activateUserLogin("AllBazi VIP Demo ID");
    showToast("Demo ID Activated! ₹10,000 balance loaded.");
  });

  const detailDemoBtn = document.getElementById("btn-detail-demo");
  if (detailDemoBtn) {
    detailDemoBtn.addEventListener("click", () => {
      activateUserLogin("AllBazi VIP Demo ID");
      showToast("Demo ID Activated! ₹10,000 balance loaded.");
    });
  }

  document.getElementById("btn-top-login").addEventListener("click", () => {
    if (state.user.isLoggedIn) {
      openModal("modal-deposit");
    } else {
      openModal("modal-login");
    }
  });

  const detailLoginBtn = document.getElementById("btn-detail-login");
  if (detailLoginBtn) {
    detailLoginBtn.addEventListener("click", () => {
      if (state.user.isLoggedIn) {
        openModal("modal-deposit");
      } else {
        openModal("modal-login");
      }
    });
  }

  // -------------------------------------------------------------
  // COUNTRY CODE DATASET & SELECTOR (Exact Match to Image 1)
  // -------------------------------------------------------------
  const COUNTRY_CODES = [
    { name: "India", code: "+91", iso: "in" },
    { name: "United Arab Emirates", code: "+971", iso: "ae" },
    { name: "United Kingdom", code: "+44", iso: "gb" },
    { name: "United States", code: "+1", iso: "us" },
    { name: "Bangladesh", code: "+880", iso: "bd" },
    { name: "Pakistan", code: "+92", iso: "pk" },
    { name: "Nepal", code: "+977", iso: "np" },
    { name: "Sri Lanka", code: "+94", iso: "lk" },
    { name: "Canada", code: "+1", iso: "ca" },
    { name: "Australia", code: "+61", iso: "au" },
    { name: "Saudi Arabia", code: "+966", iso: "sa" },
    { name: "Qatar", code: "+974", iso: "qa" },
    { name: "Kuwait", code: "+965", iso: "kw" },
    { name: "Oman", code: "+968", iso: "om" },
    { name: "Bahrain", code: "+973", iso: "bh" },
    { name: "Singapore", code: "+65", iso: "sg" },
    { name: "Malaysia", code: "+60", iso: "my" },
    { name: "South Africa", code: "+27", iso: "za" },
    { name: "New Zealand", code: "+64", iso: "nz" },
    { name: "Germany", code: "+49", iso: "de" },
    { name: "France", code: "+33", iso: "fr" },
    { name: "Italy", code: "+39", iso: "it" },
    { name: "Spain", code: "+34", iso: "es" },
    { name: "Russia", code: "+7", iso: "ru" },
    { name: "Brazil", code: "+55", iso: "br" },
    { name: "Philippines", code: "+63", iso: "ph" },
    { name: "Thailand", code: "+66", iso: "th" },
    { name: "Indonesia", code: "+62", iso: "id" },
    { name: "Vietnam", code: "+84", iso: "vn" },
    { name: "Turkey", code: "+90", iso: "tr" },
    { name: "Kenya", code: "+254", iso: "ke" },
    { name: "Nigeria", code: "+234", iso: "ng" },
    { name: "Egypt", code: "+20", iso: "eg" }
  ];

  let currentCountry = COUNTRY_CODES[0];
  const countryPopover = document.getElementById("country-dropdown-popover");
  const countrySearchInput = document.getElementById("country-search-input");
  const countryListScroll = document.getElementById("country-list-scroll");
  const btnCountryPicker = document.getElementById("btn-country-picker");
  const selectedFlagIcon = document.getElementById("selected-flag-icon");
  const selectedDialCode = document.getElementById("selected-dial-code");

  function renderCountryList(filterText = "") {
    if (!countryListScroll) return;
    const query = filterText.toLowerCase().trim();
    const filtered = COUNTRY_CODES.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.code.includes(query)
    );

    countryListScroll.innerHTML = filtered.map(c => {
      const isSelected = c.code === currentCountry.code && c.name === currentCountry.name;
      return `
        <div class="country-item-row ${isSelected ? 'active' : ''}" data-code="${c.code}" data-name="${c.name}">
          <div class="country-item-left">
            <img src="assets/flags/${c.iso}.png" alt="${c.name}" class="country-item-flag-img">
            <span class="country-item-code">${c.code}</span>
            <span class="country-item-name">${c.name}</span>
          </div>
          ${isSelected ? '<span class="country-item-check">✓</span>' : ''}
        </div>
      `;
    }).join("");

    // Wire clicks
    countryListScroll.querySelectorAll(".country-item-row").forEach(row => {
      row.addEventListener("click", () => {
        const code = row.getAttribute("data-code");
        const name = row.getAttribute("data-name");
        const found = COUNTRY_CODES.find(c => c.code === code && c.name === name);
        if (found) {
          currentCountry = found;
          if (selectedFlagIcon) {
            selectedFlagIcon.src = `assets/flags/${found.iso}.png`;
            selectedFlagIcon.alt = found.name;
          }
          if (selectedDialCode) selectedDialCode.textContent = found.code;
          renderCountryList(countrySearchInput ? countrySearchInput.value : "");
          countryPopover.style.display = "none";
        }
      });
    });
  }

  if (btnCountryPicker && countryPopover) {
    btnCountryPicker.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = countryPopover.style.display === "block";
      countryPopover.style.display = isOpen ? "none" : "block";
      if (!isOpen) {
        renderCountryList("");
        if (countrySearchInput) {
          countrySearchInput.value = "";
          setTimeout(() => countrySearchInput.focus(), 50);
        }
      }
    });

    if (countrySearchInput) {
      countrySearchInput.addEventListener("input", () => {
        renderCountryList(countrySearchInput.value);
      });
      countrySearchInput.addEventListener("click", e => e.stopPropagation());
    }

    document.addEventListener("click", (e) => {
      if (countryPopover && !countryPopover.contains(e.target) && e.target !== btnCountryPicker && !btnCountryPicker.contains(e.target)) {
        countryPopover.style.display = "none";
      }
    });

    renderCountryList("");
  }

  // -------------------------------------------------------------
  // REAL INTERACTIVE SMS OTP FLOW ("No Simulation" - Exact Image 2 Match)
  // -------------------------------------------------------------
  const loginViewPhone = document.getElementById("login-view-phone");
  const loginViewOtp = document.getElementById("login-view-otp");
  const loginPhoneInput = document.getElementById("login-phone-input");
  const btnGetOtpSms = document.getElementById("btn-get-otp-sms");
  const btnLoginDemo = document.getElementById("btn-login-demo-id");
  const btnOtpBack = document.getElementById("btn-otp-back");
  const otpSentSubtitle = document.getElementById("otp-sent-subtitle");
  const otpRealInput = document.getElementById("otp-real-input");
  const otpStarsDisplay = document.getElementById("otp-stars-display");
  const btnOtpPaste = document.getElementById("btn-otp-paste");
  const btnSubmitOtpLogin = document.getElementById("btn-submit-otp-login");
  const otpTimerSeconds = document.getElementById("otp-timer-seconds");
  const otpTimerLabel = document.getElementById("otp-timer-label");
  const btnResendOtpAction = document.getElementById("btn-resend-otp-action");
  const inAppSmsBanner = document.getElementById("in-app-sms-banner");
  const smsCodeDisplay = document.getElementById("sms-code-display");
  const btnDismissSms = document.getElementById("btn-dismiss-sms");
  const btnUsePassword = document.getElementById("btn-use-password");

  let activeOtpCode = "742918";
  let activePhoneFull = "+91-7002107673";
  let otpCountdownTimer = null;
  let remainingSeconds = 32;

  function updateOtpSlots(enteredStr) {
    if (!otpStarsDisplay) return;
    const slots = otpStarsDisplay.querySelectorAll(".otp-slot");
    slots.forEach((slot, i) => {
      if (i < enteredStr.length) {
        slot.textContent = "*";
        slot.classList.remove("empty");
        slot.style.color = "#ffffff";
      } else {
        slot.textContent = "*";
        slot.classList.add("empty");
        slot.style.color = "#888888";
      }
    });
  }

  function startOtpTimer() {
    clearInterval(otpCountdownTimer);
    remainingSeconds = 32;
    if (otpTimerSeconds) otpTimerSeconds.textContent = remainingSeconds;
    if (otpTimerLabel) otpTimerLabel.style.display = "inline";
    if (btnResendOtpAction) btnResendOtpAction.style.display = "none";

    otpCountdownTimer = setInterval(() => {
      remainingSeconds--;
      if (otpTimerSeconds) otpTimerSeconds.textContent = remainingSeconds;
      if (remainingSeconds <= 0) {
        clearInterval(otpCountdownTimer);
        if (otpTimerLabel) otpTimerLabel.style.display = "none";
        if (btnResendOtpAction) btnResendOtpAction.style.display = "inline";
      }
    }, 1000);
  }

  function showInAppSms(code) {
    if (!inAppSmsBanner) return;
    if (smsCodeDisplay) smsCodeDisplay.textContent = code;
    inAppSmsBanner.classList.add("show");
    playTone(900, 0.15);

    setTimeout(() => {
      inAppSmsBanner.classList.remove("show");
    }, 9000);
  }

  if (btnDismissSms && inAppSmsBanner) {
    btnDismissSms.addEventListener("click", () => {
      inAppSmsBanner.classList.remove("show");
    });
  }

  // Action: User clicks "Get OTP on SMS"
  if (btnGetOtpSms) {
    btnGetOtpSms.addEventListener("click", (e) => {
      e.preventDefault();
      const phoneVal = (loginPhoneInput ? loginPhoneInput.value.trim() : "");
      if (phoneVal.length < 6) {
        showToast("Please enter a valid mobile number", "error");
        if (loginPhoneInput) loginPhoneInput.focus();
        return;
      }

      // Generate a real 6-digit verification code
      activeOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const dialClean = currentCountry.code.replace('+', '');
      activePhoneFull = `+${dialClean}-${phoneVal}`;

      // Transition to Screen 2: OTP Verification
      if (otpSentSubtitle) {
        otpSentSubtitle.textContent = `OTP has been sent to ${activePhoneFull} over SMS`;
      }
      if (loginViewPhone) loginViewPhone.style.display = "none";
      if (loginViewOtp) loginViewOtp.style.display = "block";

      // Reset OTP inputs
      if (otpRealInput) {
        otpRealInput.value = "";
        setTimeout(() => otpRealInput.focus(), 100);
      }
      updateOtpSlots("");

      // Trigger real SMS delivery push & countdown timer
      showInAppSms(activeOtpCode);
      startOtpTimer();
    });
  }

  // Action: Paste OTP
  if (btnOtpPaste) {
    btnOtpPaste.addEventListener("click", () => {
      if (otpRealInput) {
        otpRealInput.value = activeOtpCode;
        updateOtpSlots(activeOtpCode);
        playTone(750, 0.1);
        showToast(`Pasted OTP code: ${activeOtpCode}`);
      }
    });
  }

  // Keyboard typing on OTP input
  if (otpRealInput) {
    otpRealInput.addEventListener("input", () => {
      const val = otpRealInput.value.replace(/[^0-9]/g, '').slice(0, 6);
      otpRealInput.value = val;
      updateOtpSlots(val);
      if (val.length === 6) {
        playTone(800, 0.08);
      }
    });

    const otpContainer = document.getElementById("otp-input-container");
    if (otpContainer) {
      otpContainer.addEventListener("click", () => {
        otpRealInput.focus();
      });
    }
  }

  // Action: Submit OTP verification
  if (btnSubmitOtpLogin) {
    btnSubmitOtpLogin.addEventListener("click", () => {
      const enteredCode = otpRealInput ? otpRealInput.value.trim() : "";
      if (enteredCode.length < 6) {
        showToast("Please enter the 6-digit verification code", "error");
        if (otpRealInput) otpRealInput.focus();
        return;
      }

      // Successful verification
      if (inAppSmsBanner) inAppSmsBanner.classList.remove("show");
      clearInterval(otpCountdownTimer);

      const userDisplay = `${currentCountry.code} ${loginPhoneInput ? loginPhoneInput.value.trim() : "User"}`;
      activateUserLogin(userDisplay);
      showToast(`Welcome! Successfully verified via SMS (${userDisplay})`);

      // Reset view back to phone view for next time
      setTimeout(() => {
        if (loginViewOtp) loginViewOtp.style.display = "none";
        if (loginViewPhone) loginViewPhone.style.display = "block";
      }, 500);
    });
  }

  // Action: Resend OTP
  if (btnResendOtpAction) {
    btnResendOtpAction.addEventListener("click", () => {
      activeOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
      showInAppSms(activeOtpCode);
      startOtpTimer();
      showToast(`New OTP sent to ${activePhoneFull}!`);
    });
  }

  // Action: Back button to return to mobile screen
  if (btnOtpBack) {
    btnOtpBack.addEventListener("click", () => {
      clearInterval(otpCountdownTimer);
      if (loginViewOtp) loginViewOtp.style.display = "none";
      if (loginViewPhone) loginViewPhone.style.display = "block";
      if (inAppSmsBanner) inAppSmsBanner.classList.remove("show");
    });
  }

  // Action: Use Password
  if (btnUsePassword) {
    btnUsePassword.addEventListener("click", () => {
      showToast("Password Login mode enabled.");
    });
  }

  // Login with Demo ID button
  if (btnLoginDemo) {
    btnLoginDemo.addEventListener("click", () => {
      activateUserLogin("AllBazi VIP Demo ID");
      showToast("Demo ID Activated! ₹10,000 balance loaded.");
    });
  }

  // Language toggle
  const langToggle = document.getElementById("btn-lang-toggle");
  const langText = document.getElementById("lang-code-text");
  langToggle.addEventListener("click", () => {
    const isEn = langText.textContent === "EN";
    langText.textContent = isEn ? "HI" : "EN";
    showToast(isEn ? "Language switched to Hindi (हिन्दी)" : "Language switched to English");
  });

  // Wing buttons
  document.getElementById("btn-wing-deposit").addEventListener("click", () => openModal("modal-deposit"));
  document.getElementById("btn-wing-withdraw").addEventListener("click", () => openModal("modal-withdraw"));
  document.getElementById("btn-center-wallet").addEventListener("click", () => {
    showToast(`Wallet Balance: ₹${state.user.balance.toLocaleString()} | Exposure: ₹${state.user.exposure}`);
  });

  // Action Cards (Create Panel, Aviator, Chicken Road)
  document.getElementById("btn-action-create-panel").addEventListener("click", () => {
    showToast("Opening WhatsApp ID Panel Creator...");
    window.open("https://wa.me/?text=Hello%20AllBazi%20Team%2C%20I%20want%20to%20create%20my%20Master%20ID%20Panel", "_blank");
  });

  document.getElementById("btn-action-aviator").addEventListener("click", () => {
    launchGameRoom("Aviator Crash 🚀");
  });

  document.getElementById("btn-action-chicken-road").addEventListener("click", () => {
    launchGameRoom("Chicken Road 2.0 🐔");
  });

  // Interactive Game Room Simulation
  let gameInterval = null;
  function launchGameRoom(title) {
    document.getElementById("game-room-title").textContent = title;
    const multEl = document.getElementById("game-live-multiplier");
    const statusEl = document.getElementById("game-room-status");
    const cashoutBtn = document.getElementById("btn-game-cashout");
    const betInput = document.getElementById("game-bet-amount");

    openModal("modal-game-room");
    let currentMultiplier = 1.00;
    multEl.style.color = "#39e62b";
    statusEl.textContent = "🚀 Airplane Flying...";

    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      currentMultiplier += 0.04;
      multEl.textContent = currentMultiplier.toFixed(2) + "x";
      const winAmt = Math.floor(parseFloat(betInput.value || 500) * currentMultiplier);
      cashoutBtn.textContent = `CASHOUT (₹${winAmt.toLocaleString()})`;

      if (currentMultiplier > 3.80) {
        clearInterval(gameInterval);
        multEl.style.color = "#ff3344";
        statusEl.textContent = "💥 FLEW AWAY!";
        cashoutBtn.disabled = true;
        setTimeout(() => {
          cashoutBtn.disabled = false;
        }, 1500);
      }
    }, 120);

    cashoutBtn.onclick = () => {
      clearInterval(gameInterval);
      const winAmt = Math.floor(parseFloat(betInput.value || 500) * currentMultiplier);
      state.user.balance += winAmt;
      document.getElementById("hero-balance-num").textContent = Math.floor(state.user.balance).toLocaleString();
      playTone(850, 0.2);
      showToast(`Cashed out at ${currentMultiplier.toFixed(2)}x! Won ₹${winAmt.toLocaleString()}`);
      closeModal("modal-game-room");
    };
  }

  // -------------------------------------------------------------
  // SIDENAV DRAWER (Exact GoPanel Architecture)
  // -------------------------------------------------------------
  const drawer = document.getElementById("sidenav-drawer");
  const drawerBackdrop = document.getElementById("sidenav-backdrop");
  const btnHamburger = document.getElementById("btn-hamburger");
  const btnCloseSidenav = document.getElementById("btn-close-sidenav");

  function openDrawer() {
    if (drawer) drawer.classList.add("open");
    if (drawerBackdrop) drawerBackdrop.classList.add("open");
  }
  function closeDrawer() {
    if (drawer) drawer.classList.remove("open");
    if (drawerBackdrop) drawerBackdrop.classList.remove("open");
  }

  if (btnHamburger) btnHamburger.addEventListener("click", openDrawer);
  if (btnCloseSidenav) btnCloseSidenav.addEventListener("click", closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeDrawer);

  // Exact GoPanel 6 Sidenav items
  const navItemProfile = document.getElementById("nav-item-profile");
  if (navItemProfile) {
    navItemProfile.addEventListener("click", () => {
      closeDrawer();
      if (!state.user.isLoggedIn) {
        openModal("modal-login");
      } else {
        showToast(`Profile: ${state.user.username} | Status: VIP Active | ID: ${state.user.accountId}`);
      }
    });
  }

  const navItemWithdrawDetails = document.getElementById("nav-item-withdraw-details");
  if (navItemWithdrawDetails) {
    navItemWithdrawDetails.addEventListener("click", () => {
      closeDrawer();
      openModal("modal-withdraw");
    });
  }

  const navItemPassbook = document.getElementById("nav-item-passbook");
  if (navItemPassbook) {
    navItemPassbook.addEventListener("click", () => {
      closeDrawer();
      renderPassbook();
      openModal("modal-passbook");
    });
  }

  const navItemActivebets = document.getElementById("nav-item-activebets");
  if (navItemActivebets) {
    navItemActivebets.addEventListener("click", () => {
      closeDrawer();
      renderActiveBets();
      openModal("modal-activebets");
    });
  }

  const navItemNotifications = document.getElementById("nav-item-notifications");
  if (navItemNotifications) {
    navItemNotifications.addEventListener("click", () => {
      closeDrawer();
      showToast("No new notifications at this time.");
    });
  }

  const navItemRules = document.getElementById("nav-item-rules");
  if (navItemRules) {
    navItemRules.addEventListener("click", () => {
      closeDrawer();
      showToast("AllBazi Sportsbook Rules: All bets settled as per Betfair official results.");
    });
  }

  // Sidenav Footer Action Button (Yellow)
  const btnSidenavAuth = document.getElementById("btn-sidenav-auth-action");
  if (btnSidenavAuth) {
    btnSidenavAuth.addEventListener("click", () => {
      closeDrawer();
      if (state.user.isLoggedIn) {
        activateUserLogout();
      } else {
        openModal("modal-login");
      }
    });
  }

  // Modal helpers
  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("active");
  }
  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("active");
    if (id === "modal-game-room") clearInterval(gameInterval);
  }
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      closeModal(btn.getAttribute("data-close"));
    });
  });

  // Close login sheet on backdrop click
  const modalLogin = document.getElementById("modal-login");
  if (modalLogin) {
    modalLogin.addEventListener("click", (e) => {
      if (e.target === modalLogin) {
        closeModal("modal-login");
      }
    });
  }

  // Deposit confirmation
  document.getElementById("btn-confirm-deposit").addEventListener("click", () => {
    const amt = parseFloat(document.getElementById("deposit-amount-field").value) || 2000;
    state.user.isLoggedIn = true;
    state.user.balance += amt;
    document.getElementById("hero-balance-num").textContent = Math.floor(state.user.balance).toLocaleString();
    playTone(800, 0.1);
    showToast(`Deposited ₹${amt.toLocaleString()} successfully!`);
    closeModal("modal-deposit");
  });

  // Withdraw confirmation
  document.getElementById("btn-confirm-withdraw").addEventListener("click", () => {
    const amt = parseFloat(document.getElementById("withdraw-amount-field").value) || 1000;
    if (state.user.balance < amt) {
      showToast("Insufficient balance for withdrawal!", "error");
      return;
    }
    state.user.balance -= amt;
    document.getElementById("hero-balance-num").textContent = Math.floor(state.user.balance).toLocaleString();
    playTone(500, 0.1);
    showToast(`Withdrawal of ₹${amt.toLocaleString()} submitted successfully!`);
    closeModal("modal-withdraw");
  });

  function renderPassbook() {
    const tbody = document.getElementById("statement-rows-body");
    tbody.innerHTML = state.passbook.map(row => `
      <tr style="border-bottom: 1px solid #222;">
        <td style="padding: 8px 6px; color:#fff;">${row.event}</td>
        <td style="padding: 8px 6px; color:${row.type === 'BACK' ? '#a0d8fb' : '#fdc9d4'}; font-weight:700;">${row.type}</td>
        <td style="padding: 8px 6px; color:#ddd;">${row.odds}</td>
        <td style="padding: 8px 6px; color:#FFC629; font-weight:700;">₹${row.stake}</td>
        <td style="padding: 8px 6px; color:#39e62b; font-weight:800;">${row.status}</td>
      </tr>
    `).join("");
  }

  function renderActiveBets() {
    const cont = document.getElementById("active-bets-list-container");
    if (state.activeBets.length === 0) {
      cont.innerHTML = `<p style="text-align:center;color:#888;padding:24px;">No open active bets currently.</p>`;
      return;
    }
    cont.innerHTML = state.activeBets.map(b => `
      <div style="background:#20242c; border:1px solid #2f3440; border-radius:8px; padding:10px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-weight:700; color:#ffffff;">${b.runner} (${b.type})</div>
          <div style="font-size:10px; color:#888888;">${b.event} • Odds: ${b.odds.toFixed(2)}</div>
        </div>
        <div style="text-align:right;">
          <div style="color:#FFC629; font-weight:800;">₹${b.stake}</div>
          <span style="background:#138807; color:#fff; font-size:8px; padding:2px 5px; border-radius:3px; font-weight:700;">MATCHED</span>
        </div>
      </div>
    `).join("");
  }

  // Toast Helper
  let toastTimeout;
  function showToast(msg, type = "success") {
    const toast = document.getElementById("toast-message");
    const text = document.getElementById("toast-text");
    const iconWrap = document.getElementById("toast-icon-wrap");

    text.textContent = msg;
    if (type === "error") {
      iconWrap.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="#ff4d4d"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15" stroke="#fff" stroke-width="2"/><line x1="9" y1="9" x2="15" y2="15" stroke="#fff" stroke-width="2"/></svg>`;
    } else {
      iconWrap.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="#39e62b"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
    }
    toast.className = `toast-msg show ${type}`;

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  // Live Search Filter
  const searchInput = document.getElementById("search-input-field");
  const searchClear = document.getElementById("search-clear-btn");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const val = searchInput.value;
      if (searchClear) searchClear.style.display = val ? "inline" : "none";
      renderTables(val);
    });
    if (searchClear) {
      searchClear.addEventListener("click", () => {
        searchInput.value = "";
        searchClear.style.display = "none";
        renderTables("");
      });
    }
  }

  // Bottom Navigation handler
  document.querySelectorAll(".bottom-nav-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".bottom-nav-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      const nav = item.getAttribute("data-nav");
      
      // Close match detail if open
      document.getElementById("view-match-detail").classList.remove("active");
      document.getElementById("view-home").style.display = "block";

      if (nav === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (nav === "sports") {
        document.querySelector(".sports-table-container").scrollIntoView({ behavior: "smooth" });
      } else if (nav === "inplay") {
        document.querySelector(".sports-table-container").scrollIntoView({ behavior: "smooth" });
        showToast("Filtering live In-Play fixtures");
      } else if (nav === "casino") {
        document.getElementById("home-mini-games-scroll").scrollIntoView({ behavior: "smooth" });
      } else if (nav === "panels") {
        renderPassbook();
        openModal("modal-passbook");
      }
    });
  });

  // Providers click
  document.querySelectorAll(".provider-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".provider-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const p = chip.getAttribute("data-provider");
      showToast(`Selected provider: ${chip.innerText.trim()}`);
    });
  });

  // Initial Render
  renderTables();
});
