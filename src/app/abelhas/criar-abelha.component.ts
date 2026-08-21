import { Component, inject, input, model, output, viewChild } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { DialogComponent } from "../../ui/dialog/dialog.component";
import { FieldComponent } from "../../ui/field/field.component";
import { LabelComponent } from "../../ui/label/label.component";
import { InputComponent } from "../../ui/input/input.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { IndicatorComponent } from "../../ui/indicator/indicator.component";
import { Indication } from "../../ui/indicator/indication";
import { AbelhaComponent } from "../../ui/abelha/abelha.component";
import { AuthService } from "../core/auth/auth.service";
import { JogadorService } from "../core/jogador/jogador.service";
import { TamanhoAbelha } from "../core/models/aparencia/tamanhos";
import { TITULO_TAMANHO_ABELHA } from "../core/constants/aparencia";

const TAMANHOS = Object.values(TamanhoAbelha);

@Component({
    selector: 'app-criar-abelha',
    template: `
    <bee-dialog [(open)]="open" title="Nova Abelha">
        <form class="flex flex-col gap-4 p-4" [formGroup]="form" (ngSubmit)="onSubmit()">
            @if (precisaCriarJogador()) {
                <bee-field>
                    <label bee-label for="input-comida-favorita">Sua comida favorita</label>
                    <input type="text" bee-input id="input-comida-favorita" formControlName="comidaFavorita" />
                </bee-field>

                <hr>
            }

            <bee-field>
                <label bee-label for="input-nome-abelha">Nome da abelha</label>
                <input type="text" bee-input id="input-nome-abelha" formControlName="nomeAbelha" />
            </bee-field>

            <div class="grid grid-cols-2 gap-2">
                @for (tamanho of tamanhos; track tamanho) {
                    <button
                        type="button"
                        class="shadow-border border-2 bg-neutral-300 p-1.5 flex flex-col items-center gap-1 cursor-pointer"
                        [class.bg-primary!]="tamanho === form.controls.tamanho.value"
                        (click)="form.controls.tamanho.setValue(tamanho)"
                    >
                        <bee-abelha [tamanho]="tamanho" [scale]="1.3" />
                        <span class="text-xs text-center truncate w-full">{{ tituloTamanho[tamanho] }}</span>
                    </button>
                }
            </div>

            <bee-indicator class="w-full!" #indicator />

            <button fluid bee-button type="submit" [disabled]="form.invalid || jogadorService.solicitando()">
                Criar
            </button>
        </form>
    </bee-dialog>
    `,
    imports: [DialogComponent, ReactiveFormsModule, FieldComponent, LabelComponent, InputComponent, ButtonComponent, IndicatorComponent, AbelhaComponent]
})
export class CriarAbelhaComponent {
    protected readonly jogadorService = inject(JogadorService);
    private readonly authService = inject(AuthService);
    private readonly formBuilder = inject(FormBuilder);

    readonly open = model.required<boolean>();
    readonly precisaCriarJogador = input.required<boolean>();
    readonly criada = output<void>();

    protected readonly tamanhos = TAMANHOS;
    protected readonly tituloTamanho = TITULO_TAMANHO_ABELHA;

    private readonly indicator = viewChild<IndicatorComponent>('indicator');

    protected readonly form = this.formBuilder.nonNullable.group({
        comidaFavorita: [''],
        nomeAbelha: ['', [Validators.required, Validators.maxLength(50)]],
        tamanho: [TamanhoAbelha.AltaGorda, Validators.required],
    });

    protected async onSubmit(): Promise<void> {
        if (this.precisaCriarJogador()) {
            this.form.controls.comidaFavorita.addValidators(Validators.required);
            this.form.controls.comidaFavorita.updateValueAndValidity();
        }

        if (this.form.invalid) return;

        const valores = this.form.getRawValue();

        try {
            if (this.precisaCriarJogador()) {
                // O nome do jogador é o nome de usuário da conta — não faz sentido pedir de novo aqui.
                const nome = this.authService.usuarioLogado()?.nomeDeUsuario ?? '';
                await this.jogadorService.criarJogador({
                    nome,
                    comidaFavorita: valores.comidaFavorita,
                    abelha: { nome: valores.nomeAbelha, tamanho: valores.tamanho },
                });
            } else {
                await this.jogadorService.criarAbelha({
                    nome: valores.nomeAbelha,
                    tamanho: valores.tamanho,
                });
            }

            this.form.reset({ comidaFavorita: '', nomeAbelha: '', tamanho: TamanhoAbelha.AltaGorda });
            this.criada.emit();
        } catch (erro) {
            const mensagem = erro instanceof HttpErrorResponse
                ? (erro.error?.mensagem ?? 'Não foi possível criar a abelha.')
                : 'Não foi possível criar a abelha.';
            this.indicator()?.show(new Indication({ title: 'Ops!', message: mensagem, severity: 'danger', ttlInMs: 4000 }));
        }
    }
}
