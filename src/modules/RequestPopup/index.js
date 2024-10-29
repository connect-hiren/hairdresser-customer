var RequestPopup = ""

const setRef = (ref) => {
    RequestPopup = ref
}

const getRef = (data) => {
    console.log(RequestPopup,"RequestPopup");
    RequestPopup.onShowAlert(data)
}

const isVisible=()=> RequestPopup.isVisible()

const hideRef= (data) => {
    RequestPopup.onHidePop(false)
}

export default {
    setRef,
    getRef,
    hideRef,
    isVisible
}