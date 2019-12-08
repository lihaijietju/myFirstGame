<template>
</template>

<script type="text/ecmascript-6">


    export default {
        mounted(){
        },
        components: {},
        methods: {
            drawLine(){
                var myChart = this.$echarts.init(document.getElementById('myChart'))
                // 绘制图表
                myChart.setOption({
                    title: {text: '在Vue中使用echarts'},
                    tooltip: {},
                    xAxis: {
                        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20]
                    }]
                })

            }
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
