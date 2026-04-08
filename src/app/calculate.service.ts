import { Injectable } from '@angular/core';
import { NumericalService } from './numerical.service';

type Operator = "+" | "-" | "*" | "/" | null;

@Injectable({
  providedIn: 'root',
})

export class CalculateService {
  private currentNum:bigint | null = null;
  private currentStr: string = "";
  private previousNum:bigint | null = null;
  private storedValue:bigint | null = null;
  private operator:Operator = null;
  private lastOperator:Operator = null;
  private getDecimal:number | null = null;

  constructor(private numerical: NumericalService){}
  
  log(){
    console.log(`currentNum: ${this.numerical.toFormat(this.currentNum)}`)
    console.log(`currentStr: ${this.currentStr}`)
    console.log(`previousNum: ${this.numerical.toFormat(this.previousNum)}`)
    console.log(`storedValue: ${this.numerical.toFormat(this.storedValue)}`)
    console.log(`operator: ${this.operator}`)
    console.log(`lastOperator: ${this.lastOperator}`);
    console.log("--------------------------------");
  }
  
  inputNumber(number: string): string {
    if (this.numerical.formatError){
      this.allClear();
    }
    if (this.getDecimal === null){
      if (this.currentStr.length < 10){
        this.currentStr += number;
      }
    }else{
      if (this.getDecimal < 8){
        this.currentStr += number;
        this.getDecimal++;
      }
    }
    if (this.operator === "+" || this.operator === "-" || this.operator === "/"){
      this.storedValue = this.numerical.toBigInt(this.currentStr);
    }
    this.currentNum = this.numerical.toBigInt(this.currentStr);
    return this.getDecimal === null ? this.currentStr+"." : this.currentStr;
  }

  inputDot(): string{
    if (this.currentNum === null && this.currentStr === ""){
      this.currentStr = "0.";
      this.getDecimal = 0;
    }else if(this.getDecimal === null){
      this.currentStr += ".";
      this.getDecimal = 0;
    }
    return this.currentStr;
  }

  toggleSign(): bigint{
    if (this.currentNum === null){
      if (this.previousNum === null){
        return 0n;
      }
      this.previousNum = this.previousNum! * -1n;
      return this.previousNum!;
    }else{
      this.currentNum = this.currentNum * -1n;
      if (this.currentNum < 0n){
        this.currentStr = "-"+ this.currentStr;
      }else{
        if (this.currentStr.startsWith("-")){
          this.currentStr = this.currentStr.slice(1);
        }
      }
      return this.currentNum;
    }
  }

  getOperator(operator: Operator): bigint{
    if (this.currentNum === null && this.previousNum === null){
      this.lastOperator = this.operator;
      this.operator = operator;
      return 0n;
    }
    this.getDecimal = null;
    if (this.currentNum !== null){
      if (this.previousNum === null){
        this.previousNum = this.currentNum;
      }else{
        this.previousNum = this.numerical.executeOperation(this.previousNum, this.currentNum, this.operator);
      }
    }
    this.lastOperator = this.operator;
    this.operator = operator;
    if (this.operator == "*") this.storedValue = this.previousNum!;
    this.currentNum = null;
    this.currentStr = "";
    return this.previousNum!;
  }

  calculate(): bigint{
    if (this.numerical.formatError) return this.previousNum!;
    
    if (this.previousNum === null) this.previousNum = 0n;

    if (this.operator === null){
      this.operator = this.lastOperator;
      const num = this.currentNum === null ? this.previousNum! : this.currentNum!;
      switch (this.operator) {
        case "+":
        case "-":
        case "/":
          this.previousNum = this.numerical.executeOperation(num, this.storedValue!, this.operator);
          break;
        case "*":
          this.previousNum = this.numerical.executeOperation(this.storedValue!, num, this.operator);
          break;
        default:
          break;
      }

    }else{
      if (this.currentNum === null){
        switch (this.operator) {
          case "+":
          case "-":
            this.storedValue = this.previousNum!;
            this.previousNum = this.numerical.executeOperation(0n, this.storedValue!, this.operator);
            break;
          case "*":
            this.previousNum = this.numerical.executeOperation(this.previousNum!, this.storedValue!, this.operator);
            break;
          case "/":
            this.storedValue = this.previousNum!;
            this.previousNum = this.numerical.executeOperation(100000000n, this.previousNum!, this.operator);
            break;
          default:
            break;
        }
      }else{
        this.previousNum = this.numerical.executeOperation(this.previousNum!, this.currentNum!, this.operator);
      }
    }
    this.currentNum = null;
    this.currentStr = "";
    this.lastOperator = this.operator;
    this.operator = null;
    return this.previousNum!;
  }

  percentage(): bigint{
    if (this.numerical.formatError) return this.previousNum!;

    if (this.previousNum === null) return 0n;

    if (this.currentNum === null) {
      if (this.operator === null){
        switch (this.lastOperator) {
          case "+":
          case "-":
            break;
          case "*":
          case "/":
            this.previousNum = this.numerical.executeOperation(this.previousNum, this.storedValue! / 100n, this.lastOperator);
            break;
          default:
            break;
        }
        this.operator = this.lastOperator;
      }else{
        switch (this.operator) {
          case "*":
            this.previousNum = this.numerical.executeOperation(this.previousNum, this.storedValue! / 100n, this.operator);
            break;
          case "/":
            this.previousNum = this.numerical.executeOperation(100n * 100000000n, this.previousNum, this.operator);
            this.storedValue = this.previousNum;
            break;
          default:
            break;
        }
      }
    }else {
      if (this.operator === null){
        switch (this.lastOperator) {
          case "+":
          case "-":
            this.previousNum = this.numerical.executeOperation(this.previousNum, this.numerical.executeOperation(this.previousNum!, this.currentNum!/100n, "*"), this.lastOperator);
            break;
          case "*":
            this.previousNum = this.numerical.executeOperation(this.currentNum, this.storedValue! / 100n, this.lastOperator);
            break;
          case "/":
            this.previousNum = this.numerical.executeOperation(this.storedValue!, this.currentNum, "*");
            break;
          default:
            break;
        }
        this.operator = this.lastOperator;
      }else{
        switch (this.operator) {
          case "+":
          case "-":
            this.storedValue = this.previousNum;
            this.previousNum = this.numerical.executeOperation(this.previousNum, this.numerical.executeOperation(this.previousNum, this.currentNum/100n, "*"), this.operator);
            break;
          case "*":
          case "/":
            this.previousNum = this.numerical.executeOperation(this.previousNum, this.currentNum / 100n, this.operator);
            break;
          default:
            break;
        }
      }
      this.currentNum = null;
      this.currentStr = "";
    }
    this.lastOperator = this.operator;
    this.operator = null;
    return this.previousNum!;
  }

  sqrt(): bigint{
    if (this.currentNum === null && this.previousNum === null) return 0n;
    if (this.currentNum === null){
      if(this.previousNum! < 0n){
        this.numerical.formatError = true;
        return 0n;
      }
      this.previousNum = this.numerical.toBigInt(Math.sqrt(Number(this.numerical.toNumber(this.previousNum!))).toString());
    }else{
      if(this.currentNum! < 0n){
        this.numerical.formatError = true;
        return 0n;
      }
      this.currentNum = this.numerical.toBigInt(Math.sqrt(Number(this.numerical.toNumber(this.currentNum!))).toString());
      if (this.operator == "+" || this.operator == "-" || this.operator == "/") {
          this.storedValue = this.currentNum;
      }
    }
    return this.currentNum === null ? this.previousNum! : this.currentNum!;
  }

  allClear(): string{
    this.currentNum = null;
    this.currentStr = "";
    this.previousNum = null;
    this.storedValue = null;
    this.operator = null;
    this.lastOperator = null;
    this.numerical.formatError = false;
    this.getDecimal = null;
    return "";
  }

  clear(): bigint{
    if (this.numerical.formatError){
      this.numerical.formatError = false;
      return this.previousNum ?? 0n;
    }else{
      if (this.currentNum === null){
        return this.previousNum ?? 0n;
      }else{
        this.currentNum = 0n;
        this.currentStr = "";
        this.getDecimal = null;
        return this.currentNum!;
      }
    }
  }
}