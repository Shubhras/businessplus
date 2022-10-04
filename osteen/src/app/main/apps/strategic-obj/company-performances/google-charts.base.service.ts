declare var google: any;
export class GoogleChartsBaseService {
  constructor() {
    google.charts.load('current', {'packages':['corechart']});
  }
  protected buildChart(data: any[], chartFunc: any, options: any,elementTrend:any,elementCompare:any) : void {
    var func = (chartFunc, options, elementTrend,elementCompare) => {
      const dataTable = new google.visualization.DataTable();
      if(elementCompare == 1){
        dataTable.addColumn('string', 'Month');
        dataTable.addColumn('number', '');
        dataTable.addColumn({type: 'number', role: 'annotation'});
        dataTable.addColumn('number', '');
        dataTable.addColumn({type: 'number', role: 'annotation'});
      }
      else{
        dataTable.addColumn('string', 'Month');
        dataTable.addColumn('number', 'Target');
        dataTable.addColumn({type: 'number', role: 'annotation'});
        dataTable.addColumn('number', 'Actual');
        dataTable.addColumn({type: 'number', role: 'annotation'});
      }
      dataTable.addRows(data);
      const dataView = new google.visualization.DataView(dataTable);
      dataView.setColumns([
        // reference existing columns by index
        0, 1, 2, 3, 4,
        // add function for line color
        {
          calc: function (data, row) {
            /*  const colorDown = 'red';
             const colorUp = '#4caf50';
             const colorYellow = 'yellow'; */
             const colorRed = '#f40000';
             const colorYellow = '#ffd933';
             const colorGreen = '#4caf50';
             if (elementTrend === 'negative') {
               if ((row === 0) && ((data.getValue(row, 1) * 1.1) <= data.getValue(row, 3))) {
                 return colorRed;
               }
               else if ((row > 0) &&
                 (data.getValue(row, 3) < (data.getValue(row, 1) * 1.1) &&
                   data.getValue(row, 3) >= data.getValue(row, 1))) {
                 return colorYellow;
               }
               else if ((row > 0) && ((data.getValue(row, 1) * 1.1) <= data.getValue(row, 3))) {
                 return colorRed;
               }
               return colorGreen;
             }
             else if (elementTrend === 'positive') {
               if ((row === 0) && ((data.getValue(row, 1) * 0.7) > data.getValue(row, 3))) {
                 return colorRed;
               }
               else if ((row > 0) &&
                 (data.getValue(row, 3) >= (data.getValue(row, 1) * 0.7) &&
                   data.getValue(row, 3) < (data.getValue(row, 1) * 0.9))) {
                 return colorYellow;
               }
               else if ((row > 0) && (data.getValue(row, 1) > data.getValue(row, 3))) {
                 return colorRed;
               }
               return colorGreen;
             }
           },
          type: 'string',
          role: 'style'
        }
      ]);
      // var datatable = google.visualization.arrayToDataTable(data);
      chartFunc().draw(dataView, options);
    };
    var callback = () => func(chartFunc, options, elementTrend,elementCompare);
    google.charts.setOnLoadCallback(callback);
  }
}