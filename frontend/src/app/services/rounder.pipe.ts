import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rounder'
})
export class RounderPipe implements PipeTransform {

  transform (input:number) {
    return Math.round(input);
  }

}
