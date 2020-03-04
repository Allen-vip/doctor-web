<template>
  <el-dialog title="医嘱" :visible="visibleAdvice">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="体温正常">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="体温异常">
        <el-input v-model="form.name1"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="toggleVisible">取 消</el-button>
      <el-button type="primary" @click="sure">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script >
import Vue from "vue";
export default {
  props: {
    visibleAdvice: false
  },
  data() {
    return {
      form: {
        name: "",
        name1: ""
      }
    };
  },
  methods: {
    toggleVisible() {
      this.$emit("toggleVisibleModal");
    },
    sure() {}
  }
};
</script>