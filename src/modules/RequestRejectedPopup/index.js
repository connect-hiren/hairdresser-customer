var RequestRejectedPopup = ""

const setRef = (ref) => {
    RequestRejectedPopup = ref
}

const getRef = (data) => {
    RequestRejectedPopup.onShowAlert(data)
}

const isVisible= () => RequestRejectedPopup.isVisible()

export default {
    setRef,
    getRef,
    isVisible
}