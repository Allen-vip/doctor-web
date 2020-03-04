<template>
  <el-dialog title="门禁信息" :visible="visibleGuard">
    123
    <span slot="footer" class="dialog-footer">
      <el-button @click="toggleVisible">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script >
import Vue from "vue";
export default {
  props: {
    visibleGuard: false,
    userId: 0
  },
  data() {
    return {};
  },
  created() {
    console.log(this.userId);
  },
  methods: {
    toggleVisible() {
      this.$emit("toggleVisibleGuard");
    },
    sure() {}
  }
};
</script>