import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDashboardPageComponent } from './chat-dashboard-page.component';

describe('ChatDashboardPageComponent', () => {
  let component: ChatDashboardPageComponent;
  let fixture: ComponentFixture<ChatDashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatDashboardPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
