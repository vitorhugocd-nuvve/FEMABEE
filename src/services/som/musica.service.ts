import { Injectable, signal } from "@angular/core";
import { ZZFX } from "zzfx";

/**
 * Música ambiente em loop.
 * Pentatônica maior (A) usando pequenos intervalos para criar uma sensação
 * calma e relaxante, sem soar repetitiva.
 */

const NOTA_RAIZ = 220; // A3

const DURACAO_PASSO_MS = 1800;

const MELODIA: Array<number[] | null> = [
    [0, 7],      // A + E
    [0, 7],

    [4, 11],     // C# + G#
    [4, 11],

    [2, 9],      // B + F#
    [2, 9],

    [0, 7],
    [0, 7],

    null,

    [7, 14],     // E + E
    [7, 14],

    [4, 11],
    [4, 11],

    [0, 7],
    [0, 7],

    null
];

const VOLUME_NORMAL = 0.32;
const VOLUME_ABAIXADO = 0.10;

@Injectable({
    providedIn: 'root'
})
export class MusicaService {

    private readonly _mudo = signal(false);
    readonly mudo = this._mudo.asReadonly();

    private intervalId?: ReturnType<typeof setInterval>;
    private passo = 0;

    private volumeAtual = VOLUME_NORMAL;

    /** Começa a tocar em loop. */
    public iniciar(): void {
        if (this.intervalId !== undefined) return;

        this.intervalId = setInterval(
            () => this.tocarPasso(),
            DURACAO_PASSO_MS
        );
    }

    public parar(): void {
        if (this.intervalId !== undefined) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }

    public alternarMudo(): void {
        this._mudo.update(v => !v);
    }

    /** Abaixa o volume durante diálogos, menus etc. */
    public abaixarVolume(): void {
        this.volumeAtual = VOLUME_ABAIXADO;
    }

    public restaurarVolume(): void {
        this.volumeAtual = VOLUME_NORMAL;
    }

    private tocarPasso(): void {

        const acorde = MELODIA[this.passo % MELODIA.length];
        this.passo++;

        if (acorde === null || this._mudo()) return;

        try {

            ZZFX.audioContext.resume();

            for (const semitom of acorde) {

                const frequencia = ZZFX.getNote(semitom, NOTA_RAIZ);

                ZZFX.play(
                    this.volumeAtual * 0.55, // metade do volume por nota
                    0.05,                    // attack
                    frequencia,
                    0,
                    0.16,                    // sustain
                    0.18,                    // release
                    1,
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0.4
                );
            }

        } catch {
            // Ambiente sem suporte a Web Audio.
        }
    }
}