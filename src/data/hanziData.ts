export interface BasicStroke {
  id: string;
  nameZh: string;
  pinyin: string;
  nameVi: string;
  direction: string;
  directionIcon: string;
  description: string;
  writingTechnique: string[];
  commonMistakes: string;
  sampleHanzi: Array<{ char: string; pinyin: string; meaning: string }>;
  svgPath: string; // Viewbox 0 0 100 100 path for drawing demonstration
}

export interface StrokeOrderRule {
  id: string;
  number: number;
  ruleZh: string;
  pinyin: string;
  ruleVi: string;
  meaning: string;
  formula: string;
  explanation: string;
  exampleChar: string;
  examplePinyin: string;
  exampleMeaning: string;
  steps: Array<{
    stepNumber: number;
    strokeName: string;
    description: string;
    snapshotPath: string; // Cumulative path for this step
  }>;
}

export interface HanziCharacterStroke {
  index: number;
  name: string;
  directionDescription: string;
  path: string; // SVG path data (normalized 0 0 200 200)
}

export interface HanziCharacterItem {
  id: string;
  char: string;
  pinyin: string;
  hanViet: string;
  meaning: string;
  radical: string;
  strokeCount: number;
  level: 'Cơ bản' | 'HSK 1' | 'HSK 2';
  mnemonicStory: string;
  strokes: HanziCharacterStroke[];
}

export const BASIC_STROKES: BasicStroke[] = [
  {
    id: 'stroke_heng',
    nameZh: '横',
    pinyin: 'Héng',
    nameVi: 'Nét Ngang',
    direction: 'Từ trái sang phải (nghiêng nhẹ lên)',
    directionIcon: '→',
    description: 'Nét cơ bản nhất trong chữ Hán, đưa bút từ trái sang phải, hơi chếch nhẹ lên trên ở điểm kết.',
    writingTechnique: [
      'Đặt bút (Khởi bút): Nhẹ nhàng ấn mũi bút ở phía bên trái.',
      'Hành bút: Đưa bút đều tay từ trái sang phải, hơi chếch lên khoảng 3-5 độ.',
      'Thu bút: Hơi nhấn nhẹ đầu bút ở điểm cuối rồi nhấc bút dứt khoát.',
    ],
    commonMistakes: 'Viết nằm ngang tuyệt đối hoặc chếch xuống dưới làm chữ mất sinh khí; đuôi nét không có điểm nhấn thu bút.',
    sampleHanzi: [
      { char: '一', pinyin: 'yī', meaning: 'Số một' },
      { char: '二', pinyin: 'èr', meaning: 'Số hai' },
      { char: '三', pinyin: 'sān', meaning: 'Số ba' },
      { char: '十', pinyin: 'shí', meaning: 'Số mười' },
    ],
    svgPath: 'M 18,50 C 35,49 65,47 82,46',
  },
  {
    id: 'stroke_shu',
    nameZh: '竖',
    pinyin: 'Shù',
    nameVi: 'Nét Sổ (Dọc)',
    direction: 'Từ trên xuống dưới',
    directionIcon: '↓',
    description: 'Nét thẳng đứng như cột trụ của chữ Hán, đưa bút thẳng từ trên xuống.',
    writingTechnique: [
      'Đặt bút: Ấn nhẹ đầu bút ở điểm cao nhất.',
      'Hành bút: Kéo thẳng đứng vuông góc từ trên xuống với tốc độ đều và lực đầm.',
      'Thu bút: Có 2 kiểu: Sổ huyền (vuốt nhọn đuôi như kim may) hoặc Sổ thùy (dừng nhấn tròn đầu ở cuối).',
    ],
    commonMistakes: 'Nét bị nghiêng lệch vẹo, hoặc tay run làm nét không thẳng đứng vuông vức.',
    sampleHanzi: [
      { char: '十', pinyin: 'shí', meaning: 'Số mười' },
      { char: '中', pinyin: 'zhōng', meaning: 'Ở giữa' },
      { char: '木', pinyin: 'mù', meaning: 'Cây gỗ' },
      { char: '山', pinyin: 'shān', meaning: 'Ngọn núi' },
    ],
    svgPath: 'M 50,18 C 50,40 50,65 50,82',
  },
  {
    id: 'stroke_pie',
    nameZh: '撇',
    pinyin: 'Piě',
    nameVi: 'Nét Phẩy',
    direction: 'Từ trên xuống cong dần sang trái',
    directionIcon: '↙',
    description: 'Nét vuốt cong thanh thoát từ trên sang phía dưới bên trái, đuôi nét vuốt nhọn.',
    writingTechnique: [
      'Đặt bút: Nhấn hơi nặng tay ở góc trên bên phải.',
      'Hành bút: Đưa cong nhẹ nhàng lướt dần sang góc dưới bên trái.',
      'Thu bút: Giảm dần lực tay và vuốt nhọn đuôi nét thanh thoát.',
    ],
    commonMistakes: 'Viết thành đường thẳng đơ không cong, hoặc đuôi nét bị cụt không vuốt nhọn bay bổng.',
    sampleHanzi: [
      { char: '人', pinyin: 'rén', meaning: 'Con người' },
      { char: '大', pinyin: 'dà', meaning: 'To lớn' },
      { char: '八', pinyin: 'bā', meaning: 'Số tám' },
      { char: '月', pinyin: 'yuè', meaning: 'Mặt trăng' },
    ],
    svgPath: 'M 72,22 C 60,42 42,66 22,78',
  },
  {
    id: 'stroke_na',
    nameZh: '捺',
    pinyin: 'Nà',
    nameVi: 'Nét Mác',
    direction: 'Từ trên xuống sang phải',
    directionIcon: '↘',
    description: 'Nét đối xứng với nét phẩy, đi từ trên xuống dưới sang phải, đậm dần rồi vuốt nhọn.',
    writingTechnique: [
      'Khởi bút: Đặt bút nhẹ nhàng ở phía trên bên trái.',
      'Hành bút: Nghiêng dần sang phải và ấn mạnh dần tay để nét dày đậm dần.',
      'Thu bút: Đến điểm nhấn nhất thì hơi dừng bút rồi vuốt ngang sang phải thu nhọn đuôi.',
    ],
    commonMistakes: 'Độ dày từ đầu đến cuối đều nhau, hoặc không vuốt nhọn chân nét mác.',
    sampleHanzi: [
      { char: '人', pinyin: 'rén', meaning: 'Con người' },
      { char: '大', pinyin: 'dà', meaning: 'To lớn' },
      { char: '天', pinyin: 'tiān', meaning: 'Bầu trời' },
      { char: '木', pinyin: 'mù', meaning: 'Cây gỗ' },
    ],
    svgPath: 'M 28,24 C 40,42 60,65 82,78',
  },
  {
    id: 'stroke_dian',
    nameZh: '点',
    pinyin: 'Diǎn',
    nameVi: 'Nét Chấm',
    direction: 'Từ trên xuống chếch nhẹ sang phải',
    directionIcon: '·↘',
    description: 'Nét ngắn gọn như giọt nước rơi, đầu nhọn đuôi tròn đầy đặn.',
    writingTechnique: [
      'Khởi bút: Chạm nhẹ đầu nhọn của bút vào mặt giấy.',
      'Hành bút: Đưa nhanh theo hướng chéo xuống phải, ấn mạnh dần đầu bút.',
      'Thu bút: Dừng tay ấn tròn đuôi rồi nhấc bút dứt khoát.',
    ],
    commonMistakes: 'Chấm thành hình tròn vo như quả bóng hoặc kéo dài thành nét gạch bừa bãi.',
    sampleHanzi: [
      { char: '六', pinyin: 'liù', meaning: 'Số sáu' },
      { char: '门', pinyin: 'mén', meaning: 'Cánh cửa' },
      { char: '字', pinyin: 'zì', meaning: 'Chữ viết' },
      { char: '下', pinyin: 'xià', meaning: 'Phía dưới' },
    ],
    svgPath: 'M 38,36 C 45,44 55,54 62,60',
  },
  {
    id: 'stroke_ti',
    nameZh: '提',
    pinyin: 'Tí',
    nameVi: 'Nét Hất',
    direction: 'Từ dưới hất chếch lên trên sang phải',
    directionIcon: '↗',
    description: 'Nét hất nhọn dứt khoát từ góc dưới trái lên góc trên phải.',
    writingTechnique: [
      'Khởi bút: Đặt bút nhấn hơi nặng ở góc dưới bên trái.',
      'Hành bút: Dùng sức cổ tay hất nhanh và dứt khoát chếch lên trên sang phải.',
      'Thu bút: Nhấc nhẹ bút ngay khi hất để đuôi nét nhọn hoắt sắc bén.',
    ],
    commonMistakes: 'Hất quá chậm làm nét bị tù đầu, hoặc hất theo góc ngang làm nhầm với nét ngang.',
    sampleHanzi: [
      { char: '地', pinyin: 'dì', meaning: 'Đất đai' },
      { char: '江', pinyin: 'jiāng', meaning: 'Dòng sông' },
      { char: '我', pinyin: 'wǒ', meaning: 'Tôi, mình' },
      { char: '打', pinyin: 'dǎ', meaning: 'Đánh, gọi điện' },
    ],
    svgPath: 'M 26,72 C 40,60 58,46 76,32',
  },
  {
    id: 'stroke_gou',
    nameZh: '钩',
    pinyin: 'Gōu',
    nameVi: 'Nét Móc',
    direction: 'Đi liền cuối nét sổ/ngang hất ngược tạo móc nhọn',
    directionIcon: '↵',
    description: 'Phần móc nhọn ở cuối của nét sổ (Sổ móc 竖钩) hoặc nét cong (Tà móc 斜钩).',
    writingTechnique: [
      'Viết nét sổ hoặc nét cong thẳng xuống như bình thường.',
      'Đến đuôi nét, hơi dừng tay ấn nhẹ tạo thế bàn đạp.',
      'Bẻ gập cổ tay hất ngược nhọn hoắt sang trái lên trên một góc 45 độ.',
    ],
    commonMistakes: 'Móc quá to hoặc tròn đầu như cái quai xách; quên dừng bút trước khi bật móc.',
    sampleHanzi: [
      { char: '小', pinyin: 'xiǎo', meaning: 'Nhỏ bé' },
      { char: '水', pinyin: 'shuǐ', meaning: 'Nước' },
      { char: '你', pinyin: 'nǐ', meaning: 'Bạn, anh' },
      { char: '月', pinyin: 'yuè', meaning: 'Mặt trăng' },
    ],
    svgPath: 'M 50,18 L 50,75 L 36,65',
  },
  {
    id: 'stroke_zhe',
    nameZh: '折',
    pinyin: 'Zhé',
    nameVi: 'Nét Gập',
    direction: 'Ngang gập xuống hoặc Sổ gập ngang liền một nét',
    directionIcon: '┐',
    description: 'Nét đổi hướng góc 90 độ mà KHÔNG nhấc bút ra khỏi mặt giấy (Ngang gập 横折 hoặc Sổ gập 竖折).',
    writingTechnique: [
      'Viết nét đầu tiên (ví dụ nét ngang từ trái sang phải).',
      'Đến góc ngoặt: Hơi dừng bút, xoay mũi bút tạo góc vuông sắc cạnh.',
      'Kéo thẳng xuống viết tiếp nét thứ hai mà không ngắt đoạn.',
    ],
    commonMistakes: 'Nhấc bút lên viết thành 2 nét riêng biệt; góc ngoặt bị bo tròn như đường cong lượn.',
    sampleHanzi: [
      { char: '口', pinyin: 'kǒu', meaning: 'Cái miệng' },
      { char: '日', pinyin: 'rì', meaning: 'Mặt trời, ngày' },
      { char: '四', pinyin: 'sì', meaning: 'Số bốn' },
      { char: '中', pinyin: 'zhōng', meaning: 'Ở giữa' },
    ],
    svgPath: 'M 22,34 L 74,34 L 74,78',
  },
];

export const STROKE_ORDER_RULES: StrokeOrderRule[] = [
  {
    id: 'rule_1',
    number: 1,
    ruleZh: '先横后竖',
    pinyin: 'Xiān héng hòu shù',
    ruleVi: 'Ngang trước, sổ sau',
    meaning: 'Nét nằm ngang viết trước, nét thẳng đứng viết sau cắt qua.',
    formula: '― trước, | sau',
    explanation: 'Khi hai nét ngang và sổ giao nhau, bao giờ nét ngang cũng được đặt nền tảng trước, sau đó nét sổ cắm thẳng xuống.',
    exampleChar: '十',
    examplePinyin: 'shí',
    exampleMeaning: 'Số mười (10)',
    steps: [
      {
        stepNumber: 1,
        strokeName: 'Nét Ngang (横)',
        description: 'Viết nét ngang từ trái sang phải tạo dầm ngang.',
        snapshotPath: 'M 25,50 L 75,50',
      },
      {
        stepNumber: 2,
        strokeName: 'Nét Sổ (竖)',
        description: 'Viết nét sổ thẳng từ trên xuống xuyên qua tâm nét ngang.',
        snapshotPath: 'M 25,50 L 75,50 M 50,22 L 50,82',
      },
    ],
  },
  {
    id: 'rule_2',
    number: 2,
    ruleZh: '先撇后捺',
    pinyin: 'Xiān piě hòu nà',
    ruleVi: 'Phẩy trước, mác sau',
    meaning: 'Nét nghiêng sang trái (phẩy) viết trước, nét choãi sang phải (mác) viết sau.',
    formula: '丿 trước, ＼ sau',
    explanation: 'Giúp tạo thế cân bằng vững chãi như chân kiềng cho chữ Hán.',
    exampleChar: '人',
    examplePinyin: 'rén',
    exampleMeaning: 'Con người',
    steps: [
      {
        stepNumber: 1,
        strokeName: 'Nét Phẩy (撇)',
        description: 'Vuốt nét phẩy từ đỉnh trên thoải nhẹ dần sang trái.',
        snapshotPath: 'M 52,22 C 48,46 36,68 22,82',
      },
      {
        stepNumber: 2,
        strokeName: 'Nét Mác (捺)',
        description: 'Từ điểm giao bên nét phẩy, kéo nét mác thoải sang phải vuốt nhọn.',
        snapshotPath: 'M 52,22 C 48,46 36,68 22,82 M 45,46 C 54,60 68,74 82,82',
      },
    ],
  },
  {
    id: 'rule_3',
    number: 3,
    ruleZh: '从上到下',
    pinyin: 'Cóng shàng dào xià',
    ruleVi: 'Trên trước, dưới sau',
    meaning: 'Viết các bộ phận phía trên cao trước, rồi viết dần xuống các bộ phận thấp hơn bên dưới.',
    formula: 'Tầng trên → Tầng dưới',
    explanation: 'Tương tự việc xây nhà từ mái xuống móng, chữ Hán có nhiều tầng luôn viết từ đỉnh nóc xuống đáy.',
    exampleChar: '三',
    examplePinyin: 'sān',
    exampleMeaning: 'Số ba (3)',
    steps: [
      {
        stepNumber: 1,
        strokeName: 'Nét Ngang trên (横)',
        description: 'Viết nét ngang trên cùng ngắn vừa phải.',
        snapshotPath: 'M 30,32 L 70,32',
      },
      {
        stepNumber: 2,
        strokeName: 'Nét Ngang giữa (横)',
        description: 'Viết nét ngang ở giữa ngắn nhất.',
        snapshotPath: 'M 30,32 L 70,32 M 36,50 L 64,50',
      },
      {
        stepNumber: 3,
        strokeName: 'Nét Ngang dưới (横)',
        description: 'Viết nét ngang dưới cùng dài nhất làm đế vững chắc.',
        snapshotPath: 'M 30,32 L 70,32 M 36,50 L 64,50 M 22,70 L 78,70',
      },
    ],
  },
  {
    id: 'rule_4',
    number: 4,
    ruleZh: '从左到右',
    pinyin: 'Cóng zuǒ dào yòu',
    ruleVi: 'Trái trước, phải sau',
    meaning: 'Các bộ thủ hoặc cấu trúc bên trái viết trước, sau đó viết nửa bên phải.',
    formula: 'Bên trái ⇛ Bên phải',
    explanation: 'Đại đa số chữ Hán là chữ ghép hình thanh có nửa trái biểu nghĩa và nửa phải biểu âm, luôn viết từ trái qua.',
    exampleChar: '你',
    examplePinyin: 'nǐ',
    exampleMeaning: 'Bạn, anh, chị (đại từ ngôi 2)',
    steps: [
      {
        stepNumber: 1,
        strokeName: 'Bộ Nhân Đứng (Phẩy)',
        description: 'Nét phẩy bên trái của bộ nhân đứng.',
        snapshotPath: 'M 34,26 C 30,38 24,50 18,58',
      },
      {
        stepNumber: 2,
        strokeName: 'Bộ Nhân Đứng (Sổ đứng)',
        description: 'Nét sổ thẳng đứng dưới nét phẩy hoàn thiện bộ nhân đứng.',
        snapshotPath: 'M 34,26 C 30,38 24,50 18,58 M 27,45 L 27,82',
      },
      {
        stepNumber: 3,
        strokeName: 'Nửa phải: Nét Phẩy ngắn trên',
        description: 'Bắt đầu viết phần chữ Nhĩ (尔) bên phải.',
        snapshotPath: 'M 34,26 C 30,38 24,50 18,58 M 27,45 L 27,82 M 60,24 C 56,32 50,38 44,42',
      },
      {
        stepNumber: 4,
        strokeName: 'Ngang móc & Sổ móc bên phải',
        description: 'Hoàn thành khung trên và sổ móc trung tâm bên phải.',
        snapshotPath: 'M 34,26 C 30,38 24,50 18,58 M 27,45 L 27,82 M 60,24 C 56,32 50,38 44,42 M 46,42 L 76,42 L 72,52 M 60,42 L 60,78 L 54,72',
      },
      {
        stepNumber: 5,
        strokeName: 'Hai nét chấm phẩy bên phải',
        description: 'Hai nét chấm và phẩy đối xứng hoàn thành trọn vẹn chữ 你.',
        snapshotPath: 'M 34,26 C 30,38 24,50 18,58 M 27,45 L 27,82 M 60,24 C 56,32 50,38 44,42 M 46,42 L 76,42 L 72,52 M 60,42 L 60,78 L 54,72 M 46,60 C 44,66 40,72 38,76 M 72,60 C 74,66 78,70 82,74',
      },
    ],
  },
  {
    id: 'rule_5',
    number: 5,
    ruleZh: '从外到内',
    pinyin: 'Cóng wài dào nèi',
    ruleVi: 'Ngoài trước, trong sau',
    meaning: 'Viết khung bao bọc bên ngoài trước, sau đó mới viết các nét bên trong lòng.',
    formula: 'Bao viền ➠ Lõi trong',
    explanation: 'Giống như dựng căn phòng trước rồi mới sắp xếp nội thất bên trong.',
    exampleChar: '月',
    examplePinyin: 'yuè',
    exampleMeaning: 'Mặt trăng, tháng',
    steps: [
      {
        stepNumber: 1,
        strokeName: 'Phẩy đứng bên ngoài trái',
        description: 'Nét phẩy thẳng hơi cong dựng khung trái.',
        snapshotPath: 'M 35,22 C 34,44 32,64 24,82',
      },
      {
        stepNumber: 2,
        strokeName: 'Ngang gập móc ngoài phải',
        description: 'Ngang qua rồi bẻ gập móc bao bọc khung bên ngoài.',
        snapshotPath: 'M 35,22 C 34,44 32,64 24,82 M 35,22 L 72,22 L 72,78 L 64,74',
      },
      {
        stepNumber: 3,
        strokeName: 'Ngang ngắn ruột trên',
        description: 'Nét ngang đầu tiên bên trong lòng chữ.',
        snapshotPath: 'M 35,22 C 34,44 32,64 24,82 M 35,22 L 72,22 L 72,78 L 64,74 M 35,42 L 68,42',
      },
      {
        stepNumber: 4,
        strokeName: 'Ngang ngắn ruột dưới',
        description: 'Nét ngang thứ hai bên trong hoàn tất chữ 月.',
        snapshotPath: 'M 35,22 C 34,44 32,64 24,82 M 35,22 L 72,22 L 72,78 L 64,74 M 35,42 L 68,42 M 33,58 L 68,58',
      },
    ],
  },
  {
    id: 'rule_6',
    number: 6,
    ruleZh: '先进入后关门',
    pinyin: 'Xiān jìn rù hòu guān mén',
    ruleVi: 'Vào trước, đóng cửa sau',
    meaning: 'Viết khung 3 cạnh (trái, trên, phải), cho nội dung vào giữa, rồi nét ngang cuối mới đóng nắp đáy.',
    formula: 'Mở cửa ➡ Vào nhà ➡ Khóa cổng',
    explanation: 'Quy tắc kinh điển cho các chữ có bộ vi khép kín như 日, 四, 回, 国. Tuyệt đối không đóng đáy trước!',
    exampleChar: '日',
    examplePinyin: 'rì',
    exampleMeaning: 'Mặt trời, ban ngày, ngày',
    steps: [
      {
        stepNumber: 1,
        strokeName: 'Sổ đứng trái (Dựng cột cổng)',
        description: 'Nét sổ đứng bên trái mở lối vào.',
        snapshotPath: 'M 32,24 L 32,76',
      },
      {
        stepNumber: 2,
        strokeName: 'Ngang gập (Dựng mái và vách phải)',
        description: 'Ngang qua sang phải rồi bẻ gập vuông góc xuống.',
        snapshotPath: 'M 32,24 L 32,76 M 32,24 L 68,24 L 68,76',
      },
      {
        stepNumber: 3,
        strokeName: 'Ngang giữa (Nội dung vào nhà)',
        description: 'Viết nét ngang ở giữa lòng căn phòng.',
        snapshotPath: 'M 32,24 L 32,76 M 32,24 L 68,24 L 68,76 M 32,50 L 68,50',
      },
      {
        stepNumber: 4,
        strokeName: 'Ngang đáy (Đóng cửa cài then)',
        description: 'Nét ngang dưới cùng nối kín hai chân tường hoàn thành chữ 日.',
        snapshotPath: 'M 32,24 L 32,76 M 32,24 L 68,24 L 68,76 M 32,50 L 68,50 M 32,76 L 68,76',
      },
    ],
  },
  {
    id: 'rule_7',
    number: 7,
    ruleZh: '先中间后两边',
    pinyin: 'Xiān zhōng jiān hòu liǎng biān',
    ruleVi: 'Giữa trước, hai bên sau',
    meaning: 'Với các chữ có trục đối xứng cân bằng, viết nét trục ở giữa trước, sau đó viết cánh trái rồi cánh phải.',
    formula: 'Trục tâm ⟵ Trái ⟶ Phải',
    explanation: 'Định hình tâm chữ vững chãi, rồi mới vẽ hai bên đối xứng xòe đều như đôi cánh.',
    exampleChar: '小',
    examplePinyin: 'xiǎo',
    exampleMeaning: 'Nhỏ bé, tiểu',
    steps: [
      {
        stepNumber: 1,
        strokeName: 'Sổ móc trung tâm (竖钩)',
        description: 'Kéo nét sổ móc thẳng đứng ngay giữa tâm chữ làm sống lưng.',
        snapshotPath: 'M 50,22 L 50,78 L 42,70',
      },
      {
        stepNumber: 2,
        strokeName: 'Chấm phẩy bên trái (撇点)',
        description: 'Viết nét chấm phẩy nghiêng xòe về bên trái.',
        snapshotPath: 'M 50,22 L 50,78 L 42,70 M 32,48 C 28,56 24,64 20,70',
      },
      {
        stepNumber: 3,
        strokeName: 'Nét chấm bên phải (点)',
        description: 'Viết nét chấm đối xứng bên phải hoàn thành chữ 小.',
        snapshotPath: 'M 50,22 L 50,78 L 42,70 M 32,48 C 28,56 24,64 20,70 M 68,48 C 72,56 76,64 80,70',
      },
    ],
  },
];

export const HANZI_PRACTICE_CHARACTERS: HanziCharacterItem[] = [
  {
    id: 'char_yi',
    char: '一',
    pinyin: 'yī',
    hanViet: 'Nhất',
    meaning: 'Số một (1)',
    radical: '一 (nhất)',
    strokeCount: 1,
    level: 'Cơ bản',
    mnemonicStory: 'Chỉ một nét gạch ngang đơn giản duy nhất, biểu thị ngón tay trỏ hoặc một que tính.',
    strokes: [
      {
        index: 1,
        name: 'Héng (Ngang)',
        directionDescription: 'Viết từ trái sang phải, hơi vát nhẹ lên trên ở điểm cuối',
        path: 'M 35 100 C 65 98 135 96 165 95',
      },
    ],
  },
  {
    id: 'char_er',
    char: '二',
    pinyin: 'èr',
    hanViet: 'Nhị',
    meaning: 'Số hai (2)',
    radical: '二 (nhị)',
    strokeCount: 2,
    level: 'Cơ bản',
    mnemonicStory: 'Hai nét ngang song song, nét trên ngắn tượng trưng trời, nét dưới dài tượng trưng đất.',
    strokes: [
      {
        index: 1,
        name: 'Héng ngắn (Ngang trên)',
        directionDescription: 'Từ trái sang phải ở phần trên',
        path: 'M 60 70 C 85 68 115 68 140 67',
      },
      {
        index: 2,
        name: 'Héng dài (Ngang dưới)',
        directionDescription: 'Từ trái sang phải ở đáy, dài hơn nét trên',
        path: 'M 40 135 C 75 132 125 132 160 130',
      },
    ],
  },
  {
    id: 'char_san',
    char: '三',
    pinyin: 'sān',
    hanViet: 'Tam',
    meaning: 'Số ba (3)',
    radical: '一 (nhất)',
    strokeCount: 3,
    level: 'Cơ bản',
    mnemonicStory: 'Ba nét ngang: Trời, Người, Đất. Nét giữa ngắn nhất, nét dưới dài nhất.',
    strokes: [
      {
        index: 1,
        name: 'Héng vừa (Ngang trên)',
        directionDescription: 'Nét ngang trên cùng độ dài vừa',
        path: 'M 55 60 C 80 58 120 58 145 57',
      },
      {
        index: 2,
        name: 'Héng ngắn (Ngang giữa)',
        directionDescription: 'Nét ngang giữa ngắn nhất',
        path: 'M 70 100 C 90 99 110 99 130 98',
      },
      {
        index: 3,
        name: 'Héng dài (Ngang đáy)',
        directionDescription: 'Nét ngang đáy dài vững chãi',
        path: 'M 38 140 C 75 138 130 138 165 136',
      },
    ],
  },
  {
    id: 'char_shi',
    char: '十',
    pinyin: 'shí',
    hanViet: 'Thập',
    meaning: 'Số mười (10)',
    radical: '十 (thập)',
    strokeCount: 2,
    level: 'Cơ bản',
    mnemonicStory: 'Hình tượng chữ thập trọn vẹn thập toàn thập mỹ, kết hợp ngang trước sổ sau.',
    strokes: [
      {
        index: 1,
        name: 'Héng (Ngang)',
        directionDescription: 'Ngang qua từ trái sang phải',
        path: 'M 40 100 C 75 98 125 98 160 97',
      },
      {
        index: 2,
        name: 'Shù (Sổ đứng)',
        directionDescription: 'Sổ thẳng đứng từ trên xuống qua tâm',
        path: 'M 100 40 C 100 75 100 130 100 165',
      },
    ],
  },
  {
    id: 'char_ren',
    char: '人',
    pinyin: 'rén',
    hanViet: 'Nhân',
    meaning: 'Con người, người',
    radical: '人 (nhân)',
    strokeCount: 2,
    level: 'Cơ bản',
    mnemonicStory: 'Hình tượng con người đứng với hai chân tựa vào nhau vững chãi, phẩy trước mác sau.',
    strokes: [
      {
        index: 1,
        name: 'Piě (Phẩy)',
        directionDescription: 'Từ đỉnh vuốt cong thoải dần sang trái',
        path: 'M 105 38 C 96 75 74 125 45 162',
      },
      {
        index: 2,
        name: 'Nà (Mác)',
        directionDescription: 'Từ thân nét phẩy kéo nghiêng sang phải vuốt nhọn',
        path: 'M 92 85 C 108 115 135 142 165 162',
      },
    ],
  },
  {
    id: 'char_da',
    char: '大',
    pinyin: 'dà',
    hanViet: 'Đại',
    meaning: 'To lớn, lớn',
    radical: '大 (đại)',
    strokeCount: 3,
    level: 'Cơ bản',
    mnemonicStory: 'Hình tượng con người giang rộng hai cánh tay để biểu thị to lớn.',
    strokes: [
      {
        index: 1,
        name: 'Héng (Ngang)',
        directionDescription: 'Cánh tay giang ngang từ trái qua phải',
        path: 'M 42 78 C 75 76 125 76 158 75',
      },
      {
        index: 2,
        name: 'Piě (Phẩy dài)',
        directionDescription: 'Nét phẩy vuốt từ trên đỉnh xuyên tâm sang trái',
        path: 'M 100 42 C 95 85 75 130 46 162',
      },
      {
        index: 3,
        name: 'Nà (Mác)',
        directionDescription: 'Nét mác choãi sang phải vuốt nhọn đáy',
        path: 'M 90 92 C 108 120 135 145 165 162',
      },
    ],
  },
  {
    id: 'char_tian',
    char: '天',
    pinyin: 'tiān',
    hanViet: 'Thiên',
    meaning: 'Trời, bầu trời, ngày',
    radical: '大 (đại)',
    strokeCount: 4,
    level: 'Cơ bản',
    mnemonicStory: 'Ở trên đỉnh đầu người to lớn chính là bầu trời cao rộng.',
    strokes: [
      {
        index: 1,
        name: 'Héng ngắn (Ngang trên)',
        directionDescription: 'Ngang ngắn phía trên đỉnh đầu biểu thị vòm trời',
        path: 'M 60 55 C 85 53 115 53 140 52',
      },
      {
        index: 2,
        name: 'Héng dài (Ngang giữa)',
        directionDescription: 'Ngang dài giữa hai cánh tay',
        path: 'M 38 88 C 75 86 125 86 162 85',
      },
      {
        index: 3,
        name: 'Piě (Phẩy)',
        directionDescription: 'Nét phẩy vuốt cong sang trái',
        path: 'M 100 55 C 95 95 72 135 45 162',
      },
      {
        index: 4,
        name: 'Nà (Mác)',
        directionDescription: 'Nét mác choãi sang phải',
        path: 'M 95 98 C 112 122 135 145 165 162',
      },
    ],
  },
  {
    id: 'char_kou',
    char: '口',
    pinyin: 'kǒu',
    hanViet: 'Khẩu',
    meaning: 'Cái miệng, cổng, khẩu vị',
    radical: '口 (khẩu)',
    strokeCount: 3,
    level: 'Cơ bản',
    mnemonicStory: 'Hình vẽ chiếc miệng mở vuông vắn. Quy tắc: Sổ trái ➡ Ngang gập ➡ Ngang đóng đáy.',
    strokes: [
      {
        index: 1,
        name: 'Shù (Sổ trái)',
        directionDescription: 'Sổ đứng ngắn bên trái',
        path: 'M 56 60 L 56 142',
      },
      {
        index: 2,
        name: 'Héngzhé (Ngang gập)',
        directionDescription: 'Ngang sang phải rồi gập thẳng xuống',
        path: 'M 56 60 L 144 60 L 144 142',
      },
      {
        index: 3,
        name: 'Héng (Ngang đáy)',
        directionDescription: 'Ngang đóng đáy khép kín chiếc miệng',
        path: 'M 54 142 L 146 142',
      },
    ],
  },
  {
    id: 'char_ri',
    char: '日',
    pinyin: 'rì',
    hanViet: 'Nhật',
    meaning: 'Mặt trời, ban ngày, ngày',
    radical: '日 (nhật)',
    strokeCount: 4,
    level: 'Cơ bản',
    mnemonicStory: 'Hình tròn mặt trời xưa kia được viết vuông vắn, có chấm/vạch ở giữa. Quy tắc: Vào trước đóng sau.',
    strokes: [
      {
        index: 1,
        name: 'Shù (Sổ trái)',
        directionDescription: 'Sổ đứng cạnh trái',
        path: 'M 60 50 L 60 152',
      },
      {
        index: 2,
        name: 'Héngzhé (Ngang gập)',
        directionDescription: 'Ngang trên rồi bẻ góc gập vuông xuống',
        path: 'M 60 50 L 140 50 L 140 152',
      },
      {
        index: 3,
        name: 'Héng (Ngang ruột)',
        directionDescription: 'Nét ngang trong lòng nối hai vách',
        path: 'M 60 98 L 140 98',
      },
      {
        index: 4,
        name: 'Héng (Ngang đáy)',
        directionDescription: 'Nét ngang dưới cùng đóng then cửa',
        path: 'M 58 152 L 142 152',
      },
    ],
  },
  {
    id: 'char_yue',
    char: '月',
    pinyin: 'yuè',
    hanViet: 'Nguyệt',
    meaning: 'Mặt trăng, tháng',
    radical: '月 (nguyệt)',
    strokeCount: 4,
    level: 'Cơ bản',
    mnemonicStory: 'Hình mảnh trăng khuyết chiếu sáng trên bầu trời đêm.',
    strokes: [
      {
        index: 1,
        name: 'Piě shù (Phẩy đứng)',
        directionDescription: 'Nét phẩy đứng vuốt nhẹ sang trái',
        path: 'M 65 45 C 64 85 58 128 42 162',
      },
      {
        index: 2,
        name: 'Héngzhégōu (Ngang gập móc)',
        directionDescription: 'Ngang qua rồi bẻ gập thẳng xuống hất móc nhọn',
        path: 'M 65 45 L 142 45 L 142 155 L 126 145',
      },
      {
        index: 3,
        name: 'Héng ngắn trên',
        directionDescription: 'Ngang ngắn ruột trên',
        path: 'M 65 85 L 138 85',
      },
      {
        index: 4,
        name: 'Héng ngắn dưới',
        directionDescription: 'Ngang ngắn ruột dưới',
        path: 'M 62 118 L 138 118',
      },
    ],
  },
  {
    id: 'char_mu',
    char: '木',
    pinyin: 'mù',
    hanViet: 'Mộc',
    meaning: 'Cây gỗ, cây cối',
    radical: '木 (mộc)',
    strokeCount: 4,
    level: 'Cơ bản',
    mnemonicStory: 'Hình thân cây thẳng đứng, cành xòe sang ngang và rễ tỏa hai bên.',
    strokes: [
      {
        index: 1,
        name: 'Héng (Ngang)',
        directionDescription: 'Nét ngang biểu thị cành lá',
        path: 'M 40 82 C 75 80 125 80 160 79',
      },
      {
        index: 2,
        name: 'Shù (Sổ đứng)',
        directionDescription: 'Thân cây thẳng đứng xuyên tâm',
        path: 'M 100 38 L 100 165',
      },
      {
        index: 3,
        name: 'Piě (Phẩy)',
        directionDescription: 'Rễ cành bên trái vuốt nghiêng',
        path: 'M 98 84 C 82 110 60 138 42 152',
      },
      {
        index: 4,
        name: 'Nà (Mác)',
        directionDescription: 'Rễ cành bên phải choãi xuống',
        path: 'M 102 84 C 118 110 140 138 162 152',
      },
    ],
  },
  {
    id: 'char_zhong',
    char: '中',
    pinyin: 'zhōng',
    hanViet: 'Trung',
    meaning: 'Ở giữa, trung tâm, Trung Quốc',
    radical: '丨 (sổ)',
    strokeCount: 4,
    level: 'Cơ bản',
    mnemonicStory: 'Chiếc cờ cắm ngay chính giữa mục tiêu hồng tâm.',
    strokes: [
      {
        index: 1,
        name: 'Shù trái (Sổ)',
        directionDescription: 'Vách sổ bên trái khung chữ khẩu',
        path: 'M 54 65 L 54 118',
      },
      {
        index: 2,
        name: 'Héngzhé (Ngang gập)',
        directionDescription: 'Ngang trên rồi gập vách phải',
        path: 'M 54 65 L 146 65 L 146 118',
      },
      {
        index: 3,
        name: 'Héng (Ngang đóng)',
        directionDescription: 'Ngang khép kín khung vuông',
        path: 'M 54 118 L 146 118',
      },
      {
        index: 4,
        name: 'Shù xuyên tâm (Sổ dài)',
        directionDescription: 'Sổ đứng dài cắm xuyên ngay chính giữa',
        path: 'M 100 35 L 100 168',
      },
    ],
  },
  {
    id: 'char_xiao',
    char: '小',
    pinyin: 'xiǎo',
    hanViet: 'Tiểu',
    meaning: 'Nhỏ bé, nhỏ',
    radical: '小 (tiểu)',
    strokeCount: 3,
    level: 'Cơ bản',
    mnemonicStory: 'Quy tắc: Giữa trước hai bên sau. Một vật bị chia đôi thành các mảnh nhỏ.',
    strokes: [
      {
        index: 1,
        name: 'Shùgōu (Sổ móc giữa)',
        directionDescription: 'Sổ thẳng ở trục tâm rồi hất móc nhọn sang trái',
        path: 'M 100 40 L 100 155 L 85 140',
      },
      {
        index: 2,
        name: 'Piě (Phẩy trái)',
        directionDescription: 'Nét chấm phẩy bên trái',
        path: 'M 64 92 C 55 108 45 124 38 136',
      },
      {
        index: 3,
        name: 'Diǎn (Chấm phải)',
        directionDescription: 'Nét chấm bên phải đối xứng',
        path: 'M 136 92 C 145 108 155 124 162 136',
      },
    ],
  },
  {
    id: 'char_shui',
    char: '水',
    pinyin: 'shuǐ',
    hanViet: 'Thủy',
    meaning: 'Nước, sông nước',
    radical: '水 (thủy)',
    strokeCount: 4,
    level: 'Cơ bản',
    mnemonicStory: 'Dòng nước chảy ở giữa, sóng nước tung bọt hai bên. Giữa trước hai bên sau.',
    strokes: [
      {
        index: 1,
        name: 'Shùgōu (Sổ móc)',
        directionDescription: 'Dòng nước chính giữa sổ móc dứt khoát',
        path: 'M 100 38 L 100 162 L 84 146',
      },
      {
        index: 2,
        name: 'Héngpiě (Ngang phẩy)',
        directionDescription: 'Ngang ngắn rồi phẩy cong bên trái',
        path: 'M 54 85 L 80 85 C 68 105 52 120 40 130',
      },
      {
        index: 3,
        name: 'Piě ngắn (Phẩy)',
        directionDescription: 'Phẩy ngắn bên phải phía trên',
        path: 'M 148 65 C 135 80 120 95 110 102',
      },
      {
        index: 4,
        name: 'Nà (Mác)',
        directionDescription: 'Nét mác choãi sang góc dưới phải',
        path: 'M 112 102 C 128 122 148 145 168 156',
      },
    ],
  },
  {
    id: 'char_shan',
    char: '山',
    pinyin: 'shān',
    hanViet: 'Sơn',
    meaning: 'Ngọn núi, non',
    radical: '山 (sơn)',
    strokeCount: 3,
    level: 'Cơ bản',
    mnemonicStory: 'Hình ba ngọn núi nhấp nhô, đỉnh giữa cao nhất viết trước.',
    strokes: [
      {
        index: 1,
        name: 'Shù giữa (Sổ cao)',
        directionDescription: 'Đỉnh núi cao nhất ngay trung tâm',
        path: 'M 100 45 L 100 152',
      },
      {
        index: 2,
        name: 'Shùzhé (Sổ gập)',
        directionDescription: 'Ngọn núi bên trái sổ xuống rồi gập ngang qua đáy',
        path: 'M 54 82 L 54 152 L 146 152',
      },
      {
        index: 3,
        name: 'Shù phải (Sổ ngắn)',
        directionDescription: 'Ngọn núi bên phải sổ đứng dứt khoát',
        path: 'M 146 82 L 146 152',
      },
    ],
  },
  {
    id: 'char_ni',
    char: '你',
    pinyin: 'nǐ',
    hanViet: 'Nhĩ',
    meaning: 'Bạn, anh, cậu (ngôi thứ 2)',
    radical: '亻 (nhân đứng)',
    strokeCount: 7,
    level: 'HSK 1',
    mnemonicStory: 'Có bộ Nhân Đứng (người) ở bên trái và chữ Nhĩ ở bên phải.',
    strokes: [
      { index: 1, name: 'Piě (Phẩy trái)', directionDescription: 'Phẩy của bộ nhân đứng', path: 'M 65 52 C 58 75 46 100 34 116' },
      { index: 2, name: 'Shù (Sổ đứng)', directionDescription: 'Sổ đứng của bộ nhân đứng', path: 'M 52 90 L 52 165' },
      { index: 3, name: 'Piě ngắn trên', directionDescription: 'Phẩy ngắn bên phải đỉnh', path: 'M 120 48 C 112 64 100 76 88 84' },
      { index: 4, name: 'Hénggōu (Ngang móc)', directionDescription: 'Ngang sang phải rồi móc gập', path: 'M 92 84 L 152 84 L 144 104' },
      { index: 5, name: 'Shùgōu (Sổ móc)', directionDescription: 'Sổ móc chính giữa bên phải', path: 'M 120 84 L 120 156 L 108 144' },
      { index: 6, name: 'Piě (Phẩy chân trái)', directionDescription: 'Phẩy chân trái bên phải', path: 'M 92 120 C 88 132 80 144 76 152' },
      { index: 7, name: 'Diǎn (Chấm chân phải)', directionDescription: 'Chấm chân phải bên phải', path: 'M 144 120 C 148 132 156 140 164 148' },
    ],
  },
  {
    id: 'char_hao',
    char: '好',
    pinyin: 'hǎo',
    hanViet: 'Hảo',
    meaning: 'Tốt đẹp, hay, khỏe',
    radical: '女 (nữ)',
    strokeCount: 6,
    level: 'HSK 1',
    mnemonicStory: 'Bên trái là người Phụ nữ (女), bên phải là đứa Con (子). Có phụ nữ và con cái gia đình mới tốt đẹp tròn vẹn.',
    strokes: [
      { index: 1, name: 'Kuípiě (Phẩy gập)', directionDescription: 'Phẩy rồi bẻ chếch của bộ nữ', path: 'M 72 50 C 65 70 54 90 44 110 L 84 110' },
      { index: 2, name: 'Piě (Phẩy nghiêng)', directionDescription: 'Phẩy dài xiên qua bộ nữ', path: 'M 78 72 C 68 100 52 135 34 160' },
      { index: 3, name: 'Tí (Hất ngang)', directionDescription: 'Hất ngang chếch lên kết thúc bộ nữ', path: 'M 32 108 L 86 100' },
      { index: 4, name: 'Héngpiě (Ngang phẩy)', directionDescription: 'Đầu chữ tử bên phải', path: 'M 106 68 L 148 68 C 136 88 122 106 112 116' },
      { index: 5, name: 'Wāngōu (Cong móc)', directionDescription: 'Cong uốn lượn rồi móc nhọn', path: 'M 126 95 C 135 110 135 140 128 158 L 115 148' },
      { index: 6, name: 'Héng (Ngang dài)', directionDescription: 'Ngang dài giữa chữ tử', path: 'M 95 116 L 165 116' },
    ],
  },
  {
    id: 'char_wo',
    char: '我',
    pinyin: 'wǒ',
    hanViet: 'Ngã',
    meaning: 'Tôi, bản thân mình',
    radical: '戈 (qua)',
    strokeCount: 7,
    level: 'HSK 1',
    mnemonicStory: 'Thời xưa là binh khí cán dài mà người lính cầm trên tay để bảo vệ bản thân (Tôi).',
    strokes: [
      { index: 1, name: 'Piě ngắn (Phẩy)', directionDescription: 'Phẩy ngắn trên góc trái', path: 'M 78 52 C 68 64 54 74 44 80' },
      { index: 2, name: 'Héng (Ngang)', directionDescription: 'Ngang ngắn giữa', path: 'M 38 88 L 96 84' },
      { index: 3, name: 'Shùgōu (Sổ móc)', directionDescription: 'Sổ móc cạnh trái', path: 'M 68 84 L 68 158 L 56 146' },
      { index: 4, name: 'Tí (Hất)', directionDescription: 'Hất từ góc dưới trái lên', path: 'M 40 148 L 85 132' },
      { index: 5, name: 'Xiégōu (Tà móc dài)', directionDescription: 'Nét móc nghiêng dài vút qua tâm', path: 'M 106 42 C 118 78 138 126 160 156 L 162 140' },
      { index: 6, name: 'Piě (Phẩy)', directionDescription: 'Phẩy ngắn bên phải', path: 'M 152 92 C 142 108 128 124 116 132' },
      { index: 7, name: 'Diǎn (Chấm)', directionDescription: 'Nét chấm trên đỉnh hoàn thành chữ', path: 'M 142 50 C 146 58 152 66 158 72' },
    ],
  },
  {
    id: 'char_han',
    char: '汉',
    pinyin: 'hàn',
    hanViet: 'Hán',
    meaning: 'Hán tộc, Hán ngữ (tiếng Trung)',
    radical: '氵 (ba chấm thủy)',
    strokeCount: 5,
    level: 'HSK 1',
    mnemonicStory: 'Bên trái là ba chấm thủy (nước), bắt nguồn từ dòng sông Hán Thủy.',
    strokes: [
      { index: 1, name: 'Diǎn (Chấm 1)', directionDescription: 'Chấm trên của bộ ba chấm thủy', path: 'M 54 58 C 58 66 64 74 68 80' },
      { index: 2, name: 'Diǎn (Chấm 2)', directionDescription: 'Chấm giữa của bộ thủy', path: 'M 46 92 C 50 100 56 108 60 114' },
      { index: 3, name: 'Tí (Hất 3)', directionDescription: 'Hất nhọn từ dưới lên trên sang phải', path: 'M 38 148 L 68 128' },
      { index: 4, name: 'Héngpiě (Ngang phẩy)', directionDescription: 'Đầu chữ Hựu bên phải', path: 'M 88 80 L 145 80 C 132 102 110 126 84 144' },
      { index: 5, name: 'Nà (Mác)', directionDescription: 'Nét mác choãi xuyên qua nét phẩy', path: 'M 102 96 C 118 116 142 138 168 154' },
    ],
  },
  {
    id: 'char_zi',
    char: '字',
    pinyin: 'zì',
    hanViet: 'Tự',
    meaning: 'Chữ viết, văn tự',
    radical: '宀 (miên - mái nhà)',
    strokeCount: 6,
    level: 'HSK 1',
    mnemonicStory: 'Dưới mái nhà (宀) có đứa con (子) chăm chỉ học từng con chữ.',
    strokes: [
      { index: 1, name: 'Diǎn (Chấm nóc)', directionDescription: 'Chấm đỉnh mái nhà', path: 'M 100 42 C 100 50 100 58 100 64' },
      { index: 2, name: 'Diǎn trái (Chấm)', directionDescription: 'Cột trái mái nhà', path: 'M 52 68 C 50 78 48 88 46 96' },
      { index: 3, name: 'Hénggōu (Ngang móc)', directionDescription: 'Ngang mái nhà rồi móc nhọn', path: 'M 50 72 L 152 72 L 140 92' },
      { index: 4, name: 'Héngpiě (Ngang phẩy)', directionDescription: 'Đầu chữ tử bên dưới', path: 'M 80 102 L 126 102 C 114 118 102 132 94 140' },
      { index: 5, name: 'Wāngōu (Cong móc)', directionDescription: 'Cong móc trục giữa', path: 'M 110 120 C 118 132 118 150 112 165 L 102 155' },
      { index: 6, name: 'Héng (Ngang dài đáy)', directionDescription: 'Ngang qua nối chữ tử', path: 'M 60 135 L 148 135' },
    ],
  },
];
