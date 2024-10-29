var customAlert = ""

const setRef = (ref) => {
    customAlert = ref
}

const getRef = (data) => {
    customAlert.onShowAlert(data)
}

const isVisible=()=> customAlert.isVisible()


export default {
    setRef,
    getRef,
    isVisible
}