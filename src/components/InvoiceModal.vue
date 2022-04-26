<template>
  <div @click="checkClick" class="invoice-wrap flex flex-column" ref="invoiceWrap">
    <form @submit.prevent="submitForm" class="invoice-content">
      <Loading v-show='loading'/>
      <h1 v-if="!editInvoice">New Invoice</h1>
      <h1 v-else>Edit Invoice</h1>

      <!-- Bill From -->
      <div class="bill-from flex flex-column">
        <h4>Bill From</h4>
        <div class="input flex flex-column">
          <label for="billerStreetAddress">Street Address</label>
          <input required type="text" id="billerStreetAddress" v-model="billerStreetAddress">
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="billerCity">City</label>
            <input required type="text" id="billerCity" v-model="billerCity">
          </div>
          <div class="input flex flex-column">
            <label for="billerZipCode">Zip Code</label>
            <input required type="text" id="billerZipCode" v-model="billerZipCode">
          </div>
          <div class="input flex flex-column">
            <label for="billerCountry">Country</label>
            <input required type="text" id="billerCountry" v-model="billerCountry">
          </div>
        </div>
      </div>

      <!-- Bill To -->
      <div class="bill-to flex flex-column">
        <h4>Bill To</h4>
        <div class="input flex flex-column">
          <label for="clientName">Client's Name</label>
          <input required type="text" id="clientName" v-model="clientName">
        </div>
        <div class="input flex flex-column">
          <label for="clientEmail">Client's Email</label>
          <input required type="text" id="clientEmail" v-model="clientEmail">
        </div>
        <div class="input flex flex-column">
          <label for="clientStreetAddress">Street Address</label>
          <input required type="text" id="clientStreetAddress" v-model="clientStreetAddress">
        </div>
        <div class="location-details flex">
          <div class="input flex flex-column">
            <label for="clientCity">City</label>
            <input required type="text" id="clientCity" v-model="clientCity">
          </div>
          <div class="input flex flex-column">
            <label for="clientZipCode">Zip Code</label>
            <input required type="text" id="clientZipCode" v-model="clientZipCode">
          </div>
          <div class="input flex flex-column">
            <label for="clientCountry">Country</label>
            <input required type="text" id="clientCountry" v-model="clientCountry">
          </div>
        </div>
      </div>

      <!-- Invoice Work Details -->
      <div class="invoice-work flex flex-column">
        <div class="payment flex">
          <div class="input flex flex-column">
            <label for="invoiceDate">Invoice Date</label>
            <input disabled type="text" id="invoiceDate" v-model="invoiceDate">
          </div>
          <div class="input flex flex-column">
            <label for="paymentDueDate">Payment Due Date</label>
            <input disabled type="text" id="paymentDueDate" v-model="paymentDueDate">
          </div>
        </div>
        <div class="input flex flex-column">
          <label for="paymentTerms">Payment Terms</label>
          <select required type="text" id="paymentTerms" v-model="paymentTerms">
            <option value="30">Net 30 days</option>
            <option value="60">Net 60 days</option>
          </select>
        </div>
        <div class="input flex flex-column">
          <label for="productDescription">Product Description</label>
          <input required type="text" id="productDescription" v-model="productDescription">
        </div>
        <div class="work-items">
          <h3>Item List</h3>
          <table class="item-list">
            <tr class="table-heading flex">
              <th class="item-name">Item Name</th>
              <th class="qty">Qty</th>
              <th class="price">Price</th>
              <th class="total">Total</th>
            </tr>
            <tr class="table-items flex" v-for="(item, index) in invoiceItemList" :key="index">
              <td class="item-name"><input type="text" v-model="item.itemName"></td>
              <td class="qty"><input type="text" v-model="item.qty"></td>
              <td class="price"><input type="text" v-model="item.price"></td>
              <td class="total">${{item.total = item.qty * item.price}}</td>
              <img @click="deleteInvoiceItem(item.id)" src="@/assets/icon-delete.svg" alt="">
            </tr>
          </table>
          <div @click="addNewInvoiceItem" class="button flex">
            <img src="@/assets/icon-plus.svg" alt="">
            Add New Item
          </div>
        </div>
      </div>

      <!-- Save & Exit -->
      <div class="save flex">
        <div class="left">
          <button type="button" @click="closeInvoice" class="red">Cancel</button>
        </div>
        <div class="right flex">
          <button v-if="!editInvoice" type="submit" @click="saveDraft" class="blue">Save Draft</button>
          <button v-if="!editInvoice" type="submit" @click="publishInvoice" class="green">Create Invoice</button>
          <button v-if="editInvoice" type="submit" @click="updateInvoice" class="blue">Update Invoice</button>
        </div>
      </div>

    </form>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
import { uid } from 'uid'
import db from '@/firebase/init'
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore'
import Loading from './Loading.vue'

export default {
  name: 'InvoiceModal',
  data () {
    return {
      dateOptions: { year: 'numeric', month: 'short', day: 'numeric' },
      docId: null,
      loading: null,
      billerStreetAddress: null,
      billerCity: null,
      billerZipCode: null,
      billerCountry: null,
      clientName: null,
      clientEmail: null,
      clientStreetAddress: null,
      clientCity: null,
      clientZipCode: null,
      clientCountry: null,
      invoiceDateUnix: null,
      invoiceDate: null,
      paymentTerms: null,
      paymentDueDateUnix: null,
      paymentDueDate: null,
      productDescription: null,
      invoicePending: null,
      invoiceDraft: null,
      invoiceItemList: [],
      invoiceTotal: 0
    }
  },
  methods: {
    ...mapMutations(['TOGGLE_INVOICE', 'TOGGLE_MODAL', 'TOGGLE_EDIT_INVOICE']),
    ...mapActions(['UPDATE_INVOICE', 'GET_INVOICES']),
    checkClick (e) {
      if (e.target === this.$refs.invoiceWrap) {
        this.TOGGLE_MODAL()
      }
    },
    submitForm () {
      if (this.editInvoice) {
        this.updateInvoice()
      } else {
        this.uploadInvoice()
      }
    },
    deleteInvoiceItem (id) {
      this.invoiceItemList = this.invoiceItemList.filter(item => item.id !== id)
    },
    addNewInvoiceItem () {
      this.invoiceItemList.push({
        id: uid(),
        itemName: '',
        qty: '',
        price: 0,
        total: 0
      })
    },
    closeInvoice () {
      this.TOGGLE_INVOICE()
      if (this.editInvoice) {
        this.TOGGLE_EDIT_INVOICE()
      }
    },
    saveDraft () {
      this.invoiceDraft = true
    },
    publishInvoice () {
      this.invoicePending = true
    },
    calcInvoiceTotal () {
      this.invoiceTotal = 0
      this.invoiceItemList.forEach(element => {
        this.invoiceTotal += element.total
      })
    },
    async uploadInvoice () {
      if (this.invoiceItemList.length <= 0) {
        alert('Please ensure you filled out work items')
        return
      }

      this.loading = true

      this.calcInvoiceTotal()
      // const database = getDocs(collection(db, 'invoices'))
      const data = {
        invoiceId: uid(6),
        billerStreetAddress: this.billerStreetAddress,
        billerCity: this.billerCity,
        billerZipCode: this.billerZipCode,
        billerCountry: this.billerCountry,
        clientName: this.clientName,
        clientEmail: this.clientEmail,
        clientStreetAddress: this.clientStreetAddress,
        clientCity: this.clientCity,
        clientZipCode: this.clientZipCode,
        clientCountry: this.clientCountry,
        invoiceDate: this.invoiceDate,
        invoiceDateUnix: this.invoiceDateUnix,
        paymentTerms: this.paymentTerms,
        paymentDueDate: this.paymentDueDate,
        paymentDueDateUnix: this.paymentDueDateUnix,
        productDescription: this.productDescription,
        invoiceItemList: this.invoiceItemList,
        invoiceTotal: this.invoiceTotal,
        invoicePending: this.invoicePending,
        invoiceDraft: this.invoiceDraft,
        invoicePaid: null
      }
      await setDoc(doc(collection(db, 'invoices')), data)

      this.loading = false

      this.TOGGLE_INVOICE()
      this.GET_INVOICES()
    },
    async updateInvoice () {
      if (this.invoiceItemList.length <= 0) {
        alert('Please ensure you filled out work items')
        return
      }

      this.loading = true

      this.calcInvoiceTotal()
      // const database = getDocs(collection(db, 'invoices'))
      const data = {
        billerStreetAddress: this.billerStreetAddress,
        billerCity: this.billerCity,
        billerZipCode: this.billerZipCode,
        billerCountry: this.billerCountry,
        clientName: this.clientName,
        clientEmail: this.clientEmail,
        clientStreetAddress: this.clientStreetAddress,
        clientCity: this.clientCity,
        clientZipCode: this.clientZipCode,
        clientCountry: this.clientCountry,
        paymentTerms: this.paymentTerms,
        paymentDueDate: this.paymentDueDate,
        paymentDueDateUnix: this.paymentDueDateUnix,
        productDescription: this.productDescription,
        invoiceItemList: this.invoiceItemList,
        invoiceTotal: this.invoiceTotal
      }
      await updateDoc(doc(db, 'invoices', this.docId), data)

      this.loading = false

      this.UPDATE_INVOICE({ docId: this.docId, routeId: this.$route.params.invoiceId })
    }
  },
  components: {
    Loading
  },
  computed: {
    ...mapState(['editInvoice', 'currentInvoice'])
  },
  created () {
    if (!this.editInvoice) {
      // get current date for invoice date field
      this.invoiceDateUnix = Date.now()
      this.invoiceDate = new Date(this.invoiceDateUnix).toLocaleDateString('en-us', this.dateOptions)
    }

    if (this.editInvoice) {
      this.docId = this.currentInvoice.docId
      this.billerStreetAddress = this.currentInvoice.billerStreetAddress
      this.billerCity = this.currentInvoice.billerCity
      this.billerZipCode = this.currentInvoice.billerZipCode
      this.billerCountry = this.currentInvoice.billerCountry
      this.clientName = this.currentInvoice.clientName
      this.clientEmail = this.currentInvoice.clientEmail
      this.clientStreetAddress = this.currentInvoice.clientStreetAddress
      this.clientCity = this.currentInvoice.clientCity
      this.clientZipCode = this.currentInvoice.clientZipCode
      this.clientCountry = this.currentInvoice.clientCountry
      this.invoiceDateUnix = this.currentInvoice.invoiceDateUnix
      this.invoiceDate = this.currentInvoice.invoiceDate
      this.paymentTerms = this.currentInvoice.paymentTerms
      this.paymentDueDateUnix = this.currentInvoice.paymentDueDateUnix
      this.paymentDueDate = this.currentInvoice.paymentDueDate
      this.productDescription = this.currentInvoice.productDescription
      this.invoicePending = this.currentInvoice.invoicePending
      this.invoiceDraft = this.currentInvoice.invoiceDraft
      this.invoiceItemList = this.currentInvoice.invoiceItemList
      this.invoiceTotal = this.currentInvoice.invoiceTotal
    }
  },
  watch: {
    'paymentTerms' (newValue) {
      const futureDate = new Date()
      this.paymentDueDateUnix = futureDate.setDate(futureDate.getDate() + parseInt(this.paymentTerms))
      this.paymentDueDate = new Date(this.paymentDueDateUnix).toLocaleDateString('en-us', this.dateOptions)
    }
    // payment: {
    //   handler () {
    //     const futureDate = new Date()
    //     this.payment.dueDateUnix = futureDate.setDate(futureDate.getDate() + parseInt(this.payment.terms))
    //   },
    //   deep: true
    // }
  }
}
</script>

<style lang="scss">
.invoice-wrap{
  position: fixed;
  top: 0;
  left: 0;
  background-color: transparent;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  @media(min-width: 900px){
    left: 90px;
  }

  .invoice-content{
    position: relative;
    padding: 56px;
    max-width: 700px;
    width: 100%;
    background-color: #e1e1e1;
    color: #606060;
    box-shadow: 10px 4px 6px -1px rgba(0, 0, 0, .2), o 2px 4px -1px rgba(0, 0, 0, .06);
    border-right: 1px solid #a1a1a1;
    border-radius: 8px;

    h1{
      margin-bottom: 48px;
      color: #505050;
    }

    h3{
      margin-bottom: 16px;
      font-size: 18px;
      color: #505050;
    }

    h4{
      color: #3276FF;
      font-size: 12px;
      margin-bottom: 24px;
    }

    // Bill To/From
    .bill-to,
    .bill-from{
      margin-bottom: 48px;

      .location-details{
        gap: 16px;
        div{
          flex: 1;
        }
      }
    }

    // Invoice work
    .invoice-work{
      .payment{
        gap: 24px;
        div{
          flex: 1;
        }
      }

      .work-items{
        .item-list{
          width: 100%;

          // Item table
          .table-heading,
          .table-items{
            gap: 16px;
            font-size: 12px;

            .item-name{
              flex-basis: 50%;
            }
            .qty{
              flex-basis: 10%;
            }
            .price{
              flex-basis: 20%;
            }
            .total{
              flex-basis: 20%;
              align-items: center;
            }
          }

          .table-heading{
            margin-bottom: 16px;

            th{
              text-align: left;
            }
          }

          .table-items{
            position: relative;
            margin-bottom: 24px;

            img{
              position: absolute;
              top: 15px;
              right: 0;
              width: 12px;
              height: 16px;
            }
          }
        }

        .button{
          color: #505050;
          background-color: #fff;
          align-items: center;
          justify-content: center;
          width: 100%;

          img{
            margin-right: 4px;
          }
        }
      }
    }

    .save{
      margin-top: 60px;

      div{
        flex: 1;
      }

      .right{
        justify-content: flex-end;
      }
    }
  }

  .input{
    margin-bottom: 24px;
  }

  label{
    font-size: 12px;
    margin-bottom: 6px;
  }

  input,
  select{
    width: 100%;
    background: #a1a1a1;
    padding: 2px;
    border: 1px solid #ec5757;
    border-radius: 5px;

    &:focus{
      border: 0;
      outline: none;
    }
  }
}
</style>
