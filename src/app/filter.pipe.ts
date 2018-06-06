import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'category'
})
export class FilterPipe implements PipeTransform {
  transform(categories: any, searchText: any): any {
    if(searchText == null) return categories;

    //categories are [[]]
    return categories.filter(function(category){

      //category is []
      return category.filter(function(subCategory) {

        //subCategory is string that we compare with searchText
        return subCategory.toString().toLowerCase() == searchText.toLowerCase();
      });
    })
  }
}
