export default {
  excel (product) {
    const data = product
    const len = data.length
    const vm = this
    let i
    const arr = []
    for (i = 0; i < len; i++) {
      const item = data[i]
      const productExcelQuantity = item.product_excel_quantity
      item.toal = vm.quantityTotal(productExcelQuantity)

      arr.push(item)
    }
    return arr
  },
  quantityTotal (productExcelQuantity) {
    const warerooms = productExcelQuantity
    const len = warerooms.length
    let i
    const toal = {'quantity': 0, 'sales': 0}
    let quantity = 0
    let sales = 0
    for (i = 0; i < len; i++) {
      const item = warerooms[i]
      quantity += item.quantity
      sales += item.sales
    }

    toal.quantity = quantity
    toal.sales = sales

    return toal
  }
}
