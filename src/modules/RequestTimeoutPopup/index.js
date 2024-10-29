var RequestTimeoutPopup = ""

const setRef = (ref) => {
    RequestTimeoutPopup = ref
}

const getRef = (data) => {
    RequestTimeoutPopup.onShowAlert(data)
}

const isVisible=()=> RequestTimeoutPopup.isVisible()
export default {
    setRef,
    getRef,
    isVisible
}