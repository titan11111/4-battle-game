# 魔王復活アリーナ — 画像制作ブリーフ（最短パック）

依頼先向け。この文書どおりに4点（必須3＋任意1）を作成してください。  
**作風統一が最優先**です。クオリティより「同じゲームのドット絵に見えること」を重視します。

---

## 1. 提出ルール

| 項目 | 指定 |
|---|---|
| 納品形式 | PNG（透過でも黒ベタでも可。シーン絵は黒〜暗い背景でOK） |
| サイズ | キャラ単体 **1024×1024**／シーン挿絵 **1024×1024**（または 1280×1280） |
| ファイル名 | 下表の英語名を**一字一句同じ**に |
| 納品場所 | `004-battle-game/images/` に配置できる状態 |
| 禁止 | リアル塗り、3D、アニメ塗り、高精細デジタルイラスト、写真風、テキスト文字入れ |
| 必須参照 | 添付の `hero.png`（勇者）を**作風の基準**にする |

### 作風（hero.png に合わせる）

- レトロJRPG（FC／SFC、ドラクエ／初期FF系）の**チャンキーなピクセルアート**
- 輪郭ははっきりした黒〜暗色アウトライン
- 色数は抑えめ、原色寄り（青・赤・金が基調）
- 陰影は単純な段階影のみ（グラデ塗りなし）
- キャラは正面〜やや見下ろしのスプライト感
- 「綺麗なAIイラスト」より「昔のRPGのドット絵」に寄せる

### 世界観メモ（物語の一貫性）

- タイトル: 魔王復活アリーナ
- 魔王が王女を人質にとり、アリーナで勇者に挑ませる
- 勇者は9戦で装備を揃え、魔王を倒して姫を救出する

---

## 2. 制作リスト（最短パック）

| 優先 | ファイル名 | 種別 | 内容 |
|---|---|---|---|
| 必須 | `prologue.png` | シーン挿絵 | プロローグ用。魔王＋囚われの姫 |
| 必須 | `ending-scene.png` | シーン挿絵 | エンディング用。勇者＋救出された姫 |
| 必須 | `maou.png` | キャラ単体 | ラスボス魔王（黒背景） |
| 任意 | `hime.png` | キャラ単体 | 王女（黒背景・既存差し替え用） |

既存の `hero.png` は基準素材として使うので、勇者の新規作画は不要です。

---

## 3. 各画像の指定＋生成プロンプト

以下の英語プロンプトをそのまま使ってください。  
先頭に必ず付ける共通文:

```text
Match the exact pixel-art style of the reference hero sprite: chunky 8-bit/16-bit JRPG pixels, thick dark outlines, limited vibrant palette, simple cel shading, no photorealism, no 3D, no smooth digital painting. Solid black background for character sprites. Game asset sprite sheet look.
```

---

### A. `prologue.png`（必須・プロローグ挿絵）

**画面の役割:** ゲーム開始直後の物語説明の横／上に出す一枚絵。

**構図:**
- 暗い石造りのアリーナ（円形闘技場）
- 奥中央に威圧的な魔王（金冠・角・赤目・暗色の鎧／マント）
- 手前または魔王の脇に、光の檻／鎖で囚われた王女（金冠・桃色ドレス）
- 勇者は小さく入れるか、入れなくてもよい（主役は魔王と姫）
- 空気は不穏。赤〜紫の暗い照明

**プロンプト:**

```text
Match the exact pixel-art style of the reference hero sprite: chunky 8-bit/16-bit JRPG pixels, thick dark outlines, limited vibrant palette, simple cel shading, no photorealism, no 3D, no smooth digital painting. Game asset look.

Pixel art story illustration for a retro RPG prologue. Dark stone battle arena. In the back center, a menacing Demon King with golden crown, horns, glowing red eyes, heavy dark armor and cloak, raised fist. To the side or in a glowing cage of light/chains, a captured princess with blonde hair, small gold crown, pink and white dress. Ominous red-purple lighting, dramatic but readable silhouettes. No text, no UI, no watermark. Square composition.
```

**チェック:**
- [ ] 魔王と姫が一目で分かる
- [ ] ピクセルが潰れていない
- [ ] 文字・ロゴが入っていない

---

### B. `ending-scene.png`（必須・エンディング挿絵）

**画面の役割:** 魔王撃破後の「姫の救出／めでたし」画面。

**構図:**
- 明るい光が差すアリーナ、または封印が解けた広間
- 左（または手前）に勇者（青服・赤マント・金の頭帯・盾）— **hero.png と同デザイン**
- 右に王女（金冠・桃色ドレス）— 笑顔または礼
- 二人並び、または姫が礼をしている構図
- トーンは希望・祝福（prologue より明るく）

**プロンプト:**

```text
Match the exact pixel-art style of the reference hero sprite: chunky 8-bit/16-bit JRPG pixels, thick dark outlines, limited vibrant palette, simple cel shading, no photorealism, no 3D, no smooth digital painting. Game asset look.

Pixel art story illustration for a retro RPG happy ending. Soft light pouring into a stone arena after victory. On the left, the same blue-tunic hero with red cape, golden headband jewel, round wooden shield. On the right, a rescued princess with blonde hair, small gold crown, pink and white dress, smiling or bowing in gratitude. Warm hopeful lighting, celebratory mood, clear readable characters. No text, no UI, no watermark. Square composition.
```

**チェック:**
- [ ] 勇者が hero.png と同一デザインに見える
- [ ] 姫が救われた後だと分かる（笑顔／礼／光）
- [ ] prologue より明るい

---

### C. `maou.png`（必須・ラスボス単体）

**画面の役割:** 戦闘画面の敵スプライト。

**構図:**
- **黒背景**にキャラ1体のみ
- 金冠・二本角・赤く光る目・暗鎧／マント
- 拳を上げた威圧ポーズ
- 勇者より大きく、肩幅が広いシルエット
- hero.png と同じドット密度

**プロンプト:**

```text
Match the exact pixel-art style of the reference hero sprite: chunky 8-bit/16-bit JRPG pixels, thick dark outlines, limited vibrant palette, simple cel shading, no photorealism, no 3D, no smooth digital painting.

Single character sprite on solid pure black background. Final boss Demon King for a retro JRPG: three-point golden crown, curved horns, glowing red eyes on a shadowed face, bulky dark armor with jagged pauldrons, dark cloak, one fist raised threateningly. Menacing, readable silhouette, same pixel scale as the hero reference. No text, no ground, no extra props.
```

**チェック:**
- [ ] 黒背景
- [ ] 戦闘UIに載せても輪郭が読める
- [ ] Gemini風のリアル絵になっていない

---

### D. `hime.png`（任意・王女単体）

**画面の役割:** エンディングで勇者の横に並べるスプライト。既存差し替え用。

**構図:**
- **黒背景**にキャラ1体のみ
- 金冠・金髪・桃色／白のドレス・青のリボン（勇者の青と対応）
- 穏やかな笑顔、正面立ち
- hero.png と同じドット密度・頭身

**プロンプト:**

```text
Match the exact pixel-art style of the reference hero sprite: chunky 8-bit/16-bit JRPG pixels, thick dark outlines, limited vibrant palette, simple cel shading, no photorealism, no 3D, no smooth digital painting.

Single character sprite on solid pure black background. Retro JRPG princess: long blonde hair, small gold crown with a jewel, pink and white dress with a blue ribbon sash, gentle smile, simple black-dot eyes, pale skin, hands clasped in front, front-facing idle pose. Same pixel density and chibi-leaning proportions as the hero reference. No text, no ground.
```

**チェック:**
- [ ] 黒背景
- [ ] hero.png と並べて違和感がない
- [ ] ドレスがピンク基調で識別しやすい

---

## 4. 参照ファイル（依頼時に添付）

必ず添付:

1. `images/hero.png` … **作風・勇者デザインの正解**
2. （任意）`images/maou.png` … 現行魔王。作り直し時のモチーフ参考
3. （任意）`images/hime.png` … 現行王女。作風を寄せる参考

---

## 5. 納品チェックリスト（提出前）

- [ ] ファイル名が正確（`prologue.png` / `ending-scene.png` / `maou.png` / `hime.png`）
- [ ] すべて同じピクセル密度・同じ輪郭の強さ
- [ ] リアル塗り／3Dが混ざっていない
- [ ] シーン絵に文字が入っていない
- [ ] `maou.png` と `hime.png` は黒背景
- [ ] `ending-scene.png` の勇者が `hero.png` と同一衣装

---

## 6. 依頼文テンプレ（そのまま送付可）

```text
魔王復活アリーナ用のドット絵を、添付ブリーフどおり最短パックでお願いします。

【必須】
- prologue.png（プロローグ挿絵：魔王＋囚われの姫）
- ending-scene.png（エンディング挿絵：勇者＋救出された姫）
- maou.png（ラスボス単体・黒背景）

【任意】
- hime.png（王女単体・黒背景）

作風は添付の hero.png に完全準拠（チャンキーなレトロJRPGピクセル）。
リアル塗り・3D・高精細イラストは不可です。
詳細・英語プロンプトは添付の ART-BRIEF.md を参照してください。
```
