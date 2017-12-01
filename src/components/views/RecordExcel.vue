<template>
  <div class="list">
    <Row>
      <Col>
      <Card>
        <div slot="title">
        <span class="pull-right">
          <DatePicker :value="dateVal" format="yyyy-MM-dd HH:mm:ss" @on-change="datePickerChange" type="datetimerange" placement="bottom-end" placeholder="选择日期" style="width: 300px"></DatePicker>
        </span>

        <Button type="primary" @click="refresh" shape="circle" ><Icon type="ios-loop-strong"></Icon> 刷新</Button>
        <Button type="success" shape="circle" >共 ：{{warerooms.length}} 仓库</Button>
        <Button type="success" shape="circle" >共 ：{{products.length}} 产品</Button>
        </div>
        <div class="show-span" >
          <span class="health">
            健康状态 > 200
          </span>
          <span class="blue">
           50 > 库存减销量 < 200
          </span>
           <span class="yellow">
           库存紧张状态 <= 50
          </span>
          <span class="red">
            销量大于库存
          </span>
          <span class="gray">
           库存 = 0
          </span>
        </div>
        <div class="table-box" style="padding-top:10px;">
          <table class="excel-table exportCsv">
            <tr>
              <th>
                产品/分仓
              </th>
              <th v-for="wareroom in warerooms" :key="wareroom.title">
                {{ wareroom.title }}
              </th>
               <th>
                合计
              </th>
               <th>
                分仓\产品
              </th>
            </tr>
            <tr v-for="product in products" :key="product.product_title">
              <td>
                {{ product.product_title }}  
              </td>
              <td v-for="excel in product.product_excel_quantity" :key="excel.created_at+excel.quantity">
                <span v-if="excel.sales > excel.quantity" class="red">
                  （{{ excel.quantity }} / {{ excel.sales}} ）
                </span>
                <span v-else-if="excel.quantity - excel.sales > 200" class="health">
                  （{{ excel.quantity }} / {{ excel.sales}} ）
                </span>
                <span v-else-if="excel.quantity - excel.sales > 50" class="blue">
                  （{{ excel.quantity }} / {{ excel.sales}} ）
                </span>
                <span v-else-if="excel.quantity == 0" class="gray">
                  （{{ excel.quantity }} / {{ excel.sales}} ）
                </span>
                <span v-else class="yellow">
                  （{{ excel.quantity }} / {{ excel.sales}} ）
                </span>
              </td>
               <td>
                ( {{ product.toal.quantity}} / {{product.toal.sales}} )
              </td>
               <td>
                {{ product.product_title }}  
              </td>
            </tr>
          </table>
        </div>
      </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
  import elementResizeDetectorMaker from 'element-resize-detector'
  import filterProduct from '../../common/filter/product'
  var erd = elementResizeDetectorMaker()
  export default {
    name: 'record_excel',
    components: {},
    data () {
      return {
        dateVal: [],
        searchState: false,
        editModal: false,
        detailModal: false,
        deleteTip: false,
        showHeader: true, // 是否显示表头 @:show-header
        loading2: false, // 分页loading
        fixedHeader: false, // 是否固定表头 @:height
        tableSize: 'small', // @:size
        DateReady: false, // 判断异步数据加载完成，避免报错
        loading: false, // save
        saveDisabled: false,
        params: {},
        warerooms: [],
        products: []
      }
    },
    watch: {
      /**
       * @params 监听参数变化重新获取数据
       * */
      params: {
        handler (val) {
          console.log('params')
          console.log(val)
          this.getData(val)
        },
        deep: true
      }
    },
    computed: {
      state () {
        return this.$store.state.app
      }
    },
    methods: {
      searchShow () {
        this.searchState = !this.searchState
      },
      /**
       * 刷新页面请求
       * */
      refresh () {
        this.getData(this.params)
      },
      getData (params) {
        this.loading2 = true
        this.$api.recordExcelListQ2(params).then((res) => {
          console.log(res)
          if (res.warerooms) {
            this.warerooms = res.warerooms
            const products = filterProduct.excel(res.products)
            this.products = products
            this.DateReady = true
            this.loading2 = false
          } else {
            this.$Message.error(res.msg)
            this.loading2 = false
          }
        })
      },
      datePickerChange (e) {
        console.log(e)
        this.dateVal = e
        var params = this.params
        params.start_time = e[0]
        params.end_time = e[1]
        this.params = params
        console.log(params)
        this.getData(params)
      }
    },
    created () {
      this.getData(this.params)
    },
    mounted () {
      erd.listenTo(window, 'resize', this.handleResize)
    }
  }
</script>
<style lang="less" scoped>
  .search-filter {
    opacity: 0;
    display: none;
    overflow: hidden;
    transition: all 0.28s ease-out;
    &.active {
      opacity: 1;
      display: block;
    }
  }
  .excel-table{
    width: 100%;
    border-collapse:collapse;
    border-spacing:0;
    th{
      background-color: #f5f7f9;
      padding:10px 16px;
      border: 1px solid #ccc;
      border-left: none;
      border-right: none;
      border-top: none;
      white-space: nowrap;
      // text-align: center;
    }
    td{
      padding: 10px;
      border: 1px solid #ccc;
      border-left: none;
      border-right: none;
       white-space: nowrap;  
    }
    tr:nth-child(odd){
      // background: #ccc;
    }
    tr{
      &:hover{
        background-color: #dddddd;
      }
    }
    tr:nth-child(even){
      // background: rebeccapurple;
    }
  }
  .table-box{
    overflow-y: auto;
  }
  .show-span{
    span{
      margin-right: 20px;
      padding-right: 10px;
      border-right: 2px solid #ccc; 
    }
  }
  .red{
    color: red;
  }
  .yellow{
    color: #ff7800;
  }
  .health{
    color: #24cc61;
  }
  .purple{
    color: #c921d6;
  }
  .blue{
    color: #3399ff;
  }
  .gray{
    color: #ededed;
  }
  .strong{
    font-weight: bold;
  }
</style>

