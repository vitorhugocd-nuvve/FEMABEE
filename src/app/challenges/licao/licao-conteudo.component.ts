import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { marked, Token } from "marked";
import { CodeEditorComponent } from "../../../ui/code-editor/code-editor.component";
import { MermaidComponent } from "../../../ui/mermaid/mermaid.component";

type BlocoLicao =
    | { tipo: 'codigo'; linguagem: string; conteudo: string }
    | { tipo: 'html'; conteudo: SafeHtml };

/**
 * Renderiza o `conteudoMarkdown` de uma Lição (texto, imagens, código e diagramas Mermaid) numa
 * "página" de leitura — usado tanto pelo desafio de Lição em si quanto pela Enciclopédia (livrinho
 * do mapa), pra não duplicar o parsing de Markdown em dois lugares.
 */
@Component({
    selector: 'app-licao-conteudo',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="licao-coluna shadow-border border-2 border-black flex flex-col gap-4 shrink-0">
        @for (bloco of blocos(); track $index) {
            @if (bloco.tipo === 'codigo' && bloco.linguagem === 'mermaid') {
                <bee-mermaid class="shrink-0" [diagrama]="bloco.conteudo" />
            } @else if (bloco.tipo === 'codigo') {
                <bee-code-editor class="w-full shrink-0" [class]="alturaCodigo()" [value]="bloco.conteudo" [language]="bloco.linguagem" [readOnly]="true" />
            } @else {
                <div class="licao-conteudo" [innerHTML]="bloco.conteudo"></div>
            }
        }
        <ng-content />
    </div>
    `,
    imports: [CodeEditorComponent, MermaidComponent]
})
export class LicaoConteudoComponent {
    private readonly sanitizer = inject(DomSanitizer);

    readonly markdown = input.required<string>();
    readonly alturaCodigo = input('h-56');

    readonly blocos = computed<BlocoLicao[]>(() => {
        const markdown = this.markdown();
        if (!markdown) return [];

        return marked.lexer(markdown).map((token: Token): BlocoLicao => {
            if (token.type === 'code') {
                return { tipo: 'codigo', linguagem: token.lang || 'plaintext', conteudo: token.text };
            }
            return { tipo: 'html', conteudo: this.sanitizer.bypassSecurityTrustHtml(marked.parser([token])) };
        });
    });
}
