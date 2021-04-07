<template>
  <div>
    <Table border :columns="columns12" :data="data6" style="height:50vh">
      <template slot-scope="{ row }" slot="name">
        <strong>{{ row.name }}</strong>
      </template>
      <template slot-scope="{ index }" slot="action">
        <Button
          type="primary"
          size="small"
          style="margin-right: 5px"
          @click="show(index)"
          >View</Button
        >
        <Button type="error" size="small" @click="remove(index)">Delete</Button>
      </template>
    </Table>
    <div style="margin-top:30px;height:200px">
    <Row>
        <Col span="6">col-8</Col>
        <Col span="12"> <Page :total="50" show-sizer :page-size=pagesize /></Col>
        <Col span="6">col-8</Col>
    </Row>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      columns12: [
        {
          title: "姓名",
          slot: "name",
        },
        {
          title: "Age",
          key: "age",
        },
        {
          title: "Address",
          key: "address",
        },
        {
          title: "Action",
          slot: "action",
          width: 150,
          align: "center",
        },
      ],
      data6: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
        },
      ],
      pagesize:1,
    };
  },
  
  mounted: function() {
    let _this = this;
    _this.pagesize = 8;
  },
  methods: {
    show(index) {
      this.$Modal.info({
        title: "User Info",
        content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`,
      });
    },
    remove(index) {
      this.data6.splice(index, 1);
    },
    
  },
};
</script>
