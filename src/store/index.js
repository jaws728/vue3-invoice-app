import { createStore } from 'vuex'
import db from '@/firebase/init'
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'

export default createStore({
  state: {
    invoiceModal: null,
    modalActive: null,
    invoiceData: [],
    invoicesLoaded: null,
    currentInvoice: null,
    editInvoice: null
  },
  getters: {},
  mutations: {
    TOGGLE_INVOICE (state) {
      state.invoiceModal = !state.invoiceModal
    },
    TOGGLE_MODAL (state) {
      state.modalActive = !state.modalActive
    },
    SET_INVOICE_DATA (state, payload) {
      state.invoiceData.push(payload)
    },
    INVOICES_LOADED (state) {
      state.invoicesLoaded = true
      // console.log(state.invoiceData)
    },
    SET_CURRENT_INVOICE (state, payload) {
      // state.currentInvoice = state.invoiceData.filter(item => item.invoiceId === payload)
      state.currentInvoice = state.invoiceData.find(item => item.invoiceId === payload)
    },
    TOGGLE_EDIT_INVOICE (state) {
      state.editInvoice = !state.editInvoice
    },
    DELETE_INVOICE (state, payload) {
      state.invoiceData = state.invoiceData.filter(invoice => invoice.docId !== payload)
    },
    UPDATE_STATUS_TO_PAID (state, payload) {
      state.invoiceData.forEach(item => {
        if (item.docId === payload) {
          item.invoicePaid = true
          item.invoicePending = false
        }
      })
    },
    UPDATE_STATUS_TO_PENDING (state, payload) {
      state.invoiceData.forEach(item => {
        if (item.docId === payload) {
          item.invoicePaid = false
          item.invoicePending = true
          item.invoiceDraft = false
        }
      })
    }
  },
  actions: {
    async GET_INVOICES ({ commit, state }) {
      const docs = await getDocs(collection(db, 'invoices'))
      docs.forEach(d => {
        if (!state.invoiceData.some(item => item.docId === d.id)) {
          const data = {
            docId: d.id,
            invoiceId: d.data().invoiceId,
            billerStreetAddress: d.data().billerStreetAddress,
            billerCity: d.data().billerCity,
            billerZipCode: d.data().billerZipCode,
            billerCountry: d.data().billerCountry,
            clientName: d.data().clientName,
            clientEmail: d.data().clientEmail,
            clientStreetAddress: d.data().clientStreetAddress,
            clientCity: d.data().clientCity,
            clientZipCode: d.data().clientZipCode,
            clientCountry: d.data().clientCountry,
            invoiceDateUnix: d.data().invoiceDateUnix,
            invoiceDate: d.data().invoiceDate,
            paymentTerms: d.data().paymentTerms,
            paymentDueDateUnix: d.data().paymentDueDateUnix,
            paymentDueDate: d.data().paymentDueDate,
            productDescription: d.data().productDescription,
            invoiceItemList: d.data().invoiceItemList,
            invoiceTotal: d.data().invoiceTotal,
            invoicePending: d.data().invoicePending,
            invoiceDraft: d.data().invoiceDraft,
            invoicePaid: d.data().invoicePaid
          }
          commit('SET_INVOICE_DATA', data)
        }
      })
      commit('INVOICES_LOADED')
    },
    async UPDATE_INVOICE ({ commit, dispatch }, { docId, routeId }) {
      commit('DELETE_INVOICE', docId)
      await dispatch('GET_INVOICES')
      commit('TOGGLE_INVOICE')
      commit('TOGGLE_EDIT_INVOICE')
      commit('SET_CURRENT_INVOICE', routeId)
    },
    async DELETE_INVOICE ({ commit }, docId) {
      await deleteDoc(doc(db, 'invoices', docId))
      commit('DELETE_INVOICE', docId)
    },
    async UPDATE_STATUS_TO_PAID ({ commit }, docId) {
      await updateDoc(doc(db, 'invoices', docId), {
        invoicePaid: true,
        invoicePending: false
      })
      commit('UPDATE_STATUS_TO_PAID', docId)
    },
    async UPDATE_STATUS_TO_PENDING ({ commit }, docId) {
      await updateDoc(doc(db, 'invoices', docId), {
        invoicePaid: false,
        invoicePending: true,
        invoiceDraft: false
      })
      commit('UPDATE_STATUS_TO_PENDING', docId)
    }
  },
  modules: {}
})
