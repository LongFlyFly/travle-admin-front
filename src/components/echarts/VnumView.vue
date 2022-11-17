<template>
    <div id="vnum" style="width: 100%; height: 348px;">
    </div>
</template>

<script>
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';
import axios from 'axios';

export default{
    name: 'VnumView',
    setup() {
        onMounted(async () => {
            // 数量获取
            const userNum = ref()
            await axios.get('/api/user').then((res) => {
                userNum.value = res.data.data.length
            })

            const writeNum = ref()
            await axios.get('/api/write').then((res) => {
                writeNum.value = res.data.data.length
            })

            const goodNum = ref()
            await axios.get('/api/good').then((res) => {
                goodNum.value = res.data.data.length
            })

            const orderNum = ref()
            await axios.get('/api/order').then((res) => {
                orderNum.value = res.data.data.length
            })

            var chartDom = document.getElementById('vnum');
            var myChart = echarts.init(chartDom);
            var option;

            option = {
                title: {
                    left: 'center',
                    text: '表单数量统计'
                },
                xAxis: {
                    type: 'category',
                    data: ['景点', '订单', '用户', '评论']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                    data: [
                        {
                            name: '景点',
                            value: goodNum.value,
                            itemStyle: {
                                color: 'rgb(64, 201, 198)'
                            },
                            label: {
                                show: true,
                                position: 'top'
                            },
                        },
                        {
                            name: '订单',
                            value: writeNum.value,
                            itemStyle: {
                                color: 'rgb(54, 163, 247)'
                            },
                            label: {
                                show: true,
                                position: 'top'
                            },
                        },
                        {
                            name: '用户',
                            value: userNum.value,
                            itemStyle: {
                                color: 'rgb(244, 81, 108)'
                            },
                            label: {
                                show: true,
                                position: 'top'
                            },
                        },
                        {
                            name: '评论',
                            value: orderNum.value,
                            itemStyle: {
                                color: 'rgb(52, 191, 163)'
                            },
                            label: {
                                show: true,
                                position: 'top'
                            },
                        }
                    ],
                    type: 'bar',
                    showBackground: true
                    },
                ]
            }
            option && myChart.setOption(option);
        })
        return{

        }
    }
}
</script>
