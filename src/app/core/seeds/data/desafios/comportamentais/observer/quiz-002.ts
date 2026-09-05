import { Quiz } from "../../../../../models/desafios/quiz/quiz";
import { Pergunta } from "../../../../../models/desafios/quiz/pergunta";
import { Resposta } from "../../../../../models/desafios/quiz/resposta";
import { Dificuldade } from "../../../../../models/desafios/dificuldade";
import { TipoDesafio } from "../../../../../models/desafios/tipo-desafio";

export const DESAFIO_QUIZ_OBSERVER_002 = new Quiz({
    id: "quiz-observer-002",
    dificuldade: Dificuldade.Dificil,
    padrao: "Observer",
    grupo: "Comportamentais",
    nivel: 3,
    tipo: TipoDesafio.PerguntasRespostas,
    perguntas: [
        new Pergunta({
            id: "p1",
            texto: "O que é o \"lapsed listener problem\"?",
            repostas: [
                new Resposta({ id: "p1r1", texto: "Um assinante que nunca implementou a interface Assinante corretamente." }),
                new Resposta({ id: "p1r2", texto: "Assinantes que nunca se desinscrevem e continuam referenciados pelo Subject, causando vazamento de memória.", correta: true }),
                new Resposta({ id: "p1r3", texto: "Um Carteiro que distribui as edições fora de ordem." }),
                new Resposta({ id: "p1r4", texto: "Uma falha de compilação ao declarar múltiplos assinantes." }),
            ]
        }),
        new Pergunta({
            id: "p2",
            texto: "Qual a diferença entre o modelo Push e o modelo Pull na distribuição do Observer?",
            repostas: [
                new Resposta({ id: "p2r1", texto: "Push é mais lento; Pull é sempre mais rápido." }),
                new Resposta({ id: "p2r2", texto: "No Push o Subject envia os dados prontos na notificação; no Pull o assinante busca de volta só o que precisa.", correta: true }),
                new Resposta({ id: "p2r3", texto: "Push só funciona com um assinante por vez; Pull permite vários." }),
                new Resposta({ id: "p2r4", texto: "Não há diferença prática entre os dois modelos." }),
            ]
        }),
        new Pergunta({
            id: "p3",
            texto: "Por que modificar a lista de assinantes durante a própria distribuição (ex.: desinscrever dentro de receberEdicao()) é arriscado?",
            repostas: [
                new Resposta({ id: "p3r1", texto: "Não é arriscado, é a forma recomendada de desinscrever." }),
                new Resposta({ id: "p3r2", texto: "Pode lançar ConcurrentModificationException ao iterar e modificar a mesma lista simultaneamente.", correta: true }),
                new Resposta({ id: "p3r3", texto: "Só é arriscado em linguagens sem coletor de lixo." }),
                new Resposta({ id: "p3r4", texto: "Isso trava a thread principal indefinidamente." }),
            ]
        }),
        new Pergunta({
            id: "p4",
            texto: "O que um Event Bus / Pub-Sub adiciona em relação ao Observer clássico?",
            repostas: [
                new Resposta({ id: "p4r1", texto: "Um canal central que desacopla totalmente quem publica de quem assina, sem inscrição direta no Subject.", correta: true }),
                new Resposta({ id: "p4r2", texto: "Elimina a necessidade de qualquer interface em comum." }),
                new Resposta({ id: "p4r3", texto: "Garante que só existe um único assinante por evento." }),
                new Resposta({ id: "p4r4", texto: "Torna as notificações síncronas obrigatoriamente." }),
            ]
        }),
    ]
});
