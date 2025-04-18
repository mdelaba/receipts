import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterEmailComponent } from './enter-email.component';

describe('EnterEmailComponent', () => {
  let component: EnterEmailComponent;
  let fixture: ComponentFixture<EnterEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
