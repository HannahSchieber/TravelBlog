import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelTagsComponent } from './travel-tags.component';

describe('TravelTagsComponent', () => {
  let component: TravelTagsComponent;
  let fixture: ComponentFixture<TravelTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
