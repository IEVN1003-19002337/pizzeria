import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Pizza {
    tamano: string;
    ingredientes: string[];
    numPizzas: number;
    subtotal: number;
}

export interface Pedido {
    nombre: string;
    direccion: string;
    telefono: string;
    pizzas: Pizza[];
    total: number;
}

@Injectable({
    providedIn: 'root',
})
export class ServiciosService {
    private pedidosKey = 'pedidos';
    private ventasKey = 'ventas';

    private pedidoSubject = new BehaviorSubject<Pedido>(this.obtenerPedidoActual());
    private ventasSubject = new BehaviorSubject<Pedido[]>(this.obtenerVentasDelDia());

    pedido$ = this.pedidoSubject.asObservable();
    ventas$ = this.ventasSubject.asObservable();

    constructor() {}

    obtenerPedidoActual(): Pedido {
        const pedido = localStorage.getItem(this.pedidosKey);
        return pedido ? JSON.parse(pedido) : { nombre: '', direccion: '', telefono: '', pizzas: [], total: 0 };
    }

    guardarPedido(pedido: Pedido): void {
        localStorage.setItem(this.pedidosKey, JSON.stringify(pedido));
        this.pedidoSubject.next(pedido);
    }

    agregarPizza(pedido: Pedido, pizza: Pizza): void {
        pedido.pizzas.push(pizza);
        pedido.total += pizza.subtotal;
        this.guardarPedido(pedido);
    }

    quitarPizza(pedido: Pedido, pizza: Pizza): void {
        const index = pedido.pizzas.indexOf(pizza);
        if (index !== -1) {
            pedido.pizzas.splice(index, 1);
            pedido.total -= pizza.subtotal;
            this.guardarPedido(pedido);
        }
    }

    confirmarPedido(pedido: Pedido): void {
        const ventas = this.obtenerVentasDelDia();
        ventas.push(pedido);
        localStorage.setItem(this.ventasKey, JSON.stringify(ventas));
        this.ventasSubject.next(ventas);
        localStorage.removeItem(this.pedidosKey);
        this.pedidoSubject.next({ nombre: '', direccion: '', telefono: '', pizzas: [], total: 0 });
    }

    obtenerVentasDelDia(): Pedido[] {
        const ventas = localStorage.getItem(this.ventasKey);
        return ventas ? JSON.parse(ventas) : [];
    }

    limpiarVentasDelDia(): void {
        localStorage.removeItem(this.ventasKey);
        this.ventasSubject.next([]);
    }
}
