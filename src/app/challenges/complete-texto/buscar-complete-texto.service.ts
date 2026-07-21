import { Injectable, signal } from "@angular/core";
import { CompleteTexto } from "../../core/models/desafios/complete-texto/complete-texto";
import { Dificuldade } from "../../core/models/desafios/dificuldade";
import { Texto } from "../../core/models/desafios/complete-texto/texto";

/** Serviço de busca do CompleteTexto — substitua o signal por uma chamada HTTP real */
@Injectable()
export class BuscarCompleteTextoService {
    public data = signal<CompleteTexto | undefined>(new CompleteTexto({
        id: "ct-singleton-001",
        dificuldade: Dificuldade.Medio,
        grupo: "Criacionais",
        nivel: 1,
        padrao: "Singleton",
        textos: [
            new Texto({
                id: "t1",
                texto: "O padrão {{1}} garante que uma classe possua apenas {{2}} instância e fornece um {{3}} de acesso a ela.",
                opcoes: ["ponto global", "uma única", "Singleton", "Factory", "duas", "método privado"],
                respostas: ["Singleton", "uma única", "ponto global"]
            }),
            new Texto({
                id: "t2",
                texto: "Para implementar o Singleton, o {{1}} deve ser privado para impedir que objetos externos criem novas instâncias usando o operador {{2}}.",
                opcoes: ["construtor", "destrutor", "new", "delete", "interface", "método"],
                respostas: ["construtor", "new"]
            }),
            new Texto({
                id: "t3",
                texto: "Em ambientes {{1}}, a criação do Singleton deve ser {{2}} para evitar que múltiplas threads criem instâncias simultâneas, o que quebraria a garantia do padrão.",
                opcoes: ["multithread", "monothread", "sincronizada", "assíncrona", "paralela", "sequencial"],
                respostas: ["multithread", "sincronizada"]
            }),
        ]
    }));
}