import { b, type Knowledge, type LearningPath, type Localized } from './types';

export const knowledge: Knowledge[] = [
  {
    id: 'aroma',
    name: b('香气：鼻前与鼻后', 'Aroma: two ways to smell'),
    category: 'sensory',
    summary: b(
      '闻到的香与喝到的风味，使用了两条不同的嗅觉通路。',
      'Smelling a cup and sensing flavor while drinking involve different aroma routes.',
    ),
    body: b(
      '鼻前嗅觉来自杯口挥发的气体；鼻后嗅觉来自入口后经口腔到鼻腔的挥发物。干粉香、注水后的湿香与吞咽后的回香可能不同。柠檬、茉莉等词主要描述联想，并不表示咖啡里加入这些原料。',
      'Orthonasal aroma reaches the nose from the cup; retronasal aroma travels from the mouth to the nose during drinking. Dry fragrance, wet aroma and aroma after swallowing may differ. Words such as lemon or jasmine describe associations, not necessarily added ingredients.',
    ),
    practice: b(
      '先闻干粉，再闻湿香，最后小口品尝；为三个阶段各写两个词。',
      'Smell dry grounds, then wet aroma, then sip. Write two descriptors for each stage.',
    ),
    sources: ['wcr-lexicon', 'sca-cva'],
  },
  {
    id: 'taste',
    name: b('滋味与风味', 'Taste and flavor'),
    category: 'sensory',
    summary: b(
      '滋味是基本味觉，风味是味觉、嗅觉与口腔感觉的共同体验。',
      'Taste concerns basic tastes; flavor integrates taste, smell and oral sensations.',
    ),
    body: b(
      '甜、酸、苦、咸和鲜是基本味觉。草莓不是基本味道，而是含有香气记忆的复合联想。舌头各区域都能感知多种味觉，“舌尖只尝甜”的舌区图并不准确。',
      'Sweet, sour, bitter, salty and umami are basic tastes. Strawberry is a composite association involving aroma memory. Regions of the tongue perceive multiple tastes; the old “sweet only at the tip” tongue map is inaccurate.',
    ),
    practice: b(
      '小口品尝咖啡时短暂捏鼻，再松开，感受香气对整体风味的贡献。',
      'Briefly pinch your nose during a small sip, then release it to notice aroma’s contribution.',
    ),
    sources: ['wcr-lexicon', 'sca-cva'],
  },
  {
    id: 'acidity',
    name: b('酸质：强度与形态', 'Acidity: intensity and character'),
    category: 'sensory',
    summary: b(
      '把酸的强弱、联想到的水果与自己的喜好分开记录。',
      'Record acid intensity, fruit associations and preference separately.',
    ),
    body: b(
      '酸味是味觉，柑橘香是嗅觉；两者可能一起出现但不能互相替代。明亮、柔和、尖锐都是个人描述，需要组内讨论。pH、可滴定酸和感知酸度不是同一个指标，低 pH 不自动等于更好或更差。',
      'Sour taste and citrus aroma can coincide but are not interchangeable. Bright, soft and sharp are personal descriptions needing shared context. pH, titratable acidity and perceived sourness are different measures; lower pH does not automatically mean better or worse.',
    ),
    practice: b(
      '对照两杯咖啡，先给酸强度打 1–5，再写喜欢程度 1–5，两项不要合并。',
      'Compare two coffees. Rate acid intensity 1–5 and liking 1–5 separately.',
    ),
    sources: ['sca-cva', 'ucdavis'],
  },
  {
    id: 'sweetness',
    name: b('甜感与甜香', 'Sweet taste and sweet aromas'),
    category: 'sensory',
    summary: b(
      '闻起来像焦糖，并不等于喝起来有同样强度的糖味。',
      'Smelling like caramel does not mean tasting equally sugary.',
    ),
    body: b(
      '香草、蜂蜜和焦糖香气能带来甜的期待。实际咖啡中感知甜感还受苦味、酸味、浓度和温度影响。记录时可分别写“蜂蜜香”和“甜味弱”，两者并不矛盾。',
      'Vanilla, honey and caramel aromas create an expectation of sweetness. Perceived sweetness in coffee also interacts with bitterness, sourness, strength and temperature. “Honey aroma” and “low sweet taste” can both be accurate.',
    ),
    practice: b(
      '比较一杯无糖咖啡与少量加糖的同款咖啡，练习分开写气味和味觉。',
      'Compare plain coffee with a lightly sweetened portion of the same brew, describing aroma and taste separately.',
    ),
    sources: ['wcr-lexicon', 'sca-cva'],
  },
  {
    id: 'bitterness',
    name: b('苦感', 'Bitterness'),
    category: 'sensory',
    summary: b(
      '苦味是咖啡的一部分，强度和喜好不是一回事。',
      'Bitterness is part of coffee; its intensity and your liking are different.',
    ),
    body: b(
      '多类化合物参与苦味，咖啡因只是其中之一。烘焙、原料、萃取与浓度都会影响表现。苦不必然表示萃取过度，也不能据此准确估算咖啡因含量。',
      'Multiple compounds contribute to bitterness; caffeine is only one. Roast, raw material, extraction and concentration influence the result. Bitterness does not necessarily mean over-extraction or reveal caffeine content.',
    ),
    practice: b(
      '将同一杯咖啡分成两份，一份少量加水，观察浓度如何影响苦感。',
      'Split one brew and add a little water to one portion. Observe how strength changes perceived bitterness.',
    ),
    sources: ['wcr-lexicon', 'ucdavis'],
  },
  {
    id: 'body',
    name: b('醇厚度与触感', 'Body and mouthfeel'),
    category: 'sensory',
    summary: b(
      '轻盈、黏稠、粉感和干涩属于触觉，应与香气分开。',
      'Lightness, viscosity, powderiness and dryness are tactile, separate from aroma.',
    ),
    body: b(
      '口腔感包含重量、黏度和质地。纸滤会拦截部分油脂与颗粒，金属滤网的保留程度不同。浓度会影响杯感，但浓不必然顺滑，颗粒多也不意味着质量高。涩是收敛和干燥的触觉，不是苦味。',
      'Mouthfeel includes weight, viscosity and texture. Paper retains some oils and particles differently from metal filters. Strength affects body, but strong is not necessarily smooth and sediment is not quality. Astringency is a drying tactile sensation, not bitterness.',
    ),
    practice: b(
      '用同款豆对照纸滤和法压，分别记录重量感、顺滑度与颗粒感。',
      'Compare paper-filtered and French-press brews of one coffee, recording weight, smoothness and particles separately.',
    ),
    sources: ['sca-cva', 'wcr-lexicon'],
  },
  {
    id: 'aftertaste',
    name: b('余韵', 'Aftertaste'),
    category: 'sensory',
    summary: b(
      '关注吞咽或吐出后留下什么，以及如何变化。',
      'Notice what remains after swallowing or spitting and how it changes.',
    ),
    body: b(
      '余韵包含残留香气、味觉和口腔感觉。持续时间长不必然更好：花香、糖香和令人不适的焦苦都可能留得很久。记录类型、强度、时长和喜欢程度。',
      'Aftertaste includes lingering aroma, taste and mouthfeel. Longer is not automatically better: flowers, sweet aromas and unpleasant burnt bitterness can all persist. Record type, intensity, duration and liking.',
    ),
    practice: b(
      '一口之后等约 20 秒，再写下剩余的两种感觉，避免马上喝下一口。',
      'Wait about 20 seconds after a sip and describe two remaining sensations before drinking again.',
    ),
    sources: ['sca-cva', 'wcr-lexicon'],
  },
  {
    id: 'balance',
    name: b('平衡与偏好', 'Balance and preference'),
    category: 'sensory',
    summary: b(
      '协调是人的评价，不是所有人共享的一条固定配方。',
      'Harmony is a human evaluation, not a universal fixed recipe.',
    ),
    body: b(
      '描述性记录先回答“有什么、多少”，喜好评价再回答“我喜不喜欢”。SCA Coffee Value Assessment 将描述与情感评价分开，也包含物理与外在信息。本站的强度刻度不是官方杯测表或认证评分。',
      'Description first asks “what and how much”; preference then asks “how much do I like it.” SCA Coffee Value Assessment separates descriptive and affective assessment alongside physical and extrinsic information. Our intensity scales are not official cupping forms or certification scores.',
    ),
    practice: b(
      '与朋友独立记录同一杯，先比较描述，再谈喜好，避免第一个人的评价带节奏。',
      'Record a cup independently with a friend. Compare descriptions before discussing liking to reduce anchoring.',
    ),
    sources: ['sca-cva'],
  },
  {
    id: 'extraction',
    name: b('萃取：溶出多少', 'Extraction: how much dissolves'),
    category: 'extraction',
    summary: b(
      '萃取率与杯中浓度不同，均匀程度同样关键。',
      'Extraction yield differs from beverage strength, and evenness matters.',
    ),
    body: b(
      '萃取率是干咖啡中进入饮品的可溶物比例。常见近似计算为：出液重量 × TDS% ÷ 干粉重量；滤泡的滞留液会影响精确分析。18–22% 是传统参考窗口，不是所有咖啡的最佳答案，口感也不能只靠一个数字判断。',
      'Extraction yield is the fraction of dry coffee entering the beverage as dissolved material. A common approximation is beverage mass × TDS% ÷ dry dose; retained liquid complicates exact filter-brew analysis. The historic 18–22% window is a reference, not a universal optimum, and taste cannot be inferred from one number.',
    ),
    practice: b(
      '固定粉水比，做两档研磨的对照，记录甜、酸、苦和干涩；有折射仪再补充测量。',
      'Keep ratio fixed and compare two grind settings, recording sweet, sour, bitter and drying sensations; add measurements if you have a refractometer.',
    ),
    sources: ['ucdavis', 'sca-standards'],
  },
  {
    id: 'strength',
    name: b('浓度：一口里有多少', 'Strength: what is in the cup'),
    category: 'extraction',
    summary: b(
      'TDS 表示溶解固形物浓度，不是品质评分。',
      'TDS measures dissolved-solids concentration, not quality.',
    ),
    body: b(
      '一杯可以浓而萃取不足，也可以淡但萃取充分。加入旁路水主要降低浓度，不会把已经萃出的物质放回粉里。测量需使用适合咖啡的折射仪、正确校准并按方法过滤和控温；水用电导 TDS 笔不能直接代替。',
      'A brew can be strong yet under-extracted, or weak with substantial extraction. Bypass water mainly reduces strength; it does not return extracted material to the grounds. Use a coffee refractometer with proper calibration, filtering and temperature handling; a conductivity TDS pen for water is not a substitute.',
    ),
    practice: b(
      '同一壶分三杯，以 0%、10%、20% 的额外水量稀释，比较强度和喜好。',
      'Split a brew into three cups, adding 0%, 10% and 20% extra water to compare intensity and liking.',
    ),
    sources: ['ucdavis'],
  },
  {
    id: 'grind',
    name: b('研磨与均匀度', 'Grind and evenness'),
    category: 'extraction',
    summary: b(
      '粒径、细粉和分布共同影响接触面积与流动。',
      'Particle size, fines and distribution jointly affect surface area and flow.',
    ),
    body: b(
      '更细常增加接触面积，但可能堵塞或引发不均匀流动；“细一定萃取更多”并非无条件成立。不同磨豆机的刻度无法直接互换。记录磨豆机型号与刻度，用流速和味道校准。',
      'Finer grinding often increases surface area but may cause stalling or uneven flow; “finer always extracts more” is conditional. Settings are not interchangeable across grinders. Record grinder and setting, calibrating by flow and taste.',
    ),
    practice: b(
      '每次只移动一个小刻度，固定粉量、注水和温度，观察流速与味道是否一起改变。',
      'Move one small step at a time while holding dose, pouring and temperature constant; observe whether flow and taste move together.',
    ),
    sources: ['ucdavis'],
  },
  {
    id: 'water',
    name: b('水质：硬度与缓冲', 'Water: hardness and buffering'),
    category: 'extraction',
    summary: b(
      '总矿化度不能替代硬度、碱度和异味检查。',
      'Total mineral content cannot replace checks of hardness, alkalinity and off-odors.',
    ),
    body: b(
      '钙镁硬度与碱度不是一回事；碱度影响酸的缓冲。SCA 102-2024 杯测水建议无异味、无氯，pH 6–8，并分别给出硬度与碱度范围。日常先用安全、无异味的饮用水，对比两种水；不要仅凭 TDS 笔读数认定某水适合咖啡。',
      'Calcium/magnesium hardness and alkalinity are different; alkalinity affects acid buffering. SCA 102-2024 specifies odor-free, chlorine-free cupping water, pH 6–8, and separate ranges for hardness and alkalinity. Begin with safe neutral-smelling drinking water and compare two waters; a TDS pen alone does not establish suitability.',
    ),
    practice: b(
      '同一配方用两种安全饮用水冲煮，盲标杯子，记录酸感、清晰度与余韵。',
      'Brew the same recipe with two safe drinking waters, code the cups and compare acidity, clarity and aftertaste.',
    ),
    sources: ['sca-water', 'sca-standards'],
  },
  {
    id: 'temperature',
    name: b('温度：不是单一开关', 'Temperature is not a single switch'),
    category: 'extraction',
    summary: b(
      '温度会影响萃取动力学，但不能单独预测最终味道。',
      'Temperature affects extraction kinetics but cannot alone predict the final flavor.',
    ),
    body: b(
      'UC Davis 研究在固定浓度和萃取率的滴滤条件下，对比 87、90、93°C，发现温度本身对感官差异影响较小。这个结论有实验边界，不应推广为所有咖啡、方法和温度都一样。壶内水温也不等于粉床温度。',
      'UC Davis researchers compared 87, 90 and 93°C in drip brewing at fixed strength and extraction, finding relatively small sensory effects of temperature itself. This has experimental limits and does not mean all coffees, methods and temperatures are equivalent. Kettle temperature is not bed temperature.',
    ),
    practice: b(
      '固定其他变量做 90°C 与 94°C 对照，记录流速变化，并在相似饮用温度品尝。',
      'Hold other variables fixed and compare 90°C with 94°C, recording flow and tasting at similar drinking temperatures.',
    ),
    sources: ['ucdavis'],
  },
  {
    id: 'ratio',
    name: b('比例与旁路加水', 'Ratios and bypass water'),
    category: 'extraction',
    summary: b(
      '先定义分母：冲入的水，还是最后得到的咖啡。',
      'First define the denominator: input water or beverage output.',
    ),
    body: b(
      '手冲 1:16 通常是干粉与注水重量比；意式 1:2 通常是干粉与杯中出液比。两者不能混算。粉会保留部分水，注水量不是最终饮品量。杯数在计算器里表示配方份数，不是器具标称小杯。',
      'Pour-over 1:16 generally means dry coffee to input water; espresso 1:2 generally means dry coffee to beverage yield. They cannot be interchanged. Grounds retain water, so input water is not final beverage mass. Calculator servings mean recipe portions, not manufacturer “cups.”',
    ),
    practice: b(
      '用计算器做 15 g × 16 = 240 g，再称最终饮品，理解留在粉里的水。',
      'Calculate 15 g × 16 = 240 g, then weigh the finished drink to understand retained water.',
    ),
    sources: ['ucdavis', 'sca-standards'],
  },
  {
    id: 'agitation',
    name: b('注水、搅动与通道', 'Pouring, agitation and channels'),
    category: 'extraction',
    summary: b(
      '同样的时间和比例，水走的路径也可能完全不同。',
      'Identical time and ratio can hide very different water pathways.',
    ),
    body: b(
      '搅动改善润湿，也可能把细粉移到滤纸上导致堵塞。通道让部分粉接触过多水、部分不足。酸与涩同时出现时，先检查布粉、润湿、注水位置和粉床，而不是立刻改变全部变量。',
      'Agitation improves wetting but can move fines onto paper and cause stalling. Channels give some grounds excessive contact and others too little. When sourness and dryness coincide, inspect distribution, wetting, pouring position and the bed before changing everything.',
    ),
    practice: b(
      '两次冲煮只改变搅动程度，记录总时长、粉床状态和味道。',
      'Change only agitation between two brews and record total time, bed appearance and flavor.',
    ),
    sources: ['ucdavis'],
  },
  {
    id: 'freshness',
    name: b('养豆与保存', 'Resting and storage'),
    category: 'extraction',
    summary: b(
      '新鲜度与排气相互影响，没有适用于所有豆子的固定天数。',
      'Freshness and degassing interact; no fixed resting time fits every coffee.',
    ),
    body: b(
      '烘焙后的气体释放会影响润湿和意式流动，氧气、热、湿度和光会加速香气变化。使用小份密封、避光干燥保存；冷冻时分装密封，回温前不开封，避免反复温湿变化。优先用同批次的时间对照建立经验。',
      'Post-roast gas release affects wetting and espresso flow; oxygen, heat, humidity and light accelerate aroma changes. Store small sealed portions in a cool dry dark place. If freezing, portion and seal, thaw before opening and avoid repeated temperature and moisture changes. Learn from time comparisons within one lot.',
    ),
    practice: b(
      '同批次在不同天冲煮并记录，找到适合当前烘焙和方法的窗口。',
      'Brew one lot on different days and record results to find a window for that roast and method.',
    ),
    sources: ['sca-standards', 'cafeimports'],
  },
  {
    id: 'cupping',
    name: b('杯测流程', 'A practical cupping sequence'),
    category: 'cupping',
    summary: b(
      '统一准备条件，先闻香，再在冷却过程中多次评价。',
      'Standardize preparation, smell first, then assess repeatedly while cooling.',
    ),
    body: b(
      'SCA 102-2024 杯测采用每 150 mL 满杯容积 8.25 g 咖啡，注水 93±3°C，粉层保留 3–5 分钟后破渣。本站练习可固定在第 4 分钟，撇渣并待可安全饮用时开始，多温度重复。每样多杯有助识别不一致；正式评价需遵循标准的完整准备与卫生要求。',
      'SCA 102-2024 uses 8.25 g per 150 mL of full vessel capacity, water at 93±3°C and a 3–5 minute crust period. For our practice, fix the break at four minutes, skim and start once safe to sip, revisiting as the coffee cools. Multiple cups reveal inconsistency; formal assessment requires the full preparation and hygiene standard.',
    ),
    practice: b(
      '准备两款豆，每款至少两杯作入门对照，盲标后独立记录；不要把此简化练习称为正式 CVA。',
      'For introductory practice, prepare at least two cups each of two coffees, code them and record independently. Do not label this simplified exercise a formal CVA.',
    ),
    sources: ['sca-standards', 'sca-cva'],
  },
  {
    id: 'calibration',
    name: b('感官校准', 'Sensory calibration'),
    category: 'cupping',
    summary: b(
      '先对齐参照和刻度含义，再比较彼此的描述。',
      'Align references and scale meanings before comparing descriptions.',
    ),
    body: b(
      'WCR 词典用定义、参照和强度建立共享语言。本站厨房练习是原创入门活动，不是 WCR 原版强度标准。使用安全食物、检查过敏、一次只练少量词汇；每人先独立记录，讨论后重新品尝。',
      'The WCR lexicon builds shared language through definitions, references and intensity. Our kitchen exercises are original introductions, not WCR’s standardized intensity references. Use safe foods, check allergies and practice a few terms at a time. Record independently, discuss and taste again.',
    ),
    practice: b(
      '本次只练柠檬、橙子和葡萄柚。先闻实物，再盲尝三杯咖啡，允许写“都没有”。',
      'Practice only lemon, orange and grapefruit. Smell food references, then taste three coded coffees, allowing “none of these.”',
    ),
    sources: ['wcr-lexicon', 'sca-cva'],
  },
  {
    id: 'blind',
    name: b('盲测与偏差', 'Blind tasting and bias'),
    category: 'cupping',
    summary: b(
      '价格、产地和第一个人的描述都会改变期待。',
      'Price, origin and the first person’s description can shape expectations.',
    ),
    body: b(
      '用随机三位编号隐藏来源，让杯子位置随机化。先独立记录，再揭盲讨论。盲测减少部分期待偏差，但不消除疲劳、顺序效应和样本温度差。保留冲煮条件和编码表，便于复核。',
      'Hide identity with random three-digit codes and randomize cup positions. Record independently before revealing and discussing. Blinding reduces some expectation bias but does not remove fatigue, order effects or temperature differences. Keep preparation conditions and the code key for review.',
    ),
    practice: b(
      '请同伴给同一款咖啡两杯不同编号，观察你的描述是否保持一致。',
      'Have a partner give two portions of the same coffee different codes and check the consistency of your descriptions.',
    ),
    sources: ['sca-cva', 'ucdavis'],
  },
  {
    id: 'triangulation',
    name: b('三角测试', 'Triangle testing'),
    category: 'cupping',
    summary: b(
      '三杯中两杯相同、一杯不同，任务是找出不同杯。',
      'Two of three cups are the same; identify the different one.',
    ),
    body: b(
      '三角测试关注能否检出差异，不是选出最好喝的一杯。随机化 AAB、ABA、BAA 等呈现顺序，保持温度和份量接近。一次猜对可能只是机会，正式统计判断需事先设计重复次数与显著性门槛。',
      'Triangle testing asks whether a difference is detectable, not which cup tastes best. Randomize sequences such as AAB, ABA and BAA while matching temperature and portion. One correct choice may be chance; formal inference needs a planned number of trials and significance threshold.',
    ),
    practice: b(
      '用同豆两档研磨准备 A/B，再请同伴组成三杯；记选择、信心和线索，揭盲后讨论。',
      'Make A/B from one coffee at two grind settings, have a partner serve three cups, and record choice, confidence and clues before revealing.',
    ),
    sources: ['ucdavis', 'sca-cva'],
  },
  {
    id: 'sour-cup',
    name: b('排查：尖酸、空薄', 'Troubleshoot: sharp and hollow'),
    category: 'defects',
    summary: b(
      '先区分原料的酸质、低浓度与萃取不均。',
      'Separate inherent acidity, low strength and uneven extraction.',
    ),
    body: b(
      '若又尖酸又缺乏其他香味，检查称量、研磨、温度和接触是否充分。保持粉量与比例，先略细研磨或改善润湿，再对照品尝。若一侧酸一侧干涩，优先处理通道；若咖啡本就明亮，不必把酸全部“修掉”。',
      'If sharp sourness comes with few other flavors, check weighing, grind, temperature and contact. Hold dose and ratio, try slightly finer grinding or better wetting, then compare. If sourness coexists with dryness, prioritize channels. Naturally bright coffee need not have all acidity “fixed away.”',
    ),
    practice: b(
      '写下当前配方，只改变研磨一步，保留旧配方作为对照。',
      'Record the current recipe and change grind by one step, retaining the old brew as a comparison.',
    ),
    sources: ['ucdavis'],
  },
  {
    id: 'bitter-cup',
    name: b('排查：苦与焦', 'Troubleshoot: bitter and burnt'),
    category: 'defects',
    summary: b(
      '浓、苦、焦和涩是四件需要分开诊断的事。',
      'Strong, bitter, burnt and astringent need separate diagnoses.',
    ),
    body: b(
      '先少量稀释判断是否只是过浓，再比较豆子的干香和另一种冲煮。深焙本身可能带焦香，不能全部归因于萃取。若不均匀，先修布粉和注水；若整体过强，再尝试降低温度或温和调整研磨。',
      'First dilute a little to check excessive strength, then compare dry fragrance and another preparation. Dark roasting may itself bring burnt notes, so extraction is not the only cause. Fix distribution and pouring if uneven; if the cup is uniformly too intense, try cooler water or a modest grind change.',
    ),
    practice: b(
      '同杯先做 10% 加水对照，再决定是否改变下一次冲煮。',
      'Compare a portion diluted with 10% extra water before changing the next brew.',
    ),
    sources: ['ucdavis'],
  },
  {
    id: 'drying',
    name: b('排查：干涩', 'Troubleshoot: drying astringency'),
    category: 'defects',
    summary: b(
      '像浓茶一样收口发干，属于触觉，不是苦味。',
      'A drying, puckering sensation like strong tea is tactile, not bitterness.',
    ),
    body: b(
      '干涩可能与原料、细粉、不均匀流动或强烈搅动有关。首先检查粉床均匀度、滤纸堵塞和意式通道。减少过度搅动，并在相同饮用温度比较，避免只追求某个总时间。',
      'Dryness may involve raw material, fines, uneven flow or heavy agitation. First inspect bed evenness, paper stalling and espresso channels. Reduce excessive agitation and compare at similar drinking temperatures rather than chasing a total time.',
    ),
    practice: b(
      '固定研磨，尝试减少一次大幅搅动，比较两杯的干燥感。',
      'Keep grind fixed and remove one vigorous agitation step; compare dryness.',
    ),
    sources: ['sca-cva', 'ucdavis'],
  },
  {
    id: 'weak',
    name: b('排查：淡与水感', 'Troubleshoot: weak and watery'),
    category: 'defects',
    summary: b(
      '淡不一定萃取不足，先检查用量和稀释。',
      'Weak does not necessarily mean under-extracted; check dose and dilution.',
    ),
    body: b(
      '核对咖啡、注水与旁路水的实际重量，确认计算器使用的是每份还是总量。若风味清晰但淡，减少水或增加粉量可能更直接；若又淡又尖酸，检查研磨、润湿与温度。',
      'Check actual masses of coffee, input water and bypass water, and whether the calculator is showing per-serving or total amounts. If clear but weak, reducing water or increasing dose may be direct. If weak and sharp-sour, inspect grind, wetting and temperature.',
    ),
    practice: b(
      '相同研磨做 1:15 与 1:17，分别记录强度与喜好。',
      'At one grind setting, compare 1:15 with 1:17 and record strength separately from liking.',
    ),
    sources: ['ucdavis'],
  },
  {
    id: 'stale',
    name: b('排查：纸板与陈败', 'Troubleshoot: cardboard and stale oils'),
    category: 'defects',
    summary: b(
      '检查熟豆、磨豆机油脂、滤纸与储存容器。',
      'Check roasted coffee, grinder oils, filter paper and storage containers.',
    ),
    body: b(
      '平淡纸板味可与氧化陈化有关，也可能来自滤纸或器具。先闻干豆、空杯和冲洗水，再清洁器具并用新鲜样本对照。不要用更高温或更细研磨掩盖储存问题。',
      'Flat cardboard notes may relate to oxidation and aging or come from paper and equipment. Smell dry beans, an empty cup and rinse water, then clean and compare a fresh sample. Hotter water or finer grinding will not repair storage damage.',
    ),
    practice: b(
      '用同一种水冲洗滤纸，单独品尝水样来排除滤纸影响。',
      'Rinse the filter with your brewing water and taste that water separately to check paper influence.',
    ),
    sources: ['wcr-lexicon', 'cafeimports'],
  },
  {
    id: 'musty-cup',
    name: b('排查：霉湿异味', 'Troubleshoot: mustiness'),
    category: 'defects',
    summary: b(
      '停止品尝疑似霉变材料，分开核查样本与器具。',
      'Stop tasting suspected moldy material and inspect sample and equipment separately.',
    ),
    body: b(
      '霉湿、潮储物间等词是气味描述，不是霉菌毒素检测。核查生豆和熟豆包装、储存湿度、滤布与容器清洁。对有疑问的样本隔离并联系供应者，不用实际霉变材料训练嗅觉。',
      'Musty or damp-storage terms describe aroma; they are not mycotoxin tests. Check packaging, humidity, cloth filters and containers. Isolate suspect samples and contact the supplier. Never use actual moldy material for aroma training.',
    ),
    practice: b(
      '建立器具干燥和储存检查表，用安全正常样本复核。',
      'Create an equipment-drying and storage checklist and recheck with a safe normal sample.',
    ),
    sources: ['wcr-lexicon', 'cqi'],
  },
  {
    id: 'phenolic-cup',
    name: b('排查：药水与塑料感', 'Troubleshoot: medicinal or plastic notes'),
    category: 'defects',
    summary: b(
      '逐一隔离水、器具、清洁残留与豆子。',
      'Isolate water, equipment, cleaner residue and beans in turn.',
    ),
    body: b(
      '酚类联想可能涉及加工、污染或含氯水等因素，不能仅凭气味定位原因。先检查纯水与器具空白，再更换可信豆样对照。若怀疑清洁剂残留，应停止饮用并彻底按说明清洁。',
      'Phenolic associations can involve processing, contamination or chlorinated water; aroma alone cannot locate the cause. Test water and equipment blanks, then compare a trusted coffee sample. Stop drinking if cleaner residue is suspected and clean according to instructions.',
    ),
    practice: b(
      '做“水—器具—咖啡”三层排除记录，不直接嗅闻任何清洁化学品。',
      'Keep a water–equipment–coffee elimination record; never directly sniff cleaning chemicals.',
    ),
    sources: ['wcr-lexicon', 'cqi'],
  },
  {
    id: 'potato',
    name: b('排查：生土豆样异味', 'Troubleshoot: raw-potato taint'),
    category: 'defects',
    summary: b(
      '少数杯可能出现鲜明异常，不应用一杯概括整个产区。',
      'A few cups may show a distinctive anomaly; one cup cannot define an origin.',
    ),
    body: b(
      '生土豆样气味是部分咖啡中被记录的异常联想，可能在单个样杯集中出现。重复取样和多杯比对有助定位不一致。记录批次、杯号与强度，联系供应者复核；不要据此给一个国家贴负面标签。',
      'Raw-potato-like aroma is a documented taint association that may concentrate in an individual cup. Repeat sampling and multiple cups help identify inconsistency. Record lot, cup code and intensity and seek supplier review rather than labeling an entire country.',
    ),
    practice: b(
      '正式采购前用多份独立称量样本复核，记录每杯而不是只写平均印象。',
      'Before purchasing, check multiple independently weighed samples and record each cup rather than only an average impression.',
    ),
    sources: ['wcr-lexicon', 'cafeimports'],
  },
  {
    id: 'altitude',
    name: b('海拔、品种与环境', 'Elevation, genetics and environment'),
    category: 'extraction',
    summary: b(
      '海拔只是环境线索，不能直接换算成分数。',
      'Elevation is an environmental clue, not a formula for a score.',
    ),
    body: b(
      '海拔与温度、成熟速度常有关联，但纬度、坡向、遮荫、降雨和品种也改变条件。相同海拔在不同国家并不等于相同气候。品种、生产管理、采后处理与烘焙共同影响杯中表现。',
      'Elevation often relates to temperature and ripening, but latitude, aspect, shade, rainfall and genetics also matter. The same elevation in different countries does not mean the same climate. Genetics, farming, post-harvest processing and roasting all influence the cup.',
    ),
    practice: b(
      '对比同一生产者不同海拔或品种的批次，保留其他条件信息再讨论因果。',
      'Compare lots from one producer at different elevations or of different varieties, retaining other conditions before discussing causes.',
    ),
    sources: ['wcr-varieties', 'anacafe', 'icafe'],
  },
  {
    id: 'roast-development',
    name: b('烘焙发展与颜色', 'Roast development and color'),
    category: 'extraction',
    summary: b(
      '外观颜色不能完整描述一条烘焙曲线。',
      'External color cannot fully describe a roast profile.',
    ),
    body: b(
      '时间、能量输入、原料密度与含水状态影响烘焙反应。两款颜色相似的豆仍可能表现不同。生谷物、焦苦或空洞都需要结合多个样本和冲煮复核；不要从一个描述词直接诊断“烘焙不足”。',
      'Time, energy input, raw density and moisture influence roasting reactions. Similar-colored coffees can still differ. Raw grain, burnt bitterness or hollowness need checks across samples and preparation; one descriptor cannot diagnose underdevelopment.',
    ),
    practice: b(
      '用同款豆的两种烘焙做盲测，将可描述差异与偏好分别记录。',
      'Blind-taste two roasts of one coffee, separating descriptive differences from preference.',
    ),
    sources: ['sca-standards', 'ucdavis'],
  },
];

export const learningPaths: LearningPath[] = [
  {
    id: 'beginner',
    name: b('从第一口开始', 'Start with your first sip'),
    description: b(
      '七次短练习，建立属于自己的风味语言。每天一杯就够。',
      'Seven short exercises to build your own flavor language. One cup a day is enough.',
    ),
    duration: b('7 天 · 每次 10 分钟', '7 days · 10 minutes each'),
    lessons: ['aroma', 'taste', 'acidity', 'sweetness', 'body', 'ratio', 'balance'],
    exercises: [
      b('记录今天闻到的两个词。', 'Write two aromas you notice today.'),
      b('用捏鼻对照感受香气。', 'Compare a sip with and without a pinched nose.'),
      b('将酸强度和喜欢程度分开。', 'Separate acid intensity from liking.'),
      b('辨别甜香与真正甜味。', 'Separate sweet aroma from sweet taste.'),
      b('比较纸滤与金属滤网。', 'Compare paper and metal filtration.'),
      b('只改粉水比，保留对照。', 'Change only ratio and keep a comparison.'),
      b('保存第一份完整品鉴手记。', 'Save your first complete tasting note.'),
    ],
  },
  {
    id: 'professional',
    name: b('让感官更有把握', 'Build a more confident palate'),
    description: b(
      '七组校准任务，把直觉变成可以复核、交流的记录。',
      'Seven calibration tasks turn impressions into records you can repeat and discuss.',
    ),
    duration: b('7 组 · 每次 20–30 分钟', '7 sessions · 20–30 minutes each'),
    lessons: [
      'cupping',
      'calibration',
      'blind',
      'triangulation',
      'extraction',
      'water',
      'roast-development',
    ],
    exercises: [
      b(
        '统一杯容积、粉量与破渣时间。',
        'Standardize vessel capacity, dose and crust-breaking time.',
      ),
      b('用三个安全实物建立共享参照。', 'Align three safe physical references.'),
      b(
        '为同一咖啡设置不同盲码，检验一致性。',
        'Give one coffee different blind codes to test consistency.',
      ),
      b('设计并记录一次随机三角测试。', 'Design and record a randomized triangle test.'),
      b('固定比例，比较两档研磨。', 'Fix ratio and compare two grind settings.'),
      b(
        '对照两种水，并记录来源与参数。',
        'Compare two waters and record their sources and parameters.',
      ),
      b(
        '盲测两条烘焙曲线，先描述后偏好。',
        'Blind-taste two roast profiles: describe before judging preference.',
      ),
    ],
  },
];

export const quiz: {
  id: string;
  question: Localized;
  options: Localized[];
  answer: number;
  explanation: Localized;
}[] = [
  {
    id: 'sweet-aroma',
    question: b(
      '闻到焦糖香，但喝起来不甜，这份记录矛盾吗？',
      'Caramel aroma, but little sweet taste. Is that contradictory?',
    ),
    options: [
      b('不矛盾，香气和甜味不同', 'No, aroma and sweet taste differ'),
      b('矛盾，焦糖香必然很甜', 'Yes, caramel must taste very sweet'),
      b('需要提高杯测分数', 'The cupping score must rise'),
    ],
    answer: 0,
    explanation: b(
      '香气会带来甜的联想，但不是糖味的测量。分别记录更准确。',
      'Aroma suggests sweetness but does not measure sweet taste. Separate records are more precise.',
    ),
  },
  {
    id: 'espresso-ratio',
    question: b(
      '18 g 粉、1:2 的意式比例，目标是什么？',
      'For 18 g coffee at a 1:2 espresso ratio, what is the target?',
    ),
    options: [
      b('36 g 注水', '36 g input water'),
      b('36 g 杯中咖啡液', '36 g beverage in the cup'),
      b('180 g 杯中咖啡液', '180 g beverage in the cup'),
    ],
    answer: 1,
    explanation: b(
      '意式比例通常指粉重与出液重，不是进入机器的水。',
      'Espresso ratio usually means dose to beverage yield, not input water.',
    ),
  },
  {
    id: 'quality',
    question: b(
      '花香强度更高，是否自动代表品质更高？',
      'Does stronger florality automatically mean higher quality?',
    ),
    options: [
      b('是，强度等于质量', 'Yes, intensity equals quality'),
      b('只在浅焙时成立', 'Only for light roasts'),
      b('否，描述与评价应分开', 'No, description and evaluation differ'),
    ],
    answer: 2,
    explanation: b(
      '强度回答“多少”，品质或喜好回答另一类问题。',
      'Intensity answers “how much”; quality or preference asks a different question.',
    ),
  },
  {
    id: 'honey',
    question: b('蜜处理一定添加了蜂蜜吗？', 'Does honey processing necessarily add honey?'),
    options: [
      b('没有，名称指果胶保留', 'No, it refers to retained mucilage'),
      b('是，需加入天然蜂蜜', 'Yes, natural honey is required'),
      b('只有黑蜜处理需要', 'Only black honey requires it'),
    ],
    answer: 0,
    explanation: b(
      '蜜处理保留果胶干燥；颜色名称的定义因生产者而异。',
      'Honey processing dries coffee with mucilage retained; color terms vary by producer.',
    ),
  },
  {
    id: 'astringency',
    question: b(
      '像浓茶一样让口腔发干，最适合记录在哪一项？',
      'Where should you record a drying sensation like strong tea?',
    ),
    options: [
      b('香气', 'Aroma'),
      b('口腔触感', 'Mouthfeel'),
      b('咖啡因浓度', 'Caffeine concentration'),
    ],
    answer: 1,
    explanation: b(
      '涩感是触觉，不等于苦味，也不能测出咖啡因。',
      'Astringency is tactile, not bitterness or a caffeine measurement.',
    ),
  },
  {
    id: 'triangle',
    question: b('三角测试主要回答什么？', 'What does a triangle test primarily ask?'),
    options: [
      b('哪杯最贵', 'Which cup is most expensive'),
      b('哪杯品质最高', 'Which cup is highest quality'),
      b('能否检出不同的一杯', 'Can the different cup be detected'),
    ],
    answer: 2,
    explanation: b(
      '差异测试不是喜好测试；一次猜对也可能是机会。',
      'A difference test is not a preference test, and one correct choice may be chance.',
    ),
  },
];
