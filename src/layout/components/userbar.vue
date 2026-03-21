<template>
	<div class="user-bar">
		<!-- <div class="panel-item hidden-sm-and-down" @click="search">
			<el-icon><el-icon-search /></el-icon>
		</div> -->
		<div class="screen panel-item hidden-sm-and-down" @click="screen">
			<el-tooltip
				class="box-item"
				effect="dark"
				content="全屏"
				placement="bottom"
			>
				<el-icon><el-icon-full-screen /></el-icon>
			</el-tooltip>
		</div>
		<!-- <div class="tasks panel-item" @click="tasks">
			<el-icon><el-icon-sort /></el-icon>
		</div> -->
		<div class="panel-item" @click="pointsSetting">
			<el-tooltip
				class="box-item"
				effect="dark"
				content="积分设置"
				placement="bottom"
			>
				<el-icon><el-icon-Discount /></el-icon>
			</el-tooltip>
		</div>
		<div class="msg panel-item" @click="showMsg">
			<el-badge
				:hidden="msgList.length == 0"
				:value="msgList.length"
				class="badge"
				type="danger"
			>
				<el-tooltip
					class="box-item"
					effect="dark"
					content="新消息"
					placement="bottom"
				>
					<el-icon><el-icon-chat-dot-round /></el-icon>
				</el-tooltip>
			</el-badge>
			<el-drawer
				title="新消息"
				v-model="msg"
				:size="400"
				append-to-body
				destroy-on-close
			>
				<el-container>
					<el-main class="nopadding">
						<el-scrollbar>
							<ul class="msg-list">
								<li
									v-for="item in msgList"
									v-bind:key="item.id"
								>
									<a :href="item.link" target="_blank">
										<div class="msg-list__icon">
											<el-badge is-dot type="danger">
												<el-avatar
													:size="40"
													:src="item.avatar"
												></el-avatar>
											</el-badge>
										</div>
										<div class="msg-list__main">
											<h2>{{ item.title }}</h2>
											<p>{{ item.describe }}</p>
										</div>
										<div class="msg-list__time">
											<p>{{ item.time }}</p>
										</div>
									</a>
								</li>
								<el-empty
									v-if="msgList.length == 0"
									description="暂无新消息"
									:image-size="100"
								></el-empty>
							</ul>
						</el-scrollbar>
					</el-main>
					<el-footer>
						<el-button type="primary">消息中心</el-button>
						<el-button @click="markRead">全部设为已读</el-button>
					</el-footer>
				</el-container>
			</el-drawer>
		</div>
		<!-- 新增：充值按钮 -->
		<div class="recharge-btn panel-item" @click="openRecharge">
			<el-tooltip
				class="box-item"
				effect="dark"
				content="充值中心"
				placement="bottom"
			>
				<el-icon><el-icon-wallet /></el-icon>
			</el-tooltip>
		</div>

		<!-- 用户头像和退出登录 -->
		<div class="user-avatar">
			<el-avatar :size="30">{{ userNameF }}</el-avatar>
			<label>{{ userName }}</label>
			<!-- <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon> -->
		</div>
		<!-- <el-dropdown class="user panel-item" trigger="click" @command="handleUser">
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="uc">帐号信息</el-dropdown-item>
					<el-dropdown-item command="clearCache">清除缓存</el-dropdown-item>
					<el-dropdown-item divided command="outLogin">退出登录</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown> -->
		<el-button @click="handleUser('outLogin')">退出登录</el-button>
	</div>
	<el-dialog
		v-model="searchVisible"
		:width="700"
		title="搜索"
		center
		destroy-on-close
	>
		<search @success="searchVisible = false"></search>
	</el-dialog>
	<el-drawer
		v-model="tasksVisible"
		:size="450"
		title="任务中心"
		destroy-on-close
	>
		<tasks></tasks>
	</el-drawer>
	<!-- 充值弹窗 -->
	<el-dialog
		v-model="rechargeVisible"
		:width="385"
		title="充值中心"
		center
		destroy-on-close
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		class="recharge-dialog"
	>
		<div class="recharge-content">
			<div class="balance-label">
				<span>账户余额：</span>
				<span class="balance-value">¥ {{ balance }}</span>
			</div>
			<!-- 选择金额 -->
			<div class="recharge-label">选择金额</div>
			<!-- 快捷金额选项 -->
			<div class="amount-options">
				<div
					v-for="item in amountOptions"
					:key="item.value"
					class="amount-item"
					:class="{
						active:
							rechargeForm.payAmount === item.value &&
							!isCustomAmount,
					}"
					@click="handleAmountSelect(item.value)"
				>
					¥{{ item.label }}
				</div>
			</div>
			<!-- 自定义金额输入框 -->
			<div class="custom-amount-wrap">
				<el-input-number
					v-model="rechargeForm.payAmount"
					:min="1"
					:max="10000"
					:step="1"
					style="width: 100%"
					controls-position="right"
					placeholder="请输入自定义金额"
					@input="handleCustomAmountInput"
				/>
			</div>
			<!-- 支付方式 -->
			<div class="payment-label">支付方式</div>
			<div class="payment-section">
				<el-radio-group
					v-model="rechargeForm.payType"
					class="payment-radio-group"
				>
					<!-- 支付宝选项（带图标） -->
					<el-radio label="ALIPAY" border class="payment-radio-item">
						<div class="radio-content">
							<img
								src="/img/alipay.png"
								alt="支付宝"
								class="pay-icon"
							/>
						</div>
					</el-radio>
					<!-- 微信支付选项（带图标） -->
					<el-radio label="WECHAT" border class="payment-radio-item">
						<div class="radio-content">
							<img
								src="/img/wechat.png"
								alt="微信支付"
								class="pay-icon"
							/>
						</div>
					</el-radio>
				</el-radio-group>
			</div>
			<!-- 确认支付按钮 -->
			<el-button
				type="primary"
				class="confirm-pay-btn"
				@click="submitRecharge"
				:loading="rechargeLoading"
				:disabled="
					!rechargeForm.payAmount || rechargeForm.payAmount < 1
				"
			>
				确认支付
			</el-button>
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
					{{ rechargeForm.payType === "ALIPAY" ? "支付宝" : "微信" }}
				</span>
				扫描二维码支付
			</div>
			<el-button @click="cancelPayment"> 取消支付 </el-button>
		</div>
	</el-dialog>
</template>

<script>
import search from "./search.vue";
import tasks from "./tasks.vue";
import QRCode from "qrcode";
export default {
	components: {
		search,
		tasks,
	},
	data() {
		return {
			userName: "",
			userNameF: "",
			searchVisible: false,
			tasksVisible: false,
			balance: 0, // 余额数据
			rechargeVisible: false, // 充值弹窗状态
			rechargeForm: {
				payAmount: 100,
				payType: "ALIPAY",
			},
			rechargeLoading: false,
			msg: false,
			msgList: [],
			isCustomAmount: false,
			amountOptions: [
				{ label: "100", value: 100 },
				{ label: "200", value: 200 },
				{ label: "500", value: 500 },
			],
			payCodeDialogVisible: false,
			qrcodeUrl: "",
		};
	},
	created() {
		var userInfo = this.$TOOL.data.get("USER_INFO");
		this.userName = userInfo?.usna || "";
		this.userNameF = this.userName.substring(0, 1);
	},
	methods: {
		// 获取用户余额
		fetchBalance() {
			this.$API.user.info.post().then((res) => {
				if (res.code === 0 && res.data) {
					this.balance = res.data.cashBalance;
				}
			});
		},
		// 点击快捷金额
		handleAmountSelect(value) {
			this.rechargeForm.payAmount = value;
			this.isCustomAmount = false; // 取消自定义金额标记
		},
		// 自定义金额输入
		handleCustomAmountInput() {
			// 检查输入的金额是否在快捷选项中
			const isInOptions = this.amountOptions.some(
				(item) => item.value === this.rechargeForm.payAmount
			);
			this.isCustomAmount = !isInOptions;
		},
		// 打开充值弹窗
		openRecharge() {
			this.rechargeLoading = false;
			// 获取用户余额
			this.fetchBalance();
			this.rechargeForm = {
				payAmount: 100,
				payType: "ALIPAY",
			};
			this.handleAmountSelect(100);
			this.rechargeVisible = true;
		},
		// 启动轮询
		startPolling(rechargeNo) {
			this.pollingInterval = setInterval(async () => {
				this.getInfo(rechargeNo);
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
		handlePaymentSuccess() {
			this.$message.success("支付成功");
			this.payCodeDialogVisible = false;
			this.rechargeVisible = false;
			this.rechargeLoading = false;
		},
		async getInfo(rechargeNo) {
			const res = await this.$API.user.rechargeGetByStatus.get({
				rechargeNo,
			});
			if (res.code === 0 && res.data.status === "SUCCESS") {
				this.balance = res.data.cashBalance;
				this.stopPolling();
				this.handlePaymentSuccess();
			}
		},
		// 提交充值
		async submitRecharge() {
			this.rechargeLoading = true;
			// 提交充值订单
			const res = await this.$API.user.rechargeSave.post(
				this.rechargeForm
			);
			if (res.code === 0 && res.data?.rechargeNo) {
				// 获取支付码
				const orderRes = await this.$API.user.recharge.post({
					rechargeNo: res.data.rechargeNo,
				});
				if (orderRes.code === 0 && orderRes.data) {
					this.renderQrCode(orderRes.data, res.data.rechargeNo);
				} else {
					this.rechargeLoading = false;
				}
			}
		},
		async renderQrCode(url, rechargeNo) {
			// 生成支付二维码
			this.payCodeDialogVisible = true;
			const dataUrl = await QRCode.toDataURL(url, {
				width: 200,
				margin: 1,
			});
			this.qrcodeUrl = dataUrl;
			this.startPolling(rechargeNo);
		},
		cancelPayment() {
			this.$confirm(`确定取消支付吗？`, "提示", { type: "warning" })
				.then(() => {
					this.stopPolling();
					this.payCodeDialogVisible = false;
					this.rechargeVisible = false;
					this.rechargeLoading = false;
					this.$message("支付取消");
				})
				.catch(() => {});
		},
		// 个人信息处理
		handleUser(command) {
			if (command == "uc") {
				this.$router.push({ path: "/usercenter" });
			}
			if (command == "cmd") {
				this.$router.push({ path: "/cmd" });
			}
			if (command == "clearCache") {
				this.$confirm(
					"清除缓存会将系统初始化，包括登录状态、主题、语言设置等，是否继续？",
					"提示",
					{
						type: "info",
					}
				)
					.then(() => {
						const loading = this.$loading();
						this.$TOOL.data.clear();
						this.$router.replace({ path: "/login" });
						setTimeout(() => {
							loading.close();
							location.reload();
						}, 1000);
					})
					.catch(() => {
						//取消
					});
			}
			if (command == "outLogin") {
				this.$confirm("确认是否退出当前用户？", "提示", {
					type: "warning",
					confirmButtonText: "退出",
					confirmButtonClass: "el-button--danger",
				})
					.then(() => {
						this.$router.replace({ path: "/login" });
					})
					.catch(() => {
						//取消退出
					});
			}
		},
		// 全屏
		screen() {
			var element = document.documentElement;
			this.$TOOL.screen(element);
		},
		// 显示短消息
		showMsg() {
			this.msg = true;
		},
		// 标记已读
		markRead() {
			this.msgList = [];
		},
		//搜索
		search() {
			this.searchVisible = true;
		},
		//任务
		tasks() {
			this.$router.push({ path: "/pointsSetting" });
		},
		//积分设置
		pointsSetting() {
			this.$router.push({ path: "/pointsSetting" });
		},
	},
	beforeUnmount() {
		this.stopPolling(); // 清理轮询
	},
};
</script>

<style scoped lang="scss">
.user-bar {
	display: flex;
	align-items: center;
	height: 100%;
	padding-right: 5px;
}
.user-bar .panel-item {
	padding: 0 10px;
	cursor: pointer;
	height: 100%;
	display: flex;
	align-items: center;
}
.user-bar .panel-item i {
	font-size: 16px;
}
.user-bar .panel-item:hover {
	background: rgba(0, 0, 0, 0.1);
}
.user-bar .user-avatar {
	height: 49px;
	display: flex;
	align-items: center;
	padding-right: 5px;
}
.user-bar .user-avatar label {
	display: inline-block;
	margin-left: 5px;
	font-size: 12px;
	cursor: pointer;
}
.msg-list li {
	border-top: 1px solid #eee;
}
.msg-list li a {
	display: flex;
	padding: 20px;
}
.msg-list li a:hover {
	background: #ecf5ff;
}
.msg-list__icon {
	width: 40px;
	margin-right: 15px;
}
.msg-list__main {
	flex: 1;
}
.msg-list__main h2 {
	font-size: 15px;
	font-weight: normal;
	color: #333;
}
.msg-list__main p {
	font-size: 12px;
	color: #999;
	line-height: 1.8;
	margin-top: 5px;
}
.msg-list__time {
	width: 100px;
	text-align: right;
	color: #999;
}

.dark .msg-list__main h2 {
	color: #d0d0d0;
}
.dark .msg-list li {
	border-top: 1px solid #363636;
}
.dark .msg-list li a:hover {
	background: #383838;
}

.recharge-dialog {
	border-radius: 16px;
	overflow: hidden;
	padding: 0;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.recharge-label {
	font-size: 16px;
	color: #333;
	margin-bottom: 12px;
	font-weight: 500;
}
.balance-label {
	font-size: 20px;
	font-weight: 500;
	color: #333;
	margin-bottom: 12px;
	.balance-value {
		color: #432008;
	}
}
.amount-options {
	display: flex;
	gap: 12px;
	margin-bottom: 16px;
}

.amount-item {
	flex: 1;
	text-align: center;
	padding: 10px 0;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	font-size: 16px;
	color: #666;
	cursor: pointer;
	transition: all 0.2s;
}

.amount-item.active {
	border-color: #4a9fff;
	background-color: #f0f7ff;
	color: #4a9fff;
	font-weight: 500;
}

.custom-amount-wrap {
	margin-bottom: 24px;
}

.payment-section {
	display: flex;
	align-items: flex-start;
	gap: 8px;
	margin-bottom: 24px;
}

.payment-icon {
	width: 24px;
	height: 24px;
	margin-top: 2px;
}

.payment-label {
	font-size: 16px;
	color: #333;
	font-weight: 500;
}

.payment-radio-group {
	flex: 1;
	display: flex;
	gap: 16px;
}

.payment-radio-group :deep(.el-radio) {
	flex: 1;
	margin-right: unset;
	height: 54px;
}
.confirm-pay-btn {
	width: 100%;
	height: 48px;
	border-radius: 24px;
	font-size: 16px;
	font-weight: 500;
	background: linear-gradient(90deg, #4a9fff 0%, #63b3ff 100%);
	border: none;
}
</style>
<style lang="scss">
.recharge-dialog .el-dialog__header {
	background: linear-gradient(90deg, #4a9fff 0%, #63b3ff 100%);
	color: white;
	text-align: center;
	font-size: 18px;
	font-weight: 500;
	margin-right: 0;
	padding-bottom: 20px;
	.el-dialog__title {
		color: white;
	}
	.el-dialog__headerbtn .el-dialog__close {
		color: #fff;
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
</style>
