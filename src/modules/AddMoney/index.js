var AddMoney = ""

const setRef = (ref) => {
    AddMoney = ref
}

const getRef = (data) => {
    AddMoney.onShowAlert(data)
}

const isVisible=()=> AddMoney.isVisible()

export default {
    setRef,
    getRef,
    isVisible
}