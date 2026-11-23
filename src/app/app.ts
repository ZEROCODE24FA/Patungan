import { Component, computed, signal } from '@angular/core';
import { ItemRow } from './components/item-row';
import { Stepper } from './components/stepper';
import { ITEMS, JUMLAH_ORANG, PAJAK_PERSEN } from './data/menu';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ItemRow, Stepper, CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './app.html',
})
export class App {
  protected readonly tanggal = new Date();
  protected readonly items = signal(ITEMS);

  protected readonly newName = signal('');
  protected readonly newPrice = signal<number | null>(null);

  protected readonly isContoh = signal(true);
  protected readonly peringatan = signal(false);

  protected readonly jumlahOrang = signal(JUMLAH_ORANG);
  protected readonly pajakPersen = signal(PAJAK_PERSEN);

  protected readonly subtotal = computed(() =>
    this.items().reduce((sum, i) => sum + i.price * i.qty, 0),
  );
  protected readonly pajak = computed(() => (this.subtotal() * this.pajakPersen()) / 100);
  protected readonly total = computed(() => this.subtotal() + this.pajak());
  protected readonly perOrang = computed(() =>
    Math.ceil(this.total() / Math.max(1, this.jumlahOrang())),
  );

  protected readonly kategori = computed(() => {
    const p = this.perOrang();
    if (p < 25000) return { label: 'Murah', kelas: 'kat-murah' };
    if (p < 75000) return { label: 'Wajar', kelas: 'kat-wajar' };
    return { label: 'Mahal', kelas: 'kat-mahal' };
  });

  protected setPajak(value: number | null) {
    this.pajakPersen.set(Math.max(0, value ?? 0));
  }

  protected setQty(id: number, qty: number) {
    this.items.update((list) => list.map((i) => (i.id === id ? { ...i, qty } : i)));
  }

  protected remove(id: number) {
    this.items.update((list) => list.filter((i) => i.id != id));
    if (this.items().length === 0) this.isContoh.set(false);
  }

  protected clear() {
    if (!this.isContoh() && !confirm('Kosongkan semua item?')) return;
    this.items.set([]);
    this.isContoh.set(false);
    this.peringatan.set(false);
  }

  protected add() {
    if (this.isContoh()) {
      this.peringatan.set(true);
      return;
    }
    const name = this.newName().trim();
    const price = this.newPrice();
    if (!name || !price || price <= 0) return;
    const id = Math.max(0, ...this.items().map((i) => i.id)) + 1;

    this.items.update((list) => [...list, { id, name, price, qty: 1 }]);

    this.newName.set('');
    this.newPrice.set(null);
  }

  protected cetak() {
    const judul = document.title;
    document.title = 'Nota Patungan';
    window.print();
    document.title = judul;
  }
}