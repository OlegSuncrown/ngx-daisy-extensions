import { DOCUMENT } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface ThemeOption {
  value: string;
  label: string;
}

const THEME_STORAGE_KEY = 'ngx-daisy-extensions-theme';

const THEMES: ThemeOption[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'abyss', label: 'Abyss' },
  { value: 'acid', label: 'Acid' },
  { value: 'aqua', label: 'Aqua' },
  { value: 'autumn', label: 'Autumn' },
  { value: 'black', label: 'Black' },
  { value: 'bumblebee', label: 'Bumblebee' },
  { value: 'business', label: 'Business' },
  { value: 'caramellatte', label: 'Caramellatte' },
  { value: 'cmyk', label: 'CMYK' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'cupcake', label: 'Cupcake' },
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'dim', label: 'Dim' },
  { value: 'dracula', label: 'Dracula' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'forest', label: 'Forest' },
  { value: 'garden', label: 'Garden' },
  { value: 'halloween', label: 'Halloween' },
  { value: 'lemonade', label: 'Lemonade' },
  { value: 'lofi', label: 'Lofi' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'night', label: 'Night' },
  { value: 'nord', label: 'Nord' },
  { value: 'pastel', label: 'Pastel' },
  { value: 'retro', label: 'Retro' },
  { value: 'silk', label: 'Silk' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'synthwave', label: 'Synthwave' },
  { value: 'valentine', label: 'Valentine' },
  { value: 'wireframe', label: 'Wireframe' },
  { value: 'winter', label: 'Winter' },
];

function readStoredTheme(): string {
  if (typeof localStorage === 'undefined') {
    return 'abyss';
  }
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored && THEMES.some((t) => t.value === stored) ? stored : 'abyss';
}

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly document = inject(DOCUMENT);

  protected readonly themes = THEMES;
  protected readonly theme = signal(readStoredTheme());

  constructor() {
    effect(() => {
      const theme = this.theme();
      this.document.documentElement.setAttribute('data-theme', theme);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      }
    });
  }
}
