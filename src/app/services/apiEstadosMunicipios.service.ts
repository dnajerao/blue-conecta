import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  @Injectable({
    providedIn: "root",
  })

export class ApiEstadosMunicipiosService {
    
    constructor(private http: HttpClient) {

    }

    public obtenerEstados(){
        return this.http.get('https://api-sepomex.hckdrk.mx/query/get_estados');
      }

    public obtenerMunicipios(param:any){
      return this.http.get('https://api-sepomex.hckdrk.mx/query/get_municipio_por_estado/' + param);
    }
}


