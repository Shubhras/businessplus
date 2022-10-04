import { Component, OnInit } from '@angular/core';
declare const google: any;
@Component({
    selector: 'chart',
    template: `
    <div class="four wide column center aligned">
    <div id="chart_div" style="width: 900px; height: 500px;"></div>
    </div>
`
})
export class GoogleChartComponent implements OnInit {
    private static googleLoaded: any;
    private options;
    constructor() {
        console.log("Here is GoogleChartComponent")
    }

    getGoogle() {
        return google;
    }
    ngOnInit() {
        console.log('ngOnInit');
        if (!GoogleChartComponent.googleLoaded) {
            GoogleChartComponent.googleLoaded = true;
            google.charts.load('current', { packages: ['gantt'] });
        }
        google.charts.setOnLoadCallback(() => this.drawGraph());
    }

    toMilliseconds(year) {
        return year  *  24 * 60 * 60 * 1000;
    }

    drawGraph() {
        var otherData = new google.visualization.DataTable();
        otherData.addColumn('string', 'Task ID');
        otherData.addColumn('string', 'Task Name');
        otherData.addColumn('string', 'Resource');
        otherData.addColumn('date', 'Start');
        otherData.addColumn('date', 'End');
        otherData.addColumn('number', 'Duration');
        otherData.addColumn('number', 'Percent Complete');
        otherData.addColumn('string', 'Dependencies');

        otherData.addRows([
            ['toTrain', 'Walk to train stop', 'walk', null, null, this.toMilliseconds(1), 100, null],
            ['music', 'Listen to music', 'music', null, null, this.toMilliseconds(1), 100, null],
            ['wait', 'Wait for train', 'wait', null, null, this.toMilliseconds(1), 100, 'toTrain'],
            ['train', 'Train ride', 'train', null, null, this.toMilliseconds(1), 70, 'wait'],
            ['toWork', 'Walk to work', 'walk', null, null, this.toMilliseconds(1), 0, 'train'],
            ['work', 'Sit down at desk', null, null, null, this.toMilliseconds(1), 0, 'toWork'],

        ]);

        this.options = {

            height: 275,
            gantt: {
                defaultStartDateMillis: new Date(2019, 0, 28)
            }

        };


        var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

        chart.draw(otherData, this.options);
    }
}
