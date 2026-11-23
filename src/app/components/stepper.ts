import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-stepper',
  template: `
    <div class="btn-group btn-group-sm" role="group">
      <button
        type="button"
        class="btn btn-outline-secondary"
        [disabled]="value() <= min()"
        (click)="change(-1)"
        >
        -
      </button>

      <span class="btn btn-light disabled">{{ value() }}</span>
      
      <button
        type="button"
        class="btn btn-outline-secondary"
        [disabled]="value() >= max()"
        (click)="change(1)"
        >
        +
      </button>
    </div>
  `,
})
export class Stepper {
  value = model(1);
  min = input(0);
  max = input(99);

  change(step: number) {
    const next = this.value() + step;
    if (next >= this.min() && next <= this.max()) {
      this.value.set(next);
    }
  }
}