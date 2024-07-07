import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-users-chart',
  templateUrl: './users-chart.component.html',
  styleUrls: ['./users-chart.component.scss']
})
export class UsersChartComponent {

  @Input() reveal: boolean = false;
  @Input() users: any;
  @Input() averagePoints: any;

  chartOptions: any = {
    animationEnabled: true,
    theme: "light",
    data: [{
      type: "pie",
      title: {
        text: "Pie Chart"
      },
      indexLabel: "{name}",
      indexLabelPlacement: "inside",
      dataPoints: []
    }]
  }

  ngOnInit() {
    this.updateChartOptions();

  }

  displayedColumns: string[] = ['username', 'points'];


  updateChartOptions() {
    let dataPoints = [];
    let points = this.users.map((user: any) => user.selectedCard);

    let allPoints = [1, 3, 5, 8, 13]
    for (let index = 0; index < allPoints.length; index++) {
      const element = allPoints[index];
      let filterData = points.filter((point: any) => point === element);
      if (filterData.length > 0) {
        dataPoints.push({ name: element, repeatedTimes: filterData.length })
      }

    }

    let finalPointsData = [];
    for (let index = 0; index < dataPoints.length; index++) {
      const element = dataPoints[index];
      const repeatedTimes = element.repeatedTimes;
      const totalPoints = dataPoints.map((data) => data.repeatedTimes)
      const sum = totalPoints.reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0);

      const data: any = { name: element.name.toString(), y: (repeatedTimes / sum) * 100 };
      //finalDataPoints.push({ name: element.name, y: (repeatedTimes/sum) * 100 })
      finalPointsData.push(data)

      this.chartOptions = {
        animationEnabled: true,
        theme: "light",
        data: [{
          type: "pie",
          title: {
            text: "Pie Chart"
          },
          indexLabel: "{name}",
          indexLabelPlacement: "inside",
          dataPoints: finalPointsData
        }]
      }
    }

  }


}
