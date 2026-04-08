import { Component} from '@angular/core';
import { CalculateService } from './calculate.service';
import { HostListener } from '@angular/core';
import { NumericalService } from './numerical.service';

type Operator = "+" | "-" | "*" | "/" | null;

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent{
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    let key = event.key;
    if (key >= '0' && key <= '9') {
      this.pressNumber(key);
    }
    if (key === '+' || key === '-' || key === '*' || key === '/') {
      this.pressOperator(key);
    }
    if (key === '=' || key === 'Enter') {
      this.pressEqual();
    }
    if (key === '.') {
      this.pressDot();
    }
    if (key === '%'){
      this.pressPercentage();
    }
    if (key === 's'){
      this.pressSqrt();
    }
    if (key === 't'){
      this.pressSign();
    }
    if (key === 'c' ||key === 'Backspace') {
      this.pressClear();
    }
    if (key === 'a' ||key === 'Delete') {
      this.pressAllClear();
    }
  }

  public display: string = "";

  constructor(private cal: CalculateService, private numerical: NumericalService){}

  log(action: string){
    console.log(`action: ${action}`);
    console.log(`currentNum: ${this.numerical.toFormat(this.cal.currentNum)}`)
    console.log(`currentStr: ${this.cal.currentStr}`)
    console.log(`previousNum: ${this.numerical.toFormat(this.cal.previousNum)}`)
    console.log(`storedValue: ${this.numerical.toFormat(this.cal.storedValue)}`)
    console.log(`operator: ${this.cal.operator}`)
    console.log(`lastOperator: ${this.cal.lastOperator}`);
    console.log("--------------------------------");
  }

  displayError(): string{
    if (this.numerical.formatError){
      return "E";
    }
    return "";
  }

  pressNumber(number: string) {
    this.display = this.numerical.toFormat(this.cal.inputNumber(number));
    this.log(`press[${number}]`);
  }
  
  pressDot() {
    this.display = this.numerical.toFormat(this.cal.inputDot());
    this.log(`addDot`);
  }

  pressSign(){
    this.display = this.numerical.toFormat(this.cal.toggleSign());
    this.log(`toggleSign`);
  }

  pressOperator(operator: Operator) {
    this.display = this.numerical.toFormat(this.cal.getOperator(operator));
    this.log(`press[${operator}]`);
  }

  pressEqual(){
    this.display = this.numerical.toFormat(this.cal.calculate());
    this.log(`press[=]`);
  }

  pressClear() {
    this.display = this.numerical.toFormat(this.cal.clear());
    this.log(`Clear`);
  }

  pressAllClear() {
    this.display = this.numerical.toFormat(this.cal.allClear());
    this.log(`AllClear`);
  }
  
  pressPercentage(){
    this.display = this.numerical.toFormat(this.cal.percentage());
    this.log(`press[%]`);
  }

  pressSqrt(){
    this.display = this.numerical.toFormat(this.cal.sqrt());
    this.log(`press[√]`);
  }
}