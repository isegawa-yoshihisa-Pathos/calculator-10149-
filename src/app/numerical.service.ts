import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class NumericalService {
  private scale:bigint = 100000000n;
  public formatError:boolean = false;

  toBigInt(number: string):bigint {
    if (!number.includes('.')) {
      return BigInt(number) * this.scale;
    }
    const [integerPart, decimalPart] = number.split('.');
    const decimalPartBigInt = (decimalPart + '00000000').slice(0, 8);
    return BigInt(integerPart) * this.scale + BigInt(decimalPartBigInt);
  }

  toNumber(number: bigint): string {
    let signLabel: boolean = false;
    if (number < 0n){
      signLabel = true;
      number = number * -1n;
    }
    const integerPart = number / this.scale;
    const decimalPart = number % this.scale;
    return (signLabel ? '-' : '') + (integerPart.toString() + '.' + decimalPart.toString().padStart(8, '0')).replace(/0+$/, '');
  }

  toFormat(number: string | bigint): string {
    if (typeof number === 'string') {
      if (!number.includes('.')) {
        return  number.replace( /(\d)(?=(\d{3})+$)/g, '$1,' );
      }
      const [integerPart, decimalPart] = number.split('.');
      return integerPart.replace( /(\d)(?=(\d{3})+$)/g, '$1,' ) + '.' + decimalPart;
    }else if (typeof number === 'bigint') {
      let signLabel: boolean = false;
      if (number < 0n){
        signLabel = true;
        number = number * -1n;
      }
      const integerPart = number / this.scale;
      const decimalPart = number % this.scale;
      return (signLabel ? '-' : '') + (integerPart.toString().replace( /(\d)(?=(\d{3})+$)/g, '$1,' ) + '.' + decimalPart.toString().padStart(8, '0')).replace(/0+$/, '');
    }
    return '';
  }

  executeOperation(a: bigint, b: bigint, operator: string): bigint{
    let answer: bigint;
    switch (operator) {
      case "+":
        answer = a + b;
        break;
      case "-":
        answer = a - b;
        break;
      case "*":
        answer = a * b / this.scale;
        break;
      case "/":
        if (b === 0n){
          this.formatError = true;
          answer = 0n;
          break;
        }
        answer = a * this.scale / b;
        break;
      default:
        answer = b;
        break;
    }
    if (answer >= 1n * 10n ** 18n || answer <= -1n * 10n ** 18n){
      this.formatError = true;
      return answer / (1n * 10n ** 10n);
    }
    return answer;
  }
}