import { Pipe, PipeTransform } from '@angular/core';

/**
 * pipe for filtering movie objects
 */
@Pipe({
  name: 'filter'
})
/**
 * @author Hannah Schieber
 * @description filtering entires
 */
export class FilterPipe implements PipeTransform {

  /**
   * transform the entrie objects by filtering either by tags, name, creator or by combined attributes
   */
  transform(items: any[], searchTerm: any): any {
    console.log(searchTerm);
    if (!items) return [];
    if (!searchTerm) return items;
    searchTerm = searchTerm.toLowerCase();
    const res = [];
    items.forEach(elem => {
        if (elem.title && elem.title.toLowerCase().includes(searchTerm)) {
          res.push(elem);
        }
    });
    return res;

  }
}
