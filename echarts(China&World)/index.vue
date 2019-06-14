<template>
  <div>
    <div>
      <ButtonGroup style='marginRight:2rem'>
        <Button @click='switchAreaChina' :type='buttonTypeChina'>中国</Button>
        <Button @click='switchAreaWorld' :type='buttonTypeWorld'>全球</Button>
      </ButtonGroup>
      <span style="fontSize:0.75rem">时间</span>
      <Select v-model='time' class='co-timeSelect'>
        <Option v-for='item in timeData' :value='item.id' :key='item.index'>{{ item.name }}</Option>
      </Select>
      <span style="fontSize:0.75rem">设备名称</span>
      <Select v-model='deviceName' class='co-deviceSelect'>
        <Option v-for='item in deviceData' :value='item.id' :key='item.index'>{{ item.name }}</Option>
      </Select>
    </div>
    <div class="co-map">
      <chinaMap v-if='isShowChinaMap'></chinaMap>
      <worldMap v-else></worldMap>
    </div>
  </div>
</template>

<script type="text/javascript">
import chinaMap from './china-map.vue'
import worldMap from './world-map.vue'
export default {
  components: {
    'chinaMap': chinaMap,
    'worldMap': worldMap
  },
  data () {
    return {
      buttonTypeChina: 'primary',
      buttonTypeWorld: 'ghost',
      isShowChinaMap: true,
      time: '1',
      timeData: [
        {name: '近一小时', id: '1'},
        {name: '近一天', id: '2'},
        {name: '近七天', id: '3'}
      ],
      deviceName: '1',
      deviceData: [
        {name: 'All', id: '1'},
        {name: '设备1', id: '2'},
        {name: '设备2', id: '3'}
      ]
    }
  },
  methods: {
    switchAreaChina () {
      this.buttonTypeChina = 'primary'
      this.buttonTypeWorld = 'ghost'
      this.isShowChinaMap = true
    },
    switchAreaWorld () {
      this.buttonTypeChina = 'ghost'
      this.buttonTypeWorld = 'primary'
      this.isShowChinaMap = false
    }
  },
  created () {
    let aMenuArr = this.$store.getters.getBreadCrumbFromPath('/monitor/ips_attack')
    this.$store.commit('setBreadCrumbMenu', {
      menuArr: aMenuArr
    })
  }
}
</script>

<style type="text/css" scoped>
.co-timeSelect{
  width: 10rem;
  display: inline-block;
  margin: 0 2rem 0 0.5rem;
}
.co-deviceSelect{
  width: 10rem;
  display: inline-block;
  margin: 0 0.5rem;
}
.co-map{
  margin-top: 2rem;
}
</style>
