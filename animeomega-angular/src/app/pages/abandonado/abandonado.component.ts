import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-abandonado',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './abandonado.component.html',
  styleUrl: './abandonado.component.css'
})
export class AbandonadoComponent implements OnInit{
  isLoading = false;

  constructor() { }

  ngOnInit(): void {
   this.isLoading = true;

  }

}
