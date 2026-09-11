import { b, type Method } from './types';

export const methods: Method[] = [
  {
    id: 'v60',
    name: b('V60 手冲', 'V60 pour-over'),
    category: 'filter',
    description: b(
      '锥形滤杯、大孔与纸滤，让注水和研磨的变化清晰地出现在杯中。适合探索花果香与层次。',
      'A conical dripper, large opening and paper filter make changes in pouring and grind easy to explore. A useful way to study delicate layers and fruit or floral aromas.',
    ),
    ratio: 16,
    ratioRange: [14, 18],
    ratioBasis: 'water',
    dose: 15,
    temperature: [90, 96],
    seconds: [150, 210],
    grind: b(
      '中细，接近细砂糖；按流速微调',
      'Medium-fine, roughly fine granulated sugar; adjust for flow',
    ),
    steps: [
      b(
        '冲洗滤纸、预热滤杯与分享壶，倒掉预热水。',
        'Rinse the filter, warm the dripper and server, then discard the rinse water.',
      ),
      b(
        '加入研磨咖啡并轻拍平整，用约 2–3 倍粉重的水闷蒸 30–45 秒。',
        'Level the grounds. Bloom with about 2–3 times their mass in water for 30–45 seconds.',
      ),
      b(
        '从中心向外小圈注水，分两到三段达到总水量，避免大力冲刷杯壁。',
        'Pour in small circles from the center in two or three additions to the total water target; avoid forcefully washing the walls.',
      ),
      b(
        '滴滤完成后轻摇分享壶，趁热到温凉分阶段品尝。',
        'After drawdown, swirl the server and taste at several temperatures.',
      ),
    ],
    tip: b(
      '若又酸又涩，先检查注水不均和通道效应；不要只把研磨调得更细。',
      'If both sour and drying, first check uneven pouring and channeling instead of automatically grinding finer.',
    ),
    caution: b(
      '15 g / 240 g 是本站练习起点。滤纸、烘焙度、水质和滤杯尺寸都会改变流速。',
      '15 g / 240 g is our practice starting point. Paper, roast, water and dripper size all affect flow.',
    ),
    sources: ['hario', 'ucdavis'],
  },
  {
    id: 'chemex',
    name: b('Chemex', 'Chemex'),
    category: 'filter',
    description: b(
      '厚纸滤与一体式玻璃壶带来清晰的杯感。较大的批量适合分享，也需要留意滤纸排气。',
      'Thick paper and an integrated glass server produce a clear cup. Larger batches suit sharing and require attention to the filter air channel.',
    ),
    ratio: 16,
    ratioRange: [14, 18],
    ratioBasis: 'water',
    dose: 30,
    temperature: [90, 96],
    seconds: [240, 330],
    grind: b('中粗，比 V60 略粗', 'Medium-coarse, a little coarser than V60'),
    steps: [
      b(
        '将三层滤纸面朝壶嘴，充分润湿并倒掉水，保持壶嘴气道畅通。',
        'Place the three-layer side toward the spout, rinse thoroughly and empty the water. Keep the spout air channel open.',
      ),
      b(
        '加入咖啡粉，用约两倍粉重的水闷蒸 30–45 秒。',
        'Add grounds and bloom with about twice their mass in water for 30–45 seconds.',
      ),
      b(
        '分段缓慢注水，保持粉床湿润，达到计划总水量。',
        'Pour slowly in stages, keeping the bed wet until the planned total water is reached.',
      ),
      b(
        '滴滤结束后移除滤纸，轻摇后分享。',
        'Remove the filter when drawdown finishes, swirl and serve.',
      ),
    ],
    tip: b(
      '若流速突然停滞，先看滤纸是否贴住壶嘴堵住空气通道。',
      'If flow suddenly stalls, first check whether the filter has sealed the spout air channel.',
    ),
    caution: b(
      '小号三杯壶与大号壶的研磨和时间不宜直接照搬；注意热玻璃。',
      'Do not transfer grind and timing unchanged between the small three-cup brewer and larger sizes. Handle hot glass carefully.',
    ),
    sources: ['chemex', 'ucdavis'],
  },
  {
    id: 'aeropress',
    name: b('AeroPress 爱乐压', 'AeroPress'),
    category: 'immersion',
    description: b(
      '短时间浸泡后温和压滤，变量灵活，易于做小份对照实验。这里采用直立冲煮。',
      'A short immersion followed by gentle pressure gives a flexible brewer for small comparison batches. This recipe uses the upright method.',
    ),
    ratio: 14,
    ratioRange: [10, 17],
    ratioBasis: 'water',
    dose: 15,
    temperature: [80, 95],
    seconds: [90, 150],
    grind: b('中细，压滤时应有适度阻力', 'Medium-fine, with moderate resistance when pressing'),
    steps: [
      b(
        '装好滤纸与滤盖，直立放在稳定且适配的杯子上。',
        'Fit the paper and cap, then stand upright on a stable compatible cup.',
      ),
      b(
        '加入咖啡粉和目标热水，轻搅约 10 秒。',
        'Add grounds and the target hot water; stir gently for about 10 seconds.',
      ),
      b(
        '插入活塞封住顶部，浸泡约 60–90 秒。',
        'Insert the plunger to seal the top and steep for about 60–90 seconds.',
      ),
      b(
        '稳稳压下约 20–30 秒；需要时加水稀释并记录。',
        'Press steadily for about 20–30 seconds. Dilute if desired and record the added water.',
      ),
    ],
    tip: b(
      '若压不动，停止加力，检查研磨和滤纸。浓度可通过旁路加水调整。',
      'If pressing becomes difficult, stop forcing it and check grind and filter. Adjust strength with bypass water.',
    ),
    caution: b(
      '这是完整杯量的自选练习配方。官方原始浓缩式配方约 85°C，体现参数并无唯一答案；遵守杯体容量。',
      'This is our full-cup practice recipe. The original manufacturer concentrate recipe uses about 85°C, illustrating that parameters are not unique. Respect chamber capacity.',
    ),
    sources: ['aeropress', 'ucdavis'],
  },
  {
    id: 'french-press',
    name: b('法压壶', 'French press'),
    category: 'immersion',
    description: b(
      '全浸泡与金属滤网保留较多油脂和细粉，适合比较醇厚度、悬浮颗粒与清晰度。',
      'Full immersion and a metal screen retain more oils and fines, useful for comparing body, suspended particles and clarity.',
    ),
    ratio: 15,
    ratioRange: [12, 18],
    ratioBasis: 'water',
    dose: 20,
    temperature: [90, 96],
    seconds: [240, 480],
    grind: b('中粗、分布均匀，避免大量细粉', 'Medium-coarse and even; avoid excessive fines'),
    steps: [
      b(
        '预热壶体，加入咖啡粉并一次注入目标水量。',
        'Warm the carafe, add grounds and pour the target water in one addition.',
      ),
      b(
        '轻搅润湿全部咖啡粉，浸泡约 4 分钟。',
        'Stir gently to wet all grounds and steep for about four minutes.',
      ),
      b(
        '轻破表面粉层，撇去浮沫；额外静置能让颗粒沉降。',
        'Gently break the crust and skim foam; extra settling time lets particles sink.',
      ),
      b(
        '缓慢压下，不挤压粉床，倒出全部咖啡，避免长时间留在粉上。',
        'Lower the plunger slowly without squeezing the bed, then decant all the coffee.',
      ),
    ],
    tip: b(
      '颗粒多不等于萃取过度。先延长沉降并轻倒，再比较味道。',
      'Sediment does not itself mean over-extraction. First allow settling and pour gently, then compare flavor.',
    ),
    caution: b(
      '时间范围包含可选沉降时间；容量放大后保温和沉降会变化。',
      'The time range includes optional settling. Heat retention and settling change with batch size.',
    ),
    sources: ['ucdavis', 'sca-standards'],
  },
  {
    id: 'espresso',
    name: b('意式浓缩', 'Espresso'),
    category: 'pressure',
    description: b(
      '压力下的短时萃取，把粉饼均匀度、出液重量和浓度放到中心。油脂厚度不是质量评分。',
      'Brief extraction under pressure places puck evenness, beverage yield and concentration at the center. Crema thickness is not a quality score.',
    ),
    ratio: 2,
    ratioRange: [1.5, 3],
    ratioBasis: 'yield',
    dose: 18,
    temperature: [90, 94],
    seconds: [25, 35],
    grind: b(
      '细；以粉碗容量和出液表现校准',
      'Fine; calibrate to basket capacity and beverage flow',
    ),
    steps: [
      b(
        '预热冲煮头和手柄，使用与粉量匹配的粉碗。',
        'Warm the group and portafilter; use a basket suited to the dose.',
      ),
      b(
        '称粉、均匀布粉、水平压粉，清理边缘。',
        'Weigh the dose, distribute evenly, tamp level and clean the rim.',
      ),
      b(
        '从启泵开始计时，称出液重量，以 18 g 粉得到 36 g 咖啡为练习起点。',
        'Time from pump start and weigh beverage yield; begin practice with 18 g in and 36 g out.',
      ),
      b(
        '搅匀再尝，先固定粉量与比例，用研磨改善流速与均匀度。',
        'Stir before tasting. Keep dose and ratio fixed first, adjusting grind for flow and evenness.',
      ),
    ],
    tip: b(
      '同时酸和干涩常提示通道或不均匀萃取；喷溅、极快出液需要先排查粉饼。',
      'Sourness together with dryness often suggests channeling or uneven extraction. Investigate the puck when flow sprays or runs extremely fast.',
    ),
    caution: b(
      '比例是干粉 : 杯中咖啡液，不是注入机器的水量。时间受预浸泡、机器和豆子影响，切勿只追秒数。',
      'The ratio is dry coffee : beverage in the cup, not water entering the machine. Pre-infusion, equipment and beans affect time; do not chase seconds alone.',
    ),
    sources: ['sca-standards', 'ucdavis'],
  },
  {
    id: 'moka',
    name: b('摩卡壶', 'Moka pot'),
    category: 'pressure',
    description: b(
      '蒸汽压力推动热水穿过粉层，得到浓厚咖啡。使用器具原定容量，比追求任意粉水比更重要。',
      'Vapor pressure drives water through grounds for concentrated coffee. The brewer’s designed capacity takes priority over an arbitrary ratio.',
    ),
    ratio: 10,
    ratioRange: [8, 12],
    ratioBasis: 'water',
    dose: 18,
    temperature: [20, 25],
    seconds: [180, 300],
    grind: b('中细，比意式粗；不压粉', 'Medium-fine, coarser than espresso; never tamp'),
    steps: [
      b(
        '检查密封圈和安全阀，按原厂要求加水，水位不得覆盖安全阀。',
        'Inspect the gasket and safety valve. Fill according to the manufacturer without covering the safety valve.',
      ),
      b(
        '粉篮自然装平，不压粉，擦净接合处再拧紧。',
        'Fill the basket level without tamping, clean the joint and screw together securely.',
      ),
      b(
        '使用中小火，火焰不超出壶底。关注出液，避免长时间大火。',
        'Use low to medium heat; keep the flame within the base and watch the flow.',
      ),
      b(
        '出液明显变浅或开始喷溅时及时移开热源，等壶冷却再拆开。',
        'Remove from heat when the stream pales or starts sputtering. Let the pot cool before opening.',
      ),
    ],
    tip: b(
      '苦焦味先检查火力和停火时机；不要通过压实粉层提高浓度。',
      'For burnt bitterness, check heat and when you stop brewing; do not tamp the grounds to increase strength.',
    ),
    caution: b(
      '计算器仅作大致用量参考，实际粉水量必须服从粉篮、锅炉和安全阀容量。20–25°C 指按厂商常温水建议设置的起始锅炉水温，并非冲煮温度；遵循具体型号说明。',
      'Calculator quantities are approximate. Respect the basket, boiler and valve capacity. 20–25°C describes starting boiler water, following the maker’s room-temperature-water advice, not brewing temperature; follow your model’s manual.',
    ),
    sources: ['bialetti'],
  },
  {
    id: 'siphon',
    name: b('虹吸壶', 'Siphon'),
    category: 'immersion',
    description: b(
      '蒸汽压力抬升水，离火后压差让咖啡回流。全浸泡与过滤相结合，也适合展示冲煮过程。',
      'Vapor pressure raises water, then a pressure difference returns coffee after heat removal. It combines immersion with filtration and a visible brewing process.',
    ),
    ratio: 15,
    ratioRange: [13, 17],
    ratioBasis: 'water',
    dose: 20,
    temperature: [90, 95],
    seconds: [60, 120],
    grind: b('中等，按滤器与回流速度微调', 'Medium; adjust to the filter and drawdown speed'),
    steps: [
      b(
        '安装并检查滤器，擦干下壶外壁，按器具容量加水。',
        'Install and inspect the filter, dry the lower chamber outside and add water within capacity.',
      ),
      b(
        '按器具说明加热升水，水进入上壶后调低热源。',
        'Heat as instructed to raise water, then lower the heat when water reaches the upper chamber.',
      ),
      b(
        '加粉后轻搅均匀，保持稳定浸泡约 45–75 秒。',
        'Add grounds, stir gently to wet evenly and hold a stable immersion for about 45–75 seconds.',
      ),
      b(
        '移开热源，等待完全回流后再拆壶并倒出。',
        'Remove the heat and wait for full drawdown before separating the chambers and serving.',
      ),
    ],
    tip: b(
      '回流慢时检查滤布清洁、细粉和密封，勿强行分离仍有压差的壶体。',
      'For slow drawdown, check filter cleanliness, fines and seals. Never force chambers apart under a pressure difference.',
    ),
    caution: b(
      '这里的时间从加粉算起，不含预热升水。玻璃、明火与温差均需按器具手册操作。',
      'Time starts when grounds are added and excludes heating. Follow the brewer’s manual for glass, flame and temperature changes.',
    ),
    sources: ['hario', 'ucdavis'],
  },
  {
    id: 'cold-brew',
    name: b('冷萃', 'Cold brew'),
    category: 'immersion',
    description: b(
      '用低温与较长接触时间萃取。口感常偏柔和，但“低酸”不等于没有酸，也不是健康效果承诺。',
      'Low temperature and long contact time produce a different extraction. The cup often seems mellow, but “low acid” does not mean acid-free or imply a health benefit.',
    ),
    ratio: 8,
    ratioRange: [6, 16],
    ratioBasis: 'water',
    dose: 50,
    temperature: [2, 4],
    seconds: [43200, 64800],
    grind: b('中粗至粗，方便过滤', 'Medium-coarse to coarse for easier filtration'),
    steps: [
      b(
        '清洁带盖容器，加入咖啡粉和安全饮用冷水。',
        'Clean a lidded container and add grounds and safe cold drinking water.',
      ),
      b(
        '轻搅润湿后加盖，放入 4°C 或以下冰箱。',
        'Stir to wet, cover and place in a refrigerator at 4°C or below.',
      ),
      b(
        '约 12–18 小时后过滤，先用筛网，再用纸滤可减少沉淀。',
        'Filter after about 12–18 hours. A sieve followed by paper can reduce sediment.',
      ),
      b(
        '1:8 为浓缩起点；按喜好加水或奶，记录稀释量并冷藏。',
        '1:8 is a concentrate starting point. Dilute with water or milk to taste, recording the addition, and refrigerate.',
      ),
    ],
    tip: b(
      '浓度不足先检查稀释量和粉水比，再考虑延长时间。颜色深不等于咖啡因更多。',
      'For weak coffee, check dilution and ratio before extending time. A darker color does not establish more caffeine.',
    ),
    caution: b(
      '少量现做、保持冷藏并尽快饮用；本指南不提供商业保质期验证，店铺需采用经验证的食品安全流程。',
      'Make small fresh batches, keep refrigerated and consume promptly. This guide does not validate a commercial shelf life; shops need a validated food-safety process.',
    ),
    sources: ['ucdavis', 'sca-standards'],
  },
  {
    id: 'turkish',
    name: b('土耳其咖啡', 'Turkish coffee'),
    category: 'decoction',
    description: b(
      '极细咖啡粉与水在小壶中一起加热，不过滤，饮用前让细粉沉降。不同地区有不同传统。',
      'Very fine coffee heats with water in a small pot without filtration. Let particles settle before drinking; regional traditions vary.',
    ),
    ratio: 10,
    ratioRange: [8, 12],
    ratioBasis: 'water',
    dose: 7,
    temperature: [90, 96],
    seconds: [120, 240],
    grind: b('极细，接近面粉', 'Very fine, approaching flour'),
    steps: [
      b(
        '按小壶容量加入冷水和极细咖啡粉，需要糖时提前加入。',
        'Add cool water and very fine coffee within pot capacity, adding sugar at the start if desired.',
      ),
      b('开始加热前搅匀，用小火缓慢升温。', 'Mix before heating and warm slowly over low heat.'),
      b(
        '泡沫上升时及时离火，避免剧烈翻滚沸腾或溢出。',
        'Remove from heat as foam rises, avoiding a vigorous rolling boil or overflow.',
      ),
      b(
        '倒入小杯，等待细粉沉降，缓慢品饮并留下杯底沉淀。',
        'Pour into a small cup, let particles settle and sip slowly, leaving the sediment.',
      ),
    ],
    tip: b(
      '水质、糖和香料都需记录。若要训练原始风味，先做无糖无香料对照。',
      'Record water, sugar and spices. To train unmodified flavor perception, begin with an unsweetened, unspiced comparison.',
    ),
    caution: b(
      '温度仅描述接近出杯时的练习范围，泡沫和热源响应更实用；留出壶口空间避免溢出。',
      'Temperature is an approximate near-serving practice range; foam and heat response are more useful cues. Leave headroom to avoid overflow.',
    ),
    sources: ['ucdavis', 'sca-standards'],
  },
  {
    id: 'kalita',
    name: b('平底手冲', 'Flat-bottom pour-over'),
    category: 'filter',
    description: b(
      '平底滤杯让粉床更均匀，出水孔与波纹滤纸共同控制流速。适合对比滤杯几何结构。',
      'A flat bed encourages even depth while drain holes and wave filters shape flow. Useful for comparing brewer geometry.',
    ),
    ratio: 16,
    ratioRange: [14, 18],
    ratioBasis: 'water',
    dose: 20,
    temperature: [90, 96],
    seconds: [180, 240],
    grind: b('中等至中细，按滤杯尺寸调整', 'Medium to medium-fine, adjusted for brewer size'),
    steps: [
      b(
        '装好匹配的滤纸，轻柔冲洗，避免压塌波纹。',
        'Fit matching paper and rinse gently without collapsing the waves.',
      ),
      b(
        '加入咖啡粉并整平，用约两倍粉重的水闷蒸。',
        'Add and level grounds; bloom with about twice their mass in water.',
      ),
      b(
        '小水流分段注水，尽量保持粉床均匀覆盖。',
        'Use small staged pours to keep the bed evenly covered.',
      ),
      b(
        '完成滴滤后混匀，记录总时长和味道，再改变一个变量。',
        'Mix after drawdown, record total time and flavor, then change one variable.',
      ),
    ],
    tip: b(
      '堵塞时先检查滤纸贴底、细粉和搅动量，别只归因于研磨。',
      'For stalling, check paper contact, fines and agitation instead of blaming grind alone.',
    ),
    caution: b(
      '不同平底滤杯的开孔和材质并不相同，配方应在实际器具上校准。',
      'Flat-bottom brewers differ in openings and material. Calibrate the recipe on the actual brewer.',
    ),
    sources: ['ucdavis'],
  },
];
