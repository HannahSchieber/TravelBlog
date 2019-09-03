import {Component, EventEmitter, OnInit, Output} from '@angular/core';

/**
 * new travel tag
 */
@Component({
  selector: 'app-new-travel-tags',
  templateUrl: './new-travel-tags.component.html',
  styleUrls: ['./new-travel-tags.component.css']
})
export class NewTravelTagsComponent implements OnInit {


  /**
   * name of the travel tag
   */
  travelTag = '';

  /**
   * output emitter for travel tag
   */
  @Output() newTravelTag = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  /**
   * emit the new travel tag
   */
  public addTravelTag(): void {
    this.newTravelTag.emit(this.travelTag);
    this.travelTag = '';
  }

}
