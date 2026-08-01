import { ParsedFrame, decompressFrames, parseGIF } from "gifuct-js";
import { TAMANHO_APARENCIA_ABELHA } from "../../app/core/constants/aparencia";

const LARGURA_SPRITESHEET = TAMANHO_APARENCIA_ABELHA * 5;
const ALTURA_SPRITESHEET = TAMANHO_APARENCIA_ABELHA;

export type QuadroGif = {
    imageData: ImageData;
    delay: number;
};

export type GifDecodificado = {
    quadros: QuadroGif[];
    duracaoTotal: number;
};

/** Retorna o quadro que deveria estar visível num instante `tempoMs` do loop de animação. */
export function quadroNoInstante(gif: GifDecodificado, tempoMs: number): QuadroGif {
    const t = tempoMs % gif.duracaoTotal;
    let acumulado = 0;
    for (const quadro of gif.quadros) {
        acumulado += quadro.delay;
        if (t < acumulado) return quadro;
    }
    return gif.quadros[gif.quadros.length - 1];
}

const cache = new Map<string, Promise<GifDecodificado>>();

/** Faz o parse/decode de um GIF (com cache por URL) em quadros ImageData já compostos, prontos pra desenhar. */
export function carregarGif(url: string): Promise<GifDecodificado> {
    let promise = cache.get(url);
    if (!promise) {
        promise = decodificar(url);
        cache.set(url, promise);
    }
    return promise;
}

async function decodificar(url: string): Promise<GifDecodificado> {
    const buffer = await fetch(url).then(resposta => resposta.arrayBuffer());
    const gif = parseGIF(buffer);
    const frames = decompressFrames(gif, true);

    // Canvas de composição: cada quadro do GIF só descreve a região que mudou
    // (patch) + um disposalType dizendo o que fazer com o quadro anterior antes
    // de aplicar o próximo. Aqui reconstituímos cada quadro "completo".
    const canvas = document.createElement('canvas');
    canvas.width = LARGURA_SPRITESHEET;
    canvas.height = ALTURA_SPRITESHEET;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

    const patchCanvas = document.createElement('canvas');
    const patchCtx = patchCanvas.getContext('2d')!;

    const quadros: QuadroGif[] = [];
    let estadoAnterior: ImageData | null = null;
    let ultimoQuadro: ParsedFrame | null = null;

    for (const frame of frames) {
        if (ultimoQuadro) {
            if (ultimoQuadro.disposalType === 2) {
                ctx.clearRect(ultimoQuadro.dims.left, ultimoQuadro.dims.top, ultimoQuadro.dims.width, ultimoQuadro.dims.height);
            } else if (ultimoQuadro.disposalType === 3 && estadoAnterior) {
                ctx.putImageData(estadoAnterior, 0, 0);
            }
        }

        if (frame.disposalType === 3) {
            estadoAnterior = ctx.getImageData(0, 0, LARGURA_SPRITESHEET, ALTURA_SPRITESHEET);
        }

        patchCanvas.width = frame.dims.width;
        patchCanvas.height = frame.dims.height;
        patchCtx.putImageData(new ImageData(new Uint8ClampedArray(frame.patch), frame.dims.width, frame.dims.height), 0, 0);
        ctx.drawImage(patchCanvas, frame.dims.left, frame.dims.top);

        quadros.push({
            imageData: ctx.getImageData(0, 0, LARGURA_SPRITESHEET, ALTURA_SPRITESHEET),
            delay: frame.delay
        });

        ultimoQuadro = frame;
    }

    const duracaoTotal = quadros.reduce((soma, quadro) => soma + quadro.delay, 0);

    return { quadros, duracaoTotal };
}
