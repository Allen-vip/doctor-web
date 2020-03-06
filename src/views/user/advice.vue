<template>
  <el-dialog title="医嘱" :visible="visibleAdvice">
    <el-form ref="form" :model="form" label-width="170px" :rules="rules">
      <el-form-item label="体温正常" prop="normalAd">
        <el-input v-model="form.normalAd" placeholder="请输入正常体温医嘱"></el-input>
      </el-form-item>
      <el-form-item label="体温异常" prop="exceptionAd">
        <el-input v-model="form.exceptionAd" placeholder="请输入异常体温医嘱"></el-input>
      </el-form-item>
      <el-form-item label="体温报警上限值(℃)" prop="bodyTempGuard">
        <el-input v-model="form.bodyTempGuard" placeholder="请输入体温报警上限值"></el-input>
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
import { apiAddConfig, apiAddConfigQuery } from "../../api/api";
export default {
  props: {
    visibleAdvice: false
  },
  data() {
    return {
      form: {
        normalAd: "",
        exceptionAd: "",
        bodyTempGuard: ""
      },
      rules: {
        normalAd: [
          {
            required: true
          }
        ],
        exceptionAd: [
          {
            required: true
          }
        ],
        bodyTempGuard: [
          {
            required: true
          }
        ]
      }
    };
  },
  mounted() {
    this.getQuery();
  },
  watch: {
    visibleAdvice(newData) {
      if (newData === true) {
        this.getQuery();
      }
    }
  },
  methods: {
    toggleVisible() {
      this.$emit("toggleVisibleModal");
    },
    getQuery() {
      apiAddConfigQuery({}).then(({ data = {} }) => {
        this.form.normalAd = data.myModel.normalAd;
        this.form.exceptionAd = data.myModel.exceptionAd;
        this.form.bodyTempGuard = data.myModel.bodyTempGuard;
      });
    },
    sure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let { normalAd, exceptionAd, bodyTempGuard } = this.form;
          apiAddConfig({
            normalAd,
            exceptionAd,
            bodyTempGuard
          }).then(() => {
            this.$message.success("操作成功");
            this.$emit("toggleVisibleModal");
          });
        }
      });
    }
  }
};
</script>