import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
    effect,
    inject,
    input,
    signal,
} from '@angular/core';
import loader, { Monaco } from '@monaco-editor/loader';
import type { editor } from 'monaco-editor';
import { ScreenService } from '../../services/tela/screen.service';

/**
 * Visualizador de diff somente leitura baseado no Monaco Editor (modo inline,
 * como um "git diff" de terminal). O Monaco é carregado via CDN em runtime,
 * mesmo princípio do `bee-code-editor` e do `bee-icon`.
 */
@Component({
    selector: 'bee-code-diff',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div #container class="code-diff__container"></div>
    @if (carregando()) {
        <div class="code-diff__loading">Carregando editor...</div>
    }
    `,
    styles: [`
    :host {
        display: block;
        position: relative;
        width: 100%;
    }
    .code-diff__container {
        width: 100%;
        height: 100%;
    }
    .code-diff__loading {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #1e1e1e;
        color: #ccc;
        font-size: 0.75rem;
    }
    `],
    host: { class: 'block w-full border-2 border-black shadow-border overflow-hidden' }
})
export class CodeDiffComponent implements OnDestroy {
    @ViewChild('container', { static: true })
    private containerEl!: ElementRef<HTMLDivElement>;

    readonly original = input.required<string>();
    readonly modified = input.required<string>();
    readonly language = input<string>('plaintext');

    protected readonly carregando = signal(true);

    private readonly screenService = inject(ScreenService);

    private monaco?: Monaco;
    private diffEditor?: editor.IStandaloneDiffEditor;
    private originalModel?: editor.ITextModel;
    private modifiedModel?: editor.ITextModel;
    private readonly initPromise = loader.init();

    constructor() {
        this.initPromise.then(monaco => {
            this.monaco = monaco;
            const originalModel = monaco.editor.createModel(this.original(), this.language());
            const modifiedModel = monaco.editor.createModel(this.modified(), this.language());
            this.originalModel = originalModel;
            this.modifiedModel = modifiedModel;

            const diffEditor = monaco.editor.createDiffEditor(this.containerEl.nativeElement, {
                readOnly: true,
                renderSideBySide: false,
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: this.screenService.isMobile() ? 12 : 13,
                lineNumbers: 'off',
                glyphMargin: false,
                folding: false,
                lineDecorationsWidth: 4,
                renderOverviewRuler: false,
                scrollBeyondLastLine: false,
                wordWrap: 'off',
                padding: { top: 8, bottom: 8 },
                scrollbar: { horizontal: 'auto', alwaysConsumeMouseWheel: false },
                theme: 'vs-dark',
            });
            diffEditor.setModel({ original: originalModel, modified: modifiedModel });
            this.diffEditor = diffEditor;
            this.carregando.set(false);
        });

        effect(() => {
            const value = this.original();
            if (this.originalModel && this.originalModel.getValue() !== value) {
                this.originalModel.setValue(value);
            }
        });

        effect(() => {
            const value = this.modified();
            if (this.modifiedModel && this.modifiedModel.getValue() !== value) {
                this.modifiedModel.setValue(value);
            }
        });

        effect(() => {
            const language = this.language();
            if (this.monaco && this.originalModel) this.monaco.editor.setModelLanguage(this.originalModel, language);
            if (this.monaco && this.modifiedModel) this.monaco.editor.setModelLanguage(this.modifiedModel, language);
        });

        effect(() => {
            const fontSize = this.screenService.isMobile() ? 12 : 13;
            this.diffEditor?.updateOptions({ fontSize });
        });
    }

    ngOnDestroy(): void {
        this.diffEditor?.dispose();
        this.originalModel?.dispose();
        this.modifiedModel?.dispose();
        this.initPromise.cancel();
    }
}
