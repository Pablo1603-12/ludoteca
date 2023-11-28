import { Component } from '@angular/core';
import { Alquiler, DatosAlquiler } from 'src/app/modelos/alquiler';
import { AlquilerService } from 'src/app/services/alquiler.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-listado-alquileres',
  templateUrl: './listado-alquileres.component.html',
  styleUrls: ['./listado-alquileres.component.css']
})
export class ListadoAlquileresComponent {

  alquileres: any;
  datosAlquiler?: DatosAlquiler;
  arrayAlquileres: DatosAlquiler[] = [];

  constructor(
    private fbs: FirebaseService,
    private alquilerService: AlquilerService
  ) { }

  ngOnInit() {
    // Leer los alquileres con fbs
    this.fbs.coleccion = 'alquileres';
    this.fbs.queryDocument('alquilado', true)
      .subscribe(res => {
        this.alquileres = res;
        console.log(res);
        this.alquileres.forEach((element: Alquiler) => {
          console.log(element);

          this.fbs.coleccion = 'usuarios';
          this.fbs.getDocument(element.idUsuario!).subscribe(dataUsuario => {
            const usuario = dataUsuario;
            this.fbs.coleccion = 'juegos';
            this.arrayAlquileres = [];
            this.fbs.getDocument(element.idJuego!).subscribe(dataJuego => {
              const juego = dataJuego;
              // A partir de aquí montar el datosAlquiler
              this.datosAlquiler = {
                alquilado: element.alquilado,
                alquiler: element,
                juego: juego,
                usuario: usuario
              }
              this.arrayAlquileres.push(this.datosAlquiler);
              console.log(this.arrayAlquileres);
            });
          });
        });
      });
  }
}
