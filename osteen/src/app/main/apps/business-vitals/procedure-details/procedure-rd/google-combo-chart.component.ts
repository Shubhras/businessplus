import {Component,OnInit  } from "@angular/core";


@Component({
    selector:'combo-chart',
    templateUrl:'./google-chart-component.html',


})

export class GoogleComboChartComponent {
    constructor() {
        
    }
    title: 'Company Hiring Report';
    type = 'LineChart'; 
   
    data = [  
        ["2014", 0,null, 40,null],  
        ["2015", 50,'point { size: 18; shape-type: square; fill-color: #EF851C; }', 90,null],  
        ["2016", 50,null, 100,null],  
        ["2017", 75,null, 120,'point { size: 18; shape-type: star; fill-color: #a52714; }'],  
        ["2018", 50,null, 100,null], 
        ["2019", 60,null, 100,'point { size: 18; shape-type: triangle; fill-color: #a52774; }'],
     ];
     columnNames = ['Year', 'India',{'type': 'string', 'role': 'style'}, 'contry',{'type': 'string', 'role': 'style'}];  
     options = {
        //hAxis: { minValue: 0,maxValue: 2010 },
        colors: ['#795548'],
        pointSize: 20,
       // pointShape: 'square'
       //pointShape: { type: 'star', sides: 10 }
     };  
     width = 1000;  
     height = 400; 

    ngOninit(){
    }



}