import { Component, OnInit } from '@angular/core';
import {BlogService, Entry} from '../../shared/blog.service';
import {ApiService} from '../../shared/api.service';
import {ToastrService} from 'ngx-toastr';

/**
 * create a new entry
 */
@Component({
  selector: 'app-new-entry',
  templateUrl: './new-entry.component.html',
  styleUrls: ['./new-entry.component.css']
})
export class NewEntryComponent implements OnInit {

  /**
   * is editing
   */
  isEditing = false;

  /**
   * params of new entry
   */
  newEntry: Entry = {
    title: '',
    text: '',
    tags: []
  };

  /**
   * constructor defining all private services
   * DO NOT MAKE SERVICE PUBLIC!
   * @param api api service for calling backend
   * @param toastr showing informations to the user with the toastr service
   * @param data data service for holding the data in the application
   */
  constructor(private api: ApiService, private toastr: ToastrService, private data: BlogService) { }

  ngOnInit() {
  }

  /**
   * create the entry
   */
  public createEntry(): void {
    this.api.createEntry(this.newEntry).subscribe(elem => {
      console.log(elem);
      this.toastr.success('created new entry', 'Success');
      this.newEntry = {
        title: '',
        text: ''
      };
      this.isEditing = !this.isEditing;
      this.data.addNewEntry(elem);
    });
  }

  /**
   * stop editing
   */
  public toggleEntry(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.newEntry = {
        title: '',
        text: '',
        tags: []
      };
    }
  }

  /**
   * add a tag
   * @param travelTag
   */
  public addTravelTag(travelTag: string) {
    this.newEntry.tags.push(travelTag);
    console.log(this.newEntry.tags);
  }

}
