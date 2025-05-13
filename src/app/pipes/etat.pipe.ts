import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'etat',
  standalone: false
})
export class EtatPipe implements PipeTransform {

  transform(value: boolean, ...args: unknown[]): string {
    return value ? 'Completed' : 'On going';
  }

}
