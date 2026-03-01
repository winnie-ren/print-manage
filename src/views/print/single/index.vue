<template>
	<el-container>
		<el-aside width="250px">
			<el-form label-position="top" size="small">
				<template v-for="item in searchConfig" :key="item.name">
					<el-form-item :label="item.label">
						<el-input
							v-if="item.component === 'input'"
							v-model="search[item.name]"
							:placeholder="item.options?.placeholder || '请输入'"
							clearable
						></el-input>
						<el-select
							v-else-if="item.component === 'select'"
							v-model="search[item.name]"
							:placeholder="item.options?.placeholder || '请选择'"
							clearable
							style="width: 100%"
						>
							<el-option
								v-for="option in item.options?.items || []"
								:key="option.value"
								:label="option.label"
								:value="option.value"
							></el-option>
						</el-select>
						<el-input-number
							v-else-if="item.component === 'number'"
							v-model="search[item.name]"
							:min="1"
							controls-position="right"
							style="width: 100%"
						/>
					</el-form-item>
				</template>
				<div class="search-btn">
					<el-button
						type="primary"
						icon="el-icon-search"
						@click="upsearch"
					>
						查询
					</el-button>
					<el-button icon="el-icon-refresh" @click="resetSearch">
						重置
					</el-button>
				</div>
			</el-form>
		</el-aside>
		<el-container>
			<el-header>
				<div class="left-panel">
					<el-button
						type="primary"
						icon="el-icon-plus"
						size="small"
						@click="add"
					>
						新增
					</el-button>
					<el-button
						type="danger"
						plain
						icon="el-icon-delete"
						size="small"
						:disabled="selection.length == 0"
						@click="batch_del"
					>
						删除
					</el-button>
				</div>
			</el-header>
			<el-main class="nopadding">
				<scTable
					ref="table"
					:apiObj="list.apiObj"
					row-key="id"
					stripe
					@selectionChange="selectionChange"
				>
					<el-table-column
						type="selection"
						width="50"
					></el-table-column>
					<template v-for="item in tableHeader" :key="item.name">
						<el-table-column
							v-if="item.table !== false"
							:label="item.label"
							:prop="item.name"
							:width="item.width"
							:formatter="
								item.format ? (row) => formatter(row, item) : ''
							"
						>
						</el-table-column>
					</template>
					<el-table-column
						label="操作"
						fixed="right"
						align="right"
						width="160"
					>
						<template #default="scope">
							<el-button-group>
								<el-button
									text
									type="primary"
									size="small"
									@click="table_show(scope.row, scope.$index)"
									>查看</el-button
								>
								<el-popconfirm
									title="确定删除吗？"
									@confirm="table_del(scope.row)"
								>
									<template #reference>
										<el-button
											text
											type="primary"
											size="small"
											>删除</el-button
										>
									</template>
								</el-popconfirm>
							</el-button-group>
						</template>
					</el-table-column>
				</scTable>
			</el-main>
		</el-container>
		<el-dialog
			class="print-dialog"
			v-model="dialogVisible"
			:title="dialogTitle"
			width="80%"
			top="20px"
		>
			<div class="print-page">
				<el-main>
					<el-form
						ref="formRef"
						:model="formDetail"
						label-width="100px"
						status-icon
					>
						<el-form-item
							v-for="item in formConfig"
							:key="item.prop"
							:label="item.label"
							:prop="item.prop"
						>
							<el-radio-group v-model="formDetail[item.prop]">
								<el-radio
									v-for="option in item.options"
									:key="option.value"
									:label="option.value"
									border
								>
									{{ option.label }}
								</el-radio>
								<el-input
									v-if="
										[
											'size',
											'weight',
											'styleCount',
											'sheetCount',
										].includes(item.prop) &&
										formDetail[item.prop] === 0
									"
									v-model="formDetail[item.prop + 'Custom']"
									clearable
									style="width: 120px"
									placeholder="请输入"
								></el-input>
							</el-radio-group>
						</el-form-item>
						<el-form-item label="补充说明" prop="remarks">
							<el-input
								v-model="formDetail.remarks"
								type="textarea"
								placeholder="其他对商品要求的描述或补充说明"
							></el-input>
						</el-form-item>
						<el-form-item label="文件上传" prop="files">
							<el-upload
								class="upload-demo"
								drag
								:limit="1"
								action="/api/files/upload"
								:on-exceed="handleExceed"
								:on-success="uploadSuccess"
								v-if="!uploadDisabled"
								style="flex: 1"
							>
								<el-icon size="80" color="#ffaf58"
									><upload-filled
								/></el-icon>
								<div class="el-upload__text">
									请将文件拖到此处或 <em>点击上传</em>
								</div>
							</el-upload>
							<div
								v-if="uploadDisabled && formDetail.fileUrl"
								class="file-list"
							>
								<span>文件数量：1</span>
								<el-button type="primary" @click="downloadFile(formDetail.fileUrl)">下载文件</el-button>
							</div>
						</el-form-item>
					</el-form>
				</el-main>
				<div class="bottom-shop">
					<div class="order-content">
						<!-- <span class="price"> 官网下单￥ </span>
						<span>预计生产时间， 预计净重</span> -->
					</div>
					<!-- <el-button
						type="primary"
						size="large"
						plain
						style="margin-right: 10px"
						>计算价格</el-button
					> -->
					<el-button-group>
						<!-- <el-button type="danger" size="large">
							加入购物车
						</el-button> -->
						<el-button type="success" size="large" @click="buyNow"
							>立即购买</el-button
						>
					</el-button-group>
				</div>
			</div>
		</el-dialog>
	</el-container>
</template>

<script>
import { UploadFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
// 从表单配置中提取选项数据
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
		component: "input", // 保留输入框因为有自定义值
		table: true,
		span: 6,
	},
	{
		label: "订单金额(分)",
		name: "totalFee",
		component: "input", // 保留输入框因为有自定义值
		table: true,
		span: 6,
	},
	{
		label: "状态",
		name: "status",
		component: "input", // 保留输入框因为有自定义值
		table: true,
		span: 6,
		format: "INIT:已创建/PAYING:已下单等待支付/SUCCESS:支付成功/FAIL:支付失败/CLOSED:已关闭或超时",
	},
	{
		label: "张数",
		name: "sheetCount",
		component: "number", // 保留输入框因为有自定义值
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
		component: "input", // 保留输入框因为有自定义值
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
		component: "input", // 保留输入框因为有自定义值
		table: true,
		span: 6,
	},
	{
		label: "款数",
		name: "styleCount",
		component: "number", // 保留输入框因为有自定义值
		table: true,
		span: 6,
	},
];

export default {
	name: "single",
	components: {
		UploadFilled,
	},
	data() {
		return {
			list: {
				apiObj: this.$API.print.singlePage,
			},
			tableHeader,
			searchConfig,
			page: {
				pageSize: 20,
				pageNum: 1,
				total: 0,
			},
			selection: [],
			dialogVisible: false,
			dialogTitle: "新增",
			search: {
				printNo: "",
				sheetCount: "",
				printSide: "",
				size: "",
				material: "",
				weight: "",
				styleCount: "",
			},
			formDetail: {
				printColor: "black",
				printSide: "single",
				size: "A5",
				material: "coatedPaper",
				weight: 157,
				styleCount: 1,
				sheetCount: 1,
				deliveryMethod: "self",
				payType: "ALIPAY",
				remarks: "",
				fileId: "",
			},
			formConfig: [
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
						{ label: "157g", value: 157 },
						{ label: "200g", value: 200 },
						{ label: "250g", value: 250 },
						{ label: "300g", value: 300 },
						{ label: "80g", value: 80 },
						{ label: "100g", value: 100 },
						{ label: "120g", value: 120 },
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
					prop: "payType",
					type: "radio",
					options: [
						{ label: "微信", value: "WXPAY" },
						{ label: "支付宝", value: "ALIPAY" },
					],
				},
			],
			uploadDisabled: false,
		};
	},
	methods: {
		// 新增
		add() {
			this.dialogTitle = "新增";
			this.resetForm();
			this.dialogVisible = true;
			this.uploadDisabled = false;
		},
		// 查看
		async table_show(row) {
			this.dialogTitle = "查看";
			this.dialogVisible = true;
			var res = await this.$API.print.singleGetById.get({
				printNo: row.printNo,
			});
			this.uploadDisabled = true;
			if (res.code == 0) {
				this.formDetail = res.data;
			} else {
				this.$nextTick(() => {
					this.formDetail = { ...row };
				});
			}
		},
		// 删除
		async table_del(row) {
			var res = await this.$API.print.singleDelete.delete([row.id]);
			if (res.code == 0) {
				this.$message.success("删除成功");
				this.$refs.table.getData(); // 刷新表格
			}
		},
		// 批量删除
		async batch_del() {
			this.$confirm(
				`确定删除选中的 ${this.selection.length} 项吗？`,
				"提示",
				{
					type: "warning",
				}
			)
				.then(async () => {
					const loading = this.$loading();
					const ids = this.selection.map((item) => item.id);
					const res = await this.$API.print.singleDelete.delete(ids);
					if (res.code === 0) {
						this.$message.success("删除成功");
						this.$refs.table.getData(); // 刷新表格
					}
					loading.close();
				})
				.catch(() => {});
		},
		// 表格选择后回调事件
		selectionChange(selection) {
			this.selection = selection;
		},
		// 搜索
		upsearch() {
			// 过滤掉空字符串，只传递有值的参数
			const filteredSearch = {};
			for (const key in this.search) {
				const value = this.search[key];
				if (value !== "" && value !== null && value !== undefined) {
					filteredSearch[key] = value;
				}
			}
			this.$refs.table.upData(filteredSearch);
		},
		// 重置查询条件
		resetSearch() {
			// 根据配置重置搜索条件
			const resetSearch = {};
			this.searchConfig.forEach((item) => {
				resetSearch[item.name] = "";
			});
			this.search = resetSearch;
			this.$refs.table.upData(this.search);
		},
		formatter(row, item) {
			// 表格字段格式化
			const map = item.format.split("/").reduce((acc, item) => {
				const [key, label] = item.split(":");
				acc[key.trim()] = label.trim();
				return acc;
			}, {});
			return map[String(row[item.name])] || "";
		},
		async onSubmit() {
			// 提交表单数据
			const res = await this.$API.print.singleSave.post(this.formDetail);
			if (res.code === 0) {
				this.dialogVisible = false;
				this.$refs.table.getData(); // 刷新表格
				ElMessage.success("操作成功");
			} else {
				ElMessage.error(res.message || "操作失败");
			}
		},
		resetForm() {
			this.formDetail = {
				printColor: "black",
				printSide: "single",
				size: "A5",
				material: "coatedPaper",
				weight: 157,
				styleCount: 1,
				sheetCount: 1,
				deliveryMethod: "self",
				payType: "ALIPAY",
				remarks: "",
				fileId: "",
			};
		},
		uploadSuccess(response) {
			if (response?.code === 0) {
				this.formDetail.fileId = response.data.fileCode;
			}
		},
		handleExceed() {
			this.$message.warning(`只允许上传一个文件`);
		},
		// 启动轮询
		startPolling(orderNo, payWindow) {
			this.orderNo = orderNo;
			this.pollingInterval = setInterval(async () => {
				const res = await this.$API.print.singleGetById.get({
					printNo: orderNo,
				});
				if (res.code === 0 && res.data.status === "SUCCESS") {
					this.stopPolling();
					this.handlePaymentSuccess(payWindow);
				}
			}, 2000); // 每2秒查询一次
		},
		// 停止轮询
		stopPolling() {
			if (this.pollingInterval) {
				clearInterval(this.pollingInterval);
				this.pollingInterval = null;
			}
		},
		// 处理支付成功
		handlePaymentSuccess(payWindow) {
			this.$message.success("支付成功");
			this.dialogVisible = false;
			this.$refs.table.getData();
			if (payWindow && !payWindow.closed) {
				payWindow.close();
			}
		},
		// 监听页面可见性变化
		handleVisibilityChange() {
			if (!document.hidden) {
				this.checkOrderStatusOnReturn();
			}
		},
		// 页面返回时检查订单状态
		async checkOrderStatusOnReturn() {
			if (this.orderNo) {
				const res = await this.$API.print.singleGetById.get({
					printNo: this.orderNo,
				});
				if (res.code === 0 && res.data.status === "SUCCESS") {
					this.stopPolling();
					this.handlePaymentSuccess();
				}
			}
		},
		// 立即购买
		async buyNow() {
			const res = await this.$API.print.singleSave.post(this.formDetail);
			if (res.code === 0 && res.data) {
				const orderNo = res.data?.printNo;
				if (orderNo) {
					// 订单预支付
					const payRes = await this.$API.print.payOrder.post({
						orderNo,
						printType: "printSinglePage",
					});
					if (payRes.code === 0) {
						if (this.formDetail.payType === "ALIPAY") {
							// 监听页面可见性变化
							document.addEventListener(
								"visibilitychange",
								this.handleVisibilityChange
							);
							// 打开新页签加载支付页面
							const paymentWindow = window.open("", "_blank");
							paymentWindow.document.write(payRes.data);
							// 启动轮询
							this.startPolling(orderNo, paymentWindow);
							paymentWindow.document.close();
							// 监听新页签关闭事件
							const checkClosed = setInterval(() => {
								if (paymentWindow.closed) {
									clearInterval(checkClosed);
									this.checkOrderStatusOnReturn(); // 检查支付状态
								}
							}, 1000);
						}
					}
				}
			}
		},
		async downloadFile(fileUrl) {
			const response = await this.$API.print.fileDownload.post(fileUrl, {});
			const fileReader = new FileReader();
			fileReader.readAsText(response.data, 'utf-8');
			fileReader.onload = function () {
				try {
					const result = JSON.parse(fileReader.result);
					if (!(result.code === 200 || result.code === 0)) {
						ElMessage.error(result.msg); // 业务中拼接报错提示
					}
				} catch (e) {
					const blob = new Blob([response.data]);
					const url = window.URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = url;
					const contentDisposition = response.headers['content-disposition'];
					let filename = 'file.txt';
					if (contentDisposition) {
						const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
						const matches = filenameRegex.exec(contentDisposition);
						if (matches != null && matches[1]) {
							filename = matches[1].replace(/['"]/g, '').replace('UTF-8', '');
						}
					}
					link.setAttribute('download', decodeURIComponent(filename));
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					window.URL.revokeObjectURL(url);
				}
			};
		}
	},
	beforeUnmount() {
		this.stopPolling(); // 清理轮询
		document.removeEventListener(
			"visibilitychange",
			this.handleVisibilityChange
		); // 移除事件监听
	},
};
</script>
<style lang="scss">
.print-dialog {
	.el-dialog__body {
		padding: 0 !important;
	}
	.el-dialog__header {
		border-bottom: 1px solid var(--el-border-color-light);
	}
}
</style>
<style lang="scss" scoped>
.el-header {
	--el-header-height: 40px;
}
.el-aside {
	padding: 10px;

	.search-btn {
		padding-top: 10px;
		display: flex;
		gap: 8px;

		.el-button {
			flex: 1;
		}
	}
}

.print-dialog {
	.print-page {
		height: calc(100vh - 100px);
	}
	.el-main {
		padding-top: 10px;
		padding-left: 0;
		padding-right: 0;
	}
}

.bottom-shop {
	background-color: white;
	padding: 15px 30px;
	box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 15px;
}

.order-content {
	flex: 1;
	font-size: 16px;
	font-weight: bold;
}
.file-list {
	margin-top: 10px;
	margin-right: 10px;
	padding: 10px;
	border: 1px dashed #ccc;
	border-radius: 4px;
	background-color: #f9f9f9;
	width: 100%;
	span{
		padding-right: 10px;
	}
}
</style>
