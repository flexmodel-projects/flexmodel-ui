<template>
  <el-dialog v-model="visible" width="500px">
    <template #header>
      {{ form.type }}
    </template>
    <el-form label-width="130px" :model="form">
      <div v-if="field.type==='string'">
        <el-form-item v-if="form.type==='RegexpValidator'" label="Regexp" prop="regexp" required>
          <el-input v-model="form.regexp"/>
        </el-form-item>
      </div>
      <div v-if="field.type==='text'"></div>
      <div v-if="field.type==='int'">
        <el-form-item
          v-if="form.type==='NumberMinValidator' || form.type==='NumberRangeValidator'"
          label="Min" prop="min" required>
          <FieldValue
            v-model="form.min"
            :datasource="datasource"
            :model="model"
            :field="field"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type==='NumberMaxValidator' || form.type==='NumberRangeValidator'"
          label="Max" prop="max" required>
          <FieldValue
            v-model="form.max"
            :datasource="datasource"
            :model="model"
            :field="field"
          />
        </el-form-item>
      </div>
      <div v-if="field.type==='bigint'"></div>
      <div v-if="field.type==='decimal'"></div>
      <div v-if="field.type==='boolean'"></div>
      <div v-if="field.type==='datetime'">
        <el-form-item
          v-if="form.type==='DatetimeMinValidator' || form.type==='DatetimeRangeValidator'"
          label="Min" prop="min" required>
          <FieldValue
            v-model="form.min"
            :datasource="datasource"
            :model="model"
            :field="field"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type==='DatetimeMaxValidator' || form.type==='DatetimeRangeValidator'"
          label="Max" prop="max" required>
          <FieldValue
            v-model="form.max"
            :datasource="datasource"
            :model="model"
            :field="field"
          />
        </el-form-item>
      </div>
      <div v-if="field.type==='date'">
        <el-form-item
          v-if="form.type==='DateMinValidator' || form.type==='DateRangeValidator'"
          label="Min" prop="min" required>
          <FieldValue
            v-model="form.min"
            :datasource="datasource"
            :model="model"
            :field="field"
          />
        </el-form-item>
        <el-form-item
          v-if="form.type==='DateMaxValidator' || form.type==='DateRangeValidator'"
          label="Max" prop="max" required>
          <FieldValue
            v-model="form.max"
            :datasource="datasource"
            :model="model"
            :field="field"
          />
        </el-form-item>
      </div>
      <div v-if="field.type==='json'"></div>
      <el-form-item label="Message" prop="message">
        <el-input v-model="form.message"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="text-center">
        <el-button @click="cancelForm">Cancel</el-button>
        <el-button type="primary" @click="submitForm">
          Conform
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import FieldValue from "~/views/modeling/FieldValue.vue";
import {reactive, watchEffect} from "vue";

const props = defineProps(['currentValue', 'datasource', 'model', 'type', 'field']);
const emits = defineEmits(['change']);
const visible = defineModel('visible');

const form = reactive<any>({});

const submitForm = () => {
  emits('change', form);
}
const cancelForm = () => {
  visible.value = false;
}

watchEffect(() => {
  if (props.currentValue) {
    Object.assign(form, props.currentValue);
  }
})
</script>

<style scoped>
.ep-form-item {
  display: flex;
  --font-size: 14px;
  margin-bottom: 18px;
}
</style>
