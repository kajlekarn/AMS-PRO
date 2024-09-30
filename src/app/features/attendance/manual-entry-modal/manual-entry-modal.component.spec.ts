import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualEntryModalComponent } from './manual-entry-modal.component';

describe('ManualEntryModalComponent', () => {
  let component: ManualEntryModalComponent;
  let fixture: ComponentFixture<ManualEntryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualEntryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualEntryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
