import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, throwError, ReplaySubject, Subject } from 'rxjs';
import { catchError, retry, takeUntil } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { ApiEstadosMunicipiosService } from 'app/services/apiEstadosMunicipios.service';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';

declare var $: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {
  private readonly URL_BLMIDS_API = environment.URL_BLMIDS_API;
  private readonly URL_TOKEN_API = environment.URL_TOKEN_API;
  private readonly URL_TOKEN_API_PROXY = environment.URL_TOKEN_API_PROXY;
  private readonly URL_PUSH_API = environment.URL_PUSH_API;
  private readonly URL_PUSH_API_PROXY = environment.URL_PUSH_API_PROXY;

  private accessToken = '';
  private mensaje = '';
  private asunto = '';
  private clavesBimbo = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  mode: string;
  //private sub: any;

  ngOnInit() {
    /* this.sub = this.route.params.subscribe(params => {
        this.mode = params['mode']; 

        // In a real app: dispatch action to load the details here.
    });*/
  }

  ngOnDestroy() {
    /*try {
      this.sub.unsubscribe();
    }catch{
      //Nothing
    }*/
  }

  /**
   * Metodo asociado al clic del boton en la pantalla,
   * Detona el envio de notificaciones
   */
  btnEnviarNotificacionesClick() {
    this.showNotif(
      'info',
      'pe-7s-paper-plane',
      'En Construcción - Modo: ' + this.mode
    );

    this.asunto = $('#asunto').val();
    this.mensaje = $('#mensaje').val();
    this.clavesBimbo = $('#clavesBimbo').val();

    if (this.asunto != '' && this.mensaje != '' && this.clavesBimbo != '') {
      this.enviarNotificacionesProxy();
    } else {
      this.showNotif(
        'warning',
        'pe-7s-attention',
        'Por favor, capture todos los datos para continuar.'
      );
    }
  }

  enviarNotificacionesProxy() {
    var tokenObservable = this.getTokenProxy();

    const tokenObserver = {
      next: (tokenObserverResponse) => {
        //console.log("tokenObserverResponse: " + tokenObserverResponse);

        var responseJSONString = tokenObserverResponse;

        //var obj = new TokenObjectClass();
        //obj.copyInto(responseJSONString);

        let jsonObject = responseJSONString as TokenObjectClass;
        console.log('jsonObject: ' + jsonObject);

        this.accessToken = jsonObject.access_token;

        /*
        tokenObserverResponse.forEach(function (tokenObject){

          console.log("Token: " + tokenObject.access_token);

          this.accessToken = tokenObject.access_token
            //this.showNotif('info','pe-7s-paper-plane', "accessToken: " + accessToken); 
        });
        */
      },
      error: (err) => {
        this.showNotif(
          'warning',
          'pe-7s-attention',
          'Se encontró un error: ' + err.message
        );
        console.error('Se encontró un error: ' + err.message);
      },
      complete: () => {
        console.log('tokenObserver got a complete notification');

        this.processBlmIds();
      },
    };

    tokenObservable.subscribe(tokenObserver);
  }

  /**
   * Obtiene el Access Token y posteriormente invoca al método processBlmIds
   */
  enviarNotificaciones() {
    var tokenObservable = this.getToken();

    const tokenObserver = {
      next: (tokenObserverResponse) => {
        tokenObserverResponse.forEach(function (tokenObject) {
          console.log('Token: ' + tokenObject.access_token);

          this.accessToken = tokenObject.access_token;
          //this.showNotif('info','pe-7s-paper-plane', "accessToken: " + accessToken);
        });
      },
      error: (err) => {
        this.showNotif(
          'warning',
          'pe-7s-attention',
          'Se encontró un error: ' + err.message
        );
        console.error('Se encontró un error: ' + err.message);
      },
      complete: () => {
        console.log('tokenObserver got a complete notification');
        this.processBlmIds();
      },
    };

    tokenObservable.subscribe(tokenObserver);
  }

  /**
   * Obtiene los BLMID e invoca para cada uno el servicio de envío de notificación push.
   */
  processBlmIds() {
    var blmidsObservable = this.getBlmIds();

    var cont = 0;

    const idsObserver = {
      next: (idsObserverResponse) => {
        var response = idsObserverResponse as BLMIDObject[];

        console.dir(response);

        for (var i = 0; i < response.length; i++) {
          console.log('BLM_ID: ' + response[i].blmid);

          this.sendPushNotificationProxyWrapper(response[i].blmid);
          cont++;
        }

        /*
        idsObserverResponse.forEach(function (blmidObject){

            console.log("BLM_ID: " + blmidObject.blmid);

            //this.sendPushNotification(blmidObject.blmid);
            this.sendPushNotificationProxyWrapper(blmidObject.blmid);
            cont++;
          });
        */

        //console.log('Observer got a next value: ' + x)
      },
      error: (err) => {
        this.showNotif(
          'warning',
          'pe-7s-attention',
          'Se encontró un error: ' + err.message
        );
        console.error('Se encontró un error: ' + err.message);
      },
      complete: () => {
        console.log('idsObserverResponse got a complete notification');

        this.showNotif(
          'info',
          'pe-7s-paper-plane',
          'Se enviaron ' + cont + ' notificaciones Push'
        );
      },
    };

    blmidsObservable.subscribe(idsObserver);
  }

  sendPushNotificationProxyWrapper(param) {
    var stringResult = this.sendPushNotificationProxy(param);
    console.log(
      'sendPushNotificationProxyWrapper-stringResult: ' + stringResult
    );

    /*
    var observable = this.sendPushNotificationProxy(param);

    const idsObserver = {
      next: idsObserverResponse => {

        var response = idsObserverResponse;


        console.log("sendPushNotificationProxyWrapper-response: " + response);

        

      },
      error: err => {
          this.showNotif('warning','pe-7s-attention', "Se encontró un error: " + err.message);
          console.error('Se encontró un error: ' + err.message);
      },
      complete: () => {
        
        console.log('idsObserverResponse got a complete notification')

        //this.showNotif('info','pe-7s-paper-plane', "Se enviaron " + cont + " notificaciones Push"); 

      }
    };


    observable.subscribe(idsObserver);

    */
  }

  /**
   * Invoca mediante HTTP-GET a la API que obtiene los BLM_ID
   */
  getBlmIds(): Observable<BLMIDObject[]> {
    this.clavesBimbo = this.clavesBimbo
      .replace(';', ',')
      .replace(' ', ',')
      .replace('-', ',')
      .replace('\n', ',');

    var url = this.URL_BLMIDS_API.replace('#IDS#', this.clavesBimbo);

    let response = this.http.get<BLMIDObject[]>(url, {
      responseType: 'json',
    });

    console.log('Response BLMIDS: ' + response);

    return response;
  }

  /**
   * Invoca mediante HTTP-POST a la API que obtiene el Access Token
   */
  getToken(): Observable<TokenObject> {
    var url = this.URL_TOKEN_API;

    let input = new FormData();

    input.append('username', environment.auth_username);
    input.append('password', environment.auth_password);
    input.append('grant_type', environment.auth_grant_type);
    input.append('client_id', environment.auth_client_id);

    return this.http.post<TokenObject>(url, input, {
      //responseType: 'json',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization:
          'Basic ' +
          btoa(environment.oauth_username + ':' + environment.oauth_password),
      },
    });
  }

  /**
   * Invoca mediante HTTP-POST a la API que obtiene el Access Token
   */
  getTokenProxy(): Observable<String> {
    var url = this.URL_TOKEN_API_PROXY;
    return this.http.get<String>(url, {
      responseType: 'json',
    });
  }

  /**
   * Invoca mediante HTTP-POST a la API de envío de notificaciones Push
   */
  sendPushNotification(paramBLMId): Observable<PushNotificationObject> {
    var url = this.URL_PUSH_API;

    return this.http.post<PushNotificationObject>(url, {
      //responseType: 'json',
      data: {
        blm_id: paramBLMId,
        subject: this.asunto,
        message: this.mensaje,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'bearer ' + this.accessToken,
      },
    });
  }

  /**
   * Invoca mediante HTTP-POST a la API de envío de notificaciones Push (Proxy Java)
   */
  sendPushNotificationProxy(
    paramBLMId
  ): //Observable<String>
  String {
    /*
    var url = this.URL_PUSH_API_PROXY;

    console.log("this.accessToken:" + this.accessToken);
    console.log("paramBLMId:" + paramBLMId);
    console.log("this.asunto:" + this.asunto);
    console.log("this.mensaje:" + this.mensaje);



    return this.http.post<String>(url,
      {
        //responseType: 'json',
        data : {
          token : this.accessToken,
          blm_id : paramBLMId,
          subject : this.asunto,
          message : this.mensaje
        },
      }
    );*/

    var url = this.URL_PUSH_API_PROXY.replace('#blmid#', paramBLMId)
      .replace('#subject#', this.asunto.replace(' ', '_'))
      .replace('#message#', this.mensaje.replace(' ', '_'));
    let responseObservable = this.http.get<String>(url, {
      responseType: 'json',
    });

    console.log('Response URL_PUSH_API_PROXY: ' + responseObservable);
    console.dir(responseObservable);

    //return "";

    const pushObserver = {
      next: (pushObserverResponse) => {
        //console.log("tokenObserverResponse: " + tokenObserverResponse);

        var responseJSONString = pushObserverResponse;

        console.log(
          'responseJSONString responseJSONString: ' + responseJSONString
        );

        //var obj = new TokenObjectClass();
        //obj.copyInto(responseJSONString);

        //let jsonObject = responseJSONString as TokenObjectClass;
        //console.log("jsonObject: " + jsonObject);

        //this.accessToken = jsonObject.access_token;

        /*
        tokenObserverResponse.forEach(function (tokenObject){

          console.log("Token: " + tokenObject.access_token);

          this.accessToken = tokenObject.access_token
            //this.showNotif('info','pe-7s-paper-plane', "accessToken: " + accessToken); 
        });
        */
      },
      error: (err) => {
        this.showNotif(
          'warning',
          'pe-7s-attention',
          'Se encontró un error: ' + err.message
        );
        console.error('Se encontró un error: ' + err.message);
      },
      complete: () => {
        console.log('pushObserver got a complete notification');
      },
    };

    responseObservable.subscribe(pushObserver);

    return 'OK';
  }

  /**
   * Consume api sepomex para recuperar Estados y controles de llenado para los dropdowns
   * visual en la parte superior izquierda 
   */


  /**
   * Muestra la notificación en un componente
   * visual en la parte superior derecha de la pantalla
   */
  showNotif(paramType, paramIcon, paramText) {
    $.notify(
      {
        icon: paramIcon,
        message: paramText,
      },
      {
        type: paramType,
        timer: 1000,
        placement: {
          from: 'top',
          align: 'right',
        },
      }
    );
  }
}

/** JSON API Objects */

/**
 * Objetos de la respuesta del Servicio para obtener los blmid
 */
export interface BLMIDObject {
  blmid: string;
}

/**
 * Objeto de la respuesta del Servicio para obtener el Access Token
 */
export interface TokenObject {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

export class TokenObjectClass {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

/**
 * Objeto de la respuesta del Servicio que envía las notificaciones push
 */
export interface PushNotificationObject {
  qpay_response: string;
  qpay_code: string;
  qpay_description: string;
}

/**
 * Objeto para el llenado de dropdwons por estado
 */

interface Estado {
  id: string;
  name: string;
}