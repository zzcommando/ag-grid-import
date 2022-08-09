
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AgGridModule } from 'ag-grid-angular';
import { AppComponent } from './app.component';
import { EchartsxModule } from 'echarts-for-angular';


@NgModule({
 declarations: [
   AppComponent
 ],
 imports: [
   BrowserModule,
   HttpClientModule,
   AgGridModule,
   EchartsxModule,
 ],
 providers: [],
 bootstrap: [AppComponent]
})
export class AppModule { }