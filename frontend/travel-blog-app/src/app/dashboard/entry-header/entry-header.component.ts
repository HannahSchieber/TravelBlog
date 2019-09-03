import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

/**
 * header of an entry
 */
@Component({
  selector: 'app-entry-header',
  templateUrl: './entry-header.component.html',
  styleUrls: ['./entry-header.component.css']
})
export class EntryHeaderComponent implements OnInit {

  /**
   * is editing enabled
   */
  @Input() isEditing: boolean;
  /**
   * author of the entry
   */
  @Input() author: string;
  /**
   * last changed entry date
   */
  @Input() entryDate: Date;

  /**
   * title value
   */
  titleValue = '';

  /**
   * get the title
   */
  @Input() get title() {
    return this.titleValue;
  }

  /**
   * emit changed title
   */
  @Output() titleChange = new EventEmitter();

  /**
   * set the title
   * @param val
   */
  set title(val) {
    this.titleValue = val;
    this.titleChange.emit(this.titleValue);
  }

  constructor() { }

  ngOnInit() {
  }

}
