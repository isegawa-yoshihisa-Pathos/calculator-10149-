import { Component} from '@angular/core';
import { CalculateService } from './calculate.service';
import { HostListener } from '@angular/core';
import { NumericalService } from './numerical.service';

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

  display: string = "";

  constructor(private cal: CalculateService, private numerical: NumericalService){}

  displayError(): string{
    if (this.numerical.formatError){
      return "E";
    }
    return "";
  }

  pressNumber(number: string) {
    this.display = this.numerical.toFormat(this.cal.inputNumber(number));
    this.cal.log();
  }
  
  pressDot() {
    this.display = this.numerical.toFormat(this.cal.inputDot());
    this.cal.log();
  }

  pressSign(){
    this.display = this.numerical.toFormat(this.cal.toggleSign());
    this.cal.log();
  }

  pressOperator(operator: string) {
    this.display = this.numerical.toFormat(this.cal.getOperator(operator));
    this.cal.log();
  }

  pressEqual(){
    this.display = this.numerical.toFormat(this.cal.calculate());
    this.cal.log();
  }

  pressClear() {
    this.display = this.numerical.toFormat(this.cal.clear());
    this.cal.log();
  }

  pressAllClear() {
    this.display = this.cal.allClear();
    this.cal.log();
  }
  
  pressPercentage(){
    this.display = this.numerical.toFormat(this.cal.percentage());
    this.cal.log();
  }

  pressSqrt(){
    this.display = this.numerical.toFormat(this.cal.sqrt());
    this.cal.log();
  }
}