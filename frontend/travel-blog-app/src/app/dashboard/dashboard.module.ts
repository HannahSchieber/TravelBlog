import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import {AuthGuardService} from '../guards/auth-guard.service';
import {RouterModule} from '@angular/router';
import { dashboardRoutes } from './dashboard.routes';
import { EntryComponent } from './entry/entry.component';
import {FormsModule} from '@angular/forms';
import {FilterPipe} from '../filter/filter.pipe';
import { NewEntryComponent } from './new-entry/new-entry.component';
import { TravelTagsComponent } from './travel-tags/travel-tags.component';
import { NewTravelTagsComponent } from './new-travel-tags/new-travel-tags.component';
import { EntryHeaderComponent } from './entry-header/entry-header.component';


@NgModule({
  declarations: [
    HomeComponent,
    EntryComponent,
    FilterPipe,
    NewEntryComponent,
    TravelTagsComponent,
    NewTravelTagsComponent,
    EntryHeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(dashboardRoutes)
  ],
  providers: [
    AuthGuardService
  ]
})
export class DashboardModule { }
