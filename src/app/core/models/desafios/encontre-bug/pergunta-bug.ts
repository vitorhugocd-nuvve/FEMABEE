import { Arquivo } from "./arquivo";
import { RespostaBug } from "./resposta-bug";

export type PerguntaBugProps = {
    id: string;
    /** Ex.: "Esse código implementa corretamente o padrão Singleton?" */
    enunciado: string;
    arquivos: Arquivo[];
    respostas: RespostaBug[];
    /** Explicação mostrada no drawer, independente de acerto ou erro */
    explicacao: string;
}

export class PerguntaBug {
    constructor(private props: PerguntaBugProps) {}

    get id() { return this.props.id; }
    get enunciado() { return this.props.enunciado; }
    get arquivos(): Arquivo[] { return this.props.arquivos; }
    get respostas(): RespostaBug[] { return this.props.respostas; }
    get explicacao() { return this.props.explicacao; }

    /** Retorna a resposta marcada como correta, se existir */
    get respostaCorreta(): RespostaBug | undefined {
        return this.props.respostas.find(r => r.correta);
    }

    public validar(respostaId: string): boolean {
        return this.respostaCorreta?.id === respostaId;
    }
}
