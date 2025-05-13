import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameInitials',
  standalone: false
})
export class NameInitialsPipe implements PipeTransform {

  transform(fullName: string | null | undefined, maxInitials = 2): string {
    const validName = fullName?.trim() || '';
    return validName
      .split(/\s+/)
      .filter(word => word.length > 0)
      .slice(0, maxInitials)
      .map(word => word[0].toUpperCase())
      .join('');
  }
}
