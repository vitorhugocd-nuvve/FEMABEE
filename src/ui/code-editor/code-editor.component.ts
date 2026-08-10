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
 * Editor de código somente leitura baseado no Monaco Editor.
 * O Monaco é carregado via CDN em runtime (mesmo princípio do `bee-icon`
 * com o pixelarticons) em vez de empacotado no bundle da aplicação.
 */
@Component({
    selector: 'bee-code-editor',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div #container class="code-editor__container"></div>
    @if (carregando()) {
        <div class="code-editor__loading">Carregando editor...</div>
    }
    `,
    styles: [`
    :host {
        display: block;
        position: relative;
        width: 100%;
    }
    .code-editor__container {
        width: 100%;
        height: 100%;
    }
    .code-editor__loading {
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
export class CodeEditorComponent implements OnDestroy {
    @ViewChild('container', { static: true })
    private containerEl!: ElementRef<HTMLDivElement>;

    readonly value = input.required<string>();
    readonly language = input<string>('plaintext');
    readonly readOnly = input(true);

    protected readonly carregando = signal(true);

    private readonly screenService = inject(ScreenService);

    private monaco?: Monaco;
    private editor?: editor.IStandaloneCodeEditor;
    private readonly initPromise = loader.init();

    constructor() {
        this.initPromise.then(monaco => {
            this.monaco = monaco;
            this.editor = monaco.editor.create(this.containerEl.nativeElement, {
                value: this.value(),
                language: this.language(),
                readOnly: this.readOnly(),
                automaticLayout: true,
                minimap: { enabled: false },
                fontSize: this.screenService.isMobile() ? 15 : 13,
                lineNumbersMinChars: 3,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                wrappingIndent: 'indent',
                padding: { top: 8, bottom: 8 },
                scrollbar: { horizontal: 'hidden', alwaysConsumeMouseWheel: false },
                theme: 'vs-dark',
            });
            this.carregando.set(false);
        });

        effect(() => {
            const value = this.value();
            const model = this.editor?.getModel();
            if (model && model.getValue() !== value) {
                model.setValue(value);
            }
        });

        effect(() => {
            const language = this.language();
            const model = this.editor?.getModel();
            if (model && this.monaco) {
                this.monaco.editor.setModelLanguage(model, language);
            }
        });

        effect(() => {
            this.editor?.updateOptions({ readOnly: this.readOnly() });
        });

        effect(() => {
            this.editor?.updateOptions({ fontSize: this.screenService.isMobile() ? 15 : 13 });
        });
    }

    ngOnDestroy(): void {
        this.editor?.dispose();
        this.initPromise.cancel();
    }
}
