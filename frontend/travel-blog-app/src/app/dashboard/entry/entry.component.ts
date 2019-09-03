import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {BlogService, Entry} from '../../shared/blog.service';
import {ApiService} from '../../shared/api.service';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

/**
 * component for travel entry
 */
@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {

  /**
   * @type Entry entry that is displayed in the component
   */
  @Input() entry: Entry;

  /**
   * @type Entry
   * entry for editing data
   */
  editingEntry: Entry;

  /**
   * userId for coloring the entries from a user in another color
   */
  userId: string;

  // only write type if value is not set otherwise its redundant
  /**
   * is editing if true the user can edit otherwise editing is disabled
   * @type Boolean
   */
  public isEditing = false;


  /**
   * dependency for modals inside the application
   */
  modalRef: BsModalRef;

  /**
   * constructor defining all private services
   * DO NOT MAKE SERVICE PUBLIC!
   * @param api api service for calling backend
   * @param data data service for holding the data in the application
   * @param toastr showing informations to the user with the toastr service
   */
  constructor(private api: ApiService, private data: BlogService,
              private toastr: ToastrService, private modalService: BsModalService) {

  }

  /**
   * calcs the images for the entry
   */
  ngOnInit() {
    const imageNumber =  Math.floor(Math.random() * 3) + 1;
    this.entry.image = `../../../assets/${imageNumber}.jpeg`;

    // set the user id from the datastore
    if (this.data.dataStore.currentUser.id) {
      this.userId = this.data.dataStore.currentUser.id;
    }

  }

  /**
   * enable and disable editing
   */
  public editing(): void {
    if (!this.isEditing) {
      this.editingEntry = this.entry;
    }
    this.isEditing = !this.isEditing;
  }

  /**
   * save an entry to the database
   */
  public save() {
    console.log(this.entry.title);
    // if used more often a parser function could be writen
    const updateEntry = {
      id: this.editingEntry.id,
      title: this.entry.title,
      text: this.editingEntry.text,
      date: this.editingEntry.date,
      author: this.editingEntry.author, // nickname
      author_id: this.editingEntry.author_id,
      tags: this.editingEntry.tags
    }
    this.api.updateEntry(updateEntry).subscribe(elem => {
      this.data.updateExistingEntry(elem);
      this.editing();
      this.toastr.success(`Updated Entry with title: ${this.editingEntry.title}`, 'Success!');
    });
  }


  /**
   * opens the modals from the class, here suggestion modal
   * @param {TemplateRef<any>} template
   */
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  /**
   * closes the modal
   * @param {TemplateRef<any>} template
   */
  closeModal(template: TemplateRef<any>) {
    this.modalRef.hide();
  }


  /**
   * delete an entry from the database
   */
  public delete() {
    this.api.deleteEntry(this.entry).subscribe(elem => {
      this.data.removeExistingEntry(this.entry.id);
      this.modalRef.hide();
      this.toastr.success('deleted entry!', 'Success!');
    });
  }

  /**
   * add a traveltag to the current entry
   * @param travelTag
   */
  public addTravelTag(travelTag: string) {
    this.editingEntry.tags.push(travelTag);
    console.log(this.editingEntry.tags);
  }

}
