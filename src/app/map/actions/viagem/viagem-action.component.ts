import { Component, computed, inject, input } from "@angular/core";
import { LargeComponent } from "../../../../ui/typography/large.component";
import { BeeDividerComponent } from "../../../../ui/divider/divider.component";
import { DescriptionComponent } from "../../../../ui/typography/description.component";
import { IconComponent } from "../../../../ui/icon/icon.component";
import { ButtonComponent } from "../../../../ui/button/button.component";
import { ScreenService } from "../../../../services/tela/screen.service";
import { AcaoDoMapa } from "../../../core/models/map/acao-do-mapa";
import { TipoAcao } from "../../../core/models/map/tipo-acao";
import { PROFUNDIDADE_TIPO_MAPA } from "../../../core/models/map/tipo-mapa";
import { MapaRepositoryService } from "../../../core/seeds/repositories/mapa-repository.service";
import { LocalizacaoAtualService } from "../../../core/services/localizacao-atual.service";
import { PassagemOnibusService } from "../../../core/progresso/passagem-onibus.service";
import { PassagemAviaoService } from "../../../core/progresso/passagem-aviao.service";
import { OnibusObtidoService } from "../../../core/progresso/onibus-obtido.service";
import { AviaoObtidoService } from "../../../core/progresso/aviao-obtido.service";
import { AbelhaProgressoService } from "../../../core/progresso/abelha-progresso.service";
import { MobileAcaoSelecionadaService } from "../mobile-acao-selecionada.component";

@Component({
    selector: 'app-viagem-action',
    template: `
    @if (mapaDestino(); as destino) {
        <bee-large>{{ destino.nome }}</bee-large>
        <bee-divider direction="horizontal" />
        @if (ehVolta()) {
            <bee-description>Viagem de volta gratuita.</bee-description>
        } @else {
            <bee-description>
                Custa 1 passagem de {{ rotuloTransporte() }}.
                @if (!temSaldo()) {
                    Você não tem passagens suficientes.
                }
            </bee-description>
        }
        <bee-divider direction="horizontal" />
        <footer class="w-full flex flex-row-reverse">
            <button
                bee-button
                [fluid]="screenService.isMobile()"
                [size]="screenService.isMobile() ? 'large' : 'small'"
                [disabled]="!ehVolta() && !temSaldo()"
                (click)="viajar(destino.id)"
            >
                <bee-icon [icon]="acao().tipo === tipoAcao.Aviao ? 'send' : 'map'" />
                {{ ehVolta() ? 'Voltar' : 'Gastar passagem' }}
            </button>
        </footer>
    } @else {
        <bee-description>Destino ainda não disponível.</bee-description>
    }
    `,
    host: {
        class: 'w-full flex flex-col gap-2'
    },
    imports: [LargeComponent, BeeDividerComponent, DescriptionComponent, IconComponent, ButtonComponent]
})
export class ViagemActionComponent {
    private readonly mapaRepositoryService = inject(MapaRepositoryService);
    private readonly localizacaoAtualService = inject(LocalizacaoAtualService);
    private readonly passagemOnibusService = inject(PassagemOnibusService);
    private readonly passagemAviaoService = inject(PassagemAviaoService);
    private readonly onibusObtidoService = inject(OnibusObtidoService);
    private readonly aviaoObtidoService = inject(AviaoObtidoService);
    private readonly abelhaProgressoService = inject(AbelhaProgressoService);
    private readonly mobileAcaoSelecionadaService = inject(MobileAcaoSelecionadaService);

    readonly screenService = inject(ScreenService);
    protected readonly tipoAcao = TipoAcao;

    readonly acao = input.required<AcaoDoMapa>();

    protected readonly mapaAtual = computed(() => this.mapaRepositoryService.findById(this.localizacaoAtualService.mapaAtualId()));
    protected readonly mapaDestino = computed(() => {
        const destinoId = this.acao().mapaDestinoId;
        return destinoId ? this.mapaRepositoryService.findById(destinoId) : undefined;
    });

    /** Viagem "de volta" (destino menos profundo que o mapa atual) é sempre gratuita. */
    protected readonly ehVolta = computed(() => {
        const atual = this.mapaAtual();
        const destino = this.mapaDestino();
        if (!atual || !destino) return false;
        return PROFUNDIDADE_TIPO_MAPA[destino.tipo] < PROFUNDIDADE_TIPO_MAPA[atual.tipo];
    });

    protected readonly rotuloTransporte = computed(() => this.acao().tipo === TipoAcao.Aviao ? 'avião' : 'ônibus');

    private readonly passagemService = computed(() =>
        this.acao().tipo === TipoAcao.Aviao ? this.passagemAviaoService : this.passagemOnibusService
    );

    protected readonly temSaldo = computed(() => this.passagemService().possuiSaldo());

    protected async viajar(destinoId: string): Promise<void> {
        if (!this.ehVolta() && !(await this.passagemService().gastar())) return;

        const acao = this.acao();
        if (acao.tipo === TipoAcao.Aviao) {
            this.aviaoObtidoService.marcarObtido(acao.id);
        } else if (acao.tipo === TipoAcao.Onibus) {
            this.onibusObtidoService.marcarObtido(acao.id);
        }
        this.abelhaProgressoService.desbloquearArea(destinoId);

        this.localizacaoAtualService.irPara(destinoId);
        this.mobileAcaoSelecionadaService.isOpen.set(false);
    }
}
