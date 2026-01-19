<template>
	<common-list-page
		ref="commonListPage"
		:api-obj="$API.menu.userPage"
		:search-config="searchConfig"
		:table-columns="tableColumns"
		:form-config="formConfig"
		:edit-disabled-fields="['gco']"
		:delete-api="deleteMenu"
		:dialogWidth="'80%'"
		:save-api="saveMenu"
		:useScForm="false"
		@add="handleAdd"
		@edit="handleEdit"
		@view="handleView"
		@submit="handleSubmit"
	>
		<div>
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="单张" name="first">
					<div class="price-table-container">
						<el-form
							:model="printConfig"
							label-width="100px"
							style="margin: 20px 0"
						>
							<el-form-item label="印色">
								<el-form-item label="黑白">
									<el-input-number
										v-model.number="
											printConfig.colorCoefficients.黑白
										"
										:min="0"
										step="0.1"
										precision="1"
										controls-position="right"
										placeholder="请输入"
									/>
								</el-form-item>
								<el-form-item label="彩色">
									<el-input-number
										v-model.number="
											printConfig.colorCoefficients.彩色
										"
										:min="0"
										step="0.1"
										precision="1"
										controls-position="right"
									/>
								</el-form-item>
							</el-form-item>

							<el-form-item label="印面">
								<el-form-item label="单面">
									<el-input-number
										v-model.number="
											printConfig.sideCoefficients.单面
										"
										:min="0"
										step="0.1"
										precision="1"
										controls-position="right"
									/>
								</el-form-item>
								<el-form-item label="双面">
									<el-input-number
										v-model.number="
											printConfig.sideCoefficients.双面
										"
										:min="0"
										step="0.1"
										precision="1"
										controls-position="right"
									/>
								</el-form-item>
							</el-form-item>

							<el-form-item label="成品尺寸">
								<el-form-item label="A5 (148*210)">
									<el-input-number
										v-model.number="
											printConfig.sizeCoefficients[
												'A5 (148*210)'
											]
										"
										:min="0"
										step="0.1"
										precision="1"
										controls-position="right"
									/>
								</el-form-item>
								<el-form-item label="B5 (176*250)">
									<el-input-number
										v-model.number="
											printConfig.sizeCoefficients[
												'B5 (176*250)'
											]
										"
										:min="0"
										step="0.1"
										precision="1"
										controls-position="right"
									/>
								</el-form-item>
								<el-form-item label="A4 (210*297)">
									<el-input-number
										v-model.number="
											printConfig.sizeCoefficients[
												'A4 (210*297)'
											]
										"
										:min="0"
										step="0.1"
										precision="1"
										controls-position="right"
									/>
								</el-form-item>
								<el-form-item label="A3 (297*420)">
									<el-input-number
										v-model.number="
											printConfig.sizeCoefficients[
												'A3 (297*420)'
											]
										"
										:min="0"
										step="0.1"
										precision="1"
										controls-position="right"
									/>
								</el-form-item>
							</el-form-item>
						</el-form>
						<div class="form-columns">
							<el-form
								v-for="(group, index) in materialGroups"
								:key="index"
								:model="group"
								label-width="45px"
							>
								<el-form-item label="材料">
									<span>{{ group.material }}</span>
								</el-form-item>

								<el-form-item label="克重">
									<span>{{ group.weight }}</span>
								</el-form-item>

								<el-form-item label="黑白">
									<el-input-number
										v-model.number="group.black"
										:min="0"
										step="0.01"
										precision="2"
										controls-position="right"
										placeholder="请输入"
										style="width: 100%"
									/>
								</el-form-item>

								<el-form-item label="彩色">
									<el-input-number
										v-model.number="group.color"
										:min="0"
										step="0.01"
										precision="2"
										controls-position="right"
										placeholder="请输入"
										style="width: 100%"
									/>
								</el-form-item>
							</el-form>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane label="黑白书册" name="second">
					<div class="book-config-container">
						<el-form
							:model="bookConfig"
							label-width="100px"
							style="margin: 10px 0"
						>
							<!-- 成品规格 -->
							<el-form-item label="成品规格">
								<el-row>
									<el-col
										v-for="(
											size, index
										) in bookConfig.sizes"
										:key="index"
										:span="6"
									>
										<el-form-item
											:label="size.name"
											style="margin-bottom: 0"
										>
											<el-input-number
												v-model.number="size.price"
												:min="0"
												step="0.01"
												precision="2"
												controls-position="right"
												placeholder="请输入"
												style="width: 100%"
											/>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form-item>

							<!-- 纸张 -->
							<el-form-item label="纸张">
								<el-row>
									<el-col
										v-for="(
											paper, index
										) in bookConfig.papers"
										:key="index"
										:span="6"
									>
										<el-form-item
											:label="paper.name"
											style="margin-bottom: 0"
										>
											<el-input-number
												v-model.number="paper.price"
												:min="0"
												step="0.01"
												precision="2"
												controls-position="right"
												placeholder="请输入"
												style="width: 100%"
											/>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form-item>

							<!-- 封面印色 -->
							<el-form-item label="封面印色">
								<el-row>
									<el-col
										v-for="(
											color, index
										) in bookConfig.coverColor"
										:key="index"
										:span="6"
									>
										<el-form-item
											:label="color.name"
											style="margin-bottom: 0"
										>
											<el-input-number
												v-model.number="color.price"
												:min="0"
												step="0.01"
												precision="2"
												controls-position="right"
												placeholder="请输入"
												style="width: 100%"
											/>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form-item>

							<!-- 内页印色 -->
							<el-form-item label="内页印色">
								<el-row>
									<el-col
										v-for="(
											color, index
										) in bookConfig.innerColor"
										:key="index"
										:span="6"
									>
										<el-form-item
											:label="color.name"
											style="margin-bottom: 0"
										>
											<el-input-number
												v-model.number="color.price"
												:min="0"
												step="0.01"
												precision="2"
												controls-position="right"
												placeholder="请输入"
												style="width: 100%"
											/>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form-item>

							<!-- 封面材质 -->
							<el-form-item label="封面材质">
								<el-row>
									<el-col
										v-for="(
											material, index
										) in bookConfig.coverMaterial"
										:key="index"
										:span="6"
									>
										<el-form-item
											:label="material.name"
											style="margin-bottom: 0"
										>
											<el-input-number
												v-model.number="material.price"
												:min="0"
												step="0.01"
												precision="2"
												controls-position="right"
												placeholder="请输入"
												style="width: 100%"
											/>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form-item>

							<!-- 封面工艺 -->
							<el-form-item label="封面工艺">
								<el-row>
									<el-col
										v-for="(
											process, index
										) in bookConfig.coverProcess"
										:key="index"
										:span="6"
									>
										<el-form-item
											:label="process.name"
											style="margin-bottom: 0"
										>
											<el-input-number
												v-model.number="process.price"
												:min="0"
												step="0.01"
												precision="2"
												controls-position="right"
												placeholder="请输入"
												style="width: 100%"
											/>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form-item>

							<!-- 装订方式 -->
							<el-form-item label="装订方式">
								<el-row>
									<el-col
										v-for="(
											bind, index
										) in bookConfig.binding"
										:key="index"
										:span="6"
									>
										<el-form-item
											:label="bind.name"
											style="margin-bottom: 0"
										>
											<el-input-number
												v-model.number="bind.price"
												:min="0"
												step="0.01"
												precision="2"
												controls-position="right"
												placeholder="请输入"
												style="width: 100%"
											/>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form-item>

							<!-- 交付方式 -->
							<el-form-item label="交付方式">
								<el-row>
									<el-col
										v-for="(
											del, index
										) in bookConfig.delivery"
										:key="index"
										:span="6"
									>
										<el-form-item
											:label="del.name"
											style="margin-bottom: 0"
										>
											<el-input-number
												v-model.number="del.price"
												:min="0"
												step="0.01"
												precision="2"
												controls-position="right"
												placeholder="请输入"
												style="width: 100%"
											/>
										</el-form-item>
									</el-col>
								</el-row>
							</el-form-item>
						</el-form>
					</div>
				</el-tab-pane>
				<el-tab-pane label="彩色书册" name="third">
					<div>暂未实现</div>
				</el-tab-pane>
				<el-tab-pane label="标书专项" name="fourth">
					<div>暂未实现</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</common-list-page>
</template>

<script>
import CommonListPage from "@/components/commonTable/index.vue";
import { getCurrentInstance, ref, computed } from "vue";

export default {
	name: "priceSetting",
	components: {
		CommonListPage,
	},
	setup() {
		const instance = getCurrentInstance();
		const $API = instance.proxy.$API;
		const activeName = ref("first");

		// 搜索配置
		const searchConfig = [
			{
				label: "项",
				name: "gco",
				component: "input",
				options: { placeholder: "请输入项" },
			},
			{
				label: "值",
				name: "gna",
				component: "input",
				options: { placeholder: "请输入值" },
			},
			{
				label: "状态",
				name: "status",
				component: "select",
				options: {
					placeholder: "请选择状态",
					items: [
						{ value: "1", label: "有效" },
						{ value: "0", label: "无效" },
					],
				},
			},
		];

		// 表格列配置
		const tableColumns = [
			{
				label: "项",
				name: "gco",
			},
			{
				label: "值",
				name: "gna",
			},
			{
				label: "价格",
				name: "pgco",
			},
			{
				label: "状态",
				name: "status",
				format: "0:无效/1:有效",
			},
		];

		// 表单配置
		const formConfig = {
			labelWidth: 80,
			labelPosition: "right",
			formItems: [
				{
					label: "项",
					name: "gco",
					component: "select",
					span: 6,
					options: {
						placeholder: "请输入",
						items: [
							{ label: "印色", value: "printColor" },
							{ label: "印面", value: "printSide" },
							{ label: "成品尺寸", value: "size" },
							{ label: "交付方式", value: "deliveryMethod" },
						],
					},
					rules: [
						{
							required: true,
							message: "请输入项",
							trigger: "blur",
						},
					],
				},
				{
					label: "值",
					name: "gna",
					component: "select",
					span: 6,
					options: {
						placeholder: "请输入",
						items: [
							{ label: "黑白", value: "黑白" },
							{ label: "彩色", value: "彩色" },
							{ label: "单面", value: "单面" },
							{ label: "双面", value: "双面" },
							{ label: "148*210", value: "148*210" },
							{ label: "176*250", value: "176*250" },
							{ label: "210*297", value: "210*297" },
							{ label: "297*420", value: "297*420" },
							{ label: "自取", value: "自取" },
							{ label: "送货上门", value: "送货上门" },
							{ label: "快递到付", value: "快递到付" },
							{ label: "快递寄付", value: "快递寄付" },
						],
					},
					rules: [
						{
							required: true,
							message: "请输入值",
							trigger: "blur",
						},
					],
				},
				{
					label: "价格",
					name: "pgco",
					component: "number",
					span: 6,
					options: { placeholder: "请输入" },
				},
			],
		};

		// API 方法
		const deleteMenu = async (ids) => {
			return await $API.menu.userDelete.delete(ids);
		};

		const saveMenu = async (data) => {
			return await $API.menu.userSave.post(data);
		};

		// 事件处理
		const handleAdd = () => {
			console.log("新增菜单");
		};

		const handleEdit = (row) => {
			console.log("编辑菜单", row);
		};

		const handleView = (row) => {
			console.log("查看菜单", row);
		};

		// 材料价格数据
		const materialData = ref([
			{ material: "铜板纸", weight: "157g", color: "黑白", price: 0.25 },
			{ material: "铜板纸", weight: "157g", color: "彩色", price: 0.3 },
			{ material: "铜板纸", weight: "200g", color: "黑白", price: 0.35 },
			{ material: "铜板纸", weight: "200g", color: "彩色", price: 0.5 },
			{ material: "铜板纸", weight: "250g", color: "黑白", price: 0.4 },
			{ material: "铜板纸", weight: "250g", color: "彩色", price: 0.7 },
			{ material: "铜板纸", weight: "300g", color: "黑白", price: 0.5 },
			{ material: "铜板纸", weight: "300g", color: "彩色", price: 1 },
			{ material: "哑粉纸", weight: "157g", color: "黑白", price: 0.25 },
			{ material: "哑粉纸", weight: "157g", color: "彩色", price: 0.3 },
			{ material: "哑粉纸", weight: "200g", color: "黑白", price: 0.35 },
			{ material: "哑粉纸", weight: "200g", color: "彩色", price: 0.5 },
			{ material: "哑粉纸", weight: "250g", color: "黑白", price: 0.4 },
			{ material: "哑粉纸", weight: "250g", color: "彩色", price: 0.7 },
			{ material: "哑粉纸", weight: "300g", color: "黑白", price: 0.5 },
			{ material: "哑粉纸", weight: "300g", color: "彩色", price: 1 },
			{ material: "双胶纸", weight: "80克", color: "黑白", price: 0.1 },
			{ material: "双胶纸", weight: "80克", color: "彩色", price: 0.3 },
			{ material: "双胶纸", weight: "100克", color: "黑白", price: 0.2 },
			{ material: "双胶纸", weight: "100克", color: "彩色", price: 0.35 },
			{ material: "双胶纸", weight: "120克", color: "黑白", price: 0.25 },
			{ material: "双胶纸", weight: "120克", color: "彩色", price: 0.4 },
			{ material: "双胶纸", weight: "160克", color: "黑白", price: 0.3 },
			{ material: "双胶纸", weight: "160克", color: "彩色", price: 0.5 },
			{ material: "双胶纸", weight: "200克", color: "黑白", price: 0.35 },
			{ material: "双胶纸", weight: "200克", color: "彩色", price: 0.6 },
			{ material: "双胶纸", weight: "250克", color: "黑白", price: 0.4 },
			{ material: "双胶纸", weight: "250克", color: "彩色", price: 0.7 },
			{ material: "双胶纸", weight: "300克", color: "黑白", price: 0.5 },
			{ material: "双胶纸", weight: "300克", color: "彩色", price: 0.8 },
		]);

		// 印刷配置
		const printConfig = ref({
			colorCoefficients: {
				黑白: 1,
				彩色: 1,
			},
			sideCoefficients: {
				单面: 1,
				双面: 1.5,
			},
			sizeCoefficients: {
				"A5 (148*210)": 0.5,
				"B5 (176*250)": 0.8,
				"A4 (210*297)": 1,
				"A3 (297*420)": 2,
			},
		});

		function handleClick(tab, event) {
			console.log(tab, event);
		}
		const materialGroups = computed(() => {
			const groups = {};
			materialData.value.forEach((item) => {
				const key = `${item.material}-${item.weight}`;
				if (!groups[key]) {
					groups[key] = {
						material: item.material,
						weight: item.weight,
						black: null,
						color: null,
					};
				}
				if (item.color === "黑白") groups[key].black = item.price;
				else if (item.color === "彩色") groups[key].color = item.price;
			});
			return Object.values(groups);
		});
		const handleSubmit = () => {
			const config = getFullConfig();
			console.log("保存配置:", config);
			// 这里可以调用 API 保存
			// saveMenu(config);
		};
		// 合并为 JSON 存储
		const getFullConfig = () => {
			const newMaterialData = [];
			materialGroups.value.forEach((group) => {
				if (group.black !== null) {
					newMaterialData.push({
						material: group.material,
						weight: group.weight,
						color: "黑白",
						price: group.black,
					});
				}
				if (group.color !== null) {
					newMaterialData.push({
						material: group.material,
						weight: group.weight,
						color: "彩色",
						price: group.color,
					});
				}
			});
			return {
				materialPrices: newMaterialData,
				printConfig: printConfig.value,
				bookConfig: bookConfig.value,
			};
		};
		const bookConfig = ref({
			// 成品规格
			sizes: [
				{ name: "A4", price: 1 },
				{ name: "B5", price: 0.85 },
			],
			// 纸张
			papers: [
				{ name: "80克双胶纸", price: 0.1 },
				{ name: "100克双胶纸", price: 0.2 },
				{ name: "128克铜板纸", price: 0.5 },
				{ name: "157克铜板纸", price: 0.6 },
			],
			// 封面印色
			coverColor: [
				{ name: "黑白", price: 2 },
				{ name: "彩色", price: 3 },
			],
			// 内页印色
			innerColor: [
				{ name: "黑白", price: 1 },
				{ name: "彩色", price: 2 },
			],
			// 封面材质
			coverMaterial: [
				{ name: "铜板纸", price: 1 },
				{ name: "特种纸", price: 2 },
				{ name: "皮纹纸", price: 1 },
			],
			// 封面工艺
			coverProcess: [
				{ name: "不过膜", price: 0 },
				{ name: "单面哑膜", price: 1 },
				{ name: "单面光膜", price: 1 },
			],
			// 装订方式
			binding: [
				{ name: "骑马钉", price: 2 },
				{ name: "胶装", price: 3 },
			],
			// 交付方式
			delivery: [
				{ name: "自取", price: 0 },
				{ name: "送货上门", price: 10 },
				{ name: "快递到付", price: 0 },
			],
		});
		return {
			searchConfig,
			tableColumns,
			formConfig,
			activeName,
			materialData,
			printConfig,
			materialGroups,
			bookConfig,
			getFullConfig,
			handleClick,
			deleteMenu,
			saveMenu,
			handleAdd,
			handleEdit,
			handleView,
			handleSubmit,
		};
	},
};
</script>

<style scoped lang="scss">
.price-table-container {
	margin: 20px 0;
}
.form-columns {
	display: flex;
	flex-wrap: wrap;
	gap: 5px;
	padding: 5px 0;
	.el-form {
		border: 1px solid #e4e7ed;
		padding: 3px;
		border-radius: 4px;
		min-width: 160px;
		display: inline-block;
		width: 150px;
		vertical-align: top;
		.el-form-item--default {
			margin-bottom: 5px;
		}
	}
}
.book-config-container {
	padding: 20px;
	background: #f9f9f9;
	border-radius: 4px;
	.el-row {
		width: 100%;
	}
}
</style>
