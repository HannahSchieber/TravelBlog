import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryHeaderComponent } from './entry-header.component';

describe('EntryHeaderComponent', () => {
  let component: EntryHeaderComponent;
  let fixture: ComponentFixture<EntryHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
