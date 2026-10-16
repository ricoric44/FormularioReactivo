import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { IonicModule } from '@ionic/angular/lazy';

import { DrivenPage } from './driven.page';
import { NavFormulariosComponent } from '../components/nav-formularios.component';
import { EdadMinimaDirective, FechaNoFuturaDirective } from '../validators/fecha.validators';

describe('DrivenPage', () => {
  let component: DrivenPage;
  let fixture: ComponentFixture<DrivenPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrivenPage],
      imports: [IonicModule.forRoot(), FormsModule, NavFormulariosComponent, FechaNoFuturaDirective, EdadMinimaDirective],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(DrivenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
