import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {AngularFireDatabase} from "angularfire2/database";
import {Title} from "@angular/platform-browser";
import {Router} from "@angular/router";

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  itemList: PerClientPays[];
  dataSource = new MatTableDataSource(this.itemList);
  displayedColumns = ['in1', '$key', 'actions'];
  noRecords: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;

    if(this.dataSource.filteredData.length == 0) {
      this.noRecords = true;
    } else {
      this.noRecords = false;
    }
  }

  constructor(private db: AngularFireDatabase, private titleService: Title, public dialog: MatDialog, public router: Router) {
    let data = db.list('payments');
    this.itemList = [];

    data.snapshotChanges().subscribe(item => {
      this.itemList = [];
      let i = 1;
      item.forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        json["in1"] = i;
        // this.itemList.push(json as Item);
        this.itemList.push(json as PerClientPays);

        i++;

      });

      this.dataSource = new MatTableDataSource(this.itemList);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  onSelect(element) {
    this.router.navigate(['/payments/table/client', element.$key]);
  }

  ngOnInit() {
    this.titleService.setTitle("Lakbay | Payments Table");
  }
  public setTitle( newTitle: string) {
    this.titleService.setTitle(newTitle);
  }


}

export interface PerClientPays {
  in1: string;
  $key: string;
}
