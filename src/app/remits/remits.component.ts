import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from "@angular/material";
import {ClientDetailsDialog, Perclient} from "../account/account.component";
import {AngularFireDatabase} from "angularfire2/database";
import {FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-remits',
  templateUrl: './remits.component.html',
  styleUrls: ['./remits.component.scss']
})
export class RemitsComponent implements OnInit {
  itemList: PerRemit[];
  itemPrint: PerRemit[];
  remitSource = new MatTableDataSource(this.itemList);
  clientColumns = ['full_name', 'total_paypal', 'total_cash', 'balance', 'actions'];
  noRecords: boolean;
  passBalance: number;
  passKey: string;
  passFullName: string = 'Jerald';
  passTimestamp: number;
  remitAmount: number;
  amount2: number;
  rAmountisValid: boolean = false;

  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.remitSource.paginator = this.paginator;
    this.remitSource.sort = this.sort;
  }

  rAmount = new FormControl('', [Validators.required, Validators.minLength(0), Validators.maxLength(this.passBalance)]);

  getErrorMessage() {
    return this.rAmount.hasError('required') ? 'You must enter a value' :
      this.rAmount.hasError('minLength') ? 'Enter valid details' :
        this.rAmount.hasError('maxLength') ? 'Enter valid details' :
        '';
  }

  ngAfterViewInit() {
    this.remitSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.remitSource.filter = filterValue;

    this.noRecords = this.remitSource.filteredData.length == 0;
  }

  constructor(private db: AngularFireDatabase, public dialog: MatDialog, public snackBar: MatSnackBar, public router: Router) {
    let data = db.list('history/payments');

    data.snapshotChanges().subscribe(item => {
      this.itemList = [];
      let i = 1;

      item.forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        json['in1'] = i;
        // this.itemList.push(json as Item);
        this.itemList.push(json as PerRemit);
        // this.xD.push(json);

        i++
      });

      this.remitSource = new MatTableDataSource(this.itemList);
      this.remitSource.sort = this.sort;
      this.remitSource.paginator = this.paginator;

    });
  }

  passRemitData(ebalance, ekey, ename) {
    this.passBalance = ebalance;
    this.passKey = ekey;
    this.passFullName = ename;
    this.passTimestamp = + new Date();
  }

  onKey(event){
    this.amount2 = event.target.value;

    this.rAmountisValid = this.amount2 <= this.passBalance && this.amount2 > 0;
  }

  onSelect(element) {
    this.router.navigate(['/remit-page/cash/by/', element.$key, element.full_name]);
  }

  onPassAmount(form) {
    return this.remitAmount;
  }

  openSnackBar(m) {
    this.snackBar.open(m, 'OK', {
      duration: 4000,
    });
  }

  onSubmit() {
    const remitRef = this.db.list('history/payments/'+ this.passKey + '/cash');

    remitRef.push({amount: this.remitAmount, timestamp: this.passTimestamp});

    let newBalance = this.passBalance -= this.remitAmount;
    const updateParentref = this.db.list('history/payments/');

    updateParentref.update(this.passKey, {balance : newBalance});

    this.openSnackBar('Remit Success');
  }

  ngOnInit() {
  }

}

export interface PerRemit {
  $key: string;
  total_paypal: number;
  total_cash: number;
  cash_on_hand: number;
}
