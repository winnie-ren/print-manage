<template>
	<el-form
		ref="loginForm"
		:model="form"
		:rules="rules"
		label-width="0"
		size="large"
		@keyup.enter="login"
	>
		<el-form-item prop="usid">
			<el-input
				v-model="form.usid"
				prefix-icon="el-icon-user"
				clearable
				:placeholder="$t('login.userPlaceholder')"
			>
				<template #append>
					<el-select v-model="userType" style="width: 130px">
						<el-option
							:label="$t('login.admin')"
							value="admin"
						></el-option>
						<el-option
							:label="$t('login.user')"
							value="user"
						></el-option>
					</el-select>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="pwd">
			<el-input
				v-model="form.pwd"
				prefix-icon="el-icon-lock"
				clearable
				show-password
				:placeholder="$t('login.PWPlaceholder')"
			></el-input>
		</el-form-item>
		<el-form-item style="margin-bottom: 10px">
			<el-col :span="12">
				<el-checkbox
					:label="$t('login.rememberMe')"
					v-model="form.autologin"
				></el-checkbox>
			</el-col>
			<el-col :span="12" class="login-forgot">
				<router-link to="/reset_password"
					>{{ $t("login.forgetPassword") }}？</router-link
				>
			</el-col>
		</el-form-item>
		<el-form-item>
			<el-button
				type="primary"
				style="width: 100%"
				:loading="islogin"
				round
				@click="login"
				>{{ $t("login.signIn") }}</el-button
			>
		</el-form-item>
		<div class="login-reg">
			{{ $t("login.noAccount") }}
			<router-link to="/user_register">{{
				$t("login.createAccount")
			}}</router-link>
		</div>
	</el-form>
</template>

<script>
export default {
	data() {
		return {
			userType: "admin",
			form: {
				usid: "px",
				pwd: "1",
				autologin: false,
			},
			rules: {
				usid: [
					{
						required: true,
						message: this.$t("login.userError"),
						trigger: "blur",
					},
				],
				pwd: [
					{
						required: true,
						message: this.$t("login.PWError"),
						trigger: "blur",
					},
				],
			},
			islogin: false,
		};
	},
	watch: {
		userType(val) {
			if (val == "admin") {
				this.form.usid = "admin";
				this.form.pwd = "admin";
			} else if (val == "user") {
				this.form.usid = "user";
				this.form.pwd = "user";
			}
		},
	},
	mounted() {},
	methods: {
		async login() {
			var validate = await this.$refs.loginForm
				.validate()
				.catch(() => {});
			if (!validate) {
				return false;
			}

			this.islogin = true;
			var data = {
				usid: this.form.usid,
				pwd: this.form.pwd,
			};
			//获取token
			var user = await this.$API.auth.dologin.post(data);
			if (user.code === 0) {
				this.$TOOL.cookie.set("TOKEN", user.data.token, {
					expires: this.form.autologin ? 24 * 60 * 60 : 0,
				});
				// 获取用户信息
				var res = await this.$API.auth.info.get();
				this.$TOOL.data.set("USER_INFO", res.data);
			} else {
				this.islogin = false;
				this.$message.warning(user.msg);
				return false;
			}
			//获取菜单
			// var menu = await this.$API.auth.getMenuTree.post();
			// if (menu.code == 200) {
			// 	if (menu.data.menu.length == 0) {
			// 		this.islogin = false;
			// 		this.$alert(
			// 			"当前用户无任何菜单权限，请联系系统管理员",
			// 			"无权限访问",
			// 			{
			// 				type: "error",
			// 				center: true,
			// 			}
			// 		);
			// 		return false;
			// 	}
				const menuList = [
					{
						name: "home",
						path: "/home",
						meta: {
							title: "系统管理",
							icon: "el-icon-menu",
							type: "menu",
						},
						children: [
							{
								name: "menuManage",
								path: "/menuManage",
								meta: {
									title: "菜单管理",
									icon: "el-icon-menu",
									affix: true,
								},
								component: "menuManage",
							},
							{
								name: "roleManage",
								path: "/roleManage",
								meta: {
									title: "角色管理",
									icon: "el-icon-Postcard",
								},
								component: "roleManage",
							},
							{
								name: "userManage",
								path: "/userManage",
								meta: {
									title: "用户管理",
									icon: "el-icon-user",
								},
								component: "userManage",
							},
						],
					},
					{
						name: "print",
						path: "/print",
						meta: {
							title: "打印",
							icon: "el-icon-files",
							type: "menu",
						},
						children: [
							{
								path: "/print/single",
								name: "single",
								meta: {
									title: "单张",
									icon: "el-icon-tickets",
									type: "menu",
								},
								component: "print/single",
							},
							{
								path: "/print/blackWhiteManual",
								name: "blackWhiteManual",
								meta: {
									title: "黑白书册",
									icon: "el-icon-notebook",
									type: "menu",
								},
								component: "print/blackWhiteManual",
							},
							{
								path: "/print/colorfulBooklets",
								name: "colorfulBooklets",
								meta: {
									title: "彩色书册",
									icon: "el-icon-notebook",
									type: "menu",
								},
								component: "print/colorfulBooklets",
							},
							{
								path: "/print/tenderDocProject",
								name: "tenderDocProject",
								meta: {
									title: "标书专项",
									icon: "el-icon-collection",
									type: "menu",
								},
								component: "print/tenderDocProject",
							},
						],
					},
					{
						name: "订单管理",
						path: "/order",
						meta: {
							title: "订单",
							icon: "el-icon-files",
							type: "menu",
						},
						children: [
							{
								path: "/order/orderList",
								name: "orderList",
								meta: {
									title: "订单列表",
									icon: "el-icon-tickets",
									type: "menu",
								},
								component: "order/orderList",
							},
						],
					},
					{
						name: "价格设置",
						path: "/price",
						meta: {
							title: "价格",
							icon: "el-icon-files",
							type: "menu",
						},
						children: [
							{
								path: "/price/mobile",
								name: "mobile",
								meta: {
									title: "手机打印价格",
									icon: "el-icon-tickets",
									type: "menu",
								},
								component: "price/mobile",
							},
						],
					},
				];
				this.$TOOL.data.set("MENU", menuList);
				this.$TOOL.data.set("PERMISSIONS", '');
				this.$TOOL.data.set("DASHBOARDGRID", '');
			// } else {
			// 	this.islogin = false;
			// 	this.$message.warning(menu.message);
			// 	return false;
			// }

			this.$router.replace({
				path: "/",
			});
			this.$message.success("Login Success 登录成功");
			this.islogin = false;
		},
	},
};
</script>

<style></style>
