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
    selector: 'bee-login',
    template: `
    <bee-card class="w-fit max-w-full">
        <bee-card-header>
            /realizar_login
            <a bee-button size="small" href="/cadastro">
                Cadastrar-se
                <bee-icon icon="external-link" />
            </a>
        </bee-card-header>
        <bee-card-content class="flex items-center justify-center">
            <form class="w-full max-w-full md:max-w-xl flex justify-center flex-col gap-4" [formGroup]="form" (ngSubmit)="onSubmit()">
                <bee-title> Eaí! Bem vindo. </bee-title>

                <bee-field>
                    <label bee-label for="input-email">Email</label>
                    <input type="email" bee-input id="input-email" formControlName="email" />
                </bee-field>

                <bee-field>
                    <label bee-label for="input-senha">Senha</label>
                    <input type="password" bee-input id="input-senha" formControlName="senha" />
                </bee-field>

                <bee-indicator class="w-full!" #indicator />

                <button fluid bee-button type="submit" [disabled]="form.invalid || authService.solicitando()">
                    <bee-icon icon="login-sharp" />
                    Entrar
                </button>

                <hr>

                <div class="w-full flex flex-row items-center justify-center gap-2">
                    <bee-text>Não tem uma conta? </bee-text>
                    <bee-link href="/cadastro" class="text-amber-600!">Cadastre-se</bee-link>
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
export class LoginComponent {
    protected readonly authService = inject(AuthService);
    private readonly somService = inject(SomService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly router = inject(Router);

    private readonly indicator = viewChild<IndicatorComponent>('indicator');

    protected readonly form = this.formBuilder.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        senha: ['', Validators.required],
    });

    protected async onSubmit(): Promise<void> {
        if (this.form.invalid) return;

        const { email, senha } = this.form.getRawValue();

        try {
            await this.authService.login({ email, senha });
            this.somService.sucesso();
            this.router.navigateByUrl('/abelhas');
        } catch (erro) {
            this.somService.erro();
            const mensagem = erro instanceof HttpErrorResponse
                ? (erro.error?.mensagem ?? 'Não foi possível entrar.')
                : 'Não foi possível entrar.';
            this.indicator()?.show(new Indication({ title: 'Ops!', message: mensagem, severity: 'danger', ttlInMs: 3000 }));
        }
    }
}
