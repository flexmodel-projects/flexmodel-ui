<template>
  <el-input v-if="field.type=='id'" :disabled="editMode" v-model="value"/>
  <el-input v-else-if="field.type=='string'" :placeholder="field.comment" v-model="value"/>
  <el-input v-else-if="field.type=='text'" :placeholder="field.comment" type="textarea" v-model="value"/>
  <el-input v-else-if="field.type=='decimal'" :placeholder="field.comment" type="number" v-model="value"/>
  <el-input v-else-if="field.type=='int'" :placeholder="field.comment" type="number" v-model="value"/>
  <el-input v-else-if="field.type=='bigint'" :placeholder="field.comment" v-model="value"/>
  <el-switch v-else-if="field.type=='boolean'" :placeholder="field.comment" v-model="value"/>
  <el-date-picker v-else-if="field.type=='date'" :placeholder="field.comment" type="date"
                  v-model="value" style="width: 100%;"/>
  <el-date-picker v-else-if="field.type=='datetime'" type="datetime"
                  :placeholder="field.comment" v-model="value" style="width: 100%;"/>
  <el-input v-else-if="field.type=='json'" :placeholder="field.comment" type="textarea"
            v-model="value"/>
  <el-input v-else v-model="value"/>
</template>
<script setup lang="ts">

const props = defineProps(['datasource', 'model', 'field']);

const value = defineModel<any>({required: true});

</script>
<style scoped>

</style>
