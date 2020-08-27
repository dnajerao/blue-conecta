import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [

  //{ path: '/sendPush', title: 'Notificaciones Push',  icon:'pe-7s-bell', class: '' },
  //{ path: '/sendMail', title: 'Correo Electrónico',  icon:'pe-7s-mail', class: '' },
  //{ path: '/sendSms', title: 'Mensajes SMS',  icon:'pe-7s-comment', class: '' },

  

    //{ path: '/dashboard', title: 'Dashboard',  icon: 'pe-7s-graph', class: '' },
    { path: '/user', title: 'Notificaciones Push',  icon:'pe-7s-bell', class: '' },
    { path: '/email', title: 'Correo electrónico',  icon:'pe-7s-rocket', class: '' },
    { path: '/sms', title: 'SMS',  icon:'pe-7s-rocket', class: '' },
    //{ path: '/dropdown', title: 'Dropdown',  icon:'pe-7s-rocket', class: '' },
    //{ path: '/user/mail', title: 'Notificaciones Push Mail',  icon:'pe-7s-bell', class: '' },
    //{ path: '/table', title: 'Table List',  icon:'pe-7s-note2', class: '' },
    //{ path: '/typography', title: 'Typography',  icon:'pe-7s-news-paper', class: '' },
    //{ path: '/icons', title: 'Icons',  icon:'pe-7s-science', class: '' },
    //{ path: '/maps', title: 'Maps',  icon:'pe-7s-map-marker', class: '' },
    //{ path: '/notifications', title: 'Notifications',  icon:'pe-7s-bell', class: '' },
    //{ path: '/upgrade', title: 'Upgrade to PRO',  icon:'pe-7s-rocket', class: 'active-pro' },

    { path: '/logout', title: 'Salir',  icon:'pe-7s-rocket', class: 'active-pro' },


];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
