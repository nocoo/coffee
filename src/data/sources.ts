import { b, type Localized, type SourceId } from './types';

export const sources: Record<SourceId, { name: string; url: string; scope: Localized }> = {
  'wcr-lexicon': {
    name: 'World Coffee Research',
    url: 'https://worldcoffeeresearch.org/resources/sensory-lexicon',
    scope: b(
      '感官词汇与参照方法；本站分类、定义与厨房练习为原创，不复刻原版词典或风味轮。',
      'Sensory vocabulary and reference methodology. Our hierarchy, definitions and kitchen exercises are original, not a reproduction of the lexicon or wheel.',
    ),
  },
  'wcr-varieties': {
    name: 'WCR Varieties Catalog',
    url: 'https://varieties.worldcoffeeresearch.org/',
    scope: b(
      '物种、品种血缘与农艺特征；不将品种名当成风味保证。',
      'Species, cultivar ancestry and agronomic characteristics; variety names are not flavor guarantees.',
    ),
  },
  'sca-cva': {
    name: 'SCA Coffee Value Assessment',
    url: 'https://sca.coffee/value-assessment',
    scope: b(
      '描述性与情感评价的区分及感官维度；本站手记不是官方评分表。',
      'Descriptive versus affective assessment and sensory dimensions; our journal is not an official scoring form.',
    ),
  },
  'sca-standards': {
    name: 'SCA Standards · 102-2024',
    url: 'https://sca.coffee/research/coffee-standards',
    scope: b(
      '杯测样本准备与操作。非杯测配方是本站起点，不标称为官方认证参数。',
      'Cupping preparation and mechanics. Our non-cupping recipes are starting points, not official certification parameters.',
    ),
  },
  cqi: {
    name: 'Coffee Quality Institute',
    url: 'https://www.coffeeinstitute.org/education/processing',
    scope: b(
      '采后处理、流程控制与处理教育框架。',
      'Post-harvest processing, process control and processing education.',
    ),
  },
  ico: {
    name: 'International Coffee Organization',
    url: 'https://ico.org/coffee-development-report/',
    scope: b(
      '生产国与咖啡产业背景；不支持本站的感官匹配数值。',
      'Producing-country and sector context; does not substantiate our editorial sensory matching numbers.',
    ),
  },
  ucdavis: {
    name: 'Batali, Ristenpart & Guinard · 2020',
    url: 'https://www.nature.com/articles/s41598-020-73341-4',
    scope: b(
      '固定浓度与萃取率下的滴滤温度研究，87／90／93°C；其他配方属于编辑练习。论文 CC BY 4.0。',
      'Drip-brew temperature study at fixed strength and extraction, 87/90/93°C. Other recipes are editorial exercises. Paper: CC BY 4.0.',
    ),
  },
  icafe: {
    name: 'ICAFE · Costa Rica',
    url: 'https://www.icafe.cr/nuestro-cafe/regiones-cafetaleras/',
    scope: b('哥斯达黎加产区与环境差异。', 'Costa Rican regions and environmental variation.'),
  },
  anacafe: {
    name: 'Anacafé · Guatemalan Coffees',
    url: 'https://www.guatemalancoffees.com/main/regions-and-profiles/',
    scope: b(
      '危地马拉区域画像及单一批次可能不同的明确提示。',
      'Guatemalan regional profiles and the explicit caveat that individual coffees vary.',
    ),
  },
  fnc: {
    name: 'Federación Nacional de Cafeteros',
    url: 'https://federaciondecafeteros.org/',
    scope: b(
      '哥伦比亚咖啡产业背景；批次描述同时参考进口商产区资料。',
      'Colombian coffee-sector context; lot-oriented descriptions also draw on importer origin guides.',
    ),
  },
  hario: {
    name: 'HARIO · Recipes & Guides',
    url: 'https://www.hario-usa.com/pages/recipes-and-guides',
    scope: b(
      '器具、滤纸与基础操作；本站 V60、虹吸练习参数为自选起点。',
      'Equipment, filters and basic handling; our V60 and siphon practice parameters are editorial starting points.',
    ),
  },
  chemex: {
    name: 'CHEMEX · Brewing Guide',
    url: 'https://chemexcoffeemaker.com/pages/how-to-brew-with-chemex',
    scope: b('滤纸方向、排气和器具结构。', 'Filter orientation, venting and brewer construction.'),
  },
  aeropress: {
    name: 'AeroPress · How to Use',
    url: 'https://aeropress.com/pages/how-to-use',
    scope: b(
      '直立冲煮、压滤安全与原厂约 85°C 配方；本站全杯配方另列。',
      'Upright brewing, pressing safety and the manufacturer’s approximately 85°C recipe; our full-cup recipe is listed separately.',
    ),
  },
  bialetti: {
    name: 'Bialetti · Moka Express',
    url: 'https://www.bialetti.com/it_en/moka-express.html',
    scope: b(
      '安全阀水位、粉篮不压粉、小火操作和及时离火。',
      'Safety-valve fill level, no tamping, low heat and timely heat removal.',
    ),
  },
  'sca-water': {
    name: 'SCA 102-2024 · Table 2',
    url: 'https://sca.coffee/s/AW_SCA-102_Sample-Preparation_281024_Secured.pdf',
    scope: b(
      '杯测用水：钙硬度 50–175 ppm、碱度约 40–70 ppm，均以 CaCO₃ 计；pH 6–8、无氯。非所有器具的保修用水规范。',
      'Cupping water: calcium hardness 50–175 ppm and alkalinity near 40–70 ppm as CaCO₃, pH 6–8, no chlorine. Not a universal equipment-warranty specification.',
    ),
  },
  cafeimports: {
    name: 'Cafe Imports · Origin Guides',
    url: 'https://www.cafeimports.com/north-america/origins',
    scope: b(
      '专业进口商的区域、常见品种和处理背景。本站海拔为示例种植带，风味和匹配参数是探索线索，不是产国定律。',
      'Professional importer context on regions, common cultivars and processing. Our elevations are illustrative growing bands; flavor and matching hints are not national rules.',
    ),
  },
  'india-board': {
    name: 'Coffee Board of India',
    url: 'https://coffeeboard.gov.in/coffee-statistics.html',
    scope: b(
      '官方生产统计中的种植邦与阿拉比卡／罗布斯塔分布；不用于推断风味。',
      'Official production tables for growing states and Arabica/Robusta distribution; not evidence of sensory outcomes.',
    ),
  },
  'uganda-profiles': {
    name: 'Uganda Coffee · Origin Profiles',
    url: 'https://ugandacoffee.go.ug/sites/default/files/Uganda_Coffee_Profiles.pdf',
    scope: b(
      '官方区域资料：埃尔贡山、鲁文佐里等高地与物种分布。只转述背景，不复制原文风味图表。',
      'Official regional context for Mount Elgon, Rwenzori and species distribution. Background paraphrases only; no profile charts reproduced.',
    ),
  },
  'ico-china': {
    name: 'ICO · Coffee in China · 2015',
    url: 'https://www.ico.org/documents/cy2014-15/icc-115-7e-study-china.pdf',
    scope: b(
      '2015 年历史行业研究：云南、阿拉比卡与卡蒂姆背景；不把旧统计当作当前数据。风味与海拔是本站探索线索。',
      'Historical 2015 sector study: Yunnan, Arabica and Catimor context. Old statistics are not presented as current data; flavor and elevation hints are editorial.',
    ),
  },
  vicofa: {
    name: 'Vietnam Coffee–Cocoa Association',
    url: 'https://vicofa.org.vn/',
    scope: b(
      '越南咖啡可可协会的罗布斯塔产业与加工背景。本站风味和配方并非协会评价。',
      'Vietnam Coffee–Cocoa Association context on Robusta production and processing. Our flavor and recipe suggestions are not association assessments.',
    ),
  },
};

export const accessed = '2026-09-11';
