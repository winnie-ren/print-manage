<template>
	<common-list-page
		ref="commonListPage"
		:api-obj="$API.price.pricePage"
		:search-config="searchConfig"
		:table-columns="tableColumns"
		:form-config="{}"
		:edit-disabled-fields="['gco']"
		:delete-api="deleteMenu"
		:dialogWidth="'80%'"
		:useScForm="false"
		:showOperationColumn="false"
	>
		<template #header-buttons>
			<el-button
				type="primary"
				icon="el-icon-edit"
				size="small"
				@click="handleEdit"
			>
				修改
			</el-button>
		</template>
		<el-tabs
			v-model="activeName"
			class="tab-container"
		>
			<el-tab-pane label="单张" name="first">
				<div class="config-container">
					<el-form
						:model="singleForm"
						label-width="100px"
						style="margin: 10px 0"
					>
						<el-form-item
							v-for="item in singleFormConfig"
							:key="item.value"
							:label="item.label"
						>
							<el-row :gutter="20">
								<el-col
									v-for="sItem in item.children"
									:key="sItem.value"
									:span="6"
								>
									<el-form-item :label="sItem.label">
										<el-input-number
											v-model.number="
												singleForm[
													`${item.value}_${sItem.value}`
												]
											"
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
					<div class="form-columns">
						<el-form
							v-for="group in materialData"
							:key="`${group.material}_${group.weight}_${group.color}`"
							:model="group"
							label-width="45px"
						>
							<el-form-item label="材料">
								<span>{{
									materialConfig[group.material]
								}}</span>
							</el-form-item>

							<el-form-item label="克重">
								<span>{{ weightConfig[group.weight] }}</span>
							</el-form-item>

							<el-form-item label="黑白">
								<el-input-number
									v-model.number="
										singleForm[
											`${group.material}_${group.weight}_black`
										]
									"
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
									v-model.number="
										singleForm[
											`${group.material}_${group.weight}_color`
										]
									"
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
				<div class="config-container">
					<el-form
						:model="blackForm"
						label-width="100px"
						style="margin: 10px 0"
					>
						<el-form-item
							v-for="item in blackBookFormConfig"
							:key="item.value"
							:label="item.label"
						>
							<el-row :gutter="20">
								<el-col
									v-for="sItem in item.children"
									:key="sItem.value"
									:span="6"
								>
									<el-form-item
										:label="sItem.label"
										style="margin-bottom: 0"
									>
										<el-input-number
											v-model.number="
												blackForm[
													`${item.value}_${sItem.value}`
												]
											"
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
				<div class="config-container">
					<el-form
						:model="colorForm"
						label-width="100px"
						style="margin: 10px 0"
					>
						<el-form-item
							v-for="item in blackBookFormConfig"
							:key="item.value"
							:label="item.label"
						>
							<el-row :gutter="20">
								<el-col
									v-for="sItem in item.children"
									:key="sItem.value"
									:span="6"
								>
									<el-form-item
										:label="sItem.label"
										style="margin-bottom: 0"
									>
										<el-input-number
											v-model.number="
												colorForm[
													`${item.value}_${sItem.value}`
												]
											"
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
			<el-tab-pane label="标书专项" name="fourth">
				<div class="config-container">
					<el-form
						:model="specialForm"
						label-width="100px"
						style="margin: 10px 0"
					>
						<el-form-item
							v-for="item in specialFormConfig"
							:key="item.value"
							:label="item.label"
						>
							<el-row :gutter="20">
								<el-col
									v-for="sItem in item.children"
									:key="sItem.value"
									:span="6"
								>
									<el-form-item
										:label="sItem.label"
										style="margin-bottom: 0"
									>
										<el-input-number
											v-model.number="
												specialForm[
													`${item.value}_${sItem.value}`
												]
											"
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
		</el-tabs>
		<div class="footer-btn">
			<el-button type="primary" @click="handleSubmit()" :loading="submitLoading"> {{ submitLoading ? '提交中' : '提交' }} </el-button>
		</div>
	</common-list-page>
</template>

<script>
import CommonListPage from "@/components/commonTable/index.vue";
import { ElMessage } from "element-plus";
import {
	materialData,
	singleFormConfig,
	blackBookFormConfig,
	specialFormConfig,
	materialConfig,
	weightConfig,
} from "./config/index.ts";
import { getCurrentInstance, ref } from "vue";

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
				label: "类型",
				name: "printTypeName",
				component: "input",
				options: { placeholder: "请输入" },
			},
			{
				label: "项",
				name: "printItemName",
				component: "input",
				options: { placeholder: "请输入" },
			},
			{
				label: "编码",
				name: "printName",
				component: "input",
				options: { placeholder: "请输入" },
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
			// {
			// 	label: "类型",
			// 	name: "printTypeCode",
			// },
			{
				label: "类型",
				name: "printTypeName",
			},
			// {
			// 	label: "项",
			// 	name: "printItemCode",
			// },
			{
				label: "项",
				name: "printItemName",
			},
			// {
			// 	label: "编码",
			// 	name: "printCode",
			// },
			{
				label: "编码",
				name: "printName",
			},
			{
				label: "价格",
				name: "price",
			},
			{
				label: "状态",
				name: "status",
				format: "0:无效/1:有效",
			},
		];
		// API 方法
		const deleteMenu = async (ids) => {
			return await $API.price.priceDelete.delete(ids);
		};
		const commonListPage = ref(null);
		// 修改价格
		const handleEdit = async () => {
			activeName.value = "first";
			// 打开弹窗
			commonListPage.value.handleEdit();
			// 获取配置
			const res = await $API.price.priceGetByConfig.post();
			if (res && res.data) {
				const {
					printSinglePage,
					printBidding,
					printBlackBook,
					printColor,
				} = res.data;
				if (Object.keys(printSinglePage || {}).length > 0) {
					singleForm.value = printSinglePage;
				}
				if (Object.keys(printBidding || {}).length > 0) {
					specialForm.value = printBidding;
				}
				if (Object.keys(printBlackBook || {}).length > 0) {
					blackForm.value = printBlackBook;
				}
				if (Object.keys(printColor || {}).length > 0) {
					colorForm.value = printColor;
				}
			}
		};
		// 单张表单数据
		const singleForm = ref({
			printSide_single: 1,
			printSide_double: 1.5,
			size_A5: 0.5,
			size_B5: 0.8,
			size_A4: 1,
			size_A3: 2,
			deliveryMethod_self: 0,
			deliveryMethod_delivery: 10,
			deliveryMethod_express: 0,
			coatedPaper_157_black: 0.25,
			coatedPaper_157_color: 0.3,
			coatedPaper_200_black: 0.35,
			coatedPaper_200_color: 0.5,
			coatedPaper_250_black: 0.4,
			coatedPaper_250_color: 0.7,
			coatedPaper_300_black: 0.5,
			coatedPaper_300_color: 1,
			mattePaper_157_black: 0.25,
			mattePaper_157_color: 0.3,
			mattePaper_200_black: 0.35,
			mattePaper_200_color: 0.5,
			mattePaper_250_black: 0.4,
			mattePaper_250_color: 0.7,
			mattePaper_300_black: 0.5,
			mattePaper_300_color: 1,
			twoSidePaper_80_black: 0.1,
			twoSidePaper_80_color: 0.3,
			twoSidePaper_100_black: 0.2,
			twoSidePaper_100_color: 0.35,
			twoSidePaper_120_black: 0.25,
			twoSidePaper_120_color: 0.4,
			twoSidePaper_160_black: 0.3,
			twoSidePaper_160_color: 0.5,
			twoSidePaper_200_black: 0.35,
			twoSidePaper_200_color: 0.6,
			twoSidePaper_250_black: 0.4,
			twoSidePaper_250_color: 0.7,
			twoSidePaper_300_black: 0.5,
			twoSidePaper_300_color: 0.8,
		});
		// 黑白书册表单数据
		const blackForm = ref({
			spec_A4: 1,
			spec_B5: 0.85,
			paperType_twoSidePaper_80: 0.1,
			paperType_twoSidePaper_100: 0.2,
			paperType_coatedPaper_128: 0.5,
			paperType_coatedPaper_157: 0.6,
			coverColor_black: 2,
			coverColor_color: 3,
			innerColor_black: 1,
			innerColor_color: 2,
			coverMaterial_coatedPaper: 1,
			coverMaterial_specialPaper: 2,
			coverMaterial_stripedPaper: 1,
			coverProcess_no: 0,
			coverProcess_singleDummy: 1,
			coverProcess_singleLight: 1,
			bindingMethod_mount: 2,
			bindingMethod_glue: 3,
			deliveryMethod_self: 0,
			deliveryMethod_delivery: 10,
			deliveryMethod_express: 0,
		});
		// 彩色书册表单数据
		const colorForm = ref({
			spec_A4: 1,
			spec_B5: 0.85,
			paperType_twoSidePaper_80: 0.1,
			paperType_twoSidePaper_100: 0.2,
			paperType_coatedPaper_128: 0.5,
			paperType_coatedPaper_157: 0.6,
			coverColor_black: 2,
			coverColor_color: 3,
			innerColor_black: 1,
			innerColor_color: 2,
			coverMaterial_coatedPaper: 1,
			coverMaterial_specialPaper: 2,
			coverMaterial_stripedPaper: 1,
			coverProcess_no: 0,
			coverProcess_singleDummy: 1,
			coverProcess_singleLight: 1,
			bindingMethod_mount: 2,
			bindingMethod_glue: 3,
			deliveryMethod_self: 0,
			deliveryMethod_delivery: 10,
			deliveryMethod_express: 0,
		});
		//	标书专项表单数据
		const specialForm = ref({
			isScan_yes: 1,
			isScan_no: 0,
			scanFile_send: 0,
			scanFile_uDisk: 25,
			scanFile_cd: 7,
			originalColor_black: 0.1,
			originalColor_color: 0.3,
			originalSide_single: 1,
			originalSide_double: 0.9,
			copyColor_black: 0.1,
			copyColor_color: 0.3,
			copySide_single: 1,
			copySide_double: 0.9,
			coverColor_white: 6,
			coverColor_skyBlue: 6,
			coverColor_deepBlue: 6,
			coverColor_lightGreen: 6,
			coverColor_lightYellow: 6,
			coverColor_red: 6,
			coverColor_transparent: 8,
			bindingMethod_glue: 2,
			bindingMethod_ribbon: 4,
			bindingMethod_iron: 4,
			deliveryTime_1: 1,
			deliveryTime_2: 2,
			deliveryTime_4: 4,
			deliveryMethod_self: 0,
			deliveryMethod_delivery: 10,
			deliveryMethod_cashOnDelivery: 0,
			deliveryMethod_express: 0,
		});
		const submitLoading = ref(false);
		// 保存价格配置
		const handleSubmit = async () => {
			submitLoading.value = true;
			const params = {
				printSinglePage: singleForm.value,
				printBlackBook: blackForm.value,
				printColor: colorForm.value,
				printBidding: specialForm.value,
			};
			const res = await $API.price.priceSave.post(params);
			if (res && res.success) {
				ElMessage.success("保存成功");
				// 关闭弹窗
				commonListPage.value.handleCancel();
				// 刷新数据
				commonListPage.value.handleSearch();
			}
			submitLoading.value = false
		};
		return {
			searchConfig,
			tableColumns,
			activeName,
			materialData,
			singleForm,
			singleFormConfig,
			blackBookFormConfig,
			blackForm,
			colorForm,
			specialFormConfig,
			specialForm,
			materialConfig,
			weightConfig,
			commonListPage,
			submitLoading,
			deleteMenu,
			handleEdit,
			handleSubmit,
		};
	},
};
</script>

<style scoped lang="scss">
.tab-container {
	height: calc(100% - 41px);
	overflow: hidden;
	:deep(.el-tabs__content) {
		height: calc(100% - 60px);
		overflow: auto;
	}
}
.footer-btn {
	padding-top: 8px;
	border-top: 1px solid #eeeeee;
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
.config-container {
	border-radius: 4px;
	.el-row {
		width: 100%;
	}
}
</style>
