import { Component, OnInit } from '@angular/core';
import {BlogService, Entry} from '../../shared/blog.service';
import {ApiService, Token} from '../../shared/api.service';
import {AuthService} from '../../service/auth.service';

/**
 * home view component
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  /**
   * searchterm for filter pipe
   */
  searchTerm: string;

  /**
   * all entries
   */
  entries: Entry[];

  /**
   * constructor defining all private services
   * DO NOT MAKE SERVICE PUBLIC!
   * @param api api service for calling backend
   * @param data data service for holding the data in the application
   * @param auth authentication service for the auth guard
   */
  constructor(private api: ApiService, private data: BlogService, private auth: AuthService) {

  }

  /**
   * get all entries on load
   * check if user is authenticated
   */
  ngOnInit() {
    this.api.getAllEntries().subscribe(elem => {
      this.data.setAllEntries(elem);
      this.entries = this.data.dataStore.listOfAllEntries;
    });

    console.log('init dashboard',  (localStorage.getItem('token') !== 'undefined'));
    if ((localStorage.getItem('token') && localStorage.getItem('user'))
    && !(localStorage.getItem('token') === 'undefined')) {
      const user: Token = {
        accessToken: localStorage.getItem('token'),
        id: localStorage.getItem('user')
      };
      this.data.setUser(user);
    } else {

      this.auth.logout();
    }
  }

}
