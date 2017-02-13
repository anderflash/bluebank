/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LandpageComponent } from './landpage.component';

describe('LandpageComponent', () => {
  let component: LandpageComponent;
  let fixture: ComponentFixture<LandpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
