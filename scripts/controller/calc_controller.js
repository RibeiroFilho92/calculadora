class CalcController {

    constructor() {

        this.audio = new Audio('click.mp3')
        this.audioOnOff = false
        this.lastOperator = ''
        this.lastNumber = ''
        this.operation = []
        this.locale = 'pt-BR'
        this.displayCalcEl = document.querySelector('#display')
        this.dateEl = document.querySelector('#data')
        this.timeEl = document.querySelector('#hora') 
        this.currentDate
        this.initButtonsEvents()
        this.initialize()
        this.initKeyboard()

    }

    pasteFromClipbeard() {

        document.addEventListener('paste', event => {

            let text = event.clipboardData.getData('Text')
            this.displayCalc = parseFloat(text)

        })
    }

    copyToClipBoard() {
        
        let input = document.createElement('input')
        input.value = this.displayCalc

        document.body.appendChild(input)

        input.select()

        document.execCommand('Copy')

        input.remove()
    }

    initialize() {

        this.setDysplayTimeOut() 

        setInterval(() => {
            this.setDysplayTimeOut() 
        }, 1000)

        this.setLastNumberToDisplay()
        this.pasteFromClipbeard()

        document.querySelectorAll('.btn-ac').forEach(btn => {

            btn.addEventListener('dblclick', event => {

                this.toggleAudio()

            })
        })
    }

    toggleAudio() {

        this.audioOnOff = !this.audioOnOff

    }

    playAudio() {

        if(this.audioOnOff) {
            
            this.audio.currentTime = 0
            this.audio.play()

        }

    }

    initKeyboard() {

        document.addEventListener('keyup', event => {

            this.playAudio()

            switch(event.key) {
                case 'Escape':
                    this.clearAll()
                    break
                case 'Backspace':
                    this.clearEntry()
                    break
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(event.key)
                    break
                case 'Enter':
                case '=':
                    this.calc()
                    break
                case '.':
                case ',':
                    this.addDot()
                    break
                
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(event.key))
                    break
                case 'c':
                    if(event.ctrlKey) this.copyToClipBoard()
                    break
            }    
        })
    }    

    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach(evento => {
            
            element.addEventListener(evento, fn, false)

        })

    }

    clearAll() {

        this.operation = []
        this.lastNumber = ''
        this.lastOperator = ''
        this.setLastNumberToDisplay()

    }

    clearEntry() {

        this.operation.pop()
        this.setLastNumberToDisplay()

    }

    getLastOperation() {

        return this.operation[this.operation.length - 1]

    }

    setError() {

        this.displayCalc = "Erro"

    }

    addDot() {

        let lastOperation = this.getLastOperation()

        if(typeof lastOperation === 'string' && this.lastOperation.split('').indexOf('.') > -1) return

        if( this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.')
        } else {
            this.setLastOperation(lastOperation.toString() + '.')
        }

        this.setLastNumberToDisplay()

    }

    isOperator(value) {

        return (['+', '-', '*', '%', '/'].indexOf(value) > -1) 
 
    }

    setLastOperation(value) {

        this.operation[this.operation.length - 1] = value

    }

    pushOperator(value) {

        this.operation.push(value)

        if(this.operation.length > 3) {

            this.calc()

        }

    }

    getResult() {

        try {
            return eval(this.operation.join(""))
        } catch (e) {
            this.setError()
        } 
        
    }

    calc() {

        let last = ''
        this.lastOperator = this.getLastItem()

        if (this.operation.length < 3) {

            let firstItem = this.operation[0]
            this.operation = [firstItem, this.lastOperator, this.lastNumber]
        }

        if (this.operation.length > 3) {

            last = this.operation.pop()
            this.lastNumber = this.getResult()

        } else if(this.operation.length == 3) {

            this.lastNumber = this.getLastItem(false)
        }

        let result = this.getResult()

        if (last == "%") {

            result /= 100

            this.operation = [result]

        } else {

            this.operation = [result]
            if (last) this.operation.push(last)

        }

        this.setLastNumberToDisplay()
    }

    getLastItem(isOperator = true) {

        let lastItem

        for(let i = this.operation.length - 1; i >=0; i--) {
            if(this.isOperator(this.operation[i]) == isOperator) {
                lastItem = this.operation[i]
                break;
            }
        }    

        if(!lastItem) {

            lastItem = (isOperator) ? this.lastOperator : this.lastNumber

        }

        return lastItem
    }

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false)

        if (!lastNumber) lastNumber = 0

        this.displayCalc = lastNumber

    }

    pushOperation(value) {
        this.operation.push(value)

        if(this.operation.length > 3) {
            this.calc()
        }
    }

    addOperation(value) {

        if(isNaN(this.getLastOperation())) {

            if(this.isOperator(value)) {

                this.setLastOperation(value)

            } else {

                this.operation.push(value)
                this.setLastNumberToDisplay();

            }

        } else {

            if(this.isOperator(value)) {

                this.pushOperation(value)

            } else {

                let newValue = this.getLastOperation().toString() + value.toString()
                this.setLastOperation(newValue)

                this.setLastNumberToDisplay();

            }
        }
    }

    execBtn(value) {

        this.playAudio()

        switch(value) {
            case 'ac':
                this.clearAll()
                break
            case 'ce':
                this.clearEntry()
                break
            case 'soma':
                this.addOperation('+')
                break
            case 'subtracao':
                this.addOperation('-')
                break
            case 'divisao':
                this.addOperation('/')
                break
            case 'multiplicacao':
                this.addOperation('*')
                break
            case 'porcento':
                this.addOperation('%')
                break
            case 'igual': 
                this.calc()
                break
            case 'ponto':
                this.addDot()
                break
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value))
                break
            default:
                this.setError()
                break
        }
    }

    initButtonsEvents() {

       let buttons =  document.querySelectorAll('#buttons > g, #parts > g')

       buttons.forEach((btn, index) => {
        
            this.addEventListenerAll(btn, 'click drag', event => {

               let textBtn = btn.className.baseVal.replace("btn-", "")

               this.execBtn(textBtn)

            })

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", event => {

                btn.style.cursor = "pointer"

            })
 
       })
    }

    setDysplayTimeOut() {
        this.displayDate = this.currentDate.toLocaleDateString(this.locale)
        this.displayTime = this.currentDate.toLocaleTimeString(this.locale)
    }

    get displayTime() {
        return this.timeEl.innerHTML
    }

    set displayTime(value) {
        this.timeEl.innerHTML = value
    }

    get displayDate() {
        return this.dateEl.innerHTML
    }

    set displayDate(value) {
        this.dateEl.innerHTML = value
    }

    get displayCalc() {
        return this.displayCalcEl.innerHTML
    }

    set displayCalc(value) {

        if(value.toString().length > 10) {
            this.setError()
            return false
        }

        this.displayCalcEl.innerHTML = value
    }

    get currentDate() {
        return new Date()
    }

    set currentDate(value) {
        this.currentDate = value
    }
    
}