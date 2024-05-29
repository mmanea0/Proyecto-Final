import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {ChartConfiguration, ChartData, ChartEvent} from "chart.js";
import {EstadisticasService} from "../../../service/estadisticas.service";
import {EstadisticasGenero} from "../../../interfaces/estadisticas-genero";

@Component({
  selector: 'app-generos',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  templateUrl: './generos.component.html',
  styleUrl: './generos.component.css'
})
export class GenerosComponent implements OnInit{
  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        grid: {
          display: false
        }
      },
      y: {
        min: 0
      }
    },
    plugins: {
      legend: {
        position: 'top',
        display: false
      },
      title: {
        display: true,
        text: 'Cantidad de visitas por género',
        color: 'black'
      }
    },
    layout: {
      padding: 10
    },
    aspectRatio: 1.5
  };

  public barChartType = 'bar' as const;

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Total Vistos',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 2,
        borderRadius: { topLeft: 10, topRight: 10, bottomLeft: 0, bottomRight: 0 },
        borderSkipped: 'bottom',
      }
    ]
  };

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit(): void {
    this.estadisticasService.getGenero().subscribe((data: EstadisticasGenero[]) => {
      const colors = this.generateColors(data.length);

      this.barChartData.labels = data.map(g => g.genero);
      this.barChartData.datasets[0].data = data.map(g => g.total);
      this.barChartData.datasets[0].backgroundColor = colors;
      this.barChartData.datasets[0].borderColor = colors;

      this.chart?.update();
    });
  }

  private generateColors(length: number): string[] {
    const colors: string[] = [];
    for (let i = 0; i < length; i++) {
      const color = `hsl(${Math.floor(360 * i / length)}, 70%, 50%)`;
      colors.push(color);
    }
    return colors;
  }

  // events
  public chartClicked({ event, active }: { event?: ChartEvent; active?: object[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent; active?: object[] }): void {
    console.log(event, active);
  }


}
