import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, columnDefs: any[]): any[] {

    // return empty array if array is false
    if (!items) {
      return [];
    }
    // return the original array if search text is empty
    if (!searchText) {
      return items;
    }
    // convert the searchText to lower case
    searchText = searchText.toLowerCase();
    //get object keys
    let filterKeys = [];
    columnDefs.forEach(key => {
      filterKeys.push(key.field);
    });
    // retrun the filtered array
    return items.filter(item => {
      return filterKeys.reduce((previousValue, keyName) => {
          if (item[keyName] != null) {
            return previousValue || item[keyName].toString().toLowerCase().includes(searchText);
          } else
            return previousValue;
        },
        false);
    });
  }
}
