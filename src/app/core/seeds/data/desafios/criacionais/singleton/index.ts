
import { DESAFIO_LICAO_SINGLETON_001 } from "./licao-001";
import { DESAFIO_QUIZ_SINGLETON_001 } from "./quiz-001";
import { DESAFIO_CT_SINGLETON_001 } from "./ct-001";
import { DESAFIO_EB_SINGLETON_001 } from "./eb-001";
import { DESAFIO_EP_SINGLETON_001 } from "./ep-001";
import { DESAFIO_LICAO_SINGLETON_002 } from "./licao-002";
import { DESAFIO_CC_SINGLETON_001 } from "./cc-001";
import { DESAFIO_EB_SINGLETON_002 } from "./eb-002";
import { DESAFIO_LICAO_SINGLETON_003 } from "./licao-003";
import { DESAFIO_QUIZ_SINGLETON_002 } from "./quiz-002";
import { Desafio } from "../../../../../models/desafios/desafio";

/** Todas as fases da Ilha do Singleton, na ordem do arco: Simples -> Multiton -> Escopado. */
export const DESAFIOS_SINGLETON: Desafio[] = [
    DESAFIO_LICAO_SINGLETON_001,
    DESAFIO_QUIZ_SINGLETON_001,
    DESAFIO_CT_SINGLETON_001,
    DESAFIO_EB_SINGLETON_001,
    DESAFIO_EP_SINGLETON_001,
    DESAFIO_LICAO_SINGLETON_002,
    DESAFIO_CC_SINGLETON_001,
    DESAFIO_EB_SINGLETON_002,
    DESAFIO_LICAO_SINGLETON_003,
    DESAFIO_QUIZ_SINGLETON_002,
];
