export interface RespostaApi<T> {
    sucesso: boolean;
    mensagem: string;
    status: number;
    dados: T;
}
