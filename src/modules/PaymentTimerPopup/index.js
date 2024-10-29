var PaymentTimerPopup = ""

const setRef = (ref) => {
    PaymentTimerPopup = ref
}

const getRef = (data) => {
    PaymentTimerPopup.onShowAlert(data)
}

const hideRef= (data) => {
    PaymentTimerPopup.onHidePop(false)
}
const isVisible=()=> PaymentTimerPopup.isVisible()

export default {
    setRef,
    getRef,
    hideRef,
    isVisible
}