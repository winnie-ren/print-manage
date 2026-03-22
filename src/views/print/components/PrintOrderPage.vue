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
						/>
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
							/>
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
						:disabled="selection.length === 0"
						@click="batch_del"
					>
						删除
					</el-button>
				</div>
			</el-header>

			<el-main class="nopadding">
				<scTable
					ref="table"
					:apiObj="apiList"
					:row-key="rowKey"
					stripe
					@selectionChange="selectionChange"
					@dataChange="handleTableDataChange"
				>
					<el-table-column type="selection" width="50" />
					<template v-for="item in tableHeader" :key="item.name">
						<el-table-column
							v-if="item.table !== false"
							:label="item.label"
							:prop="item.name"
							:width="item.width"
							:formatter="
								item.format
									? (row) => formatter(row, item)
									: undefined
							"
						>
							<template #default="scope">
								<el-tag
									v-if="
										item.name === 'status' &&
										scope.row.status
									"
									:type="getStatusType(scope.row.status)"
									effect="plain"
								>
									{{
										item.format
											? formatter(scope.row, item)
											: scope.row[item.name]
									}}
								</el-tag>
								<span v-else>
									{{
										item.format
											? formatter(scope.row, item)
											: scope.row[item.name]
									}}
								</span>
							</template>
						</el-table-column>
					</template>

					<el-table-column
						v-if="actionColumn === 'file'"
						:label="actionLabelText"
						fixed="right"
						width="180"
					>
						<template #default="scope">
							<el-button-group>
								<el-tooltip
									class="item"
									effect="dark"
									content="查看文件"
									placement="top"
								>
									<el-button
										type="primary"
										size="small"
										@click="table_show(scope.row)"
									>
										查看
									</el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="点击支付"
									placement="top"
								>
									<el-button
										type="success"
										size="small"
										v-if="
											scope.row.status === 'INIT' &&
											scope.row.remainSeconds > 0
										"
										@click="handlePay(scope.row)"
									>
										支付剩余
										{{
											formatRemainSeconds(
												scope.row._remainSeconds
											)
										}}
									</el-button>
								</el-tooltip>
							</el-button-group>
						</template>
					</el-table-column>

					<el-table-column
						v-else
						:label="actionLabelText"
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
									@click="table_show(scope.row)"
								>
									查看
								</el-button>
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
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:before-close="beforeClose"
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
							<el-input-number
								v-if="item.type === 'input-number'"
								v-model="formDetail[item.prop]"
								:min="1"
								controls-position="right"
								:disabled="isView && disableFormOnView"
							/>
							<el-radio-group
								v-else
								v-model="formDetail[item.prop]"
								:disabled="isView && disableFormOnView"
							>
								<el-radio
									v-for="option in item.options"
									:key="option.value"
									:label="option.value"
									border
									:disabled="isView && disableFormOnView"
								>
									{{ option.label }}
								</el-radio>
								<el-input
									v-if="shouldShowCustomInput(item)"
									v-model="formDetail[item.prop + 'Custom']"
									clearable
									style="width: 120px"
									:disabled="isView && disableFormOnView"
									placeholder="请输入"
								/>
							</el-radio-group>
						</el-form-item>

						<el-form-item
							v-if="showRemarks"
							label="补充说明"
							prop="remarks"
						>
							<el-input
								v-model="formDetail.remarks"
								type="textarea"
								placeholder="其他对商品要求的描述或补充说明"
								:disabled="isView && disableFormOnView"
							/>
						</el-form-item>

						<el-form-item
							v-if="enableUpload"
							label="文件上传"
							prop="files"
						>
							<el-upload
								class="upload-demo"
								drag
								:limit="uploadLimit || undefined"
								:action="uploadAction"
								:on-exceed="handleExceed"
								:on-progress="handleProgress"
								:on-remove="handleRemove"
								:on-success="uploadSuccess"
								v-if="!uploadDisabled"
								style="flex: 1"
								ref="uploadRef"
							>
								<el-icon size="80" color="#ffaf58"
									><upload-filled
								/></el-icon>
								<div class="el-upload__text">
									请将文件拖到此处或<em>点击上传</em>
								</div>
							</el-upload>

							<div
								v-if="uploadDisabled && fileList.length > 0"
								class="file-list"
							>
								<div class="file-summary">
									<el-icon color="#409EFF"
										><FolderOpened
									/></el-icon>
									<span>共 {{ fileList.length }} 个文件</span>
								</div>
								<li
									v-for="file in fileList"
									:key="file.id"
									class="file-item"
								>
									<div class="file-info">
										<el-icon color="#909399"
											><Document
										/></el-icon>
										<span class="file-name">{{
											file[fileNameKey]
										}}</span>
									</div>
									<el-button
										type="primary"
										size="small"
										plain
										@click="downloadFile(file[fileCodeKey])"
									>
										<el-icon><Download /></el-icon> 下载
									</el-button>
								</li>
							</div>
						</el-form-item>
					</el-form>
				</el-main>

				<div class="bottom-shop">
					<div class="order-content">
						<span
							>价格:
							<span class="price">￥{{ price }}</span></span
						>
					</div>
					<el-button-group>
						<el-button
							v-if="showBuyButton"
							type="success"
							size="large"
							:disabled="buyDisabled"
							:loading="buyLoading"
							@click="buyNow"
						>
							立即购买
						</el-button>
					</el-button-group>
				</div>
			</div>
		</el-dialog>
		<!-- 付款码弹窗 -->
		<el-dialog
			title="请完成支付"
			v-model="payCodeDialogVisible"
			width="400px"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:show-close="false"
		>
			<div class="pay-code-container">
				<!-- 付款码图片 -->
				<img :src="qrcodeUrl" alt="付款码" class="pay-code-img" />
				<!-- 订单信息 -->
				<div class="order-info">
					请使用
					<span>
						{{
							formDetail.paymentType === "ALIPAY"
								? "支付宝"
								: "微信"
						}}
					</span>
					扫描二维码支付
				</div>
				<!-- <div class="order-info">需支付金额：¥ 99.00</div> -->
				<!-- <el-button type="primary" @click="handlePayment('success')">
						已完成支付
					</el-button> -->
				<el-button @click="cancelPayment"> 取消支付 </el-button>
			</div>
		</el-dialog>
	</el-container>
</template>

<script>
import {
	UploadFilled,
	FolderOpened,
	Download,
	Document,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import QRCode from "qrcode";
export default {
	name: "PrintOrderPage",
	components: {
		UploadFilled,
		FolderOpened,
		Download,
		Document,
	},
	props: {
		apiList: { type: Object, required: true },
		apiGetById: { type: Object, required: true },
		apiGetByStatus: { type: Object, required: true },
		apiDelete: { type: Object, default: null },
		apiBatchDelete: { type: Object, default: null },
		apiSave: { type: Object, default: null },
		apiPay: { type: Object, default: null },
		apiCalcPrice: { type: Object, default: null },
		getByIdParams: { type: Function, default: null },
		searchConfig: { type: Array, required: true },
		tableHeader: { type: Array, required: true },
		formConfig: { type: Array, required: true },
		defaultSearch: { type: Object, default: () => ({}) },
		defaultFormDetail: { type: Object, default: () => ({}) },
		customInputProps: { type: Array, default: () => [] },
		actionColumn: { type: String, default: "crud" },
		actionLabel: { type: String, default: "" },
		rowKey: { type: String, default: "id" },
		enableUpload: { type: Boolean, default: true },
		uploadAction: { type: String, default: "/api/files/upload" },
		uploadLimit: { type: Number, default: 1 },
		fileListKey: { type: String, default: "fileResponseDTOList" },
		fileNameKey: { type: String, default: "fileName" },
		fileCodeKey: { type: String, default: "fileCode" },
		fileIdKey: { type: String, default: "fileId" },
		dialogTitleAdd: { type: String, default: "新增" },
		dialogTitleView: { type: String, default: "查看" },
		disableFormOnView: { type: Boolean, default: false },
		buyWhenAddOnly: { type: Boolean, default: false },
		showRemarks: { type: Boolean, default: true },
		onBuy: { type: Function, default: null },
		printType: { type: String, default: "" },
	},
	data() {
		return {
			selection: [],
			dialogVisible: false,
			dialogTitle: this.dialogTitleAdd,
			search: this.clone(this.defaultSearch),
			formDetail: this.clone(this.defaultFormDetail),
			uploadDisabled: false,
			buyDisabled: false,
			buyLoading: false,
			payCodeDialogVisible: false,
			qrcodeUrl: "",
			pollingInterval: null,
			price: "",
			calcPriceTimer: null,
			countdownTimers: {},
		};
	},
	computed: {
		isView() {
			return this.dialogTitle === this.dialogTitleView;
		},
		showBuyButton() {
			return this.buyWhenAddOnly ? !this.isView : true;
		},
		actionLabelText() {
			if (this.actionLabel) return this.actionLabel;
			return this.actionColumn === "file" ? "文件" : "操作";
		},
		fileList() {
			return this.formDetail?.[this.fileListKey] || [];
		},
	},
	watch: {
		formDetail: {
			deep: true,
			handler() {
				this.scheduleCalcPrice();
			},
		},
	},
	methods: {
		scheduleCalcPrice() {
			if (!this.apiCalcPrice?.post) return;
			if (this.isView) return;

			clearTimeout(this.calcPriceTimer);
			this.calcPriceTimer = setTimeout(() => {
				this.calcPrice();
			}, 400);
		},
		async calcPrice() {
			if (!this.apiCalcPrice?.post) return;
			const res = await this.apiCalcPrice.post(this.formDetail);
			if (res.code === 0) {
				// 根据后端结构调整
				this.price = res.data?.totalPrice ?? res.data;
			}
		},
		clone(obj) {
			return JSON.parse(JSON.stringify(obj || {}));
		},
		getRowId(row) {
			return row?.[this.rowKey] ?? row?.id;
		},
		add() {
			this.dialogTitle = this.dialogTitleAdd;
			this.price = "";
			this.resetForm();
			this.dialogVisible = true;
			this.uploadDisabled = false;
			this.buyDisabled = false;
			this.buyLoading = false;
		},
		beforeClose(done) {
			this.$refs.uploadRef?.clearFiles();
			done();
		},
		async table_show(row) {
			this.dialogTitle = this.dialogTitleView;
			this.dialogVisible = true;
			this.uploadDisabled = true;
			this.buyDisabled = false;
			this.buyLoading = false;

			if (!this.apiGetById?.get) {
				this.formDetail = this.clone(row);
				return;
			}

			const params = this.getByIdParams
				? this.getByIdParams(row)
				: { id: this.getRowId(row) };
			const res = await this.apiGetById.get(params);
			if (res.code === 0) {
				this.formDetail = res.data;
				this.price = res.data.totalFee || "";
			} else {
				this.$nextTick(() => {
					this.formDetail = { ...row };
				});
			}
		},
		async table_del(row) {
			if (!this.apiDelete?.delete) return;
			const id = this.getRowId(row);
			const res = await this.apiDelete.delete([id]);
			if (res.code === 0) {
				this.$message.success("删除成功");
				this.$refs.table.getData();
			}
		},
		async batch_del() {
			if (!this.apiBatchDelete?.delete && !this.apiDelete?.delete) return;
			const api = this.apiBatchDelete?.delete
				? this.apiBatchDelete
				: this.apiDelete;

			this.$confirm(
				`确定删除选中的 ${this.selection.length} 项吗？`,
				"提示",
				{ type: "warning" }
			)
				.then(async () => {
					const loading = this.$loading();
					const ids = this.selection.map((item) =>
						this.getRowId(item)
					);
					const res = await api.delete(ids);
					if (res.code === 0) {
						this.$message.success("删除成功");
						this.$refs.table.getData();
					}
					loading.close();
				})
				.catch(() => {});
		},
		selectionChange(selection) {
			this.selection = selection;
		},
		upsearch() {
			const filteredSearch = {};
			for (const key in this.search) {
				const value = this.search[key];
				if (value !== "" && value !== null && value !== undefined) {
					filteredSearch[key] = value;
				}
			}
			this.$refs.table.upData(filteredSearch);
		},
		resetSearch() {
			if (this.defaultSearch && Object.keys(this.defaultSearch).length) {
				this.search = this.clone(this.defaultSearch);
			} else {
				const resetSearch = {};
				this.searchConfig.forEach((item) => {
					resetSearch[item.name] = "";
				});
				this.search = resetSearch;
			}
			this.$refs.table.upData(this.search);
		},
		formatter(row, item) {
			const map = item.format.split("/").reduce((acc, item) => {
				const [key, label] = item.split(":");
				acc[key.trim()] = label.trim();
				return acc;
			}, {});
			return map[String(row[item.name])] || row[item.name];
		},
		resetForm() {
			this.formDetail = this.clone(this.defaultFormDetail);
		},
		shouldShowCustomInput(item) {
			return (
				this.customInputProps.includes(item.prop) &&
				this.formDetail[item.prop] === 0
			);
		},
		async buyNow() {
			if (!this.formDetail.fieldId) {
				ElMessage.warning("请先上传文件");
				return;
			}
			this.buyLoading = true;
			const helpers = {
				close: () => (this.dialogVisible = false),
				refresh: () => this.$refs.table.getData(),
				setLoading: (v) => (this.buyLoading = v),
				setBuyDisabled: (v) => (this.buyDisabled = v),
				setUploadDisabled: (v) => (this.uploadDisabled = v),
			};

			if (this.onBuy) {
				await this.onBuy(this.formDetail, helpers);
				return;
			}

			if (!this.apiSave?.post) {
				this.buyLoading = false;
				return;
			}
			const res = await this.apiSave.post(this.formDetail);
			if (res.code === 0) {
				helpers.close();
				helpers.refresh();
				ElMessage.success("操作成功");
			} else {
				ElMessage.error(res.message || "操作失败");
			}
			this.buyLoading = false;
		},
		uploadSuccess(response, uploadFile, uploadFiles) {
			if (response?.code === 0) {
				let codes = [];

				if (uploadFiles && uploadFiles.length) {
					codes = uploadFiles
						.map((file) => {
							const data = file.response?.data;
							if (Array.isArray(data)) return data[0]?.fileCode;
							return data?.fileCode;
						})
						.filter(Boolean);
				} else if (Array.isArray(response.data)) {
					codes = response.data
						.map((item) => item.fileCode)
						.filter(Boolean);
				} else if (response.data?.fileCode) {
					codes = [response.data.fileCode];
				}

				this.formDetail[this.fileIdKey] = codes.join(",");
				this.buyDisabled = false;
			}
		},
		handleProgress() {
			this.buyDisabled = true;
		},
		handleRemove(uploadFile) {
			const data = uploadFile.response?.data;
			const code = Array.isArray(data)
				? data[0]?.fileCode
				: data?.fileCode;
			if (!code) return;

			const current = this.formDetail[this.fileIdKey] || "";
			this.formDetail[this.fileIdKey] = current
				.replace(`${code},`, "")
				.replace(code, "");
		},
		handleExceed() {
			this.$message.warning("只允许上传一个文件");
		},
		downloadFile(fileCode) {
			const link = document.createElement("a");
			link.href = `${this.$API.print.fileDownload.url}${fileCode}`;
			link.setAttribute("download", "");
			link.style.display = "none";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		},
		getStatusType(status) {
			const typeMap = {
				INIT: "",
				PAYING: "warning",
				SUCCESS: "success",
				FAIL: "danger",
				CLOSED: "info",
			};
			return typeMap[status] || "";
		},
		async renderQrCode(url, orderNo) {
			// 生成支付二维码
			this.payCodeDialogVisible = true;
			const dataUrl = await QRCode.toDataURL(url, {
				width: 200,
				margin: 1,
			});
			this.qrcodeUrl = dataUrl;
			this.startPolling(orderNo);
		},
		// 启动轮询
		startPolling(orderNo) {
			this.orderNo = orderNo;
			this.pollingInterval = setInterval(async () => {
				const res = await this.apiGetByStatus.get({
					printNo: orderNo,
				});
				if (res.code === 0 && res.data?.status) {
					if (res.data.status === "SUCCESS") {
						this.handlePayment("success");
					} else if (res.data.status === "CLOSED") {
						// ElMessage.warning("订单已关闭");
						this.$alert("订单已关闭", "提示", {
							confirmButtonText: "确定",
						}).catch(() => {});
						this.handlePayment("cancel");
					}
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
		cancelPayment() {
			this.$confirm(`确定取消支付吗？`, "提示", { type: "warning" })
				.then(() => {
					this.handlePayment("cancel");
				})
				.catch(() => {});
		},
		// 处理支付成功
		handlePayment(type) {
			this.payCodeDialogVisible = false;
			this.stopPolling();
			if (type === "success") {
				this.$alert("支付成功", "提示", {
					confirmButtonText: "确定",
				}).catch(() => {});
				// this.$message.success("支付成功");
			}
			this.$refs.uploadRef?.clearFiles();
			this.dialogVisible = false;
			this.$refs.table.getData();
			this.buyLoading = false;
		},
		handlePay(row) {
			this.$confirm(`是否确认支付？`, "提示", { type: "warning" })
				.then(async () => {
					const payRes = await this.$API.print.payOrder.post({
						orderNo: row.printNo,
						printType: this.printType,
					});
					if (payRes.code === 0) {
						this.renderQrCode(payRes.data, row.printNo);
					}
				})
				.catch(() => {});
		},
		formatRemainSeconds(seconds) {
			if (seconds == null || seconds <= 0) return "00:00";
			const m = Math.floor(seconds / 60);
			const s = seconds % 60;
			return (
				String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0")
			);
		},
		// 每行启动倒计时
		startRowCountdown(row) {
			const rowId = this.getRowId(row);
			const seconds = Number(row.remainSeconds);
			if (!rowId || !seconds || seconds <= 0) return;
			// 先清旧的
			this.clearRowCountdown(row);
			// 用展示字段，不污染原字段
			row._remainSeconds = seconds;
			const timer = setInterval(() => {
				if (row._remainSeconds <= 1) {
					row._remainSeconds = 0;
					this.clearRowCountdown(row);
					return;
				}
				row._remainSeconds -= 1;
			}, 1000);
			this.countdownTimers[rowId] = timer;
		},
		// 清理单行计时器
		clearRowCountdown(row) {
			const rowId = this.getRowId(row);
			const timer = this.countdownTimers?.[rowId];
			if (timer) {
				clearInterval(timer);
				delete this.countdownTimers[rowId];
			}
		},
		// 清理全部计时器
		clearAllCountdowns() {
			Object.keys(this.countdownTimers || {}).forEach((key) => {
				clearInterval(this.countdownTimers[key]);
			});
			this.countdownTimers = {};
		},
		// 列表刷新后重建倒计时
		resetAllCountdowns(rows) {
			this.clearAllCountdowns();
			(rows || []).forEach((row) => this.startRowCountdown(row));
		},
		// 供 scTable dataChange 调用
		handleTableDataChange(res, tableData) {
			this.resetAllCountdowns(tableData);
		},
	},
	beforeUnmount() {
		this.stopPolling(); // 清理轮询
		this.clearAllCountdowns();
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
	font-size: 20px;
	font-weight: bold;
	display: flex;
	flex-direction: column;
	padding-right: 10px;
	.price {
		font-size: 24px;
		// color: #ffaf58;
		color: #cc0e1d;
	}
}

.file-list {
	margin-top: 15px;
	padding: 15px;
	border: 1px solid #ebeef5;
	border-radius: 10px;
	width: 100%;
	.file-summary {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: #606266;
		.el-icon {
			font-size: 18px;
		}
	}
	.file-item {
		display: flex;
		list-style: none;
		align-items: center;
		background-color: #fff;
		margin-bottom: 10px;
		gap: 10px;
		cursor: pointer;
		.file-info {
			display: flex;
			align-items: center;
			gap: 10px;
			.file-name {
				font-size: 14px;
				color: #303133;
				word-break: break-all;
			}
		}
	}
}
/* 付款码弹窗内部样式 */
.pay-code-container {
	text-align: center;
	padding: 20px 0;
}
.pay-code-img {
	width: 220px;
	height: 220px;
	border: 1px solid #e6e6e6;
	padding: 10px;
	margin: 0 auto 15px;
}
.order-info {
	color: #666;
	font-size: 14px;
	margin-bottom: 10px;
	span {
		color: #0f81f5;
		font-weight: bold;
	}
}
.countdown {
	color: #e64340;
	font-weight: bold;
	margin-bottom: 20px;
}
</style>
