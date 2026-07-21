export type RespostaBugProps = {
    id: string;
    texto: string;
    correta?: boolean;
}

export class RespostaBug {
    constructor(private props: RespostaBugProps) {}

    get id() { return this.props.id; }
    get texto() { return this.props.texto; }
    /** Indica se esta é a resposta correta — usada pela validação mock */
    get correta(): boolean { return this.props.correta ?? false; }
}
