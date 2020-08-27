import { Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component';
import { UserComponent } from '../../user/user.component';
import { DropdownMultiselectComponent } from '../../dropdown-multiselect/dropdown-multiselect.component';

import { TablesComponent } from '../../tables/tables.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { EmailComponent } from 'app/email/email.component';
import { SmsComponent } from 'app/sms/sms.component';

export const AdminLayoutRoutes: Routes = [
  { path: 'dashboard', component: HomeComponent },
  { path: 'user', component: UserComponent },
  { path: 'email', component: EmailComponent },
  { path: 'sms', component: SmsComponent },

  //{ path: 'dropdown', component: DropdownMultiselectComponent},
  //{ path: 'table', component: TablesComponent },
  //{ path: 'typography', component: TypographyComponent },
  //{ path: 'icons', component: IconsComponent },
  //{ path: 'maps', component: MapsComponent },
  //{ path: 'notifications', component: NotificationsComponent },
  //{ path: 'upgrade', component: UpgradeComponent },
];
