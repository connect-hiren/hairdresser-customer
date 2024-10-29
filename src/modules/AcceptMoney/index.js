var AcceptMoney = ""

const setRef = (ref) => {
    AcceptMoney = ref
}

const getRef = (data) => {
    AcceptMoney.onShowAlert(data)
}

const isVisible=()=> AcceptMoney.isVisible()

export default {
    setRef,
    getRef,
    isVisible
}