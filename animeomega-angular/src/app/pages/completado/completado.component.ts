import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-completado',
  standalone: true,
    imports: [
        NgIf
    ],
  templateUrl: './completado.component.html',
  styleUrl: './completado.component.css'
})
export class CompletadoComponent implements OnInit{
  isLoading = false;

constructor() {
}

ngOnInit(): void {
  this.isLoading = true;
}
}
