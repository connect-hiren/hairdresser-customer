var ErrorAlert = ""

const setRef = (ref) => {
    ErrorAlert = ref
}

const getRef = (data) => {
    ErrorAlert.onShowAlert(data)
}

const isVisible=()=> ErrorAlert.isVisible();

export default {
    setRef,
    getRef,
    isVisible
}