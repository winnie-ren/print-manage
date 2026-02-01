export const formConfigOptions = {
 spec: [
  { label: "A4", value: "A4" },
  { label: "A3", value: "A3" },
  { label: "A5", value: "A5" },
  { label: "B4", value: "B4" },
  { label: "16K", value: "16K" },
  { label: "A2", value: "A2" },
  { label: "A1", value: "A1" },
  { label: "A0", value: "A0" },
  { label: "8K", value: "8K" },
  { label: "自定义尺寸", value: 0 },
 ],
 paperType: [
  { label: "80克双胶纸", value: "twoSidePaper_80" },
  { label: "100克双胶纸", value: "twoSidePaper_100" },
  { label: "128克铜版纸", value: "coatedPaper_128" },
  { label: "157克铜板纸", value: "coatedPaper_157" },
 ],
 coverColor: [
  { label: "黑白", value: "black" },
  { label: "彩色", value: "color" },
  { label: "单色", value: "single" },
  { label: "全彩", value: "fullColor" },
 ],
 innerColor: [
  { label: "黑白", value: "black" },
  { label: "彩色", value: "color" },
  { label: "单色", value: "single" },
  { label: "全彩", value: "fullColor" },
 ],
 coverMaterial: [
  { label: "铜板纸", value: "coatedPaper" },
  { label: "特种纸", value: "specialPaper" },
  { label: "皮革纸", value: "stripedPaper" },
 ],
 coverProcess: [
  { label: "不加膜", value: "no" },
  { label: "单面哑膜", value: "singleMatteFilm" },
  { label: "单面光膜", value: "singleLight" },
 ],
 bindingMethod: [
  { label: "骑马钉", value: "mount" },
  { label: "胶装", value: "glue" },
 ],
 deliveryMethod: [
  { label: "自取", value: "self" },
  { label: "送货上门", value: "delivery" },
  { label: "快递到付", value: "cashOnDelivery" },
  { label: "快递寄付", value: "express" },
  { label: "到店取货", value: "pickupStore" },
 ],
 isScan: [
  { label: "是", value: "yes" },
  { label: "否", value: "no" },
 ],
 originalColor: [
  { label: "黑白", value: "black" },
  { label: "彩色", value: "color" },
  { label: "单面", value: "single" },
  { label: "双面", value: "double" },
 ],
 copyColor: [
  { label: "黑白", value: "black" },
  { label: "彩色", value: "color" },
  { label: "单面", value: "single" },
  { label: "双面", value: "double" },
 ],
 deliveryTime: [
  { label: "1小时", value: "1" },
  { label: "2小时", value: "2" },
  { label: "4小时", value: "4" },
 ],
 scanFile: [
  { label: "发送", value: "send" },
  { label: "U盘", value: "uDisk" },
  { label: "刻录光盘", value: "cd" },
 ],
};
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
  value: "printColor",
  children: [
   { label: "黑白", value: "black" },
   { label: "彩色", value: "color" },
  ],
 },
 {
  label: "印面",
  value: "printSide",
  children: [
   { label: "单面", value: "single" },
   { label: "双面", value: "double" },
  ],
 },
 {
  label: "成品尺寸",
  value: "size",
  children: [
   { label: "A5 (148*210)", value: "A5" },
   { label: "B5 (176*250)", value: "B5" },
   { label: "A4 (210*297)", value: "A4" },
   { label: "A3 (297*420)", value: "A3" },
  ],
 },
];
// 黑白书册表单配置
export const blackBookFormConfig = [
 {
  label: "成品规格",
  value: "spec",
  children: [
   { label: "A4", value: "A4" },
   { label: "B5", value: "B5" },
  ],
 },
 {
  label: "纸张",
  value: "paperType",
  children: [
   { label: "80克双胶纸", value: "80" },
   { label: "100克双胶纸", value: "100" },
   { label: "128克铜板纸", value: "128" },
   { label: "157克铜板纸", value: "157" },
  ],
 },
 {
  label: "封面印色",
  value: "coverColor",
  children: [
   { label: "黑白", value: "black" },
   { label: "彩色", value: "color" },
  ],
 },
 {
  label: "内页印色",
  value: "innerColor",
  children: [
   { label: "黑白", value: "black" },
   { label: "彩色", value: "color" },
  ],
 },
 {
  label: "封面材质",
  value: "coverMaterial",
  children: [
   { label: "铜版纸", value: "coatedPaper" },
   { label: "特种纸", value: "specialPaper" },
   { label: "皮纹纸", value: "stripedPaper" },
  ],
 },
 {
  label: "封面工艺",
  value: "coverProcess",
  children: [
   { label: "不过膜", value: "no" },
   { label: "单面哑膜", value: "singleDummy" },
   { label: "单面光膜", value: "singleLight" },
  ],
 },
 {
  label: "装订方式",
  value: "bindingMethod",
  children: [
   { label: "骑马钉", value: "mount" },
   { label: "胶装", value: "glue" },
  ],
 },
 {
  label: "交付方式",
  value: "deliveryMethod",
  children: [
   { label: "自取", value: "self" },
   { label: "送货上门", value: "delivery" },
   { label: "快递到付", value: "express" },
  ],
 },
];
// 标书专项
export const specialFormConfig = [
 {
  label: "是否扫描",
  value: "isScan",
  children: [
   { label: "是", value: "yes" },
   { label: "否", value: "no" },
  ],
 },
 {
  label: "扫描文件",
  value: "scanFile",
  children: [
   { label: "发送", value: "send" },
   { label: "U盘", value: "uDisk" },
   { label: "刻录光盘", value: "cd" },
  ],
 },
 {
  label: "正本印色",
  value: "originalColor",
  children: [
   { label: "黑白", value: "black" },
   { label: "彩色", value: "color" },
  ],
 },
 {
  label: "正本印面",
  value: "originalSide",
  children: [
   { label: "单面", value: "single" },
   { label: "双面", value: "double" },
  ],
 },
 {
  label: "副本印色",
  value: "copyColor",
  children: [
   { label: "黑白", value: "black" },
   { label: "彩色", value: "color" },
  ],
 },
 {
  label: "副本印面",
  value: "copySide",
  children: [
   { label: "单面", value: "single" },
   { label: "双面", value: "double" },
  ],
 },
 {
  label: "封面印色",
  value: "coverColor",
  children: [
   { label: "白色", value: "white" },
   { label: "天兰", value: "skyBlue" },
   { label: "深蓝", value: "deepBlue" },
   { label: "浅绿", value: "lightGreen" },
   { label: "浅黄", value: "lightYellow" },
   { label: "大红", value: "red" },
   { label: "透明封面", value: "transparent" },
  ],
 },
 {
  label: "装订方式",
  value: "bindingMethod",
  children: [
   { label: "胶装", value: "glue" },
   { label: "夹条装", value: "ribbon" },
   { label: "铁圈装", value: "iron" },
  ],
 },
 {
  label: "配送时间",
  value: "deliveryTime",
  children: [
   { label: "1小时", value: "1" },
   { label: "2小时", value: "2" },
   { label: "4小时", value: "4" },
  ],
 },
 {
  label: "配送方式",
  value: "deliveryMethod",
  children: [
   { label: "自取", value: "self" },
   { label: "送货上门", value: "delivery" },
   { label: "快递到付", value: "cashOnDelivery" },
   { label: "快递寄付", value: "express" },
  ],
 },
];