import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], terms: string): any[] {
    console.log('Item list: ', items);
    console.log('terms: ', items);

    if (!items) { return []; }
    if (!terms) { return items; }
    terms = terms.toLowerCase();
    return items.filter(( it => {
      return it.name.toLowerCase().includes(terms) || it.property_json.project.toLowerCase().includes(terms); // only filter country name
    }));
  }

}
