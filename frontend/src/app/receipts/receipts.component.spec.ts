import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptsComponent } from './receipts.component';

describe('ReceiptsComponent', () => {
  let component: ReceiptsComponent;
  let fixture: ComponentFixture<ReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
