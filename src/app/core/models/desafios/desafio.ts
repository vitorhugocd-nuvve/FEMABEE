import { Dificuldade } from "./dificuldade";
import { TipoDesafio } from "./tipo-desafio";

export type DesafioProps = {
    id: string;
    dificuldade: Dificuldade;
    nivel: number;
    grupo: string;
    padrao: string;
    tipo: TipoDesafio;
}

export interface Desafio {
    get id(): string;
    get dificuldade(): Dificuldade;
    get nivel(): number;
    get grupo(): string;
    get tipo(): TipoDesafio;
}