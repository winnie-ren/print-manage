<template>
	<PrintOrderPage
		ref="printOrderPageRef"
		:apiList="$API.print.biddingPage"
		:apiGetById="$API.print.biddingGetById"
		:apiGetByStatus="$API.print.biddingGetByStatus"
		:apiDelete="$API.print.biddingDelete"
		:apiBatchDelete="$API.print.biddingDelete"
		:apiSave="$API.print.biddingSave"
		:apiPay="$API.print.payOrder"
		:apiCalcPrice="$API.print.biddingCalcPrice"
		:getByIdParams="(row) => ({ printNo: row.printNo })"
		:searchConfig="searchConfig"
		:tableHeader="tableHeader"
		:formConfig="formConfig"
		:defaultSearch="defaultSearch"
		:defaultFormDetail="defaultFormDetail"
		:customInputProps="['spec']"
		actionColumn="file"
		actionLabel="文件"
		:enableUpload="true"
		:uploadLimit="0"
		:buyWhenAddOnly="true"
		:disableFormOnView="true"
		:onBuy="handleBuy"
		printType="printBidding"
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
		label: "规格",
		name: "spec",
		component: "select",
		options: {
			placeholder: "请选择规格",
			items: formConfigOptions["spec"],
		},
	},
	{
		label: "正本份数",
		name: "originalCount",
		component: "number",
		options: { placeholder: "请输入正本份数" },
	},
	{
		label: "副本份数",
		name: "copyCopies",
		component: "number",
		options: { placeholder: "请输入副本份数" },
	},
	{
		label: "是否扫描",
		name: "isScan",
		component: "select",
		options: {
			placeholder: "请选择是否扫描",
			items: formConfigOptions["isScan"],
		},
	},
	{
		label: "正本印色",
		name: "originalColor",
		component: "select",
		options: {
			placeholder: "请选择正本印色",
			items: formConfigOptions["originalColor"],
		},
	},
	{
		label: "副本印色",
		name: "copyColor",
		component: "select",
		options: {
			placeholder: "请选择副本印色",
			items: formConfigOptions["copyColor"],
		},
	},
	{
		label: "交付方式",
		name: "deliveryMethod",
		component: "select",
		options: {
			placeholder: "请选择交付方式",
			items: formConfigOptions["deliveryMethod"],
		},
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
		label: "规格",
		name: "spec",
		component: "select",
		options: formConfigOptions["spec"],
		table: true,
		span: 6,
	},
	{
		label: "正本份数",
		name: "originalCount",
		component: "number",
		table: true,
		span: 6,
	},
	{
		label: "副本份数",
		name: "copyCopies",
		component: "number",
		table: true,
		span: 6,
	},
	{
		label: "是否扫描",
		name: "isScan",
		component: "select",
		options: formConfigOptions["isScan"],
		table: true,
		span: 6,
		format: "yes:是/no:否",
	},
	{
		label: "正本印色",
		name: "originalColor",
		component: "select",
		options: formConfigOptions["originalColor"],
		table: true,
		span: 6,
		format: "black:黑白/color:彩色/single:单面/double:双面",
	},
	{
		label: "副本印色",
		name: "copyColor",
		component: "select",
		options: formConfigOptions["copyColor"],
		table: true,
		span: 6,
		format: "black:黑白/color:彩色/single:单面/double:双面",
	},
	{
		label: "交付方式",
		name: "deliveryMethod",
		component: "select",
		options: formConfigOptions["deliveryMethod"],
		table: true,
		span: 6,
		format: "self:自取/delivery:送货上门/cashOnDelivery:快递到付/express:快递寄件/pickupStore:到店取货",
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
		label: "规格",
		prop: "spec",
		type: "radio",
		options: formConfigOptions["spec"],
	},
	{
		label: "工作流程",
		prop: "workflow",
		type: "radio",
		options: [
			{ label: "先印正本", value: "firstPrintCopy" },
			{ label: "直接打印装订", value: "printBindDirect" },
		],
	},
	{ label: "正本份数", prop: "originalCount", type: "input-number" },
	{ label: "副本份数", prop: "copyCopies", type: "input-number" },
	{
		label: "是否扫描",
		prop: "isScan",
		type: "radio",
		options: formConfigOptions["isScan"],
	},
	{
		label: "扫描文件",
		prop: "scanFile",
		type: "radio",
		options: formConfigOptions["scanFile"],
	},
	{
		label: "正本印色",
		prop: "originalColor",
		type: "radio",
		options: formConfigOptions["originalColor"],
	},
	{
		label: "副本印色",
		prop: "copyColor",
		type: "radio",
		options: formConfigOptions["copyColor"],
	},
	{
		label: "封面颜色",
		prop: "coverColor",
		type: "radio",
		options: [
			{ label: "白色", value: "white" },
			{ label: "天蓝", value: "skyBlue" },
			{ label: "深蓝", value: "deepBlue" },
			{ label: "浅绿", value: "lightGreen" },
			{ label: "浅黄", value: "lightYellow" },
			{ label: "大红", value: "red" },
			{ label: "透明封面", value: "transparent" },
		],
	},
	{
		label: "装订方式",
		prop: "bindingMethod",
		type: "radio",
		options: [
			{ label: "胶装", value: "glue" },
			{ label: "夹条装", value: "ribbon" },
			{ label: "铁圈装", value: "iron" },
		],
	},
	{
		label: "出货时效",
		prop: "deliveryTime",
		type: "radio",
		options: formConfigOptions["deliveryTime"],
	},
	{
		label: "交付方式",
		prop: "deliveryMethod",
		type: "radio",
		options: formConfigOptions["deliveryMethod"],
	},
];

const defaultSearch = {
	printNo: "",
	spec: "",
	originalCount: null,
	copyCopies: "",
	isScan: "",
	originalColor: "",
	copyColor: "",
	deliveryMethod: "",
};

const defaultFormDetail = {
	spec: "A4",
	workflow: "先印正本",
	originalCount: 1,
	copyCopies: 1,
	isScan: "yes",
	scanFile: "send",
	originalColor: "black",
	copyColor: "black",
	coverColor: "white",
	bindingMethod: "glue",
	deliveryTime: "1",
	deliveryMethod: "self",
	remarks: "",
	fileId: "",
};

export default {
	name: "tenderDocProject",
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
			const res = await this.$API.print.biddingSave.post(formDetail);
			if (res.code === 0 && res.data) {
				const orderNo = res.data?.printNo;
				if (orderNo) {
					const payRes = await this.$API.print.payOrder.post({
						orderNo,
						printType: "printBidding",
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
