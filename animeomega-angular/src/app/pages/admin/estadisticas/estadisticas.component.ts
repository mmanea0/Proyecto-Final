import { Component } from '@angular/core';
import {ApexOptions, NgApexchartsModule} from "ng-apexcharts";

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [
    NgApexchartsModule
  ],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {

  chartOptions: ApexOptions = {};

  constructor() {
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      },
      yaxis: {
        title: {
          text: 'Sales',
          style: {
            color: '#7c97b6'
          }
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return "$ " + val + " thousands"
          }
        }
      }
    };
  }
}
