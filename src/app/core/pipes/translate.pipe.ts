import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  constructor(){}
  transform(key: string, args?: any): any {
    return null;
  }

}
