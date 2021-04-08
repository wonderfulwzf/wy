<template>
 <div>
  <Row style="margin-bottom: 30px">
   <Col span="2"
    ><Button type="primary"><Icon type="ios-refresh" />刷新</Button></Col
   >
   <Col span="3"
    ><Button type="primary" @click="modal_add = true"
     ><Icon type="md-add" />新增</Button
    ></Col
   >
   <Col span="16"><Page :total="100" show-sizer show-total /></Col>
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
       <Button type="warning" @click="modal_update = true" style="margin: 3px"
        ><Icon type="md-brush" />修改</Button
       >
       <Button type="error" style="margin: 3px" @click="modal_delete = true"
        ><Icon type="md-close" />删除</Button
       >
       <!-- 修改 -->
       <Modal
        v-model="modal_update"
        title="修改演员信息"
        @on-ok="update"
        @on-cancel="cancel"
       >
        <Form label-position="left" :label-width="100">
         <FormItem label="名称">
          <Input :value="actor.name"></Input>
         </FormItem>
         <FormItem label="图片">
          <Input :value="actor.image"></Input>
         </FormItem>
         <FormItem label="简介">
          <Input :value="actor.intro"></Input>
         </FormItem>
        </Form>
       </Modal>
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
     <Input></Input>
    </FormItem>
    <FormItem label="图片">
     <Input></Input>
    </FormItem>
    <FormItem label="简介">
     <Input></Input>
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
   //模态框
   modal_update: false,
   modal_add: false,
   modal_delete: false,
   modal_loading: false,
   actors: [],
  };
 },
 mounted: function () {
  let _this = this;
  _this.list();
 },
 methods: {
  //列表查询
  list() {
   let _this = this;
   _this.$ajax.get(process.env.VUE_APP_SERVER + "/business/list").then(
    //响应结果
    (response) => {
     console.log("查询演员列表", response);
     let resp = response.data;
     _this.actors = resp.data.records;
    }
   );
  },
  //模态框操作
  add() {
   this.$Message.info("Clicked ok");
  },
  update() {
   this.$Message.info("Clicked ok");
  },
  cancel() {
   this.$Message.info("Clicked cancel");
  },
  //删除
  del(id) {
   this.modal_loading = true;
   setTimeout(() => {
     console.log(id);
    this.modal_loading = false;
    this.modal_delete = false;
    this.$Message.success("Successfully delete");
   }, 2000);
  },
 },
};
</script>
