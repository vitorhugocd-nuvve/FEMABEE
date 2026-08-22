/**
 * Setup global do runner de testes (vitest/jsdom). jsdom não implementa a Web Audio API — sem
 * isso, qualquer código que transitivamente importe `SomService` (que usa a lib `zzfx`, cujo
 * módulo cria um `AudioContext` já na importação, não só ao tocar um som) quebra com
 * "AudioContext is not defined" antes mesmo do primeiro teste rodar.
 */
if (typeof globalThis.AudioContext === 'undefined') {
    class AudioContextStub {
        resume(): Promise<void> { return Promise.resolve(); }
        close(): Promise<void> { return Promise.resolve(); }
    }
    // @ts-expect-error stub mínimo só pra suprir a existência do construtor em ambiente de teste
    globalThis.AudioContext = AudioContextStub;
}
