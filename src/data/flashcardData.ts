export interface ConfusingSoundItem {
  symbol: string;
  ipa: string;
  name: string;
  vietnameseApprox: string;
  keyTechnique: string;
  aspiration: 'none' | 'aspirated' | 'friction' | 'nasal' | 'voiced';
  sampleWord: {
    hanzi: string;
    pinyin: string;
    hanViet: string;
    meaning: string;
    audioText: string;
  };
}

export interface FlashcardPair {
  id: string;
  title: string;
  category: 'labial' | 'alveolar' | 'velar' | 'palatal' | 'dental' | 'retroflex' | 'nasal' | 'vowel';
  categoryLabel: string;
  sounds: ConfusingSoundItem[];
  distinctionRule: string;
  mouthTip: string;
  paperTest: string;
  contrastExamples: Array<{
    wordA: { hanzi: string; pinyin: string; meaning: string; audio: string };
    wordB: { hanzi: string; pinyin: string; meaning: string; audio: string };
    wordC?: { hanzi: string; pinyin: string; meaning: string; audio: string };
  }>;
}

export const CONFUSING_PAIRS_FLASHCARDS: FlashcardPair[] = [
  {
    id: 'card_b_p',
    title: 'Cặp âm b - p (Môi)',
    category: 'labial',
    categoryLabel: 'Âm Hai Môi',
    sounds: [
      {
        symbol: 'b',
        ipa: '[p]',
        name: 'Thanh mẫu b',
        vietnameseApprox: 'Giống chữ "p" trong tiếng Việt (KHÔNG rung dây thanh, KHÔNG bật hơi)',
        keyTechnique: 'Mím hai môi, hạ nhanh môi dưới nhả hơi nhẹ nhàng, luồng khí yếu.',
        aspiration: 'none',
        sampleWord: {
          hanzi: '八',
          pinyin: 'bā',
          hanViet: 'Bát',
          meaning: 'Số 8',
          audioText: '八',
        },
      },
      {
        symbol: 'p',
        ipa: '[pʰ]',
        name: 'Thanh mẫu p',
        vietnameseApprox: 'Đọc như "p" nhưng BẬT HƠI CỰC MẠNH',
        keyTechnique: 'Mím chặt hai môi, nén áp suất trong khoang miệng rồi bung mở đột ngột đẩy hơi ra.',
        aspiration: 'aspirated',
        sampleWord: {
          hanzi: '怕',
          pinyin: 'pà',
          hanViet: 'Phạ',
          meaning: 'Sợ hãi',
          audioText: '怕',
        },
      },
    ],
    distinctionRule: 'Cùng vị trí mím hai môi, nhưng "b" KHÔNG bật hơi (như p nhẹ tiếng Việt), còn "p" nén khí và BẬT HƠI MẠNH.',
    mouthTip: 'Đừng đọc "b" thành "bờ" của tiếng Việt. Tiếng Trung "b" là âm vô thanh, nghe như chữ "pa" nhẹ.',
    paperTest: 'Đặt tờ giấy mỏng trước miệng: Phát âm "b" tờ giấy đứng yên hoặc hơi rung nhẹ; phát âm "p" tờ giấy bay bật ra xa!',
    contrastExamples: [
      {
        wordA: { hanzi: '八 (bā)', pinyin: 'bā', meaning: 'Số tám', audio: '八' },
        wordB: { hanzi: '趴 (pā)', pinyin: 'pā', meaning: 'Nằm sấp', audio: '趴' },
      },
      {
        wordA: { hanzi: '爸 (bà)', pinyin: 'bà', meaning: 'Bố, ba', audio: '爸' },
        wordB: { hanzi: '怕 (pà)', pinyin: 'pà', meaning: 'Sợ hãi', audio: '怕' },
      },
      {
        wordA: { hanzi: '杯 (bēi)', pinyin: 'bēi', meaning: 'Cái cốc/ly', audio: '杯' },
        wordB: { hanzi: '胚 (pēi)', pinyin: 'pēi', meaning: 'Phôi thai', audio: '胚' },
      },
    ],
  },
  {
    id: 'card_d_t',
    title: 'Cặp âm d - t (Đầu lưỡi giữa)',
    category: 'alveolar',
    categoryLabel: 'Âm Đầu Lưỡi',
    sounds: [
      {
        symbol: 'd',
        ipa: '[t]',
        name: 'Thanh mẫu d',
        vietnameseApprox: 'Giống chữ "t" trong tiếng Việt (KHÔNG bật hơi)',
        keyTechnique: 'Đầu lưỡi dán vào chân răng hàm trên, hạ xuống nhẹ nhàng, dứt khoát.',
        aspiration: 'none',
        sampleWord: {
          hanzi: '大',
          pinyin: 'dà',
          hanViet: 'Đại',
          meaning: 'To lớn',
          audioText: '大',
        },
      },
      {
        symbol: 't',
        ipa: '[tʰ]',
        name: 'Thanh mẫu t',
        vietnameseApprox: 'Giống chữ "th" nhưng BẬT HƠI NÉN MẠNH',
        keyTechnique: 'Đầu lưỡi dán chân răng trên nén hơi, sau đó giật lùi bật luồng khí cực mạnh.',
        aspiration: 'aspirated',
        sampleWord: {
          hanzi: '他',
          pinyin: 'tā',
          hanViet: 'Tha',
          meaning: 'Anh ấy / Cậu ấy',
          audioText: '他',
        },
      },
    ],
    distinctionRule: 'Cùng chạm đầu lưỡi vào chân răng trên, nhưng "d" nhả hơi nhẹ (như t tiếng Việt), còn "t" nén khí và bật hơi mạnh mẽ (như th bật gió).',
    mouthTip: 'Tuyệt đối KHÔNG đọc "d" thành chữ "đ" tiếng Việt (vì "đ" rung dây thanh). Dây thanh quản của "d" hoàn toàn thả lỏng.',
    paperTest: 'Phát âm "dà" tờ giấy cách miệng 5cm đứng im; phát âm "tā" luồng gió phụt ra làm tờ giấy rung mạnh!',
    contrastExamples: [
      {
        wordA: { hanzi: '大 (dà)', pinyin: 'dà', meaning: 'To lớn', audio: '大' },
        wordB: { hanzi: '踏 (tà)', pinyin: 'tà', meaning: 'Dẫm đạp', audio: '踏' },
      },
      {
        wordA: { hanzi: '刀 (dāo)', pinyin: 'dāo', meaning: 'Con dao', audio: '刀' },
        wordB: { hanzi: '涛 (tāo)', pinyin: 'tāo', meaning: 'Sóng lớn', audio: '涛' },
      },
      {
        wordA: { hanzi: '低 (dī)', pinyin: 'dī', meaning: 'Thấp', audio: '低' },
        wordB: { hanzi: '梯 (tī)', pinyin: 'tī', meaning: 'Cái thang', audio: '梯' },
      },
    ],
  },
  {
    id: 'card_g_k',
    title: 'Cặp âm g - k (Gốc lưỡi)',
    category: 'velar',
    categoryLabel: 'Âm Gốc Lưỡi',
    sounds: [
      {
        symbol: 'g',
        ipa: '[k]',
        name: 'Thanh mẫu g',
        vietnameseApprox: 'Giống chữ "c/k" trong tiếng Việt (KHÔNG bật hơi)',
        keyTechnique: 'Cuống lưỡi nâng lên chạm ngạc mềm chặn hơi rồi hạ xuống nhả tự nhiên.',
        aspiration: 'none',
        sampleWord: {
          hanzi: '哥',
          pinyin: 'gē',
          hanViet: 'Ca',
          meaning: 'Anh trai',
          audioText: '哥哥',
        },
      },
      {
        symbol: 'k',
        ipa: '[kʰ]',
        name: 'Thanh mẫu k',
        vietnameseApprox: 'Giống chữ "kh" nhưng BẬT TẮC HƠI MẠNH TỪ CUỐNG HỌNG',
        keyTechnique: 'Cuống lưỡi nén hơi thật chặt ở họng rồi bật giật mạnh đẩy hơi tung ra ngoài.',
        aspiration: 'aspirated',
        sampleWord: {
          hanzi: '渴',
          pinyin: 'kě',
          hanViet: 'Khát',
          meaning: 'Khát nước',
          audioText: '渴',
        },
      },
    ],
    distinctionRule: 'Cùng nén hơi ở cuống họng, "g" phát âm gọn như chữ "cô/ca" tiếng Việt, còn "k" tống hơi dứt khoát làm bay giấy.',
    mouthTip: 'Đừng phát âm "k" thành "kh" cọ xát êm ả như tiếng Việt. "k" là âm tắc bật hơi, nghe đanh và giòn hơn "kh".',
    paperTest: 'Phát âm "gē" khăn giấy đứng im; phát âm "kē" cuống họng nén bắn luồng hơi làm khăn giấy bay.',
    contrastExamples: [
      {
        wordA: { hanzi: '哥 (gē)', pinyin: 'gē', meaning: 'Anh trai', audio: '哥' },
        wordB: { hanzi: '棵 (kē)', pinyin: 'kē', meaning: 'Cây (lượng từ)', audio: '棵' },
      },
      {
        wordA: { hanzi: '高 (gāo)', pinyin: 'gāo', meaning: 'Cao lớn', audio: '高' },
        wordB: { hanzi: '考 (kǎo)', pinyin: 'kǎo', meaning: 'Thi cử', audio: '考' },
      },
      {
        wordA: { hanzi: '干 (gān)', pinyin: 'gān', meaning: 'Khô ráo', audio: '干' },
        wordB: { hanzi: '看 (kàn)', pinyin: 'kàn', meaning: 'Nhìn, xem', audio: '看' },
      },
    ],
  },
  {
    id: 'card_j_q_x',
    title: 'Bộ ba âm j - q - x (Mặt lưỡi)',
    category: 'palatal',
    categoryLabel: 'Bộ 3 Âm Mặt Lưỡi',
    sounds: [
      {
        symbol: 'j',
        ipa: '[tɕ]',
        name: 'Thanh mẫu j',
        vietnameseApprox: 'Gần giống "ch/chi" trong tiếng Việt (KHÔNG bật hơi, bẹt mép)',
        keyTechnique: 'Chóp lưỡi dán sau răng dưới, mặt lưỡi ép lên ngạc cứng rồi hé nhẹ nhả hơi êm.',
        aspiration: 'none',
        sampleWord: {
          hanzi: '鸡',
          pinyin: 'jī',
          hanViet: 'Kê',
          meaning: 'Con gà',
          audioText: '鸡',
        },
      },
      {
        symbol: 'q',
        ipa: '[tɕʰ]',
        name: 'Thanh mẫu q',
        vietnameseApprox: 'Khẩu hình như "j" nhưng BẬT HƠI CỰC MẠNH',
        keyTechnique: 'Mặt lưỡi ép ngạc cứng nén luồng hơi, sau đó bắn bung luồng hơi gió mạnh qua khe.',
        aspiration: 'aspirated',
        sampleWord: {
          hanzi: '七',
          pinyin: 'qī',
          hanViet: 'Thất',
          meaning: 'Số 7',
          audioText: '七',
        },
      },
      {
        symbol: 'x',
        ipa: '[ɕ]',
        name: 'Thanh mẫu x',
        vietnameseApprox: 'Giống chữ "x" nhẹ tiếng Việt nhưng mặt lưỡi áp sát ngạc cứng',
        keyTechnique: 'Mặt lưỡi nâng gần sát ngạc cứng, đẩy hơi ma sát liên tục không ngắt.',
        aspiration: 'friction',
        sampleWord: {
          hanzi: '西',
          pinyin: 'xī',
          hanViet: 'Tây',
          meaning: 'Phía tây',
          audioText: '西',
        },
      },
    ],
    distinctionRule: 'Cả 3 âm đều: Chóp lưỡi đặt cố định sau răng cửa hàm dưới, khóe miệng kéo bẹt sang hai bên như đang cười. "j" êm không bật hơi; "q" bật hơi mạnh tóe khói; "x" xát hơi ma sát nhẹ nhàng.',
    mouthTip: 'Luôn giữ khóe môi kéo ngang như đang mỉm cười và chóp lưỡi chạm chân răng dưới. Chỉ ghép với vận mẫu hàng "i" và "ü"!',
    paperTest: 'Phát âm "jī" giấy đứng im; "qī" giấy bay phần phật; "xī" giấy chỉ rung nhẹ do luồng xát êm.',
    contrastExamples: [
      {
        wordA: { hanzi: '鸡 (jī)', pinyin: 'jī', meaning: 'Con gà (êm)', audio: '鸡' },
        wordB: { hanzi: '七 (qī)', pinyin: 'qī', meaning: 'Số bảy (bật)', audio: '七' },
        wordC: { hanzi: '西 (xī)', pinyin: 'xī', meaning: 'Phía tây (xát)', audio: '西' },
      },
      {
        wordA: { hanzi: '家 (jiā)', pinyin: 'jiā', meaning: 'Gia đình', audio: '家' },
        wordB: { hanzi: '掐 (qiā)', pinyin: 'qiā', meaning: 'Bấu, véo', audio: '掐' },
        wordC: { hanzi: '虾 (xiā)', pinyin: 'xiā', meaning: 'Con tôm', audio: '虾' },
      },
      {
        wordA: { hanzi: '叫 (jiào)', pinyin: 'jiào', meaning: 'Kêu, gọi', audio: '叫' },
        wordB: { hanzi: '鞘 (qiào)', pinyin: 'qiào', meaning: 'Vỏ kiếm', audio: '鞘' },
        wordC: { hanzi: '笑 (xiào)', pinyin: 'xiào', meaning: 'Cười', audio: '笑' },
      },
    ],
  },
  {
    id: 'card_z_c_s',
    title: 'Bộ ba âm z - c - s (Đầu lưỡi trước / Thẳng lưỡi)',
    category: 'dental',
    categoryLabel: 'Âm Đầu Lưỡi Trước',
    sounds: [
      {
        symbol: 'z',
        ipa: '[ts]',
        name: 'Thanh mẫu z',
        vietnameseApprox: 'Giống chữ "ch" tiếng Việt nhưng thẳng lưỡi cắn răng, KHÔNG bật hơi',
        keyTechnique: 'Hai hàm răng khép gần sát, đầu lưỡi thẳng dán sau răng trên rồi hé khe xì hơi.',
        aspiration: 'none',
        sampleWord: {
          hanzi: '早',
          pinyin: 'zǎo',
          hanViet: 'Tảo',
          meaning: 'Buổi sáng, sớm',
          audioText: '早',
        },
      },
      {
        symbol: 'c',
        ipa: '[tsʰ]',
        name: 'Thanh mẫu c',
        vietnameseApprox: 'Khẩu hình như "z" nhưng BẬT HƠI CỰC MẠNH qua kẽ răng',
        keyTechnique: 'Đầu lưỡi ép sau răng trên nén hơi, rồi bung giật mạnh luồng hơi gió qua kẽ răng.',
        aspiration: 'aspirated',
        sampleWord: {
          hanzi: '菜',
          pinyin: 'cài',
          hanViet: 'Thái',
          meaning: 'Món ăn, rau',
          audioText: '菜',
        },
      },
      {
        symbol: 's',
        ipa: '[s]',
        name: 'Thanh mẫu s',
        vietnameseApprox: 'Giống chữ "x" nhẹ tiếng Việt (xinh, xôi)',
        keyTechnique: 'Đầu lưỡi duỗi thẳng để sát sau răng trên, xì hơi ma sát liên tục qua kẽ răng.',
        aspiration: 'friction',
        sampleWord: {
          hanzi: '三',
          pinyin: 'sān',
          hanViet: 'Tam',
          meaning: 'Số ba (3)',
          audioText: '三',
        },
      },
    ],
    distinctionRule: 'Đặc trưng là LƯỠI DUỖI THẲNG và hai hàm răng khép gần khít. "z" không bật hơi; "c" nén và bật xì hơi cực mạnh; "s" xát hơi êm.',
    mouthTip: 'Âm "c" là âm khó nhất: Tưởng tượng phát âm "ts" thật mạnh sao cho luồng hơi bắn xuyên qua kẽ hai hàm răng!',
    paperTest: 'Phát âm "cài" thì tờ khăn giấy trước kẽ răng phải bay văng về phía trước!',
    contrastExamples: [
      {
        wordA: { hanzi: '早 (zǎo)', pinyin: 'zǎo', meaning: 'Sớm', audio: '早' },
        wordB: { hanzi: '草 (cǎo)', pinyin: 'cǎo', meaning: 'Cây cỏ (bật)', audio: '草' },
        wordC: { hanzi: '扫 (sǎo)', pinyin: 'sǎo', meaning: 'Quét dọn (xát)', audio: '扫' },
      },
      {
        wordA: { hanzi: '字 (zì)', pinyin: 'zì', meaning: 'Chữ viết', audio: '字' },
        wordB: { hanzi: '次 (cì)', pinyin: 'cì', meaning: 'Lần, thứ tự', audio: '次' },
        wordC: { hanzi: '四 (sì)', pinyin: 'sì', meaning: 'Số 4', audio: '四' },
      },
    ],
  },
  {
    id: 'card_zh_ch_sh_r',
    title: 'Bộ bốn âm zh - ch - sh - r (Uốn cong lưỡi / Cuốn lưỡi)',
    category: 'retroflex',
    categoryLabel: 'Âm Cuốn Lưỡi (Uốn Lưỡi)',
    sounds: [
      {
        symbol: 'zh',
        ipa: '[ʈʂ]',
        name: 'Thanh mẫu zh',
        vietnameseApprox: 'Giống chữ "tr" uốn cong lưỡi tiếng Việt, KHÔNG bật hơi',
        keyTechnique: 'Đầu lưỡi cong lên chạm ngạc cứng phía trên, hạ nhẹ nhả luồng khí dứt khoát.',
        aspiration: 'none',
        sampleWord: {
          hanzi: '中',
          pinyin: 'zhōng',
          hanViet: 'Trung',
          meaning: 'Ở giữa, Trung Quốc',
          audioText: '中国',
        },
      },
      {
        symbol: 'ch',
        ipa: '[ʈʂʰ]',
        name: 'Thanh mẫu ch',
        vietnameseApprox: 'Uốn cong lưỡi như "zh" nhưng BẬT HƠI CỰC MẠNH',
        keyTechnique: 'Đầu lưỡi cong chạm ngạc cứng nén hơi, sau đó giật bung luồng hơi mạnh ra ngoài.',
        aspiration: 'aspirated',
        sampleWord: {
          hanzi: '吃',
          pinyin: 'chī',
          hanViet: 'Ngật',
          meaning: 'Ăn cơm',
          audioText: '吃',
        },
      },
      {
        symbol: 'sh',
        ipa: '[ʂ]',
        name: 'Thanh mẫu sh',
        vietnameseApprox: 'Giống chữ "s" nặng uốn cong lưỡi (sông, sương)',
        keyTechnique: 'Đầu lưỡi cong để sát ngạc cứng, đẩy hơi cọ xát liên tục tạo âm xát trầm dày.',
        aspiration: 'friction',
        sampleWord: {
          hanzi: '水',
          pinyin: 'shuǐ',
          hanViet: 'Thủy',
          meaning: 'Nước',
          audioText: '水',
        },
      },
    ],
    distinctionRule: 'Tất cả đều phải UỐN CHÓP LƯỠI LÊN NÓC VÒM MIỆNG (ngạc cứng). zh không bật hơi; ch bật hơi cực mạnh; sh xát hơi; r rung dây thanh.',
    mouthTip: 'Đừng phát âm thẳng lưỡi (zh thành z, ch thành c, sh thành s). Hãy cong chóp lưỡi ngược lên nóc họng như khi đọc "trời nắng" miền Nam!',
    paperTest: 'Phát âm "zhōng" giấy không bay; phát âm "chī" giấy bay mạnh mẽ; "shuǐ" giấy rung đều.',
    contrastExamples: [
      {
        wordA: { hanzi: '知 (zhī)', pinyin: 'zhī', meaning: 'Biết, tri thức', audio: '知' },
        wordB: { hanzi: '吃 (chī)', pinyin: 'chī', meaning: 'Ăn uống (bật)', audio: '吃' },
        wordC: { hanzi: '诗 (shī)', pinyin: 'shī', meaning: 'Thơ ca (xát)', audio: '诗' },
      },
      {
        wordA: { hanzi: '照 (zhào)', pinyin: 'zhào', meaning: 'Chiếu, chụp ảnh', audio: '照' },
        wordB: { hanzi: '炒 (chǎo)', pinyin: 'chǎo', meaning: 'Xào nấu', audio: '炒' },
        wordC: { hanzi: '少 (shǎo)', pinyin: 'shǎo', meaning: 'Ít ỏi', audio: '少' },
      },
    ],
  },
  {
    id: 'card_z_zh_contrast',
    title: 'Đối chiếu z (Thẳng lưỡi) vs zh (Uốn cong lưỡi)',
    category: 'retroflex',
    categoryLabel: 'Thẳng Lưỡi vs Uốn Lưỡi',
    sounds: [
      {
        symbol: 'z',
        ipa: '[ts]',
        name: 'Thanh mẫu z (Thẳng lưỡi)',
        vietnameseApprox: 'Lưỡi nằm thẳng ép sau răng trên, miệng dẹp bẹt',
        keyTechnique: 'Không uốn lưỡi, hai hàm răng cắn gần sát.',
        aspiration: 'none',
        sampleWord: {
          hanzi: '早',
          pinyin: 'zǎo',
          hanViet: 'Tảo',
          meaning: 'Sớm',
          audioText: '早',
        },
      },
      {
        symbol: 'zh',
        ipa: '[ʈʂ]',
        name: 'Thanh mẫu zh (Uốn lưỡi)',
        vietnameseApprox: 'Chóp lưỡi uốn cong lên nóc miệng (ngạc cứng), môi hơi tròn',
        keyTechnique: 'Uốn cong lưỡi, tạo âm trầm và dày dặn hơn.',
        aspiration: 'none',
        sampleWord: {
          hanzi: '找',
          pinyin: 'zhǎo',
          hanViet: 'Triệu',
          meaning: 'Tìm kiếm',
          audioText: '找',
        },
      },
    ],
    distinctionRule: 'Cùng là âm không bật hơi, khác biệt cốt tử là "z" lưỡi thẳng chạm kẽ răng, còn "zh" lưỡi cong chạm nóc vòm họng.',
    mouthTip: 'Luyện tập câu khẩu quyết: "Sáng sớm (zǎo - 早) đi tìm (zhǎo - 找) quyển sách".',
    paperTest: 'Cả hai âm đều không làm bay giấy vì không bật hơi nén khí.',
    contrastExamples: [
      {
        wordA: { hanzi: '早 (zǎo)', pinyin: 'zǎo', meaning: 'Sớm (thẳng)', audio: '早' },
        wordB: { hanzi: '找 (zhǎo)', pinyin: 'zhǎo', meaning: 'Tìm kiếm (uốn)', audio: '找' },
      },
      {
        wordA: { hanzi: '做 (zuò)', pinyin: 'zuò', meaning: 'Làm việc', audio: '做' },
        wordB: { hanzi: '桌 (zhuō)', pinyin: 'zhuō', meaning: 'Cái bàn', audio: '桌' },
      },
      {
        wordA: { hanzi: '字 (zì)', pinyin: 'zì', meaning: 'Chữ viết', audio: '字' },
        wordB: { hanzi: '志 (zhì)', pinyin: 'zhì', meaning: 'Ý chí', audio: '志' },
      },
    ],
  },
  {
    id: 'card_an_ang',
    title: 'Cặp vần an (Mũi trước) vs ang (Mũi sau)',
    category: 'nasal',
    categoryLabel: 'Vần Mũi Trước vs Sau',
    sounds: [
      {
        symbol: 'an',
        ipa: '[an]',
        name: 'Vận mẫu an (Mũi trước)',
        vietnameseApprox: 'Gần giống "an" tiếng Việt nhưng kết thúc bằng đầu lưỡi chạm chân răng trên',
        keyTechnique: 'Mở miệng phát âm a rồi nhanh chóng đưa đầu lưỡi áp chặt vào nướu răng trên, âm thoát nhẹ qua mũi.',
        aspiration: 'nasal',
        sampleWord: {
          hanzi: '安',
          pinyin: 'ān',
          hanViet: 'An',
          meaning: 'Bình an',
          audioText: '平安',
        },
      },
      {
        symbol: 'ang',
        ipa: '[ɑŋ]',
        name: 'Vận mẫu ang (Mũi sau)',
        vietnameseApprox: 'Giống "ang" tiếng Việt nhưng khoang miệng mở rộng hơn, vang trong cổ họng',
        keyTechnique: 'Mở rộng miệng phát âm a lùi về sau, cuống lưỡi nâng lên áp ngạc mềm, âm vang sâu trong họng.',
        aspiration: 'nasal',
        sampleWord: {
          hanzi: '昂',
          pinyin: 'áng',
          hanViet: 'Ngang',
          meaning: 'Hiên ngang, đắt đỏ',
          audioText: '昂',
        },
      },
    ],
    distinctionRule: 'Đuôi "-n" (mũi trước) kết thúc khi đầu lưỡi chạm chân răng trên (khép miệng hẹp). Đuôi "-ng" (mũi sau) kết thúc khi cuống lưỡi nâng lên, khoang miệng mở rộng và tiếng vang sâu trong vòm họng.',
    mouthTip: 'Với âm "an", sau khi dứt âm lưỡi bạn phải đang dính ở chân răng cửa trên. Với "ang", lưỡi không chạm răng cửa mà lùi sâu trong cổ.',
    paperTest: 'Cảm nhận độ rung: Với "-ng", đặt tay lên cổ họng và sống mũi sẽ thấy rung vang mạnh hơn nhiều so với "-n".',
    contrastExamples: [
      {
        wordA: { hanzi: '班 (bān)', pinyin: 'bān', meaning: 'Lớp học (mũi trước)', audio: '班' },
        wordB: { hanzi: '帮 (bāng)', pinyin: 'bāng', meaning: 'Giúp đỡ (mũi sau)', audio: '帮' },
      },
      {
        wordA: { hanzi: '看 (kàn)', pinyin: 'kàn', meaning: 'Xem, nhìn', audio: '看' },
        wordB: { hanzi: '康 (kāng)', pinyin: 'kāng', meaning: 'Khỏe mạnh', audio: '康' },
      },
      {
        wordA: { hanzi: '单 (dān)', pinyin: 'dān', meaning: 'Đơn độc, lẻ', audio: '单' },
        wordB: { hanzi: '当 (dāng)', pinyin: 'dāng', meaning: 'Làm, đảm nhận', audio: '当' },
      },
    ],
  },
  {
    id: 'card_in_ing',
    title: 'Cặp vần in (Mũi trước) vs ing (Mũi sau)',
    category: 'nasal',
    categoryLabel: 'Vần Mũi Trước vs Sau',
    sounds: [
      {
        symbol: 'in',
        ipa: '[in]',
        name: 'Vận mẫu in (Mũi trước)',
        vietnameseApprox: 'Giống "in" tiếng Việt (tin nhắn, chín)',
        keyTechnique: 'Phát âm i rồi đầu lưỡi nâng lên chạm nướu răng trên, ngắt hơi gọn.',
        aspiration: 'nasal',
        sampleWord: {
          hanzi: '音',
          pinyin: 'yīn',
          hanViet: 'Âm',
          meaning: 'Âm thanh',
          audioText: '音乐',
        },
      },
      {
        symbol: 'ing',
        ipa: '[iŋ]',
        name: 'Vận mẫu ing (Mũi sau)',
        vietnameseApprox: 'Gần giống "inh" tiếng Việt (thông minh, lính)',
        keyTechnique: 'Phát âm i kéo dài rồi nâng cuống lưỡi lên chặn ngạc mềm, ngân vang trong xoang mũi.',
        aspiration: 'nasal',
        sampleWord: {
          hanzi: '英',
          pinyin: 'yīng',
          hanViet: 'Anh',
          meaning: 'Anh dũng, nước Anh',
          audioText: '英雄',
        },
      },
    ],
    distinctionRule: 'Âm "in" dứt khoát tại chân răng cửa trên. Âm "ing" vang ngân dài hơn ở cuống họng và khoang mũi sau.',
    mouthTip: 'Người miền Nam và miền Trung hay nhầm lẫn hai âm này. Hãy chú ý vị trí chạm của đầu lưỡi (in = chạm răng trên) và cuống lưỡi (ing = cuống họng ngân vang).',
    paperTest: 'Khi phát âm "ing", âm thanh có độ vang xoang mũi rõ rệt hơn hẳn "in".',
    contrastExamples: [
      {
        wordA: { hanzi: '金 (jīn)', pinyin: 'jīn', meaning: 'Vàng, tiền', audio: '金' },
        wordB: { hanzi: '京 (jīng)', pinyin: 'jīng', meaning: 'Kinh đô (Bắc Kinh)', audio: '京' },
      },
      {
        wordA: { hanzi: '心 (xīn)', pinyin: 'xīn', meaning: 'Trái tim', audio: '心' },
        wordB: { hanzi: '星 (xīng)', pinyin: 'xīng', meaning: 'Ngôi sao', audio: '星' },
      },
      {
        wordA: { hanzi: '林 (lín)', pinyin: 'lín', meaning: 'Rừng cây', audio: '林' },
        wordB: { hanzi: '零 (líng)', pinyin: 'líng', meaning: 'Số 0', audio: '零' },
      },
    ],
  },
  {
    id: 'card_u_yu',
    title: 'Cặp nguyên âm u vs ü (Tròn môi)',
    category: 'vowel',
    categoryLabel: 'Nguyên Âm Tròn Môi',
    sounds: [
      {
        symbol: 'u',
        ipa: '[u]',
        name: 'Vận mẫu u',
        vietnameseApprox: 'Giống chữ "u" tiếng Việt (thu, ru)',
        keyTechnique: 'Lưỡi lùi về phía sau, môi chu tròn nhô ra phía trước.',
        aspiration: 'none',
        sampleWord: {
          hanzi: '路',
          pinyin: 'lù',
          hanViet: 'Lộ',
          meaning: 'Con đường',
          audioText: '路',
        },
      },
      {
        symbol: 'ü',
        ipa: '[y]',
        name: 'Vận mẫu ü (yu)',
        vietnameseApprox: 'Lưỡi đọc chữ "i" nhưng môi chúm tròn hình chữ "u" (không dịch chuyển)',
        keyTechnique: 'Mẹo vàng: Giữ nguyên vị trí lưỡi như khi nói chữ "i", sau đó chúm môi tròn lại thành vòng tròn nhỏ phát ra âm "uy/i".',
        aspiration: 'none',
        sampleWord: {
          hanzi: '绿',
          pinyin: 'lǜ',
          hanViet: 'Lục',
          meaning: 'Màu xanh lá',
          audioText: '绿',
        },
      },
    ],
    distinctionRule: '"u" thì cuống lưỡi nâng cao ở phía sau; còn "ü" thì thân lưỡi nâng cao ở phía trước hệt như chữ "i" nhưng môi phải chu tròn nhỏ.',
    mouthTip: 'Để phát âm chuẩn "ü": Hãy phát âm chữ "i" kéo dài, trong lúc đang nói chữ "i", hãy từ từ khép môi lại thành một lỗ tròn nhỏ như huýt sáo!',
    paperTest: 'Khẩu hình của "ü" chúm tròn nhỏ hơn nhiều so với "u".',
    contrastExamples: [
      {
        wordA: { hanzi: '路 (lù)', pinyin: 'lù', meaning: 'Con đường (u)', audio: '路' },
        wordB: { hanzi: '绿 (lǜ)', pinyin: 'lǜ', meaning: 'Màu xanh (ü)', audio: '绿' },
      },
      {
        wordA: { hanzi: '努 (nǔ)', pinyin: 'nǔ', meaning: 'Cố gắng (nǔlì)', audio: '努' },
        wordB: { hanzi: '女 (nǚ)', pinyin: 'nǚ', meaning: 'Phụ nữ, con gái', audio: '女' },
      },
    ],
  },
];
