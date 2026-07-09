/**
 * 内置词库 —— P0 单机版出题来源(P1 可叠加 AI 出题)。
 *
 * 每条为一对易混淆词。difficulty:
 *   1 = 简单(区分度大,如 老虎/狮子)
 *   2 = 困难(非常接近,如 拿铁/卡布奇诺)
 * theme 便于后续按主题筛选。共 200 对(简单 100 + 困难 100)。
 */

const WORD_PAIRS = [
  // ============ 简单 difficulty:1(共 100 对)============
  // ---- 动物 ----
  { civilian: '老虎', undercover: '狮子', difficulty: 1, theme: '动物' },
  { civilian: '猫', undercover: '狗', difficulty: 1, theme: '动物' },
  { civilian: '狼', undercover: '狐狸', difficulty: 1, theme: '动物' },
  { civilian: '马', undercover: '驴', difficulty: 1, theme: '动物' },
  { civilian: '鹰', undercover: '雕', difficulty: 1, theme: '动物' },
  { civilian: '鸭', undercover: '鹅', difficulty: 1, theme: '动物' },
  { civilian: '鲨鱼', undercover: '海豚', difficulty: 1, theme: '动物' },
  { civilian: '兔子', undercover: '松鼠', difficulty: 1, theme: '动物' },
  { civilian: '猴子', undercover: '猩猩', difficulty: 1, theme: '动物' },
  { civilian: '蛇', undercover: '蜥蜴', difficulty: 1, theme: '动物' },
  // ---- 食物 ----
  { civilian: '西瓜', undercover: '冬瓜', difficulty: 1, theme: '食物' },
  { civilian: '包子', undercover: '馒头', difficulty: 1, theme: '食物' },
  { civilian: '面条', undercover: '米粉', difficulty: 1, theme: '食物' },
  { civilian: '饺子', undercover: '馄饨', difficulty: 1, theme: '食物' },
  { civilian: '饼干', undercover: '蛋糕', difficulty: 1, theme: '食物' },
  { civilian: '巧克力', undercover: '糖果', difficulty: 1, theme: '食物' },
  { civilian: '冰淇淋', undercover: '雪糕', difficulty: 1, theme: '食物' },
  { civilian: '面包', undercover: '吐司', difficulty: 1, theme: '食物' },
  { civilian: '果冻', undercover: '布丁', difficulty: 1, theme: '食物' },
  { civilian: '薯片', undercover: '虾条', difficulty: 1, theme: '食物' },
  // ---- 水果 ----
  { civilian: '苹果', undercover: '梨子', difficulty: 1, theme: '水果' },
  { civilian: '桃子', undercover: '李子', difficulty: 1, theme: '水果' },
  { civilian: '橙子', undercover: '柠檬', difficulty: 1, theme: '水果' },
  { civilian: '草莓', undercover: '蓝莓', difficulty: 1, theme: '水果' },
  { civilian: '椰子', undercover: '榴莲', difficulty: 1, theme: '水果' },
  { civilian: '石榴', undercover: '火龙果', difficulty: 1, theme: '水果' },
  { civilian: '哈密瓜', undercover: '香瓜', difficulty: 1, theme: '水果' },
  { civilian: '木瓜', undercover: '芒果', difficulty: 1, theme: '水果' },
  { civilian: '桑葚', undercover: '杨梅', difficulty: 1, theme: '水果' },
  { civilian: '柿子', undercover: '红枣', difficulty: 1, theme: '水果' },
  // ---- 饮品 ----
  { civilian: '咖啡', undercover: '可可', difficulty: 1, theme: '饮品' },
  { civilian: '果汁', undercover: '汽水', difficulty: 1, theme: '饮品' },
  { civilian: '牛奶', undercover: '豆浆', difficulty: 1, theme: '饮品' },
  { civilian: '啤酒', undercover: '白酒', difficulty: 1, theme: '饮品' },
  { civilian: '红酒', undercover: '香槟', difficulty: 1, theme: '饮品' },
  { civilian: '绿茶', undercover: '红茶', difficulty: 1, theme: '饮品' },
  { civilian: '奶茶', undercover: '奶昔', difficulty: 1, theme: '饮品' },
  { civilian: '酸奶', undercover: '乳酸菌', difficulty: 1, theme: '饮品' },
  // ---- 运动 ----
  { civilian: '篮球', undercover: '排球', difficulty: 1, theme: '运动' },
  { civilian: '足球', undercover: '橄榄球', difficulty: 1, theme: '运动' },
  { civilian: '网球', undercover: '羽毛球', difficulty: 1, theme: '运动' },
  { civilian: '游泳', undercover: '跳水', difficulty: 1, theme: '运动' },
  { civilian: '跑步', undercover: '竞走', difficulty: 1, theme: '运动' },
  { civilian: '滑冰', undercover: '滑雪', difficulty: 1, theme: '运动' },
  { civilian: '乒乓球', undercover: '台球', difficulty: 1, theme: '运动' },
  { civilian: '拳击', undercover: '摔跤', difficulty: 1, theme: '运动' },
  { civilian: '射箭', undercover: '射击', difficulty: 1, theme: '运动' },
  { civilian: '骑马', undercover: '赛车', difficulty: 1, theme: '运动' },
  // ---- 交通 ----
  { civilian: '飞机', undercover: '火车', difficulty: 1, theme: '交通' },
  { civilian: '汽车', undercover: '巴士', difficulty: 1, theme: '交通' },
  { civilian: '自行车', undercover: '摩托车', difficulty: 1, theme: '交通' },
  { civilian: '地铁', undercover: '轻轨', difficulty: 1, theme: '交通' },
  { civilian: '直升机', undercover: '滑翔机', difficulty: 1, theme: '交通' },
  { civilian: '帆船', undercover: '游艇', difficulty: 1, theme: '交通' },
  { civilian: '卡车', undercover: '货车', difficulty: 1, theme: '交通' },
  { civilian: '高铁', undercover: '动车', difficulty: 1, theme: '交通' },
  // ---- 乐器 ----
  { civilian: '钢琴', undercover: '电子琴', difficulty: 1, theme: '乐器' },
  { civilian: '吉他', undercover: '贝斯', difficulty: 1, theme: '乐器' },
  { civilian: '小提琴', undercover: '中提琴', difficulty: 1, theme: '乐器' },
  { civilian: '笛子', undercover: '箫', difficulty: 1, theme: '乐器' },
  { civilian: '鼓', undercover: '锣', difficulty: 1, theme: '乐器' },
  { civilian: '琵琶', undercover: '古筝', difficulty: 1, theme: '乐器' },
  { civilian: '萨克斯', undercover: '单簧管', difficulty: 1, theme: '乐器' },
  { civilian: '二胡', undercover: '马头琴', difficulty: 1, theme: '乐器' },
  // ---- 职业 ----
  { civilian: '医生', undercover: '护士', difficulty: 1, theme: '职业' },
  { civilian: '老师', undercover: '教授', difficulty: 1, theme: '职业' },
  { civilian: '警察', undercover: '保安', difficulty: 1, theme: '职业' },
  { civilian: '厨师', undercover: '服务员', difficulty: 1, theme: '职业' },
  { civilian: '画家', undercover: '设计师', difficulty: 1, theme: '职业' },
  { civilian: '歌手', undercover: '演员', difficulty: 1, theme: '职业' },
  { civilian: '律师', undercover: '法官', difficulty: 1, theme: '职业' },
  { civilian: '记者', undercover: '编辑', difficulty: 1, theme: '职业' },
  { civilian: '工程师', undercover: '技术员', difficulty: 1, theme: '职业' },
  { civilian: '药剂师', undercover: '化验员', difficulty: 1, theme: '职业' },
  // ---- 自然 ----
  { civilian: '太阳', undercover: '月亮', difficulty: 1, theme: '自然' },
  { civilian: '山', undercover: '岭', difficulty: 1, theme: '自然' },
  { civilian: '河', undercover: '江', difficulty: 1, theme: '自然' },
  { civilian: '云', undercover: '雾', difficulty: 1, theme: '自然' },
  { civilian: '雨', undercover: '雪', difficulty: 1, theme: '自然' },
  { civilian: '风', undercover: '台风', difficulty: 1, theme: '自然' },
  { civilian: '湖', undercover: '海', difficulty: 1, theme: '自然' },
  { civilian: '森林', undercover: '草原', difficulty: 1, theme: '自然' },
  { civilian: '沙漠', undercover: '戈壁', difficulty: 1, theme: '自然' },
  { civilian: '星星', undercover: '流星', difficulty: 1, theme: '自然' },
  // ---- 日用品 ----
  { civilian: '牙刷', undercover: '牙膏', difficulty: 1, theme: '日用品' },
  { civilian: '毛巾', undercover: '浴巾', difficulty: 1, theme: '日用品' },
  { civilian: '碗', undercover: '盘', difficulty: 1, theme: '日用品' },
  { civilian: '筷子', undercover: '勺子', difficulty: 1, theme: '日用品' },
  { civilian: '枕头', undercover: '靠垫', difficulty: 1, theme: '日用品' },
  { civilian: '杯子', undercover: '水壶', difficulty: 1, theme: '日用品' },
  { civilian: '肥皂', undercover: '洗手液', difficulty: 1, theme: '日用品' },
  { civilian: '梳子', undercover: '镜子', difficulty: 1, theme: '日用品' },
  // ---- 地点 ----
  { civilian: '学校', undercover: '培训机构', difficulty: 1, theme: '地点' },
  { civilian: '医院', undercover: '诊所', difficulty: 1, theme: '地点' },
  { civilian: '超市', undercover: '便利店', difficulty: 1, theme: '地点' },
  { civilian: '餐厅', undercover: '饭店', difficulty: 1, theme: '地点' },
  { civilian: '公园', undercover: '广场', difficulty: 1, theme: '地点' },
  { civilian: '书店', undercover: '文具店', difficulty: 1, theme: '地点' },
  { civilian: '咖啡馆', undercover: '茶馆', difficulty: 1, theme: '地点' },
  { civilian: '健身房', undercover: '体育馆', difficulty: 1, theme: '地点' },

  // ============ 困难 difficulty:2(共 100 对)============
  // ---- 饮品 ----
  { civilian: '拿铁', undercover: '卡布奇诺', difficulty: 2, theme: '饮品' },
  { civilian: '美式', undercover: '冷萃', difficulty: 2, theme: '饮品' },
  { civilian: '浓缩', undercover: '手冲', difficulty: 2, theme: '饮品' },
  { civilian: '龙井', undercover: '碧螺春', difficulty: 2, theme: '饮品' },
  { civilian: '铁观音', undercover: '大红袍', difficulty: 2, theme: '饮品' },
  { civilian: '普洱', undercover: '黑茶', difficulty: 2, theme: '饮品' },
  { civilian: '红茶', undercover: '乌龙', difficulty: 2, theme: '饮品' },
  { civilian: '茉莉花茶', undercover: '菊花茶', difficulty: 2, theme: '饮品' },
  { civilian: '清酒', undercover: '烧酒', difficulty: 2, theme: '饮品' },
  { civilian: '米酒', undercover: '黄酒', difficulty: 2, theme: '饮品' },
  { civilian: '香槟', undercover: '起泡酒', difficulty: 2, theme: '饮品' },
  { civilian: '威士忌', undercover: '白兰地', difficulty: 2, theme: '饮品' },
  { civilian: '伏特加', undercover: '金酒', difficulty: 2, theme: '饮品' },
  { civilian: '朗姆', undercover: '龙舌兰', difficulty: 2, theme: '饮品' },
  { civilian: '气泡水', undercover: '苏打水', difficulty: 2, theme: '饮品' },
  // ---- 食物 ----
  { civilian: '包子', undercover: '饺子', difficulty: 2, theme: '食物' },
  { civilian: '馄饨', undercover: '抄手', difficulty: 2, theme: '食物' },
  { civilian: '烧麦', undercover: '蒸饺', difficulty: 2, theme: '食物' },
  { civilian: '煎饺', undercover: '锅贴', difficulty: 2, theme: '食物' },
  { civilian: '拉面', undercover: '刀削面', difficulty: 2, theme: '食物' },
  { civilian: '意面', undercover: '通心粉', difficulty: 2, theme: '食物' },
  { civilian: '米粉', undercover: '河粉', difficulty: 2, theme: '食物' },
  { civilian: '春卷', undercover: '蛋卷', difficulty: 2, theme: '食物' },
  { civilian: '煎饼', undercover: '鸡蛋饼', difficulty: 2, theme: '食物' },
  { civilian: '汤圆', undercover: '元宵', difficulty: 2, theme: '食物' },
  { civilian: '粽子', undercover: '年糕', difficulty: 2, theme: '食物' },
  { civilian: '烧饼', undercover: '火烧', difficulty: 2, theme: '食物' },
  { civilian: '麻花', undercover: '油条', difficulty: 2, theme: '食物' },
  { civilian: '凉皮', undercover: '凉面', difficulty: 2, theme: '食物' },
  { civilian: '螺蛳粉', undercover: '酸辣粉', difficulty: 2, theme: '食物' },
  // ---- 水果 ----
  { civilian: '橘子', undercover: '橙子', difficulty: 2, theme: '水果' },
  { civilian: '提子', undercover: '葡萄', difficulty: 2, theme: '水果' },
  { civilian: '樱桃', undercover: '车厘子', difficulty: 2, theme: '水果' },
  { civilian: '猕猴桃', undercover: '奇异果', difficulty: 2, theme: '水果' },
  { civilian: '菠萝', undercover: '凤梨', difficulty: 2, theme: '水果' },
  { civilian: '柚子', undercover: '西柚', difficulty: 2, theme: '水果' },
  { civilian: '香蕉', undercover: '芭蕉', difficulty: 2, theme: '水果' },
  { civilian: '龙眼', undercover: '荔枝', difficulty: 2, theme: '水果' },
  { civilian: '蓝莓', undercover: '黑莓', difficulty: 2, theme: '水果' },
  { civilian: '树莓', undercover: '草莓', difficulty: 2, theme: '水果' },
  // ---- 动物 ----
  { civilian: '老虎', undercover: '豹子', difficulty: 2, theme: '动物' },
  { civilian: '狮子', undercover: '豹', difficulty: 2, theme: '动物' },
  { civilian: '狼', undercover: '豺', difficulty: 2, theme: '动物' },
  { civilian: '狐狸', undercover: '貉', difficulty: 2, theme: '动物' },
  { civilian: '鹿', undercover: '麋鹿', difficulty: 2, theme: '动物' },
  { civilian: '猴子', undercover: '猿', difficulty: 2, theme: '动物' },
  { civilian: '海豹', undercover: '海狮', difficulty: 2, theme: '动物' },
  { civilian: '鳄鱼', undercover: '蜥蜴', difficulty: 2, theme: '动物' },
  { civilian: '鲨鱼', undercover: '鲸鱼', difficulty: 2, theme: '动物' },
  { civilian: '章鱼', undercover: '鱿鱼', difficulty: 2, theme: '动物' },
  // ---- 美妆 ----
  { civilian: '眉笔', undercover: '眼线笔', difficulty: 2, theme: '美妆' },
  { civilian: '唇釉', undercover: '唇蜜', difficulty: 2, theme: '美妆' },
  { civilian: '粉底液', undercover: 'BB霜', difficulty: 2, theme: '美妆' },
  { civilian: '遮瑕', undercover: '修容', difficulty: 2, theme: '美妆' },
  { civilian: '腮红', undercover: '高光', difficulty: 2, theme: '美妆' },
  { civilian: '散粉', undercover: '定妆粉', difficulty: 2, theme: '美妆' },
  { civilian: '口红', undercover: '唇彩', difficulty: 2, theme: '美妆' },
  { civilian: '香水', undercover: '古龙水', difficulty: 2, theme: '美妆' },
  { civilian: '精华', undercover: '原液', difficulty: 2, theme: '美妆' },
  { civilian: '面霜', undercover: '乳液', difficulty: 2, theme: '美妆' },
  // ---- 应用/品牌 ----
  { civilian: '微信', undercover: 'QQ', difficulty: 2, theme: '应用' },
  { civilian: '微博', undercover: '小红书', difficulty: 2, theme: '应用' },
  { civilian: '知乎', undercover: '豆瓣', difficulty: 2, theme: '应用' },
  { civilian: '淘宝', undercover: '天猫', difficulty: 2, theme: '应用' },
  { civilian: '京东', undercover: '拼多多', difficulty: 2, theme: '应用' },
  { civilian: '美团', undercover: '饿了么', difficulty: 2, theme: '应用' },
  { civilian: '抖音', undercover: '快手', difficulty: 2, theme: '应用' },
  { civilian: 'B站', undercover: '西瓜视频', difficulty: 2, theme: '应用' },
  { civilian: '网易云', undercover: 'QQ音乐', difficulty: 2, theme: '应用' },
  { civilian: '高德', undercover: '百度地图', difficulty: 2, theme: '应用' },
  // ---- 服装 ----
  { civilian: '西装', undercover: '礼服', difficulty: 2, theme: '服装' },
  { civilian: '风衣', undercover: '大衣', difficulty: 2, theme: '服装' },
  { civilian: '毛衣', undercover: '针织衫', difficulty: 2, theme: '服装' },
  { civilian: '衬衫', undercover: '雪纺衫', difficulty: 2, theme: '服装' },
  { civilian: '卫衣', undercover: '帽衫', difficulty: 2, theme: '服装' },
  { civilian: '牛仔裤', undercover: '休闲裤', difficulty: 2, theme: '服装' },
  { civilian: '短裙', undercover: '百褶裙', difficulty: 2, theme: '服装' },
  { civilian: '皮鞋', undercover: '乐福鞋', difficulty: 2, theme: '服装' },
  { civilian: '运动鞋', undercover: '板鞋', difficulty: 2, theme: '服装' },
  { civilian: '靴子', undercover: '马丁靴', difficulty: 2, theme: '服装' },
  // ---- 家具/家居 ----
  { civilian: '沙发', undercover: '躺椅', difficulty: 2, theme: '家居' },
  { civilian: '扶手椅', undercover: '单人沙发', difficulty: 2, theme: '家居' },
  { civilian: '书架', undercover: '置物架', difficulty: 2, theme: '家居' },
  { civilian: '床头柜', undercover: '梳妆台', difficulty: 2, theme: '家居' },
  { civilian: '餐桌', undercover: '茶几', difficulty: 2, theme: '家居' },
  { civilian: '台灯', undercover: '落地灯', difficulty: 2, theme: '家居' },
  { civilian: '窗帘', undercover: '百叶窗', difficulty: 2, theme: '家居' },
  { civilian: '地毯', undercover: '地垫', difficulty: 2, theme: '家居' },
  // ---- 地点 ----
  { civilian: '酒吧', undercover: '酒馆', difficulty: 2, theme: '地点' },
  { civilian: '书店', undercover: '图书馆', difficulty: 2, theme: '地点' },
  { civilian: '餐厅', undercover: '食堂', difficulty: 2, theme: '地点' },
  { civilian: '宾馆', undercover: '旅馆', difficulty: 2, theme: '地点' },
  { civilian: '画廊', undercover: '美术馆', difficulty: 2, theme: '地点' },
  { civilian: '健身房', undercover: '瑜伽馆', difficulty: 2, theme: '地点' },
  { civilian: '超市', undercover: '仓储店', difficulty: 2, theme: '地点' },
  { civilian: '茶馆', undercover: '茶楼', difficulty: 2, theme: '地点' },
  // ---- 职业/身份 ----
  { civilian: '画家', undercover: '插画师', difficulty: 2, theme: '职业' },
  { civilian: '作家', undercover: '编剧', difficulty: 2, theme: '职业' },
  { civilian: '歌手', undercover: '声乐家', difficulty: 2, theme: '职业' },
  { civilian: '导演', undercover: '制片', difficulty: 2, theme: '职业' }
]

/**
 * 按难度随机抽一对词。difficulty 传 0 表示不限难度(混合)。
 * @param {number} difficulty 0|1|2
 * @returns {{civilian:string, undercover:string, difficulty:number, theme:string}}
 */
export function drawPair(difficulty) {
  let pool = WORD_PAIRS
  if (difficulty === 1 || difficulty === 2) {
    pool = WORD_PAIRS.filter((p) => p.difficulty === difficulty)
  }
  if (pool.length === 0) pool = WORD_PAIRS
  const idx = Math.floor(Math.random() * pool.length)
  return pool[idx]
}

export default { drawPair }
