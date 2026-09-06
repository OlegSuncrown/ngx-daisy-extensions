import { Component, computed, ElementRef, input, signal, viewChild } from '@angular/core';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import { format } from 'prettier/standalone';
import * as estreePlugin from 'prettier/plugins/estree';
import * as htmlPlugin from 'prettier/plugins/html';
import * as typescriptPlugin from 'prettier/plugins/typescript';
import type { Plugin } from 'prettier';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);

const HTML_PLUGINS = [htmlPlugin as unknown as Plugin];
const TYPESCRIPT_PLUGINS = [typescriptPlugin as unknown as Plugin, estreePlugin as unknown as Plugin];

@Component({
  selector: 'app-demo-code',
  templateUrl: './demo-code.html',
  host: {
    class: 'inline-flex',
  },
})
export class DemoCode {
  readonly title = input('Code');
  readonly htmlCode = input.required<string>();
  readonly tsCode = input('');

  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly activeTab = signal<'html' | 'ts'>('html');
  protected readonly copied = signal(false);
  protected readonly isFormatting = signal(false);
  protected readonly formattedCode = signal('');

  protected readonly displayedCode = computed(() =>
    this.activeTab() === 'ts' && this.tsCode() ? this.tsCode() : this.htmlCode(),
  );
  protected readonly highlightedCode = computed(() => {
    const language = this.activeTab() === 'html' ? 'xml' : 'typescript';
    return hljs.highlight(this.formattedCode(), { language, ignoreIllegals: true }).value;
  });

  private formatRun = 0;

  open() {
    this.activeTab.set('html');
    this.copied.set(false);
    void this.formatCurrentCode();
    this.dialog()?.nativeElement.showModal();
  }

  selectTab(tab: 'html' | 'ts') {
    this.activeTab.set(tab);
    this.copied.set(false);
    void this.formatCurrentCode();
  }

  copy() {
    void navigator.clipboard.writeText(this.formattedCode()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }

  private async formatCurrentCode() {
    const code = this.displayedCode();
    const run = ++this.formatRun;

    this.isFormatting.set(true);
    this.formattedCode.set(this.normalizeCode(code));

    try {
      const formatted = await format(code, {
        parser: this.activeTab() === 'html' ? 'angular' : 'typescript',
        plugins: this.activeTab() === 'html' ? HTML_PLUGINS : TYPESCRIPT_PLUGINS,
        printWidth: 100,
        singleQuote: true,
      });

      if (run === this.formatRun) {
        this.formattedCode.set(formatted.trimEnd());
      }
    } catch {
      if (run === this.formatRun) {
        this.formattedCode.set(this.normalizeCode(code));
      }
    } finally {
      if (run === this.formatRun) {
        this.isFormatting.set(false);
      }
    }
  }

  private normalizeCode(code: string): string {
    const lines = code.replace(/\t/g, '  ').split('\n');

    while (lines.length > 0 && lines[0].trim() === '') {
      lines.shift();
    }
    while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
      lines.pop();
    }

    const minIndent = lines
      .filter((line) => line.trim().length > 0)
      .reduce((indent, line) => Math.min(indent, line.match(/^ */)?.[0].length ?? 0), Number.POSITIVE_INFINITY);

    if (!Number.isFinite(minIndent) || minIndent === 0) {
      return lines.join('\n');
    }

    return lines.map((line) => line.slice(minIndent)).join('\n');
  }

}
