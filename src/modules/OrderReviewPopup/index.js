var OrderReviewPopup = ""

const setRef = (ref) => {
    OrderReviewPopup = ref
}

const getRef = (data) => {
    OrderReviewPopup.onShowAlert(data)
}

const isVisible = () => OrderReviewPopup.isVisible()
export default {
    setRef,
    getRef,
    isVisible
}