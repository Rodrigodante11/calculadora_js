class CalcController {

    constructor(){
        this._audio= new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';

        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoard();  // eventos de teclado

    }

    pasteFromClipBoard(){

        document.addEventListener('paste' , e=>{

            let text= e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(Text);
            
        });

    }
    copyToClipBoard(){  //Ctrl + c  Ctrl + v
        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("copy");

        input.remove();
    }
    initialize(){

        this.setDisplayDateTime()

        setInterval(()=>{

            this.setDisplayDateTime();

        }, 1000); //para a contagem os segundos

        this.setLastNumberToDisplay();  //atualizando display
        this.pasteFromClipBoard();

        document.querySelectorAll('.btn-ac').forEach(btn => {  //ativando som com diplo click no 'ac'
            btn.addEventListener('dblclick', e=>{

                this.toggleAudio();

            });
        });
    }

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff;

    }

    playAudio(){
        if(this._audioOnOff){

            this._audio.currentTime = 0;
            this._audio.play();

        }
    }

    initKeyBoard(){  // eventos de teclado
        document.addEventListener('keyup', e =>{
            this.playAudio();

            //console.log(e.key);

            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;
    
                case 'Backspace':
                    this.clearEntry();
                    break;
    
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;
    
                case 'Enter':
                case '=':
                    this.calc();
                    break;
    
                case '.':
                case ',':
                    this.addDot();
                    break;
    
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
                    this.addOperation(parseInt(e.key));
                    break;
                
                case 'c': //digitou c
                    if(e.ctrlKey){  // o ctrl esta apertado quando apertou 'c'
                        this.copyToClipBoard()
                    }
                break;
    
            }

        });
    }

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event => {  //pegando um evento por vez e epradando pelo split

            element.addEventListener(event, fn, false);  // o false para nao ter risco de ter duplo click / dois eventos

        })
    
    }

    clearAll(){

        this._operation = [];  //zerou o array
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();  //atualizando display

    }

    clearEntry(){

        this._operation.pop();  // tirando o ultimo valor d array

        this.setLastNumberToDisplay(); //atualizando display

    }

    getLastOperation(){

        return this._operation[this._operation.length-1];

    }

    setLastOperation(value){

        this._operation[this._operation.length-1] = value;

    }

    isOperator(value){  // verificando se é operador (+,-,*,/)

        return (['+', '-', '*', '%', '/'].indexOf(value) > -1); // se for -1 quer dizer que nao achou ae retorna false | se achar entre 0 e 4 vai retorna True dizendo qu achou

    }

    pushOperation(value){

        this._operation.push(value);  //colocndo ultimo  valor

        if (this._operation.length > 3) {  // verificando se tem 3 elementos no array para calcular

            this.calc();

        }

    }

    getResult(){

        try{
            return eval(this._operation.join(""));  //eval() faz operações reconhecendo a string ex "5""+""10"
        }catch(e){
            setTimeout(()=>{
                this.setError();
            },1 );  
        }

    }

    calc(){  //calcular as 3 ja feitas

        let last = '';
        
        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];

            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if (this._operation.length > 3) {

            last = this._operation.pop();

            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);

        }
        
        let result = this.getResult();

        if (last == '%') {

            result /= 100;

            this._operation = [result];

        } else {

            this._operation = [result];  //colando o calculo feito de volta na string com o ultimo digitado

            if (last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();  //atualizando display

    }

    getLastItem(isOperator = true){  //true pega operador | false pega o ultimo numero

        let lastItem;

        for (let i = this._operation.length-1; i >= 0; i--){

            if (this.isOperator(this._operation[i]) == isOperator) {  // se  é um operador
    
                lastItem = this._operation[i];  //achei o numero
    
                break;
    
            }

        }

        if (!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;

    }

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;  // colocando zero na hora de limpar

        this.displayCalc = lastNumber;

    }

    addOperation(value){

        //console.log('A',value,isNaN(this.getLastOperation()));

        if (isNaN(this.getLastOperation())) { // verificando se nao é um numero

            if (this.isOperator(value)) {  // if(é um operador)  trocando o operador caso o usuario troque ex: aperta + depois -

                this.setLastOperation(value);  // trocando o operador pelo novo

            } else {  //é um numero

                this.pushOperation(value);

                this.setLastNumberToDisplay();
            }

        } else {   // se for numero entra aqui

            if (this.isOperator(value)){

                this.pushOperation(value);

            } else {

                let newValue = this.getLastOperation().toString() + value.toString();

                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();  //atualizar display
            }
        }
    }

    setError(){

        this.displayCalc = "Error";
        
    }

    addDot(){
        let lastOperation=this.getLastOperation();  
        
        if(typeof lastOperation ===  'string' && lastOperation.split('').indexOf('.') >-1) return;  //PROCURANDO SE JA TEM PONTO 

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
        console.log()
    }

    execBtn(value){
        this.playAudio();

        switch (value) {

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+');
                break;

            case 'subtracao':
                this.addOperation('-');
                break;

            case 'divisao':
                this.addOperation('/');
                break;

            case 'multiplicacao':
                this.addOperation('*');
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot();
                break;

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
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;

        }

    }

    initButtonsEvents(){

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index)=>{

            this.addEventListenerAll(btn, "click drag", e => {

                let textBtn = btn.className.baseVal.replace("btn-",""); //capturando o botao apertado

                this.execBtn(textBtn);  //vai enviar qual botao foi apertado

            })

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {

                btn.style.cursor = "pointer";

            })

            // metodo do proprio Js abaixo e em cima criou um metodo para pegar mais de um evento
            //btn.addEventListener('click ', e=>{
            //    console.log(btn.className.baseVal.replace("btn-",""));
            //});

        })

    }

    setDisplayDateTime(){

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, { //data personalizada
            day: "2-digit",  //dia personalizada
            month: "long",   //mes personalizada
            year: "numeric"  //ano personalizada
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    }

    get displayTime(){

        return this._timeEl.innerHTML;

    }

    set displayTime(value){

        return this._timeEl.innerHTML = value;

    }

    get displayDate(){

        return this._dateEl.innerHTML;

    }

    set displayDate(value){

        return this._dateEl.innerHTML = value;

    }

    get displayCalc(){

        return this._displayCalcEl.innerHTML;

    }

    set displayCalc(value){

        if(value.toString().length > 10){
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;

    }

    get currentDate(){

        return new Date();

    }

    set currentDate(value){

        this._currentDate = value;

    }

}