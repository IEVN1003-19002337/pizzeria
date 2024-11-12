import { Component, OnInit } from '@angular/core';
import { ServiciosService, Pedido } from '../servicios.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ticket',
    templateUrl: './ticket.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class TicketComponent implements OnInit {
    ventas: Pedido[] = [];
    totalVentas: number = 0;

    constructor(private serviciosService: ServiciosService) {}

    ngOnInit() {
        this.serviciosService.ventas$.subscribe(ventas => {
            this.ventas = ventas;
            this.totalVentas = this.ventas.reduce((sum, venta) => sum + venta.total, 0);
        });
    }

    mostrarVentasTotales() {
        alert(`Se han generado: $${this.totalVentas}pesos, en el dia`);
        this.serviciosService.limpiarVentasDelDia();
        this.totalVentas = 0;
    }
}