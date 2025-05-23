import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApplicationComponent } from './add-application.component';

describe('AddApplicationModalComponent', () => {
  let component: AddApplicationComponent;
  let fixture: ComponentFixture<AddApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
