// script.js

// キャラクタークラス
class Character {
    constructor(name, maxHp, maxMp, attack, sprite, level = 1, exp = 0, nextLevelExp = 100) {
        this.name = name;
        this.maxHp = maxHp;
        this.hp = maxHp;
        this.maxMp = maxMp;
        this.mp = maxMp;
        this.attack = attack;
        this.sprite = sprite;
        this.level = level;
        this.exp = exp;
        this.nextLevelExp = nextLevelExp;
        this.knownMagic = [];
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp < 0) this.hp = 0;
    }

    heal(amount) {
        this.hp += amount;
        if (this.hp > this.maxHp) this.hp = this.maxHp;
    }

    useMp(amount) {
        this.mp -= amount;
        if (this.mp < 0) this.mp = 0;
    }

    isAlive() {
        return this.hp > 0;
    }

    addExp(amount) {
        this.exp += amount;
        addLog(`経験値を${amount}獲得した！`);
        this.checkLevelUp();
    }

    checkLevelUp() {
        while (this.exp >= this.nextLevelExp) {
            this.level++;
            this.exp -= this.nextLevelExp;
            this.nextLevelExp = Math.floor(this.nextLevelExp * 1.5);
            this.maxHp += 15;
            this.maxMp += 10;
            this.attack += 5;
            this.hp = this.maxHp;
            this.mp = this.maxMp;
            addLog(`勇者はレベル${this.level}に上がった！`, 'heal');
            playSound(levelupSound);
            this.learnNewMagic();
        }
    }

    learnNewMagic() {
        let newMagic = null;
        switch (this.level) {
            case 3:
                newMagic = { name: 'ファイアー', damage: 20, mpCost: 5, type: 'attack' };
                break;
            case 6:
                newMagic = { name: 'アイスボルト', damage: 25, mpCost: 8, type: 'attack' };
                break;
            case 10:
                newMagic = { name: 'サンダーストーム', damage: 35, mpCost: 15, type: 'attack' };
                break;
            case 15:
                newMagic = { name: 'ホーリーライト', healAmount: 30, mpCost: 12, type: 'heal' };
                break;
        }
        if (newMagic) {
            this.knownMagic.push(newMagic);
            addLog(`勇者は「${newMagic.name}」を覚えた！`, 'heal');
        }
    }
}

// 敵クラス
class Enemy extends Character {
    constructor(name, maxHp, attack, sprite, expReward, isBoss = false) {
        super(name, maxHp, 0, attack, sprite);
        this.expReward = expReward;
        this.isBoss = isBoss;
    }

    getAction() {
        if (this.isBoss) {
            const actions = ['attack', 'strongAttack', 'magicAttack', 'specialAttack'];
            return actions[Math.floor(Math.random() * actions.length)];
        } else {
            const actions = ['attack', 'attack', 'strongAttack'];
            return actions[Math.floor(Math.random() * actions.length)];
        }
    }
}

// ゲーム状態変数
let player;
let currentEnemy;
let gameState = 'battle';
let isPlayerTurn = true;
let actionQueue = [];
let currentLogIndex = 0;
let logMessages = [];
let logTimer = null;

const enemyData = [
    { name: 'ゴブリン', hp: 60, attack: 10, sprite: '👹', image: 'images/goburin.png', exp: 25 },
    { name: 'オーク', hp: 90, attack: 15, sprite: '👺', image: 'images/orc.png', exp: 40 },
    { name: 'スケルトン', hp: 70, attack: 12, sprite: '💀', image: 'images/skeleton.png', exp: 35 },
    { name: 'ミミック', hp: 100, attack: 18, sprite: '', image: 'images/mimic.png', exp: 50 }, // 修正: .jpg -> .png
    { name: 'リトルドラゴン', hp: 120, attack: 20, sprite: '', image: 'images/summon_5.png', exp: 60 }, // 修正: .jpg -> .png
    { name: 'ファングウルフ', hp: 85, attack: 16, sprite: '', image: 'images/summon_2.png', exp: 45 },
    { name: 'ロックゴーレム', hp: 150, attack: 22, sprite: '', image: 'images/summon_4.png', exp: 70 }, // 修正: .jpg -> .png
    { name: 'ゾンビ', hp: 75, attack: 13, sprite: '', image: 'images/zonbi.png', exp: 38 },
    { name: 'ゴースト', hp: 80, attack: 14, sprite: '👻', image: 'images/ghost.png', exp: 45 }
];

const bossData = {
    name: '魔王', 
    hp: 300, 
    attack: 35, 
    sprite: '👑', 
    image: 'images/Gemini_Generated_Image_71sr7j71sr.png', // 修正: demonking.png -> Gemini_Generated_Image_71sr7j71sr.png
    exp: 200
};

// 音声
let bgm = null;
let levelupSound = null;
let isMuted = false;

// 初期化
function initGame() {
    if (!player) {
        player = new Character('勇者', 100, 50, 20, '🛡️');
    } else {
        // プレイヤーのHPとMPは毎戦闘開始時に全回復
        player.hp = player.maxHp;
        player.mp = player.maxMp;
    }

    // レベル20で魔王登場
    if (player.level >= 20) {
        currentEnemy = new Enemy(bossData.name, bossData.hp, bossData.attack, bossData.sprite, bossData.exp, true);
        currentEnemy.image = bossData.image;
    } else {
        const enemyTemplate = enemyData[Math.floor(Math.random() * enemyData.length)];
        currentEnemy = new Enemy(enemyTemplate.name, enemyTemplate.hp, enemyTemplate.attack, enemyTemplate.sprite, enemyTemplate.exp);
        currentEnemy.image = enemyTemplate.image;
    }

    gameState = 'battle';
    isPlayerTurn = true;
    actionQueue = [];
    logMessages = [];
    currentLogIndex = 0;
    clearLogTimer();

    updateDisplay();
    addLog(`${currentEnemy.name}が現れた！`);
}

function initAudio() {
    if (!bgm) {
        bgm = document.getElementById('bgm');
        levelupSound = document.getElementById('levelup-sound');
    }
    // ここではBGMの再生/停止は行わず、toggleMute()または startGame() で制御
    const volume = document.getElementById('volume-slider').value / 100;
    if (bgm) bgm.volume = volume * 0.3;
    if (levelupSound) levelupSound.volume = volume;
    if (bgm && !isMuted && gameState === 'battle') { // BGMがすでに再生中でなければ再生
        bgm.play().catch(e => console.log('BGM play failed:', e));
    }
}

function stopAllSounds() {
    if (bgm) { bgm.pause(); /* bgm.currentTime = 0; */ } // 戦闘継続のためcurrentTimeはリセットしない
    if (levelupSound) { levelupSound.pause(); levelupSound.currentTime = 0; }
}

// UI更新
function updateDisplay() {
    document.getElementById('player-hp').textContent = player.hp;
    document.getElementById('player-mp').textContent = player.mp;
    document.getElementById('player-level').textContent = player.level;
    document.getElementById('player-exp').textContent = player.exp;
    document.getElementById('player-next-exp').textContent = player.nextLevelExp;

    document.querySelector('.player-hp-fill').style.width = (player.hp / player.maxHp * 100) + '%';
    document.querySelector('.player-mp-fill').style.width = (player.mp / player.maxMp * 100) + '%';
    document.querySelector('.player-exp-fill').style.width = (player.exp / player.nextLevelExp * 100) + '%';

    document.getElementById('enemy-name').textContent = currentEnemy.name;
    document.getElementById('enemy-hp').textContent = currentEnemy.hp;
    document.getElementById('enemy-max-hp').textContent = currentEnemy.maxHp;

    const enemyImage = document.getElementById('enemy-image');
    const enemySprite = document.getElementById('enemy-sprite');
    if (currentEnemy.image) {
        enemyImage.src = currentEnemy.image;
        enemyImage.alt = currentEnemy.name;
        enemyImage.style.display = 'inline';
        enemySprite.style.display = 'none';
    } else {
        enemyImage.style.display = 'none';
        enemySprite.style.display = 'inline';
        enemySprite.textContent = currentEnemy.sprite;
    }

    document.querySelector('.enemy-hp-fill').style.width = (currentEnemy.hp / currentEnemy.maxHp * 100) + '%';

    const btns = document.querySelectorAll('.command-btn');
    btns.forEach(btn => btn.disabled = !isPlayerTurn || gameState !== 'battle');

    const magicBtn = btns[1];
    const healBtn = btns[2];
    
    if (player.knownMagic.length > 0) {
        const latestMagic = player.knownMagic[player.knownMagic.length - 1];
        magicBtn.disabled = player.mp < latestMagic.mpCost || !isPlayerTurn || gameState !== 'battle';
        magicBtn.textContent = latestMagic.name;
    } else {
        magicBtn.disabled = true;
        magicBtn.textContent = 'まほう';
    }
    
    healBtn.disabled = player.mp < 5 || !isPlayerTurn || gameState !== 'battle';

    // ゲームオーバーまたは勝利時の表示制御
    if (gameState !== 'battle') {
        document.getElementById('battle-commands').style.display = 'none';
        document.getElementById('game-over').style.display = 'block';
        let gameOverText = '';
        if (gameState === 'win') {
            if (currentEnemy.isBoss) {
                gameOverText = '魔王を倒した！世界に平和が戻った！';
            } else {
                // 通常の敵を倒した場合は、この画面は表示せず直接次の戦闘へ
                // ここには到達しないはずだが、念のため
                gameOverText = `${currentEnemy.name}を倒した！勝利！`; 
            }
            // BGMは止めない
        } else { // gameState === 'lose' (プレイヤー敗北時)
            gameOverText = 'あなたは倒れた...';
            if (bgm) bgm.pause(); // プレイヤー敗北時はBGMを停止
        }
        document.getElementById('game-over-text').textContent = gameOverText;

        // 勝利時の「最初から」ボタンは、魔王戦の勝利時のみ表示されるようにする
        // または、特定の条件で非表示にするなどの調整が可能
        // 現在のロジックでは、win/loseどちらでもボタンが表示されるので、
        // winの場合は「続ける」などに変更するか、この表示自体をスキップする
        if (gameState === 'win' && !currentEnemy.isBoss) {
            document.getElementById('game-over').style.display = 'none'; // 通常の勝利時は非表示
        }
    } else { // gameState === 'battle'
        document.getElementById('battle-commands').style.display = 'grid';
        document.getElementById('game-over').style.display = 'none';
        if (bgm && !isMuted && bgm.paused) { // 戦闘中にBGMが停止していたら再生を試みる
            bgm.play().catch(e => console.log('BGM play failed on updateDisplay:', e));
        }
    }
}

// ログ関係の改良
function addLog(message, className = '') {
    logMessages.push({ message, className });
    if (!logTimer) {
        displayNextLog();
    }
}

function displayNextLog() {
    if (currentLogIndex >= logMessages.length) {
        clearLogTimer();
        checkBattleEnd();
        return;
    }

    const logContainer = document.getElementById('log-messages');
    const currentLog = logMessages[currentLogIndex];
    
    // 古いログを削除（最大3つまで表示）
    while (logContainer.children.length >= 3) {
        logContainer.removeChild(logContainer.firstChild);
    }
    
    const p = document.createElement('p');
    if (currentLog.className) p.classList.add(currentLog.className);
    p.textContent = currentLog.message;
    logContainer.appendChild(p);
    
    currentLogIndex++;
    
    // 次のログを1.5秒後に表示
    logTimer = setTimeout(() => {
        displayNextLog();
    }, 1500);
}

function clearLogTimer() {
    if (logTimer) {
        clearTimeout(logTimer);
        logTimer = null;
    }
}

function checkBattleEnd() {
    if (!currentEnemy.isAlive() && gameState === 'battle') {
        gameState = 'win';
        player.addExp(currentEnemy.expReward);
        addLog(`${currentEnemy.name}を倒した！`);
        
        // 魔王を倒した場合は特別処理
        if (currentEnemy.isBoss) {
            updateDisplay(); // 「魔王を倒した！」メッセージを表示
            setTimeout(() => {
                alert('おめでとうございます！魔王を倒して世界を救いました！');
                // 魔王撃破後は自動でゲームを終了するか、タイトルに戻すかなど
                // 現在は「最初から」ボタンで再開
            }, 2000);
        } else {
            // 通常の敵の場合は3秒後に次の戦闘へ
            setTimeout(() => {
                startNextBattle(); // ここで次の戦闘を開始
            }, 3000);
        }
    } else if (!player.isAlive() && gameState === 'battle') {
        gameState = 'lose';
        addLog('あなたは倒れた...');
        updateDisplay(); // 「あなたは倒れた...」メッセージと「最初から」ボタンを表示
    } else {
        // 戦闘継続の場合
        if (!isPlayerTurn && gameState === 'battle') {
            setTimeout(() => {
                enemyTurn();
            }, 1000);
        } else if (isPlayerTurn && gameState === 'battle') {
            updateDisplay();
        }
    }
}

function startNextBattle() {
    gameState = 'battle';
    document.getElementById('battle-commands').style.display = 'grid';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('log-messages').innerHTML = ''; // ログをクリア
    logMessages = []; // ログメッセージ配列をリセット
    currentLogIndex = 0; // ログインデックスをリセット
    clearLogTimer(); // ログタイマーをクリア
    initGame(); // 新しい敵でゲームを初期化
    initAudio(); // BGMが止まっている場合に再開を試みる
}

// 魔法エフェクト
function showMagicEffectByName(name) {
    const effect = document.getElementById('magic-effect');
    if (!effect) return;
    effect.className = 'magic-effect';
    effect.style.display = 'block';
    if (name.includes('ファイアー')) effect.classList.add('fire-effect');
    else if (name.includes('アイスボルト')) effect.classList.add('ice-effect');
    else if (name.includes('サンダーストーム')) effect.classList.add('thunder-effect');
    else if (name.includes('ホーリーライト')) effect.classList.add('holy-effect');
    setTimeout(() => effect.style.display = 'none', 500);
}

// プレイヤー行動
function playerAttack() {
    if (!isPlayerTurn || gameState !== 'battle') return;
    const damage = player.attack + Math.floor(Math.random() * 10);
    currentEnemy.takeDamage(damage);
    addLog(`勇者の攻撃！${currentEnemy.name}に${damage}のダメージ！`, 'damage');
    isPlayerTurn = false;
    updateDisplay();
}

function playerMagic() {
    if (!isPlayerTurn || gameState !== 'battle' || player.knownMagic.length === 0) return;
    const magic = player.knownMagic[player.knownMagic.length - 1];
    if (player.mp < magic.mpCost) {
        addLog('MPが足りない！');
        return;
    }
    player.useMp(magic.mpCost);
    showMagicEffectByName(magic.name);
    
    if (magic.type === 'attack') {
        const dmg = magic.damage + Math.floor(Math.random() * 10);
        currentEnemy.takeDamage(dmg);
        addLog(`勇者は${magic.name}を唱えた！${currentEnemy.name}に${dmg}のダメージ！`, 'damage');
    } else if (magic.type === 'heal') {
        player.heal(magic.healAmount);
        addLog(`勇者は${magic.name}を唱えた！HPが${magic.healAmount}回復！`, 'heal');
    }
    isPlayerTurn = false;
    updateDisplay();
}

function playerHeal() {
    if (!isPlayerTurn || gameState !== 'battle' || player.mp < 5) return;
    player.useMp(5);
    const heal = 20 + Math.floor(Math.random() * 10);
    player.heal(heal);
    addLog(`勇者は回復した！HPが${heal}回復！`, 'heal');
    isPlayerTurn = false;
    updateDisplay();
}

function runAway() {
    if (!isPlayerTurn || gameState !== 'battle') return;
    
    // 魔王からは逃げられない
    if (currentEnemy.isBoss) {
        addLog('魔王からは逃げられない！');
        isPlayerTurn = false;
        updateDisplay();
        return;
    }
    
    if (Math.random() > 0.3) {
        addLog('逃げることに成功した！');
        setTimeout(() => {
            startNextBattle(); // 逃走成功時も次の戦闘へ
        }, 2000);
    } else {
        addLog('逃げることができなかった！');
        isPlayerTurn = false;
        updateDisplay();
    }
}

// 敵のターン
function enemyTurn() {
    if (gameState !== 'battle' || isPlayerTurn) return;
    
    const action = currentEnemy.getAction();
    let damage = 0;
    let actionName = '';
    
    switch (action) {
        case 'attack':
            damage = currentEnemy.attack + Math.floor(Math.random() * 5);
            actionName = '攻撃';
            break;
        case 'strongAttack':
            damage = Math.floor(currentEnemy.attack * 1.5) + Math.floor(Math.random() * 8);
            actionName = '強攻撃';
            break;
        case 'magicAttack':
            damage = Math.floor(currentEnemy.attack * 1.3) + Math.floor(Math.random() * 10);
            actionName = '魔法攻撃';
            break;
        case 'specialAttack':
            damage = Math.floor(currentEnemy.attack * 2) + Math.floor(Math.random() * 15);
            actionName = '必殺技';
            break;
    }
    
    player.takeDamage(damage);
    addLog(`${currentEnemy.name}の${actionName}！勇者に${damage}のダメージ！`, 'damage');
    isPlayerTurn = true;
}

// ゲーム開始・再開
function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-content').style.display = 'block';
    initGame();
    initAudio(); // ゲーム開始時にBGMを再生
}

function restartGame() {
    document.getElementById('battle-commands').style.display = 'grid';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('log-messages').innerHTML = '';
    logMessages = [];
    currentLogIndex = 0;
    clearLogTimer();
    
    // プレイヤーをリセット
    player = new Character('勇者', 100, 50, 20, '🛡️');
    
    if (bgm) bgm.pause(); // BGMを停止して最初から再生
    initGame();
    initAudio();
}

// 起動処理
window.addEventListener('load', () => {
    document.getElementById('start-button').addEventListener('click', startGame);
    // ページロード時にオーディオ初期化を呼ぶことで、ユーザーインタラクションなしでBGM再生を試みるのを避ける
    // BGMの再生は startGame() でユーザーインタラクション後に開始する
});

// 音関係
function playSound(audio) {
    if (audio && !isMuted) {
        audio.currentTime = 0; // 短い効果音は毎回最初から再生
        audio.play().catch(() => {});
    }
}

function toggleMute() {
    isMuted = !isMuted;
    const muteBtn = document.getElementById('mute-btn');
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
    if (isMuted) {
        stopAllSounds();
    } else {
        if (gameState === 'battle' && bgm) {
            bgm.play().catch(() => {}); // ミュート解除時、戦闘中ならBGMを再生
        }
    }
}

function changeVolume() {
    const volume = document.getElementById('volume-slider').value / 100;
    if (bgm) bgm.volume = volume * 0.3;
    if (levelupSound) levelupSound.volume = volume;
}