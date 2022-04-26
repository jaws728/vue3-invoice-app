<template>
  <div class="home container">
    <!-- Header -->
    <div class="header flex">
      <!-- start left -->
      <div class="left flex flex-column">
        <h1>Invoices</h1>
        <span>There are {{invoiceData.length}} total invoices</span>
      </div>
      <!-- end left -->
      <!-- start right -->
      <div class="right flex">
        <!-- start filter -->
        <div @click="toggleFilterMenu" class="filter flex">
          <span>Filter by status<span v-if="filteredInvoices">: {{filteredInvoices}}</span></span>
          <img src="@/assets/icon-arrow-down.svg" alt="">
          <ul v-show="filterMenu" class="filter-menu">
            <li @click="filterInvoices">Draft</li>
            <li @click="filterInvoices">Pending</li>
            <li @click="filterInvoices">Paid</li>
            <li @click="filterInvoices">Clear Filter</li>
          </ul>
        </div>
        <!-- end filter -->
        <!-- start button -->
        <div @click="newInvoice" class="button flex">
          <div class="inner-button flex">
            <img src="@/assets/icon-plus.svg" alt="">
          </div>
          <span>New Invoice</span>
        </div>
        <!-- end button -->
      </div>
      <!-- end right -->
    </div>
    <!-- Invoices -->
    <div v-if="invoiceData.length > 0">
      <Invoice v-for="invoice in filteredData" :key="invoice.docId" :invoice="invoice"/>
    </div>
    <div class="empty flex flex-column" v-else>
      <img src="@/assets/illustration-empty.svg" alt="">
      <h3>There is nothing here</h3>
      <p>Create a new invoice by clicking the New Invoice button and get started</p>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Invoice from '@/components/Invoice.vue'
export default {
  name: 'Home',
  data () {
    return {
      filterMenu: null,
      filteredInvoices: null
    }
  },
  methods: {
    ...mapMutations(['TOGGLE_INVOICE']),
    toggleFilterMenu () {
      this.filterMenu = !this.filterMenu
    },
    newInvoice () {
      this.TOGGLE_INVOICE()
    },
    filterInvoices (e) {
      if (e.target.innerText === 'Clear Filter') {
        this.filteredInvoices = null
        return
      }
      this.filteredInvoices = e.target.innerText
    }
  },
  computed: {
    ...mapState(['invoiceData']),
    filteredData () {
      return this.invoiceData.filter(item => {
        switch (this.filteredInvoices) {
          case 'Draft': return item.invoiceDraft === true
          case 'Paid': return item.invoicePaid === true
          case 'Pending': return item.invoicePending === true
        }
        return item
      })
    }
  },
  components: { Invoice }
}
</script>

<style lang="scss">
.home{
  color: #303030;

  .header{
    margin-bottom: 65px;

    .left,
    .right{
      flex: 1;
    }

    .right{
      justify-content: flex-end;
      align-items: center;

      .button,
      .filter{
        align-items: center;

        span {
          font-size: 12px;
        }
      }

      .filter{
        cursor: pointer;
        position: relative;
        margin-right: 40px;

        // span,
        // img{
        //   pointer-events: none;
        // }

        img{
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }

        .filter-menu{
          position: absolute;
          width: 120px;
          top: 25px;
          list-style: none;
          background-color: #a1a1a1;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

          li{
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;
            color: #fff;

            &:hover{
              color: #000;
              background-color: #fff;
            }
          }
        }
      }

      .button{
        padding: 8px 10px;
        background-color: #f32;
        border-radius: 40px;

        .inner-button{
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: #fefefe;
          img {
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }

  .empty {
    margin-top: 160px;
    align-items: center;

    img {
      width: 214px;
      height: 200px;
    }

    h3 {
      font-size: 20px;
      margin-top: 40px;
    }

    p {
      text-align: center;
      max-width: 224px;
      font-size: 12px;
      font-weight: 300;
      margin-top: 16px;
    }
  }
}
</style>
