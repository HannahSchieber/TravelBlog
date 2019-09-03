import {Component, Input, OnInit} from '@angular/core';

/**
 * travel tag of an entry
 */
@Component({
  selector: 'app-travel-tags',
  templateUrl: './travel-tags.component.html',
  styleUrls: ['./travel-tags.component.css']
})
export class TravelTagsComponent implements OnInit {

  /**
   * array of existing travel tags
   */
  @Input() travelTags: string[];

  constructor() { }

  ngOnInit() {
  }

}
