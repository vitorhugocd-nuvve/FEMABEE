export type AparenciaObtidaProps = {
    id: number;
    idAparencia: number;
    idAbelha: number;
    dataAquisicao: Date;
}

export class AparenciaObtida {
    constructor(private props: AparenciaObtidaProps) { }

    get id() { return this.props.id; }
    get idAparencia() { return this.props.idAparencia; }
    get idAbelha() { return this.props.idAbelha; }
    get dataAquisicao() { return this.props.dataAquisicao; }
}