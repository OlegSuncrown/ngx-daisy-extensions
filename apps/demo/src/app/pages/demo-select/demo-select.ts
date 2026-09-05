import { Component, computed, signal } from '@angular/core';
import { DxeSelectImports } from '@dxe/select';
import { DxeSelectionIndicator } from '@dxe/shared';

interface Framework {
  id: string;
  name: string;
}

const FRAMEWORKS: Framework[] = [
  { id: 'angular', name: 'Angular' },
  { id: 'react', name: 'React' },
  { id: 'svelte', name: 'Svelte' },
  { id: 'vue', name: 'Vue' },
];

@Component({
  selector: 'app-demo-select-page',
  imports: [DxeSelectImports, DxeSelectionIndicator],
  templateUrl: './demo-select.html',
})
export class DemoSelectPage {
  protected readonly frameworks = FRAMEWORKS;
  protected readonly selectedFrameworks = signal<Framework[]>([]);
  protected readonly displayValue = computed(() =>
    this.selectedFrameworks()
      .map((framework) => framework.name)
      .join(', '),
  );
}
