import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ServiciosService, Pedido, Pizza } from '../servicios.service';
import { CommonModule } from '@angular/common';
import { TablaComponent } from '../tabla/tabla.component';

@Component({
    selector: 'app-cliente',
    templateUrl: './cliente.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, TablaComponent]
})
export class ClienteComponent {
    pedidoForm: FormGroup;
    pedido: Pedido;
    ingredientes = [
        { nombre: 'Jamón', seleccionado: false },
        { nombre: 'Piña', seleccionado: false },
        { nombre: 'Champiñones', seleccionado: false }
    ];
    precioIngrediente = 10;

    constructor(private fb: FormBuilder, private serviciosService: ServiciosService) {
        this.pedido = this.serviciosService.obtenerPedidoActual();
        this.pedidoForm = this.fb.group({
            nombre: [this.pedido.nombre],
            direccion: [this.pedido.direccion],
            telefono: [this.pedido.telefono],
            tamano: [''],
            num_pizzas: [1],
            ingredientes: new FormArray(this.ingredientes.map(() => new FormControl(false))) 
        });
    }

    limpiarCampos(): void {
        this.pedidoForm.reset({
            nombre: '',
            direccion: '',
            telefono: '',
            tamano: '',
            num_pizzas: 1,
            ingredientes: this.ingredientes.map(() => false)
        });
    }

    get ingredientesArray(): FormArray {
        return this.pedidoForm.get('ingredientes') as FormArray;
    }

    getFormControl(index: number): FormControl {
        return this.ingredientesArray.at(index) as FormControl;
    }
    
    actualizarSubtotal(): number {
        const tamano = this.pedidoForm.value.tamano;
        const num_pizzas = this.pedidoForm.value.num_pizzas;
        const precioBase = tamano === 'chica' ? 40 : tamano === 'mediana' ? 80 : 120;
        
        let subtotal = precioBase * num_pizzas;

        this.ingredientesArray.controls.forEach((control, index) => {
            if ((control as FormControl).value) {
                subtotal += this.precioIngrediente * num_pizzas;
            }
        });

        return subtotal;
    }

    agregarPizza(): void {
        const { tamano, num_pizzas } = this.pedidoForm.value;
        const ingredientesSeleccionados = this.ingredientes
            .filter((_, index) => this.ingredientesArray.at(index).value)
            .map(ingrediente => ingrediente.nombre);
        const subtotal = this.actualizarSubtotal();

        const pizza: Pizza = {
            tamano,
            ingredientes: ingredientesSeleccionados,
            numPizzas: num_pizzas,
            subtotal
        };

        this.pedido.nombre = this.pedidoForm.value.nombre;
        this.pedido.direccion = this.pedidoForm.value.direccion;
        this.pedido.telefono = this.pedidoForm.value.telefono;

        this.serviciosService.agregarPizza(this.pedido, pizza);

        this.pedidoForm.patchValue({
            tamano: '',
            num_pizzas: 1,
            ingredientes: this.ingredientes.map(() => false)
        });
    }
}
