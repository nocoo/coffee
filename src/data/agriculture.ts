import { b, type Process, type Roast, type Variety } from './types';

export const varieties: Variety[] = [
  {
    id: 'yemeni-landrace',
    name: b('也门地方材料', 'Yemeni landraces'),
    species: 'arabica',
    description: b(
      '也门拥有多个地方阿拉比卡遗传群体，地方名称与遗传分类并不总是一一对应。优先保留可追溯的生产者命名，避免全部简化成铁皮卡。',
      'Yemen has multiple local Arabica genetic groups, and local names do not always map directly to genetic classifications. Preserve traceable producer naming rather than reducing all material to Typica.',
    ),
    sources: ['wcr-varieties', 'cafeimports'],
  },
  {
    id: 'typica',
    name: b('铁皮卡', 'Typica'),
    species: 'arabica',
    description: b(
      '历史悠久的阿拉比卡品种群，植株高、产量通常较低且易感叶锈病。杯中表现依赖环境与栽培，不能只凭品种名推断。',
      'A historic Arabica group, generally tall, relatively low-yielding and susceptible to leaf rust. Cup expression depends on growing conditions and farming, not the name alone.',
    ),
    sources: ['wcr-varieties'],
  },
  {
    id: 'bourbon',
    name: b('波旁', 'Bourbon'),
    species: 'arabica',
    description: b(
      '重要的阿拉比卡遗传群体，是许多栽培品种的亲本。红、黄等果色不是甜度保证，抗病和产量特征需看具体材料。',
      'An important Arabica genetic group and parent of many cultivars. Red or yellow cherry color does not guarantee sweetness; resistance and yield depend on the material.',
    ),
    sources: ['wcr-varieties'],
  },
  {
    id: 'caturra',
    name: b('卡杜拉', 'Caturra'),
    species: 'arabica',
    description: b(
      '波旁的自然矮生突变，紧凑株形便于密植。广泛出现在拉丁美洲，通常对叶锈病敏感。',
      'A natural dwarf mutation of Bourbon with a compact form suited to denser planting. Widely found in Latin America and generally susceptible to leaf rust.',
    ),
    sources: ['wcr-varieties'],
  },
  {
    id: 'catuai',
    name: b('卡杜艾', 'Catuai'),
    species: 'arabica',
    description: b(
      '由新世界与卡杜拉杂交育成，矮株、产量潜力较高。红果与黄果均有栽培，风味不能由果色决定。',
      'Bred from Mundo Novo and Caturra, with a compact form and productive potential. Red and yellow forms are cultivated; fruit color does not determine flavor.',
    ),
    sources: ['wcr-varieties'],
  },
  {
    id: 'mundo-novo',
    name: b('新世界', 'Mundo Novo'),
    species: 'arabica',
    description: b(
      '铁皮卡与波旁血缘的自然杂交群体，植株高，在巴西较常见。农艺适应性与杯质应分别看待。',
      'A natural hybrid group with Typica and Bourbon ancestry, tall and common in Brazil. Agronomic adaptation and cup quality should be assessed separately.',
    ),
    sources: ['wcr-varieties'],
  },
  {
    id: 'gesha',
    name: b('瑰夏', 'Gesha'),
    species: 'arabica',
    description: b(
      '名称涵盖不同遗传材料，巴拿马知名 T2722 材料可有突出花香。并非所有叫 Gesha 的咖啡都相同，也不保证高品质。',
      'The name covers distinct genetic material. The celebrated Panama T2722 material can show notable florality. Coffees labeled Gesha are not all identical or guaranteed high quality.',
    ),
    sources: ['wcr-varieties'],
  },
  {
    id: 'sl28',
    name: b('SL28', 'SL28'),
    species: 'arabica',
    description: b(
      '在肯尼亚选育的高株材料，以抗旱适应性和潜在杯质闻名，但易感主要病害。',
      'A tall selection developed in Kenya, known for drought adaptation and cup potential but susceptible to major diseases.',
    ),
    sources: ['wcr-varieties'],
  },
  {
    id: 'sl34',
    name: b('SL34', 'SL34'),
    species: 'arabica',
    description: b(
      '在肯尼亚选育，常与高海拔地区联系；与 SL28 是不同材料，对病害的敏感性需考虑。',
      'Selected in Kenya and often associated with high-elevation areas. It is distinct from SL28, with disease susceptibility to consider.',
    ),
    sources: ['wcr-varieties'],
  },
  {
    id: 'batian',
    name: b('巴蒂安', 'Batian'),
    species: 'arabica',
    description: b(
      '肯尼亚育成的复合亲本品种，选育目标包括病害抗性、产量与杯质；不是单纯的 SL28 同义词。',
      'A Kenyan variety with complex parentage, bred for disease resistance, productivity and cup quality; not another name for SL28.',
    ),
    sources: ['wcr-varieties'],
  },
  {
    id: 'pacamara',
    name: b('帕卡马拉', 'Pacamara'),
    species: 'arabica',
    description: b(
      '由 Pacas 与 Maragogipe 杂交而来，大颗粒是常见农艺特征。豆大并不意味着味道必然更好。',
      'A cross of Pacas and Maragogipe, often characterized by large beans. Larger size does not automatically mean better flavor.',
    ),
    sources: ['wcr-varieties'],
  },
  {
    id: 'catimor',
    name: b('卡蒂姆群体', 'Catimor group'),
    species: 'arabica',
    description: b(
      '包含卡杜拉与 Timor 杂交种后代的多个材料。它是群体称谓，不是单一统一风味的品种。',
      'A group of materials descended from Caturra and Timor Hybrid. It is a group name, not a single cultivar with one uniform flavor.',
    ),
    sources: ['wcr-varieties'],
  },
  {
    id: 'castillo',
    name: b('卡斯蒂略', 'Castillo'),
    species: 'arabica',
    description: b(
      '哥伦比亚育种体系中的多系复合品种，目标包括叶锈病抗性与区域适应。抗病育种与良好杯质并不冲突。',
      'A composite variety from Colombia’s breeding program, developed for leaf-rust resistance and regional adaptation. Disease resistance and good cup quality are compatible.',
    ),
    sources: ['wcr-varieties'],
  },
  {
    id: 'ethiopian-landrace',
    name: b('埃塞俄比亚地方材料', 'Ethiopian landraces'),
    species: 'arabica',
    description: b(
      '大量地方种质与选育品种常被笼统标为 heirloom。优先寻找具体品种代码、地方名称与种植者信息。',
      'Many local landraces and selected varieties are broadly labeled “heirloom.” Prefer specific variety codes, local names and producer information when available.',
    ),
    sources: ['wcr-varieties'],
  },
  {
    id: 'robusta',
    name: b('卡内弗拉／罗布斯塔', 'Canephora / Robusta'),
    species: 'canephora',
    description: b(
      'Coffea canephora 是与阿拉比卡不同的物种，Robusta 为常用商业称谓。遗传多样性很大，不能把所有样本简化为苦和低品质。',
      'Coffea canephora is a species distinct from Arabica; Robusta is a common commercial term. It is genetically diverse and cannot all be reduced to bitterness or low quality.',
    ),
    sources: ['wcr-varieties'],
  },
];

export const processes: Process[] = [
  {
    id: 'washed',
    name: b('水洗', 'Washed'),
    description: b(
      '去果皮后，以发酵和／或机械方式去除果胶，再干燥带壳豆。水量与工序因产地、设备而异。',
      'After depulping, mucilage is removed by fermentation and/or mechanically before parchment drying. Water use and workflow vary with equipment and origin.',
    ),
    effect: b(
      '常帮助呈现清晰的香气与酸质，但“干净”仍取决于成熟度、发酵卫生、干燥和储存。',
      'Often helps present distinct aromas and acidity, while clarity still depends on ripeness, fermentation hygiene, drying and storage.',
    ),
    sources: ['cqi'],
  },
  {
    id: 'natural',
    name: b('日晒', 'Natural'),
    description: b(
      '完整咖啡樱桃进入干燥阶段，之后脱去果皮、果肉与羊皮层。控制厚度、翻动与天气风险很关键。',
      'Whole cherries enter drying before hull removal. Layer depth, turning and weather management are critical.',
    ),
    effect: b(
      '一些样本呈现熟果、果干或发酵联想，也有非常清晰的日晒咖啡；甜度和品质不能由处理法直接推断。',
      'Some samples suggest ripe fruit, dried fruit or fermentation; very clear naturals also exist. Processing alone does not determine sweetness or quality.',
    ),
    sources: ['cqi'],
  },
  {
    id: 'honey',
    name: b('蜜处理', 'Honey'),
    description: b(
      '去果皮后保留部分果胶进行干燥，没有加入蜂蜜。颜色名称随生产者定义变化，跨庄园不可直接比较。',
      'Some mucilage remains during drying after depulping; no honey is added. Color labels depend on producer definitions and are not directly comparable across farms.',
    ),
    effect: b(
      '可能呈现圆润甜香与果香，但保留果胶比例、干燥速度和气候同样重要。',
      'May present rounded sweet-associated and fruit aromas; retained mucilage, drying speed and climate all matter.',
    ),
    sources: ['cqi', 'icafe'],
  },
  {
    id: 'wet-hulled',
    name: b('湿刨', 'Wet-hulled'),
    description: b(
      '在较高含水状态下脱去羊皮层，再继续干燥。常与印尼湿润环境下的生产方式相关。',
      'Parchment is removed while the coffee retains relatively high moisture, followed by further drying. Often associated with production in humid Indonesian conditions.',
    ),
    effect: b(
      '部分样本有较厚杯感与草本、木质联想；不是“必然有土味”，干燥和储存控制仍决定清晰度。',
      'Some samples show heavier body and herbal or woody notes. Earthiness is not inevitable; drying and storage remain crucial to clarity.',
    ),
    sources: ['cqi', 'cafeimports'],
  },
  {
    id: 'anaerobic',
    name: b('低氧／厌氧发酵', 'Low-oxygen / anaerobic'),
    description: b(
      '描述发酵环境的氧条件，不是完整干燥处理法。它可以与水洗、日晒或蜜处理组合，参数须向生产者核实。',
      'Describes oxygen conditions during fermentation, not a complete drying process. It can accompany washed, natural or honey methods; verify parameters with the producer.',
    ),
    effect: b(
      '可能改变果香、酒感与酸的表现，结果由菌群、温度、时间和原料共同决定，并不保证更复杂。',
      'May alter fruit, wine-like notes and acidity. Microbes, temperature, duration and raw material determine the outcome; complexity is not guaranteed.',
    ),
    sources: ['cqi'],
  },
  {
    id: 'carbonic',
    name: b('二氧化碳浸渍', 'Carbonic maceration'),
    description: b(
      '借鉴葡萄酒术语，通常指以二氧化碳丰富环境处理整果的工艺，但咖啡行业使用方式并不完全统一。',
      'Borrowed from wine terminology, usually describing whole-cherry treatment in a CO₂-rich environment. Coffee-industry usage is not fully uniform.',
    ),
    effect: b(
      '可产生鲜明果香或发酵香，不能仅凭标签推断风味；询问整果状态、气体控制和后续干燥。',
      'Can create prominent fruit or fermentation notes. Ask about cherry state, gas control and subsequent drying instead of inferring flavor from the label.',
    ),
    sources: ['cqi'],
  },
  {
    id: 'co-ferment',
    name: b('共发酵／添加物处理', 'Co-fermented / adjunct'),
    description: b(
      '发酵或加工时使用外加水果、香料或其他材料。须透明区分外加原料、接种微生物与咖啡自身的香气联想。',
      'External fruit, spices or other materials are used during fermentation or processing. Transparently distinguish adjuncts, microbial inoculation and coffee’s own aromatic associations.',
    ),
    effect: b(
      '可能带来突出而直接的特定香气。品鉴记录应注明添加信息，不把添加香气误写成产地固有特征。',
      'May produce prominent specific aromas. Record adjunct information rather than presenting added aromas as an inherent origin characteristic.',
    ),
    sources: ['cqi', 'sca-cva'],
  },
];

export const roasts: Roast[] = [
  {
    id: 'light',
    name: b('浅烘焙', 'Light'),
    description: b(
      '通常保留较多原料与处理法特征，酸质可能更明显。颜色浅不等于发展不足。',
      'Often preserves more raw-material and processing character, with more noticeable acidity. A light color does not itself mean underdevelopment.',
    ),
    tip: b(
      '可从较高水温与中细研磨起步，同时留意均匀度。',
      'Start with hotter water and a medium-fine grind while monitoring evenness.',
    ),
  },
  {
    id: 'medium',
    name: b('中烘焙', 'Medium'),
    description: b(
      '果香与烘烤、焦糖联想可能取得适合个人喜好的组合；“平衡”不是所有人同一个答案。',
      'May combine fruit with toast and caramel associations in a personally pleasing way. Balance does not have one universal answer.',
    ),
    tip: b(
      '以方法默认配方为起点，根据品尝调整。',
      'Begin with the method’s default recipe and adjust by tasting.',
    ),
  },
  {
    id: 'medium-dark',
    name: b('中深烘焙', 'Medium-dark'),
    description: b(
      '烘焙香和苦感通常更显著，常用于浓郁或奶咖取向；仍需检查杯中清晰度。',
      'Roast notes and bitterness are often more noticeable, useful for concentrated or milk-drink preferences; still assess clarity in the cup.',
    ),
    tip: b(
      '尝试稍低水温与温和搅动，避免把浓厚和干涩混为一谈。',
      'Try slightly cooler water and gentler agitation; distinguish fullness from dryness.',
    ),
  },
  {
    id: 'dark',
    name: b('深烘焙', 'Dark'),
    description: b(
      '烟熏、深焦糖与苦感可能占主导。表面油脂不能单独说明新鲜度或质量。',
      'Smoke, deep caramel and bitterness may dominate. Surface oils alone cannot establish freshness or quality.',
    ),
    tip: b(
      '可从较低水温和稍短比例试起，优先减少令人不适的焦苦与涩。',
      'Try cooler water and a slightly shorter ratio, prioritizing a reduction in unpleasant burnt bitterness and dryness.',
    ),
  },
];
