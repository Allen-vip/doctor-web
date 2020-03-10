<template>
  <section>
    <!--列表-->
    <el-table :data="gateEvents" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" width="40" align="center"></el-table-column>

      <el-table-column
        property="srcTs"
        label="时间"
        width="110"
        sortable
        :formatter="formatTime"
        align="center"
      ></el-table-column>
      <el-table-column property="lockCat" label="类型" width="120" sortable align="center"></el-table-column>
      <el-table-column property="media" label="介质" width="120" sortable align="center"></el-table-column>
      <el-table-column property="userName" label="姓名" width="120" sortable align="center"></el-table-column>
      <!-- <el-table-column property="homeName" label="住家" width="180" sortable align="center"></el-table-column> -->
      <el-table-column property="deviceName" label="设备" width="180" sortable align="center"></el-table-column>
      <!-- <el-table-column
        property="envTemp"
        label="气温(℃)"
        width="120"
        sortable
        align="center"
        v-if="showTemp"
      ></el-table-column>-->
      <el-table-column
        property="humanTemp"
        label="体温(℃)"
        width="120"
        sortable
        align="center"
        v-if="showTemp"
      ></el-table-column>
      <el-table-column
        property="accountNickName"
        label="账号"
        width="120"
        sortable
        align="center"
        v-if="isAdmin===1"
      ></el-table-column>
      <el-table-column prop="listPictureName" label="拍照" width="160" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.listPictureName === null || scope.row.listPictureName.length === 0">无</div>
          <div v-else>
            <el-button size="small" @click="handleViewPicture(scope.$index, scope.row)">查看</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="video" label="录像" width="160" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.listVideoName === null || scope.row.listVideoName.length === 0">无</div>
          <div v-else>
            <el-button size="small" @click="handleViewVideo(scope.$index, scope.row)">查看</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="10"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>

    <el-dialog title="录像播放" v-model="videoFormVisible" :close-on-click-modal="false">
      <div class="video-box">
        <video-player
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
        ></video-player>
      </div>
    </el-dialog>

    <el-dialog title="照片" v-model="picFormVisible" :close-on-click-modal="false">
      <div class="picture-box">
        <el-carousel :interval="4000" type="card" height="400px" align="center">
          <el-carousel-item v-for="item in this.picForm.listPictureName">
            <img :src="item" height="400" />
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import util from "../../common/js/util";
import {
  apiGetGateEventPage,
  apiGetGateEventList,
  apiTestAesDecrypt
} from "../../api/api";
import { API_HOST } from "../../api/api";

export default {
  data() {
    return {
      filters: {
        name: ""
      },
      isAdmin: 0,
      gateEvents: [],
      showTemp: false,
      total: 0,
      page: 1,
      listLoading: false,
      videoFormVisible: false,
      videoForm: {},
      picFormVisible: false,
      picForm: {},
      playerOptions: {
        live: true,
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: true, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "",
            src: ""
            //"../../../static/20190529111256.mp4" //视频url地址
          }
        ],
        poster: "", //"../../static/image/thumb_1_1380_460_20181009043014983386.jpg", //你的封面地址
        // width: document.documentElement.clientWidth,
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true //全屏按钮
        }
      }
    };
  },
  methods: {
    formatTime: function(row, column) {
      return util.formatDate.format(
        new Date(row.srcTs * 1000),
        "yyyy-MM-dd hh:mm:ss"
      );
    },

    handleCurrentChange: function(val) {
      this.page = val;
      this.getGateEvents();
    },

    getGateEvents: function() {
      let para = {
        page: this.page,
        count: 10,
        filter: this.filters.name
      };
      this.listLoading = true;
      apiGetGateEventPage(para).then(res => {
        this.total = res.data.myModel.total;
        this.gateEvents = res.data.myModel.data;
        this.listLoading = false;
        this.gateEvents.forEach(e => {
          e.homeName =
            (e.userBuildingNum || "?") +
            "栋" +
            (e.userUnitNum || "?") +
            "单元" +
            (e.userRoomNum || "?") +
            "室";
          e.deviceName =
            (e.deviceBuildingNum || "?") +
            "栋" +
            (e.deviceUnitNum || "?") +
            "单元";
          e.lockCat = e.lockCat === "1" ? "已开门" : "未开门";
          e.media =
            e.media === "00"
              ? "人脸识别"
              : e.media === "01"
              ? "黑名单"
              : e.media === "02"
              ? "门禁卡"
              : "";
          console.log(
            "e.envTemp:" +
              JSON.stringify(e.envTemp) +
              " e.humanTemp:" +
              JSON.stringify(e.humanTemp)
          );
          if (
            (e.envTemp != null && e.envTemp !== "") ||
            (e.humanTemp != null && e.humanTemp != "")
          ) {
            this.showTemp = true;
          }
        });
      });
    },
    handleViewVideo: function(index, row) {
      this.videoFormVisible = true;
      this.videoForm = Object.assign({}, row);
      this.playerOptions.sources[0].src = API_HOST + row.listVideoName[0];
    },
    handleViewPicture: function(index, row) {
      this.picFormVisible = true;
      this.picForm = Object.assign({}, row);
      this.picForm.listPictureName = [];
      for (let i = 0; i < row.listPictureName.length; i++) {
        this.picForm.listPictureName[i] = API_HOST + row.listPictureName[i];
      }
    }
  },

  mounted() {
    this.getGateEvents();
    this.isAdmin = parseInt(sessionStorage.getItem("isAdmin"));
  }
};
</script>

<style scoped>
</style>
