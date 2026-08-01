import { Component, inject } from "@angular/core";
import { BeeCardComponent } from "../../../ui/card/card.component";
import { ScreenService } from "../../../services/tela/screen.service";
import { TextComponent } from "../../../ui/typography/text.component";
import { DescriptionComponent } from "../../../ui/typography/description.component";
import { AbelhaComponent } from "../../../ui/abelha/abelha.component";
import { Aparencia } from "../../core/models/aparencia/aparencia";
import { TipoAparencia } from "../../core/models/aparencia/tipo-aparencia";
import { TamanhoAbelha } from "../../core/models/aparencia/tamanhos";

/** Mock: roupa da abelha do usuário logado, até existir um serviço real de "abelha atual"/aparência equipada. */
const APARENCIA_MOCK_USUARIO: Aparencia[] = [
    new Aparencia({
        id: 1,
        tipo: TipoAparencia.Corpo,
        urlImagem: "/aparencia/body/black-turtleneck-sweater.gif",
        nome: "Suéter Gola Alta Preto",
        descricao: "Um suéter de gola alta na cor preta.",
        precoCompra: 120,
        precoVenda: 60,
        disponivelVenda: true
    }),
    new Aparencia({
        id: 9,
        tipo: TipoAparencia.Rosto,
        urlImagem: "/aparencia/rostos/1.gif",
        nome: "Rosto 1",
        descricao: "Uma expressão para sua abelha.",
        precoCompra: 80,
        precoVenda: 40,
        disponivelVenda: true
    })
];

@Component({
    selector: 'app-user-menu-trigger',
    template: `
    <bee-card class="w-fit p-0.5! flex flex-row gap-2">
        <div class="flex flex-col justify-center pl-4! max-w-full min-w-0!">
            <bee-text class="truncate">Lívia Delantonia</bee-text>
            <bee-description class="truncate">@delantonialivia</bee-description>
        </div>
        <div class="h-12 w-12 bg-amber-400 inside-border flex items-center justify-center">
            <bee-abelha [tamanho]="tamanhoAbelha.PequenaMagra" [aparencias]="aparenciaMockUsuario" [scale]="1.5" />
        </div>
    </bee-card>
    `,
    imports: [BeeCardComponent, TextComponent, DescriptionComponent, AbelhaComponent]
})
export class UserMenuTriggerComponent {
    readonly screenService = inject(ScreenService);

    protected readonly tamanhoAbelha = TamanhoAbelha;
    protected readonly aparenciaMockUsuario = APARENCIA_MOCK_USUARIO;
}