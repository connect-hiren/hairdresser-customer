var DisputePopup = ""

const setRef = (ref) => {
    DisputePopup = ref
}

const getRef = (data) => {
    DisputePopup.onShowAlert(data)
}

const isVisible = () => DisputePopup.isVisible()
export default {
    setRef,
    getRef,
    isVisible
}