/* =========================================================
   XG FAN CARD STUDIO — 交互逻辑
   结构：入口层 → 照片墙（单张 / 网格 / 索引）→ 做卡台 → 下载分享
   ========================================================= */

/* ---------- 数据 ---------- */
const MEMBERS = [
  { id:'jurin',  name:'Jurin'  },
  { id:'chisa',  name:'Chisa'  },
  { id:'hinata', name:'Hinata' },
  { id:'juria',  name:'Juria'  },
  { id:'maya',   name:'Maya'   },
  { id:'cocona', name:'Cocona' },
  { id:'harvey', name:'Harvey' }
];

/* 套系分类：内容类型 —— 目前是占位套系，换真实套系只改这里 */
const COLLECTIONS = [
  { id:'stage', place:'STAGE LOOKS', base:['#5b2a7a','#7a2456','#3a2a78','#82206a','#4a2178','#6b2a6b','#332a82'], c2:'#ff3ea5' },
  { id:'mv',    place:'MV LOOKS',    base:['#8a5330','#94582f','#7a4a2a','#8f5730','#83512b','#71482a','#8e5433'], c2:'#ffb46b' },
  { id:'diary', place:'DIARY',       base:['#1f6b78','#227385','#1c6270','#256f7d','#1e6a76','#1a6070','#236e80'], c2:'#5ce1ff' },
  { id:'brand', place:'BRAND',       base:['#3d3a7a','#4a3570','#2f3676','#513a72','#3a3d80','#44346e','#333a78'], c2:'#a78bfa' }
];

/* 真实照片：按「套系 -> 成员 -> 文件列表」挂载。
   列表内顺序 = 展示顺序（照片墙 / 卡池 / 编号都按这个顺序走）。
   顺序已按「同一成员内视觉相近（服装 / 背景 / 色调）成组」重排：
   每张图缩到 8x11 的 Lab 色彩网格 -> 标准化 -> k-means 分组 -> 组间贪心链排序。
   没有真实照片的成员仍用占位图（src:null）。目前 MV LOOKS 85 张 + STAGE LOOKS 86 张。 */
const PHOTO_FILES = {
  stage: {
    jurin  : ['assets/photos/stage-jurin-01.jpg', 'assets/photos/stage-jurin-02.jpg', 'assets/photos/stage-jurin-03.jpg', 'assets/photos/stage-jurin-04.jpg', 'assets/photos/stage-jurin-05.jpg', 'assets/photos/stage-jurin-06.jpg', 'assets/photos/stage-jurin-07.jpg', 'assets/photos/stage-jurin-08.jpg', 'assets/photos/stage-jurin-09.jpg', 'assets/photos/stage-jurin-10.jpg', 'assets/photos/stage-jurin-11.jpg'],
    chisa  : ['assets/photos/stage-chisa-01.jpg', 'assets/photos/stage-chisa-02.jpg', 'assets/photos/stage-chisa-03.jpg', 'assets/photos/stage-chisa-04.jpg', 'assets/photos/stage-chisa-05.jpg', 'assets/photos/stage-chisa-06.jpg', 'assets/photos/stage-chisa-07.jpg', 'assets/photos/stage-chisa-08.jpg', 'assets/photos/stage-chisa-09.jpg', 'assets/photos/stage-chisa-10.jpg', 'assets/photos/stage-chisa-11.jpg', 'assets/photos/stage-chisa-12.jpg', 'assets/photos/stage-chisa-13.jpg', 'assets/photos/stage-chisa-14.jpg'],
    hinata : ['assets/photos/stage-hinata-01.jpg', 'assets/photos/stage-hinata-02.jpg', 'assets/photos/stage-hinata-03.jpg', 'assets/photos/stage-hinata-04.jpg', 'assets/photos/stage-hinata-05.jpg', 'assets/photos/stage-hinata-06.jpg', 'assets/photos/stage-hinata-07.jpg', 'assets/photos/stage-hinata-08.jpg', 'assets/photos/stage-hinata-09.jpg', 'assets/photos/stage-hinata-10.jpg', 'assets/photos/stage-hinata-11.jpg', 'assets/photos/stage-hinata-12.jpg', 'assets/photos/stage-hinata-13.jpg', 'assets/photos/stage-hinata-14.jpg', 'assets/photos/stage-hinata-15.jpg', 'assets/photos/stage-hinata-16.jpg', 'assets/photos/stage-hinata-17.jpg', 'assets/photos/stage-hinata-18.jpg', 'assets/photos/stage-hinata-19.jpg', 'assets/photos/stage-hinata-20.jpg', 'assets/photos/stage-hinata-21.jpg', 'assets/photos/stage-hinata-22.jpg', 'assets/photos/stage-hinata-23.jpg', 'assets/photos/stage-hinata-24.jpg', 'assets/photos/stage-hinata-25.jpg', 'assets/photos/stage-hinata-26.jpg', 'assets/photos/stage-hinata-27.jpg'],
    juria  : ['assets/photos/stage-juria-01.jpg', 'assets/photos/stage-juria-02.jpg', 'assets/photos/stage-juria-03.jpg', 'assets/photos/stage-juria-04.jpg', 'assets/photos/stage-juria-05.jpg', 'assets/photos/stage-juria-06.jpg', 'assets/photos/stage-juria-07.jpg', 'assets/photos/stage-juria-08.jpg', 'assets/photos/stage-juria-09.jpg', 'assets/photos/stage-juria-10.jpg', 'assets/photos/stage-juria-11.jpg', 'assets/photos/stage-juria-12.jpg', 'assets/photos/stage-juria-13.jpg', 'assets/photos/stage-juria-14.jpg'],
    maya   : ['assets/photos/stage-maya-01.jpg', 'assets/photos/stage-maya-02.jpg', 'assets/photos/stage-maya-03.jpg', 'assets/photos/stage-maya-04.jpg', 'assets/photos/stage-maya-05.jpg'],
    cocona : ['assets/photos/stage-cocona-01.jpg', 'assets/photos/stage-cocona-02.jpg', 'assets/photos/stage-cocona-03.jpg', 'assets/photos/stage-cocona-04.jpg', 'assets/photos/stage-cocona-05.jpg', 'assets/photos/stage-cocona-06.jpg', 'assets/photos/stage-cocona-07.jpg'],
    harvey : ['assets/photos/stage-harvey-01.jpg', 'assets/photos/stage-harvey-02.jpg', 'assets/photos/stage-harvey-03.jpg', 'assets/photos/stage-harvey-04.jpg', 'assets/photos/stage-harvey-05.jpg', 'assets/photos/stage-harvey-06.jpg', 'assets/photos/stage-harvey-07.jpg', 'assets/photos/stage-harvey-08.jpg']
  },
  mv: {
    jurin  : ['assets/photos/mv-jurin-10.jpg', 'assets/photos/mv-jurin-15.jpg', 'assets/photos/mv-jurin-04.jpg', 'assets/photos/mv-jurin-12.jpg', 'assets/photos/mv-jurin-05.jpg', 'assets/photos/mv-jurin-02.jpg', 'assets/photos/mv-jurin-11.jpg', 'assets/photos/mv-jurin-08.jpg', 'assets/photos/mv-jurin-17.jpg', 'assets/photos/mv-jurin-06.jpg', 'assets/photos/mv-jurin-13.jpg', 'assets/photos/mv-jurin-14.jpg', 'assets/photos/mv-jurin-07.jpg', 'assets/photos/mv-jurin-09.jpg', 'assets/photos/mv-jurin-03.jpg'],
    chisa  : ['assets/photos/mv-chisa-03.jpg', 'assets/photos/mv-chisa-02.jpg', 'assets/photos/mv-chisa-05.jpg', 'assets/photos/mv-chisa-01.jpg', 'assets/photos/mv-chisa-08.jpg', 'assets/photos/mv-chisa-06.jpg', 'assets/photos/mv-chisa-07.jpg', 'assets/photos/mv-chisa-04.jpg', 'assets/photos/mv-chisa-09.jpg', 'assets/photos/mv-chisa-10.jpg'],
    hinata : ['assets/photos/mv-hinata-06.jpg', 'assets/photos/mv-hinata-02.jpg', 'assets/photos/mv-hinata-07.jpg', 'assets/photos/mv-hinata-01.jpg', 'assets/photos/mv-hinata-03.jpg', 'assets/photos/mv-hinata-04.jpg', 'assets/photos/mv-hinata-05.jpg', 'assets/photos/mv-hinata-08.jpg'],
    juria  : ['assets/photos/mv-juria-10.jpg', 'assets/photos/mv-juria-07.jpg', 'assets/photos/mv-juria-13.jpg', 'assets/photos/mv-juria-11.jpg', 'assets/photos/mv-juria-05.jpg', 'assets/photos/mv-juria-04.jpg', 'assets/photos/mv-juria-01.jpg', 'assets/photos/mv-juria-08.jpg', 'assets/photos/mv-juria-02.jpg', 'assets/photos/mv-juria-03.jpg', 'assets/photos/mv-juria-12.jpg', 'assets/photos/mv-juria-06.jpg', 'assets/photos/mv-juria-09.jpg'],
    maya   : ['assets/photos/mv-maya-01.jpg', 'assets/photos/mv-maya-06.jpg', 'assets/photos/mv-maya-09.jpg', 'assets/photos/mv-maya-04.jpg', 'assets/photos/mv-maya-02.jpg', 'assets/photos/mv-maya-07.jpg', 'assets/photos/mv-maya-05.jpg', 'assets/photos/mv-maya-03.jpg', 'assets/photos/mv-maya-08.jpg'],
    cocona : ['assets/photos/mv-cocona-09.jpg', 'assets/photos/mv-cocona-07.jpg', 'assets/photos/mv-cocona-06.jpg', 'assets/photos/mv-cocona-05.jpg', 'assets/photos/mv-cocona-08.jpg', 'assets/photos/mv-cocona-03.jpg', 'assets/photos/mv-cocona-01.jpg', 'assets/photos/mv-cocona-04.jpg', 'assets/photos/mv-cocona-02.jpg'],
    harvey : ['assets/photos/mv-harvey-07.jpg', 'assets/photos/mv-harvey-09.jpg', 'assets/photos/mv-harvey-12.jpg', 'assets/photos/mv-harvey-11.jpg', 'assets/photos/mv-harvey-15.jpg', 'assets/photos/mv-harvey-14.jpg', 'assets/photos/mv-harvey-04.jpg', 'assets/photos/mv-harvey-08.jpg', 'assets/photos/mv-harvey-22.jpg', 'assets/photos/mv-harvey-01.jpg', 'assets/photos/mv-harvey-19.jpg', 'assets/photos/mv-harvey-16.jpg', 'assets/photos/mv-harvey-05.jpg', 'assets/photos/mv-harvey-18.jpg', 'assets/photos/mv-harvey-06.jpg', 'assets/photos/mv-harvey-10.jpg', 'assets/photos/mv-harvey-03.jpg', 'assets/photos/mv-harvey-21.jpg', 'assets/photos/mv-harvey-20.jpg', 'assets/photos/mv-harvey-02.jpg', 'assets/photos/mv-harvey-13.jpg']
  }
};

/* 二级分类 = 照片的 MV 出处（对应 分类\MVlooks\<成员>\<分类>\ 文件夹）。
   只用于 INDEX 左下角的出处标注，不参与照片排序。 */
const MV_CAT_FILES = {
  'HYPNOTIZE'     : [
    'assets/photos/mv-jurin-04.jpg', 'assets/photos/mv-jurin-05.jpg',
    'assets/photos/mv-jurin-06.jpg', 'assets/photos/mv-jurin-10.jpg',
    'assets/photos/mv-jurin-12.jpg', 'assets/photos/mv-jurin-13.jpg',
    'assets/photos/mv-jurin-14.jpg', 'assets/photos/mv-jurin-15.jpg',
    'assets/photos/mv-chisa-02.jpg', 'assets/photos/mv-chisa-03.jpg',
    'assets/photos/mv-chisa-05.jpg', 'assets/photos/mv-hinata-01.jpg',
    'assets/photos/mv-hinata-02.jpg', 'assets/photos/mv-hinata-03.jpg',
    'assets/photos/mv-hinata-04.jpg', 'assets/photos/mv-hinata-06.jpg',
    'assets/photos/mv-hinata-07.jpg', 'assets/photos/mv-juria-01.jpg',
    'assets/photos/mv-juria-04.jpg', 'assets/photos/mv-juria-06.jpg',
    'assets/photos/mv-juria-08.jpg', 'assets/photos/mv-juria-09.jpg',
    'assets/photos/mv-juria-12.jpg', 'assets/photos/mv-maya-02.jpg',
    'assets/photos/mv-maya-03.jpg', 'assets/photos/mv-maya-04.jpg', 'assets/photos/mv-maya-05.jpg',
    'assets/photos/mv-maya-07.jpg', 'assets/photos/mv-maya-08.jpg',
    'assets/photos/mv-cocona-03.jpg', 'assets/photos/mv-cocona-05.jpg',
    'assets/photos/mv-cocona-06.jpg', 'assets/photos/mv-cocona-07.jpg',
    'assets/photos/mv-cocona-08.jpg', 'assets/photos/mv-cocona-09.jpg',
    'assets/photos/mv-harvey-03.jpg', 'assets/photos/mv-harvey-06.jpg',
    'assets/photos/mv-harvey-10.jpg', 'assets/photos/mv-harvey-18.jpg',
    'assets/photos/mv-harvey-20.jpg', 'assets/photos/mv-harvey-21.jpg',
    'assets/photos/mv-chisa-04.jpg', 'assets/photos/mv-chisa-09.jpg',
    'assets/photos/mv-chisa-10.jpg'
  ],
  'O.R.B'         : [
    'assets/photos/mv-jurin-02.jpg', 'assets/photos/mv-jurin-03.jpg',
    'assets/photos/mv-jurin-07.jpg', 'assets/photos/mv-jurin-08.jpg',
    'assets/photos/mv-jurin-09.jpg', 'assets/photos/mv-jurin-11.jpg',
    'assets/photos/mv-jurin-17.jpg', 'assets/photos/mv-chisa-01.jpg',
    'assets/photos/mv-chisa-06.jpg', 'assets/photos/mv-chisa-07.jpg',
    'assets/photos/mv-chisa-08.jpg', 'assets/photos/mv-hinata-05.jpg',
    'assets/photos/mv-hinata-08.jpg', 'assets/photos/mv-juria-02.jpg',
    'assets/photos/mv-juria-03.jpg', 'assets/photos/mv-maya-01.jpg',
    'assets/photos/mv-maya-06.jpg', 'assets/photos/mv-maya-09.jpg',
    'assets/photos/mv-cocona-01.jpg', 'assets/photos/mv-cocona-02.jpg',
    'assets/photos/mv-cocona-04.jpg', 'assets/photos/mv-harvey-02.jpg',
    'assets/photos/mv-harvey-05.jpg', 'assets/photos/mv-harvey-13.jpg',
    'assets/photos/mv-harvey-16.jpg', 'assets/photos/mv-harvey-19.jpg'
  ],
  'ROCK THE BOAT' : [
    'assets/photos/mv-harvey-04.jpg', 'assets/photos/mv-harvey-07.jpg',
    'assets/photos/mv-harvey-08.jpg', 'assets/photos/mv-harvey-09.jpg',
    'assets/photos/mv-harvey-11.jpg', 'assets/photos/mv-harvey-12.jpg',
    'assets/photos/mv-harvey-14.jpg', 'assets/photos/mv-harvey-15.jpg',
    'assets/photos/mv-harvey-22.jpg'
  ],
  'NO GOOD'       : [
    'assets/photos/mv-juria-05.jpg', 'assets/photos/mv-juria-07.jpg',
    'assets/photos/mv-juria-10.jpg', 'assets/photos/mv-juria-11.jpg',
    'assets/photos/mv-juria-13.jpg'
  ],
  'GALA'          : [
    'assets/photos/mv-harvey-01.jpg'
  ]
};
const MV_CAT_OF = {};
Object.keys(MV_CAT_FILES).forEach(c => MV_CAT_FILES[c].forEach(src => { MV_CAT_OF[src] = c; }));
const STAGE_CAT_FILES = {
  'AUSTRALIA'           : [
    'assets/photos/stage-chisa-01.jpg', 'assets/photos/stage-chisa-02.jpg',
    'assets/photos/stage-chisa-03.jpg', 'assets/photos/stage-chisa-04.jpg'
  ],
  'BANGKOK'             : [
    'assets/photos/stage-harvey-01.jpg', 'assets/photos/stage-harvey-02.jpg',
    'assets/photos/stage-harvey-03.jpg', 'assets/photos/stage-harvey-04.jpg',
    'assets/photos/stage-harvey-05.jpg', 'assets/photos/stage-harvey-06.jpg',
    'assets/photos/stage-juria-01.jpg', 'assets/photos/stage-juria-02.jpg'
  ],
  'FUJI ROCK'           : [
    'assets/photos/stage-juria-03.jpg', 'assets/photos/stage-juria-04.jpg',
    'assets/photos/stage-juria-05.jpg', 'assets/photos/stage-juria-06.jpg',
    'assets/photos/stage-juria-07.jpg', 'assets/photos/stage-juria-08.jpg',
    'assets/photos/stage-maya-01.jpg', 'assets/photos/stage-maya-02.jpg'
  ],
  'FUKUOKA'             : [
    'assets/photos/stage-hinata-01.jpg', 'assets/photos/stage-hinata-02.jpg',
    'assets/photos/stage-hinata-03.jpg', 'assets/photos/stage-hinata-04.jpg',
    'assets/photos/stage-hinata-05.jpg', 'assets/photos/stage-hinata-06.jpg',
    'assets/photos/stage-hinata-07.jpg', 'assets/photos/stage-hinata-08.jpg',
    'assets/photos/stage-hinata-09.jpg', 'assets/photos/stage-hinata-10.jpg',
    'assets/photos/stage-hinata-11.jpg', 'assets/photos/stage-hinata-12.jpg',
    'assets/photos/stage-jurin-01.jpg', 'assets/photos/stage-jurin-02.jpg',
    'assets/photos/stage-jurin-03.jpg', 'assets/photos/stage-jurin-04.jpg',
    'assets/photos/stage-jurin-05.jpg', 'assets/photos/stage-jurin-06.jpg',
    'assets/photos/stage-jurin-07.jpg', 'assets/photos/stage-jurin-08.jpg'
  ],
  'HEADIN THE CLOUDS'   : [
    'assets/photos/stage-chisa-05.jpg', 'assets/photos/stage-chisa-06.jpg',
    'assets/photos/stage-chisa-07.jpg', 'assets/photos/stage-chisa-08.jpg',
    'assets/photos/stage-chisa-09.jpg', 'assets/photos/stage-chisa-10.jpg',
    'assets/photos/stage-chisa-11.jpg', 'assets/photos/stage-cocona-01.jpg',
    'assets/photos/stage-cocona-02.jpg', 'assets/photos/stage-cocona-03.jpg',
    'assets/photos/stage-cocona-04.jpg', 'assets/photos/stage-harvey-07.jpg',
    'assets/photos/stage-harvey-08.jpg', 'assets/photos/stage-hinata-13.jpg',
    'assets/photos/stage-hinata-14.jpg', 'assets/photos/stage-hinata-15.jpg',
    'assets/photos/stage-hinata-16.jpg', 'assets/photos/stage-hinata-17.jpg',
    'assets/photos/stage-hinata-18.jpg', 'assets/photos/stage-hinata-19.jpg',
    'assets/photos/stage-hinata-20.jpg', 'assets/photos/stage-juria-09.jpg',
    'assets/photos/stage-juria-10.jpg', 'assets/photos/stage-jurin-09.jpg',
    'assets/photos/stage-jurin-10.jpg'
  ],
  'HONGKONG'            : [
    'assets/photos/stage-hinata-21.jpg'
  ],
  'HONG KONG'           : [
    'assets/photos/stage-maya-03.jpg'
  ],
  'LONDON'              : [
    'assets/photos/stage-cocona-05.jpg', 'assets/photos/stage-cocona-06.jpg',
    'assets/photos/stage-juria-11.jpg', 'assets/photos/stage-juria-12.jpg',
    'assets/photos/stage-juria-13.jpg', 'assets/photos/stage-juria-14.jpg'
  ],
  'MANILA'              : [
    'assets/photos/stage-hinata-22.jpg', 'assets/photos/stage-hinata-23.jpg',
    'assets/photos/stage-hinata-24.jpg', 'assets/photos/stage-hinata-25.jpg'
  ],
  'ROCK IN JAPAN'       : [
    'assets/photos/stage-chisa-12.jpg', 'assets/photos/stage-chisa-13.jpg',
    'assets/photos/stage-chisa-14.jpg', 'assets/photos/stage-hinata-26.jpg',
    'assets/photos/stage-hinata-27.jpg'
  ],
  'SENDAI'              : [
    'assets/photos/stage-maya-04.jpg', 'assets/photos/stage-maya-05.jpg'
  ]
};
Object.keys(STAGE_CAT_FILES).forEach(c => STAGE_CAT_FILES[c].forEach(src => { MV_CAT_OF[src] = c; }));

const PHOTOS = [];
COLLECTIONS.forEach(c => MEMBERS.forEach((m, mi) => {
  const files = (PHOTO_FILES[c.id] && PHOTO_FILES[c.id][m.id]) || [];
  const list = files.length ? files : [null];
  list.forEach((src, k) => PHOTOS.push({
    id: c.id + '-' + m.id + '-' + String(k + 1).padStart(2, '0'),
    member: m.name, memberId: m.id,
    collection: c.id, collectionLabel: c.place,
    place: c.place,
    c1: c.base[mi], c2: c.c2, src: src, cat: MV_CAT_OF[src] || '', custom: false
  }));
}));

/* 卡框一律用贴图实现：这里是「选项 id -> 贴图路径」的映射，具体贴图后续再补。
   例：{ chrome: 'assets/frames/chrome.webp' } */
const CORES = [];
const CORE_FRAMES = {};

/* 贴纸：全部从 Frame示例 抠出（去白底 -> 透明 PNG）。
   cat = 分类；w = 贴纸宽度占卡片宽度的比例；
   src = 本体（256px，贴到卡片上才加载）；thumb = 侧边栏缩略图（96px） */
const CATEGORIES = [
  { id:'XG',    name:'XG' },
  { id:'METAL', name:'METAL' },
  { id:'PIXEL', name:'PIXEL' },
  { id:'STEAM', name:'STEAM' }
];
const STICKER_DATA = [
  ['xg01','XG GRADIENT','XG',0.3],
  ['xg02','GALA','XG',0.3],
  ['xg03','XG INK','XG',0.352],
  ['xg04','XG GOLD','XG',0.3],
  ['xg05','XG EYE','XG',0.3],
  ['xg06','XG STAR','XG',0.3],
  ['xg07','XG MILION','XG',0.3],
  ['st01','PIXEL CURSOR','PIXEL',0.3],
  ['st02','ALIEN','METAL',0.285],
  ['st03','CLAW','METAL',0.3],
  ['st04','HEART LOCK','METAL',0.3],
  ['st09','FLIP PHONE','METAL',0.3],
  ['st11','PIXEL LIPSTICK','PIXEL',0.392],
  ['st12','FROG','METAL',0.3],
  ['st13','NOTE','METAL',0.3],
  ['st14','PIXEL HEEL','PIXEL',0.38],
  ['st15','PIXEL BUTTON','PIXEL',0.3],
  ['st16','PIXEL HEART','PIXEL',0.3],
  ['st17','METEOR SHOWER','METAL',0.3],
  ['st18','PIXEL GIRL','PIXEL',0.3],
  ['st19','MEGAPHONE','METAL',0.3],
  ['st20','CAMERA','METAL',0.3],
  ['st21','CD','METAL',0.3],
  ['st22','PIXEL NAILS','PIXEL',0.3],
  ['st23','NAIL ART','STEAM',0.3],
  ['st24','PIXEL RAINBOW','PIXEL',0.358],
  ['st25','NOTE II','METAL',0.32],
  ['st26','OOPS','METAL',0.3],
  ['st27','PIXEL MIRROR','PIXEL',0.3],
  ['st28','WOW','METAL',0.3],
  ['st29','BLUEBERRY','STEAM',0.388],
  ['st30','CANDY','METAL',0.396],
  ['st31','CD NOTE','METAL',0.3],
  ['st32','ICE CREAM','STEAM',0.223],
  ['st33','BOLT','METAL',0.373],
  ['st34','CHERRY','METAL',0.3],
  ['st35','CHROME EYE','METAL',0.396],
  ['st36','CASSETTE','METAL',0.3],
  ['st37','CHROME BRANCH','METAL',0.274],
  ['st38','MOON & STARS','METAL',0.293],
  ['st39','BLUE ORNAMENT','METAL',0.369],
  ['st40','RED LINES','METAL',0.335],
  ['st41','EYE','METAL',0.3],
  ['st42','WINGS','METAL',0.3],
  ['st43','FLAMES','METAL',0.3],
  ['st46','BLUE BOLT','METAL',0.335],
  ['st47','CUPCAKE','STEAM',0.331],
  ['st48','STRAWBERRY','STEAM',0.3],
  ['st49','LOLLIPOP','STEAM',0.251],
  ['st50','CHROME BOLT','METAL',0.297],
  ['st51','GHOST','METAL',0.234],
  ['st52','SHOOTING STAR','METAL',0.384],
  ['st53','SUN DISK','METAL',0.3],
  ['st54','CHERRY PULSE','STEAM',0.3],
  ['st55','CHROME ROSE','METAL',0.3],
  ['st56','PHONE','METAL',0.287],
  ['st57','TRIBAL FRAME','METAL',0.331],
  ['st58','TRIBAL CHROME','METAL',0.325],
  ['st60','PINK LOLLIPOP','METAL',0.23],
  ['st61','RETRO PHONE','METAL',0.223],
  ['st62','RETRO CAM','METAL',0.3],
  ['st63','STAR BURST','METAL',0.3]
];
const STICKERS = STICKER_DATA.map(function(row){
  return {
    id: row[0], name: row[1], cat: row[2], w: row[3],
    x: 0.5, y: 0.5,
    src: 'assets/stickers/' + row[0] + '.png',
    thumb: 'assets/stickers/thumb/' + row[0] + '.png'
  };
});
const stickerDef = id => STICKERS.find(s => s.id === id) || null;const MATERIALS = [
  { id:'chrome',   name:'CHROME' },
  { id:'resin',    name:'RESIN' },
  { id:'hologram', name:'HOLOGRAM' },
  { id:'glass',    name:'GLASS' }
];
/* 03 GRAPHIC LAYER：用真实贴图 + 正片叠底（multiply）叠在卡片上。
   素材来自 Frame示例\layer，已做「黑底反相 + 白底归一化」处理，保证白=不变、暗=压暗 */
const GRAPHICS = [
  { id:'wave',    name:'WAVE' },
  { id:'collage', name:'COLLAGE' },
  { id:'lines',   name:'LINES' },
  { id:'burst',   name:'BURST' },
  { id:'dots',    name:'DOTS' },
  { id:'swirl',   name:'SWIRL' },
  { id:'stars',   name:'STARS' }
];
const LAYERS = {
  wave:    'assets/layers/wave.jpg',
  collage: 'assets/layers/collage.jpg',
  lines:   'assets/layers/lines.jpg',
  burst:   'assets/layers/burst.jpg',
  dots:    'assets/layers/dots.jpg',
  swirl:   'assets/layers/swirl.jpg',
  stars:   'assets/layers/stars.jpg'
};



const state = {

  view: 'slider',
  collection: 'all',
  member: 'all',
  active: 0,
  booth: {
    photo:null, core:'core', material:'chrome', graphic:'gene',
    back:false, made:false, rotX:0, rotY:0, dragging:false,
    stickers:[], stickerDrag:false, selectedSticker:null, stickerCat:null,
    layerOpacity:1, charging:false
  },
  focus: false,
  gestures: false,

  sliderDragging: false
};

/* ---------- 工具 ---------- */
const $ = id => document.getElementById(id);

const UI_STATE_KEY = 'xg-ui-state-v1';
let uiEntered = false;
let bootUIState = null;

function readStoredUIState(){
  try {
    const raw = sessionStorage.getItem(UI_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

function captureUIState(){
  const boothOpen = !!($('booth') && $('booth').classList.contains('is-open'));
  const colophonOpen = !!($('colophon') && $('colophon').classList.contains('is-open'));
  const b = state.booth;
  const currentPhoto = b.photo;
  return {
    entered: true,
    view: state.view,
    collection: state.collection,
    member: state.member,
    focus: !!state.focus,
    sliderAnchor: sliderAnchor ? { ...sliderAnchor } : null,
    grid: { x: view.x, y: view.y },
    listScrollY: listScrollY,
    indexFocusId: (() => { try { const p = spiral && typeof spiralFocusPhoto === 'function' ? spiralFocusPhoto() : null; return p ? p.id : null; } catch (_) { return null; } })(),
    indexPhase: spiral ? { phase: spiral.phase, target: spiral.target } : null,
    boothOpen,
    booth: currentPhoto ? {
      photoId: currentPhoto.id,
      customPhoto: currentPhoto.custom ? currentPhoto : null,
      core: b.core,
      material: b.material,
      graphic: b.graphic,
      layerOpacity: b.layerOpacity,
      stickers: (b.stickers || []).map(x => ({ ...x })),
      made: !!b.made,
      back: !!b.back,
      panelScroll: (document.querySelector('.experience-panel') ? document.querySelector('.experience-panel').scrollTop : 0)
    } : null,
    colophonOpen
  };
}

function saveUIState(){
  if (!uiEntered) return;
  try {
    sessionStorage.setItem(UI_STATE_KEY, JSON.stringify(captureUIState()));
    document.documentElement.classList.add('restore-session');
  } catch (_) {}
}


const gestureDrag = { active:false, armed:false, longPressed:false, id:0, x:0, y:0, startX:0, startY:0, moved:false, longPressTimer:0 };
const pad2 = n => String(n).padStart(2, '0');

function toast(msg){
  const el = $('toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.hidden = true; }, 2400);
}

function hexA(hex, a){
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
}

function number(p){ return pad2(PHOTOS.findIndex(x => x.id === p.id) + 1); }

function mixHex(a, b, t){
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return '#' + [r, g, bl].map(v => v.toString(16).padStart(2, '0')).join('');
}

function photoBackground(p){
  if (p.src) return 'center/cover no-repeat url("' + p.src + '")';
  return 'radial-gradient(88% 62% at 74% 8%, ' + hexA(p.c2, .82) + ', transparent 68%),' +
         'radial-gradient(72% 58% at 20% 80%, ' + hexA(p.c2, .30) + ', transparent 72%),' +
         'linear-gradient(162deg, ' + p.c1 + ' 0%, ' + mixHex(p.c1, p.c2, .38) + ' 48%, #191521 100%)';
}

function filtered(){
  return PHOTOS.filter(p =>
    (state.collection === 'all' || p.collection === state.collection) &&
    (state.member === 'all' || p.memberId === state.member));
}

/* ---------- 入口层 ---------- */
let loadPct = 0;
bootUIState = readStoredUIState();
if (bootUIState && bootUIState.entered){
  uiEntered = true;
  state.view = ['slider', 'grid', 'list'].includes(bootUIState.view) ? bootUIState.view : 'slider';
  state.collection = (bootUIState.collection === 'all' || COLLECTIONS.some(c => c.id === bootUIState.collection)) ? bootUIState.collection : 'all';
  state.member = (bootUIState.member === 'all' || MEMBERS.some(m => m.id === bootUIState.member)) ? bootUIState.member : 'all';
  state.focus = !!bootUIState.focus;
  $('loader').classList.add('is-done');
  $('loader').style.display = 'none';
  document.body.classList.remove('is-loading');
  document.documentElement.classList.add('restore-session');
} else {
  (function bootLoader(){
    const timer = setInterval(() => {
      loadPct = Math.min(100, loadPct + 6 + Math.floor(Math.random() * 14));
      $('loaderPct').textContent = pad2(loadPct) + '%';
      if (loadPct >= 100){
        clearInterval(timer);
        $('loader').classList.add('is-ready');
      }
    }, 110);
  })();
}

function closeLoader(withIntro){
  uiEntered = true;
  $('loader').classList.add('is-done');
  document.body.classList.remove('is-loading');
  setTimeout(() => { $('loader').style.display = 'none'; }, 900);
  saveUIState();
  if (withIntro) setTimeout(introWall, 260);
}

$('btnEnter').onclick = () => closeLoader(true);
$('btnSkip').onclick  = () => closeLoader(false);

/* 照片墙铺开：逐张淡入，用参考站的快门缓动 */
function introWall(){
  const selector = state.view === 'slider' ? '#viewSlider .single-card'
    : state.view === 'grid' ? '#viewGrid .grid-tile'
    : '#viewList .list-row';
  document.querySelectorAll(selector).forEach((t, i) => {
    t.animate(
      [{ opacity:0 }, { opacity:1 }],
      { duration:950, delay:i * 26, easing:'cubic-bezier(.887,0,.113,1)', fill:'backwards' }
    );
  });
}

/* ---------- 顶部筛选：整面照片墙柔和淡出、换组、再淡入 ---------- */
let wallFilterChangeId = 0;

function currentWallView(){
  return $(state.view === 'grid' ? 'viewGrid' : state.view === 'list' ? 'viewList' : 'viewSlider');
}

function switchWallFilter(mutate){
  const token = ++wallFilterChangeId;
  const el = currentWallView();
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!el || !el.animate || reduce){
    mutate();
    renderAll();
    return;
  }

  /* 连续点击时取消上一条过渡，只让最后一次筛选生效 */
  el.getAnimations().forEach(a => a.cancel());
  const out = el.animate(
    [
      { opacity:1, transform:'scale(1)' },
      { opacity:0, transform:'scale(.996)' }
    ],
    { duration:330, easing:'cubic-bezier(.4,0,.2,1)', fill:'forwards' }
  );

  out.finished.then(() => {
    if (token !== wallFilterChangeId) return;
    mutate();
    renderAll();

    /* renderAll 更新的是同一个 view 容器，先在不可见状态交换内容再淡入 */
    el.getAnimations().forEach(a => a.cancel());
    const incoming = el.animate(
      [
        { opacity:0, transform:'scale(.992)' },
        { opacity:1, transform:'scale(1)' }
      ],
      { duration:680, easing:'cubic-bezier(.22,1,.36,1)', fill:'both' }
    );
    incoming.finished.then(() => {
      if (token === wallFilterChangeId) incoming.cancel();
    }).catch(() => {});
  }).catch(() => {});
}

/* ---------- 顶部：套系 / 成员筛选（带计数） ---------- */
function renderFilters(){
  const wrap = $('filterSeries');
  wrap.innerHTML = '';
  const all = [{ id:'all', place:'ALL' }].concat(COLLECTIONS);
  all.forEach(c => {
    const n = c.id === 'all' ? PHOTOS.length : PHOTOS.filter(p => p.collection === c.id).length;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = state.collection === c.id ? 'is-current' : '';
    b.textContent = (c.id === 'all' ? 'ALL' : c.place) + '(' + n + ')';
    b.dataset.cursor = 'FILTER · ' + (c.id === 'all' ? 'ALL SERIES' : c.place);
    b.onclick = () => {
      if (state.collection === c.id) return;
      switchWallFilter(() => { state.collection = c.id; sliderAnchor = null; });
    };
    wrap.appendChild(b);
  });

  const drop = $('memberDrop');
  drop.innerHTML = '';
  const allM = [{ id:'all', name:'ALL' }].concat(MEMBERS);
  allM.forEach(m => {
    const n = m.id === 'all' ? PHOTOS.length : PHOTOS.filter(p => p.memberId === m.id).length;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = state.member === m.id ? 'is-current' : '';
    b.textContent = m.name + '(' + n + ')';
    b.onclick = () => {
      if (state.member === m.id) return;
      switchWallFilter(() => { state.member = m.id; sliderAnchor = null; });
    };
    drop.appendChild(b);
  });
  $('navMember').querySelector('.nav-member-label').textContent =
    state.member === 'all' ? 'MEMBER' : MEMBERS.find(m => m.id === state.member).name.toUpperCase();
}

/* ---------- 排列参数（原样取自参考站 remyshoots.co.za 的布局模块） ----------
   它的常量：tileWorldSize(w,h,zoom) = min( 0.3401·w·zoom·1.15·1.4916 , 0.72·h·zoom )
   即卡片高宽比 587.67 : 876.58 = 1.4916，默认 zoom 0.75，1920×1080 下约 391×583
   平移用 mod 取模实现无限循环（它同一模块里的 mod 函数用法一致） */
const TILE_WH = 876.58 / 587.67;
const TILE_WF = 587.67 / 1728;
const TILE_ZOOM = 0.75;
const TILE_GAIN = 1.15;
const TILE_MAX_H = 0.72;
const SLIDER_WH = 1116 / 758;
const TILE_GAP = 2;                       // GRID 照片之间保留 2px 缝隙：卡片缩 2px，网格步距不变
const TICK_BUDGET = 320;                  // SINGLE 刻度总量上限（照片多时防止生成上千个 tick）

const view = { x:0, y:0 };
let gridTiles = [], gridMetrics = { TW:0, TH:0 };
let gridPhase = 0, gridPhaseY = 0;
let gridSnapTimer = 0, gridRaf = 0, gridTargetX = 0, gridTargetY = 0, gridLastFrame = 0;
let singleCards = [], singleMetrics = { CW:0, CH:0, GAP:20, TOP:0, centerI:0 };
let sliderCaption = null, sliderTicker = null, sliderChromeActive = -1;
let sliderWheelScrolling = false;
let sliderWheelSettlePending = false;
let sliderSnapTimer = 0, sliderSnapRaf = 0, sliderTargetX = 0, sliderLastFrame = 0;
let listField = null, listMetrics = { rowH:0, cycleH:0, vh:0, centerY:0, fieldTop:0, shiftX:0 };
let listSnapTimer = 0;
let listScrollY = 0, listTargetY = 0, listRaf = 0, listLastFrame = 0;
let sliderAnchor = null;
let sliderCardHover = false;
let lanyardController = null;
let lanyardModulePromise = null;
let lanyardLoadToken = 0;

function mod(a, n){ return ((a % n) + n) % n; }
function clampNum(v, a, b){ return Math.min(b, Math.max(a, v)); }
function memberOk(p){ return state.member === 'all' || p.memberId === state.member; }
function photosOf(c){ return PHOTOS.filter(p => p.collection === c.id && memberOk(p)); }

function tileSize(vw, vh, zoom){
  const h = Math.min(TILE_WF * vw * zoom * TILE_GAIN * TILE_WH, TILE_MAX_H * vh * zoom);
  return { w: h / TILE_WH, h: h };
}
function cardSize(vw, vh){
  const h = Math.min(TILE_WF * vw * 1.05 * SLIDER_WH, 0.68 * vh);
  return { w: h / SLIDER_WH, h: h };
}

/* ---------- GRID：二维排列，滚轮平移，两个方向都无限循环 ---------- */
function buildGridTile(){
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'grid-tile';
  el.dataset.cursor = 'VIEW THIS';
  el.dataset.pick = '1';

  const ph = document.createElement('div'); ph.className = 'ph';
  const chip = document.createElement('span'); chip.className = 'grid-chip';
  const name = document.createElement('span'); name.className = 'grid-name';
  const no = document.createElement('span'); no.className = 'grid-no';
  const pick = document.createElement('span'); pick.className = 'grid-pick';
  pick.textContent = 'PICK';
  el.append(ph, chip, name, no, pick);

  let cur = null;
  return {
    el,
    paint(p){
      if (!p){ el.style.visibility = 'hidden'; return; }
      el.style.visibility = '';
      if (cur === p.id) return;
      cur = p.id;
      el.dataset.photo = p.id;
      ph.style.background = photoBackground(p);
      ph.style.setProperty('--c1', p.c1);
      ph.style.setProperty('--c2', p.c2);
      chip.innerHTML = '<span>' + (p.place || '') + '</span>';
      name.textContent = p.member;
      no.textContent = '№' + number(p);
      this.photo = p;
      el.onmouseenter = () => setMeta(p);
      el.onclick = () => openBooth(p);
    }
  };
}

function renderGrid(){
  const el = $('viewGrid');
  el.innerHTML = '';
  gridTiles = [];
  view.x = 0; view.y = 0;

  const pool = filtered();
  if (!pool.length){
    el.innerHTML = '<p class="wall-empty">NO PHOTOS IN THIS COMBINATION</p>';
    return;
  }

  const field = document.createElement('div');
  field.className = 'grid-field';
  el.appendChild(field);

  const vw = el.clientWidth || window.innerWidth;
  const vh = el.clientHeight || window.innerHeight;
  const { w: TW, h: TH } = tileSize(vw, vh, TILE_ZOOM);
  const cols = Math.ceil(vw / TW) + 2;
  const rows = Math.ceil(vh / TH) + 2;

  for (let j = 0; j < rows; j++){
    for (let i = 0; i < cols; i++){
      const t = buildGridTile();
      t.el.style.width = (TW - TILE_GAP) + 'px';
      t.el.style.height = (TH - TILE_GAP) + 'px';
      field.appendChild(t.el);
      gridTiles.push({ t, i, j });
    }
  }

  gridMetrics = { TW, TH };
  computeGridPhase();
  view.x = gridPhase;
  view.y = gridPhaseY;
  gridTargetX = view.x;
  gridTargetY = view.y;
  applyGrid();
}

/* 水平相位：左右裁切仍然对称，同时让一张卡片正好落在视口中心。
   这样 slider 中心卡 ↔ grid 中心格可以在两个方向都严格重合。 */
function computeGridPhase(){
  const { TW, TH } = gridMetrics;
  const vw = $('viewGrid').clientWidth || window.innerWidth;
  const vh = $('viewGrid').clientHeight || window.innerHeight;
  if (!TW || !TH) return;
  gridPhase = mod((TW - vw) / 2, TW);
  gridPhaseY = mod((TH - vh) / 2, TH);
}

/* 停稳后把 x 吸附到最近的对称位置（整卡步进 + 固定相位，循环不受影响） */
/* 吸附动画用版本号令牌：过期回调直接作废，避免它晚到一步把新位置覆盖掉 */
function gridSnapXTargetAt(x){
  const { TW } = gridMetrics;
  if (!TW) return x;
  return Math.round((x - gridPhase) / TW) * TW + gridPhase;
}

function gridSnapYTargetAt(y){
  const { TH } = gridMetrics;
  if (!TH) return y;
  return Math.round((y - gridPhaseY) / TH) * TH + gridPhaseY;
}

function stopGridAnim(){
  if (gridRaf) cancelAnimationFrame(gridRaf);
  gridRaf = 0;
  gridLastFrame = 0;
}

function stepGridAnim(now){
  if (!gridLastFrame) gridLastFrame = now;
  const dt = Math.min(34, Math.max(8, now - gridLastFrame));
  gridLastFrame = now;

  const dx = gridTargetX - view.x;
  const dy = gridTargetY - view.y;
  const ease = 1 - Math.pow(.88, dt / 16.67);
  if (Math.abs(dx) > .06 || Math.abs(dy) > .06){
    view.x += clampNum(dx * ease, -16, 16);
    view.y += clampNum(dy * ease, -16, 16);
    applyGrid();
    gridRaf = requestAnimationFrame(stepGridAnim);
  } else {
    view.x = gridTargetX;
    view.y = gridTargetY;
    applyGrid();
    gridRaf = 0;
    gridLastFrame = 0;
  }
}

function startGridAnim(){
  if (!gridRaf) gridRaf = requestAnimationFrame(stepGridAnim);
}

function cancelGridSnap(){
  clearTimeout(gridSnapTimer);
  stopGridAnim();
  gridTargetX = view.x;
  gridTargetY = view.y;
}

function gridBaseTransform(item){
  return 'translate3d(' + item.fx + 'px,' + item.fy + 'px,0)' +
    ' rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)';
}

function gridFocusData(item, vw, vh){
  const { TW, TH } = gridMetrics;
  const baseW = TW - TILE_GAP;
  const baseH = TH - TILE_GAP;
  const cx = item.fx + baseW / 2 - vw / 2;
  const cy = item.fy + baseH / 2 - vh / 2;
  const gx = cx / TW;
  const gy = cy / TH;
  const d = clampNum(Math.hypot(gx, gy) / 1.6, 0, 1);
  /* 与 SINGLE 使用同一暗化曲线：相邻格对应 SINGLE 两侧邻卡的同一亮度。 */
  const singleSize = cardSize(vw, vh);
  const singleStep = singleSize.w + Math.round(singleSize.w * .05);
  const dimUnit = singleStep / (singleSize.w * 1.08);
  const dimT = clampNum(Math.hypot(gx, gy) * dimUnit, 0, 1);
  const sx = Math.abs(gx) > .002 ? gx : 0;
  const sy = Math.abs(gy) > .002 ? gy : 0;
  const angleY = -Math.sign(sx) * 18 * d;
  const angleX = Math.sign(sy) * 14 * d;
  const depth = -64 * d;

  /* 让 grid 中心格的实际视觉宽高与 SINGLE 中心聚焦尺寸完全一致。 */
  const single = cardSize(vw, vh);
  const matchX = clampNum((single.w * 1.22) / baseW, 1.2, 1.8);
  const matchY = clampNum((single.h * 1.22) / baseH, 1.2, 1.8);
  const scaleX = matchX - (matchX - 1) * d;
  const scaleY = matchY - (matchY - 1) * d;
  const transform = gridBaseTransform(item) +
    ' rotateY(' + angleY.toFixed(3) + 'deg) rotateX(' + angleX.toFixed(3) + 'deg)' +
    ' translateZ(' + depth.toFixed(2) + 'px) scale(' + scaleX.toFixed(4) + ',' + scaleY.toFixed(4) + ')';
  return {
    d:d,
    transform:transform,
    zIndex:String(Math.round(100 - d * 30)),
    filter:'brightness(' + (1.06 - .66 * dimT).toFixed(3) + ') ' +
      'grayscale(' + (.35 * dimT).toFixed(3) + ')'
  };
}

function applyGridTileVisual(item, focused, vw, vh){
  const el = item.t.el;
  const photo = el.querySelector('.ph');
  if (focused){
    const f = gridFocusData(item, vw, vh);
    el.style.transform = f.transform;
    el.style.zIndex = f.zIndex;
    if (photo) photo.style.filter = f.filter;
  } else {
    el.style.transform = gridBaseTransform(item);
    el.style.zIndex = '';
    if (photo) photo.style.filter = '';
  }
}

function applyGrid(){
  const { TW, TH } = gridMetrics;
  if (!TW || !gridTiles.length) return;
  const pool = filtered();
  if (!pool.length) return;

  const tx = -mod(view.x, TW), ty = -mod(view.y, TH);
  const col0 = Math.floor(view.x / TW) - 1;
  const row0 = Math.floor(view.y / TH) - 1;

  const vw = $('viewGrid').clientWidth || window.innerWidth;
  const vh = $('viewGrid').clientHeight || window.innerHeight;
  const focus = state.focus && state.view === 'grid' && !morphing;

  gridTiles.forEach(item => {
    item.fx = item.i * TW + tx + TILE_GAP / 2;
    item.fy = item.j * TH + ty + TILE_GAP / 2;
    applyGridTileVisual(item, focus, vw, vh);

    const col = col0 + item.i, row = row0 + item.j;
    item.t.paint(pool[mod(col + row * 13, pool.length)]);
  });
}

/* ---------- SINGLE：照片池序列横向排列（与 GRID 同一序列），滚轮左右平移 + 无限循环 ---------- */
function sliderFilterKey(){ return state.collection + '|' + state.member; }

function slidePlan(){
  const list = filtered();
  if (!list.length) return [];

  const key = sliderFilterKey();
  if (!(sliderAnchor && sliderAnchor.filterKey === key)){
    /* 没有锚点时默认落在第一张（从 GRID 切过来会先写锚点） */
    sliderAnchor = { filterKey:key, photoId:list[0].id, row:0 };
  }

  /* SINGLE 的序列 = 照片池序列，与 GRID 的排列完全一致：
     中心卡与其左右邻卡，就是 GRID 中心行同一位置的同一批照片，
     所以 SINGLE <-> GRID 切换时照片一一对应，不会换图。 */
  return list.map(p => ({ name:p.member, photo:p }));
}

function buildSingleCard(){
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'single-card';
  el.dataset.cursor = 'VIEW THIS';
  el.dataset.pick = '1';

  const ph = document.createElement('div'); ph.className = 'ph';
  el.append(ph);

  let cur = null;
  return {
    el,
    paint(s){
      if (!s){ el.style.visibility = 'hidden'; return; }
      el.style.visibility = '';
      if (cur === s.photo.id) return;
      cur = s.photo.id;
      this.photo = s.photo;
      el.dataset.photo = s.photo.id;
      ph.style.background = photoBackground(s.photo);
      ph.style.setProperty('--c1', s.photo.c1);
      ph.style.setProperty('--c2', s.photo.c2);
      el.onmouseenter = () => setMeta(s.photo);
      el.onclick = () => openBooth(s.photo);
    }
  };
}

function buildSliderChrome(el, slides, vw, vh, CW, CH, TOP){
  const caption = document.createElement('div');
  caption.className = 'slider-caption';
  const name = document.createElement('span'); name.className = 'slider-caption-name';
  const meta = document.createElement('span'); meta.className = 'slider-caption-meta';
  caption.append(name, meta);

  const ticker = document.createElement('div');
  ticker.className = 'slider-ticker';
  const track = document.createElement('div');
  track.className = 'slider-ticker-track';
  const pitch = Math.max(30, Math.min(96, CW * .22));
  const count = slides.length;
  /* 刻度：铺满视口即可；照片多时不再生成上千个刻度（总量封顶 TICK_BUDGET） */
  const needRepeat = Math.ceil(vw / Math.max(1, count * pitch)) + 2;
  const repeat = Math.max(3, Math.min(needRepeat, Math.ceil(TICK_BUDGET / Math.max(1, count))));
  const centerIndex = Math.floor(repeat / 2) * count;
  const total = count * repeat;
  const ticks = [];
  track.style.gap = (pitch - 1) + 'px';
  for (let i = 0; i < total; i++){
    const tick = document.createElement('i');
    tick.className = 'slider-tick';
    track.appendChild(tick);
    ticks.push(tick);
  }
  ticker.appendChild(track);
  el.append(caption, ticker);

  caption.style.top = (TOP + CH + 14) + 'px';
  ticker.style.top = (TOP + CH + 72) + 'px';
  sliderCaption = caption;
  sliderTicker = { el:ticker, track:track, ticks:ticks, count:count, centerIndex:centerIndex, pitch:pitch, bias:null, lit:[] };
  sliderChromeActive = -1;
}

function updateSliderChrome(layoutActive, phase){
  const slides = slidePlan();
  if (!slides.length || !sliderTicker || !sliderCaption) return;

  const N = slides.length;
  if (sliderTicker.bias === null) sliderTicker.bias = mod(layoutActive - phase, N);
  const pos = mod(phase + sliderTicker.bias, N);
  const active = mod(Math.round(pos), N);

  if (active !== sliderChromeActive){
    sliderChromeActive = active;
    sliderCaption.querySelector('.slider-caption-name').textContent = slides[active].name;
    sliderCaption.querySelector('.slider-caption-meta').textContent =
      '№' + number(slides[active].photo) + ' · ' + slides[active].photo.collectionLabel;
    sliderCaption.animate(
      [{ opacity:.35 }, { opacity:1 }],
      { duration:280, easing:'cubic-bezier(.4,0,.15,1)' }
    );
  }

  const vw = $('viewSlider').clientWidth || window.innerWidth;
  const base = sliderTicker.centerIndex + Math.floor(pos);
  const frac = pos - Math.floor(pos);
  sliderTicker.track.style.transform =
    'translate3d(' + (vw / 2 - (sliderTicker.centerIndex + pos) * sliderTicker.pitch) + 'px,0,0)';
  /* 每帧只改动的刻度写入：照片多时刻度数量大，逐帧全量写会掉帧 */
  const writeTick = (i, on, op) => {
    const tick = sliderTicker.ticks[i];
    if (!tick) return;
    if (tick.__on !== on){ tick.__on = on; tick.classList.toggle('is-on', on); }
    if (tick.__op !== op){ tick.__op = op; tick.style.opacity = op; }
  };
  (sliderTicker.lit || []).forEach(i => {
    if (i !== base && i !== base + 1) writeTick(i, false, '');
  });
  sliderTicker.lit = [base, base + 1];
  writeTick(base, true, String(1 - frac));
  writeTick(base + 1, true, String(frac));
}

function renderSlider(){
  const el = $('viewSlider');
  const old = el.querySelector('.single-field');
  if (old) old.remove();
  const oldCaption = el.querySelector('.slider-caption');
  if (oldCaption) oldCaption.remove();
  const oldTicker = el.querySelector('.slider-ticker');
  if (oldTicker) oldTicker.remove();
  const oldEmpty = el.querySelector('.wall-empty');
  if (oldEmpty) oldEmpty.remove();
  cancelSliderSnap();
  sliderCardHover = false;
  singleCards = [];
  sliderCaption = null;
  sliderTicker = null;
  sliderChromeActive = -1;
  sliderWheelScrolling = false;
  sliderWheelSettlePending = false;
  $('viewSlider').classList.remove('is-wheel-scrolling');
  view.x = 0;

  const slides = slidePlan();
  if (!slides.length){
    const p = document.createElement('p');
    p.className = 'wall-empty';
    p.textContent = 'NO PHOTOS IN THIS COMBINATION';
    el.appendChild(p);
    return;
  }

  const field = document.createElement('div');
  field.className = 'single-field';
  el.appendChild(field);

  const vw = el.clientWidth || window.innerWidth;
  const vh = el.clientHeight || window.innerHeight;
  const { w: CW, h: CH } = cardSize(vw, vh);
  const GAP = Math.round(CW * 0.05);
  const n = Math.ceil(vw / (CW + GAP)) + 2;

  for (let i = 0; i < n; i++){
    const c = buildSingleCard();
    c.el.style.width = CW + 'px';
    c.el.style.height = CH + 'px';
    field.appendChild(c.el);
    singleCards.push({ c, i });
  }

  singleMetrics = { CW, CH, GAP, TOP: Math.round((vh - CH) / 2), centerI:0, SNAP_PHASE:0 };
  el.onmouseover = function(e){
    const onCard = !!e.target.closest('.single-card');
    if (onCard === sliderCardHover) return;
    sliderCardHover = onCard;
    applySingle();
  };
  el.onmouseleave = function(){
    if (!sliderCardHover) return;
    sliderCardHover = false;
    applySingle();
  };
  buildSliderChrome(el, slides, vw, vh, CW, CH, singleMetrics.TOP);
  // 优先居中到锚点那张（从 grid 切过来时要落在同一张上），否则退回第一张
  const anchorPhoto = (sliderAnchor && sliderAnchor.filterKey === sliderFilterKey())
    ? filtered().find(p => p.id === sliderAnchor.photoId) : null;
  if (!centerSingleOnCard(anchorPhoto || slides[0].photo)) applySingle();
}

function singleTransformAt(fx, fy, forceFocus){
  const base = 'translate3d(' + fx + 'px,' + fy + 'px,0)';
  const focused = forceFocus || (state.focus && state.view === 'slider');
  if (!focused) return base;
  const { CW } = singleMetrics;
  const vw = $('viewSlider').clientWidth || window.innerWidth;
  const dx = fx + CW / 2 - vw / 2;
  const t = clampNum(Math.abs(dx) / (CW * 1.08), 0, 1);
  const angle = (dx < 0 ? 1 : -1) * 18 * t;
  const depth = -36 * t;
  const scale = 1.22 - .22 * t;
  return base + ' rotateY(' + angle + 'deg) translateZ(' + depth + 'px) scale(' + scale + ')';
}

function applySingle(forceFocus){
  const { CW, CH, GAP, TOP } = singleMetrics;
  if (!CW || !singleCards.length) return;
  const slides = slidePlan();
  if (!slides.length) return;
  const focused = forceFocus || (state.focus && state.view === 'slider');

  const step = CW + GAP;
  const tx = -mod(view.x, step);
  const idx0 = Math.floor(view.x / step) - 1;
  const vw = $('viewSlider').clientWidth || window.innerWidth;

  singleCards.forEach(item => {
    item.fx = item.i * step + tx;
    item.fy = TOP;
    item.c.el.style.transform = singleTransformAt(item.fx, item.fy, forceFocus);
    const photo = item.c.el.querySelector('.ph');
    if (focused){
      const dx = item.fx + CW / 2 - vw / 2;
      const t = clampNum(Math.abs(dx) / (CW * 1.08), 0, 1);
      item.c.el.style.zIndex = String(Math.round(100 - t * 20));
      if (photo){
        photo.style.filter =
          'brightness(' + (1.06 - .66 * t).toFixed(3) + ') ' +
          'grayscale(' + (.35 * t).toFixed(3) + ')';
      }
    } else if (sliderWheelScrolling){
      /* 滚轮期间按卡与屏幕中心的距离连续计算亮度，避免中心卡切换时反复触发过渡 */
      item.c.el.style.zIndex = '';
      if (photo){
        const centerDist = Math.abs(item.fx + CW / 2 - vw / 2);
        /* 最接近中心的卡最多偏离半格；亮区覆盖这半格，换手时不掉亮度 */
        const t = clampNum((centerDist - step * .52) / (CW * .42), 0, 1);
        photo.style.filter =
          'brightness(' + (1.1 - .28 * t).toFixed(3) + ') ' +
          'grayscale(' + (.35 * t).toFixed(3) + ')';
      }
    } else {
      item.c.el.style.zIndex = '';
      if (photo) photo.style.filter = '';
    }
    item.c.paint(slides[mod(idx0 + item.i, slides.length)]);
  });

  /* SINGLE 默认中心卡高亮；鼠标进入照片后由 hover 接管，离开后恢复中心高亮。 */
  let centerItem = null, centerDist = Infinity;
  singleCards.forEach(item => {
    const d = Math.abs(item.fx + CW / 2 - vw / 2);
    if (d < centerDist){ centerDist = d; centerItem = item; }
  });
  singleCards.forEach(item => {
    item.c.el.classList.toggle('is-center', !focused && !sliderCardHover && item === centerItem);
  });

  const active = mod(idx0 + singleMetrics.centerI, slides.length);
  updateSliderChrome(active, view.x / step);
}

function sliderStep(){
  return singleMetrics.CW + singleMetrics.GAP;
}

function sliderSnapTargetAt(x){
  const S = sliderStep();
  if (!S) return x;
  const phase = singleMetrics.SNAP_PHASE || 0;
  return Math.round((x - phase) / S) * S + phase;
}

function stopSliderAnim(){
  if (sliderSnapRaf) cancelAnimationFrame(sliderSnapRaf);
  sliderSnapRaf = 0;
  sliderLastFrame = 0;
}

function stepSliderAnim(now){
  if (!sliderLastFrame) sliderLastFrame = now;
  const dt = Math.min(34, Math.max(8, now - sliderLastFrame));
  sliderLastFrame = now;

  const diff = sliderTargetX - view.x;
  const ease = 1 - Math.pow(.88, dt / 16.67);
  if (Math.abs(diff) > .06){
    view.x += diff * ease;
    applySingle();
    sliderSnapRaf = requestAnimationFrame(stepSliderAnim);
  } else {
    view.x = sliderTargetX;
    applySingle();
    sliderSnapRaf = 0;
    sliderLastFrame = 0;
    if (sliderWheelSettlePending) endSliderWheelScrolling();
  }
}

function startSliderAnim(){
  if (!sliderSnapRaf) sliderSnapRaf = requestAnimationFrame(stepSliderAnim);
}

function endSliderWheelScrolling(){
  if (!sliderWheelScrolling) return;
  sliderWheelScrolling = false;
  sliderWheelSettlePending = false;
  const el = $('viewSlider');
  if (el) el.classList.remove('is-wheel-scrolling');
  if (state.view === 'slider') applySingle();
}

function cancelSliderSnap(){
  clearTimeout(sliderSnapTimer);
  stopSliderAnim();
  sliderTargetX = view.x;
}

/* 滚轮驱动：GRID 上下（Shift 或触控板横向 = 左右）· SINGLE 左右。均为无限循环 */
/* =========================================================
   视图形变：slider ↔ grid（从当前那张卡的位置扩散 / 收拢）
   机制照参考站 remyshoots.co.za：
   · 交接瞬间用一张"替身卡"盖住接缝，画布切换看不出来
   · VIEW_MOVE_S = 1.6s，每带错开 0.08s（它的 bandedDuration）
   · 缓动用参考站 VIEW_MOVE_EASE（easeInOutExpo 型），这里用等价的三次贝塞尔 (.887,0,.113,1) 表达
   ========================================================= */
const MORPH_BASE_S = 1.8;
const MORPH_EASE = 'cubic-bezier(.65,0,.35,1)';

let morphing = false, morphTimers = [], rowMorphAnims = [];
function morphAfter(ms, fn){ morphTimers.push(setTimeout(fn, ms)); }
function clearMorphTimers(){ morphTimers.forEach(clearTimeout); morphTimers = []; }

/* 只切换状态与显隐，不带动画 */
function setView(v, immediateToggle){
  state.view = v;
  ['grid', 'slider', 'list'].forEach(k => {
    $(k === 'grid' ? 'viewGrid' : k === 'slider' ? 'viewSlider' : 'viewList')
      .setAttribute('aria-hidden', String(k !== v));
  });
  setViewToggleActive(v, !!immediateToggle);
}

function nearestOf(items, get, viewId){
  const el = $(viewId);
  const cx = (el.clientWidth || window.innerWidth) / 2;
  const cy = (el.clientHeight || window.innerHeight) / 2;
  let best = null;
  items.forEach(item => {
    const g = get(item);
    if (!g || !g.photo || g.fx === undefined) return;
    const d = Math.hypot(g.fx + g.w / 2 - cx, g.fy + g.h / 2 - cy);
    if (!best || d < best.d) best = { d, x:g.fx, y:g.fy, w:g.w, h:g.h, photo:g.photo, item:item };
  });
  return best;
}

function anchorFromGrid(){
  const near = nearestOf(gridTiles, it => ({
    fx:it.fx, fy:it.fy, w:gridMetrics.TW - TILE_GAP, h:gridMetrics.TH - TILE_GAP, photo:it.t.photo
  }), 'viewGrid');
  if (!near || !near.item) return near;
  near.col = Math.floor(view.x / gridMetrics.TW) - 1 + near.item.i;
  near.row = Math.floor(view.y / gridMetrics.TH) - 1 + near.item.j;
  return near;
}

function anchorFromSingle(){
  return nearestOf(singleCards, it => ({
    fx:it.fx, fy:it.fy, w:singleMetrics.CW, h:singleMetrics.CH, photo:it.c.photo
  }), 'viewSlider');
}

/* 把 SINGLE 视图摆到指定照片居中，并返回那张卡的最终矩形。 */
function centerSingleOnCard(photo){
  if (!photo || !singleCards.length) return null;
  const slides = slidePlan();
  let k = slides.findIndex(s => s.photo.id === photo.id);
  if (k < 0) k = slides.findIndex(s => s.photo.memberId === photo.memberId);
  if (k < 0) return null;

  const el = $('viewSlider');
  const vw = el.clientWidth || window.innerWidth;
  const S = singleMetrics.CW + singleMetrics.GAP;
  const C = (vw - singleMetrics.CW) / 2;
  const i = Math.max(0, Math.min(singleCards.length - 1, Math.ceil(C / S)));
  const r = i * S - C;
  singleMetrics.centerI = i;
  singleMetrics.SNAP_PHASE = r;
  const m = mod(k + 1 - i, slides.length);
  view.x = m * S + r;
  sliderTargetX = view.x;
  applySingle();

  const target = singleCards.find(it => it.i === i);
  return {
    x:target ? target.fx : i * S - r,
    y:singleMetrics.TOP,
    w:singleMetrics.CW, h:singleMetrics.CH,
    photo:photo
  };
}

/* 把指定照片放到指定 grid 行的正中心，并返回该格最终矩形。 */
function centerGridOnPhoto(photo, row){
  if (!photo || !gridTiles.length) return null;
  const list = filtered();
  const n = list.length;
  const idx = list.findIndex(p => p.id === photo.id);
  if (idx < 0 || !n) return null;

  const R = Math.round(Number.isFinite(row) ? row : 0);
  const TW = gridMetrics.TW, TH = gridMetrics.TH;
  const vw = $('viewGrid').clientWidth || window.innerWidth;
  const vh = $('viewGrid').clientHeight || window.innerHeight;

  const col = mod(idx - R * 13, n);
  view.x = col * TW + 1.5 * TW - vw / 2;
  view.y = R * TH + 1.5 * TH - vh / 2;
  gridTargetX = view.x;
  gridTargetY = view.y;
  applyGrid();

  const col0 = Math.floor(view.x / TW) - 1;
  const row0 = Math.floor(view.y / TH) - 1;
  const i = col - col0, j = R - row0;
  const hit = gridTiles.find(it => it.i === i && it.j === j);
  if (!hit) return null;
  return {
    x:hit.fx, y:hit.fy,
    w:TW - TILE_GAP, h:TH - TILE_GAP,
    photo:hit.t.photo, row:R, col:col
  };
}

/* 以“一行”为单位完成 slider ↔ grid 形变。
   slider 当前行直接收缩为 grid 中心行；grid 其他行只做明暗渐显/渐隐。 */
function gridItemForCell(row, col){
  const { TW, TH } = gridMetrics;
  if (!TW || !TH || !gridTiles.length) return null;
  const col0 = Math.floor(view.x / TW) - 1;
  const row0 = Math.floor(view.y / TH) - 1;
  return gridTiles.find(it => it.i === col - col0 && it.j === row - row0) || null;
}

/* 取 slider 当前可见的整行，并给出每张卡相对中心卡的序号。
   这个序号同时决定它在 grid 中心行里应落到哪一列。 */
function singleRowMap(){
  const slides = slidePlan();
  if (!slides.length || !singleCards.length) return null;
  const near = anchorFromSingle();
  if (!near || !near.item) return null;

  const step = singleMetrics.CW + singleMetrics.GAP;
  const idx0 = Math.floor(view.x / step) - 1;
  const centerI = near.item.i;
  const centerK = mod(idx0 + centerI, slides.length);

  return singleCards.map(it => {
    const rel = it.i - centerI;
    return { item:it, rel:rel, slide:slides[mod(centerK + rel, slides.length)] };
  });
}

function animateRowMorph(el, frames, options){
  const anim = el.animate(frames, options);
  rowMorphAnims.push(anim);
  return anim;
}

function clearRowMorphAnims(){
  rowMorphAnims.forEach(anim => anim.cancel());
  rowMorphAnims = [];
}

function gridTextLabels(tile){
  return tile.querySelectorAll('.grid-name,.grid-no,.grid-chip');
}

function sliderChromeNodes(){
  return [sliderCaption, sliderTicker && sliderTicker.el].filter(Boolean);
}

function setSliderChromeOpacity(value){
  sliderChromeNodes().forEach(el => { el.style.opacity = String(value); });
}

function resetSliderChromeOpacity(){
  sliderChromeNodes().forEach(el => { el.style.opacity = ''; });
}

function fadeSliderChrome(mode, duration, delay){
  const from = mode === 'in' ? 0 : 1;
  const to = mode === 'in' ? 1 : 0;
  sliderChromeNodes().forEach(el => {
    el.style.opacity = String(from);
    animateRowMorph(el, [{ opacity:from }, { opacity:to }], {
      duration:duration, delay:delay || 0,
      easing:'cubic-bezier(.4,0,.15,1)', fill:'both'
    });
  });
}

function fadeGridText(mode, duration, delay){
  gridTiles.forEach(it => {
    gridTextLabels(it.t.el).forEach(label => {
      if (mode === 'in'){
        label.style.opacity = '0';
        animateRowMorph(label, [{ opacity:0 }, { opacity:1 }], {
          duration:duration, delay:delay || 0,
          easing:'cubic-bezier(.4,0,.15,1)', fill:'both'
        });
      } else {
        label.style.opacity = '1';
        animateRowMorph(label, [{ opacity:1 }, { opacity:0 }], {
          duration:duration, delay:delay || 0,
          easing:'cubic-bezier(.4,0,.15,1)', fill:'both'
        });
      }
    });
  });
}

function morphSliderToGrid(){
  const rowMap = singleRowMap();
  if (!rowMap) return false;
  const center = rowMap.find(item => item.rel === 0);
  if (!center) return false;

  const key = sliderFilterKey();
  const row = sliderAnchor && sliderAnchor.filterKey === key ? sliderAnchor.row : 0;
  renderGrid();
  const gridAnchor = centerGridOnPhoto(center.slide.photo, row);
  if (!gridAnchor) return false;
  if (sliderAnchor && sliderAnchor.filterKey === key) sliderAnchor.row = row;

  const gridEl = $('viewGrid');
  gridEl.setAttribute('aria-hidden', 'false');
  gridEl.style.transition = 'none';
  gridEl.style.opacity = '1';
  gridEl.style.visibility = 'visible';
  gridTiles.forEach(it => { it.t.el.style.opacity = '0'; });
  const vw = gridEl.clientWidth || window.innerWidth;
  const vh = gridEl.clientHeight || window.innerHeight;
  if (state.focus) gridTiles.forEach(it => applyGridTileVisual(it, true, vw, vh));

  const pairs = [];
  rowMap.forEach(entry => {
    const item = gridItemForCell(gridAnchor.row, gridAnchor.col + entry.rel);
    if (item) pairs.push({ entry:entry, item:item });
    else animateRowMorph(entry.item.c.el, [{ opacity:1 }, { opacity:0 }], {
      duration:MORPH_BASE_S * 450, easing:'cubic-bezier(.4,0,.15,1)', fill:'forwards'
    });
  });

  const centerItems = new Set(pairs.map(pair => pair.item));
  const dur = MORPH_BASE_S * 1000;

  /* slider 的名字/标注和刻度随本页一起淡出，grid 文字稍后再渐显。 */
  fadeSliderChrome('out', 450, 0);

  /* 中心行先只用照片完成整行形变，文字稍后再单独渐显。 */
  gridTiles.forEach(it => {
    gridTextLabels(it.t.el).forEach(label => { label.style.opacity = '0'; });
  });

  gridTiles.forEach(it => {
    if (centerItems.has(it)) return;
    const worldRow = Math.floor(view.y / gridMetrics.TH) - 1 + it.j;
    const dist = Math.abs(worldRow - gridAnchor.row);
    const delay = Math.min(640, 120 + dist * 110);
    animateRowMorph(it.t.el, [{ opacity:0 }, { opacity:1 }], {
      duration:Math.max(420, dur - delay), delay:delay,
      easing:'cubic-bezier(.4,0,.15,1)', fill:'both'
    });
  });

  pairs.forEach(pair => {
    const entry = pair.entry, item = pair.item, card = entry.item.c.el;
    const photo = card.querySelector('.ph');
    const fromTransform = getComputedStyle(card).transform;
    const targetFocus = state.focus ? gridFocusData(item, vw, vh) : null;
    const targetTransform = targetFocus ? targetFocus.transform : gridBaseTransform(item);
    const fromFilter = photo ? getComputedStyle(photo).filter : 'none';
    animateRowMorph(card, [
      { width:singleMetrics.CW + 'px', height:singleMetrics.CH + 'px',
        transform:fromTransform && fromTransform !== 'none' ? fromTransform : singleTransformAt(entry.item.fx, entry.item.fy) },
      { width:(gridMetrics.TW - TILE_GAP) + 'px', height:(gridMetrics.TH - TILE_GAP) + 'px',
        transform:targetTransform }
    ], { duration:dur, easing:MORPH_EASE, fill:'forwards' });
    card.style.zIndex = targetFocus ? targetFocus.zIndex : '';
    if (photo && targetFocus) animateRowMorph(photo, [
      { filter:fromFilter },
      { filter:targetFocus.filter }
    ], { duration:dur, easing:MORPH_EASE, fill:'forwards' });
  });

  /* 先让 grid 中心行在旧页背后稳定出现，再把旧页淡出，最后渐显文字。 */
  morphAfter(dur + 70, () => {
    centerItems.forEach(it => { it.t.el.style.opacity = '1'; });
  });
  morphAfter(dur + 200, () => {
    const sliderEl = $('viewSlider');
    sliderEl.style.transition = 'opacity .45s cubic-bezier(.4,0,.15,1)';
    sliderEl.style.opacity = '0';
  });
  morphAfter(dur + 300, () => {
    fadeGridText('in', 550, 0);
  });
  morphAfter(dur + 700, () => {
    setView('grid');
    const sliderEl = $('viewSlider');
    sliderEl.style.transition = '';
    sliderEl.style.opacity = '';
    sliderEl.style.visibility = '';
  });
  morphAfter(dur + 1050, () => {
    clearRowMorphAnims();
    gridEl.style.transition = '';
    gridEl.style.opacity = '';
    gridEl.style.visibility = '';
    gridTiles.forEach(it => {
      it.t.el.style.opacity = '';
      gridTextLabels(it.t.el).forEach(label => { label.style.opacity = ''; });
    });
    resetSliderChromeOpacity();
    document.body.classList.remove('is-morphing');
    morphing = false;
    applyGrid();
  });
  return true;
}

function morphGridToSlider(){
  const near = anchorFromGrid();
  if (!near || near.row === undefined || near.col === undefined) return false;

  sliderAnchor = { filterKey:sliderFilterKey(), photoId:near.photo.id, row:near.row };
  renderSlider();
  const rowMap = singleRowMap();
  if (!rowMap) return false;

  const pairs = [];
  rowMap.forEach(entry => {
    const item = gridTiles.find(it => it.i === near.item.i + entry.rel && it.j === near.item.j);
    if (item) pairs.push({ entry:entry, item:item });
  });
  const centerItems = new Set(pairs.map(pair => pair.item));
  const dur = MORPH_BASE_S * 1000;
  if (state.focus) applySingle(true);

  /* slider 文字/刻度先保持隐藏，等照片中心行交接完成后再渐显。 */
  setSliderChromeOpacity(0);

  /* 离开 grid 时，文字先平缓渐隐，留下纯照片中心行参与页面交接。 */
  fadeGridText('out', 550, 120);

  gridTiles.forEach(it => {
    if (centerItems.has(it)) return;
    const worldRow = Math.floor(view.y / gridMetrics.TH) - 1 + it.j;
    const dist = Math.abs(worldRow - near.row);
    const delay = Math.min(520, dist * 90);
    animateRowMorph(it.t.el, [{ opacity:1 }, { opacity:0 }], {
      duration:Math.max(520, dur - delay), delay:delay,
      easing:'cubic-bezier(.4,0,.15,1)', fill:'both'
    });
  });

  pairs.forEach(pair => {
    const entry = pair.entry, item = pair.item;
    const fromTransform = getComputedStyle(item.t.el).transform;
    animateRowMorph(item.t.el, [
      { width:(gridMetrics.TW - TILE_GAP) + 'px', height:(gridMetrics.TH - TILE_GAP) + 'px',
        transform:fromTransform && fromTransform !== 'none' ? fromTransform : 'translate3d(' + item.fx + 'px,' + item.fy + 'px,0)' },
      { width:singleMetrics.CW + 'px', height:singleMetrics.CH + 'px',
        transform:singleTransformAt(entry.item.fx, entry.item.fy, state.focus) }
    ], { duration:dur, easing:MORPH_EASE, fill:'forwards' });
  });

  /* 先让 slider 中心行在 grid 上方淡入，待它完全可见后再收起 grid。 */
  morphAfter(dur + 70, () => {
    const sliderEl = $('viewSlider');
    sliderEl.style.visibility = 'visible';
    sliderEl.style.transition = 'none';
    sliderEl.style.opacity = '0';
  });
  morphAfter(dur + 90, () => {
    const sliderEl = $('viewSlider');
    sliderEl.style.transition = 'opacity .45s cubic-bezier(.4,0,.15,1)';
    sliderEl.style.opacity = '1';
  });
  morphAfter(dur + 600, () => {
    setView('slider');
    const sliderEl = $('viewSlider');
    sliderEl.style.transition = '';
    sliderEl.style.opacity = '';
    sliderEl.style.visibility = '';
    fadeSliderChrome('in', 420, 0);
  });
  morphAfter(dur + 1050, () => {
    clearRowMorphAnims();
    applyGrid();
    applySingle();
    gridTiles.forEach(it => {
      it.t.el.style.opacity = '';
      gridTextLabels(it.t.el).forEach(label => { label.style.opacity = ''; });
    });
    resetSliderChromeOpacity();
    document.body.classList.remove('is-morphing');
    morphing = false;
  });
  return true;
}

function morphTo(target){
  const from = state.view;
  if (from === 'list' || target === 'list') return false;

  morphing = true;
  cancelSliderSnap();
  clearMorphTimers();
  gridTiles.forEach(it => {
    gridTextLabels(it.t.el).forEach(label => { label.style.opacity = ''; });
  });
  clearRowMorphAnims();
  document.body.classList.add('is-morphing');
  cancelGridSnap();

  const ok = target === 'grid' ? morphSliderToGrid() : morphGridToSlider();
  if (!ok){
    clearRowMorphAnims();
    setView(from);
    document.body.classList.remove('is-morphing');
    morphing = false;
    return false;
  }
  return true;
}
$('stage').addEventListener('wheel', e => {
  if (morphing) return;
  if ($('booth').classList.contains('is-open')) return;
  if ($('colophon').classList.contains('is-open')) return;

  if (spiral && state.view === 'list'){   /* 只有 INDEX 才走螺旋；否则 SINGLE/GRID 的滚轮永远轮不到 */
    e.preventDefault();
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    /* 快对齐整张时阻力稍大一点，手感更"吸" */
    const prox = 1 - clampNum(Math.abs(spiral.target - Math.round(spiral.target)) / 0.34, 0, 1);
    /* 步幅与 SINGLE 对齐：SINGLE 每 1px delta ≈ 1/485 张卡，这里每 1 单位 delta 也推进 1/485 个槽位 */
    spiral.target += d * 0.00310 * (1 - prox * 0.42);
    startSpiralTick();
    /* 停稳后磁吸：让某张照片正好落在焦点位置 */
    clearTimeout(spiralSnapTimer);
    spiralSnapTimer = setTimeout(() => {
      if (!spiral) return;
      spiral.target = Math.round(spiral.target);
      startSpiralTick();
    }, 150);
    return;
  }
  if (state.view === 'grid' && gridTiles.length){
    e.preventDefault();
    clearTimeout(gridSnapTimer);
    stopGridAnim();
    const dx = e.shiftKey ? e.deltaY : e.deltaX;
    const dy = e.shiftKey ? 0 : e.deltaY;
    const tx = gridSnapXTargetAt(gridTargetX);
    const ty = gridSnapYTargetAt(gridTargetY);
    const px = 1 - clampNum(Math.abs(tx - gridTargetX) / (gridMetrics.TW * .36), 0, 1);
    const py = 1 - clampNum(Math.abs(ty - gridTargetY) / (gridMetrics.TH * .36), 0, 1);
    gridTargetX += dx * (1 - px * .35);
    gridTargetY += dy * (1 - py * .35);
    startGridAnim();
    gridSnapTimer = setTimeout(() => {
      gridTargetX = gridSnapXTargetAt(gridTargetX);
      gridTargetY = gridSnapYTargetAt(gridTargetY);
      startGridAnim();
    }, 150);
  } else if (state.view === 'slider' && singleCards.length){
    e.preventDefault();
    clearTimeout(sliderSnapTimer);
    stopSliderAnim();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    const S = sliderStep();
    const target = sliderSnapTargetAt(sliderTargetX);
    const proximity = 1 - clampNum(Math.abs(target - sliderTargetX) / (S * .34), 0, 1);
    sliderTargetX += delta * (1 - proximity * .55);
    sliderWheelScrolling = true;
    sliderWheelSettlePending = true;
    $('viewSlider').classList.add('is-wheel-scrolling');
    startSliderAnim();
    sliderSnapTimer = setTimeout(() => {
      sliderTargetX = sliderSnapTargetAt(sliderTargetX);
      startSliderAnim();
    }, 150);
  } else if (state.view === 'list' && listField){
    e.preventDefault();
    clearTimeout(listSnapTimer);
    stopListAnim();
    listTargetY += e.deltaY || e.deltaX;
    startListAnim();
    /* 停稳后磁吸：让某一行正好落在视口垂直中线上 */
    listSnapTimer = setTimeout(() => {
      if (!listMetrics.rowH) return;
      listTargetY = Math.round(listTargetY / listMetrics.rowH) * listMetrics.rowH;
      startListAnim();
    }, 140);
  }
}, { passive:false });

/* 该成员在当前筛选下的第一张照片（找不到就退回该成员任意一张） */
function memberLeadPhoto(m){
  return filtered().find(p => p.memberId === m.id && p.src) ||
         PHOTOS.find(p => p.memberId === m.id && p.src) || null;
}

/* INDEX 行：只显示成员名（七行 = 一个循环） */
function appendListRow(field, m){
  const row = document.createElement('button');
  row.type = 'button';
  row.className = 'list-row is-member';
  row.dataset.cursor = 'VIEW THIS';
  row.dataset.member = m.id;
  row.innerHTML = '<span class="lr-tick"></span><span class="lr-member">' + m.name + '</span>';
  row.onmouseenter = () => setMetaMember(m);
  row.onclick = () => openSpiral(m);
  field.appendChild(row);
  return row;
}

function applyList(force){
  if (!listField || !listMetrics.cycleH) return;
  const offset = -mod(listScrollY, listMetrics.cycleH);
  /* 整列（名字 + 刻度）整体向左偏移；偏移量随视口宽度走 */
  listField.style.transform = 'translate3d(' + (-listMetrics.shiftX) + 'px,' + offset + 'px,0)';
  paintListRows(offset, force);
}

/* 以视口垂直中线为焦点：越远越小、越淡，上下对称，±3 行处完全隐去。
   只写变化的行，且只改 transform / opacity（不触发重排），保证滚动顺滑。 */
function paintListRows(offset, force){
  const { rowH, centerY, fieldTop } = listMetrics;
  if (!rowH) return;
  const rows = listField.children;
  for (let i = 0; i < rows.length; i++){
    const row = rows[i];
    const cy = fieldTop + offset + i * rowH + rowH / 2;   // 该行中心的屏幕 y
    const d = (cy - centerY) / rowH;                   // 距焦点多少行（正=下方）
    const t = Math.min(1, Math.abs(d) / 3);
    const e = t * t * (3 - 2 * t);                     // smoothstep
    const scale = 1 - 0.55 * e;
    const op = 1 - e;
    const tickK = 2.2 - 1.5 * e;
    if (!force && row.__s === scale && row.__o === op) continue;
    row.__s = scale; row.__o = op;
    const name = row.querySelector('.lr-member');
    if (name) name.style.transform = 'scale(' + scale.toFixed(3) + ')';
    row.style.opacity = op.toFixed(3);
    const tick = row.querySelector('.lr-tick');
    if (tick){
      tick.style.transform = 'translateY(-50%) scaleX(' + tickK.toFixed(3) + ')';
      tick.style.opacity = (0.10 + 0.55 * (1 - e)).toFixed(3);
    }
  }
}

function stopListAnim(){
  if (listRaf) cancelAnimationFrame(listRaf);
  listRaf = 0;
  listLastFrame = 0;
}

function stepListAnim(now){
  if (!listLastFrame) listLastFrame = now;
  const dt = Math.min(34, Math.max(8, now - listLastFrame));
  listLastFrame = now;
  const diff = listTargetY - listScrollY;
  const ease = 1 - Math.pow(.88, dt / 16.67);
  if (Math.abs(diff) > .06){
    listScrollY += clampNum(diff * ease, -18, 18);
    applyList();
    listRaf = requestAnimationFrame(stepListAnim);
  } else {
    listScrollY = listTargetY;
    applyList();
    listRaf = 0;
    listLastFrame = 0;
  }
}

function startListAnim(){
  if (!listRaf) listRaf = requestAnimationFrame(stepListAnim);
}

function cancelListAnim(){
  stopListAnim();
  listTargetY = listScrollY;
}

function gestureCursor(active){
  const cursor = $('cursor');
  const label = $('cursorLabel');
  if (!cursor) return;
  cursor.classList.toggle('is-grabbing', !!active);
  if (active || state.gestures) cursor.classList.add('is-grab');
  else cursor.classList.remove('is-grab', 'is-grabbing');
  if (active && label){
    cursor.classList.add('has-label');
    label.textContent = 'DRAG';
  }
  document.body.classList.toggle('is-dragging', !!active);
}

function cancelGestureLongPress(){
  clearTimeout(gestureDrag.longPressTimer);
  gestureDrag.longPressTimer = 0;
  gestureDrag.armed = false;
}

function captureGesturePointer(pointerId){
  try { if ($('stage').setPointerCapture) $('stage').setPointerCapture(pointerId); } catch (err) {}
}

function beginGestureDrag(e, longPress){
  if (!gestureDrag.armed && !gestureDrag.active) return;
  cancelSliderSnap();
  cancelGridSnap();
  gestureDrag.active = true;
  gestureDrag.armed = false;
  gestureDrag.longPressed = !!longPress;
  gestureDrag.x = e.clientX;
  gestureDrag.y = e.clientY;
  gestureDrag.startX = e.clientX;
  gestureDrag.startY = e.clientY;
  gestureDrag.moved = false;
  gestureCursor(true);
  if (longPress) captureGesturePointer(e.pointerId);
}

function endGestureDrag(e){
  cancelGestureLongPress();
  if (!gestureDrag.active) return;
  gestureDrag.active = false;
  gestureCursor(false);
  if (e && $('stage').hasPointerCapture && $('stage').hasPointerCapture(e.pointerId)){
    $('stage').releasePointerCapture(e.pointerId);
  }
  if (state.view === 'slider'){
    sliderTargetX = sliderSnapTargetAt(view.x);
    startSliderAnim();
  } else if (state.view === 'grid'){
    gridTargetX = gridSnapXTargetAt(view.x);
    gridTargetY = gridSnapYTargetAt(view.y);
    startGridAnim();
  }
}

$('stage').addEventListener('pointerdown', e => {
  if (!e.target.closest('#viewSlider,#viewGrid')) return;
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  cancelGestureLongPress();
  gestureDrag.id = e.pointerId;
  gestureDrag.x = e.clientX;
  gestureDrag.y = e.clientY;
  gestureDrag.startX = e.clientX;
  gestureDrag.startY = e.clientY;
  gestureDrag.moved = false;
  gestureDrag.longPressed = false;

  if (state.gestures){
    gestureDrag.armed = true;
    beginGestureDrag(e, false);
  } else if (e.pointerType === 'mouse'){
    gestureDrag.armed = true;
    // 长按判定时长（越短越灵敏；太短会和「单击选照片」冲突）
    gestureDrag.longPressTimer = setTimeout(() => {
      if (!gestureDrag.armed) return;
      beginGestureDrag({ pointerId:gestureDrag.id, clientX:gestureDrag.x, clientY:gestureDrag.y }, true);
    }, 180);
  }
});

$('stage').addEventListener('pointermove', e => {
  if (e.pointerId !== gestureDrag.id) return;

  if (!gestureDrag.active){
    if (gestureDrag.armed && Math.hypot(e.clientX - gestureDrag.x, e.clientY - gestureDrag.y) > 6){
      cancelGestureLongPress();
    }
    return;
  }

  if (!gestureDrag.moved){
    if (Math.hypot(e.clientX - gestureDrag.startX, e.clientY - gestureDrag.startY) <= 4) return;
    gestureDrag.moved = true;
    gestureDrag.x = gestureDrag.startX;
    gestureDrag.y = gestureDrag.startY;
    captureGesturePointer(e.pointerId);
  }

  const dx = e.clientX - gestureDrag.x;
  const dy = e.clientY - gestureDrag.y;
  gestureDrag.x = e.clientX;
  gestureDrag.y = e.clientY;

  if (state.view === 'slider'){
    view.x -= dx;
    sliderTargetX = view.x;
    applySingle();
  } else if (state.view === 'grid'){
    view.x -= dx;
    view.y -= dy;
    gridTargetX = view.x;
    gridTargetY = view.y;
    applyGrid();
  }
  e.preventDefault();
});

$('stage').addEventListener('pointerup', e => {
  if (e.pointerId !== gestureDrag.id) return;
  const moved = gestureDrag.moved;
  endGestureDrag(e);
  if (moved) e.preventDefault();
});

$('stage').addEventListener('pointercancel', endGestureDrag);

$('stage').addEventListener('click', e => {
  if (gestureDrag.moved || gestureDrag.longPressed){
    e.preventDefault();
    e.stopPropagation();
    gestureDrag.moved = false;
    gestureDrag.longPressed = false;
  }
}, true);

function renderList(flight){
  const wrap = $('viewList');
  if (spiral) destroySpiral();       /* 视图切换/重渲染时把螺旋收掉 */
  cancelListAnim();
  /* INDEX 不再有「成员名字」层级：直接呈现环形照片墙
     （成员筛选已由右上角的 MEMBER 分类承担） */
  wrap.innerHTML = '';
  listField = null;
  if (!filtered().length){
    const p = document.createElement('p');
    p.className = 'wall-empty';
    p.textContent = 'NO PHOTOS IN THIS COMBINATION';
    wrap.appendChild(p);
    return;
  }
  openSpiral(flight);
  return;

  wrap.innerHTML = '';
  listField = document.createElement('div');
  listField.className = 'list-field';
  wrap.appendChild(listField);

  /* INDEX 只列七位成员的名字：七行 = 一个循环 */
  const rows = MEMBERS.slice();
  if (!rows.length){
    listMetrics = { rowH:0, cycleH:0 };
    return;
  }

  const firstRow = appendListRow(listField, rows[0]);
  const rowH = firstRow.getBoundingClientRect().height || 92;
  const cycleH = Math.max(1, rowH * rows.length);
  const vh = wrap.clientHeight || window.innerHeight;
  const repeat = Math.max(3, Math.ceil(vh / cycleH) + 3);

  for (let r = 0; r < repeat; r++){
    for (let i = 0; i < rows.length; i++){
      if (r === 0 && i === 0) continue;
      appendListRow(listField, rows[i]);
    }
  }

  /* 让「第一行」的中心正好落在视口垂直中线上 */
  const fieldTop = Math.max(0, Math.round((vh - rowH) / 2));
  listField.style.top = fieldTop + 'px';
  const vw = wrap.clientWidth || window.innerWidth;
  listMetrics = { rowH:rowH, cycleH:cycleH, vh:vh, centerY:vh / 2, fieldTop:fieldTop, shiftX:Math.round(vw * 0.16) };
  listScrollY = 0;
  listTargetY = 0;
  applyList(true);
}

/* 左侧分类文字：由「聚焦卡」驱动，不跟鼠标 */
function setCatText(p){
  const el = $('metaCat');
  if (!el) return;
  const txt = (p && p.cat) || '';
  if (el.textContent !== txt) el.textContent = txt;
}

/* INDEX 左下角：编号 + 成员行，同样由焦点卡驱动 */
function setFocusMeta(p){
  if (!p) return;
  const idx = $('metaIndex');
  if (idx) idx.textContent = '№' + number(p);
  const nm = $('metaName');
  if (nm) nm.textContent = p.member.toUpperCase() + ' · ' + p.collectionLabel;
  setCatText(p);
}

/* 分类文字：离开 INDEX 时最先消失，进入 INDEX 时最后出现。
   catArmed 只在"入场延迟到点"后置真，避免过渡中鼠标压在环形卡上把文字提前点亮 */
let catArmed = false;
function setCatVisible(on, delay){
  const el = $('metaCat');
  if (!el) return;
  clearTimeout(el._catT);
  if (on){
    el._catT = setTimeout(function(){ el.classList.add('is-on'); catArmed = true; }, delay || 0);
  } else {
    catArmed = false;
    el.classList.remove('is-on');
  }
}

function setMeta(p){
  if (state.view === 'list') return;   /* INDEX 的左下角由焦点卡驱动 */
  $('metaIndex').textContent = '№' + number(p);
  $('metaName').textContent = p.member.toUpperCase() + ' · ' + p.collectionLabel;
  /* 左侧分类文字不再跟随鼠标：由 INDEX 的焦点卡决定（见 spiralTick） */
}

function setMetaMember(m){
  $('metaIndex').textContent = '';
  $('metaCat').textContent = '';
  $('metaName').textContent = m.name.toUpperCase() + ' · MEMBER';
}

let ringBusy = false;   /* INDEX 进场 / 退场动画进行中 */
let gridPrefaded = false;   /* INDEX→GRID 时网格已提前淡入 */
let gridSnapState = null;   /* INDEX→GRID 收拢前量落点时的网格滚动位置 */

let viewToggleTimer = 0;
function setViewToggleActive(v, immediate){
  clearTimeout(viewToggleTimer);
  viewToggleTimer = 0;
  const active = document.querySelector('#viewToggle .is-active');
  if (active && active.dataset.view === v) return;
  const apply = () => {
    document.querySelectorAll('#viewToggle button').forEach(b => {
      b.classList.toggle('is-active', b.dataset.view === v);
    });
  };
  if (immediate) apply();
  else viewToggleTimer = setTimeout(apply, 330);
}

function selectView(v){
  if (morphing || ringBusy || state.view === v) return;
  setViewToggleActive(v);
  const from = state.view;
  if (from === 'list') setCatVisible(false, 0);   /* 离开 INDEX：文字先走 */

  /* INDEX → 其他视图：先收拢成目标视图的一排/一格，再切 */
  if (from === 'list' && v !== 'list'){
    const p = spiralFocusPhoto();
    cancelListAnim();
    /* 先记下焦点：目标视图要按它重排，收拢的落点才准 */
    if (p){
      if (v === 'slider') sliderAnchor = { filterKey: sliderFilterKey(), photoId: p.id, row: 0 };
      if (v === 'grid') pendingGridAnchor = p;
    }
    ringBusy = true;
    collapseSpiral(v, function(){
      ringBusy = false;
      applyView(v, 'list', null, true);
    });
    return;
  }

  let flight = null;
  if (v === 'list'){
    /* 其他视图 → INDEX：把当前中心那张带进环形当焦点 */
    pendingSpiralAnchor = currentFocusPhoto(from);
    spiralFrom = from === 'grid' ? 'grid' : 'slider';
    if (!reducedMotion()){
      if (from === 'slider') flight = captureRowRects();
      else if (from === 'grid') flight = captureGridRects();
    }
  }
  applyView(v, from, flight);
}

function applyView(v, from, flight, skipWipe){
  /* slider ↔ grid 走形变；其他组合按下面的规则交叉淡变 */
  if ((state.view === 'slider' && v === 'grid') || (state.view === 'grid' && v === 'slider')){
    if (morphTo(v)) return;
  }
  const targetEl = $(v === 'grid' ? 'viewGrid' : v === 'slider' ? 'viewSlider' : 'viewList');

  const prefaded = (v === 'grid' && gridPrefaded);
  gridPrefaded = false;
  if (skipWipe && !prefaded){
    /* INDEX → 其他：行卡直接就位；网格改为淡入，和环形淡出交叉 */
    targetEl.style.transition = 'none';
    targetEl.style.opacity = (v === 'grid') ? '0' : '1';
  }

  /* GRID → INDEX：网格淡出，而不是瞬间消失（也就是去掉黑屏遮罩） */
  const gridFadeOut = (v === 'list' && from === 'grid');

  state.view = v;
  ['grid', 'slider', 'list'].forEach(k => {
    const el = $(k === 'grid' ? 'viewGrid' : k === 'slider' ? 'viewSlider' : 'viewList');
    if (k === v){ el.setAttribute('aria-hidden', 'false'); return; }
    if (gridFadeOut && k === 'grid'){
      el.style.pointerEvents = 'none';
      el.style.transition = 'opacity 1100ms cubic-bezier(.4,0,.2,1)';
      el.style.opacity = '0';
      setTimeout(function(){
        el.style.transition = ''; el.style.opacity = ''; el.style.pointerEvents = '';
        if (state.view !== 'grid') el.setAttribute('aria-hidden', 'true');
      }, 1140);
      return;
    }
    el.setAttribute('aria-hidden', 'true');
  });
  setViewToggleActive(v);
  if (v === 'grid'){
    if (prefaded){
      /* INDEX→GRID：恢复成「量落点时」的网格位置，保证飞行卡落点与最终 tile 完全一致 */
      if (gridSnapState){
        view.x = gridSnapState.x; view.y = gridSnapState.y;
        gridTargetX = view.x; gridTargetY = view.y;
        if (typeof applyGrid === 'function') applyGrid();
      }
      gridSnapState = null;
      pendingGridAnchor = null;
    } else {
      renderGrid();
      if (pendingGridAnchor){ centerGridOnPhoto(pendingGridAnchor, 0); pendingGridAnchor = null; }
    }
  }
  if (v === 'slider') renderSlider();
  if (v === 'list') renderList(flight);

  if (v === 'list') return;   /* INDEX 入场：不擦除、不整页淡入 */

  if (skipWipe){
    if (prefaded){
      /* 已在 collapseSpiral 里提前淡入，这里不再重复 */
    } else if (v === 'grid'){
      requestAnimationFrame(function(){
        targetEl.style.transition = 'opacity 820ms cubic-bezier(.4,0,.2,1)';
        targetEl.style.transitionDelay = '160ms';
        targetEl.style.opacity = '1';
        setTimeout(function(){
          targetEl.style.transition = ''; targetEl.style.transitionDelay = ''; targetEl.style.opacity = '';
        }, 1060);
      });
    } else {
      requestAnimationFrame(function(){ targetEl.style.transition = ''; targetEl.style.opacity = ''; });
    }
    return;
  }

  const active = $(v === 'grid' ? 'viewGrid' : v === 'slider' ? 'viewSlider' : 'viewList');
  const anim = active.animate(
    [{ opacity:0, clipPath:'inset(0 0 0 100%)' }, { opacity:1, clipPath:'inset(0 0 0 0)' }],
    { duration:900, easing:'cubic-bezier(.887,0,.113,1)' }
  );
  anim.finished.then(() => anim.cancel()).catch(() => {});
}

$('viewToggle').addEventListener('click', e => {
  const b = e.target.closest('button[data-view]');
  if (b) selectView(b.dataset.view);
});
/* ---------- DIGITAL PHOTOCARD EXPERIENCE ---------- */

function geneCode(p){
  const raw = (p.id || 'xg') + p.member + p.collectionLabel;
  let h = 0;
  for (let i = 0; i < raw.length; i++) h = (h * 33 + raw.charCodeAt(i)) >>> 0;
  return 'XG-' + p.member.slice(0, 2).toUpperCase() + '-' + String(h).slice(-6).padStart(6, '0');
}

function setExperienceStage(step, title, copy, kicker){
  $('boothStep').textContent = step;
  $('experienceTitle').textContent = title;
  $('experienceCopy').textContent = copy;
  $('experienceKicker').textContent = kicker;
}

function renderOptionGroup(id, items, current, key){
  const wrap = $(id);
  wrap.innerHTML = '';
  const group = wrap.closest('.experience-group');
  if (group) group.hidden = items.length === 0;
  items.forEach(item => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = current === item.id ? 'is-active' : '';
    b.dataset.option = item.id;
    b.dataset.group = key;
    b.textContent = item.name || item.id;
    b.title = item.note || item.name || item.id;
    b.onclick = () => {
      // 再点一次同一个选项 = 取消选择
      state.booth[key] = (state.booth[key] === item.id) ? null : item.id;
      renderOptionGroup(id, items, state.booth[key], key);
      applyBooth();
    };
    wrap.appendChild(b);
  });
}

function loadLanyardModule(){
  if (!lanyardModulePromise){
    lanyardModulePromise = Promise.resolve(window.XGLanyard).then(mod => {
      if (!mod) throw new Error('Lanyard runtime not loaded');
      return mod;
    });
  }
  return lanyardModulePromise;
}

function destroyLanyardPass(){
  lanyardLoadToken++;
  if (lanyardController){
    try { lanyardController.destroy(); } catch (err) { console.warn('Lanyard cleanup failed', err); }
    lanyardController = null;
  }
  const stage = $('experienceStage');
  if (stage) stage.classList.remove('is-lanyard-live');
}

async function activateLanyardPass(options = {}){
  const reveal = options.reveal !== false;
  if (!state.booth.photo) return false;
  destroyLanyardPass();
  const token = lanyardLoadToken;
  const mod = await loadLanyardModule();
  if (token !== lanyardLoadToken || !state.booth.photo) return false;
  if (!mod.supportsWebGL()) throw new Error('WebGL unavailable');

  const frontCanvas = await buildCardCanvas('auto');
  const backCanvas = buildBackCardCanvas();
  if (token !== lanyardLoadToken || !state.booth.photo) return false;
  /* file:// 下本地照片会让 Canvas 跨源污染，Three.js 无法上传纹理；
     这时保留现有 CSS 3D 卡片作为降级方案，避免空白 WebGL 画布。 */
  try { frontCanvas.getContext('2d').getImageData(0, 0, 1, 1); }
  catch (err) { throw new Error('Local photo texture is browser-protected; CSS fallback required'); }
  const stage = $('experienceStage');
  const frame = $('boothFrame');
  lanyardController = mod.createLanyardPass({
    stage,
    frontCanvas,
    backCanvas,
    getCardRect: () => frame.getBoundingClientRect(),
    onError: err => console.warn('Lanyard render warning', err)
  });
  if (reveal) stage.classList.add('is-lanyard-live');
  return true;
}

function applyCardTransform(){
  const b = state.booth;
  const frame = $('boothFrame');
  if (!frame || lanyardController) return;
  const flip = b.back ? 180 : 0;
  frame.style.transform = 'rotateX(' + b.rotX + 'deg) rotateY(' + (b.rotY + flip) + 'deg)';
}

/* ---------- 贴纸：侧边选择 + 卡面拖动 / 缩放 / 旋转 ---------- */
const clamp01 = v => v < 0 ? 0 : (v > 1 ? 1 : v);
const clampRange = (v, lo, hi) => v < lo ? lo : (v > hi ? hi : v);

function placedSticker(id){ return state.booth.stickers.find(s => s.id === id) || null; }

function renderStickerCats(){
  const wrap = $('stickerCats');
  if (!wrap) return;
  wrap.innerHTML = '';
  CATEGORIES.forEach(c => {
    const n = c.id === 'all' ? STICKERS.length : STICKERS.filter(s => s.cat === c.id).length;
    if (n === 0) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sticker-cat' + (state.booth.stickerCat === c.id ? ' is-active' : '');
    b.dataset.cat = c.id;
    b.textContent = c.name + ' ' + n;
    b.onclick = () => {
      // 再点一次同一个分类 = 取消筛选
      state.booth.stickerCat = (state.booth.stickerCat === c.id) ? null : c.id;
      renderStickerCats();
      renderStickerButtons();
    };
    wrap.appendChild(b);
  });
}

function renderStickerButtons(){
  const wrap = $('boothCores');
  if (!wrap) return;
  wrap.innerHTML = '';
  const group = wrap.closest('.experience-group');
  if (group) group.hidden = STICKERS.length === 0;
  const cat = state.booth.stickerCat;
  if (!cat){
    const hint = document.createElement('p');
    hint.className = 'sticker-hint';
    hint.textContent = 'SELECT A CATEGORY ABOVE';
    wrap.appendChild(hint);
    return;
  }
  const list = STICKERS.filter(s => s.cat === cat);
  list.forEach(def => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sticker-btn' + (placedSticker(def.id) ? ' is-active' : '');
    btn.dataset.sticker = def.id;
    btn.textContent = def.name;
    btn.title = def.name + ' · ' + def.cat + (placedSticker(def.id) ? ' — click to remove' : ' — click to add');
    btn.style.setProperty('--thumb', "url('" + def.thumb + "')");
    btn.onclick = () => toggleSticker(def.id);
    wrap.appendChild(btn);
  });
}
function toggleSticker(id){
  const def = stickerDef(id);
  if (!def) return;
  const i = state.booth.stickers.findIndex(s => s.id === id);
  if (i >= 0){
    state.booth.stickers.splice(i, 1);
    if (state.booth.selectedSticker === id) state.booth.selectedSticker = null;
  } else {
    state.booth.stickers.push({ id: id, x: def.x, y: def.y, s: 1, r: 0 });
    state.booth.selectedSticker = id;   // 新加的自动选中，直接显示控制点
  }
  renderStickers();
  renderStickerCats();
  renderStickerButtons();
  updateOpacityPad();
}

function stickerStyle(el, def, item){
  el.style.left = (item.x * 100) + '%';
  el.style.top = (item.y * 100) + '%';
  el.style.width = (def.w * (item.s || 1) * 100) + '%';
  el.style.transform = 'translate(-50%,-50%) rotate(' + (item.r || 0) + 'deg)';
}

function renderStickers(){
  const layer = $('stickerLayer');
  if (!layer) return;
  layer.innerHTML = '';
  state.booth.stickers.forEach(item => {
    const def = stickerDef(item.id);
    if (!def) return;
    if (item.s == null) item.s = 1;
    if (item.r == null) item.r = 0;
    const el = document.createElement('div');
    el.className = 'sticker-item';
    el.dataset.sticker = def.id;
    stickerStyle(el, def, item);
    const img = document.createElement('img');
    img.src = def.src; img.alt = def.name; img.draggable = false;
    el.appendChild(img);
    attachStickerDrag(el, item);
    layer.appendChild(el);
  });
  refreshStickerSelection();
}

/* 选中态：加/去控制点，不重建 DOM（否则拖拽会断） */
function refreshStickerSelection(){
  const layer = $('stickerLayer');
  if (!layer) return;
  layer.querySelectorAll('.sticker-item').forEach(el => {
    const sel = el.dataset.sticker === state.booth.selectedSticker;
    el.classList.toggle('is-selected', sel);
    const hasHandles = !!el.querySelector('.sticker-handle');
    if (sel && !hasHandles){
      const item = placedSticker(el.dataset.sticker);
      const hs = document.createElement('span'); hs.className = 'sticker-handle sticker-scale';
      const hr = document.createElement('span'); hr.className = 'sticker-handle sticker-rotate';
      el.appendChild(hs); el.appendChild(hr);
      if (item) attachStickerHandles(el, item);
    } else if (!sel && hasHandles){
      el.querySelectorAll('.sticker-handle').forEach(h => h.remove());
    }
  });
}

function selectSticker(id){
  if (state.booth.selectedSticker === id) return;
  state.booth.selectedSticker = id;
  refreshStickerSelection();
}

/* 拖动移动 */
function attachStickerDrag(el, item){
  let start = null;
  el.addEventListener('pointerdown', e => {
    if (e.target.closest('.sticker-handle')) return;   // 控制点自己处理
    e.stopPropagation();
    e.preventDefault();
    selectSticker(item.id);
    const frame = $('boothFrame');
    const w = frame.offsetWidth || 1, h = frame.offsetHeight || 1;
    el.setPointerCapture(e.pointerId);
    el.classList.add('is-dragging');
    state.booth.stickerDrag = true;
    start = { px: e.clientX, py: e.clientY, x: item.x, y: item.y, w: w, h: h };
  });
  el.addEventListener('pointermove', e => {
    if (!start) return;
    e.stopPropagation();
    item.x = clamp01(start.x + (e.clientX - start.px) / start.w);
    item.y = clamp01(start.y + (e.clientY - start.py) / start.h);
    el.style.left = (item.x * 100) + '%';
    el.style.top = (item.y * 100) + '%';
  });
  const end = e => {
    if (!start) return;
    e.stopPropagation();
    start = null;
    state.booth.stickerDrag = false;
    el.classList.remove('is-dragging');
    try { if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId); } catch (err) {}
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
}

/* 两个控制点：右下角缩放、正上方旋转 */
function attachStickerHandles(el, item){
  const def = stickerDef(item.id);
  if (!def) return;
  const centre = () => {
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  };

  const scaleH = el.querySelector('.sticker-scale');
  if (scaleH){
    let s0 = null;
    scaleH.addEventListener('pointerdown', e => {
      e.stopPropagation(); e.preventDefault();
      const c = centre();
      scaleH.setPointerCapture(e.pointerId);
      scaleH.classList.add('is-active');
      state.booth.stickerDrag = true;
      const d = Math.hypot(e.clientX - c.x, e.clientY - c.y) || 1;
      s0 = { d: d, s: item.s || 1 };
    });
    scaleH.addEventListener('pointermove', e => {
      if (!s0) return;
      e.stopPropagation();
      const c = centre();
      const d = Math.hypot(e.clientX - c.x, e.clientY - c.y);
      item.s = clampRange(s0.s * (d / s0.d), 0.15, 8);
      stickerStyle(el, def, item);
    });
    const endS = e => {
      if (!s0) return;
      e.stopPropagation();
      s0 = null;
      state.booth.stickerDrag = false;
      scaleH.classList.remove('is-active');
      try { if (scaleH.hasPointerCapture(e.pointerId)) scaleH.releasePointerCapture(e.pointerId); } catch (err) {}
    };
    scaleH.addEventListener('pointerup', endS);
    scaleH.addEventListener('pointercancel', endS);
  }

  const rotH = el.querySelector('.sticker-rotate');
  if (rotH){
    let r0 = null;
    rotH.addEventListener('pointerdown', e => {
      e.stopPropagation(); e.preventDefault();
      const c = centre();
      rotH.setPointerCapture(e.pointerId);
      rotH.classList.add('is-active');
      state.booth.stickerDrag = true;
      r0 = { a: Math.atan2(e.clientY - c.y, e.clientX - c.x), r: item.r || 0 };
    });
    rotH.addEventListener('pointermove', e => {
      if (!r0) return;
      e.stopPropagation();
      const c = centre();
      const a = Math.atan2(e.clientY - c.y, e.clientX - c.x);
      item.r = Math.round(r0.r + (a - r0.a) * 180 / Math.PI);
      stickerStyle(el, def, item);
    });
    const endR = e => {
      if (!r0) return;
      e.stopPropagation();
      r0 = null;
      state.booth.stickerDrag = false;
      rotH.classList.remove('is-active');
      try { if (rotH.hasPointerCapture(e.pointerId)) rotH.releasePointerCapture(e.pointerId); } catch (err) {}
    };
    rotH.addEventListener('pointerup', endR);
    rotH.addEventListener('pointercancel', endR);
  }
}

/* 点空白处取消选中 */
document.addEventListener('pointerdown', e => {
  if (e.target.closest('.sticker-item')) return;
  if (!state.booth.selectedSticker) return;
  state.booth.selectedSticker = null;
  refreshStickerSelection();
});
/* 卡面绘制：把 03 图层贴图和照片美术放进 .booth-photo 的同一组背景层，
   用 background-blend-mode: multiply 混合。
   注意：不能用 mix-blend-mode —— 卡片外层是 preserve-3d（3D 翻转需要），
   Chrome 在该上下文里会忽略 mix-blend-mode，白底会被原样盖上去。 */
/* ---------- 03 图层：预加载 + 透明度混合 ---------- */
const _layerImg = {};
const _layerTint = {};
let _tintCount = 0;

function preloadLayers(){
  Object.keys(LAYERS).forEach(function(id){
    const src = LAYERS[id];
    if (_layerImg[src]) return;
    const im = new Image();
    im.onload = function(){
      if (state.booth.graphic === id && state.booth.photo) paintPhoto(state.booth.photo);
    };
    im.src = src;
    _layerImg[src] = im;
  });
}

/* 把图层按 alpha 与白色混合：alpha=1 得到原图，alpha=0 得到纯白（正片叠底后无影响） *//* ---------- 03 透明度：光标充能调节 ---------- */
function setLayerOpacity(v){
  const b = state.booth;
  b.layerOpacity = Math.max(0, Math.min(1, v));
  const pct = Math.round(b.layerOpacity * 100);
  paintLayer();
  if ($('opacityValue')) $('opacityValue').textContent = pct + '%';
  if ($('opacityFill')) $('opacityFill').style.width = pct + '%';
  if ($('cursorCharge')) $('cursorCharge').style.height = pct + '%';
  if ($('cursorPct')) $('cursorPct').textContent = pct + '%';
}

/* 充能区是否可用：必须先选中一个 03 图层，否则调了也看不到变化 */
function updateOpacityPad(){
  const pad = $('opacityPad'), note = $('opacityPadNote');
  if (!pad) return;
  const hasLayer = !!LAYERS[state.booth.graphic];
  pad.classList.toggle('is-disabled', !hasLayer);
  pad.setAttribute('aria-disabled', String(!hasLayer));
  if (note) note.textContent = hasLayer ? 'CLICK · THEN SCROLL TO CHARGE' : 'SELECT A LAYER ABOVE FIRST';
  // 图层被取消时，顺手退出充能态
  if (!hasLayer && state.booth.charging) setCharging(false);
}

function setCharging(on){
  const b = state.booth;
  b.charging = !!on;
  const cur = $('cursor'), pad = $('opacityPad');
  if (cur) cur.classList.toggle('is-charging', b.charging);
  if (pad) pad.classList.toggle('is-charging', b.charging);
  if (b.charging){
    setLayerOpacity(1);                       // 点击后初始为全填充
    toast('Scroll to charge opacity — click again to exit');
  } else {
    setLayerOpacity(b.layerOpacity);
  }
}

let opacityPadReady = false;
function initOpacityPad(){
  const pad = $('opacityPad');
  if (!pad) return;
  /* renderAll() 会反复调用本函数：只允许绑一次监听，否则两次 toggle 互相抵消 */
  if (opacityPadReady){ updateOpacityPad(); return; }
  opacityPadReady = true;
  if (state.booth.layerOpacity == null) state.booth.layerOpacity = 1;
  setLayerOpacity(state.booth.layerOpacity);
  updateOpacityPad();
  pad.addEventListener('click', function(e){
    e.stopPropagation();
    if (!LAYERS[state.booth.graphic]){
      toast('Select a graphic layer above first');
      return;
    }
    setCharging(!state.booth.charging);
  });
  pad.addEventListener('keydown', function(e){
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); setCharging(!state.booth.charging); }
  });
  // 滚轮充能 / 放能
  window.addEventListener('wheel', function(e){
    if (!state.booth.charging) return;
    if (!$('booth').classList.contains('is-open')) return;   /* 编辑页已经关了就不再拦截滚轮 */
    e.preventDefault();
    const step = e.shiftKey ? 0.01 : 0.04;
    setLayerOpacity(state.booth.layerOpacity - Math.sign(e.deltaY) * step);
  }, { passive: false });
  // 第二次点击（点别处）退出
  document.addEventListener('click', function(e){
    if (!state.booth.charging) return;
    if (e.target.closest && e.target.closest('#opacityPad')) return;
    setCharging(false);
  });
}
function paintPhoto(p){
  const el = $('boothPhoto');
  /* photoBackground() 返回的是 background 简写（含 center/cover no-repeat），
     必须赋给 background，赋给 backgroundImage 会被浏览器判为无效 → 卡面变黑 */
  el.style.background = photoBackground(p);
  el.style.backgroundBlendMode = '';
}

/* 03 图层：独立元素 + mix-blend-mode:multiply，
   opacity 直接就是图层透明度（数学上带 alpha 的 multiply 等于插值），
   这样不需要 canvas 读取，file:// 下也能正常工作 */
function paintLayer(){
  const el = $('cardLayerFill');
  if (!el) return;
  const src = LAYERS[state.booth.graphic];
  if (!src){
    el.classList.remove('is-on');
    el.style.backgroundImage = '';
    return;
  }
  el.style.backgroundImage = "url('" + src + "')";
  el.style.opacity = (state.booth.layerOpacity == null ? 1 : state.booth.layerOpacity);
  el.classList.add('is-on');
}
function applyBooth(){
  const b = state.booth, p = b.photo;
  if (!p) return;
  $('boothFrame').dataset.core = b.core;
  $('boothFrame').dataset.material = b.material || '';
  $('boothFrame').dataset.graphic = b.graphic || '';
  paintPhoto(p);
  paintLayer();
  const frameImgEl = $('cardFrameImage');
  const frameSrc = CORE_FRAMES[b.core];
  if (frameSrc){
    if (frameImgEl.getAttribute('src') !== frameSrc) frameImgEl.setAttribute('src', frameSrc);
    frameImgEl.hidden = false;
  } else {
    frameImgEl.hidden = true;
    frameImgEl.removeAttribute('src');
  }

  $('boothLabelLeft').textContent = p.custom ? 'MY SHOT' : 'XG';
  $('boothLabelRight').textContent = p.custom ? 'MY SHOT' : '№' + number(p);
  $('boothStamp').textContent = 'UNOFFICIAL FAN MADE PROJECT';
  $('boothBackMeta').textContent = p.member.toUpperCase() + ' · ' + p.collectionLabel;
  $('boothBackGene').textContent = 'GENE CODE ' + geneCode(p);
  $('boothMember').textContent = p.member.toUpperCase();
  $('boothCategory').textContent = p.collectionLabel;
  $('boothGene').textContent = geneCode(p);
  $('boothCardId').textContent = '№' + number(p) + ' / ' + PHOTOS.length;

  applyCardTransform();
  renderStickers();
  renderStickerCats();
  renderStickerButtons();
  updateOpacityPad();
}

function setMakeLabel(label){
  const btn = $('btnMake');
  const text = btn && btn.querySelector('.liquid-morph-label');
  (text || btn).textContent = label;
}

function openBooth(p){
  destroyLanyardPass();
  $('experienceStage').classList.remove('is-activating');
  const b = state.booth;
  b.photo = p;
  b.core = 'core';
  b.material = null;    // 初始无选择
  b.graphic = null;     // 初始无选择
  b.back = false;
  b.made = false;
  b.rotX = 0;
  b.rotY = 0;
  b.dragging = false;
  b.stickers = [];
  b.stickerDrag = false;
  b.selectedSticker = null;
  b.stickerCat = null;
  b.layerOpacity = 1;
  b.charging = false;
  $('boothFrame').classList.remove('is-dragging');
  $('viewerControls').hidden = true;
  $('btnMake').hidden = false;
  $('btnMake').disabled = false;
  $('btnShare').hidden = true;
  setMakeLabel('ACTIVATE CARD');

  renderStickerButtons();
  renderOptionGroup('boothMaterials', MATERIALS, b.material, 'material');
  renderOptionGroup('boothGraphics', GRAPHICS, b.graphic, 'graphic');
  applyBooth();
  setExperienceStage('01 / SCAN', 'Frame captured.', 'Signal locked. Preparing the digital card core.', 'XG CARD LAB / SIGNAL FOUND');
  $('booth').classList.add('is-open');
  $('booth').setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-booth');
  setTimeout(() => {
    if (state.booth.photo === p) setExperienceStage('02 / STICKERS', 'Add your stickers.', 'Pick a category, then tap stickers. Drag to move, corner dot to resize, top dot to rotate.', 'STICKER DECK ONLINE');
  }, 780);
}

function closeBooth(){
  destroyLanyardPass();
  $('experienceStage').classList.remove('is-activating');
  /* 退出编辑时一定要解除"充能态"，否则全局 wheel 会一直 preventDefault，页面滚不动 */
  if (state.booth.charging) setCharging(false);
  state.booth.charging = false;
  $('booth').classList.remove('is-open');
  $('booth').setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-booth');
}

$('boothClose').onclick = closeBooth;

$('btnMake').onclick = () => {
  if (!state.booth.photo) return;

  /* 激活完成后，同一个按钮进入下载状态 */
  if (state.booth.made){
    downloadCard();
    return;
  }

  const btn = $('btnMake');
  const stage = $('experienceStage');
  const photoAtClick = state.booth.photo;
  btn.disabled = true;
  stage.classList.add('is-activating');
  setExperienceStage('05 / ACTIVATE', 'Activating card.', 'Compressing the frame into the card core and building the 3D layer.', 'CORE SYNC / 92%');

  /* Prepare WebGL while the card is still visible, so the eventual swap is a cross-fade
     instead of a blank wait followed by an abrupt canvas replacement. */
  const prepared = activateLanyardPass({ reveal: false }).catch(err => {
    console.warn('Lanyard pass unavailable, using CSS fallback', err);
    return false;
  });

  setTimeout(async () => {
    if (!$('booth').classList.contains('is-open') || state.booth.photo !== photoAtClick) return;
    const ready = await prepared;
    if (!$('booth').classList.contains('is-open') || state.booth.photo !== photoAtClick) return;
    state.booth.made = true;
    btn.disabled = false;
    setMakeLabel('DOWNLOAD PNG');
    $('btnShare').hidden = false;
    $('viewerControls').hidden = false;
    setExperienceStage('06 / 3D VIEW', 'Your card is live.', 'Move the cursor to tilt it. Drag to rotate. Flip to inspect the back.', 'DIGITAL PHOTOCARD / ACTIVE');
    if (ready && lanyardController){
      stage.classList.add('is-lanyard-live');
    } else {
      stage.classList.remove('is-lanyard-live');
      toast('3D lanyard unavailable — using card preview');
    }
    stage.classList.remove('is-activating');
    saveUIState();
    toast('Digital photocard activated');
  }, 650);
};

/* 从「已激活」退回编辑状态，可以继续改再重新激活 */
function backToEdit(){
  const b = state.booth;
  if (!b.made) return;
  destroyLanyardPass();
  b.made = false;
  b.back = false;
  b.rotX = 0; b.rotY = 0; b.dragging = false;
  $('boothFrame').classList.remove('is-dragging');
  $('viewerControls').hidden = true;
  $('btnMake').hidden = false;
  $('btnMake').disabled = false;
  setMakeLabel('ACTIVATE CARD');
  $('btnShare').hidden = true;
  applyCardTransform();
  setExperienceStage('02 / EDIT', 'Back to editing.', 'Adjust stickers, material or graphic layer, then activate the card again.', 'EDIT MODE / RESUMED');
  toast('Back to editing');
}

$('btnFlip').onclick = () => {
  state.booth.back = !state.booth.back;
  if (lanyardController) lanyardController.flip(state.booth.back);
  applyCardTransform();
};
$('btnEditAgain').onclick = backToEdit;
// 顺手支持用 Esc 反悔（仅在已激活时生效）
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && state.booth.made) backToEdit();
});

(function cardViewer3D(){
  const stage = $('experienceStage');
  const frame = $('boothFrame');
  let drag = null;
  stage.addEventListener('pointermove', e => {
    if (lanyardController) return;
    if (state.booth.dragging || state.booth.stickerDrag || !state.booth.made) return;
    const r = stage.getBoundingClientRect();
    const mx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const my = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    state.booth.rotX = clampNum(my * -10, -18, 18);
    state.booth.rotY = clampNum(mx * 14, -22, 22);
    applyCardTransform();
  });
  stage.addEventListener('pointerleave', () => {
    if (lanyardController) return;
    if (!state.booth.dragging && state.booth.made){
      state.booth.rotX = 0; state.booth.rotY = 0; applyCardTransform();
    }
  });
  frame.addEventListener('pointerdown', e => {
    if (lanyardController || !state.booth.made) return;
    state.booth.dragging = true;
    frame.classList.add('is-dragging');
    drag = { x:e.clientX, y:e.clientY, rx:state.booth.rotX, ry:state.booth.rotY };
    try { frame.setPointerCapture(e.pointerId); } catch (err) {}
  });
  frame.addEventListener('pointermove', e => {
    if (lanyardController || !state.booth.dragging || !drag) return;
    state.booth.rotY = drag.ry + (e.clientX - drag.x) * .42;
    state.booth.rotX = clampNum(drag.rx - (e.clientY - drag.y) * .28, -28, 28);
    applyCardTransform();
  });
  const finish = e => {
    if (!state.booth.dragging) return;
    state.booth.dragging = false;
    frame.classList.remove('is-dragging');
    try { if (frame.hasPointerCapture(e.pointerId)) frame.releasePointerCapture(e.pointerId); } catch (err) {}
  };
  frame.addEventListener('pointerup', finish);
  frame.addEventListener('pointercancel', finish);
})();

/* ---------- 导出图片 ---------- */
const CARD_W = 1000, CARD_H = 1400;
const MONO = '"Roboto Mono",Consolas,"Courier New",monospace';
const DISPLAY = 'Arial,"Helvetica Neue",sans-serif';

function roundRect(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function spacedText(ctx, text, x, y, sp, align){
  const chars = Array.from(text);
  const widths = chars.map(c => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + sp * (chars.length - 1);
  let cx = align === 'right' ? x - total : align === 'center' ? x - total / 2 : x;
  chars.forEach((c, i) => { ctx.fillText(c, cx, y); cx += widths[i] + sp; });
}

function drawCover(ctx, img, x, y, w, h){
  const ir = img.width / img.height, br = w / h;
  let sw, sh, sx, sy;
  if (ir > br){ sh = img.height; sw = sh * br; sx = (img.width - sw) / 2; sy = 0; }
  else { sw = img.width; sh = sw / br; sx = 0; sy = (img.height - sh) / 2; }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function loadImage(src){
  return new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
}

async function buildCardCanvas(frameStyle = 'auto'){
  const b = state.booth, p = b.photo;
  const c = document.createElement('canvas');
  c.width = CARD_W; c.height = CARD_H;
  const ctx = c.getContext('2d');
  const pad = 0, top = 0, bottom = 0;   // 卡面无黑边：照片铺满整张卡
  const pw = CARD_W - pad * 2, ph = CARD_H - top - bottom;

  ctx.fillStyle = '#09090c';
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  ctx.save();
  ctx.beginPath(); ctx.rect(pad, top, pw, ph); ctx.clip();
  if (p.src){
    const img = await loadImage(p.src);
    if (img) drawCover(ctx, img, pad, top, pw, ph);
    else { ctx.fillStyle = p.c1; ctx.fillRect(pad, top, pw, ph); }
  } else {
    const g = ctx.createLinearGradient(pad, top, pad + pw, top + ph);
    g.addColorStop(0, p.c1); g.addColorStop(.48, mixHex(p.c1, p.c2, .38)); g.addColorStop(1, '#191521');
    ctx.fillStyle = g; ctx.fillRect(pad, top, pw, ph);
    const rg = ctx.createRadialGradient(pad + pw * .76, top + ph * .1, 0, pad + pw * .76, top + ph * .1, pw);
    rg.addColorStop(0, hexA(p.c2, .58)); rg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rg; ctx.fillRect(pad, top, pw, ph);
  }

  if (b.material){
  const holo = ctx.createLinearGradient(pad, top, pad + pw, top + ph);
  if (b.material === 'hologram'){
    holo.addColorStop(0, 'rgba(255,47,63,.32)');
    holo.addColorStop(.36, 'rgba(103,255,229,.26)');
    holo.addColorStop(.64, 'rgba(126,108,255,.28)');
    holo.addColorStop(1, 'rgba(255,255,255,.04)');
  } else if (b.material === 'chrome'){
    holo.addColorStop(0, 'rgba(255,255,255,.56)');
    holo.addColorStop(.22, 'rgba(255,255,255,0)');
    holo.addColorStop(.58, 'rgba(163,183,255,.2)');
    holo.addColorStop(1, 'rgba(255,255,255,.25)');
  } else if (b.material === 'resin'){
    holo.addColorStop(0, 'rgba(255,47,63,.28)');
    holo.addColorStop(.58, 'rgba(255,255,255,.12)');
    holo.addColorStop(1, 'rgba(0,0,0,.28)');
  } else {
    holo.addColorStop(0, 'rgba(255,255,255,.46)');
    holo.addColorStop(.4, 'rgba(255,255,255,0)');
    holo.addColorStop(1, 'rgba(255,255,255,.16)');
  }
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = holo; ctx.fillRect(pad, top, pw, ph);
  ctx.globalCompositeOperation = 'source-over';
  }

  // 03 图层：正片叠底画进导出图
  if (b.graphic && LAYERS[b.graphic]){
    const lImg = await loadImage(LAYERS[b.graphic]);
    if (lImg){
      ctx.globalAlpha = (b.layerOpacity == null ? 1 : b.layerOpacity);
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(lImg, 0, 0, CARD_W, CARD_H);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
  }


  ctx.restore();

  // 卡框：贴图实现。命中 CORE_FRAMES 就把贴图整张拉伸铺满卡片
  // （贴图比例和卡片不一致时直接拉伸，不裁切、不留白）
  const frameSrc = frameStyle === 'auto' ? CORE_FRAMES[b.core] : null;
  const frameImg = frameSrc ? await loadImage(frameSrc) : null;
  // 贴纸：按记录的位置 / 缩放 / 旋转画进导出图（可多个叠加）
  for (const s of (b.stickers || [])){
    const def = stickerDef(s.id);
    if (!def) continue;
    const sImg = await loadImage(def.src);
    if (!sImg) continue;
    const sw = def.w * (s.s || 1) * CARD_W;
    const sh = sw * (sImg.height / sImg.width);
    ctx.save();
    ctx.translate(s.x * CARD_W, s.y * CARD_H);
    ctx.rotate((s.r || 0) * Math.PI / 180);
    ctx.drawImage(sImg, -sw / 2, -sh / 2, sw, sh);
    ctx.restore();
  }
  if (frameImg) ctx.drawImage(frameImg, 0, 0, CARD_W, CARD_H);
  ctx.fillStyle = '#f6f1e7';
  ctx.font = '600 31px ' + MONO;
  ctx.fillText(p.custom ? 'MY SHOT' : 'XG', 66, 62);
  ctx.textAlign = 'right';
  ctx.fillText('№' + number(p), CARD_W - 66, 62);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ff2f3f';
  ctx.font = '600 24px ' + MONO;
  ctx.fillText('DIGITAL PHOTOCARD EXPERIENCE', 66, CARD_H - 88);   // 底部留白与顶部对齐
  ctx.fillStyle = '#8e8c87';
  ctx.font = '600 20px ' + MONO;
  ctx.fillText(geneCode(p), 66, CARD_H - 60);
  ctx.textAlign = 'right';
  ctx.font = '600 14px ' + MONO;          // UNOFFICIAL 这行比上一行更小
  ctx.fillText('UNOFFICIAL FAN MADE PROJECT', CARD_W - 66, CARD_H - 60);
  ctx.textAlign = 'left';

  return c;
}

/* 3D 挂绳卡背面纹理：与编辑态背面共享同一组信息 */
function buildBackCardCanvas(){
  const b = state.booth, p = b.photo;
  const c = document.createElement('canvas');
  c.width = CARD_W; c.height = CARD_H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0c0c10';
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  const glow = ctx.createRadialGradient(CARD_W * .78, CARD_H * .18, 0, CARD_W * .78, CARD_H * .18, CARD_W * .72);
  glow.addColorStop(0, 'rgba(255,47,63,.2)');
  glow.addColorStop(1, 'rgba(255,47,63,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  ctx.strokeStyle = 'rgba(246,241,231,.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, CARD_W - 60, CARD_H - 60);

  ctx.fillStyle = '#ff2f3f';
  ctx.font = '700 30px ' + MONO;
  ctx.fillText('XG / DIGITAL CARD CORE', 72, 132);

  ctx.fillStyle = '#f6f1e7';
  ctx.font = '800 92px ' + DISPLAY;
  const member = (p ? p.member : 'XG').toUpperCase();
  ctx.fillText(member, 70, 268);

  ctx.fillStyle = '#8e8c87';
  ctx.font = '600 26px ' + MONO;
  ctx.fillText((p ? p.collectionLabel : 'DIGITAL PHOTOCARD').toUpperCase(), 72, 318);

  ctx.strokeStyle = 'rgba(246,241,231,.16)';
  ctx.beginPath(); ctx.moveTo(72, 370); ctx.lineTo(CARD_W - 72, 370); ctx.stroke();

  ctx.fillStyle = '#a7fff0';
  ctx.font = '600 34px ' + MONO;
  ctx.fillText('GENE CODE', 72, 456);
  ctx.fillStyle = '#f6f1e7';
  ctx.font = '700 48px ' + MONO;
  ctx.fillText(geneCode(p), 72, 514);

  ctx.fillStyle = '#8e8c87';
  ctx.font = '600 25px ' + MONO;
  ctx.fillText('CARD ID', 72, 606);
  ctx.fillStyle = '#f6f1e7';
  ctx.fillText('№' + number(p) + ' / ' + PHOTOS.length, 72, 648);

  ctx.globalAlpha = .08;
  ctx.fillStyle = '#ff2f3f';
  ctx.font = '900 340px ' + DISPLAY;
  ctx.fillText('XG', -16, CARD_H - 190);
  ctx.globalAlpha = 1;

  ctx.fillStyle = '#8e8c87';
  ctx.font = '600 22px ' + MONO;
  const fine = [
    'DIGITAL PHOTOCARD EXPERIENCE',
    'UNOFFICIAL FAN MADE PROJECT',
    'PERSONAL & NON-COMMERCIAL USE ONLY'
  ];
  fine.forEach((line, i) => ctx.fillText(line, 72, CARD_H - 190 + i * 42));

  return c;
}

function fileName(){
  const m = state.booth.photo ? state.booth.photo.member.toLowerCase() : 'xg';
  return 'xg-fan-card-' + m + '.png';
}

let lastExportFallback = false;
// 被本地图片污染的画布在 toBlob 时会直接抛 SecurityError，所以这里包一层
function canvasToPng(canvas){
  return new Promise(res => {
    try { canvas.toBlob(res, 'image/png'); }
    catch (e) { res(null); }
  });
}
async function exportBlob(){
  const blob = await canvasToPng(await buildCardCanvas('auto'));
  if (blob){ lastExportFallback = false; return blob; }
  // 直接在本地双击打开（file://）时，浏览器会污染画布导致无法导出；
  // 这时退回「不画卡框」导出，保证仍然导得出来。
  lastExportFallback = true;
  return canvasToPng(await buildCardCanvas('none'));
}

async function downloadCard(){
  if (!state.booth.made){ toast('Generate the card first'); return; }
  const blob = await exportBlob();
  if (!blob){ toast('Export failed — please try again'); return; }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = fileName();
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  toast(lastExportFallback ? 'Downloaded with the built-in frame' : 'Image downloaded');
}

function captionText(){
  const p = state.booth.photo;
  return 'I made a digital photocard of ' + (p ? p.member : 'XG') + ' in the XG Fan Card Studio ✦\n' +
    'Digital Photocard Experience · Unofficial fan made project · Free for everyone.\n' +
    '#XG #photocard #fanmade';
}

$('btnShare').onclick = async () => {
  if (!state.booth.made){ toast('Generate the card first'); return; }
  try {
    const blob = await exportBlob();
    const file = new File([blob], fileName(), { type:'image/png' });
    if (navigator.canShare && navigator.canShare({ files:[file] })){
      await navigator.share({ files:[file], text: captionText(), title:'My XG photocard' });
      toast('System share opened');
    } else {
      await navigator.clipboard.writeText(captionText());
      toast('Caption copied — download the image too');
    }
  } catch (e) {
    if (e && e.name === 'AbortError') return;
    try { await navigator.clipboard.writeText(captionText()); toast('Caption copied — download the image too'); }
    catch { toast('Share did not finish — you can download the image instead'); }
  }
};

/* ---------- 上传自摄图（免登录，仅在本机处理） ---------- */
$('btnUploadTop').onclick = () => $('fileInput').click();
$('boothUpload').onclick = () => $('fileInput').click();


$('fileInput').onchange = e => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')){ toast('Please choose an image file'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    const p = {
      id: 'upload-' + Date.now(),
      member: 'MY SHOT', memberId: 'upload',
      collection: 'upload', collectionLabel: 'MY SHOT', place: 'MY SHOT',
      c1: '#1a1a22', c2: '#ff2f3f', src: ev.target.result, custom: true
    };
    openBooth(p);
    toast('Your photo is loaded — processed on this device only');
  };
  reader.readAsDataURL(file);
  e.target.value = '';
};


/* ---------- 版权与免责 ---------- */
function openColophon(){
  $('colophon').classList.add('is-open');
  $('colophon').setAttribute('aria-hidden', 'false');
}
$('btnLegal').onclick = openColophon;
$('btnAbout').onclick = openColophon;
$('colophonClose').onclick = () => {
  $('colophon').classList.remove('is-open');
  $('colophon').setAttribute('aria-hidden', 'true');
};

/* ---------- FOCUS 开关（SINGLE / GRID 共用） ---------- */
let focusAnimTimer = 0;
$('toggleFocus').onclick = () => {
  state.focus = !state.focus;
  const btn = $('toggleFocus');
  btn.setAttribute('aria-pressed', String(state.focus));
  btn.textContent = 'FOCUS: [' + (state.focus ? 'ON' : 'OFF') + ']';

  cancelSliderSnap();
  cancelGridSnap();
  const views = [$('viewSlider'), $('viewGrid')];
  views.forEach(view => {
    view.classList.toggle('is-focus-on', state.focus);
    view.classList.add('is-focus-animating');
  });
  clearTimeout(focusAnimTimer);
  requestAnimationFrame(() => {
    if (state.view === 'slider') applySingle();
    else if (state.view === 'grid') applyGrid();
  });
  focusAnimTimer = setTimeout(() => {
    views.forEach(view => view.classList.remove('is-focus-animating'));
  }, 1180);
};

/* ---------- 底部开关 ---------- */
$('toggleGestures').onclick = e => {
  state.gestures = !state.gestures;
  document.body.classList.toggle('gestures', state.gestures);
  e.currentTarget.setAttribute('aria-pressed', String(state.gestures));
  e.currentTarget.textContent = 'GESTURES: [' + (state.gestures ? 'ON' : 'OFF') + ']';
  if (!state.gestures) endGestureDrag();
  gestureCursor(false);
};

/* ---------- INDEX → 螺旋照片墙（方案 A：CSS 3D） ----------
   照片沿一条螺旋线排布，滚轮让螺旋「边转边上升」，网页本身不动。
   DOM 卡片循环复用：每张卡绑定池里的「绝对序号」p，画面里显示 p - phase 在窗口内的那批。 */
const SPIRAL = {
  gapPx: 2,           /* 相邻两张之间固定 2px（接缝互相对齐） */
  persp: 800,         /* 透视距离 */
  riseTurn: 1.02,     /* 每绕一圈上升多少个卡高 */
  back: 6,            /* 视野下缘之外还留几张（保证从下面转上来的时候已经就位） */
  backDim: 0.55,      /* 「背面」= 同一张图压暗到这个程度 */
  fadeStartPx: 0.78,  /* 上半：离中心多少个「半屏高」开始淡出 */
  fadeEndPx: 1.08,    /* 上半：完全消失的位置 */
  botTurn: 0.5,       /* 下半：只保留半圈，从下方渐显出来 */
  spindleW: 0.62,     /* 陀螺形：两端相对中心缩小多少（0.62 = 两端缩到 38%） */
  spindleP: 1.25,     /* 收缩曲线的形状（越大越靠两端才收） */
  tilt: -13 * Math.PI / 180
};
let spiral = null, spiralRaf = 0, spiralSnapTimer = 0;
let spiralFrom = 'slider';        /* INDEX 是从哪个视图进来的：退出时回到这里 */
let pendingGridAnchor = null;     /* 从 INDEX 切到 GRID 时要居中的那张 */
let pendingSpiralAnchor = null;   /* 切进 INDEX 时要摆在焦点位置的那张照片 */
let spiralAnchorId = null;

/* 环形里放的是「当前分类 + 当前成员筛选」下的全部照片 */
/* 当前视图中心那张照片（用于三个视图之间互相带过去） */
function currentFocusPhoto(v){
  if (v === 'slider'){ const n = anchorFromSingle(); return n && n.photo ? n.photo : null; }
  if (v === 'grid'){ const n = anchorFromGrid(); return n && n.photo ? n.photo : null; }
  return null;
}
/* 环形此刻焦点那张 */
function spiralFocusPhoto(){
  if (!spiral) return null;
  let best = null;
  spiral.cards.forEach(c => {
    if (!c.photo) return;
    const ur = Math.abs(spiral.phase - c.p);
    if (!best || ur < best.ur) best = { ur:ur, photo:c.photo };
  });
  return best ? best.photo : null;
}

function spiralPoolFor(){
  return filtered().slice();
}

function spiralMetrics(){
  const el = $("viewList");
  const vw = el.clientWidth || window.innerWidth;
  const vh = el.clientHeight || window.innerHeight;
  const persp = SPIRAL.persp;
  const tilt = SPIRAL.tilt;
  const R = clampNum(vw * 0.235, 180, 460);
  const frontScale = persp / (persp - R);            /* 最前排的透视放大倍数 */
  const single = cardSize(vw, vh);                   /* single 页那张卡的尺寸 */
  const cw = single.w / frontScale;
  const ch = single.h / (frontScale * Math.cos(tilt));
  const stepRad = (cw + SPIRAL.gapPx) / R;           /* 弧长 = 卡宽 + 2px */
  const perTurn = (Math.PI * 2) / stepRad;
  const rise = (ch * SPIRAL.riseTurn) / perTurn;
  const slots = Math.min(46, Math.ceil(perTurn * 1.9 + 6) + SPIRAL.back);
  const yRaw = -R * Math.sin(tilt);
  const zRaw = R * Math.cos(tilt);
  const dy = -(yRaw * persp / (persp - zRaw));
  return {
    vw:vw, vh:vh, cw:cw, ch:ch, rise:rise, R:R, slots:slots, back:SPIRAL.back,
    cx:vw / 2, cy:vh / 2, persp:persp, tilt:tilt, dy:dy,
    step:stepRad * 180 / Math.PI, perTurn:perTurn
  };
}

function buildSpiralCard(){
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'ring-card spiral-card';
  el.dataset.cursor = 'VIEW THIS';
  el.dataset.pick = '1';

  const ph = document.createElement('div'); ph.className = 'ph';
  const shade = document.createElement('span'); shade.className = 'shade';
  el.append(ph, shade);
  let cur = null;
  return {
    el:el, p:null, slot:-1, entry:0, rev:1, revDelay:0, revLocked:false, shade:shade, shadeV:-1,
    paint(p){
      if (cur === p.id) return;
      cur = p.id;
      this.photo = p;
      el.dataset.photo = p.id;
      ph.style.background = photoBackground(p);
      ph.style.setProperty('--c1', p.c1);
      ph.style.setProperty('--c2', p.c2);
      el.onmouseenter = () => setMeta(p);
      el.onclick = () => openBooth(p);
    }
  };
}

/* 名字列退场：点中那行先走，然后向上下依次扩散 */
function listExitRow(){
  const rows = Array.prototype.slice.call(listField.children);
  const anchorId = spiralAnchorId;
  let anchor = 0;
  if (anchorId){
    let best = null;
    rows.forEach((r, i) => {
      if (r.dataset.member !== anchorId) return;
      const b = r.getBoundingClientRect();
      const d = Math.abs(b.top + b.height / 2 - listMetrics.centerY);
      if (!best || d < best.d) best = { d:d, i:i };
    });
    if (best) anchor = best.i;
  }
  rows.forEach((r, i) => {
    r.style.pointerEvents = 'none';
    const delay = Math.min(9, Math.abs(i - anchor)) * 85;
    r.animate(
      [{ transform:'translateX(0)', opacity: getComputedStyle(r).opacity },
       { transform:'translateX(-22vw)', opacity: 0 }],
      { duration:440, delay:delay, easing:'cubic-bezier(.4,0,.15,1)', fill:'forwards' }
    );
  });
}

function listReturn(){
  const rows = Array.prototype.slice.call(listField.children);
  /* 先算出每行在「焦点轴」下应有的透明度，再从这个值原地渐显；
     动画结束就 cancel，把透明度交回给焦点衰减 —— 不会丢掉渐隐效果 */
  paintListRows(-mod(listScrollY, listMetrics.cycleH), true);
  rows.forEach((r, i) => {
    r.getAnimations().forEach(a => a.cancel());
    r.style.pointerEvents = '';
    const target = r.style.opacity || '1';
    const a = r.animate(
      [{ opacity:0 }, { opacity:Number(target) }],
      { duration:300, delay:(i % 7) * 45, easing:'cubic-bezier(.4,0,.15,1)' }
    );
    a.onfinish = () => a.cancel();
  });
}

/* 左侧红色箭头已按用户要求移除：退出改用顶部的 SINGLE / GRID / INDEX 切换 */

/* ---------- SINGLE ⇄ INDEX：一排卡片飞入环形 / 收拢回来 ---------- */
/* 时长与缓动直接对齐 SINGLE↔GRID 的形变：MORPH_BASE_S=1.8s / MORPH_EASE */
const FLIGHT = { dur: MORPH_BASE_S * 1000, stagger: 55, reveal: 800, revealGap: 30 };
const reducedMotion = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

function captureRowRects(){
  const out = [];
  const wrap = $('viewSlider');
  if (!wrap) return out;
  wrap.querySelectorAll('.single-card').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width < 20 || r.right <= 4 || r.left >= window.innerWidth - 4) return;
    if (!el.dataset.photo) return;
    out.push({ id: el.dataset.photo, srcEl: el, rect: { left: r.left, top: r.top, width: r.width, height: r.height } });
  });
  return out;
}

/* baseW/baseH = 卡片本身的真实尺寸（照片按这个比例做 cover）；at = 初始要覆盖的屏幕矩形 */
/* 从 GRID 进来时：抓「当前焦点所在那一行」的 tile 作为飞行起点 */
function captureGridRects(){
  const out = [];
  const near = anchorFromGrid();
  if (!near || !near.item) return out;
  const ar = near.item.t.el.getBoundingClientRect();
  const acx = ar.left + ar.width / 2;
  gridTiles.forEach(it => {
    if (it.j !== near.item.j) return;
    const el = it.t.el;
    const id = el.dataset.photo;
    if (!id) return;
    const r = el.getBoundingClientRect();
    if (r.width < 20) return;
    out.push({ id:id, srcEl:el, rect:{ left:r.left, top:r.top, width:r.width, height:r.height },
               d: Math.abs(r.left + r.width / 2 - acx) });
  });
  out.sort((a, b) => a.d - b.d);
  return out.slice(0, 7);   /* 中心行 7 张一起动（含两侧出屏的两张） */
}

function makePhotoFlight(bg, baseW, baseH, at){
  const el = document.createElement('div');
  el.className = 'single-card flight-card';
  const ph = document.createElement('div');
  ph.className = 'ph';
  ph.style.background = bg || 'none';
  el.appendChild(ph);
  el.style.width = baseW + 'px';
  el.style.height = baseH + 'px';
  el.style.transform = 'translate3d(' + at.left.toFixed(2) + 'px,' + at.top.toFixed(2) + 'px,0) scale(' +
    (at.width / baseW).toFixed(4) + ',' + (at.height / baseH).toFixed(4) + ')';
  document.body.appendChild(el);
  return el;
}

function makeFlightEl(srcEl, rect){
  const sp = srcEl ? srcEl.querySelector('.ph') : null;
  const el = makePhotoFlight(sp ? sp.style.background : '', rect.width, rect.height, rect);
  if (srcEl && srcEl.dataset.photo) el.dataset.photo = srcEl.dataset.photo;
  return el;
}

/* 屏幕空间插值：起点矩形 → 终点矩形。直线 + 与 SINGLE↔GRID 相同的缓动，不做弧线和中途缩小 */
/* 以 baseW/baseH 为底图尺寸，从 from 矩形插值到 to 矩形（只缩放，不重新裁切照片） */
function flyTo(el, baseW, baseH, from, to, delay, dur){
  const s0x = from.width / baseW, s0y = from.height / baseH;
  const s1x = to.width / baseW, s1y = to.height / baseH;
  return el.animate([
    { transform: 'translate3d(' + from.left.toFixed(2) + 'px,' + from.top.toFixed(2) + 'px,0) scale(' + s0x.toFixed(4) + ',' + s0y.toFixed(4) + ')' },
    { transform: 'translate3d(' + to.left.toFixed(2) + 'px,' + to.top.toFixed(2) + 'px,0) scale(' + s1x.toFixed(4) + ',' + s1y.toFixed(4) + ')' }
  ], { duration: dur, delay: delay, easing: MORPH_EASE, fill: 'forwards' });
}

/* 页面转场专用的整屏横向遮罩：位于飞行卡上方、HUD 下方。 */
function makeFlightHShade(opacity){
  const el = document.createElement('div');
  el.className = 'flight-hshade';
  el.style.opacity = String(opacity);
  document.body.appendChild(el);
  return el;
}

/* INDEX → 其他视图：环形收拢回目标视图的一排卡片 */
function collapseSpiral(targetView, done){
  if (reducedMotion()){ destroySpiral(); done(); return; }
  const s = spiral;
  if (!s){ done(); return; }
  /* 用同一张整屏遮罩接管转场：环形内遮罩隐藏，转场遮罩从满强度平滑退场。 */
  const transitionShade = makeFlightHShade(1);
  s.transitionShade = transitionShade;
  if (s.hshade) s.hshade.style.opacity = '0';
  if (s.clones) s.clones.forEach(el => el.remove());
  s.flight = null;
  s.clones = [];

  /* INDEX 退出时，目标视图必须在自己的视图身份下排布。
     否则 state.view 仍是 list，FOCUS 的缩放、倾角和滤镜不会参与落点测量，
     飞行结束切回 slider/grid 时再应用 FOCUS，就会产生尺寸和位置跳变。 */
  const previousView = state.view;
  let gridReturnRow = 0;
  if (targetView === 'grid'){
    const gridAnchor = anchorFromGrid();
    if (gridAnchor && Number.isFinite(gridAnchor.row)) gridReturnRow = gridAnchor.row;
  }
  state.view = targetView;

  const wrap = $(targetView === 'grid' ? 'viewGrid' : 'viewSlider');
  const sel = targetView === 'grid' ? '.grid-tile' : '.single-card';
  const dest = new Map();

  try {
    if (targetView === 'slider'){
      renderSlider();
    } else {
      renderGrid();
      if (pendingGridAnchor) centerGridOnPhoto(pendingGridAnchor, gridReturnRow);
      gridSnapState = { x:view.x, y:view.y };   /* 记住这次量落点时的网格位置 */
      /* 网格提前淡入：环形收拢时就垫在下面，避免收完才从黑底冒出来 */
      const g = $('viewGrid');
      g.setAttribute('aria-hidden', 'false');
      g.style.transition = 'none';
      g.style.opacity = '0';
      gridPrefaded = true;
      requestAnimationFrame(function(){
        /* 先让环形收拢一段，再淡入网格：避免底部两张墙叠在一起 */
        g.style.transition = 'opacity 900ms cubic-bezier(.4,0,.2,1)';
        g.style.transitionDelay = '1000ms';
        g.style.opacity = '1';
        setTimeout(function(){
          g.style.transition = ''; g.style.transitionDelay = ''; g.style.opacity = '';
        }, 1950);
      });
    }

    if (targetView === 'grid'){
      const near = anchorFromGrid();
      if (near && near.item){
        const ar = near.item.t.el.getBoundingClientRect();
        const acx = ar.left + ar.width / 2;
        const row = gridTiles.filter(it => it.j === near.item.j).map(it => {
          const el = it.t.el; const r = el.getBoundingClientRect();
          return { el, r, d: Math.abs(r.left + r.width / 2 - acx) };
        }).filter(o => o.r.width > 20).sort((a, b) => a.d - b.d).slice(0, 7);
        row.forEach(o => {
          const id = o.el.dataset.photo;
          if (!id) return;
          const r = o.r;
          const visH = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
          if (visH < r.height * 0.5) return;   /* 纵向至少一半可见 */
          const prev = dest.get(id);
          if (!prev || o.d < prev.d) dest.set(id, { left:r.left, top:r.top, width:r.width, height:r.height, d:o.d });
        });
      }
    } else if (wrap){
      const vcx = window.innerWidth / 2, vcy = window.innerHeight / 2;
      wrap.querySelectorAll(sel).forEach(el => {
        const id = el.dataset.photo;
        if (!id) return;
        const r = el.getBoundingClientRect();
        if (r.width < 20) return;
        const visW = Math.min(r.right, window.innerWidth) - Math.max(r.left, 0);
        const visH = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
        if (visW < r.width * 0.5 || visH < r.height * 0.5) return;
        const d = Math.hypot(r.left + r.width / 2 - vcx, r.top + r.height / 2 - vcy);
        const prev = dest.get(id);
        if (!prev || d < prev.d) dest.set(id, { left:r.left, top:r.top, width:r.width, height:r.height, d:d });
      });
    }
  } finally {
    state.view = previousView;
  }

  const items = [];
  const seenPhoto = new Set();
  s.cards.slice().sort((a, b) => Math.abs(s.phase - a.p) - Math.abs(s.phase - b.p)).forEach(c => {
    if (!c.photo) return;
    if (seenPhoto.has(c.photo.id)) return;
    const d = dest.get(c.photo.id);
    if (!d) return;
    seenPhoto.add(c.photo.id);
    const r = c.el.getBoundingClientRect();
    const op = Number(getComputedStyle(c.el).opacity);
    if (op < 0.22 || r.width < 8) return;   /* 几乎不可见的后排卡不参与飞行 */
    const ph = c.el.querySelector('.ph');
    /* 环形卡是被横向压扁的；飞行时按目标卡比例还原，照片全程不被拉伸 */
    items.push({ card:c, from:{ left:r.left, top:r.top, width:r.width, height:r.height }, to:d, bg: ph ? ph.style.background : '' });
  });

  if (!items.length){ destroySpiral(); done(); return; }

  /* 飞行卡起点与环形卡完全重合 → 立刻收掉原卡，避免移动时留下拖尾重影 */
  items.forEach(it => { it.card.revLocked = true; it.card.rev = 0; });
  startSpiralTick();
  if (s.layer){
    s.layer.animate([{ opacity:1 }, { opacity:0 }], { duration:FLIGHT.dur + 300, delay:120, easing:'ease-out', fill:'forwards' });
  }

  const cx0 = window.innerWidth / 2;
  items.sort((a, b) => Math.abs(a.from.left + a.from.width / 2 - cx0) - Math.abs(b.from.left + b.from.width / 2 - cx0));

  items.slice().sort((a, b) => (a.from.width * a.from.height) - (b.from.width * b.from.height)).forEach((it, i) => { it.z = 11 + i; });
  const clones = [];
  let end = 0;
  items.forEach((it, i) => {
    const el = makePhotoFlight(it.bg, it.to.width, it.to.height, it.from);
    if (it.z) el.style.zIndex = it.z;
    el.dataset.photo = it.card.photo.id;
    clones.push(el);
    const delay = i * FLIGHT.stagger;
    end = Math.max(end, delay + FLIGHT.dur);
    const phEl = el.querySelector('.ph');
    const sbxv = parseFloat(it.card.el.style.getPropertyValue('--bx')) || 0.82;
    const sbx = (sbxv * (1 - (it.card.shadeV || 0))).toFixed(3);
    const sgx = it.card.el.style.getPropertyValue('--gx') || '0';
    if (phEl) phEl.animate([{ filter:'brightness(' + sbx + ') grayscale(' + sgx + ')' }, { filter:'brightness(0.82) grayscale(0.35)' }],
      { duration:FLIGHT.dur, delay:delay, easing:MORPH_EASE, fill:'both' });
    flyTo(el, it.to.width, it.to.height, it.from, it.to, delay, FLIGHT.dur);
  });

  transitionShade.animate(
    [{ opacity:1 }, { opacity:0 }],
    { duration:Math.max(1, end + 40), easing:'cubic-bezier(.37,0,.63,1)', fill:'forwards' }
  );

  setTimeout(function(){
    if (s.transitionShade) s.transitionShade.remove();
    s.transitionShade = null;
    done();
    clones.forEach(el => el.remove());
    if (spiral === s) destroySpiral();
  }, end + 40);
}

function openSpiral(flight){
  if (spiral) return;
  const pool = spiralPoolFor();
  if (!pool.length) return;
  const M = spiralMetrics();
  let startIdx = 0;
  if (pendingSpiralAnchor){
    const k = pool.findIndex(p => p.id === pendingSpiralAnchor.id);
    if (k >= 0) startIdx = k;
    pendingSpiralAnchor = null;
  }

  const layer = document.createElement('div');
  layer.className = 'spiral-layer';
  const field = document.createElement('div');
  field.className = 'spiral-field';
  field.style.transform = 'translate3d(0,' + M.dy.toFixed(1) + 'px,0) rotateX(' + (M.tilt * 180 / Math.PI).toFixed(2) + 'deg)';
  field.style.perspective = M.persp + 'px';   /* 与 JS 里的透视距离保持一致 */
  layer.appendChild(field);
  const hshade = document.createElement('div');
  hshade.className = 'spiral-hshade';
  hshade.style.opacity = (flight && flight.length) ? '0' : '1';
  layer.appendChild(hshade);
  $('viewList').appendChild(layer);

  const cards = [];
  for (let i = 0; i < M.slots; i++){
    const c = buildSpiralCard();
    c.el.style.width = M.cw + 'px';
    c.el.style.height = M.ch + 'px';
    c.el.style.left = (M.cx - M.cw / 2) + 'px';
    c.el.style.top = (M.cy - M.ch / 2) + 'px';
    field.appendChild(c.el);
    cards.push(c);
  }

  spiral = {
    pool:pool, cards:cards, M:M, layer:layer, hshade:hshade, transitionShade:null,
    phase: startIdx, target: startIdx, t0: performance.now(), entering: !(flight && flight.length),
    flight: null, clones: [], flightEnd: 0
  };

  if (flight && flight.length){
    /* 先按最终相位画一帧，量出每张卡的落位矩形 */
    cards.forEach(c => { c.entry = 1; c.rev = 0; c.revDelay = 1e9; });
    /* 先临时全部显示一帧，量出每张卡的真实可见度，再恢复 */
    cards.forEach(c => { c.rev = 1; });
    spiralTick();
    const visOf = new Map();
    cards.forEach(c => { if (!c.photo) return; const v = parseFloat(c.el.style.opacity) || 0; if (!visOf.has(c.photo.id) || v > visOf.get(c.photo.id)) visOf.set(c.photo.id, v); });
    cards.forEach(c => { c.rev = 0; });
    spiralTick();

    const byId = new Map();
    cards.forEach(c => {
      if (!c.photo) return;
      const prev = byId.get(c.photo.id);
      /* 小池子时同一张照片会在环上重复出现：优先用最靠近焦点的那一张 */
      if (!prev || Math.abs(c.p - spiral.phase) < Math.abs(prev.p - spiral.phase)) byId.set(c.photo.id, c);
    });
    const items = [];
    flight.forEach(src => {
      const c = byId.get(src.id);
      if (!c) return;
      if ((visOf.get(src.id) || 0) < 0.2) return;   /* 只飞真正可见的卡，两侧也算 */
      const r = c.el.getBoundingClientRect();
      if (r.width < 8) return;
      /* 落点按行卡比例还原（只缩不放）：照片全程不被横向拉伸 */
      /* 整张卡（含照片）直接飞到环形卡的真实矩形：落位与环形卡像素一致，交接零跳变 */
      items.push({ src:src, card:c, to:{ left:r.left, top:r.top, width:r.width, height:r.height } });
    });

    /* 中间那张先飞，左右依次错开 */
    const cx0 = window.innerWidth / 2;
    items.sort((a, b) => Math.abs(a.src.rect.left + a.src.rect.width / 2 - cx0) - Math.abs(b.src.rect.left + b.src.rect.width / 2 - cx0));

    const flying = new Set(items.map(it => it.card));
    /* 越靠前（落点越大）层级越高：禁止后面的卡片在飞行中压住前面的 */
    items.slice().sort((a, b) => (a.to.width * a.to.height) - (b.to.width * b.to.height)).forEach((it, i) => { it.z = 11 + i; });
    spiral.flight = items.length ? flight : null;
    spiral.transitionShade = makeFlightHShade(0);
    let end = 0;
    let pending = items.length;
    items.forEach((it, i) => {
      const el = makeFlightEl(it.src.srcEl, it.src.rect);
      if (it.z) el.style.zIndex = it.z;
      const delay = i * FLIGHT.stagger;
      end = Math.max(end, delay + FLIGHT.dur);
      spiral.clones.push(el);
      const phEl = el.querySelector('.ph');
      const tbxv = parseFloat(it.card.el.style.getPropertyValue('--bx')) || 0.82;
      const tbx = (tbxv * (1 - (it.card.shadeV || 0))).toFixed(3);
      const tgx = it.card.el.style.getPropertyValue('--gx') || '0';
      if (phEl) phEl.animate([{ filter:'brightness(0.82) grayscale(0.35)' }, { filter:'brightness(' + tbx + ') grayscale(' + tgx + ')' }],
        { duration:FLIGHT.dur, delay:delay, easing:MORPH_EASE, fill:'both' });
      const a = flyTo(el, it.src.rect.width, it.src.rect.height, it.src.rect, it.to, delay, FLIGHT.dur);
      a.onfinish = () => {
        if (!spiral || spiral.flight !== flight){ el.remove(); return; }
        if (--pending === 0){
          /* 全部落位后再一次性显示环形卡：避免「已落位的后排卡被还在飞的卡压住」 */
          items.forEach(x => { x.card.rev = 1; x.card.revLocked = true; });
          if (spiral.hshade) spiral.hshade.style.opacity = '1';
          startSpiralTick();
          /* 飞行卡淡出、环形卡同时在下方就位：宽度差被溶解掉，不会有跳变 */
          /* 飞行卡落点已与环形卡完全重合，直接同帧换手 */
          setCatVisible(true, 250);   /* 进入 INDEX：文字最后出现（略快） */
          requestAnimationFrame(function(){
            if (!spiral) return;
            spiral.clones.forEach(el2 => el2.remove());
            spiral.clones = [];
            if (spiral.transitionShade){
              spiral.transitionShade.remove();
              spiral.transitionShade = null;
            }
          });
          spiral.flight = null;
        }
      };
    });
    spiral.flightEnd = end ? end + 40 : 0;
    if (spiral.transitionShade){
      spiral.transitionShade.animate(
        [{ opacity:0 }, { opacity:1 }],
        { duration:Math.max(1, spiral.flightEnd), easing:'cubic-bezier(.37,0,.63,1)', fill:'forwards' }
      );
    }

    /* 其余卡片：落位之后依次补入 */
    let k = 0;
    cards.forEach(c => {
      if (flying.has(c)) return;
      c.revDelay = spiral.flightEnd + 80 + (k++) * FLIGHT.revealGap;
    });
    startSpiralTick();
    return;
  }

  startSpiralTick();
  setCatVisible(true, 700);
}

/* 每帧：缓动相位 + 把每张卡摆到螺旋上（卡片循环复用，照片在空间里保持不动） */
function spiralTick(){
  if (!spiral) { spiralRaf = 0; return; }
  const M = spiral.M;
  const t0 = performance.now() - spiral.t0;
  let animating = false;

  if (spiral.entering){
    const k = clampNum(t0 / 1100, 0, 1);
    if (k >= 1) spiral.entering = false; else animating = true;
  }
  /* 吸附缓动与 GRID 完全一致：per-frame 1 - .88^(dt/16.67)，并同样限速 16px/帧 ≈ 0.033 槽位 */
  const nowMs = performance.now();
  if (!spiral.lastFrame) spiral.lastFrame = nowMs;
  const dtf = Math.min(34, Math.max(8, nowMs - spiral.lastFrame));
  spiral.lastFrame = nowMs;
  const easeS = 1 - Math.pow(.88, dtf / 16.67);
  const diff = spiral.target - spiral.phase;
  if (Math.abs(diff) > 0.00012){ spiral.phase += clampNum(diff * easeS, -0.0442, 0.0442); animating = true; }
  else spiral.phase = spiral.target;

  const p0 = Math.round(spiral.phase) - M.back;
  const rad = Math.PI / 180;

  spiral.cards.forEach((c, i) => {
    const p = p0 + i;
    if (c.p !== p){
      c.p = p;
      const idx = mod(p, spiral.pool.length);
      if (c.slot !== idx){ c.slot = idx; c.paint(spiral.pool[idx]); c.justRecycled = true; }
    }
    const ur = spiral.phase - p;                       /* >0 = 已经从前面转上去了 */
    /* 越靠近视觉中心越亮：中心 1.0，两侧 0.82 */
    /* 中心亮区平台：|ur| ≤ 0.45 全亮，之后才衰减 → 换中心时不会掉亮度 */
    const ft = clampNum((Math.abs(ur) - 0.65) / 0.75, 0, 1);
    const bxv = 1 - 0.62 * ft;
    /* 槽位复用（换图）时不要过渡，否则会追着旧亮度闪一下 */
    const recycling = !!c.justRecycled;
    if (recycling) c.el.style.transition = 'none';
    if (c.bxV !== bxv){ c.bxV = bxv; c.el.style.setProperty('--bx', bxv.toFixed(3)); }
    /* 离中心越远越去色：中心 0，两侧 0.35 */
    const gxv = 0.35 * ft;
    if (c.gxV !== gxv){ c.gxV = gxv; c.el.style.setProperty('--gx', gxv.toFixed(3)); }
    if (recycling){
      c.justRecycled = false;
      requestAnimationFrame(function(){ if (c.el) c.el.style.transition = ''; });
    }
    const aDeg = ur * M.step;
    const a = aDeg * rad;
    /* 横向镜像：让「序号递增」在 SINGLE 与 INDEX 里都朝右，滚轮方向也一致 */
    const x = -M.R * Math.sin(a);
    const z = M.R * Math.cos(a);
    const y = -ur * M.rise;
    /* 卡片本身不旋转：用横向压缩表现「照片带绕过柱子」 */
    const kx = Math.max(0.02, Math.abs(Math.cos(a)));

    if (c.entry < 1){
      c.entry = clampNum((t0 - i * 26) / 700, 0, 1);
      if (c.entry < 1) animating = true;
    }
    const e = 1 - Math.pow(1 - c.entry, 3);
    if (!c.revLocked && c.rev < 1){
      c.rev = clampNum((t0 - (c.revDelay || 0)) / FLIGHT.reveal, 0, 1);
      if (c.rev < 1) animating = true;
    }

    /* 用「屏幕上的实际纵向位置」判断大小与淡出，上下完全对称（陀螺形：中间大两头小） */
    const ct = Math.cos(M.tilt), st = Math.sin(M.tilt);
    const ry = y * ct - z * st;
    const rz = y * st + z * ct;
    const screenY = M.dy + ry * M.persp / (M.persp - rz);
    const halfH = M.vh / 2, ay = Math.abs(screenY);
    const vy = Math.min(1, ay / halfH);
    const spindle = 1 - SPIRAL.spindleW * Math.pow(vy, SPIRAL.spindleP);
    /* 上半：越往上越淡（渐隐）；下半：不渐显（半圈内直接全显） */
    let vis;
    if (ur >= 0){
      vis = clampNum((SPIRAL.fadeEndPx * halfH - ay) / ((SPIRAL.fadeEndPx - SPIRAL.fadeStartPx) * halfH), 0, 1);
    } else {
      vis = (-ur <= M.perTurn * SPIRAL.botTurn) ? 1 : 0;
    }
    /* 越靠后越暗，增强「转到后面去」的纵深 */
    const depth = 0.72 + 0.28 * (z / M.R + 1) / 2;
    const op = vis * e * depth * (c.rev === undefined ? 1 : c.rev);

    c.el.style.transform =
      "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px," + z.toFixed(2) + "px)" +
      " scaleX(" + kx.toFixed(4) + ") scale(" + spindle.toFixed(4) + ")";
    c.el.style.opacity = op.toFixed(3);
    c.el.style.visibility = op < 0.015 ? "hidden" : "";
    const dim = z < 0 ? clampNum(-z / M.R, 0, 1) * SPIRAL.backDim : 0;
    if (Math.abs(dim - c.shadeV) > 0.004){ c.shadeV = dim; c.shade.style.opacity = dim.toFixed(3); }
  });

  /* 左侧分类文字跟随「视觉中心那张」：phase 最接近的卡 */
  let focusCard = null, focusDist = Infinity;
  for (let i = 0; i < spiral.cards.length; i++){
    const c = spiral.cards[i];
    if (!c.photo) continue;
    const ur = Math.abs(spiral.phase - c.p);
    if (ur < focusDist){ focusDist = ur; focusCard = c; }
  }
  if (focusCard && spiral.focusId !== focusCard.photo.id){
    spiral.focusId = focusCard.photo.id;
    setFocusMeta(focusCard.photo);
  }

  if (animating) spiralRaf = requestAnimationFrame(spiralTick);
  else spiralRaf = 0;
}

function startSpiralTick(){
  if (!spiral) return;
  if (!spiralRaf) spiralRaf = requestAnimationFrame(spiralTick);
}

/* 立即收掉（视图切换、重渲染时用） */
function destroySpiral(){
  if (spiral && spiral.clones) spiral.clones.forEach(el => el.remove());
  if (spiral && spiral.transitionShade) spiral.transitionShade.remove();
  spiral = null;
  if (spiralRaf) cancelAnimationFrame(spiralRaf);
  spiralRaf = 0;
  clearTimeout(spiralSnapTimer);
  const layer = $('viewList').querySelector('.spiral-layer');
  if (layer) layer.remove();
  const exit = $('ringExit');
  if (exit) exit.remove();
}

/* 退出：照片顺着螺旋往上升、缩小淡出；同时七行名字原地显现 */
function closeSpiral(){
  if (!spiral) return;
  const focal = spiralFocusPhoto();     /* 先记住此刻焦点那张，退出时带回目标视图 */
  const s0 = spiral;
  spiral = null;
  if (spiralRaf) cancelAnimationFrame(spiralRaf);
  spiralRaf = 0;
  clearTimeout(spiralSnapTimer);

  /* 从最前面那张开始，依次沿螺旋向上「升空」并渐隐 */
  const ordered = s0.cards.slice().sort((p, q) => (p.p - s0.phase) - (q.p - s0.phase));
  const each = 430, gap = 16;
  ordered.forEach((c, k) => {
    if (+getComputedStyle(c.el).opacity < 0.02) return;
    const from = c.el.style.transform;
    const up = from.replace(/translate3d\(([-\d.]+)px,([-\d.]+)px,([-\d.]+)px\)/, function(_, x, y, z){
      return "translate3d(" + x + "px," + (parseFloat(y) - s0.M.ch * 1.15).toFixed(1) + "px," + z + "px)";
    });
    c.el.style.visibility = "";
    c.el.animate(
      [{ transform:from, opacity: getComputedStyle(c.el).opacity },
       { transform:up, opacity: 0 }],
      { duration:each, delay:k * gap, easing:"cubic-bezier(.4,0,.2,1)", fill:"forwards" }
    );
  });

  const total = each + ordered.length * gap;
  const layer = $("viewList").querySelector(".spiral-layer");
  const exit = $("ringExit");
  setTimeout(() => {
    if (layer) layer.remove();
    if (exit) exit.remove();
  }, total + 80);
  /* 照片墙整片升完之后回到进来的视图，并把焦点那张带回去 */
  setTimeout(() => {
    if (spiral) return;
    if (focal){
      if (spiralFrom === 'grid') pendingGridAnchor = focal;
      else sliderAnchor = { filterKey:sliderFilterKey(), photoId:focal.id, row:0 };
    }
    selectView(spiralFrom === 'grid' ? 'grid' : 'slider');
  }, total + 140);
}

/* ---------- 反相取景框光标 ---------- */
(function cursor(){
  const el = $('cursor'), label = $('cursorLabel');
  let tx = window.innerWidth / 2, ty = window.innerHeight / 2, cx = tx, cy = ty;
  window.addEventListener('pointermove', e => {
    tx = e.clientX; ty = e.clientY; el.classList.add('is-on');
  });
  document.addEventListener('pointerover', e => {
    const inStage = state.gestures && e.target.closest('#viewSlider,#viewGrid');
    if (inStage){
      el.classList.add('is-grab', 'has-label');
      el.classList.remove('is-pick');
      label.textContent = 'DRAG';
      return;
    }
    if (!gestureDrag.active) el.classList.remove('is-grab');
    const t = e.target.closest('[data-cursor]');
    if (t){
      el.classList.add('has-label');
      if (t.dataset.pick) el.classList.add('is-pick');
      label.textContent = t.dataset.cursor;
    } else {
      el.classList.remove('has-label', 'is-pick');
    }
  });
  (function loop(){
    cx += (tx - cx) * .2; cy += (ty - cy) * .2;
    el.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
    requestAnimationFrame(loop);
  })();
})();

/* ---------- 键盘 ---------- */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape'){
    if ($('colophon').classList.contains('is-open')) $('colophonClose').click();
    else if ($('booth').classList.contains('is-open')) closeBooth();
  }
});

/* ---------- 刷新恢复 ---------- */
function prepareRestoredUI(saved){
  if (!saved) return;
  uiEntered = true;
  if (saved.sliderAnchor && saved.sliderAnchor.photoId){
    sliderAnchor = {
      filterKey: saved.sliderAnchor.filterKey || sliderFilterKey(),
      photoId: saved.sliderAnchor.photoId,
      row: saved.sliderAnchor.row || 0
    };
  }
  if (state.view === 'list' && saved.indexFocusId){
    const p = PHOTOS.find(x => x.id === saved.indexFocusId);
    if (p) pendingSpiralAnchor = p;
  }
  const focusBtn = $('toggleFocus');
  focusBtn.setAttribute('aria-pressed', String(!!state.focus));
  focusBtn.textContent = 'FOCUS: [' + (state.focus ? 'ON' : 'OFF') + ']';
  [$('viewSlider'), $('viewGrid')].forEach(view => {
    view.classList.toggle('is-focus-on', !!state.focus);
    view.classList.remove('is-focus-animating');
  });
  setView(state.view, true);
}

function restoreBoothFromState(savedBooth){
  if (!savedBooth) return;
  const photo = savedBooth.customPhoto || PHOTOS.find(p => p.id === savedBooth.photoId);
  if (!photo) return;
  openBooth(photo);
  const b = state.booth;
  b.core = savedBooth.core || 'core';
  b.material = savedBooth.material || null;
  b.graphic = savedBooth.graphic || null;
  b.layerOpacity = Number.isFinite(savedBooth.layerOpacity) ? savedBooth.layerOpacity : 1;
  b.stickers = Array.isArray(savedBooth.stickers) ? savedBooth.stickers.map(x => ({ ...x })) : [];
  b.made = !!savedBooth.made;
  b.back = !!savedBooth.back;
  renderOptionGroup('boothMaterials', MATERIALS, b.material, 'material');
  renderOptionGroup('boothGraphics', GRAPHICS, b.graphic, 'graphic');
  applyBooth();
  applyCardTransform();

  if (b.made){
    $('viewerControls').hidden = false;
    $('btnShare').hidden = false;
    $('btnMake').disabled = false;
    setMakeLabel('DOWNLOAD PNG');
    setExperienceStage('06 / 3D VIEW', 'Your card is live.', 'Move the cursor to tilt it. Drag to rotate. Flip to inspect the back.', 'DIGITAL PHOTOCARD / ACTIVE');
    activateLanyardPass().then(() => {
      if (lanyardController) lanyardController.flip(b.back);
    }).catch(() => {});
  }

  const panel = document.querySelector('.experience-panel');
  if (panel){
    requestAnimationFrame(() => { panel.scrollTop = savedBooth.panelScroll || 0; });
  }
}

function finishRestoredUI(saved){
  if (!saved) return;
  setView(state.view, true);
  if (state.view === 'grid' && saved.grid){
    view.x = Number(saved.grid.x) || 0;
    view.y = Number(saved.grid.y) || 0;
    gridTargetX = view.x;
    gridTargetY = view.y;
    applyGrid();
  }
  if (state.view === 'list' && spiral && saved.indexPhase){
    spiral.phase = Number(saved.indexPhase.phase) || 0;
    spiral.target = Number(saved.indexPhase.target) || spiral.phase;
    spiral.entering = false;
    startSpiralTick();
  }
  if (saved.boothOpen && saved.booth) restoreBoothFromState(saved.booth);
  if (saved.colophonOpen) openColophon();
  saveUIState();
}

window.addEventListener('pagehide', saveUIState);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') saveUIState();
});

/* ---------- 启动 ---------- */
function renderAll(){
  renderFilters();
  renderGrid();
  renderList();
  if (state.view === 'slider') renderSlider();
  preloadLayers();
  initOpacityPad();
}

let _w = window.innerWidth, _h = window.innerHeight;
window.addEventListener('resize', () => {
  if (window.innerWidth === _w && window.innerHeight === _h) return;
  _w = window.innerWidth; _h = window.innerHeight;
  renderGrid();
  if (state.view === 'slider') renderSlider();
  if (state.view === 'list') renderList();
});

prepareRestoredUI(bootUIState);
renderAll();
finishRestoredUI(bootUIState);







