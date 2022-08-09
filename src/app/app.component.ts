import { HttpClient } from '@angular/common/http';
import { Component, ViewChild ,OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { observable, Observable } from 'rxjs';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { CsvExportModule } from "@ag-grid-community/csv-export";
import { ExcelExportModule } from "@ag-grid-enterprise/excel-export";
import { MasterDetailModule } from "@ag-grid-enterprise/master-detail";
import { Module, ModuleRegistry } from '@ag-grid-community/core';
import { AllCommunityModules, GridOptions } from "@ag-grid-community/all-modules";
import * as XLSX from 'xlsx';

import { TooltipComponent, GridComponent, LegendComponent } from "echarts/components";
import { EChartsOption } from 'echarts';
import { BarChart } from 'echarts/charts';

export interface IData {
  Make: string;
  Model: string;
  Price: number;
}

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
    CsvExportModule,
    ExcelExportModule,
    MasterDetailModule
]);


@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.scss']
})
export class AppComponent {

  options: any;

  readonly echartsExtentions: any[];
echartsOptions: object = {};

  public gridApi!: GridApi<IData>;
  public gridOptions: GridOptions;
  public rowData!: IData[];

public modules: any[] = [MenuModule, ClientSideRowModelModule, CsvExportModule, ExcelExportModule, MasterDetailModule];

 

 // Each Column Definition results in one Column.
 public columnDefs: ColDef[] = [
   { field: 'Make'},
   { field: 'Model'},
   { field: 'Price' }
 ];

 // DefaultColDef sets props common to all Columns
 public defaultColDef: ColDef = {
   sortable: true,
   filter: true,
 };
 
 constructor(private http: HttpClient) {
  this.echartsExtentions = [BarChart, TooltipComponent, GridComponent, LegendComponent];

  this.rowData  = [{ Make: 'Toyota', Model: 'Celica', Price: 35000 }];

  this.gridOptions = {
    columnDefs: [
      { field: 'Make'},
      { field: 'Model' },
      { field: 'Price'},
    ]
  };
 }

 ngOnInit() {
  this.options  = {
      tooltip: {
          trigger: "axis",
          axisPointer: {
          type: "shadow"
          }
      },
      grid: {
          left: "3%",
          right: "4%",
          bottom: "8%",
          top: "3%",
          containLabel: true
      },
      xAxis: {
           type: "value"
      },
      yAxis: {
          type: "category",
          data: ["sat", "sun", "mon", "tue", "wed", "thu", "fri"],
          axisLabel: {
          interval: 0,
          rotate: 15
          }
      },
      legend: {
          data: ["ali", "behrooz"],
          bottom: 0
      },
      series: [
      {
          name: "ali",
          type: "bar",
          data: [10, 15, 17, 4, 15, 31, 2]
      },
      {
          name: "behrooz",
          type: "bar",
          data: [1, 17, 12, 11, 40, 3, 21]
      }
      ]
  };
}

 // Example load data from sever
 onGridReady(params: GridReadyEvent) {
//   this.rowData$ = this.http
 //    .get<any[]>('https://www.ag-grid.com/example-assets/row-data.json');
 this.gridApi = params.api;

 }

 // Example of consuming Grid Event
 onCellClicked( e: CellClickedEvent): void {
   console.log('cellClicked', e);
 }

 importExcel(event: any) {
  
  if (event.target.files.length > 0) {
    const products = this.convertDataToProducts(event);
    console.log('arquivo', products);
  }
}
convertDataToProducts(event: any) {
  /* convert data to binary string */

  const reader: FileReader = new FileReader();
  reader.readAsBinaryString(event.target.files[0]);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      /* selected the first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const data :Array<IData> = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}

      data.forEach((element:IData) => 
      {
        this.rowData.push(element);
        this.gridApi.setRowData(this.rowData);
      });
    }


  return "";
}

}