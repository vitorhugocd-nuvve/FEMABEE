import { Npc } from "../../../models/npc/npc";
import { TamanhoAbelha } from "../../../models/aparencia/tamanhos";

export const NpcsSeeds: Npc[] = [
    new Npc({
        id: "mel",
        nome: "Mel",
        tamanho: TamanhoAbelha.AltaGorda
    })
];
