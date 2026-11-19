// Complete Boy Scout Japanese Semaphore (和文手旗信号) Specification & Training Data

export const GENGA_ORDER = [
  'rest', '0', '1', '2', '2r', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'
];

export const GENGA = {
  rest: {
    id: 'rest',
    name: '原姿',
    short: '原姿',
    motif: '｜ ｜',
    number: null,
    rightDesc: '垂直に垂らす（下）',
    leftDesc: '垂直に垂らす（下）',
    tip: '一文字ごとの始まりと終わりの基本姿勢。肘を伸ばし、背筋をまっすぐにして両足を軽く開きます。',
    type: 'pose',
    pose: {
      R: { srZ: -4, srX: -4, elZ: 0, lift: 0 },
      L: { srZ: 4, srX: -4, elZ: 0, lift: 0 }
    }
  },
  '0': {
    id: '0',
    name: '第0原画（零原画）',
    short: '0原画',
    motif: '○',
    number: '0',
    rightDesc: '下から左（体前）へ大きく1周回す',
    leftDesc: '垂直に垂らす（下）',
    tip: '数字の「0」を表すときに使います。カタカナ文字には使いません。右手の赤旗で体の前から大きく円を描きます。',
    type: 'circle',
    keyframes: [
      { t: 0.00, R: { srZ: 0, srX: -12, elZ: 0, lift: 0 }, L: { srZ: 4, srX: -4, elZ: 0, lift: 0 } },
      { t: 0.25, R: { srZ: 90, srX: -22, elZ: 0, lift: 0 }, L: { srZ: 4, srX: -4, elZ: 0, lift: 0 } },
      { t: 0.50, R: { srZ: 180, srX: -8, elZ: 0, lift: 0 }, L: { srZ: 4, srX: -4, elZ: 0, lift: 0 } },
      { t: 0.75, R: { srZ: 270, srX: -6, elZ: 0, lift: 0 }, L: { srZ: 4, srX: -4, elZ: 0, lift: 0 } },
      { t: 1.00, R: { srZ: 360, srX: -4, elZ: 0, lift: 0 }, L: { srZ: 4, srX: -4, elZ: 0, lift: 0 } }
    ]
  },
  '1': {
    id: '1',
    name: '第1原画',
    short: '1原画',
    motif: '一',
    number: '1',
    rightDesc: '右方水平（9時）',
    leftDesc: '左方水平（3時）',
    tip: '両腕を左右真横に水平に伸ばし、漢字の「一」を作ります。手首や肘が曲がらないよう一直線を意識します。',
    type: 'pose',
    pose: {
      R: { srZ: -90, srX: -5, elZ: 0, lift: 0 },
      L: { srZ: 90, srX: -5, elZ: 0, lift: 0 }
    }
  },
  '2': {
    id: '2',
    name: '第2原画',
    short: '2原画',
    motif: '｜・ー',
    number: '2',
    rightDesc: '垂直に真上へ掲げる（12時）',
    leftDesc: '垂直に垂らす（6時）',
    tip: '赤旗（右手）だけをまっすぐ真上に挙げて縦棒「｜」を表します。長音記号「ー」も第2原画です。',
    type: 'pose',
    pose: {
      R: { srZ: -180, srX: -5, elZ: 0, lift: 0 },
      L: { srZ: 4, srX: -4, elZ: 0, lift: 0 }
    }
  },
  '2r': {
    id: '2r',
    name: '逆第2原画',
    short: '逆2',
    motif: '｜(逆)',
    number: null,
    rightDesc: '垂直に垂らす（6時）',
    leftDesc: '垂直に真上へ掲げる（12時）',
    tip: '「エ（1→逆2→1）」と「チ（7→逆2）」の2文字だけで使用！第2原画だと他の文字と見分けにくいため白旗を上げます。',
    type: 'pose',
    pose: {
      R: { srZ: -4, srX: -4, elZ: 0, lift: 0 },
      L: { srZ: 180, srX: -5, elZ: 0, lift: 0 }
    }
  },
  '3': {
    id: '3',
    name: '第3原画',
    short: '3原画',
    motif: 'ノ',
    number: '3',
    rightDesc: '右斜め下45度（7時半）',
    leftDesc: '左斜め上45度（1時半）',
    tip: '受信者から見て右上から左下への「ノ」を作ります。この姿勢だけでカタカナの「ノ」になります。',
    type: 'pose',
    pose: {
      R: { srZ: -45, srX: -5, elZ: 0, lift: 0 },
      L: { srZ: 135, srX: -5, elZ: 0, lift: 0 }
    }
  },
  '4': {
    id: '4',
    name: '第4原画',
    short: '4原画',
    motif: '＼・ヘ',
    number: '4',
    rightDesc: '右斜め上45度（10時半）',
    leftDesc: '左斜め下45度（4時半）',
    tip: '第3原画と反対の斜め線「＼」です。この姿勢だけでカタカナの「ヘ」になります。',
    type: 'pose',
    pose: {
      R: { srZ: -135, srX: -5, elZ: 0, lift: 0 },
      L: { srZ: 45, srX: -5, elZ: 0, lift: 0 }
    }
  },
  '5': {
    id: '5',
    name: '第5原画',
    short: '5原画',
    motif: '・（点）',
    number: '5',
    rightDesc: '頭上で交差（後ろ側）',
    leftDesc: '頭上で交差（前側）',
    tip: '「点（・）」を表します。ボーイスカウトでは白旗（左手）を前にして頭上で大きく交差させます。',
    type: 'pose',
    pose: {
      R: { srZ: -162, srX: -7, elZ: -52, lift: 0.04 },
      L: { srZ: 162, srX: -15, elZ: 52, lift: 0.04 }
    }
  },
  '6': {
    id: '6',
    name: '第6原画',
    short: '6原画',
    motif: 'ニ',
    number: '6',
    rightDesc: '右方水平（9時）',
    leftDesc: '頭上で曲げて右方水平（上の棒）',
    tip: '平行な2本の横棒「ニ」を作ります。左手は頭の上で直角に曲げて額より上に、白旗を水平に出します。これだけで「ニ」！',
    type: 'pose',
    pose: {
      R: { srZ: -90, srX: -6, elZ: 0, lift: 0 },
      L: { srZ: 168, srX: -18, elZ: 100, lift: 0.05 }
    }
  },
  '7': {
    id: '7',
    name: '第7原画',
    short: '7原画',
    motif: 'レ・L',
    number: '7',
    rightDesc: '垂直に真上（12時）',
    leftDesc: '左方水平（3時）',
    tip: '直角の「L（レ）」を作ります。この姿勢だけでカタカナの「レ」を表します。',
    type: 'pose',
    pose: {
      R: { srZ: -180, srX: -5, elZ: 0, lift: 0 },
      L: { srZ: 90, srX: -5, elZ: 0, lift: 0 }
    }
  },
  '8': {
    id: '8',
    name: '第8原画',
    short: '8原画',
    motif: '┐',
    number: '8',
    rightDesc: '右方水平（9時）',
    leftDesc: '垂直に垂らす（6時）',
    tip: 'カ・コ・ヤ・ヨ・ロなどに使う「┐」の形。左手は下げたまま、右手の赤旗だけ水平に出します。',
    type: 'pose',
    pose: {
      R: { srZ: -90, srX: -5, elZ: 0, lift: 0 },
      L: { srZ: 4, srX: -4, elZ: 0, lift: 0 }
    }
  },
  '9': {
    id: '9',
    name: '第9原画',
    short: '9原画',
    motif: 'フ',
    number: '9',
    rightDesc: '右方水平（9時）',
    leftDesc: '体の前を通し右下約35〜45度',
    tip: 'カタカナの「フ」の形！右腕を水平に出し、左手は右肘の下をくぐらせるように斜め下へしっかり伸ばします。これだけで「フ」！',
    type: 'pose',
    pose: {
      R: { srZ: -90, srX: -6, elZ: 0, lift: 0 },
      L: { srZ: -52, srX: -20, elZ: -4, lift: 0 }
    }
  },
  '10': {
    id: '10',
    name: '第10原画',
    short: '10原画',
    motif: 'ハ',
    number: null,
    rightDesc: '右斜め上45度（10時半）',
    leftDesc: '左斜め上45度（1時半）',
    tip: '両腕を斜め上45度に広げて「ハ」の形（バンザイV字）を作ります。これだけで「ハ」！',
    type: 'pose',
    pose: {
      R: { srZ: -135, srX: -5, elZ: 0, lift: 0 },
      L: { srZ: 135, srX: -5, elZ: 0, lift: 0 }
    }
  },
  '11': {
    id: '11',
    name: '第11原画',
    short: '11原画',
    motif: 'ク（連続動作）',
    number: null,
    rightDesc: '平行を保ち体の前を斜めに切る（正面：右上45°→左下45°）',
    leftDesc: '赤旗と平行のまま体の前を斜めに切る（正面：右上45°→左下45°）',
    tip: '剣で「ク」を袈裟斬りする連続動作！両旗を平行に保ったまま、送信者の左斜め上45度（正面から見て右上）から体の前を斜めに通って右斜め下45度（正面：左下）へ一気に振り下ろします。「ク」と「タ」で使用。',
    type: 'sweep',
    startPose: {
      R: { srZ: 135, srX: -42, elZ: 0, roll: 0, lift: 0.03 },
      L: { srZ: 135, srX: -28, elZ: 0, roll: 0, lift: 0.02 }
    },
    endPose: {
      R: { srZ: -45, srX: -32, elZ: 0, roll: 0, lift: 0 },
      L: { srZ: -45, srX: -36, elZ: 0, roll: 0, lift: 0 }
    },
    // Representative keyframes used by miniDiagram & static inspection
    keyframes: [
      {
        t: 0.0,
        R: { srZ: 135, srX: -42, elZ: 0, roll: 0, lift: 0.03 },
        L: { srZ: 135, srX: -28, elZ: 0, roll: 0, lift: 0.02 }
      },
      {
        t: 0.5,
        R: { srZ: 135, srX: -95, elZ: 0, roll: 90, lift: 0.015 },
        L: { srZ: 135, srX: -86, elZ: 0, roll: 90, lift: 0.01 }
      },
      {
        t: 1.0,
        R: { srZ: -45, srX: -32, elZ: 0, roll: 0, lift: 0 },
        L: { srZ: -45, srX: -36, elZ: 0, roll: 0, lift: 0 }
      }
    ],
    // Smooth continuous solver along the +135° diagonal chest-front sword-cut plane (straight arms, razor-straight diagonal trail)
    evaluateSlash(u) {
      const clamped = Math.max(0, Math.min(1, u));
      const s = clamped < 0.5
        ? 4 * clamped * clamped * clamped
        : 1 - Math.pow(-2 * clamped + 2, 3) / 2;

      const srX_R = -42 + (-148 - (-42)) * s;
      const srX_L = -28 + (-144 - (-28)) * s;
      const roll = 180 * s;

      return {
        R: {
          srZ: 135,
          srX: srX_R,
          elZ: 0,
          roll,
          lift: 0.03 * (1 - s)
        },
        L: {
          srZ: 135,
          srX: srX_L,
          elZ: 0,
          roll,
          lift: 0.02 * (1 - s)
        }
      };
    }
  },
  '12': {
    id: '12',
    name: '第12原画',
    short: '12原画',
    motif: 'リ・終信',
    number: null,
    rightDesc: '垂直に真上（12時）',
    leftDesc: '垂直に真上（12時）',
    tip: '両腕を肩幅で平行にまっすぐ真上へ挙げます。1回で「リ」、長めに保つと「終信（送信終了）」の合図になります。',
    type: 'pose',
    pose: {
      R: { srZ: -178, srX: -5, elZ: 0, lift: 0 },
      L: { srZ: 178, srX: -5, elZ: 0, lift: 0 }
    }
  },
  '13': {
    id: '13',
    name: '第13原画',
    short: '13原画',
    motif: '゛（濁点）・数字',
    number: null,
    rightDesc: '垂直に垂らす（6時）',
    leftDesc: '左斜め上45度（1時半）',
    tip: '白旗だけを斜め上45度に掲げます。通常は「濁点（゛）」、通常の約3倍長く掲げると「数字の始まり・終わり」を表します。',
    type: 'pose',
    pose: {
      R: { srZ: -4, srX: -4, elZ: 0, lift: 0 },
      L: { srZ: 135, srX: -5, elZ: 0, lift: 0 }
    }
  },
  '14': {
    id: '14',
    name: '第14原画',
    short: '14原画',
    motif: '゜（半濁点）・句点',
    number: null,
    rightDesc: '右斜め上45度（10時半）',
    leftDesc: '垂直に垂らす（6時）',
    tip: '赤旗だけを斜め上45度に掲げます。通常は「半濁点（゜）」、約3倍長く掲げると「句点（、）」を表します。',
    type: 'pose',
    pose: {
      R: { srZ: -135, srX: -5, elZ: 0, lift: 0 },
      L: { srZ: 4, srX: -4, elZ: 0, lift: 0 }
    }
  }
};

// Communication Procedure Signals (交信符号)
export const SIGNALS = {
  kishin: {
    id: 'kishin',
    name: '起信（きしん）',
    meaning: '「これから送信を始めます／受信者呼び出し」',
    desc: '両手を真上（12原画）から左右水平（1原画）まで左右対称に数回振り下ろします。',
    keyframes: [
      { t: 0.00, R: { srZ: -178, srX: -5, elZ: 0, lift: 0 }, L: { srZ: 178, srX: -5, elZ: 0, lift: 0 } },
      { t: 0.25, R: { srZ: -90, srX: -5, elZ: 0, lift: 0 }, L: { srZ: 90, srX: -5, elZ: 0, lift: 0 } },
      { t: 0.50, R: { srZ: -178, srX: -5, elZ: 0, lift: 0 }, L: { srZ: 178, srX: -5, elZ: 0, lift: 0 } },
      { t: 0.75, R: { srZ: -90, srX: -5, elZ: 0, lift: 0 }, L: { srZ: 90, srX: -5, elZ: 0, lift: 0 } },
      { t: 1.00, R: { srZ: -178, srX: -5, elZ: 0, lift: 0 }, L: { srZ: 178, srX: -5, elZ: 0, lift: 0 } }
    ]
  },
  oushin: {
    id: 'oushin',
    name: '応信（おうしん）',
    meaning: '「受信準備よし・どうぞ送ってください」',
    desc: '両腕を斜め外側から交互に上下へ数回振ります。',
    keyframes: [
      { t: 0.00, R: { srZ: -155, srX: -6, elZ: 0, lift: 0 }, L: { srZ: 40, srX: -6, elZ: 0, lift: 0 } },
      { t: 0.25, R: { srZ: -40, srX: -6, elZ: 0, lift: 0 }, L: { srZ: 155, srX: -6, elZ: 0, lift: 0 } },
      { t: 0.50, R: { srZ: -155, srX: -6, elZ: 0, lift: 0 }, L: { srZ: 40, srX: -6, elZ: 0, lift: 0 } },
      { t: 0.75, R: { srZ: -40, srX: -6, elZ: 0, lift: 0 }, L: { srZ: 155, srX: -6, elZ: 0, lift: 0 } },
      { t: 1.00, R: { srZ: -155, srX: -6, elZ: 0, lift: 0 }, L: { srZ: 40, srX: -6, elZ: 0, lift: 0 } }
    ]
  },
  shushin: {
    id: 'shushin',
    name: '終信（しゅうしん）',
    meaning: '「送信を終わります（以上です）」',
    desc: '第12原画（両手を真上）のまま、相手が解信を返すまで長めに保持します。',
    keyframes: [
      { t: 0.0, R: { srZ: -178, srX: -5, elZ: 0, lift: 0 }, L: { srZ: 178, srX: -5, elZ: 0, lift: 0 } },
      { t: 1.0, R: { srZ: -178, srX: -5, elZ: 0, lift: 0 }, L: { srZ: 178, srX: -5, elZ: 0, lift: 0 } }
    ]
  },
  kaishin: {
    id: 'kaishin',
    name: '解信（かいしん）',
    meaning: '「正しく解読できました・了解」',
    desc: '両腕を頭上に平行に揃えたまま、斜め上45度程度で左右に大きく振ります。',
    keyframes: [
      { t: 0.00, R: { srZ: -178, srX: -8, elZ: 0, lift: 0 }, L: { srZ: 178, srX: -8, elZ: 0, lift: 0 } },
      { t: 0.25, R: { srZ: -140, srX: -12, elZ: 0, lift: 0.02 }, L: { srZ: -195, srX: -14, elZ: -25, lift: 0.02 } },
      { t: 0.50, R: { srZ: 195, srX: -14, elZ: 25, lift: 0.02 }, L: { srZ: 140, srX: -12, elZ: 0, lift: 0.02 } },
      { t: 0.75, R: { srZ: -140, srX: -12, elZ: 0, lift: 0.02 }, L: { srZ: -195, srX: -14, elZ: -25, lift: 0.02 } },
      { t: 1.00, R: { srZ: -178, srX: -8, elZ: 0, lift: 0 }, L: { srZ: 178, srX: -8, elZ: 0, lift: 0 } }
    ]
  },
  shoushin: {
    id: 'shoushin',
    name: '消信（しょうしん）',
    meaning: '「打ち間違い（送信側）／読めません・再送希望（受信側）」',
    desc: '左手の白旗は下ろしたまま、右手の赤旗を真上（または右斜め上）と右水平の間で数回振ります。',
    keyframes: [
      { t: 0.00, R: { srZ: -172, srX: -5, elZ: 0, lift: 0 }, L: { srZ: 4, srX: -4, elZ: 0, lift: 0 } },
      { t: 0.25, R: { srZ: -90, srX: -5, elZ: 0, lift: 0 }, L: { srZ: 4, srX: -4, elZ: 0, lift: 0 } },
      { t: 0.50, R: { srZ: -172, srX: -5, elZ: 0, lift: 0 }, L: { srZ: 4, srX: -4, elZ: 0, lift: 0 } },
      { t: 0.75, R: { srZ: -90, srX: -5, elZ: 0, lift: 0 }, L: { srZ: 4, srX: -4, elZ: 0, lift: 0 } },
      { t: 1.00, R: { srZ: -172, srX: -5, elZ: 0, lift: 0 }, L: { srZ: 4, srX: -4, elZ: 0, lift: 0 } }
    ]
  }
};

// Complete Katakana -> Genga Sequence Table (Japanese Boy Scout Standard)
export const KANA_MAP = {
  'ア': { strokes: ['9', '3'], row: 'ア行', level: 2, hint: '「フ(9)」のあとに斜めの「ノ(3)」を合わせてア！' },
  'イ': { strokes: ['3', '2'], row: 'ア行', level: 2, hint: '斜めの「ノ(3)」のあとに縦線「｜(2)」でイ！' },
  'ウ': { strokes: ['6', '9'], row: 'ア行', level: 2, hint: '「ニ(6)」の下に「フ(9)」を続けるとウの形！' },
  'エ': { strokes: ['1', '2r', '1'], row: 'ア行', level: 3, hint: '「一(1)→逆2原画(白だけ上)→一(1)」。オ・ホと混同しないよう2画目が逆2！' },
  'オ': { strokes: ['1', '2', '3'], row: 'ア行', level: 3, hint: '「一(1)→｜(2)→ノ(3)」とカタカナの書き順そのまま！' },

  'カ': { strokes: ['8', '3'], row: 'カ行', level: 2, hint: '「┐(8)」を構えてから斜めの「ノ(3)」でカ！' },
  'キ': { strokes: ['6', '2'], row: 'カ行', level: 2, hint: '横棒2本の「ニ(6)」に縦棒「｜(2)」を貫いてキ！' },
  'ク': { strokes: ['11'], row: 'カ行', level: 1, hint: '第11原画の1動作だけ！両旗を平行に保ち、正面から見て右上から体の前を斜めに通って左下へ振り下ろします。' },
  'ケ': { strokes: ['7', '3'], row: 'カ行', level: 2, hint: '「L(7)」の形から「ノ(3)」でケ！' },
  'コ': { strokes: ['8', '1'], row: 'カ行', level: 2, hint: '「┐(8)」から下の横棒「一(1)」でコ！' },

  'サ': { strokes: ['1', '12'], row: 'サ行', level: 2, hint: '横棒「一(1)」のあと、両手をまっすぐ上げて「リ(12)」のように下ろすイメージでサ！' },
  'シ': { strokes: ['5', '7'], row: 'サ行', level: 2, hint: '点「・(5)」のあと、下からすくう「L(7)」でシ！（ツは12→3）' },
  'ス': { strokes: ['1', '2', '5'], row: 'サ行', level: 3, hint: '漢字の「寸」の形！「一(1)→｜(2)→点・(5)」と覚えます。' },
  'セ': { strokes: ['9', '7'], row: 'サ行', level: 2, hint: '「フ(9)」の横画に「L(7)」を合わせてセ！' },
  'ソ': { strokes: ['5', '3'], row: 'サ行', level: 2, hint: '点「・(5)」＋斜め「ノ(3)」でソ！（ンは5→1、シは5→7）' },

  'タ': { strokes: ['11', '5'], row: 'タ行', level: 2, hint: '「ク(11)」を振り下ろしてから、頭上に点「・(5)」を打ってタ！' },
  'チ': { strokes: ['7', '2r'], row: 'タ行', level: 3, hint: '「L(7)」のあと動きがハッキリ見えるよう「逆2原画(白だけ上)」！' },
  'ツ': { strokes: ['12', '3'], row: 'タ行', level: 2, hint: '両手真上の「12原画(リ)」の2本＋斜め「ノ(3)」でツ！（シは5→7）' },
  'テ': { strokes: ['6', '3'], row: 'タ行', level: 2, hint: '横2本の「ニ(6)」に斜め線「ノ(3)」でテ！' },
  'ト': { strokes: ['2', '5'], row: 'タ行', level: 2, hint: '縦棒「｜(2)」のあと、頭上に点「・(5)」でト！' },

  'ナ': { strokes: ['1', '3'], row: 'ナ行', level: 2, hint: '横棒「一(1)」＋斜め「ノ(3)」でカタカナのナ！' },
  'ニ': { strokes: ['6'], row: 'ナ行', level: 1, hint: '第6原画の1動作だけ！右は水平、左は頭上から水平に「ニ」。' },
  'ヌ': { strokes: ['9', '4'], row: 'ナ行', level: 2, hint: '「フ(9)」のあと、反対斜め「＼(4)」でヌ！（アは9→3、ヌは9→4）' },
  'ネ': { strokes: ['9', '2', '1'], row: 'ナ行', level: 3, hint: '漢字の「子」の形！「フ(9)→｜(2)→一(1)」と覚えます。' },
  'ノ': { strokes: ['3'], row: 'ナ行', level: 1, hint: '第3原画の1動作だけ！そのまま「ノ」の形です。' },

  'ハ': { strokes: ['10'], row: 'ハ行', level: 1, hint: '第10原画の1動作だけ！両手を斜め上45度に広げて「ハ」！' },
  'ヒ': { strokes: ['1', '7'], row: 'ハ行', level: 2, hint: '横棒「一(1)」のあと「L(7)」を合わせてヒ！' },
  'フ': { strokes: ['9'], row: 'ハ行', level: 1, hint: '第9原画の1動作だけ！赤水平＋白斜め下で「フ」！' },
  'ヘ': { strokes: ['4'], row: 'ハ行', level: 1, hint: '第4原画の1動作だけ！右斜め上＋左斜め下で「ヘ」！' },
  'ホ': { strokes: ['1', '2', '10'], row: 'ハ行', level: 3, hint: '「一(1)→｜(2)→ハ(10)」と書き順そのまま3動作！' },

  'マ': { strokes: ['9', '5'], row: 'マ行', level: 2, hint: '「フ(9)」のあと頭上に点「・(5)」を打ってマ！（ラは逆で5→9）' },
  'ミ': { strokes: ['6', '1'], row: 'マ行', level: 2, hint: '「ニ(6)」の下に横棒「一(1)」を足して三本線＝ミ！' },
  'ム': { strokes: ['7', '5'], row: 'マ行', level: 2, hint: '「L(7)」の形を作ってから最後に点「・(5)」でム！' },
  'メ': { strokes: ['3', '5'], row: 'マ行', level: 2, hint: '斜め線「ノ(3)」に点「・(5)」を交差させてメ！' },
  'モ': { strokes: ['6', '7'], row: 'マ行', level: 2, hint: '「ニ(6)」の形に下向きの「L(7)」を合わせてモ！' },

  'ヤ': { strokes: ['8', '4'], row: 'ヤ行', level: 2, hint: '「┐(8)」から逆斜め「＼(4)」を交差してヤ！' },
  'ユ': { strokes: ['9', '1'], row: 'ヤ行', level: 2, hint: '上の「フ(9)」に、下の長い横棒「一(1)」でユ！（ヲは逆の1→9）' },
  'ヨ': { strokes: ['8', '6'], row: 'ヤ行', level: 2, hint: '「┐(8)」の形から下の2本線「ニ(6)」でヨ！' },

  'ラ': { strokes: ['5', '9'], row: 'ラ行', level: 2, hint: '上の点「・(5)」のあと下の「フ(9)」でラ！（マは逆の9→5）' },
  'リ': { strokes: ['12'], row: 'ラ行', level: 1, hint: '第12原画の1動作だけ！両手まっすぐ真上に上げて「リ」！' },
  'ル': { strokes: ['3', '7'], row: 'ラ行', level: 2, hint: '左払いの「ノ(3)」のあと右の「レ(7)」でル！' },
  'レ': { strokes: ['7'], row: 'ラ行', level: 1, hint: '第7原画の1動作だけ！赤真上＋白右水平で「レ」！' },
  'ロ': { strokes: ['7', '8'], row: 'ラ行', level: 2, hint: '左下角「L(7)」＋右上角「┐(8)」で四角い「ロ」！' },

  'ワ': { strokes: ['2', '9'], row: 'ワ行・ン', level: 2, hint: '左縦棒「｜(2)」＋「フ(9)」でカタカナのワ！' },
  'ヰ': { strokes: ['6', '12'], row: 'ワ行・ン', level: 4, hint: '「ニ(6)」＋縦2本「リ(12)」で旧仮名「ヰ（ゐ）」。' },
  'ヱ': { strokes: ['9', '3', '1'], row: 'ワ行・ン', level: 4, hint: '「フ(9)→ノ(3)→一(1)」で旧仮名「ヱ（ゑ）」。' },
  'ヲ': { strokes: ['1', '9'], row: 'ワ行・ン', level: 2, hint: '上の横棒「一(1)」＋「フ(9)」でヲ！（ユは逆の9→1）' },
  'ン': { strokes: ['5', '1'], row: 'ワ行・ン', level: 2, hint: '点「・(5)」のあと、水平に払う「一(1)」でン！' },

  '゛': { strokes: ['13'], row: '記号', level: 4, hint: '第13原画（白旗斜め上45度）。文字→原姿→13原画→原姿の順に打ちます。' },
  '゜': { strokes: ['14'], row: '記号', level: 4, hint: '第14原画（赤旗斜め上45度）。文字→原姿→14原画→原姿の順に打ちます。' },
  'ー': { strokes: ['2'], row: '記号', level: 4, hint: '第2原画（赤旗真上）。長音「ー」も1文字と同じリズムで打ちます。' }
};

export const GOJUON_ROWS = [
  { label: 'ア行', chars: ['ア', 'イ', 'ウ', 'エ', 'オ'] },
  { label: 'カ行', chars: ['カ', 'キ', 'ク', 'ケ', 'コ'] },
  { label: 'サ行', chars: ['サ', 'シ', 'ス', 'セ', 'ソ'] },
  { label: 'タ行', chars: ['タ', 'チ', 'ツ', 'テ', 'ト'] },
  { label: 'ナ行', chars: ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'] },
  { label: 'ハ行', chars: ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'] },
  { label: 'マ行', chars: ['マ', 'ミ', 'ム', 'メ', 'モ'] },
  { label: 'ヤ行', chars: ['ヤ', null, 'ユ', null, 'ヨ'] },
  { label: 'ラ行', chars: ['ラ', 'リ', 'ル', 'レ', 'ロ'] },
  { label: 'ワ行・ン', chars: ['ワ', 'ヰ', 'ヲ', 'ヱ', 'ン'] },
  { label: '記号', chars: ['゛', '゜', 'ー', null, null] }
];

export const DAKUTEN_DECOMPOSE = {
  'ガ': ['カ', '゛'], 'ギ': ['キ', '゛'], 'グ': ['ク', '゛'], 'ゲ': ['ケ', '゛'], 'ゴ': ['コ', '゛'],
  'ザ': ['サ', '゛'], 'ジ': ['シ', '゛'], 'ズ': ['ス', '゛'], 'ゼ': ['セ', '゛'], 'ゾ': ['ソ', '゛'],
  'ダ': ['タ', '゛'], 'ヂ': ['チ', '゛'], 'ヅ': ['ツ', '゛'], 'デ': ['テ', '゛'], 'ド': ['ト', '゛'],
  'バ': ['ハ', '゛'], 'ビ': ['ヒ', '゛'], 'ブ': ['フ', '゛'], 'ベ': ['ヘ', '゛'], 'ボ': ['ホ', '゛'],
  'パ': ['ハ', '゜'], 'ピ': ['ヒ', '゜'], 'プ': ['フ', '゜'], 'ペ': ['ヘ', '゜'], 'ポ': ['ホ', '゜'],
  'ヴ': ['ウ', '゛']
};

export const SMALL_TO_LARGE = {
  'ァ': 'ア', 'ィ': 'イ', 'ゥ': 'ウ', 'ェ': 'エ', 'ォ': 'オ',
  'ャ': 'ヤ', 'ュ': 'ユ', 'ョ': 'ヨ', 'ッ': 'ツ', 'ヮ': 'ワ',
  'ヵ': 'カ', 'ヶ': 'ケ'
};

// Normalize Hiragana, Fullwidth numbers, Small Kana -> Canonical Semaphore Katakana/Digits
export function normalizeForSemaphore(input) {
  let out = '';
  for (const rawCh of input) {
    const code = rawCh.charCodeAt(0);
    // Hiragana U+3041..U+3096 -> Katakana U+30A1..U+30F6
    let ch = rawCh;
    if (code >= 0x3041 && code <= 0x3096) {
      ch = String.fromCharCode(code + 0x60);
    } else if (code >= 0xFF10 && code <= 0xFF19) {
      // Fullwidth digits -> ASCII digits
      ch = String.fromCharCode(code - 0xFF10 + 0x30);
    } else if (ch === 'ｰ' || ch === '−' || ch === '―') {
      ch = 'ー';
    } else if (ch === '　') {
      ch = ' ';
    } else if (ch === '、' || ch === '。') {
      ch = '、';
    }
    if (SMALL_TO_LARGE[ch]) {
      ch = SMALL_TO_LARGE[ch];
    }
    out += ch;
  }
  // Also collapse base + combining/standalone dakuten/handakuten if user typed "カ゛"
  const RECOMPOSE = {};
  for (const [k, [base, mark]] of Object.entries(DAKUTEN_DECOMPOSE)) {
    RECOMPOSE[base + mark] = k;
  }
  let normalized = '';
  for (let i = 0; i < out.length; i++) {
    const pair = out.slice(i, i + 2);
    if (RECOMPOSE[pair]) {
      normalized += RECOMPOSE[pair];
      i++;
    } else if (KANA_MAP[out[i]] || DAKUTEN_DECOMPOSE[out[i]] || /^[0-9]$/.test(out[i]) || out[i] === ' ' || out[i] === '、') {
      normalized += out[i];
    }
  }
  return normalized.trim().replace(/\s+/g, ' ');
}

/**
 * Compiles normalized Japanese text into an ordered sequence of character tokens
 * and individual animation steps.
 */
export function compileTextToTimeline(rawText, { includeHandshake = false } = {}) {
  const normalized = normalizeForSemaphore(rawText);
  const tokens = [];
  const steps = [];

  if (includeHandshake) {
    steps.push({
      kind: 'signal',
      signalId: 'kishin',
      label: '起信（送信開始）',
      charIndex: -1,
      charLabel: '起信',
      durationFactor: 2.8
    });
    steps.push({
      kind: 'genga',
      gengaId: 'rest',
      label: '原姿',
      charIndex: -1,
      charLabel: '起信',
      durationFactor: 0.75
    });
  } else {
    steps.push({
      kind: 'genga',
      gengaId: 'rest',
      label: '原姿（構え）',
      charIndex: -1,
      charLabel: '構え',
      durationFactor: 0.5
    });
  }

  let i = 0;
  let tokenIdx = 0;
  while (i < normalized.length) {
    const ch = normalized[i];

    if (ch === ' ') {
      steps.push({
        kind: 'genga',
        gengaId: 'rest',
        label: '原姿（語間）',
        charIndex: tokenIdx - 1,
        charLabel: '空白',
        durationFactor: 1.0
      });
      tokens.push({ char: ' ', display: '␣', isSpace: true });
      tokenIdx++;
      i++;
      continue;
    }

    if (ch === '、') {
      tokens.push({ char: '、', display: '、', strokes: ['14'] });
      steps.push({
        kind: 'genga',
        gengaId: '14',
        label: '句点（14原画・長め）',
        charIndex: tokenIdx,
        charLabel: '、',
        durationFactor: 2.6
      });
      steps.push({
        kind: 'genga',
        gengaId: 'rest',
        label: '原姿',
        charIndex: tokenIdx,
        charLabel: '、',
        durationFactor: 0.85
      });
      tokenIdx++;
      i++;
      continue;
    }

    // Handle consecutive numbers wrapped by 13原画 (3x length)
    if (/^[0-9]$/.test(ch)) {
      let numEnd = i;
      while (numEnd < normalized.length && /^[0-9]$/.test(normalized[numEnd])) {
        numEnd++;
      }
      const digitRun = normalized.slice(i, numEnd);

      // Opening number marker (13原画 3x hold)
      steps.push({
        kind: 'genga',
        gengaId: '13',
        label: '数字開始（13原画×3倍）',
        charIndex: tokenIdx,
        charLabel: '数字',
        durationFactor: 2.6
      });
      steps.push({
        kind: 'genga',
        gengaId: 'rest',
        label: '原姿',
        charIndex: tokenIdx,
        charLabel: '数字',
        durationFactor: 0.75
      });

      for (const d of digitRun) {
        tokens.push({ char: d, display: d, strokes: [d], isDigit: true });
        steps.push({
          kind: 'genga',
          gengaId: d,
          label: `数字「${d}」（第${d}原画）`,
          charIndex: tokenIdx,
          charLabel: d,
          durationFactor: d === '0' ? 1.85 : 1.0
        });
        steps.push({
          kind: 'genga',
          gengaId: 'rest',
          label: '原姿',
          charIndex: tokenIdx,
          charLabel: d,
          durationFactor: 0.75
        });
        tokenIdx++;
      }

      // Closing number marker (13原画 3x hold)
      steps.push({
        kind: 'genga',
        gengaId: '13',
        label: '数字終了（13原画×3倍）',
        charIndex: tokenIdx - 1,
        charLabel: '数字終',
        durationFactor: 2.6
      });
      steps.push({
        kind: 'genga',
        gengaId: 'rest',
        label: '原姿',
        charIndex: tokenIdx - 1,
        charLabel: '数字終',
        durationFactor: 0.75
      });

      i = numEnd;
      continue;
    }

    // Handle dakuten / handakuten
    if (DAKUTEN_DECOMPOSE[ch]) {
      const [base, mark] = DAKUTEN_DECOMPOSE[ch];
      const baseStrokes = KANA_MAP[base].strokes;
      const markStrokes = KANA_MAP[mark].strokes;
      tokens.push({
        char: ch,
        display: ch,
        base,
        mark,
        strokes: [...baseStrokes, 'rest', ...markStrokes]
      });

      for (const s of baseStrokes) {
        steps.push({
          kind: 'genga',
          gengaId: s,
          label: `${ch}：${GENGA[s].short}`,
          charIndex: tokenIdx,
          charLabel: ch,
          durationFactor: s === '11' ? 1.55 : 1.0
        });
      }
      steps.push({
        kind: 'genga',
        gengaId: 'rest',
        label: `${ch}：原姿`,
        charIndex: tokenIdx,
        charLabel: ch,
        durationFactor: 0.7
      });
      for (const s of markStrokes) {
        steps.push({
          kind: 'genga',
          gengaId: s,
          label: `${ch}：${mark === '゛' ? '濁点(13)' : '半濁点(14)'}`,
          charIndex: tokenIdx,
          charLabel: ch,
          durationFactor: 1.0
        });
      }
      steps.push({
        kind: 'genga',
        gengaId: 'rest',
        label: '原姿',
        charIndex: tokenIdx,
        charLabel: ch,
        durationFactor: 0.75
      });
      tokenIdx++;
      i++;
      continue;
    }

    // Normal Katakana or ー
    if (KANA_MAP[ch]) {
      const info = KANA_MAP[ch];
      tokens.push({ char: ch, display: ch, strokes: info.strokes });
      for (const s of info.strokes) {
        steps.push({
          kind: 'genga',
          gengaId: s,
          label: `${ch}：${GENGA[s].short}`,
          charIndex: tokenIdx,
          charLabel: ch,
          durationFactor: s === '11' ? 1.55 : 1.0
        });
      }
      steps.push({
        kind: 'genga',
        gengaId: 'rest',
        label: '原姿',
        charIndex: tokenIdx,
        charLabel: ch,
        durationFactor: 0.75
      });
      tokenIdx++;
      i++;
      continue;
    }

    i++;
  }

  if (includeHandshake) {
    steps.push({
      kind: 'signal',
      signalId: 'shushin',
      label: '終信（送信終了）',
      charIndex: Math.max(0, tokenIdx - 1),
      charLabel: '終信',
      durationFactor: 2.5
    });
    steps.push({
      kind: 'genga',
      gengaId: 'rest',
      label: '原姿',
      charIndex: Math.max(0, tokenIdx - 1),
      charLabel: '終信',
      durationFactor: 0.6
    });
  }

  const answerText = tokens.map(t => t.char).join('').trim();
  return { normalized: answerText, tokens, steps };
}

// Curated Boy Scout Word & Message Bank
export const SCOUT_WORDS = [
  'ソナエヨツネニ', 'ボーイスカウト', 'カブスカウト', 'ビーバー', 'ベンチャースカウト',
  'ローバースカウト', 'キャンプ', 'ハイキング', 'テント', 'ロープ',
  'コンパス', 'チズ', 'タキビ', 'ハンゴウ', 'ザック',
  'スイトウ', 'モヤイムスビ', 'マキムスビ', 'テバタ', 'シンゴウ',
  'パトロール', 'ハンチョウ', 'シュウゴウ', 'カイサン', 'ケイレイ',
  'ヤエイ', 'ヤホウ', 'ホウコク', 'カクニン', 'アンゼン',
  'キケン', 'キュウジョ', 'リョウカイ', 'ゼンシン', 'トウチャク',
  'シュッパツ', 'キシュウ', 'ネッカチーフ', 'ジャンボリー', 'レンメイ',
  'ホゴシャ', 'フジサン', 'ヤマ', 'カワ', 'モリ',
  'ミズ', 'ヒ', 'ツキ', 'ホシ', 'カゼ',
  'アオゾラ', 'ナカマ', 'ユウキ', 'ガンバレ', 'エイユウ',
  'シレン', 'ベンポウ', 'キタ', 'ミナミ', 'ヒガシ',
  'ニシ', 'ホクセイ', 'ナントウ', 'ミチ', 'ハシ',
  'オカ', 'ミサキ', 'ワタリ', 'サバイバル', 'ナイトハイク'
];

export const SCOUT_SENTENCES = [
  'ソナエヨ ツネニ',
  'シュウゴウ 10ジ',
  'ミズヲ モッテ コイ',
  'キタ ヘ 2キロ ススメ',
  'キケン ニ チカヅクナ',
  'ゲンザイ イジョウ ナシ',
  'テント ヲ ハレ',
  'ハンチョウ カイギ',
  'トウチャク リョウカイ',
  'カゼ ガ ツヨイ',
  '5ハン ニシ ヘ イケ',
  'タキビ ノ ヒヲ ケセ',
  '3ジ ニ カイサン',
  'ヤホウ ツウシン カイシ',
  'コンパス デ キタヲ ミロ',
  'ヤエイバ ニ モドレ',
  '22ダン ファイト',
  'シンゴウ ヨシ'
];

export const TEACHING_LESSONS = [
  {
    id: 'lv1',
    title: 'STEP 1：1画だけで打てる8文字',
    desc: 'まずは1つの原画を覚えるだけで読める・打てる文字からスタート！',
    chars: ['ニ', 'ノ', 'ク', 'フ', 'ヘ', 'ハ', 'リ', 'レ']
  },
  {
    id: 'lv2',
    title: 'STEP 2：基本の2画（ア・カ・ナ行）',
    desc: '2つの原画を組み合わせた基本文字。カタカナの書き順を思い浮かべよう！',
    chars: ['ア', 'イ', 'ウ', 'カ', 'キ', 'ケ', 'コ', 'ナ', 'ヌ']
  },
  {
    id: 'lv3',
    title: 'STEP 3：3画・逆2原画・漢字連想',
    desc: 'エ・オ・ス・チ・ネ・ホの難関グループ。「寸」「子」と逆2原画がカギ！',
    chars: ['エ', 'オ', 'ス', 'チ', 'ネ', 'ホ', 'ヱ']
  },
  {
    id: 'confuse_1',
    title: '攻略①：シ・ツ・ソ・ン の見分け方',
    desc: 'すべて「点(5)」か「12原画」を含む紛らわしい4文字を並べて比較！',
    chars: ['シ', 'ツ', 'ソ', 'ン']
  },
  {
    id: 'confuse_2',
    title: '攻略②：ア・マ・ラ と ウ・ワ・ヲ・ユ',
    desc: '第9原画（フ）の前後が逆になるペアを集中マスター！',
    chars: ['ア', 'マ', 'ラ', 'ウ', 'ワ', 'ヲ', 'ユ']
  }
];

export const BASIC_46_KANA = [
  'ア', 'イ', 'ウ', 'エ', 'オ',
  'カ', 'キ', 'ク', 'ケ', 'コ',
  'サ', 'シ', 'ス', 'セ', 'ソ',
  'タ', 'チ', 'ツ', 'テ', 'ト',
  'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
  'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
  'マ', 'ミ', 'ム', 'メ', 'モ',
  'ヤ', 'ユ', 'ヨ',
  'ラ', 'リ', 'ル', 'レ', 'ロ',
  'ワ', 'ヲ', 'ン'
];

export const ALL_DAKUTEN_KANA = Object.keys(DAKUTEN_DECOMPOSE);

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateRandomProblem(category, { weakChars = [], lastAnswer = '' } = {}) {
  let candidate = '';
  for (let attempt = 0; attempt < 8; attempt++) {
    switch (category) {
      case 'kana_lv1':
        candidate = pickRandom(['ニ', 'ノ', 'ク', 'フ', 'ヘ', 'ハ', 'リ', 'レ']);
        break;
      case 'kana_basic':
        candidate = pickRandom(BASIC_46_KANA);
        break;
      case 'kana_all': {
        const pool = [...BASIC_46_KANA, ...ALL_DAKUTEN_KANA];
        candidate = pickRandom(pool);
        break;
      }
      case 'numbers': {
        const len = Math.random() < 0.45 ? 1 : (Math.random() < 0.7 ? 2 : 3);
        let numStr = '';
        for (let i = 0; i < len; i++) {
          const d = i === 0 && len > 1 ? Math.floor(1 + Math.random() * 9) : Math.floor(Math.random() * 10);
          numStr += String(d);
        }
        candidate = numStr;
        break;
      }
      case 'random_3': {
        let s = '';
        for (let i = 0; i < 3; i++) s += pickRandom(BASIC_46_KANA);
        candidate = s;
        break;
      }
      case 'random_5': {
        let s = '';
        for (let i = 0; i < 5; i++) s += pickRandom(BASIC_46_KANA);
        candidate = s;
        break;
      }
      case 'scout_words':
        candidate = pickRandom(SCOUT_WORDS);
        break;
      case 'scout_sentences':
        candidate = pickRandom(SCOUT_SENTENCES);
        break;
      case 'weak_focus': {
        if (weakChars.length > 0) {
          candidate = pickRandom(weakChars);
        } else {
          candidate = pickRandom(BASIC_46_KANA);
        }
        break;
      }
      default:
        candidate = pickRandom(BASIC_46_KANA);
    }
    if (candidate !== lastAnswer) break;
  }
  return candidate;
}

export function generateDistractorChoices(target, category, count = 4) {
  const choices = new Set([target]);
  let pool = BASIC_46_KANA;
  if (category === 'kana_lv1') pool = ['ニ', 'ノ', 'ク', 'フ', 'ヘ', 'ハ', 'リ', 'レ'];
  else if (category === 'kana_all') pool = [...BASIC_46_KANA, ...ALL_DAKUTEN_KANA];
  else if (category === 'scout_words') pool = SCOUT_WORDS;
  else if (category === 'scout_sentences') pool = SCOUT_SENTENCES;
  else if (category === 'numbers') {
    while (choices.size < count) {
      const len = target.length;
      let numStr = '';
      for (let i = 0; i < len; i++) {
        const d = i === 0 && len > 1 ? Math.floor(1 + Math.random() * 9) : Math.floor(Math.random() * 10);
        numStr += String(d);
      }
      choices.add(numStr);
    }
    return [...choices].sort(() => Math.random() - 0.5);
  } else if (category === 'random_3' || category === 'random_5') {
    const len = target.length;
    while (choices.size < count) {
      let s = '';
      for (let i = 0; i < len; i++) {
        // Sometimes keep 1-2 matching chars to make choices genuinely challenging!
        s += Math.random() < 0.35 ? target[i] : pickRandom(BASIC_46_KANA);
      }
      choices.add(s);
    }
    return [...choices].sort(() => Math.random() - 0.5);
  }

  // Prefer visually confusable characters for single kana
  const CONFUSE_GROUPS = [
    ['シ', 'ツ', 'ソ', 'ン'],
    ['ア', 'マ', 'ラ', 'ヤ'],
    ['ウ', 'ワ', 'ヲ', 'ユ'],
    ['エ', 'オ', 'ホ', 'ネ'],
    ['カ', 'コ', 'ヨ', 'キ'],
    ['ク', 'ケ', 'タ', 'ヌ', 'メ'],
    ['ニ', 'ミ', 'テ', 'モ'],
    ['レ', 'ル', 'ロ', 'ヒ', 'セ', 'ム'],
    ['ハ', 'ヘ', 'ノ', 'リ', 'ス', 'ト', 'チ']
  ];
  for (const grp of CONFUSE_GROUPS) {
    if (grp.includes(target)) {
      for (const c of grp) {
        if (choices.size < count) choices.add(c);
      }
    }
  }

  let guard = 0;
  while (choices.size < count && guard < 100) {
    choices.add(pickRandom(pool));
    guard++;
  }
  return [...choices].sort(() => Math.random() - 0.5);
}
