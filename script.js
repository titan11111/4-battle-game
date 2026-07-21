/* 魔王復活アリーナ — メインロジック */

const TOTAL_WAVES = 9;

/** 第1〜9戦。魔王が頂点。属性: fire / ice / thunder */
const WAVE_ENEMIES = [
  { name: 'スライム', hp: 40, attack: 8, defense: 0, image: 'images/suraimu.png', actions: ['attack', 'attack', 'attack'], weakTo: 'fire', resist: 'ice' },
  { name: 'ゴブリン', hp: 58, attack: 11, defense: 1, image: 'images/goburin.png', actions: ['attack', 'attack', 'strongAttack'], weakTo: 'thunder', resist: null },
  { name: 'スケルトン', hp: 74, attack: 14, defense: 2, image: 'images/sukeruton.png', actions: ['attack', 'strongAttack', 'attack'], weakTo: 'fire', resist: 'ice' },
  { name: 'ゾンビ', hp: 92, attack: 16, defense: 3, image: 'images/zonbi.png', actions: ['attack', 'attack', 'strongAttack'], weakTo: 'fire', resist: 'ice' },
  { name: 'おばけ大木', hp: 115, attack: 19, defense: 5, image: 'images/bajegi.png', actions: ['attack', 'strongAttack', 'attack'], weakTo: 'fire', resist: 'thunder' },
  { name: '魔女', hp: 130, attack: 22, defense: 4, image: 'images/majo.png', actions: ['attack', 'magicAttack', 'magicAttack'], weakTo: 'thunder', resist: 'fire' },
  { name: 'ナイト', hp: 160, attack: 26, defense: 8, image: 'images/naito.png', actions: ['attack', 'strongAttack', 'attack'], weakTo: 'thunder', resist: null },
  { name: '破壊ロボ', hp: 185, attack: 29, defense: 10, image: 'images/robo.png', actions: ['attack', 'magicAttack', 'strongAttack'], weakTo: 'thunder', resist: 'ice' },
  { name: 'みにどらご', hp: 220, attack: 33, defense: 11, image: 'images/summon_5.png', actions: ['attack', 'magicAttack', 'strongAttack'], weakTo: 'ice', resist: 'fire' }
];

const BOSS = {
  name: '魔王',
  hp: 540,
  attack: 42,
  defense: 16,
  image: 'images/maou.png',
  isBoss: true,
  actions: ['attack', 'strongAttack', 'magicAttack', 'strongAttack'],
  weakTo: 'ice',
  resist: 'fire'
};

const ELEMENT_LABEL = { fire: '炎', ice: '氷', thunder: '雷' };

/** 戦ごとに中身が違う4択（剣/盾/魔法/どうぐ） */
const WAVE_REWARDS = [
  [
    { type: 'sword', icon: '⚔️', id: 'r1_sword', name: '木の剣', desc: '攻撃力 +3', atk: 3 },
    { type: 'shield', icon: '🛡️', id: 'r1_shield', name: '木の盾', desc: '防御力 +2', def: 2 },
    { type: 'magic', icon: '🔮', id: 'r1_magic', name: '火の火花', desc: '魔力 +3 / ヒノカゲ習得', mag: 3, spell: { name: 'ヒノカゲ', base: 20, mp: 5, element: 'fire' } },
    { type: 'item', icon: '🎒', id: 'r1_item', name: '薬草', desc: 'どうぐ：HPを35回復', kind: 'heal', amount: 35 }
  ],
  [
    { type: 'sword', icon: '⚔️', id: 'r2_sword', name: 'ブロンズの剣', desc: '攻撃力 +4', atk: 4 },
    { type: 'shield', icon: '🛡️', id: 'r2_shield', name: '革の盾', desc: '防御力 +3', def: 3 },
    { type: 'magic', icon: '🔮', id: 'r2_magic', name: '癒しの雫', desc: '魔力 +2 / 回復量+10', mag: 2, healBoost: 10 },
    { type: 'item', icon: '🎒', id: 'r2_item', name: '力の種', desc: '最大HP +20（即時）', kind: 'maxHp', amount: 20 }
  ],
  [
    { type: 'sword', icon: '⚔️', id: 'r3_sword', name: '鉄の剣', desc: '攻撃力 +5', atk: 5 },
    { type: 'shield', icon: '🛡️', id: 'r3_shield', name: '鉄の盾', desc: '防御力 +4', def: 4 },
    { type: 'magic', icon: '🔮', id: 'r3_magic', name: '氷の欠片', desc: '魔力 +5 / ユキハネ習得', mag: 5, spell: { name: 'ユキハネ', base: 28, mp: 7, element: 'ice' } },
    { type: 'item', icon: '🎒', id: 'r3_item', name: 'ポーション', desc: 'どうぐ：HPを55回復', kind: 'heal', amount: 55 }
  ],
  [
    { type: 'sword', icon: '⚔️', id: 'r4_sword', name: '騎士の剣', desc: '攻撃力 +5', atk: 5 },
    { type: 'shield', icon: '🛡️', id: 'r4_shield', name: '騎士の盾', desc: '防御力 +4', def: 4 },
    { type: 'magic', icon: '🔮', id: 'r4_magic', name: '魔力の環', desc: '魔力 +6', mag: 6 },
    { type: 'item', icon: '🎒', id: 'r4_item', name: '魔力の雫', desc: '最大MP +12（即時）', kind: 'maxMp', amount: 12 }
  ],
  [
    { type: 'sword', icon: '⚔️', id: 'r5_sword', name: '鋼の剣', desc: '攻撃力 +6', atk: 6 },
    { type: 'shield', icon: '🛡️', id: 'r5_shield', name: '鋼の盾', desc: '防御力 +5', def: 5 },
    { type: 'magic', icon: '🔮', id: 'r5_magic', name: '雷鳴の書', desc: '魔力 +7 / イカヅチ習得', mag: 7, spell: { name: 'イカヅチ', base: 38, mp: 11, element: 'thunder' } },
    { type: 'item', icon: '🎒', id: 'r5_item', name: '守護の護符', desc: 'どうぐ：次の被ダメ1回無効', kind: 'guard' }
  ],
  [
    { type: 'sword', icon: '⚔️', id: 'r6_sword', name: '炎の刃', desc: '攻撃力 +7', atk: 7 },
    { type: 'shield', icon: '🛡️', id: 'r6_shield', name: '銀の盾', desc: '防御力 +6', def: 6 },
    { type: 'magic', icon: '🔮', id: 'r6_magic', name: '聖なる光', desc: '魔力 +5 / 回復量+18', mag: 5, healBoost: 18 },
    { type: 'item', icon: '🎒', id: 'r6_item', name: 'ハイポーション', desc: 'どうぐ：HPを80回復', kind: 'heal', amount: 80 }
  ],
  [
    { type: 'sword', icon: '⚔️', id: 'r7_sword', name: 'ルーンソード', desc: '攻撃力 +8', atk: 8 },
    { type: 'shield', icon: '🛡️', id: 'r7_shield', name: 'ルーンシールド', desc: '防御力 +7', def: 7 },
    { type: 'magic', icon: '🔮', id: 'r7_magic', name: '闇の契約', desc: '魔力 +9', mag: 9 },
    { type: 'item', icon: '🎒', id: 'r7_item', name: '生命の実', desc: '最大HP +30（即時）', kind: 'maxHp', amount: 30 }
  ],
  [
    { type: 'sword', icon: '⚔️', id: 'r8_sword', name: '竜牙の剣', desc: '攻撃力 +9', atk: 9 },
    { type: 'shield', icon: '🛡️', id: 'r8_shield', name: '竜鱗の盾', desc: '防御力 +8', def: 8 },
    { type: 'magic', icon: '🔮', id: 'r8_magic', name: 'ホムラギの書', desc: '魔力 +10 / 最強炎魔法', mag: 10, spell: { name: 'ホムラギ', base: 58, mp: 16, element: 'fire' } },
    { type: 'item', icon: '🎒', id: 'r8_item', name: 'エリクサー', desc: 'どうぐ：HP・MP全回復', kind: 'full' }
  ],
  [
    { type: 'sword', icon: '⚔️', id: 'r9_sword', name: '魔剣クロノス', desc: '攻撃力 +12', atk: 12 },
    { type: 'shield', icon: '🛡️', id: 'r9_shield', name: '黒曜の盾', desc: '防御力 +10', def: 10 },
    { type: 'magic', icon: '🔮', id: 'r9_magic', name: '封印の杖', desc: '魔力 +12 / ホムラギ強化', mag: 12, spell: { name: 'ホムラギ', base: 70, mp: 18, element: 'fire' } },
    { type: 'item', icon: '🎒', id: 'r9_item', name: '女神の護符', desc: 'どうぐ：被ダメ2回無効', kind: 'guard2' }
  ]
];

let player = null;
let currentEnemy = null;
let waveIndex = 0;
let gameState = 'title';
let isPlayerTurn = true;
let isMuted = false;
let pending = false;
let guardCharges = 0;

let bgm = null;
let bossBgm = null;
let levelupSound = null;
let attackPlayerSound = null;
let attackEnemySound = null;
let gameoverSound = null;
let audioCtx = null;
let messageFeed = null;
let mdBgm = null;

function getMdBgm() {
  if (!mdBgm && typeof MegaDriveBgm === 'function') {
    mdBgm = new MegaDriveBgm();
  }
  return mdBgm;
}

function playSceneBgm(theme) {
  const engine = getMdBgm();
  if (!engine || isMuted) return;
  pauseAllBgm();
  engine.setMuted(false);
  engine.setVolumeScale(Number($('volume-slider').value) / 100);
  engine.play(theme);
}

function stopSceneBgm() {
  const engine = getMdBgm();
  if (engine) engine.stop();
}

function $(id) {
  return document.getElementById(id);
}

function showScreen(id) {
  ['title-screen', 'story-screen', 'battle-screen', 'reward-screen', 'result-screen'].forEach((sid) => {
    const el = $(sid);
    if (el) el.hidden = sid !== id;
  });
}

function vibrate(ms = 15) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function ensureAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

/** UIクリック音（Web Audio） */
function playClick() {
  if (isMuted) return;
  try {
    const ctx = ensureAudioCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(440, t + 0.05);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.08, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  } catch (_) {
    /* ignore */
  }
}

function playConfirm() {
  if (isMuted) return;
  try {
    const ctx = ensureAudioCtx();
    const t = ctx.currentTime;
    [523, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.07, t + i * 0.05 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.05 + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t + i * 0.05);
      osc.stop(t + i * 0.05 + 0.12);
    });
  } catch (_) {
    /* ignore */
  }
}

/**
 * 固定枠メッセージ送り
 * - async/await キュー
 * - タイプライター
 * - タップで早送り／次へ
 */
class MessageFeed {
  constructor() {
    this.queue = Promise.resolve();
    this.skipRequested = false;
    this.waitingAdvance = false;
    this.resolveAdvance = null;
    this.aborted = false;

    this.speakerEl = $('message-speaker');
    this.textEl = $('message-text');
    this.cursorEl = $('message-cursor');
    this.windowEl = $('message-window');

    if (this.windowEl) {
      this.windowEl.addEventListener('pointerdown', () => this.onTap());
    }
  }

  onTap() {
    this.skipRequested = true;
    if (this.waitingAdvance && this.resolveAdvance) {
      this.waitingAdvance = false;
      const done = this.resolveAdvance;
      this.resolveAdvance = null;
      done();
    }
  }

  reset() {
    this.aborted = true;
    this.skipRequested = true;
    if (this.resolveAdvance) this.resolveAdvance();
    this.queue = Promise.resolve();
    this.aborted = false;
    this.skipRequested = false;
    this.waitingAdvance = false;
    this.resolveAdvance = null;
    if (this.speakerEl) this.speakerEl.textContent = '';
    if (this.textEl) {
      this.textEl.textContent = '';
      this.textEl.className = 'message-text';
    }
    if (this.cursorEl) this.cursorEl.hidden = true;
  }

  /** 外部から待つ用：キューに積んで完了まで await */
  say(message, options = {}) {
    const task = () => this._play(message, options);
    this.queue = this.queue.then(task, task);
    return this.queue;
  }

  async _play(message, options) {
    if (this.aborted) return;
    const {
      speaker = '',
      tone = '',
      holdMs = 700,
      charMs = 28,
      clearAfter = true
    } = options;

    this.skipRequested = false;
    if (this.speakerEl) {
      this.speakerEl.textContent = speaker || '';
      this.speakerEl.hidden = !speaker;
    }
    if (this.textEl) {
      this.textEl.textContent = '';
      this.textEl.className = `message-text${tone ? ` tone-${tone}` : ''} is-typing`;
    }
    if (this.cursorEl) this.cursorEl.hidden = true;

    // タイプライター
    for (let i = 0; i < message.length; i++) {
      if (this.aborted) return;
      if (this.skipRequested) {
        if (this.textEl) this.textEl.textContent = message;
        break;
      }
      if (this.textEl) this.textEl.textContent = message.slice(0, i + 1);
      await sleep(charMs);
    }

    if (this.textEl) this.textEl.classList.remove('is-typing');
    if (this.cursorEl) this.cursorEl.hidden = false;

    // 表示キープ（タップで即送り可）
    this.skipRequested = false;
    await Promise.race([
      sleep(holdMs),
      new Promise((resolve) => {
        this.waitingAdvance = true;
        this.resolveAdvance = resolve;
      })
    ]);
    this.waitingAdvance = false;
    this.resolveAdvance = null;
    if (this.cursorEl) this.cursorEl.hidden = true;

    if (clearAfter && this.textEl) {
      // 短いフェード代わりに一瞬空白
      this.textEl.textContent = '';
      if (this.speakerEl) this.speakerEl.textContent = '';
      await sleep(80);
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createPlayer() {
  return {
    name: '勇者',
    maxHp: 100,
    hp: 100,
    maxMp: 50,
    mp: 50,
    attack: 18,
    defense: 4,
    magic: 8,
    healPower: 20,
    spells: [],
    items: [],
    picks: { sword: [], shield: [], magic: [], item: [] }
  };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function calcDamage(raw, defense) {
  return Math.max(1, Math.floor(raw - defense * 0.55));
}

function magicDamage(base, magicStat) {
  return Math.floor(base + magicStat * 1.15 + Math.random() * 8);
}

/** 弱点1.7 / 耐性0.45 / それ以外0.85（物理より少し抑えめで武器ビルドも選択肢に） */
function elementalMultiplier(element, enemy) {
  if (!element) return 1;
  if (enemy.weakTo === element) return 1.7;
  if (enemy.resist === element) return 0.45;
  return 0.85;
}

function learnSpell(spell) {
  if (!spell) return;
  const existing = player.spells.find((s) => s.name === spell.name);
  if (existing) {
    existing.base = Math.max(existing.base, spell.base);
    existing.mp = spell.mp;
    existing.element = spell.element;
  } else {
    player.spells.push({ ...spell });
  }
}

function pickTier(wave) {
  return Math.max(0, Math.min(wave, WAVE_REWARDS.length - 1));
}

function buildRewards(wave) {
  const idx = pickTier(wave);
  // ディープコピーして毎回同じ参照を汚さない
  return WAVE_REWARDS[idx].map((r) => ({ ...r, spell: r.spell ? { ...r.spell } : undefined }));
}

function applyReward(reward) {
  if (reward.type === 'sword') {
    player.attack += reward.atk;
    player.picks.sword.push(reward.name);
  } else if (reward.type === 'shield') {
    player.defense += reward.def;
    player.picks.shield.push(reward.name);
  } else if (reward.type === 'magic') {
    player.magic += reward.mag;
    player.picks.magic.push(reward.name);
    if (reward.spell) learnSpell(reward.spell);
    if (reward.healBoost) player.healPower += reward.healBoost;
  } else if (reward.type === 'item') {
    player.picks.item.push(reward.name);
    if (reward.kind === 'maxHp') {
      player.maxHp += reward.amount;
      player.hp = player.maxHp;
    } else if (reward.kind === 'maxMp') {
      player.maxMp += reward.amount;
      player.mp = player.maxMp;
    } else if (reward.kind === 'guard2') {
      player.items.push({
        id: reward.id,
        name: reward.name,
        kind: 'guard',
        amount: 0,
        charges: 2
      });
    } else {
      player.items.push({
        id: reward.id,
        name: reward.name,
        kind: reward.kind,
        amount: reward.amount || 0,
        charges: reward.kind === 'guard' ? 1 : 0
      });
    }
  }
  player.hp = clamp(player.hp + Math.floor(player.maxHp * 0.25), 0, player.maxHp);
  player.mp = clamp(player.mp + Math.floor(player.maxMp * 0.2), 0, player.maxMp);
}

function spawnEnemy() {
  const isBoss = waveIndex >= TOTAL_WAVES;
  const data = isBoss ? BOSS : WAVE_ENEMIES[waveIndex];
  currentEnemy = {
    name: data.name,
    maxHp: data.hp,
    hp: data.hp,
    attack: data.attack,
    defense: data.defense != null ? data.defense : Math.floor(waveIndex * 1.2),
    image: data.image,
    isBoss: !!data.isBoss,
    actions: data.actions,
    weakTo: data.weakTo || null,
    resist: data.resist || null
  };
}

function waveLabelText() {
  if (waveIndex >= TOTAL_WAVES) return 'ラスボス戦 — 魔王';
  return `第${waveIndex + 1}戦 / ${TOTAL_WAVES}`;
}

function flashSprite(wrapId, className) {
  const el = $(wrapId);
  if (!el) return;
  el.classList.remove(className);
  // reflow
  void el.offsetWidth;
  el.classList.add(className);
  setTimeout(() => el.classList.remove(className), 400);
}

function floatNumber(target, value, kind) {
  const layer = $(target);
  if (!layer) return;
  const span = document.createElement('span');
  span.className = `float-num ${kind}`;
  span.textContent = kind === 'heal' ? `+${value}` : kind === 'miss' ? 'ガード' : `-${value}`;
  layer.appendChild(span);
  setTimeout(() => span.remove(), 950);
}

function updateDisplay() {
  if (!player || !currentEnemy) return;

  $('player-hp').textContent = String(player.hp);
  $('player-max-hp').textContent = String(player.maxHp);
  $('player-mp').textContent = String(player.mp);
  $('player-max-mp').textContent = String(player.maxMp);
  $('player-atk').textContent = String(player.attack);
  $('player-def').textContent = String(player.defense);
  $('player-mag').textContent = String(player.magic);
  $('player-item-count').textContent = String(player.items.length);

  document.querySelector('.player-hp-fill').style.width = `${(player.hp / player.maxHp) * 100}%`;
  document.querySelector('.player-mp-fill').style.width = `${(player.mp / player.maxMp) * 100}%`;

  $('enemy-name').textContent = currentEnemy.name;
  $('enemy-hp').textContent = String(currentEnemy.hp);
  $('enemy-max-hp').textContent = String(currentEnemy.maxHp);
  document.querySelector('.enemy-hp-fill').style.width = `${(currentEnemy.hp / currentEnemy.maxHp) * 100}%`;

  const img = $('enemy-image');
  if (img && currentEnemy.image) {
    img.src = currentEnemy.image;
    img.alt = currentEnemy.name;
  }

  $('wave-label').textContent = waveLabelText();

  const canAct = gameState === 'battle' && isPlayerTurn && !pending;
  $('btn-attack').disabled = !canAct;
  $('btn-heal').disabled = !canAct || player.mp < 5;
  $('btn-item').disabled = !canAct || player.items.length === 0;

  const magicBtn = $('btn-magic');
  magicBtn.textContent = 'まほう';
  magicBtn.disabled = !canAct || player.spells.length === 0;
}

function getBgmVolume() {
  const slider = $('volume-slider');
  return ((slider ? Number(slider.value) : 40) / 100) * 0.3;
}

function pauseAllBgm() {
  if (bgm) bgm.pause();
  if (bossBgm) bossBgm.pause();
  stopSceneBgm();
}

function playBattleBgm() {
  stopSceneBgm();
  if (!bgm) bgm = $('bgm');
  if (!bossBgm) bossBgm = $('boss-bgm');
  const vol = getBgmVolume();
  if (bgm) bgm.volume = vol;
  if (bossBgm) bossBgm.volume = vol;

  const useBoss = currentEnemy && currentEnemy.isBoss;
  const active = useBoss ? bossBgm : bgm;
  const inactive = useBoss ? bgm : bossBgm;
  if (inactive) {
    inactive.pause();
    inactive.currentTime = 0;
  }
  if (!isMuted && active && gameState === 'battle') {
    active.play().catch(() => {});
  }
}

function initAudioRefs() {
  bgm = $('bgm');
  bossBgm = $('boss-bgm');
  levelupSound = $('levelup-sound');
  attackPlayerSound = $('player-attack-sound');
  attackEnemySound = $('enemy-attack-sound');
  gameoverSound = $('gameover-sound');
  changeVolume();
}

function playSound(audio) {
  if (!audio || isMuted) return;
  try {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (_) {
    /* ignore */
  }
}

function showMagicEffect(element) {
  const effect = $('magic-effect');
  if (!effect) return;
  effect.hidden = false;
  effect.className = `magic-effect ${element || 'holy'}`;
  const enemyImg = $('enemy-image');
  if (enemyImg) {
    const rect = enemyImg.getBoundingClientRect();
    effect.style.position = 'fixed';
    effect.style.top = `${rect.top + rect.height / 2}px`;
    effect.style.left = `${rect.left + rect.width / 2}px`;
  }
  setTimeout(() => {
    effect.hidden = true;
    effect.className = 'magic-effect';
  }, 450);
}

async function startBattle() {
  gameState = 'battle';
  isPlayerTurn = false;
  pending = true;
  const panel = $('choice-panel');
  if (panel) panel.hidden = true;
  if (messageFeed) messageFeed.reset();
  spawnEnemy();
  showScreen('battle-screen');
  updateDisplay();
  playBattleBgm();

  await messageFeed.say(`${currentEnemy.name}が現れた！`, {
    speaker: '',
    tone: 'special',
    holdMs: 900
  });
  if (currentEnemy.isBoss) {
    await messageFeed.say('姫を救う最後の戦い——魔王戦、開始！', {
      speaker: '',
      tone: 'special',
      holdMs: 1000
    });
  }
  isPlayerTurn = true;
  pending = false;
  updateDisplay();
}

async function checkBattleEnd() {
  if (currentEnemy.hp <= 0) {
    pending = true;
    updateDisplay();
    playSound(levelupSound);
    await messageFeed.say(`${currentEnemy.name}を倒した！`, {
      speaker: '',
      tone: 'heal',
      holdMs: 1000
    });
    pauseAllBgm();
    if (currentEnemy.isBoss) {
      await messageFeed.say('奥の間から、光が差し込む……', {
        speaker: '',
        tone: 'special',
        holdMs: 900
      });
      await messageFeed.say('王女を救い出した！', {
        speaker: '',
        tone: 'heal',
        holdMs: 1000
      });
      showResult(true);
    } else {
      showRewardScreen();
    }
    return true;
  }
  if (player.hp <= 0) {
    pending = true;
    updateDisplay();
    playSound(gameoverSound);
    await messageFeed.say('あなたは倒れた...', {
      speaker: '',
      tone: 'damage',
      holdMs: 1100
    });
    pauseAllBgm();
    showResult(false);
    return true;
  }
  return false;
}

async function enemyTurn() {
  if (gameState !== 'battle') return;

  const action = currentEnemy.actions[Math.floor(Math.random() * currentEnemy.actions.length)];
  let mult = 1;
  let label = '攻撃';
  if (action === 'strongAttack') {
    mult = 1.45;
    label = '強攻撃';
  } else if (action === 'magicAttack') {
    mult = 1.25;
    label = '魔法攻撃';
  }

  flashSprite('enemy-sprite-wrap', 'is-attack');

  if (guardCharges > 0) {
    guardCharges -= 1;
    floatNumber('player-float', 0, 'miss');
    await messageFeed.say(`${currentEnemy.name}の${label}！`, {
      speaker: currentEnemy.name,
      tone: 'damage',
      holdMs: 500
    });
    await messageFeed.say('しかし守護の護符が防いだ！', {
      speaker: '勇者',
      tone: 'buff',
      holdMs: 800
    });
    isPlayerTurn = true;
    pending = false;
    updateDisplay();
    return;
  }

  const raw = currentEnemy.attack * mult + Math.floor(Math.random() * 6);
  const dmg = calcDamage(raw, player.defense);
  player.hp = clamp(player.hp - dmg, 0, player.maxHp);
  playSound(attackEnemySound);
  flashSprite('player-sprite-wrap', 'is-hit');
  floatNumber('player-float', dmg, 'damage');
  updateDisplay();

  await messageFeed.say(`${currentEnemy.name}の${label}！`, {
    speaker: currentEnemy.name,
    tone: 'damage',
    holdMs: 450
  });
  await messageFeed.say(`勇者に ${dmg} のダメージ！`, {
    speaker: '',
    tone: 'damage',
    holdMs: 700
  });

  if (await checkBattleEnd()) return;

  isPlayerTurn = true;
  pending = false;
  updateDisplay();
}

async function afterPlayerAction() {
  if (await checkBattleEnd()) return;
  await enemyTurn();
}

async function playerAttack() {
  if (gameState !== 'battle' || !isPlayerTurn || pending) return;
  pending = true;
  isPlayerTurn = false;
  updateDisplay();

  const raw = player.attack + Math.floor(Math.random() * 8);
  const dmg = calcDamage(raw, currentEnemy.defense);
  currentEnemy.hp = clamp(currentEnemy.hp - dmg, 0, currentEnemy.maxHp);
  playSound(attackPlayerSound);
  flashSprite('player-sprite-wrap', 'is-attack');
  flashSprite('enemy-sprite-wrap', 'is-hit');
  floatNumber('enemy-float', dmg, 'damage');
  updateDisplay();

  await messageFeed.say('勇者の攻撃！', { speaker: '勇者', tone: 'damage', holdMs: 450 });
  await messageFeed.say(`${currentEnemy.name}に ${dmg} のダメージ！`, {
    speaker: '',
    tone: 'damage',
    holdMs: 700
  });
  await afterPlayerAction();
}

async function playerMagic() {
  if (gameState !== 'battle' || !isPlayerTurn || pending) return;
  if (player.spells.length === 0) {
    await messageFeed.say('まだ魔法を覚えていない！', { speaker: '', tone: 'buff', holdMs: 700 });
    return;
  }
  const spell = await openChoicePanel(
    'まほうを選べ',
    player.spells.map((s, index) => {
      const el = ELEMENT_LABEL[s.element] || '無';
      return {
        label: s.name,
        desc: `${el}属性 / MP${s.mp}`,
        disabled: player.mp < s.mp,
        value: index
      };
    }),
    $('btn-magic')
  );
  if (spell == null) return;
  await castSpell(player.spells[spell]);
}

async function castSpell(spell) {
  if (player.mp < spell.mp) {
    await messageFeed.say('MPが足りない！', { speaker: '', tone: 'buff', holdMs: 700 });
    return;
  }
  pending = true;
  isPlayerTurn = false;
  updateDisplay();

  player.mp -= spell.mp;
  const mult = elementalMultiplier(spell.element, currentEnemy);
  let dmg = Math.floor(magicDamage(spell.base, player.magic) * mult);
  dmg = Math.max(1, dmg);
  currentEnemy.hp = clamp(currentEnemy.hp - dmg, 0, currentEnemy.maxHp);
  showMagicEffect(spell.element);
  playSound(attackPlayerSound);
  flashSprite('enemy-sprite-wrap', 'is-hit');
  floatNumber('enemy-float', dmg, 'damage');
  updateDisplay();

  await messageFeed.say(`勇者は ${spell.name} を唱えた！`, {
    speaker: '勇者',
    tone: 'special',
    holdMs: 450
  });
  await messageFeed.say(`${currentEnemy.name}に ${dmg} のダメージ！`, {
    speaker: '',
    tone: 'damage',
    holdMs: 700
  });
  await afterPlayerAction();
}

async function playerHeal() {
  if (gameState !== 'battle' || !isPlayerTurn || pending) return;
  if (player.mp < 5) {
    await messageFeed.say('MPが足りない！', { speaker: '', tone: 'buff', holdMs: 700 });
    return;
  }
  pending = true;
  isPlayerTurn = false;
  updateDisplay();

  player.mp -= 5;
  const heal = player.healPower + Math.floor(Math.random() * 8) + Math.floor(player.magic * 0.3);
  player.hp = clamp(player.hp + heal, 0, player.maxHp);
  floatNumber('player-float', heal, 'heal');
  updateDisplay();

  await messageFeed.say('勇者はかいふくを使った！', { speaker: '勇者', tone: 'heal', holdMs: 450 });
  await messageFeed.say(`HPが ${heal} 回復！`, { speaker: '', tone: 'heal', holdMs: 700 });
  await afterPlayerAction();
}

async function playerItem() {
  if (gameState !== 'battle' || !isPlayerTurn || pending) return;
  if (player.items.length === 0) {
    await messageFeed.say('どうぐを持っていない！', { speaker: '', tone: 'buff', holdMs: 700 });
    return;
  }
  const index = await openChoicePanel(
    'どうぐを選べ',
    player.items.map((item, i) => ({
      label: item.name,
      desc: itemDesc(item),
      disabled: false,
      value: i
    })),
    $('btn-item')
  );
  if (index == null) return;
  await useItemAt(index);
}

function itemDesc(item) {
  if (item.kind === 'heal') return `HPを${item.amount}回復`;
  if (item.kind === 'full') return 'HP・MPを全回復';
  if (item.kind === 'guard') return `被ダメを${item.charges || 1}回無効`;
  return '使う';
}

async function useItemAt(index) {
  if (index < 0 || index >= player.items.length) return;
  pending = true;
  isPlayerTurn = false;
  updateDisplay();

  const item = player.items.splice(index, 1)[0];
  if (item.kind === 'heal') {
    player.hp = clamp(player.hp + item.amount, 0, player.maxHp);
    floatNumber('player-float', item.amount, 'heal');
    await messageFeed.say(`${item.name}を使った！`, { speaker: '勇者', tone: 'heal', holdMs: 450 });
    await messageFeed.say(`HPが ${item.amount} 回復！`, { speaker: '', tone: 'heal', holdMs: 700 });
  } else if (item.kind === 'full') {
    player.hp = player.maxHp;
    player.mp = player.maxMp;
    floatNumber('player-float', player.maxHp, 'heal');
    await messageFeed.say(`${item.name}を使った！`, { speaker: '勇者', tone: 'heal', holdMs: 450 });
    await messageFeed.say('HPとMPが全回復！', { speaker: '', tone: 'heal', holdMs: 700 });
  } else if (item.kind === 'guard') {
    const add = item.charges || 1;
    guardCharges += add;
    await messageFeed.say(`${item.name}を使った！`, { speaker: '勇者', tone: 'buff', holdMs: 450 });
    await messageFeed.say(`次の攻撃を${add}回防ぐ！`, { speaker: '', tone: 'buff', holdMs: 700 });
  } else {
    await messageFeed.say(`${item.name}を使った！`, { speaker: '勇者', tone: 'heal', holdMs: 700 });
  }
  updateDisplay();
  await afterPlayerAction();
}

/** 選択肢パネル。選んだ value を返す。キャンセルは null */
function openChoicePanel(title, options, anchorBtn) {
  return new Promise((resolve) => {
    const panel = $('choice-panel');
    const list = $('choice-list');
    const titleEl = $('choice-title');
    titleEl.textContent = title;
    list.textContent = '';

    const setExpanded = (open) => {
      ['btn-magic', 'btn-item'].forEach((id) => {
        const btn = $(id);
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      if (anchorBtn) anchorBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    const finish = (value) => {
      panel.hidden = true;
      setExpanded(false);
      resolve(value);
    };

    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-option pressable';
      btn.disabled = !!opt.disabled;

      const name = document.createElement('span');
      name.className = 'choice-option-name';
      name.textContent = opt.label;

      const desc = document.createElement('span');
      desc.className = 'choice-option-desc';
      desc.textContent = opt.desc || '';

      btn.appendChild(name);
      btn.appendChild(desc);
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        playClick();
        vibrate(12);
        finish(opt.value);
      });
      list.appendChild(btn);
    });

    const cancel = $('choice-cancel');
    const onCancel = () => {
      cancel.removeEventListener('click', onCancel);
      playClick();
      finish(null);
    };
    cancel.addEventListener('click', onCancel);

    setExpanded(true);
    panel.hidden = false;
    bindPressable(panel);
    requestAnimationFrame(() => {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
}

function showRewardScreen() {
  gameState = 'reward';
  pending = false;
  showScreen('reward-screen');
  playSceneBgm('reward');
  $('reward-lead').textContent =
    `第${waveIndex + 1}戦・${WAVE_ENEMIES[waveIndex].name}撃破！ この戦いの報酬を1つ選べ`;

  const grid = $('reward-grid');
  grid.textContent = '';
  buildRewards(waveIndex).forEach((reward) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'reward-card pressable';
    btn.dataset.type = reward.type;

    const icon = document.createElement('div');
    icon.className = 'reward-icon';
    icon.textContent = reward.icon;

    const name = document.createElement('div');
    name.className = 'reward-name';
    name.textContent = reward.name;

    const desc = document.createElement('div');
    desc.className = 'reward-desc';
    desc.textContent = reward.desc;

    btn.appendChild(icon);
    btn.appendChild(name);
    btn.appendChild(desc);
    btn.addEventListener('click', () => {
      playConfirm();
      vibrate(20);
      applyReward(reward);
      waveIndex += 1;
      startBattle();
    });
    grid.appendChild(btn);
  });
  bindPressable(grid);

  $('current-build').textContent =
    `現在 ATK ${player.attack} / DEF ${player.defense} / MAG ${player.magic} / 魔法${player.spells.length} / どうぐ ${player.items.length}`;
}

function showResult(won) {
  gameState = 'result';
  pending = false;
  showScreen('result-screen');

  const art = $('ending-art');
  const epi = $('ending-epilogue');

  if (won) {
    $('result-title').textContent = '姫の救出';
    $('result-message').textContent =
      '魔王は倒れ、封印の鎖が解ける。囚われていた王女が、光の中に姿を現した。';
    epi.textContent =
      '「ありがとう、勇者よ。あなたの剣と選択が、私を——そしてこの国を救ってくれた。」　めでたし、めでたし。';
    epi.hidden = false;
    if (art) art.hidden = false;
    playSceneBgm('ending');
  } else {
    $('result-title').textContent = '敗退...';
    $('result-message').textContent =
      `あなたは第${Math.min(waveIndex + 1, TOTAL_WAVES + 1)}戦で倒れた。姫はまだアリーナの奥で待っている。装備を選び直し、もう一度挑もう。`;
    epi.textContent = '';
    epi.hidden = true;
    if (art) art.hidden = true;
    stopSceneBgm();
  }
}

function resetToTitle() {
  pauseAllBgm();
  stopSceneBgm();
  if (bgm) bgm.currentTime = 0;
  if (bossBgm) bossBgm.currentTime = 0;
  if (messageFeed) messageFeed.reset();
  player = null;
  currentEnemy = null;
  waveIndex = 0;
  guardCharges = 0;
  pending = false;
  isPlayerTurn = true;
  gameState = 'title';
  showScreen('title-screen');
}

function onTitleStart() {
  playConfirm();
  vibrate();
  initAudioRefs();
  ensureAudioCtx();
  const engine = getMdBgm();
  if (engine) engine.ensure();
  [bgm, bossBgm, levelupSound, attackPlayerSound, attackEnemySound, gameoverSound].forEach((a) => {
    if (!a) return;
    a.play().then(() => {
      a.pause();
      a.currentTime = 0;
    }).catch(() => {});
  });
  gameState = 'story';
  showScreen('story-screen');
  playSceneBgm('prologue');
}

function onStoryStart() {
  playConfirm();
  vibrate();
  stopSceneBgm();
  player = createPlayer();
  waveIndex = 0;
  guardCharges = 0;
  startBattle();
}

function syncMuteUi() {
  const menuBtn = $('audio-menu-btn');
  const muteBtn = $('mute-btn');
  if (menuBtn) menuBtn.textContent = isMuted ? '🔇' : '🔊';
  if (muteBtn) muteBtn.textContent = isMuted ? 'ミュート解除' : 'ミュート';
}

function setAudioDropdownOpen(open) {
  const drop = $('audio-dropdown');
  const btn = $('audio-menu-btn');
  if (!drop || !btn) return;
  drop.hidden = !open;
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function toggleAudioDropdown() {
  playClick();
  vibrate(10);
  const drop = $('audio-dropdown');
  if (!drop) return;
  setAudioDropdownOpen(drop.hidden);
}

function toggleMute() {
  isMuted = !isMuted;
  syncMuteUi();
  try {
    localStorage.setItem('arena-muted', isMuted ? '1' : '0');
  } catch (_) {
    /* ignore */
  }
  const engine = getMdBgm();
  if (engine) engine.setMuted(isMuted);
  if (isMuted) {
    pauseAllBgm();
  } else if (gameState === 'battle') {
    playBattleBgm();
  } else if (gameState === 'story') {
    playSceneBgm('prologue');
  } else if (gameState === 'reward') {
    playSceneBgm('reward');
  } else if (gameState === 'result' && currentEnemy && currentEnemy.isBoss && player && player.hp > 0) {
    playSceneBgm('ending');
  }
}

function changeVolume() {
  const volume = Number($('volume-slider').value) / 100;
  try {
    localStorage.setItem('arena-volume', String($('volume-slider').value));
  } catch (_) {
    /* ignore */
  }
  if (bgm) bgm.volume = volume * 0.3;
  if (bossBgm) bossBgm.volume = volume * 0.3;
  if (levelupSound) levelupSound.volume = volume;
  if (attackPlayerSound) attackPlayerSound.volume = volume;
  if (attackEnemySound) attackEnemySound.volume = volume;
  if (gameoverSound) gameoverSound.volume = volume;
  const engine = getMdBgm();
  if (engine) engine.setVolumeScale(volume);
}

/** 押した感のための pointer フィードバック */
function bindPressable(root = document) {
  root.querySelectorAll('.pressable').forEach((btn) => {
    if (btn.dataset.pressBound) return;
    btn.dataset.pressBound = '1';
    btn.addEventListener('pointerdown', () => {
      if (btn.disabled) return;
      btn.classList.add('is-pressed');
      playClick();
      vibrate(12);
    });
    const clear = () => btn.classList.remove('is-pressed');
    btn.addEventListener('pointerup', clear);
    btn.addEventListener('pointercancel', clear);
    btn.addEventListener('pointerleave', clear);
  });
}

function setupIosGuards() {
  const allowScroll = (target) => {
    if (!target || !target.closest) return false;
    return !!target.closest(
      '.game-container, .choice-list, .story-box, .message-window, .audio-dropdown, input, textarea'
    );
  };

  document.addEventListener('touchmove', (e) => {
    if (allowScroll(e.target)) return;
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('selectstart', (e) => e.preventDefault());
  document.addEventListener('dragstart', (e) => e.preventDefault());
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('dblclick', (e) => e.preventDefault());
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('gesturechange', (e) => e.preventDefault());

  let lastTap = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTap < 300) e.preventDefault();
    lastTap = now;
  }, { passive: false });

  document.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 1) e.preventDefault();
  }, { passive: false });
}

function bindUi() {
  $('title-start-btn').addEventListener('click', onTitleStart);
  $('story-start-btn').addEventListener('click', onStoryStart);
  $('result-restart-btn').addEventListener('click', () => {
    playClick();
    resetToTitle();
  });
  $('btn-attack').addEventListener('click', playerAttack);
  $('btn-magic').addEventListener('click', playerMagic);
  $('btn-heal').addEventListener('click', playerHeal);
  $('btn-item').addEventListener('click', playerItem);
  $('audio-menu-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleAudioDropdown();
  });
  $('mute-btn').addEventListener('click', () => {
    playClick();
    toggleMute();
  });
  $('volume-slider').addEventListener('input', changeVolume);
  document.addEventListener('click', (e) => {
    const controls = $('audio-controls');
    if (!controls || controls.contains(e.target)) return;
    setAudioDropdownOpen(false);
  });
  bindPressable();
}

window.addEventListener('DOMContentLoaded', () => {
  setupIosGuards();
  messageFeed = new MessageFeed();
  bindUi();
  initAudioRefs();
  try {
    const muted = localStorage.getItem('arena-muted') === '1';
    const vol = localStorage.getItem('arena-volume');
    if (vol != null) $('volume-slider').value = vol;
    isMuted = muted;
  } catch (_) {
    /* ignore */
  }
  syncMuteUi();
  setAudioDropdownOpen(false);
  changeVolume();
  showScreen('title-screen');
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseAllBgm();
  } else if (!isMuted) {
    if (gameState === 'battle') playBattleBgm();
    else if (gameState === 'story') playSceneBgm('prologue');
    else if (gameState === 'reward') playSceneBgm('reward');
    else if (gameState === 'result') {
      const art = $('ending-art');
      if (art && !art.hidden) playSceneBgm('ending');
    }
  }
});
