export const materialConfig = {
 coatedPaper: '铜版纸',
 mattePaper: '哑粉纸',
 twoSidePaper: '双胶纸'
}
export const weightConfig = {
 80: '80g',
 100: '100g',
 120: '120g',
 160: '160g',
 157: '157g',
 200: '200g',
 250: '250g',
 300: '300g',
}
// 材料价格数据
export const materialData = [
 { material: "coatedPaper", weight: 157 },
 { material: "coatedPaper", weight: 200 },
 { material: "coatedPaper", weight: 250 },
 { material: "coatedPaper", weight: 300 },
 { material: "mattePaper", weight: 157 },
 { material: "mattePaper", weight: 200 },
 { material: "mattePaper", weight: 250 },
 { material: "mattePaper", weight: 300 },
 { material: "twoSidePaper", weight: 80 },
 { material: "twoSidePaper", weight: 100 },
 { material: "twoSidePaper", weight: 120 },
 { material: "twoSidePaper", weight: 160 },
 { material: "twoSidePaper", weight: 200 },
 { material: "twoSidePaper", weight: 250 },
 { material: "twoSidePaper", weight: 300 },
];
// 单张表单配置
export const singleFormConfig = [
 {
  label: "印色",
  prop: "printColor",
  children: [
   { label: "黑白", prop: "blackWhite" },
   { label: "彩色", prop: "color" },
  ],
 },
 {
  label: "印面",
  prop: "printSide",
  children: [
   { label: "单面", prop: "single" },
   { label: "双面", prop: "double" },
  ],
 },
 {
  label: "成品尺寸",
  prop: "size",
  children: [
   { label: "A5 (148*210)", prop: "A5" },
   { label: "B5 (176*250)", prop: "B5" },
   { label: "A4 (210*297)", prop: "A4" },
   { label: "A3 (297*420)", prop: "A3" },
  ],
 },
];
// 黑白书册表单配置
export const blackBookFormConfig = [
 {
  label: "成品规格",
  prop: "sizes",
  children: [
   { label: "A4", prop: "A4" },
   { label: "B5", prop: "B5" },
  ],
 },
 {
  label: "纸张",
  prop: "papers",
  children: [
   { label: "80克双胶纸", prop: "80" },
   { label: "100克双胶纸", prop: "100" },
   { label: "128克铜板纸", prop: "128" },
   { label: "157克铜板纸", prop: "157" },
  ],
 },
 {
  label: "封面印色",
  prop: "coverColor",
  children: [
   { label: "黑白", prop: "black" },
   { label: "彩色", prop: "color" },
  ],
 },
 {
  label: "内页印色",
  prop: "innerColor",
  children: [
   { label: "黑白", prop: "black" },
   { label: "彩色", prop: "color" },
  ],
 },
 {
  label: "封面材料",
  prop: "coverMaterial",
  children: [
   { label: "铜版纸", prop: "coatedPaper" },
   { label: "特种纸", prop: "specialPaper" },
   { label: "皮纹纸", prop: "stripedPaper" },
  ],
 },
 {
  label: "封面工艺",
  prop: "coverProcess",
  children: [
   { label: "不过膜", prop: "no" },
   { label: "单面哑膜", prop: "singleDummy" },
   { label: "单面光膜", prop: "singleLight" },
  ],
 },
 {
  label: "装订方式",
  prop: "binding",
  children: [
   { label: "骑马钉", prop: "mount" },
   { label: "胶装", prop: "glue" },
  ],
 },
 {
  label: "交付方式",
  prop: "delivery",
  children: [
   { label: "自取", prop: "self" },
   { label: "送货上门", prop: "delivery" },
   { label: "快递到付", prop: "express" },
  ],
 },
];
// 标书专项
export const specialFormConfig = [
 {
  label: "是否扫描",
  prop: "scan",
  children: [
   { label: "是", prop: "yes" },
   { label: "否", prop: "no" },
  ],
 },
 {
  label: "扫描文件",
  prop: "scanFile",
  children: [
   { label: "发送", prop: "send" },
   { label: "U盘", prop: "uDisk" },
   { label: "刻录光盘", prop: "cd" },
  ],
 },
 {
  label: "正本印色",
  prop: "originalColor",
  children: [
   { label: "黑白", prop: "black" },
   { label: "彩色", prop: "color" },
  ],
 },
 {
  label: "正本印面",
  prop: "originalSide",
  children: [
   { label: "单面", prop: "single" },
   { label: "双面", prop: "double" },
  ],
 },
 {
  label: "副本印色",
  prop: "copyColor",
  children: [
   { label: "黑白", prop: "black" },
   { label: "彩色", prop: "color" },
  ],
 },
 {
  label: "副本印面",
  prop: "copySide",
  children: [
   { label: "单面", prop: "single" },
   { label: "双面", prop: "double" },
  ],
 },
 {
  label: "封面印色",
  prop: "coverColor",
  children: [
   { label: "白色", prop: "white" },
   { label: "天兰", prop: "skyBlue" },
   { label: "深蓝", prop: "deepBlue" },
   { label: "浅绿", prop: "lightGreen" },
   { label: "浅黄", prop: "lightYellow" },
   { label: "大红", prop: "red" },
   { label: "透明封面", prop: "transparent" },
  ],
 },
 {
  label: "装订方式",
  prop: "binding",
  children: [
   { label: "胶装", prop: "glue" },
   { label: "夹条装", prop: "ribbon" },
   { label: "铁圈装", prop: "iron" },
  ],
 },
 {
  label: "配送时间",
  prop: "deliveryTime",
  children: [
   { label: "1小时", prop: "1" },
   { label: "2小时", prop: "2" },
   { label: "4小时", prop: "4" },
  ],
 },
 {
  label: "配送方式",
  prop: "delivery",
  children: [
   { label: "自取", prop: "self" },
   { label: "送货上门", prop: "delivery" },
   { label: "快递到付", prop: "cashOnDelivery" },
   { label: "快递寄付", prop: "express" },
  ],
 },
];