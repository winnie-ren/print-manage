<template>
	<PrintOrderPage
		ref="printOrderPageRef"
		:apiList="$API.print.singlePage"
		:apiGetById="$API.print.singleGetById"
		:apiGetByStatus="$API.print.singleGetByStatus"
		:apiDelete="$API.print.singleDelete"
		:apiBatchDelete="$API.print.singleDelete"
		:apiSave="$API.print.singleSave"
		:apiPay="$API.print.payOrder"
		:getByIdParams="(row) => ({ printNo: row.printNo })"
		:searchConfig="searchConfig"
		:tableHeader="tableHeader"
		:formConfig="formConfig"
		:defaultSearch="defaultSearch"
		:defaultFormDetail="defaultFormDetail"
		:customInputProps="['size', 'weight', 'styleCount', 'sheetCount']"
		actionColumn="file"
		actionLabel="文件"
		:enableUpload="true"
		:uploadLimit="0"
		:buyWhenAddOnly="true"
		:disableFormOnView="true"
		:onBuy="handleBuy"
		printType="printSinglePage"
	/>
</template>

<script>
import PrintOrderPage from "@/views/print/components/PrintOrderPage.vue";
import { formConfigOptions } from "@/views/price/config/index.ts";
// 搜索配置
const searchConfig = [
	{
		label: "打印单号",
		name: "printNo",
		component: "input",
		options: { placeholder: "请输入打印单号" },
	},
	{
		label: "张数",
		name: "sheetCount",
		component: "number",
		options: { placeholder: "请输入张数" },
	},
	{
		label: "印面",
		name: "printSide",
		component: "select",
		options: {
			placeholder: "请选择印面",
			items: formConfigOptions["printSide"],
		},
	},
	{
		label: "成品尺寸",
		name: "size",
		component: "input",
		options: { placeholder: "请输入成品尺寸" },
	},
	{
		label: "材料",
		name: "material",
		component: "select",
		options: {
			placeholder: "请选择材料",
			items: formConfigOptions["material"],
		},
	},
	{
		label: "克重",
		name: "weight",
		component: "input",
		options: { placeholder: "请输入克重" },
	},
	{
		label: "款数",
		name: "styleCount",
		component: "number",
		options: { placeholder: "请输入款数" },
	},
];

// 定义表格头部配置
const tableHeader = [
	{
		label: "打印单号",
		name: "printNo",
		component: "input",
		table: true,
		span: 6,
		width: 120
	},
	{
		label: "订单金额(元)",
		name: "totalFee",
		component: "input",
		table: true,
		span: 6,
		width: 100
	},
	{
		label: "状态",
		name: "status",
		component: "input",
		table: true,
		span: 6,
		format: "INIT:待支付/PAYING:已下单等待支付/SUCCESS:支付成功/FAIL:支付失败/CLOSED:已关闭或超时",
	},
	{
		label: "张数",
		name: "sheetCount",
		component: "number",
		table: true,
		span: 6,
	},
	{
		label: "印面",
		name: "printSide",
		component: "select",
		options: formConfigOptions["printSide"],
		table: true,
		span: 6,
		format: "single:单面/double:双面",
	},
	{
		label: "成品尺寸",
		name: "size",
		component: "input",
		table: true,
		span: 6,
	},
	{
		label: "材料",
		name: "material",
		component: "select",
		options: formConfigOptions["material"],
		table: true,
		span: 6,
		format: "coatedPaper:铜版纸/mattePaper:哑粉纸/twoSidePaper:双胶纸",
	},
	{
		label: "克重",
		name: "weight",
		component: "input",
		table: true,
		span: 6,
	},
	{
		label: "款数",
		name: "styleCount",
		component: "number",
		table: true,
		span: 6,
	},
	{
		label: "创建时间",
		name: "createTime",
		component: "date",
		table: true,
		span: 6,
		width: "140px",
	},
];

const formConfig = [
	{
		label: "印色",
		prop: "printColor",
		type: "radio",
		options: [
			{ label: "黑白", value: "black" },
			{ label: "彩色", value: "color" },
		],
	},
	{
		label: "印面",
		prop: "printSide",
		type: "radio",
		options: [
			{ label: "单面", value: "single" },
			{ label: "双面", value: "double" },
		],
	},
	{
		label: "成品尺寸",
		prop: "size",
		type: "radio",
		options: [
			{ label: "A5 (148*210)", value: "A5" },
			{ label: "B5 (176*250)", value: "B5" },
			{ label: "A4 (210*297)", value: "A4" },
			{ label: "A3 (297*420)", value: "A3" },
			{ label: "自定义", value: 0 },
		],
	},
	{
		label: "材料",
		prop: "material",
		type: "radio",
		options: [
			{ label: "铜版纸", value: "coatedPaper" },
			{ label: "哑粉纸", value: "mattePaper" },
			{ label: "双胶纸", value: "twoSidePaper" },
		],
	},
	{
		label: "克重",
		prop: "weight",
		type: "radio",
		options: [
			{ label: "157g", value: "157" },
			{ label: "200g", value: "200" },
			{ label: "250g", value: "250" },
			{ label: "300g", value: "300" },
			{ label: "80g", value: "80" },
			{ label: "100g", value: "100" },
			{ label: "120g", value: "120" },
			{ label: "自定义", value: 0 },
		],
	},
	{
		label: "款数",
		prop: "styleCount",
		type: "radio",
		options: [
			{ label: "1", value: 1 },
			{ label: "2", value: 2 },
			{ label: "3", value: 3 },
			{ label: "5", value: 4 },
			{ label: "自定义", value: 0 },
		],
	},
	{
		label: "张数",
		prop: "sheetCount",
		type: "radio",
		options: [
			{ label: "1", value: 1 },
			{ label: "100", value: 100 },
			{ label: "500", value: 500 },
			{ label: "1000", value: 1000 },
			{ label: "自定义", value: 0 },
		],
	},
	{
		label: "交付方式",
		prop: "deliveryMethod",
		type: "radio",
		options: formConfigOptions["deliveryMethod"],
	},
	{
		label: "支付方式",
		prop: "paymentType",
		type: "radio",
		options: [
			{ label: "微信", value: "WXPAY" },
			{ label: "支付宝", value: "ALIPAY" },
		],
	},
];

const defaultSearch = {
	printNo: "",
	sheetCount: null,
	printSide: "",
	size: "",
	material: "",
	weight: "",
	styleCount: null,
};

const defaultFormDetail = {
	printColor: "black",
	printSide: "single",
	size: "A5",
	material: "coatedPaper",
	weight: "157",
	styleCount: 1,
	sheetCount: 1,
	deliveryMethod: "self",
	paymentType: "ALIPAY",
	remarks: "",
	fileId: "",
};

export default {
	name: "single",
	components: { PrintOrderPage },
	data() {
		return {
			searchConfig,
			tableHeader,
			formConfig,
			defaultSearch,
			defaultFormDetail,
			buyHelpers: null,
		};
	},
	methods: {
		async handleBuy(formDetail, helpers) {
			this.buyHelpers = helpers;
			const res = await this.$API.print.singleSave.post(formDetail);
			if (res.code === 0 && res.data) {
				const orderNo = res.data?.printNo;
				if (orderNo) {
					const payRes = await this.$API.print.payOrder.post({
						orderNo,
						printType: "printSinglePage",
					});
					if (payRes.code === 0) {
						this.$refs.printOrderPageRef.renderQrCode(
							payRes.data,
							orderNo
						);
					}
				}
			}
			helpers.setLoading(false);
		},
	},
};
</script>
