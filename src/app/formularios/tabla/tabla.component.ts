import { Component, Output, EventEmitter } from '@angular/core';
import { ServiciosService, Pedido, Pizza } from '../servicios.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tabla',
    templateUrl: './tabla.component.html',
    standalone: true,
    imports: [CommonModule]
})
export class TablaComponent {
    @Output() terminarPedidoEvent = new EventEmitter<void>();

    pedido!: Pedido;

    constructor(private serviciosService: ServiciosService) {
        this.serviciosService.pedido$.subscribe(pedido => this.pedido = pedido);
    }

    quitarPizza(pizza: Pizza) {
        this.serviciosService.quitarPizza(this.pedido, pizza);
    }

    onTerminarPedido() {
        const confirmar = confirm(`Pagarás: $${this.pedido.total}. ¿Aceptas?`);
        if (confirmar) {
            this.serviciosService.confirmarPedido(this.pedido);
            alert('Pedido confirmado!');
            this.terminarPedidoEvent.emit();
        }
    }
}
