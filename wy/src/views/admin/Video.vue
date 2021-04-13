<template>
 <div>
  <h1>{{ summary.name }}</h1>

  <Row style="margin-bottom: 30px">
   <Col span="2">
    <router-link to="/summary">
     <Button type="primary"
      ><Icon type="md-arrow-round-back" />返回</Button
     ></router-link
    ></Col
   >
   <Col span="2"
    ><Button type="primary" @click="list(1)"
     ><Icon type="ios-refresh" />刷新</Button
    ></Col
   >
   <Col span="3"
    ><Button type="primary" @click="toAdd"
     ><Icon type="md-add" />新增</Button
    ></Col
   >
   <Col span="16">
    <Page
     :current="pageNo"
     :total="totalRecord"
     :page-size="pageSize"
     @on-change="handleCurrentChange"
     @on-page-size-change="handleSizeChange"
     show-sizer
     show-total
    />
   </Col>
  </Row>
  <Table border :columns="video_title" :data="videos" style="width: 1100px">
  </Table>
  <!-- 删除 -->
  <Modal v-model="modal_delete" width="360">
   <p slot="header" style="color: #f60; text-align: center">
    <Icon type="ios-information-circle"></Icon>
    <span>确定删除?</span>
   </p>
   <div style="text-align: center">
    <p>删除此视频信息将不可恢复！</p>
   </div>
   <div slot="footer">
    <Button
     type="error"
     size="large"
     long
     :loading="modal_loading"
     @click="del(deleteID)"
     >我仍要删除！</Button
    >
   </div>
  </Modal>
  <!-- 新增 -->
  <Modal v-model="modal_add" width="360" @on-cancel="cancel">
   <p slot="header" style="color: #2b85e4; text-align: center">
    <Icon type="md-videocam" />
    <span>新增视频</span>
   </p>
   <div style="text-align: center">
    <Form :label-width="80">
     <FormItem label="标题">
      <Input type="text" v-model="video.title"></Input>
     </FormItem>
     <FormItem label="顺序">
      <Input type="text" v-model="video.sort"></Input>
     </FormItem>
     <FormItem label="收费">
      <Select style="width: 200px" v-model="video.charge">
       <Option
        v-for="item in VIDEO_CHARGE"
        :value="item.key"
        :key="item.value"
        >{{ item.value }}</Option
       >
      </Select>
     </FormItem>
       <FormItem label="时长">
      <Input type="text" v-model="video.time" disabled></Input>
     </FormItem>
      <FormItem label="视频地址">
      <Input type="text" v-model="video.video" disabled></Input>
     </FormItem>
      <FormItem label="视频" v-show="video.video" >
        <player ref="addvideoplayer" :player-id="'addvideoplayer'"></player>
     </FormItem>
     <FormItem label="vod">
      <Input type="text" v-model="video.vod" disabled></Input>
     </FormItem>
     <FormItem label="视频">
      <Upload
       enctype="multipart/form-data"
       :action="uploadAction"
       name="video"
       :data="source"
       :on-success="uploadSuccess"
       :format="['MP4']"
       :on-error="uploadError"
       ref="addVideo"
      >
       <Button icon="ios-cloud-upload-outline">上传video</Button>
      </Upload>
     </FormItem>
    </Form>
   </div>
   <div slot="footer">
    <Button type="primary" @click="add">新增</Button>
   </div>
  </Modal>
  <!-- 修改 -->
  <Modal v-model="modal_update" width="360" @on-cancel="cancel">
   <p slot="header" style="color: #2b85e4; text-align: center">
    <Icon type="md-videocam" />
    <span>修改视频</span>
   </p>
   <div style="text-align: center">
    <Form :label-width="80">
     <FormItem label="ID">
      <Input type="text" v-model="video.id" disabled></Input>
     </FormItem>
     <FormItem label="标题">
      <Input type="text" v-model="video.title"></Input>
     </FormItem>
     <FormItem label="顺序">
      <Input type="text" v-model="video.sort"></Input>
     </FormItem>
     <FormItem label="收费">
      <Select style="width: 200px" v-model="video.charge">
       <Option
        v-for="item in VIDEO_CHARGE"
        :value="item.key"
        :key="item.value"
        >{{ item.value }}</Option
       >
      </Select>
     </FormItem>
      <FormItem label="时长">
      <Input type="text" v-model="video.time" disabled></Input>
     </FormItem>
     <FormItem label="视频地址">
      <Input type="text" v-model="video.video" disabled></Input>
     </FormItem>
      <FormItem label="视频" >
        <video :src="video.video" style="width:250px;height:250px"></video>
     </FormItem>
      <FormItem label="视频" >
        <player ref="updatevideoplayer"  :player-id="'updatevideoplayer'"></player>
     </FormItem>
        <FormItem label="vod">
      <Input type="text" v-model="video.vod" disabled></Input>
     </FormItem>
     <FormItem label="视频">
      <Upload
       enctype="multipart/form-data"
       :action="uploadAction"
       name="video"
       :data="source"
       :on-success="uploadSuccess"
       :format="['MP4']"
       :on-error="uploadError"
       ref="updateVideo"
      >
       <Button icon="ios-cloud-upload-outline">上传video</Button>
      </Upload>
     </FormItem>
    </Form>
   </div>
   <div slot="footer">
    <Button type="primary" @click="update">确定修改</Button>
   </div>
  </Modal>
  <!-- 播放 -->
  <Modal v-model="modal_video"  @on-cancel="cancel">
     <player ref="lookvideoplayer" :player-id="'lookvideoplayer'"></player>
  </Modal>
 </div>
</template>
<script>
import Player from '../../components/Player.vue';
export default {
 components: { Player },
 name: "wy_video",

 //返回值
 data: function () {
  return {
   modal_update: false, //修改模态框
   modal_add: false, //添加模态框
   modal_delete: false, //删除模态框
   modal_loading: false, //加载模态框
   videos: [], //视频列表
   //分页查询参数
   pageNo: 1,
   totalRecord: 0,
   pageSize: 3,
   video: {
    charge: 0,
   }, //视频
   deleteID: 0,
   //表格头部信息
   video_title: [
    {
     title: "ID",
     key: "id",
    },
    {
     title: "标题",
     key: "title",
    },
    {
     title: "时长",
     key: "time",
    },
    {
     title: "顺序",
     key: "sort",
    },
    {
     title: "收费",
     key: "charge",
     render: (h, params) => {
      // 根据条件判断内容重写
      switch (params.row.charge) {
       case 0:
        return h("span", "免费");
       case 1:
        return h("span", "收费");
      }
     },
    },
    {
     title: "操作",
     key: "dosome",
     width: 250,
     align: "center",
     render: (h, params) => {
      return h("div", [
       h(
        "Button",
        {
         props: {
          type: "warning",
          size: "small",
         },
         style: {
          marginRight: "5px",
         },
         on: {
          click: () => {
           let _this = this;
           _this.video = params.row;
           _this.toUpdate(_this.video);
          },
         },
        },
        "修改"
       ),
       h(
        "Button",
        {
         props: {
          type: "error",
          size: "small",
         },
         style: {
          marginRight: "5px",
         },
         on: {
          click: () => {
           let _this = this;
           _this.deleteID = params.row.id;
           _this.modal_delete = true;
          },
         },
        },
        "删除"
       ),
       h(
        "Button",
        {
         props: {
          type: "info",
          size: "small",
         },
         on: {
          click: () => {
            let _this = this;
            console.log(params.row.vod)
           _this.tolookvideo(params.row.vod);
          },
         },
        },
        "播放"
       ),
      ]);
     },
    },
   ],
   //枚举
   VIDEO_CHARGE: VIDEO_CHARGE,
   //视频概览
   summary: {},
   //上传文件地址
   uploadAction: process.env.VUE_APP_SERVER + "/file/file/vod",
   //图片来源
   source: { name: SOURCE.VIDEO.value },
   //播放器名称
   playname:"",
   //播放弹出框
   modal_video:false,
  };
 },
 mounted: function () {
  let _this = this;
  //获取缓存中的视频概览
  let summary = SessionStorage.get(SESSION_SUMMARY) || {};
  if (Tool.isEmpty(summary)) {
   _this.$router.push("/login");
  }
  _this.summary = summary;
  _this.list(1);
 },
 methods: {
  //列表查询
  list(pageNo) {
   let _this = this;
   _this.$Spin.show({
    render: (h) => {
     return h("div", [
      h("Icon", {
       class: "demo-spin-icon-load",
       props: {
        type: "ios-loading",
        size: 18,
       },
      }),
      h("div", "Loading"),
     ]);
    },
   });
   setTimeout(() => {
    _this.$Spin.hide();
    _this.$ajax
     .post(process.env.VUE_APP_SERVER + "/business/video/list", {
      pageNo: pageNo,
      pageSize: _this.pageSize,
      summaryId: _this.summary.id,
     })
     .then(
      //响应结果
      (response) => {
       if (response.data.success) {
        console.log("查询视频列表", response);
        let resp = response.data.data;
        _this.videos = resp.records;
        _this.totalRecord = resp.totalRecord;
        this.$Message.info("获取列表信息ok");
       } else {
        this.$Message.error("出错了,告知老王修复");
       }
      }
     );
   }, 500);
  },
  //页码改变
  handleCurrentChange(page) {
   this.list(page);
  },
  //改变页长
  handleSizeChange(size) {
   let _this = this;
   _this.pageSize = size;
   _this.list(_this.pageNo);
  },
  //新增视频
  add() {
   let _this = this;
   _this.$Spin.hide();
   _this.video.summaryId = _this.summary.id;
   _this.$ajax
    .post(process.env.VUE_APP_SERVER + "/business/video/add", _this.video)
    .then(
     //响应结果
     (response) => {
      if (response.data.success) {
       console.log("新增视频信息", response);
       _this.list(1);
       _this.$Message.info("新增视频ok");
       _this.video = {};
       _this.modal_add = false;
      } else {
       _this.$Notice.error({
        title: response.data.message,
       });
       //_this.$Message.error("出错了,告知老王修复");
      }
     }
    );
  },
  //打开更新模态框
  toUpdate(video) {
   let _this = this;
   _this.$refs["updateVideo"].clearFiles();
   _this.$Spin.show({
    render: (h) => {
     return h("div", [
      h("Icon", {
       class: "demo-spin-icon-load",
       props: {
        type: "ios-loading",
        size: 18,
       },
      }),
      h("div", "Loading"),
     ]);
    },
   });
   setTimeout(() => {
    _this.$Spin.hide();
    //消除双向绑定，复制对象
    _this.video = $.extend({}, video);
    console.log(_this.video.video);
    _this.playname="updatevideoplayer";
    _this.$refs[_this.playname].playUrl(_this.video.video);
    _this.modal_update = true;
    //播放视频
   }, 500);
  },
  //打开新增模态框
  toAdd() {
   let _this = this;
   _this.$refs["updateVideo"].clearFiles();
   _this.$Spin.show({
    render: (h) => {
     return h("div", [
      h("Icon", {
       class: "demo-spin-icon-load",
       props: {
        type: "ios-loading",
        size: 18,
       },
      }),
      h("div", "Loading"),
     ]);
    },
   });
   setTimeout(() => {
    _this.$Spin.hide();
    //消除双向绑定，复制对象
    _this.video = {
      time:"",
      vod:"",
      image:"",
    };
    _this.modal_add = true;
   }, 500);
  },
  //修改视频
  update() {
   let _this = this;
   _this.$ajax
    .post(process.env.VUE_APP_SERVER + "/business/video/update", _this.video)
    .then(
     //响应结果
     (response) => {
      if (response.data.success) {
       console.log("修改视频信息", response);
       _this.list(1);
       _this.$Message.info("修改视频ok");
       _this.modal_update = false;
       _this.video = {};
      } else {
       _this.$Message.error("出错了,告知老王修复");
      }
     }
    );
  },
  //取消
  cancel() {
   this.$Message.info("已取消操作");
  },
  //删除视频
  del(id) {
   console.log(id);
   this.modal_loading = true;
   setTimeout(() => {
    let _this = this;
    _this.$ajax
     .get(process.env.VUE_APP_SERVER + "/business/video/delete/" + id)
     .then(
      //响应结果
      (response) => {
       this.modal_loading = false;
       this.modal_delete = false;
       if (response.data.success) {
        console.log("删除视频信息", response);
        _this.list(1);
        this.$Message.info("删除视频ok");
       } else {
        this.$Message.error("出错了,告知老王修复");
       }
      }
     );
   }, 500);
  },
  //文件上传成功
  uploadSuccess(response) {
    let _this  = this;
   console.log(response);
   _this.video.video = response.data.path;
   console.log(_this.video.video);
   _this.video.vod = response.data.vod
   //获取时长
   _this.video.time = response.data.size;
   //自动播放视频
  },
  uploadError(error, file, fileList) {
   this.$Notice.error({
    title: "上传文件出错",
    desc: "位置：演员,尽快通知老王修复，上传文件错误，",
   });
   console.log(error);
   console.log(fileList);
   console.log(file);
  },
  //打开播放按钮
  tolookvideo(vod){
    let _this = this;
    _this.modal_video = true;
    _this.playname="lookvideoplayer";
    _this.$refs[_this.playname].playVod(vod);
  }
 },
};
</script>
<style scope>
.demo-spin-icon-load {
 animation: ani-demo-spin 1s linear infinite;
}
</style>