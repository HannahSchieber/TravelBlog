import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTravelTagsComponent } from './new-travel-tags.component';

describe('NewTravelTagsComponent', () => {
  let component: NewTravelTagsComponent;
  let fixture: ComponentFixture<NewTravelTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTravelTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTravelTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
