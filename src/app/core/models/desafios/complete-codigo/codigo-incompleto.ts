import { Trecho } from "./trecho";

export type CodigoIncompletoProps = {
    id: string;
    /** Nome exibido acima do editor, ex.: "Singleton.java" */
    arquivo: string;
    /** Id de linguagem do Monaco Editor, ex.: "java" */
    linguagem: string;
    /** Template do código com o marcador {{1}} indicando o trecho faltante */
    template: string;
    opcoes: Trecho[];
    respostaCorretaId: string;
    /** Explicação mostrada após a validação, independente de acerto ou erro */
    explicacao: string;
}

const PLACEHOLDER = '/* selecione um trecho abaixo */';

export class CodigoIncompleto {
    constructor(private props: CodigoIncompletoProps) {}

    get id() { return this.props.id; }
    get arquivo() { return this.props.arquivo; }
    get linguagem() { return this.props.linguagem; }
    get template() { return this.props.template; }
    get opcoes(): Trecho[] { return this.props.opcoes; }
    get explicacao() { return this.props.explicacao; }

    get respostaCorreta(): Trecho | undefined {
        return this.opcoes.find(o => o.id === this.props.respostaCorretaId);
    }

    /** Substitui o marcador {{1}} pelo código do trecho informado (ou por um placeholder) */
    public montarCodigo(trecho?: Trecho): string {
        const preenchimento = trecho?.codigo ?? PLACEHOLDER;
        // usa uma função de substituição para não interpretar "$" no trecho como padrão especial
        return this.template.replace(/\{\{1\}\}/, () => preenchimento);
    }

    public validar(trechoId: string): boolean {
        return this.respostaCorreta?.id === trechoId;
    }
}
