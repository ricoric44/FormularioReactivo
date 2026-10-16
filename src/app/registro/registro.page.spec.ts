import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular/lazy';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { NavFormulariosComponent } from '../components/nav-formularios.component';

import { RegistroPage } from './registro.page';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, NavFormulariosComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
