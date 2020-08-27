import {Component, ViewChild} from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatSelect} from '@angular/material/select';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { ApiEstadosMunicipiosService } from 'app/services/apiEstadosMunicipios.service';
import { takeUntil, take } from 'rxjs/operators';

interface Place {
 id: number;
 name: string;
}

@Component({
  selector: 'material-app',
  templateUrl: 'dropdown-multiselect.component.html',
})

export class DropdownMultiselectComponent { 

  constructor(private placesService: ApiEstadosMunicipiosService) {

    this.placesService.obtenerEstados().subscribe(estados =>{
      let idEstado = 0;
      for(let estado of estados['response']['estado']){
        this.estados.push({name: estado, id: idEstado});
        idEstado ++;
      }
      console.log("ESTADOS", this.estados)
    })

    this.placesService.obtenerMunicipios('Aguascalientes').subscribe(municipios => {
      for(let municipio of municipios['response']['municipios']){
        this.municipios.push({name: municipio + ' (' + 'Aguascalientes' + ')' , id: this.estadoID});
        this.estadoID ++;
      }

      this.municipios.sort((a,b) => a.name.localeCompare(b.name));
    })
  }

  public filteredEstadosMulti: ReplaySubject<Place[]> = new ReplaySubject<Place[]>(1);
  public filteredMunicipiosMulti: ReplaySubject<Place[]> = new ReplaySubject<Place[]>(1);

  public estadoMultiCtrl: FormControl = new FormControl();
  public estadoMultiFilterCtrl: FormControl = new FormControl();

  public municipioMultiCtrl: FormControl = new FormControl();
  public municipioMultiFilterCtrl: FormControl = new FormControl();

  @ViewChild('multiSelectEstado', { static: true }) multiSelectEstado: MatSelect;
  @ViewChild('multiSelectMunicipio', { static: true }) multiSelectMunicipio: MatSelect;

  private _onDestroy = new Subject<void>();

  private estados: Place[] = []
  private municipios: Place[] = []
  private estadoID: number = 0;
  private municipioActive: boolean = false;

  ngOnInit() {

    this.filteredEstadosMulti.next(this.estados.slice());

    this.estadoMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterEstadosMulti();
      });

      this.filteredMunicipiosMulti.next(this.municipios.slice());

      this.municipioMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMunicipiosMulti();
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getMunicipios(){

    this.municipios = [];
    this.municipioMultiCtrl.reset();
    
    if(this.estadoMultiCtrl.value.length != 0)
    this.municipioActive = true;
    else
    this.municipioActive = false;

    for(let estado of this.estadoMultiCtrl?.value){
      this.placesService.obtenerMunicipios(estado.name).subscribe(municipios => {
        for(let municipio of municipios['response']['municipios']){
          this.municipios.push({name: municipio + ' (' + estado.name + ')' , id: this.estadoID});
          this.estadoID ++;
        }

        this.municipios.sort((a,b) => a.name.localeCompare(b.name));
        this.filterMunicipiosMulti();
      })
    }
  }


  protected filterEstadosMulti() {
    if (!this.estados) {
      return;
    }
    
    let search = this.estadoMultiFilterCtrl.value;
    if (!search) {
      this.filteredEstadosMulti.next(this.estados.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
   
    this.filteredEstadosMulti.next(
      this.estados.filter(estado => estado.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterMunicipiosMulti() {
    if (!this.municipios) {
      return;
    }
    
    let search = this.municipioMultiFilterCtrl.value;
    if (!search) {
      this.filteredMunicipiosMulti.next(this.municipios.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
   
    this.filteredMunicipiosMulti.next(
      this.municipios.filter(municipio => municipio.name.toLowerCase().indexOf(search) > -1)
    );
  }
}
