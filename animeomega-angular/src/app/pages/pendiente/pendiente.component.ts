import {Component, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-pendiente',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './pendiente.component.html',
  styleUrl: './pendiente.component.css'
})
export class PendienteComponent implements OnInit{
  isLoading = false;

  constructor() { }

  ngOnInit(): void {
    this.isLoading = true;
  }
}
