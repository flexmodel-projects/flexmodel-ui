<template>
  <el-drawer @close="active=0" v-model="visible" title="New provider" size="50%">
    <div style="padding-bottom: 20px">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="Select provider"/>
        <el-step title="Create provider"/>
      </el-steps>
    </div>
    <el-form
      label-position="top"
      label-width="auto"
      :model="form"
    >
      <div v-if="active==0">
        <el-form-item class="mb-2 flex items-center text-sm"
                      label="Please select your IdP to create.">
          <div class="mb-2 flex items-center text-sm">
            <el-radio-group class="ml-4" v-model="form.provider.type">
              <div class="segment-title">User-defined</div>
              <el-radio value="oidc" border>OpenID Connect (oidc)</el-radio>
              <div class="segment-title">Social</div>
              <el-radio value="github" border disabled>Github (github)</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </div>
      <div v-if="active==1">
        <el-form-item required label="Display name">
          <el-input v-model="form.name"/>
        </el-form-item>
      </div>
    </el-form>
    <div v-if="active==1">
      <OIdcProvider v-if="form.provider.type === 'oidc'" v-model="form.provider"/>
    </div>
    <div v-if="active==2">
      <el-row>
        <el-col class="pb5">
          <span class="text-center">Created successfully</span>
        </el-col>
        <el-col>
          <IdPInfo v-model="form"/>
        </el-col>
        <el-col class="text-center">
          <el-button style="margin-top: 12px" @click="visible = false">Close</el-button>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <el-button style="margin-top: 12px" @click="prev" v-if="active!=0 && active!=2">Go back</el-button>
      <el-button type="primary" style="margin-top: 12px" @click="next" v-if="active==0">Select provider</el-button>
      <el-button type="primary" style="margin-top: 12px" @click="createProvider" v-if="active==1">Create provider
      </el-button>
    </template>
  </el-drawer>
</template>
<script setup lang="ts">
import {ref} from "vue";
import OIdcProvider from "~/views/idps/OIdcProvider.vue";
import {IdentifyProvider} from "~/types";
import {createIdentityProvider} from "~/api/identity-providers";
import IdPInfo from "~/views/idps/IdPInfo.vue";

const emits = defineEmits(['change']);

const visible = defineModel('visible');

const form = ref<IdentifyProvider>({name: '', provider: {type: 'oidc'}});
const active = ref(0);

const prev = () => {
  if (active.value-- < 0) active.value = 0
}
const next = () => {
  if (active.value++ > 2) active.value = 0
}
const createProvider = async () => {
  const res = await createIdentityProvider(form.value);
  next();
  emits('change', res);
}

</script>
<style scoped>
.ep-radio {
  margin: 5px;
}

.ep-radio-group {
  display: flex;
  align-items: center;
}

.segment-title {
  font-size: 14px;
  width: 100%;
  font-weight: 600;
  padding-bottom: 10px;
  padding-top: 10px;
}
</style>
