type IndicationSeverity = "danger" | "success" | "warning" | "hint" | "default"

export type IndicationProps = {
    ttlInMs?: number; // tempo até sumir. Se não informado, não desaparece automaticamente
    title?: string;
    message: string;
    icon?: string;
    severity: IndicationSeverity;
    toast?: boolean; // faz funcionar como um toast em baixo da tela
    toastPosition?: "top" | "bottom";
}

export class Indication {
    constructor(
        private props: IndicationProps
    ) {}

    get ttlInMs() { return this.props.ttlInMs; }
    get title() { return this.props.title; }
    get message() { return this.props.message; }
    get icon() { return this.props.icon; }
    get severity() { return this.props.severity; }
    get toast() { return this.props.toast; }
    get toastPosition() { return this.props.toastPosition; }
}