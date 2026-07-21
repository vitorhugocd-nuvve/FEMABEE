import { Component } from "@angular/core";
import { TextComponent } from "../../ui/typography/text.component";
import { LinkComponent } from "../../ui/typography/link.component";
import { IconComponent } from "../../ui/icon/icon.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { LabelComponent } from "../../ui/label/label.component";
import { FieldComponent } from "../../ui/field/field.component";
import { CheckboxDirective } from "../../ui/checkbox/checkbox.component";
import { TitleComponent } from "../../ui/typography/title.component";
import { BeeCardContentComponent, BeeCardHeaderComponent, BeeCardComponent } from "../../ui/card/card.component";
import { InputComponent } from "../../ui/input/input.component";

@Component({
    selector: 'bee-login',
    template: `
    <bee-card class="w-fit">
        <bee-card-header>
            /realizar_login
            <button bee-button size="small">
                Cadastrar-se
                <bee-icon icon="external-link" />
            </button>
        </bee-card-header>
        <bee-card-content class="flex items-center justify-center">
            <form class="w-full max-w-full md:max-w-xl flex justify-center flex-col gap-4">
                <bee-title> Eaí! Bem vindo. </bee-title>
        
                <bee-field>
                    <label bee-label for="input-nome">Nome</label>
                    <input type="text" bee-input id="input-nome" />
                </bee-field>
        
                <bee-field>
                    <label bee-label for="input-senha">Senha</label>
                    <div class="flex flex-row gap-1">
                        <input type="password" bee-input id="input-senha" />
                        <button bee-button>
                            <bee-icon icon="eye" />
                        </button>
                    </div>
                </bee-field>

                <div class="w-full flex flex-row justify-between">
                    <bee-field class="flex items-center flex-row! gap-1">
                        <input type="checkbox" bee-checkbox id="input-lembrar" />
                        <label bee-label for="input-lembrar">Lembrar-me</label>
                    </bee-field>

                    <bee-link href="/">Esqueci a Senha</bee-link>
                </div>
        
                <button fluid bee-button>
                    <bee-icon icon="login-sharp" />
                    Entrar
                </button>

                <hr>

                <div class="w-full flex flex-row items-center justify-center gap-2">
                    <bee-text>Não tem uma conta? </bee-text>
                    <bee-link href="/" class="text-amber-600!">Cadastre-se</bee-link>
                </div>

            </form>

        </bee-card-content>
    </bee-card>

    <img src="/login-image.png" class="w-1/2" alt="">
    `,
    host: { 
        class: 'h-screen w-screen flex flex-row gap-16 items-center justify-center pattern-background' 
    },
    imports: [TextComponent, LinkComponent, IconComponent, ButtonComponent, LabelComponent, FieldComponent, CheckboxDirective, TitleComponent, BeeCardContentComponent, BeeCardHeaderComponent, BeeCardComponent, InputComponent]
})
export class LoginComponent { }