import {Component, OnInit, ViewChild} from '@angular/core';
import {EmpAddEditComponent} from "./emp-add-edit/emp-add-edit.component";
import {MatDialog} from "@angular/material/dialog";
import {EmployeeService} from "./services/employee.service";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'EmpCRUD';

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email',
    'birthDate', 'gender', 'education', 'company', 'experience', 'package', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _dialog: MatDialog, private _empService: EmployeeService) {
  }

  ngOnInit(): void {
        this.getEmployeeList()
    }
  openAddEditEmployeeForm() {
    const dialogRef = this._dialog.open(EmpAddEditComponent)
    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if(res) {
          this.getEmployeeList()
        }
      }
    });
  }
  getEmployeeList() {
    this._empService.getEmployeeList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res)
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteEmployee(id: number) {
    this._empService.deleteEmployee(id).subscribe({
      next: (res) => {
        alert('Employee deleted as well')
        this.getEmployeeList()
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  openEditForm(data: any) {
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (res) => {
        if(res) {
          this.getEmployeeList()
        }
      }
    });
  }
}
