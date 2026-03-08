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

		<!-- 新增：余额显示 -->
		<div class="balance-panel panel-item">
			<span class="balance-text">余额：</span>
			<span class="balance-value">{{ balance }}元</span>
		</div>

		<!-- 新增：充值按钮 -->
		<div class="recharge-btn panel-item" @click="openRecharge">
			<el-button size="small" type="primary">充值</el-button>
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
		:width="500"
		title="充值"
		center
		destroy-on-close
		:close-on-click-modal="false"
	>
		<el-form ref="rechargeFormRef" :model="rechargeForm" label-width="80px">
			<el-form-item label="金额">
				<el-input-number
					v-model="rechargeForm.payAmount"
					:min="1"
					:max="10000"
					:step="1"
					style="width: 100%"
					controls-position="right"
				/>
			</el-form-item>
			<el-form-item label="支付方式">
				<el-radio-group v-model="rechargeForm.payType">
					<el-radio label="ALIPAY" border>支付宝</el-radio>
					<el-radio label="WECHAT" border>微信</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="rechargeVisible = false">取消</el-button>
			<el-button
				type="primary"
				@click="submitRecharge"
				:loading="rechargeLoading"
			>
				确认充值
			</el-button>
		</template>
	</el-dialog>
</template>

<script>
import search from "./search.vue";
import tasks from "./tasks.vue";

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
		};
	},
	created() {
		var userInfo = this.$TOOL.data.get("USER_INFO");
		this.userName = userInfo?.usna || "";
		this.userNameF = this.userName.substring(0, 1);
		// 获取用户余额
		this.fetchBalance();
	},
	methods: {
		// 获取用户余额
		fetchBalance() {
			this.$API.auth.info.get().then((res) => {
				if (res.code === 0 && res.data) {
					this.balance = res.data.cashBalance;
				}
			});
		},
		// 打开充值弹窗
		openRecharge() {
			this.rechargeLoading = false;
			this.rechargeVisible = true;
		},
		// 启动轮询
		startPolling(payWindow) {
			this.pollingInterval = setInterval(async () => {
				this.getInfo(payWindow);
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
			this.rechargeVisible = false;
			this.rechargeLoading = false;
			if (payWindow && !payWindow.closed) {
				payWindow.close();
			}
		},
		// 监听页面可见性变化
		handleVisibilityChange() {
			if (!document.hidden) {
				this.getInfo();
			}
		},
		async getInfo(payWindow) {
			const res = await this.$API.auth.info.get();
			if (res.code === 0 && this.balance !== res.data.cashBalance) {
				this.balance = res.data.cashBalance;
				this.stopPolling();
				this.handlePaymentSuccess(payWindow || "");
			}
		},
		// 提交充值
		submitRecharge() {
			this.rechargeLoading = true;
			this.$API.user.recharge.post(this.rechargeForm).then((res) => {
				if (res.code === 0 && res.data) {
					// 监听页面可见性变化
					document.addEventListener(
						"visibilitychange",
						this.handleVisibilityChange
					);
					// 打开新页签加载支付页面
					const paymentWindow = window.open("", "_blank");
					paymentWindow.document.write(res.data);
					// 启动轮询
					this.startPolling(paymentWindow);
					paymentWindow.document.close();
					// 监听新页签关闭事件
					const checkClosed = setInterval(() => {
						if (paymentWindow.closed) {
							clearInterval(checkClosed);
							this.getInfo(); // 检查支付状态
						}
					}, 1000);
				} else {
					this.rechargeLoading = false;
				}
			});
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
};
</script>

<style scoped>
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
/* 新增样式：余额显示 */
.balance-panel {
	display: flex;
	align-items: center;
	color: #fff;
	font-size: 12px;
}

.balance-text {
	margin-right: 5px;
}

.balance-value {
	font-weight: bold;
	color: #fff;
}

/* 新增样式：充值按钮 */
.recharge-btn {
	margin-right: 10px;
}

/* 二维码样式 */
.qrcode {
	text-align: center;
	margin-top: 10px;
}

.qrcode img {
	max-width: 200px;
	max-height: 200px;
	border: 1px solid #ddd;
	border-radius: 4px;
}
</style>
