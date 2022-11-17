<template>
    <div class="form">
        <el-card class="box-card">
            <el-table :data="tableData" height="72vh" border>
                <el-table-column prop="date" label="Date" width="140" />
                <el-table-column prop="name" label="Name" width="120" />
                <el-table-column prop="address" label="Address" />
                <el-table-column label="操作">
                <el-button type="warning" plain>修改</el-button>
                <el-button type="danger" plain>删除</el-button>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import { ref } from 'vue'

// @ is an alias to /src

export default {
  name: 'GoodsView',
  setup () {
    const item = {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    }
    const tableData = ref(Array.from({ length: 20 }).fill(item))
    return {
      tableData
    }
  }
}
</script>

<style>
</style>
