import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAdminComponent } from './change-admin.component';

describe('ChangeAdminComponent', () => {
  let component: ChangeAdminComponent;
  let fixture: ComponentFixture<ChangeAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
