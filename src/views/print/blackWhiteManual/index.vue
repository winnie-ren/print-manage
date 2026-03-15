<template>
	<PrintOrderPage
		ref="printOrderPageRef"
		:apiList="$API.print.blackPage"
		:apiGetById="$API.print.blackGetById"
		:apiDelete="$API.print.blackDelete"
		:apiBatchDelete="$API.print.blackDelete"
		:apiSave="$API.print.blackSave"
		:apiPay="$API.print.payOrder"
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
		label: "成品规格",
		name: "spec",
		component: "select",
		options: {
			placeholder: "请选择成品规格",
			items: formConfigOptions["spec"],
		},
	},
	{
		label: "份数",
		name: "quantity",
		component: "number",
		options: { placeholder: "请输入份数" },
	},
	{
		label: "纸张",
		name: "paperType",
		component: "select",
		options: {
			placeholder: "请选择纸张",
			items: formConfigOptions["paperType"],
		},
	},
	{
		label: "封面印色",
		name: "coverColor",
		component: "select",
		options: {
			placeholder: "请选择封面印色",
			items: formConfigOptions["coverColor"],
		},
	},
	{
		label: "内页印色",
		name: "innerColor",
		component: "select",
		options: {
			placeholder: "请选择内页印色",
			items: formConfigOptions["innerColor"],
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
	},
	{
		label: "订单金额(元)",
		name: "totalFee",
		component: "input",
		table: true,
		span: 6,
	},
	{
		label: "状态",
		name: "status",
		component: "input",
		table: true,
		span: 6,
		format: "INIT:已创建/PAYING:已下单等待支付/SUCCESS:支付成功/FAIL:支付失败/CLOSED:已关闭或超时",
	},
	{
		label: "成品规格",
		name: "spec",
		component: "select",
		options: formConfigOptions["spec"],
		table: true,
		span: 6,
	},
	{
		label: "份数",
		name: "quantity",
		component: "number",
		table: true,
		span: 6,
	},
	{
		label: "纸张",
		name: "paperType",
		component: "select",
		options: formConfigOptions["paperType"],
		table: true,
		span: 6,
		format: "twoSidePaper_80:80克双胶纸/twoSidePaper_100:100克双胶纸/coatedPaper_128:128克铜版纸/coatedPaper_157:157克铜版纸",
	},
	{
		label: "封面印色",
		name: "coverColor",
		component: "select",
		options: formConfigOptions["coverColor"],
		table: true,
		span: 6,
		format: "black:黑白/color:彩色/single:单色/fullColor:全彩",
	},
	{
		label: "内页印色",
		name: "innerColor",
		component: "select",
		options: formConfigOptions["innerColor"],
		table: true,
		span: 6,
		format: "black:黑白/color:彩色/single:单色/fullColor:全彩",
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
		label: "成品规格",
		prop: "spec",
		type: "radio",
		options: formConfigOptions["spec"],
	},
	{
		label: "文件页数",
		prop: "printArea",
		type: "radio",
		options: [{ label: "100", value: 1 }],
	},
	{
		label: "份数",
		prop: "quantity",
		type: "radio",
		options: [
			{ label: "1", value: 1 },
			{ label: "10", value: 2 },
			{ label: "50", value: 3 },
			{ label: "100", value: 4 },
		],
	},
	{
		label: "纸张",
		prop: "paperType",
		type: "radio",
		options: formConfigOptions["paperType"],
	},
	{
		label: "封面印色",
		prop: "coverColor",
		type: "radio",
		options: formConfigOptions["coverColor"],
	},
	{
		label: "内页印色",
		prop: "innerColor",
		type: "radio",
		options: formConfigOptions["innerColor"],
	},
	{
		label: "封面材质",
		prop: "coverMaterial",
		type: "radio",
		options: formConfigOptions["coverMaterial"],
	},
	{
		label: "封面工艺",
		prop: "coverProcess",
		type: "radio",
		options: [
			{ label: "不加膜", value: "no" },
			{ label: "烫金", value: "singleDummy" },
			{ label: "单面光膜", value: "singleLight" },
		],
	},
	{
		label: "装订方式",
		prop: "bindingMethod",
		type: "radio",
		options: formConfigOptions["bindingMethod"],
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
	quantity: null,
	paperType: "",
	coverColor: "",
	innerColor: "",
	deliveryMethod: "",
};

const defaultFormDetail = {
	spec: "A4",
	printArea: 1,
	quantity: 1,
	paperType: "twoSidePaper_80",
	coverColor: "black",
	innerColor: "black",
	coverMaterial: "coatedPaper",
	coverProcess: "no",
	bindingMethod: "mount",
	deliveryMethod: "self",
	remarks: "",
	customSize: "",
	fileId: "",
};

export default {
	name: "blackWhiteManual",
	components: { PrintOrderPage },
	data() {
		return {
			searchConfig,
			tableHeader,
			formConfig,
			defaultSearch,
			defaultFormDetail,
			orderNo: null,
			pollingInterval: null,
			buyHelpers: null,
		};
	},
	methods: {
		async handleBuy(formDetail, helpers) {
			this.buyHelpers = helpers;
			const res = await this.$API.print.blackSave.post(formDetail);
			if (res.code === 0 && res.data) {
				const orderNo = res.data?.printNo;
				if (orderNo) {
					const payRes = await this.$API.print.payOrder.post({
						orderNo,
						printType: "printSinglePage",
					});
					if (payRes.code === 0) {
						this.$refs.printOrderPageRef.renderQrCode(payRes.data);
					}
				}
			}
			helpers.setLoading(false);
		},
	},
};
</script>
