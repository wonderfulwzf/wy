<template>
 <div>
  <Row style="margin-bottom: 30px">
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
  <Row :gutter="16" style="height: 650px">
   <Col span="6" v-for="actor in actors" v-bind:key="actor.id">
    <div>
     <Card style="width: 220px">
      <div style="text-align: center">
       <div class="demo-avatar">
        <Avatar
         icon="ios-person"
         :src="actor.image"
         style="width: 90px; height: 90px"
        />
       </div>
       <h3>{{ actor.name }}</h3>
       <p>{{ actor.intro }}</p>
       <Button type="warning" @click="toUpdate(actor)" style="margin: 3px"
        ><Icon type="md-brush" />修改</Button
       >
       <Button type="error" style="margin: 3px" @click="modal_delete = true"
        ><Icon type="md-close" />删除</Button
       >
       <!-- 删除 -->
       <Modal v-model="modal_delete" width="360">
        <p slot="header" style="color: #f60; text-align: center">
         <Icon type="ios-information-circle"></Icon>
         <span>确定删除?</span>
        </p>
        <div style="text-align: center">
         <p>删除此演员信息将不可恢复！</p>
        </div>
        <div slot="footer">
         <Button
          type="error"
          size="large"
          long
          :loading="modal_loading"
          @click="del(actor.id)"
          >我仍要删除！</Button
         >
        </div>
       </Modal>
      </div>
     </Card>
    </div>
   </Col>
  </Row>
  <!-- 添加 -->
  <Modal v-model="modal_add" title="新增演员" @on-ok="add" @on-cancel="cancel">
   <Form label-position="left" :label-width="100">
    <FormItem label="名称">
     <Input v-model="actor.name"></Input>
    </FormItem>
    <FormItem label="图片">
     <Input v-model="actor.image"></Input>
    </FormItem>
    <FormItem label="简介">
     <Input v-model="actor.intro"></Input>
    </FormItem>
   </Form>
  </Modal>
  <!-- 修改 -->
  <Modal
   v-model="modal_update"
   title="修改演员信息"
   @on-ok="update()"
   @on-cancel="cancel"
  >
   <Form label-position="left" :label-width="100">
    <FormItem label="id">
     <Input v-model="actor.id" disabled></Input>
    </FormItem>
    <FormItem label="名称">
     <Input v-model="actor.name"></Input>
    </FormItem>
    <FormItem label="图片">
     <Input v-model="actor.image"></Input>
    </FormItem>
    <FormItem label="简介">
     <Input v-model="actor.intro"></Input>
    </FormItem>
   </Form>
  </Modal>
 </div>
</template>
<script>
export default {
 name: "actor",

 //返回值
 data: function () {
  return {
   modal_update: false, //修改模态框
   modal_add: false, //添加模态框
   modal_delete: false, //删除模态框
   modal_loading: false, //加载模态框
   actors: [], //演员列表
   //分页查询参数
   pageNo: 1,
   totalRecord: 0,
   pageSize: 3,
   actor: {}, //演员
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
    this.$Spin.hide();
    _this.$ajax
     .post(process.env.VUE_APP_SERVER + "/business/actor/list", {
      pageNo: pageNo,
      pageSize: _this.pageSize,
     })
     .then(
      //响应结果
      (response) => {
       if (response.data.success) {
        console.log("查询演员列表", response);
        let resp = response.data.data;
        _this.actors = resp.records;
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
  //新增演员
  add() {
   let _this = this;
   _this.$Spin.hide();
   _this.$ajax
    .post(process.env.VUE_APP_SERVER + "/business/actor/add", _this.actor)
    .then(
     //响应结果
     (response) => {
      if (response.data.success) {
       console.log("新增演员信息", response);
       _this.list(1);
       _this.$Message.info("新增演员ok");
       _this.actor = {};
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
  toUpdate(actor) {
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
    this.$Spin.hide();
    console.log(actor);
    //消除双向绑定，复制对象
    _this.actor = $.extend({}, actor);
    _this.modal_update = true;
   }, 500);
  },
  //打开新增模态框
  toAdd() {
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
    //消除双向绑定，复制对象
    _this.actor = {};
    _this.modal_add = true;
   }, 500);
  },
  //修改演员
  update() {
   let _this = this;

   _this.$ajax
    .post(process.env.VUE_APP_SERVER + "/business/actor/update", _this.actor)
    .then(
     //响应结果
     (response) => {
      if (response.data.success) {
       console.log("修改演员信息", response);
       _this.list(1);
       _this.$Message.info("修改演员ok");
       _this.actor = {};
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
  //删除演员
  del(id) {
   this.modal_loading = true;
   setTimeout(() => {
    let _this = this;
    _this.$ajax.get(process.env.VUE_APP_SERVER + "/business/actor/delete/" + id).then(
     //响应结果
     (response) => {
      this.modal_loading = false;
      this.modal_delete = false;
      if (response.data.success) {
       console.log("删除演员信息", response);
       _this.list(1);
       this.$Message.info("删除演员ok");
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