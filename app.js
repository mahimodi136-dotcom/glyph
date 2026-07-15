// Pocki — standalone vanilla JS build (mirrors the React/Vite prototype
// in src/, minus the build step). Same data model, same screens, same
// localStorage persistence.

// ---------------------------------------------------------------------------
// Data layer (mirrors src/hooks/useStorage.js)
// ---------------------------------------------------------------------------
const STORAGE_KEY = 'pocki_data_v5'

function makeDefaultData() {
  return {
    user: { name: '' },
    jars: {
      spend: { name: 'Spend', balance: 0 },
      save: { name: 'Save', balance: 0 },
      give: { name: 'Give', balance: 0 },
    },
    goals: [],
    transactions: [],
    monthly: { thisMonth: 0, lastMonth: 0 },
  }
}

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : makeDefaultData()
  } catch {
    return makeDefaultData()
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data))
}

function addTransaction(transaction) {
  const tx = { id: Date.now(), timestamp: new Date().toISOString(), ...transaction }
  const data = state.data
  const jar = transaction.jar
  const delta = transaction.type === 'out' ? -transaction.amount : transaction.amount

  if (data.jars[jar]) {
    data.jars[jar].balance += delta
  } else {
    const goal = data.goals.find((g) => g.id === jar)
    if (goal) goal.currentAmount += transaction.amount
  }
  data.transactions = [tx, ...data.transactions]
  saveData()
}

function addGoal(goal) {
  state.data.goals.push({
    id: Date.now(),
    createdAt: new Date().toISOString(),
    currentAmount: 0,
    ...goal,
  })
  saveData()
}

function updateGoal(goalId, updates) {
  const goal = state.data.goals.find((g) => g.id === goalId)
  if (goal) Object.assign(goal, updates)
  saveData()
}

function deleteGoal(goalId) {
  state.data.goals = state.data.goals.filter((g) => g.id !== goalId)
  saveData()
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const CURRENCY = (n, decimals = 2) => {
  const safe = Number.isFinite(n) ? Math.min(Math.abs(n), 99999999) : 0
  return '₹' + safe.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function initialsFor(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
}

// ---------------------------------------------------------------------------
// Icons (inline SVG strings, mirrors src/components/Icons.jsx)
// ---------------------------------------------------------------------------
const svgAttrs = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'

const Icon = {
  bell: (s = 20) => `<svg width="${s}" height="${s}" ${svgAttrs}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  plus: (s = 20) => `<svg width="${s}" height="${s}" ${svgAttrs}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  minus: (s = 20) => `<svg width="${s}" height="${s}" ${svgAttrs}><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  send: (s = 20) => `<svg width="${s}" height="${s}" ${svgAttrs}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  qr: (s = 20) => `<svg width="${s}" height="${s}" ${svgAttrs}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><line x1="14" y1="14" x2="14" y2="17"/><line x1="14" y1="20" x2="14" y2="21"/><line x1="17" y1="14" x2="21" y2="14"/><line x1="18" y1="18" x2="21" y2="18"/><line x1="21" y1="18" x2="21" y2="21"/></svg>`,
  trendUp: (s = 16) => `<svg width="${s}" height="${s}" ${svgAttrs}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  trendDown: (s = 16) => `<svg width="${s}" height="${s}" ${svgAttrs}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>`,
  home: (s = 22) => `<svg width="${s}" height="${s}" ${svgAttrs}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  history: (s = 22) => `<svg width="${s}" height="${s}" ${svgAttrs}><path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 9 8 9"/><polyline points="12 7 12 12 16 14"/></svg>`,
  user: (s = 22) => `<svg width="${s}" height="${s}" ${svgAttrs}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  headphones: (s = 24) => `<svg width="${s}" height="${s}" ${svgAttrs}><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`,
  coffee: (s = 22) => `<svg width="${s}" height="${s}" ${svgAttrs}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  bag: (s = 22) => `<svg width="${s}" height="${s}" ${svgAttrs}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  wallet: (s = 20) => `<svg width="${s}" height="${s}" ${svgAttrs}><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg>`,
  piggy: (s = 20) => `<svg width="${s}" height="${s}" ${svgAttrs}><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"/><line x1="16" y1="11" x2="16" y2="11.01"/></svg>`,
  gift: (s = 20) => `<svg width="${s}" height="${s}" ${svgAttrs}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,
  search: (s = 18) => `<svg width="${s}" height="${s}" ${svgAttrs}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  filter: (s = 18) => `<svg width="${s}" height="${s}" ${svgAttrs}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  alertTriangle: (s = 18) => `<svg width="${s}" height="${s}" ${svgAttrs}><path d="M12 9v3"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="16" x2="12" y2="16.01"/></svg>`,
  chevronRight: (s = 18) => `<svg width="${s}" height="${s}" ${svgAttrs}><polyline points="9 18 15 12 9 6"/></svg>`,
  utensils: (s = 20) => `<svg width="${s}" height="${s}" ${svgAttrs}><path d="M6 2v7a2 2 0 0 0 4 0V2"/><line x1="8" y1="9" x2="8" y2="22"/><path d="M18 2c-2 1.5-2 4-2 6a2 2 0 0 0 2 2v12"/></svg>`,
  car: (s = 20) => `<svg width="${s}" height="${s}" ${svgAttrs}><path d="M5 17h14l1.5-5.5a2 2 0 0 0-1.9-2.5H6.4a2 2 0 0 0-1.9 1.4L3 17"/><path d="M5 17v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2"/><path d="M16 17v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2"/><line x1="6" y1="12" x2="18" y2="12"/></svg>`,
  phone: (s = 20) => `<svg width="${s}" height="${s}" ${svgAttrs}><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="10" y1="19" x2="14" y2="19"/></svg>`,
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const state = {
  page: 'home',
  data: loadData(),
  activityQuery: '',
}

function navigate(page) {
  state.page = page
  render()
}

// ---------------------------------------------------------------------------
// Shared chrome: iOS-style status bar + bottom nav
// ---------------------------------------------------------------------------
function renderStatusBar() {
  return `
    <div class="status-bar">
      <span class="status-time">9:41</span>
      <div class="status-icons">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0" y="7" width="3" height="5" rx="0.8" fill="currentColor"/>
          <rect x="4.5" y="5" width="3" height="7" rx="0.8" fill="currentColor"/>
          <rect x="9" y="3" width="3" height="9" rx="0.8" fill="currentColor"/>
          <rect x="13.5" y="0" width="3" height="12" rx="0.8" fill="currentColor"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 10.2a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z" fill="currentColor"/>
          <path d="M4.7 6.9a4.7 4.7 0 0 1 6.6 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none"/>
          <path d="M2.2 4.3a8.2 8.2 0 0 1 11.6 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none"/>
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.75" y="0.75" width="20.5" height="10.5" rx="2.5" stroke="currentColor" stroke-width="1.2"/>
          <rect x="2.2" y="2.2" width="16" height="7.6" rx="1.4" fill="currentColor"/>
          <rect x="22" y="4" width="1.8" height="4" rx="0.8" fill="currentColor"/>
        </svg>
      </div>
    </div>
  `
}

function renderNav(current) {
  const item = (page, icon, label) => `
    <button class="nav-item ${current === page ? 'active' : ''}" data-nav="${page}">
      ${icon}
      ${current === page ? `<span class="nav-label">${label}</span>` : ''}
    </button>
  `
  return `
    <nav class="bottom-nav">
      ${item('home', Icon.home(), 'Home')}
      ${item('activity', Icon.history(), 'Activities')}
      ${item('home', Icon.user(), '')}
    </nav>
  `
}

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------
const ACTIVITY_TILE = {
  coffee: { icon: Icon.coffee(), className: 'tile-coffee' },
  shopping: { icon: Icon.bag(), className: 'tile-shopping' },
}

const JAR_CARD_META = {
  spend: { className: 'jar-purple', icon: Icon.wallet(20) },
  save: { className: 'jar-lime', icon: Icon.piggy(20) },
  give: { className: 'jar-coral', icon: Icon.gift(20) },
}

function greetingForNow() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning,'
  if (h < 17) return 'Good afternoon,'
  return 'Good evening,'
}

function formatActivityTime(timestamp) {
  const d = new Date(timestamp)
  const now = new Date()
  const yest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toUpperCase()
  if (d.toDateString() === now.toDateString()) return `TODAY, ${time}`
  if (d.toDateString() === yest.toDateString()) return 'YESTERDAY'
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }).toUpperCase()
}

function renderHome() {
  const data = state.data
  const userName = (data.user?.name || '').trim()
  const totalBalance = Object.values(data.jars).reduce((sum, jar) => sum + jar.balance, 0)
  const thisMonth = data.monthly?.thisMonth ?? 0
  const lastMonth = data.monthly?.lastMonth ?? 0
  const thisChange = lastMonth ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0
  const lastChange = 0

  const nextGoal = [...data.goals]
    .filter((g) => g.currentAmount < g.targetAmount)
    .sort((a, b) => a.currentAmount / a.targetAmount - b.currentAmount / b.targetAmount)[0]
  const goalPct = nextGoal ? Math.round((nextGoal.currentAmount / nextGoal.targetAmount) * 100) : 0

  const recent = data.transactions.slice(0, 2)

  const changeBadge = (value) => {
    const positive = value >= 0
    return `<p class="month-change ${positive ? 'up' : 'down'}">${positive ? Icon.trendUp() : Icon.trendDown()} ${positive ? '+' : ''}${value}%</p>`
  }

  return `
    <div class="page home-page">
      ${renderStatusBar()}
      <div class="home-content">
        <header class="greeting-card">
          <div class="greeting-left">
            <div class="avatar" aria-hidden="true"></div>
            <div>
              <p class="greeting-hello">${greetingForNow()}</p>
              <h1 class="greeting-name">${userName ? `${escapeHtml(userName)}! ` : 'Hello! '}<span class="wave">👋</span></h1>
            </div>
          </div>
          <button class="bell-btn" aria-label="Notifications">${Icon.bell()}<span class="bell-dot"></span></button>
        </header>

        <section class="balance-card">
          <div class="balance-top">
            <span class="balance-label">Current Balance</span>
            <button class="plus-btn" aria-label="Add money" data-nav="log">${Icon.plus(22)}</button>
          </div>
          <p class="balance-amount">${CURRENCY(totalBalance)}</p>
          <div class="balance-divider"></div>
          <div class="balance-months">
            <div class="month-col">
              <div class="month-head"><span class="dot dot-purple"></span><span class="month-label">THIS MONTH</span></div>
              <p class="month-amount">${CURRENCY(thisMonth)}</p>
              ${changeBadge(thisChange)}
            </div>
            <div class="month-col">
              <div class="month-head"><span class="dot dot-grey"></span><span class="month-label">LAST MONTH</span></div>
              <p class="month-amount">${CURRENCY(lastMonth)}</p>
              ${changeBadge(lastChange)}
            </div>
          </div>
        </section>

        <section class="actions-row">
          <button class="action action-plain">
            <span class="action-icon">${Icon.qr()}</span>
            <span class="action-label">QR Code</span>
          </button>
          <button class="action action-lime" data-nav="log">
            <span class="action-icon">${Icon.plus()}</span>
            <span class="action-label">Add Money</span>
          </button>
          <button class="action action-purple">
            <span class="action-icon">${Icon.send()}</span>
            <span class="action-label">Send Money</span>
          </button>
          <button class="action action-plain" data-nav="log">
            <span class="action-icon">${Icon.minus()}</span>
            <span class="action-label">Log Spend</span>
          </button>
        </section>

        <section class="jars-section">
          <div class="section-head">
            <h2 class="section-title">Your Jars</h2>
            <button class="view-all view-all-purple" data-nav="goals">View all →</button>
          </div>
          <div class="jars-scroll">
            ${Object.entries(data.jars)
              .map(([key, jar]) => {
                const meta = JAR_CARD_META[key] || JAR_CARD_META.spend
                return `
                  <div class="jar-card ${meta.className}">
                    <span class="jar-icon">${meta.icon}</span>
                    <div class="jar-info">
                      <span class="jar-label">${escapeHtml(jar.name)}</span>
                      <span class="jar-amount">${CURRENCY(jar.balance)}</span>
                    </div>
                  </div>
                `
              })
              .join('')}
          </div>
        </section>

        ${
          nextGoal
            ? `
        <section class="spotlight-section">
          <h2 class="section-title">Goal Spotlight</h2>
          <div class="spotlight-card">
            <div class="spotlight-top">
              <div class="spotlight-icon">${Icon.headphones()}</div>
              <div class="spotlight-info">
                <h3 class="spotlight-name">${escapeHtml(nextGoal.name)}</h3>
                <p class="spotlight-jar">Save Jar</p>
              </div>
              <div class="spotlight-amounts">
                <p class="spotlight-current">₹${nextGoal.currentAmount.toLocaleString('en-IN')}</p>
                <p class="spotlight-target">of ₹${nextGoal.targetAmount.toLocaleString('en-IN')}</p>
              </div>
              <button type="button" class="spotlight-delete-btn" data-delete-goal="${nextGoal.id}" aria-label="Delete ${escapeHtml(nextGoal.name)}">✕</button>
            </div>
            <div class="spotlight-track"><div class="spotlight-fill" style="width:${goalPct}%"></div></div>
            <p class="spotlight-cheer">${goalPct}% complete! Keep it up!</p>
          </div>
        </section>`
            : ''
        }

        ${
          data.goals.length > 0
            ? `
        <section class="goals-preview-section">
          <div class="section-head">
            <h2 class="section-title">Your Goals</h2>
            <button class="view-all view-all-purple" data-nav="goals">View all →</button>
          </div>
          <div class="goals-preview-card">
            ${data.goals
              .slice(0, 3)
              .map((goal) => {
                const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
                return `
                  <div class="goals-preview-row">
                    <div class="goals-preview-top">
                      <p class="goals-preview-name">${escapeHtml(goal.name)}</p>
                      <p class="goals-preview-amounts">${CURRENCY(goal.currentAmount, 0)}<span class="goals-preview-target"> / ${CURRENCY(goal.targetAmount, 0)}</span></p>
                    </div>
                    <div class="goals-preview-track"><div class="goals-preview-fill" style="width:${pct}%"></div></div>
                  </div>
                `
              })
              .join('')}
          </div>
        </section>`
            : ''
        }

        ${
          recent.length > 0
            ? `
        <section class="activity-section">
          <div class="section-head">
            <h2 class="section-title">Recent Activity</h2>
            <button class="view-all view-all-grey" data-nav="activity">View all</button>
          </div>
          <div class="activity-card">
            ${recent
              .map((tx) => {
                const cfg = ACTIVITY_TILE[tx.category] || ACTIVITY_TILE.shopping
                return `
                  <div class="activity-row">
                    <span class="activity-tile ${cfg.className}">${cfg.icon}</span>
                    <div class="activity-text">
                      <p class="activity-name">${escapeHtml(tx.notes || '')}</p>
                      <p class="activity-time">${formatActivityTime(tx.timestamp)}</p>
                    </div>
                    <p class="activity-amount">${tx.type === 'out' ? '-' : '+'}${CURRENCY(tx.amount)}</p>
                  </div>
                `
              })
              .join('')}
          </div>
        </section>`
            : ''
        }
      </div>
      ${renderNav('home')}
    </div>
  `
}

// ---------------------------------------------------------------------------
// Log Transaction
// ---------------------------------------------------------------------------
function renderLog() {
  const data = state.data
  const type = state.logType || 'in'
  const jar = state.logJar || 'save'

  const jarOptions = [
    { id: 'save', name: 'Save' },
    { id: 'spend', name: 'Spend' },
    { id: 'give', name: 'Give' },
    ...data.goals.map((g) => ({ id: g.id, name: g.name })),
  ]

  return `
    <div class="page log-transaction-page">
      ${renderStatusBar()}
      <header class="header" style="display:flex;align-items:center;justify-content:center;position:relative;padding:16px;">
        <button class="close-btn" data-nav="home" style="position:absolute;left:16px;">✕</button>
        <h1 style="font-family:var(--font-primary);font-size:20px;">Log Transaction</h1>
      </header>

      <form class="transaction-form" id="tx-form">
        <fieldset class="type-toggle">
          <legend>Transaction Type</legend>
          <label class="${type === 'in' ? 'active' : ''}">
            <input type="radio" name="type" value="in" ${type === 'in' ? 'checked' : ''} /> Money In
          </label>
          <label class="${type === 'out' ? 'active' : ''}">
            <input type="radio" name="type" value="out" ${type === 'out' ? 'checked' : ''} /> Spend
          </label>
        </fieldset>

        <div class="form-group">
          <label for="amount">Amount (₹)</label>
          <input id="amount" name="amount" type="number" inputmode="decimal" step="0.01" min="0" max="999999" placeholder="0.00" required />
        </div>

        <div class="form-group">
          <label for="jar">Allocate to Jar</label>
          <select id="jar" name="jar">
            ${jarOptions.map((o) => `<option value="${o.id}" ${o.id === jar ? 'selected' : ''}>${escapeHtml(o.name)}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label for="notes">Notes (optional)</label>
          <input id="notes" name="notes" type="text" placeholder="What's this for?" />
        </div>

        <button type="submit" class="btn btn-primary">Log Transaction</button>
        <button type="button" class="btn btn-secondary" data-nav="home">Cancel</button>
      </form>
    </div>
  `
}

function bindLog(root) {
  const form = root.querySelector('#tx-form')
  form.querySelectorAll('input[name="type"]').forEach((input) => {
    input.addEventListener('change', (e) => {
      state.logType = e.target.value
      render()
    })
  })
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const amount = parseFloat(form.amount.value)
    if (!form.amount.value || !Number.isFinite(amount) || amount <= 0) return
    const jarVal = form.jar.value
    const isGoal = !state.data.jars[jarVal]
    addTransaction({
      type: state.logType || 'in',
      amount: Math.min(amount, 999999),
      jar: isGoal ? Number(jarVal) || jarVal : jarVal,
      notes: form.notes.value,
      category: (state.logType || 'in') === 'out' ? 'general' : undefined,
    })
    state.logType = 'in'
    navigate('home')
  })
}

// ---------------------------------------------------------------------------
// Goals
// ---------------------------------------------------------------------------
function renderGoals() {
  const data = state.data
  const showForm = !!state.showNewGoalForm
  const totalSaved = data.goals.reduce((sum, g) => sum + g.currentAmount, 0)

  return `
    <div class="page savings-goals-page">
      ${renderStatusBar()}
      <div class="goals-content">
        <h1 class="goals-title">Goals</h1>

        <div class="goals-summary-card">
          <p class="summary-label">Total Saved towards Goals</p>
          <p class="summary-amount">${CURRENCY(totalSaved, 0)}</p>
        </div>

        ${
          showForm
            ? `
        <form class="goal-form" id="goal-form">
          <div class="form-group">
            <label for="goal-name">Goal Name</label>
            <input id="goal-name" name="goalName" type="text" placeholder="e.g., New Bike, Gaming Console" required />
          </div>
          <div class="form-group">
            <label for="goal-amount">Target Amount (₹)</label>
            <input id="goal-amount" name="goalAmount" type="number" inputmode="decimal" step="0.01" min="0" max="9999999" placeholder="0.00" required />
          </div>
          <button type="submit" class="btn btn-primary">Create Goal</button>
          <button type="button" class="btn btn-secondary" data-cancel-goal-form>Cancel</button>
        </form>`
            : ''
        }

        <div class="goals-list">
          ${
            data.goals.length === 0 && !showForm
              ? `<p class="empty-note">No goals yet. Create your first one below.</p>`
              : ''
          }
          ${data.goals
            .map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
              return `
                <div class="goal-row-card">
                  <button type="button" class="goal-row-delete" data-delete-goal="${goal.id}" aria-label="Delete ${escapeHtml(goal.name)}">✕</button>
                  <div class="goal-row-top">
                    <span class="goal-avatar">${initialsFor(goal.name)}</span>
                    <div class="goal-row-info">
                      <p class="goal-row-name">${escapeHtml(goal.name)}</p>
                      <p class="goal-row-amounts">${CURRENCY(goal.currentAmount, 0)}<span class="goal-row-target"> / ${CURRENCY(goal.targetAmount, 0)}</span></p>
                    </div>
                    <button type="button" class="goal-add-btn" data-add-funds="${goal.id}" aria-label="Add funds to ${escapeHtml(goal.name)}">+</button>
                  </div>
                  <div class="goal-row-track"><div class="goal-row-fill" style="width:${pct}%"></div></div>
                </div>
              `
            })
            .join('')}
        </div>

        ${!showForm ? `<button class="create-goal-btn" data-new-goal>+ Create New Goal</button>` : ''}
      </div>
      ${renderNav('goals')}
    </div>
  `
}

function bindGoals(root) {
  const newGoalBtn = root.querySelector('[data-new-goal]')
  if (newGoalBtn) newGoalBtn.addEventListener('click', () => { state.showNewGoalForm = true; render() })

  const cancelBtn = root.querySelector('[data-cancel-goal-form]')
  if (cancelBtn) cancelBtn.addEventListener('click', () => { state.showNewGoalForm = false; render() })

  const form = root.querySelector('#goal-form')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const name = form.goalName.value
      const amount = parseFloat(form.goalAmount.value)
      if (!name || !Number.isFinite(amount) || amount <= 0) return
      addGoal({ name, targetAmount: Math.min(amount, 9999999) })
      state.showNewGoalForm = false
      render()
    })
  }

  root.querySelectorAll('[data-add-funds]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.addFunds)
      const goal = state.data.goals.find((g) => g.id === id)
      if (!goal) return
      const input = window.prompt(`Add how much to "${goal.name}"?`)
      if (!input) return
      const parsed = parseFloat(input)
      if (!Number.isFinite(parsed) || parsed <= 0) return
      updateGoal(id, { currentAmount: goal.currentAmount + Math.min(parsed, 999999) })
      render()
    })
  })
}

// ---------------------------------------------------------------------------
// Activities
// ---------------------------------------------------------------------------
const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const JAR_META = { spend: { label: 'Spend', tile: 'tile-spend' }, save: { label: 'Save', tile: 'tile-save' }, give: { label: 'Give', tile: 'tile-give' } }

const INDIAN_NAMES = ['Aarav Sharma', 'Priya Patel', 'Rohan Mehta', 'Ananya Iyer', 'Vihaan Gupta', 'Diya Nair', 'Arjun Reddy', 'Ishaan Verma', 'Kavya Rao', 'Saanvi Joshi']

function nameForTx(tx, idx) {
  const seed = typeof tx.id === 'number' ? tx.id : idx
  return INDIAN_NAMES[seed % INDIAN_NAMES.length]
}

function formatTxMeta(tx) {
  const d = new Date(tx.timestamp)
  const now = new Date()
  const yest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
  const jarLabel = (JAR_META[tx.jar]?.label || 'Goal').toUpperCase()
  let when
  if (d.toDateString() === now.toDateString()) when = `TODAY, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
  else if (d.toDateString() === yest.toDateString()) when = 'YESTERDAY'
  else when = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }).toUpperCase()
  return `${jarLabel} • ${when}`
}

const CATEGORIES = [
  { key: 'food', label: 'Food & Drink', icon: Icon.utensils(19), tile: 'cat-tile-food', amount: 320.5, pct: 80, badge: 'HIGH', badgeClass: 'badge-high-orange', bar: 'cat-bar-food' },
  { key: 'shopping', label: 'Shopping', icon: Icon.bag(19), tile: 'cat-tile-shopping', amount: 240.0, pct: 80, badge: 'HIGH', badgeClass: 'badge-high-pink', bar: 'cat-bar-shopping' },
  { key: 'transport', label: 'Transport', icon: Icon.car(19), tile: 'cat-tile-transport', amount: 180.0, pct: 72, badge: 'MAINTAINED', badgeClass: 'badge-maintained', bar: 'cat-bar-transport' },
  { key: 'bills', label: 'Bills', icon: Icon.phone(19), tile: 'cat-tile-bills', amount: 100.0, pct: 20, badge: 'LOW', badgeClass: 'badge-low', bar: 'cat-bar-bills' },
]

function renderActivity() {
  const data = state.data
  const query = state.activityQuery || ''
  const transactions = data.transactions || []

  const filtered = query.trim()
    ? transactions.filter((tx) => (tx.notes || '').toLowerCase().includes(query.toLowerCase()) || (tx.jar || '').toLowerCase().includes(query.toLowerCase()))
    : transactions
  const visible = filtered.slice(0, 3)

  const spendTx = transactions.filter((tx) => tx.type === 'out')

  const weekly = Array(7).fill(0)
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
  spendTx.forEach((tx) => {
    const d = new Date(tx.timestamp)
    if (d >= weekAgo && d <= now) weekly[d.getDay()] += tx.amount
  })
  const maxWeekly = Math.max(...weekly, 1)
  const peakDayIdx = weekly.indexOf(maxWeekly)

  const totalMonthSpend = spendTx.reduce((sum, tx) => sum + tx.amount, 0)
  const steps = 6
  let trendPoints = Array(steps).fill(50)
  if (totalMonthSpend > 0) {
    const sorted = [...spendTx].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    let running = 0
    const cum = sorted.map((tx) => (running += tx.amount))
    if (cum.length > 0) {
      trendPoints = Array.from({ length: steps }, (_, i) => {
        const idx = Math.min(cum.length - 1, Math.floor((i / (steps - 1)) * (cum.length - 1)))
        return cum[idx]
      })
    }
  }
  const maxTrend = Math.max(...trendPoints, 1)
  const chartW = 320
  const chartH = 90
  const pathD = trendPoints
    .map((v, i) => {
      const x = (i / (trendPoints.length - 1)) * chartW
      const y = chartH - (v / maxTrend) * (chartH - 10) - 5
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  const areaD = `${pathD} L${chartW},${chartH} L0,${chartH} Z`

  const jarSpend = Object.keys(data.jars).map((key) => ({
    key,
    name: data.jars[key].name,
    spent: spendTx.filter((tx) => tx.jar === key).reduce((s, tx) => s + tx.amount, 0),
  }))
  const latestTx = transactions[0]
  const busiestJar = [...jarSpend].sort((a, b) => b.spent - a.spent)[0]

  return `
    <div class="page activities-page">
      ${renderStatusBar()}
      <div class="activities-content">
        <h1 class="activities-title">Activity</h1>

        <section class="tx-section">
          <div class="section-head"><h2 class="section-title-sm">Transactions</h2></div>

          <div class="search-row">
            <div class="search-bar">
              ${Icon.search(17)}
              <input type="text" id="activity-search" placeholder="Search..." value="${escapeHtml(query)}" />
            </div>
            <button class="filter-btn" aria-label="Filter">${Icon.filter(17)}</button>
          </div>

          <div class="tx-card">
            ${
              visible.length === 0
                ? `<p class="empty-note">No transactions yet. Log one to see it here.</p>`
                : visible
                    .map((tx, idx) => {
                      const meta = JAR_META[tx.jar] || { tile: 'tile-give' }
                      const name = nameForTx(tx, idx)
                      return `
                        <div class="tx-row">
                          <span class="tx-tile ${meta.tile}">${initialsFor(name)}</span>
                          <div class="tx-text">
                            <p class="tx-name">${escapeHtml(name)}</p>
                            <p class="tx-meta">${formatTxMeta(tx)}</p>
                          </div>
                          <p class="tx-amount ${tx.type === 'out' ? 'neg' : 'pos'}">${tx.type === 'out' ? '-' : '+'}${CURRENCY(tx.amount)}</p>
                        </div>
                      `
                    })
                    .join('')
            }
          </div>

          <button class="view-more-link view-more-centered" data-nav="log">View more ${Icon.chevronRight(16)}</button>
        </section>

        <section class="alerts-section">
          <div class="section-head">
            <h2 class="section-title-sm">Alerts &amp; Attention</h2>
            <button class="see-all-link">See all ${Icon.chevronRight(16)}</button>
          </div>

          <button class="alert-card" type="button" data-nav="log">
            <span class="alert-icon alert-icon-warning">${Icon.alertTriangle()}</span>
            <span class="alert-text">
              <span class="alert-title">Review Transaction</span>
              <span class="alert-desc">${
                latestTx
                  ? `${latestTx.type === 'out' ? 'Spend' : 'Money in'} of ${CURRENCY(latestTx.amount)} — ${escapeHtml(latestTx.notes || 'no note added')}`
                  : 'No recent transactions to review yet'
              }</span>
            </span>
            ${Icon.chevronRight()}
          </button>

          <button class="alert-card" type="button" data-nav="goals">
            <span class="alert-icon alert-icon-bell">${Icon.bell(17)}</span>
            <span class="alert-text">
              <span class="alert-title">Budget Alert</span>
              <span class="alert-desc">${
                busiestJar && busiestJar.spent > 0 ? `${escapeHtml(busiestJar.name)} jar has seen the most activity this month` : 'Nothing looking unusual right now'
              }</span>
            </span>
            ${Icon.chevronRight()}
          </button>
        </section>

        <section class="monthly-section">
          <div class="section-head">
            <h2 class="section-title-sm">Monthly Overview</h2>
            <button class="month-pill">This Month ${Icon.chevronRight(14)}</button>
          </div>
          <div class="monthly-card">
            <div class="monthly-top">
              <div>
                <p class="monthly-label">${new Date().toLocaleDateString('en-IN', { month: 'long' })} Spend</p>
                <p class="monthly-range">1st - ${new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()}th</p>
              </div>
            </div>
            <svg class="trend-svg" viewBox="0 0 ${chartW} ${chartH}" preserveAspectRatio="none">
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--purple-bright)" stop-opacity="0.28"/>
                  <stop offset="100%" stop-color="var(--purple-bright)" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="${areaD}" fill="url(#trendFill)" stroke="none"/>
              <path d="${pathD}" fill="none" stroke="var(--purple-bright)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </section>

        <section class="weekly-section">
          <h2 class="section-title-sm">Weekly Breakdown</h2>
          <div class="weekly-card">
            <div class="weekly-bars">
              ${weekly
                .map((val, i) => {
                  const isPeak = i === peakDayIdx && val > 0
                  const heightPct = Math.max(6, Math.round((val / maxWeekly) * 100))
                  return `
                    <div class="weekly-col">
                      ${isPeak ? `<span class="weekly-bubble">₹${Math.round(val)}</span>` : ''}
                      <div class="weekly-track"><div class="weekly-fill ${isPeak ? 'weekly-fill-peak' : ''}" style="height:${heightPct}%"></div></div>
                      <span class="weekly-day ${isPeak ? 'weekly-day-peak' : ''}">${DAY_LABELS[i]}</span>
                    </div>
                  `
                })
                .join('')}
            </div>
          </div>
        </section>

        <section class="cat-section">
          <div class="section-head">
            <h2 class="section-title-sm">Categories</h2>
            <button class="see-all-link">See all ${Icon.chevronRight(16)}</button>
          </div>
          ${CATEGORIES.map(
            (cat) => `
            <div class="cat-card">
              <div class="cat-top">
                <span class="cat-tile ${cat.tile}">${cat.icon}</span>
                <div class="cat-info"><p class="cat-name">${cat.label}</p></div>
                <div class="cat-amounts">
                  <p class="cat-amount">${CURRENCY(cat.amount)}</p>
                  <span class="cat-badge ${cat.badgeClass}">${cat.badge}</span>
                </div>
              </div>
              <div class="cat-track"><div class="cat-fill ${cat.bar}" style="width:${cat.pct}%"></div></div>
            </div>
          `
          ).join('')}
        </section>
      </div>
      ${renderNav('activity')}
    </div>
  `
}

function bindActivity(root) {
  const search = root.querySelector('#activity-search')
  if (search) {
    search.addEventListener('input', (e) => {
      state.activityQuery = e.target.value
      render()
      root.querySelector('#activity-search')?.focus()
    })
  }
}

// ---------------------------------------------------------------------------
// Root render + event delegation
// ---------------------------------------------------------------------------
function render() {
  const root = document.getElementById('root')
  switch (state.page) {
    case 'log':
      root.innerHTML = renderLog()
      bindLog(root)
      break
    case 'goals':
      root.innerHTML = renderGoals()
      bindGoals(root)
      break
    case 'activity':
      root.innerHTML = renderActivity()
      bindActivity(root)
      break
    default:
      root.innerHTML = renderHome()
  }

  // Shared nav/delete bindings present on every screen.
  root.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', () => navigate(el.dataset.nav))
  })
  root.querySelectorAll('[data-delete-goal]').forEach((el) => {
    if (el.hasAttribute('data-bound')) return
    el.setAttribute('data-bound', '1')
    el.addEventListener('click', () => {
      deleteGoal(Number(el.dataset.deleteGoal))
      render()
    })
  })
}

render()
