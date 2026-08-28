import { Component, inject, viewChild } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { TextComponent } from "../../ui/typography/text.component";
import { LinkComponent } from "../../ui/typography/link.component";
import { IconComponent } from "../../ui/icon/icon.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { LabelComponent } from "../../ui/label/label.component";
import { FieldComponent } from "../../ui/field/field.component";
import { TitleComponent } from "../../ui/typography/title.component";
import { BeeCardContentComponent, BeeCardHeaderComponent, BeeCardComponent } from "../../ui/card/card.component";
import { InputComponent } from "../../ui/input/input.component";
import { IndicatorComponent } from "../../ui/indicator/indicator.component";
import { Indication } from "../../ui/indicator/indication";
import { AuthService } from "../core/auth/auth.service";
import { SomService } from "../../services/som/som.service";

@Component({
    selector: 'bee-cadastro',
    template: `
    <bee-card class="w-fit max-w-full">
        <bee-card-header>
            /criar_conta
            <a bee-button size="small" href="/login">
                Já tenho conta
                <bee-icon icon="external-link" />
            </a>
        </bee-card-header>
        <bee-card-content class="flex items-center justify-center">
            <form class="w-full max-w-full md:max-w-xl flex justify-center flex-col gap-4" [formGroup]="form" (ngSubmit)="onSubmit()">
                <bee-title> Bem vindo à colmeia! </bee-title>

                <bee-field>
                    <label bee-label for="input-nome-usuario">Nome de usuário</label>
                    <input type="text" bee-input id="input-nome-usuario" formControlName="nomeDeUsuario" />
                </bee-field>

                <bee-field>
                    <label bee-label for="input-email">Email</label>
                    <input type="email" bee-input id="input-email" formControlName="email" />
                </bee-field>

                <bee-field>
                    <label bee-label for="input-senha">Senha</label>
                    <input type="password" bee-input id="input-senha" formControlName="senha" />
                    <bee-text class="text-neutral-500!">Mín. 8 caracteres, com maiúscula, minúscula, número e símbolo.</bee-text>
                </bee-field>

                <bee-indicator class="w-full!" #indicator />

                <button fluid bee-button type="submit" [disabled]="form.invalid || authService.solicitando()">
                    <bee-icon icon="plus" />
                    Cadastrar
                </button>

                <hr>

                <div class="w-full flex flex-row items-center justify-center gap-2">
                    <bee-text>Já tem uma conta? </bee-text>
                    <bee-link href="/login" class="text-amber-600!">Entrar</bee-link>
                </div>
            </form>
        </bee-card-content>
    </bee-card>

    <img src="/login-image.png" class="hidden md:block w-1/2" alt="">
    `,
    host: {
        class: 'min-h-screen w-screen flex flex-col md:flex-row gap-6 md:gap-16 items-center justify-center pattern-background p-4 overflow-y-auto'
    },
    imports: [TextComponent, LinkComponent, IconComponent, ButtonComponent, LabelComponent, FieldComponent, TitleComponent, BeeCardContentComponent, BeeCardHeaderComponent, BeeCardComponent, InputComponent, ReactiveFormsModule, IndicatorComponent]
})
export class CadastroComponent {
    protected readonly authService = inject(AuthService);
    private readonly somService = inject(SomService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly router = inject(Router);

    private readonly indicator = viewChild<IndicatorComponent>('indicator');

    protected readonly form = this.formBuilder.nonNullable.group({
        nomeDeUsuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(8)]],
    });

    protected async onSubmit(): Promise<void> {
        if (this.form.invalid) return;

        const valores = this.form.getRawValue();

        try {
            await this.authService.cadastrar(valores);
            this.somService.sucesso();
            await this.authService.login({ email: valores.email, senha: valores.senha });
            this.router.navigateByUrl('/abelhas');
        } catch (erro) {
            this.somService.erro();
            const mensagem = erro instanceof HttpErrorResponse
                ? (erro.error?.mensagem ?? 'Não foi possível criar sua conta.')
                : 'Não foi possível criar sua conta.';
            this.indicator()?.show(new Indication({ title: 'Ops!', message: mensagem, severity: 'danger', ttlInMs: 3000 }));
        }
    }
}
