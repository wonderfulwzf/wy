<template>
 <div>
  <Row style="margin-bottom: 30px">
   <Col span="2"
    ><Button type="primary" @click="list(1)"
     ><Icon type="ios-refresh" />刷新</Button
    ></Col
   >
   <Col span="3"></Col>
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
  <Table border :columns="file_title" :data="files" style="width: 1000px">
   <template slot-scope="{ row }" slot="name">
    <strong>{{ row.name }}</strong>
   </template>
   <template slot-scope="{ row }" slot="action">
    <Button type="error" size="small" @click="todelete(row)"
     ><Icon type="md-trash" />删除</Button
    >
    <Button
     v-show="row.vod"
     type="warning"
     size="small"
     style="margin-right: 5px"
     ><Icon type="md-videocam" />播放</Button
    >
   </template>
  </Table>
  <!-- 删除 -->
  <Modal v-model="modal_delete" width="360">
   <p slot="header" style="color: #f60; text-align: center">
    <Icon type="ios-information-circle"></Icon>
    <span>确定删除?</span>
   </p>
   <div style="text-align: center">
    <p>删除此文件信息将不可恢复！</p>
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
 </div>
</template>
<script>
export default {
 name: "wy_file",

 //返回值
 data: function () {
  return {
   modal_update: false, //修改模态框
   modal_add: false, //添加模态框
   modal_delete: false, //删除模态框
   modal_loading: false, //加载模态框
   files: [], //文件列表
   //分页查询参数
   pageNo: 1,
   totalRecord: 0,
   pageSize: 3,
   file: {}, //文件
   deleteID: 0,
   //表格头部信息
   file_title: [
    {
     title: "ID",
     key: "id",
    },
    {
     title: "路径",
     key: "path",
    },
    {
     title: "文件名称",
     key: "name",
    },
    {
     title: "文件大小",
     key: "size",
     render: (h, params) => {
      let value = params.row.size || 0;
      if (value > 100 * 1024) {
          return h("span", Math.round((value / 1024 / 1024) * 100) / 100 + "MB");
       } else 
        return h("span", Math.round((value / 1024) * 100) / 100 + "KB");
      }
    },
    {
     title: "操作",
     slot: "action",
     width: 200,
     align: "center",
    },
   ],
  };
 },
 mounted: function () {
  let _this = this;
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
     .post(process.env.VUE_APP_SERVER + "/file/file/list", {
      pageNo: pageNo,
      pageSize: _this.pageSize,
     })
     .then(
      //响应结果
      (response) => {
       if (response.data.success) {
        console.log("查询文件列表", response);
        let resp = response.data.data;
        _this.files = resp.records;
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
  //取消
  cancel() {
   this.$Message.info("已取消操作");
  },
  todelete(row){
    let _this = this;
    _this.deleteID =row.id;
    _this.modal_delete = true;
    console.log(_this.deleteID);
  },
  //删除文件
  del(id) {
   console.log(id);
   this.modal_loading = true;
   setTimeout(() => {
    let _this = this;
    _this.$ajax
     .get(process.env.VUE_APP_SERVER + "/file/file/delete/" + id)
     .then(
      //响应结果
      (response) => {
       this.modal_loading = false;
       this.modal_delete = false;
       if (response.data.success) {
        console.log("删除文件信息", response);
        _this.list(1);
        this.$Message.info("删除文件ok");
        _this.modal_delete = false;
       } else {
        this.$Message.error("出错了,告知老王修复");
       }
      }
     );
   }, 500);
  },
 },
};
</script>
<style scope>
.demo-spin-icon-load {
 animation: ani-demo-spin 1s linear infinite;
}
</style>