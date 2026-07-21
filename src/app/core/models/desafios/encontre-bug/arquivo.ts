export type ArquivoProps = {
    id: string;
    /** Nome exibido, ex.: "Singleton.java" */
    nome: string;
    /** Id de linguagem do Monaco Editor, ex.: "java", "typescript" */
    linguagem: string;
    codigo: string;
}

export class Arquivo {
    constructor(private props: ArquivoProps) {}

    get id() { return this.props.id; }
    get nome() { return this.props.nome; }
    get linguagem() { return this.props.linguagem; }
    get codigo() { return this.props.codigo; }
}
