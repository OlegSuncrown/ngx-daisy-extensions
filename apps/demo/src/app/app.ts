import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { DxeSelectImports } from '@dxe/select';
import { DxeSelectionIndicator } from '@dxe/shared';

interface ThemeOption {
  value: string;
  label: string;
  icon: string;
}

const THEME_STORAGE_KEY = 'ngx-daisy-extensions-theme';

const THEMES: ThemeOption[] = [
  { value: 'light', label: 'Light', icon: 'light_mode' },
  { value: 'dark', label: 'Dark', icon: 'dark_mode' },
  { value: 'abyss', label: 'Abyss', icon: 'brightness_low' },
  { value: 'acid', label: 'Acid', icon: 'science' },
  { value: 'aqua', label: 'Aqua', icon: 'water_drop' },
  { value: 'autumn', label: 'Autumn', icon: 'eco' },
  { value: 'black', label: 'Black', icon: 'contrast' },
  { value: 'bumblebee', label: 'Bumblebee', icon: 'pets' },
  { value: 'business', label: 'Business', icon: 'business_center' },
  { value: 'caramellatte', label: 'Caramellatte', icon: 'coffee' },
  { value: 'cmyk', label: 'CMYK', icon: 'palette' },
  { value: 'coffee', label: 'Coffee', icon: 'coffee' },
  { value: 'corporate', label: 'Corporate', icon: 'apartment' },
  { value: 'cupcake', label: 'Cupcake', icon: 'cake' },
  { value: 'cyberpunk', label: 'Cyberpunk', icon: 'memory' },
  { value: 'dim', label: 'Dim', icon: 'brightness_2' },
  { value: 'dracula', label: 'Dracula', icon: 'bedtime' },
  { value: 'emerald', label: 'Emerald', icon: 'diamond' },
  { value: 'fantasy', label: 'Fantasy', icon: 'auto_awesome' },
  { value: 'forest', label: 'Forest', icon: 'forest' },
  { value: 'garden', label: 'Garden', icon: 'local_florist' },
  { value: 'halloween', label: 'Halloween', icon: 'pumpkin' },
  { value: 'lemonade', label: 'Lemonade', icon: 'local_bar' },
  { value: 'lofi', label: 'Lofi', icon: 'graphic_eq' },
  { value: 'luxury', label: 'Luxury', icon: 'diamond' },
  { value: 'night', label: 'Night', icon: 'nightlight' },
  { value: 'nord', label: 'Nord', icon: 'ac_unit' },
  { value: 'pastel', label: 'Pastel', icon: 'brush' },
  { value: 'retro', label: 'Retro', icon: 'history' },
  { value: 'silk', label: 'Silk', icon: 'style' },
  { value: 'sunset', label: 'Sunset', icon: 'wb_twilight' },
  { value: 'synthwave', label: 'Synthwave', icon: 'music_note' },
  { value: 'valentine', label: 'Valentine', icon: 'favorite' },
  { value: 'wireframe', label: 'Wireframe', icon: 'grid_4x4' },
  { value: 'winter', label: 'Winter', icon: 'ac_unit' },
];

function readStoredTheme(): string {
  if (typeof localStorage === 'undefined') {
    return 'dracula';
  }
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored && THEMES.some((t) => t.value === stored) ? stored : 'dracula';
}

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CdkScrollable, DxeSelectImports, DxeSelectionIndicator],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly document = inject(DOCUMENT);

  protected readonly themes = THEMES;
  protected readonly selectedValues = signal<string[]>([readStoredTheme()]);

  protected readonly theme = computed(() => this.selectedValues()[0] ?? 'light');
  protected readonly themeIcon = computed(() => {
    const value = this.theme();
    return this.themes.find((t) => t.value === value)?.icon ?? '';
  });
  protected readonly themeLabel = computed(() => {
    const value = this.theme();
    return this.themes.find((t) => t.value === value)?.label ?? 'Light';
  });

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
