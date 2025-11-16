<template>
	<div class="points-setting-page">
		<el-card class="header-card">
			<div class="title">积分设置</div>
			<div class="desc">设置用户积分规则、会员等级优惠等</div>
		</el-card>

		<el-card class="setting-card">
			<div class="section-title">基础规则设置</div>

			<el-form :model="baseForm" label-width="180px" class="base-form">
				<el-form-item label="每消费多少元获得 1 积分">
					<el-input
						v-model="baseForm.moneyPerPoint"
						style="width: 200px"
					/>
				</el-form-item>

				<el-form-item label="积分返现开关">
					<el-switch v-model="baseForm.enableCashback" />
				</el-form-item>
			</el-form>
		</el-card>

		<el-card class="setting-card">
			<div class="section-title">会员等级设置</div>

			<el-table :data="levels" border style="width: 100%">
				<el-table-column
					prop="name"
					label="等级"
					width="140"
				></el-table-column>

				<el-table-column label="积分范围">
					<template #default="{ row }">
						<el-input-number v-model="row.min" :min="0" /> -
						<el-input-number v-model="row.max" :min="0" />
					</template>
				</el-table-column>

				<el-table-column label="折扣（%）">
					<template #default="{ row }">
						<el-input-number
							v-model="row.discount"
							:min="0"
							:max="100"
						/>
					</template>
				</el-table-column>

				<el-table-column label="返红包金额（元）">
					<template #default="{ row }">
						<el-input-number v-model="row.cashback" :min="0" />
					</template>
				</el-table-column>
			</el-table>

			<div style="text-align: right; margin-top: 20px">
				<el-button type="primary" @click="saveSettings"
					>保存配置</el-button
				>
			</div>
		</el-card>
	</div>
</template>

<script setup name="pointsSetting">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";

// 基础积分设置
const baseForm = reactive({
	moneyPerPoint: 10,
	enableCashback: true,
});

// 会员等级设置
const levels = ref([
	{ name: "青铜会员", min: 0, max: 1000, discount: 100, cashback: 0 },
	{ name: "白银会员", min: 1000, max: 3000, discount: 98, cashback: 1 },
	{ name: "黄金会员", min: 3000, max: 6000, discount: 95, cashback: 3 },
	{ name: "钻石会员", min: 6000, max: 999999, discount: 90, cashback: 5 },
]);

// 保存配置
const saveSettings = () => {
	console.log("基础设置:", baseForm);
	console.log("等级设置:", levels.value);

	ElMessage.success("积分配置已保存");
};
</script>

<style scoped>
.points-setting-page {
	padding: 20px;
}

.header-card {
	margin-bottom: 20px;
	padding: 18px;
}

.title {
	font-size: 20px;
	font-weight: bold;
}

.desc {
	font-size: 14px;
	color: #888;
}

.setting-card {
	margin-bottom: 20px;
}

.section-title {
	font-size: 16px;
	font-weight: bold;
	margin-bottom: 15px;
}
</style>
