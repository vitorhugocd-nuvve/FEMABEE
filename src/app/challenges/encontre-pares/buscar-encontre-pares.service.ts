import { Injectable, signal } from "@angular/core";
import { EncontrePares } from "../../core/models/desafios/encontre-pares/encontre-pares";
import { Dificuldade } from "../../core/models/desafios/dificuldade";
import { Rodada } from "../../core/models/desafios/encontre-pares/rodada";
import { Par } from "../../core/models/desafios/encontre-pares/par";

/** Serviço de busca do EncontrePares — substitua o signal por uma chamada HTTP real */
@Injectable()
export class BuscarEncontreParesService {
    public data = signal<EncontrePares | undefined>(new EncontrePares({
        id: "ep-padroes-001",
        dificuldade: Dificuldade.Facil,
        grupo: "Padrões de Projeto",
        nivel: 1,
        padrao: "GoF",
        rodadas: [
            new Rodada({
                id: "r1",
                pares: [
                    new Par({ id: "r1p1", afirmacao: "Singleton", correspondencia: "Garante uma única instância e um ponto global de acesso." }),
                    new Par({ id: "r1p2", afirmacao: "Factory Method", correspondencia: "Delega a criação de objetos para subclasses." }),
                    new Par({ id: "r1p3", afirmacao: "Builder", correspondencia: "Constrói objetos complexos passo a passo." }),
                    new Par({ id: "r1p4", afirmacao: "Prototype", correspondencia: "Cria novos objetos clonando uma instância existente." }),
                ]
            }),
            new Rodada({
                id: "r2",
                pares: [
                    new Par({ id: "r2p1", afirmacao: "Adapter", correspondencia: "Converte a interface de uma classe na interface esperada pelo cliente." }),
                    new Par({ id: "r2p2", afirmacao: "Decorator", correspondencia: "Adiciona responsabilidades a um objeto dinamicamente." }),
                    new Par({ id: "r2p3", afirmacao: "Facade", correspondencia: "Fornece uma interface simplificada para um subsistema complexo." }),
                    new Par({ id: "r2p4", afirmacao: "Proxy", correspondencia: "Controla o acesso a outro objeto, podendo adicionar lógica extra." }),
                ]
            }),
        ]
    }));
}
