import { Aparencia } from "../../../models/aparencia/aparencia";
import { Loja } from "../../../models/aparencia/loja";
import { TipoAparencia } from "../../../models/aparencia/tipo-aparencia";

// ── Suéteres gola alta (Corpo) — ids 1-8, divididos entre as duas lojas de Singleton ──────────
const SUETER_PRETO = new Aparencia({ id: 1, tipo: TipoAparencia.Corpo, urlImagem: "/wardrobe/body/turtleneck/black-turtleneck-sweater.gif", nome: "Suéter Gola Alta Preto", descricao: "Um suéter de gola alta na cor preta.", precoCompra: 120, precoVenda: 60, disponivelVenda: true });
const SUETER_AZUL = new Aparencia({ id: 2, tipo: TipoAparencia.Corpo, urlImagem: "/wardrobe/body/turtleneck/blue-turtleneck-sweater.gif", nome: "Suéter Gola Alta Azul", descricao: "Um suéter de gola alta na cor azul.", precoCompra: 120, precoVenda: 60, disponivelVenda: true });
const SUETER_VERDE = new Aparencia({ id: 3, tipo: TipoAparencia.Corpo, urlImagem: "/wardrobe/body/turtleneck/green-turtleneck-sweater.gif", nome: "Suéter Gola Alta Verde", descricao: "Um suéter de gola alta na cor verde.", precoCompra: 120, precoVenda: 60, disponivelVenda: true });
const SUETER_LARANJA = new Aparencia({ id: 4, tipo: TipoAparencia.Corpo, urlImagem: "/wardrobe/body/turtleneck/orange-turtleneck-sweater.gif", nome: "Suéter Gola Alta Laranja", descricao: "Um suéter de gola alta na cor laranja.", precoCompra: 120, precoVenda: 60, disponivelVenda: true });
const SUETER_ROSA = new Aparencia({ id: 5, tipo: TipoAparencia.Corpo, urlImagem: "/wardrobe/body/turtleneck/pink-turtleneck-sweater.gif", nome: "Suéter Gola Alta Rosa", descricao: "Um suéter de gola alta na cor rosa.", precoCompra: 120, precoVenda: 60, disponivelVenda: true });
const SUETER_ROXO = new Aparencia({ id: 6, tipo: TipoAparencia.Corpo, urlImagem: "/wardrobe/body/turtleneck/purple-turtleneck-sweater.gif", nome: "Suéter Gola Alta Roxo", descricao: "Um suéter de gola alta na cor roxa.", precoCompra: 120, precoVenda: 60, disponivelVenda: true });
const SUETER_VERMELHO = new Aparencia({ id: 7, tipo: TipoAparencia.Corpo, urlImagem: "/wardrobe/body/turtleneck/red-turtleneck-sweater.gif", nome: "Suéter Gola Alta Vermelho", descricao: "Um suéter de gola alta na cor vermelha.", precoCompra: 120, precoVenda: 60, disponivelVenda: true });
const SUETER_BRANCO = new Aparencia({ id: 8, tipo: TipoAparencia.Corpo, urlImagem: "/wardrobe/body/turtleneck/white-turtleneck-sweater.gif", nome: "Suéter Gola Alta Branco", descricao: "Um suéter de gola alta na cor branca.", precoCompra: 120, precoVenda: 60, disponivelVenda: true });

// ── Rostos — ids 9-14 ───────────────────────────────────────────────────────────────────────
const ROSTOS = [1, 2, 3, 4, 5, 6].map(n => new Aparencia({
    id: 8 + n,
    tipo: TipoAparencia.Rosto,
    urlImagem: `/wardrobe/rostos/${n}.gif`,
    nome: `Rosto ${n}`,
    descricao: "Uma expressão para sua abelha.",
    precoCompra: 80,
    precoVenda: 40,
    disponivelVenda: true
}));

// ── Óculos retrô original — id 15 ───────────────────────────────────────────────────────────
const OCULOS_RETRO = new Aparencia({ id: 15, tipo: TipoAparencia.Oculos, urlImagem: "/wardrobe/oculos/4.gif", nome: "Óculos Retrô", descricao: "Um óculos estiloso para sua abelha.", precoCompra: 200, precoVenda: 100, disponivelVenda: true });

// ── Polos (Corpo) — ids 16-19 ───────────────────────────────────────────────────────────────
const POLOS = [
    { id: 16, cor: "Azul", arquivo: "blue-polo.gif" },
    { id: 17, cor: "Cinza", arquivo: "gray-polo.gif" },
    { id: 18, cor: "Verde", arquivo: "green-polo.gif" },
    { id: 19, cor: "Roxo", arquivo: "purple-polo.gif" },
].map(({ id, cor, arquivo }) => new Aparencia({
    id,
    tipo: TipoAparencia.Corpo,
    urlImagem: `/wardrobe/body/polo/${arquivo}`,
    nome: `Polo ${cor}`,
    descricao: "Uma polo confortável pro dia a dia da colmeia.",
    precoCompra: 100,
    precoVenda: 50,
    disponivelVenda: true
}));

// ── Listradas (Corpo) — ids 20-27, divididas entre as duas lojas de Observer ──────────────────
const LISTRADAS = Array.from({ length: 8 }, (_, i) => i + 1).map(n => new Aparencia({
    id: 19 + n,
    tipo: TipoAparencia.Corpo,
    urlImagem: `/wardrobe/body/striped/striped_${n}.gif`,
    nome: `Camisa Listrada ${n}`,
    descricao: "Uma camisa listrada bem estilosa.",
    precoCompra: 110,
    precoVenda: 55,
    disponivelVenda: true
}));

// ── Óculos quadrados (Oculos) — ids 28-32 ───────────────────────────────────────────────────
const OCULOS_QUADRADOS = Array.from({ length: 5 }, (_, i) => i + 1).map(n => new Aparencia({
    id: 27 + n,
    tipo: TipoAparencia.Oculos,
    urlImagem: `/wardrobe/oculos/squared/squared${n}.gif`,
    nome: `Óculos Quadrado ${n}`,
    descricao: "Um óculos de armação quadrada.",
    precoCompra: 180,
    precoVenda: 90,
    disponivelVenda: true
}));

// ── Cabelos (Cabelo) — ids 33-72, um estilo por loja ────────────────────────────────────────
const CABELO_BAGUNCADO = Array.from({ length: 8 }, (_, i) => i + 1).map(n => new Aparencia({
    id: 32 + n,
    tipo: TipoAparencia.Cabelo,
    urlImagem: `/wardrobe/hair/messy/messy${n}.gif`,
    nome: `Cabelo Bagunçado ${n}`,
    descricao: "Um estilo bagunçado, sem muita cerimônia.",
    precoCompra: 90,
    precoVenda: 45,
    disponivelVenda: true
}));

const CABELO_ARREPIADO = Array.from({ length: 8 }, (_, i) => i + 1).map(n => new Aparencia({
    id: 40 + n,
    tipo: TipoAparencia.Cabelo,
    urlImagem: `/wardrobe/hair/raised/raised-${n}.gif`,
    nome: `Cabelo Arrepiado ${n}`,
    descricao: "Arrepiado pra cima, chamando atenção.",
    precoCompra: 90,
    precoVenda: 45,
    disponivelVenda: true
}));

const CABELO_TOPETE = Array.from({ length: 10 }, (_, i) => i + 1).map(n => new Aparencia({
    id: 48 + n,
    tipo: TipoAparencia.Cabelo,
    urlImagem: `/wardrobe/hair/topped/topped-${n}.gif`,
    nome: `Cabelo com Topete ${n}`,
    descricao: "Um topete estiloso, bem cuidado.",
    precoCompra: 90,
    precoVenda: 45,
    disponivelVenda: true
}));

const CABELO_LONGO_VOLUMOSO = Array.from({ length: 8 }, (_, i) => i + 1).map(n => new Aparencia({
    id: 58 + n,
    tipo: TipoAparencia.Cabelo,
    urlImagem: `/wardrobe/hair/long_busty/long_busty${n}.gif`,
    nome: `Cabelo Longo Volumoso ${n}`,
    descricao: "Longo e cheio de volume.",
    precoCompra: 110,
    precoVenda: 55,
    disponivelVenda: true
}));

const CABELO_CACHEADO = [2, 3, 4, 5, 6, 7].map(n => new Aparencia({
    id: 66 + (n - 1),
    tipo: TipoAparencia.Cabelo,
    urlImagem: `/wardrobe/hair/long_curly/curly_${n}.gif`,
    nome: `Cabelo Cacheado ${n - 1}`,
    descricao: "Cacheado e cheio de personalidade.",
    precoCompra: 110,
    precoVenda: 55,
    disponivelVenda: true
}));

export const LojasSeeds = [
    // ── Singleton: 2 lojas bônus, cada uma com metade dos suéteres + um estilo de cabelo ────
    new Loja({
        id: "singleton-loja-classico",
        nome: "Guarda-Roupa Clássico",
        descricao: "Suéteres de gola alta em cores discretas e cabelos bagunçados.",
        aparenciasDisponiveis: [SUETER_PRETO, SUETER_AZUL, SUETER_VERDE, SUETER_LARANJA, ...CABELO_BAGUNCADO],
    }),
    new Loja({
        id: "singleton-loja-vibrante",
        nome: "Guarda-Roupa Vibrante",
        descricao: "Suéteres de gola alta chamativos e cabelos arrepiados.",
        aparenciasDisponiveis: [SUETER_ROSA, SUETER_ROXO, SUETER_VERMELHO, SUETER_BRANCO, ...CABELO_ARREPIADO],
    }),

    // ── Observer: 2 lojas bônus, listras/polos + topetes ────────────────────────────────────
    new Loja({
        id: "observer-loja-listras",
        nome: "Listras & Cia",
        descricao: "Camisas listradas e topetes bem cuidados.",
        aparenciasDisponiveis: [...LISTRADAS.slice(0, 4), ...CABELO_TOPETE.slice(0, 5)],
    }),
    new Loja({
        id: "observer-loja-despojado",
        nome: "Estilo Despojado",
        descricao: "Mais listras, polos casuais e mais topetes.",
        aparenciasDisponiveis: [...LISTRADAS.slice(4, 8), ...POLOS, ...CABELO_TOPETE.slice(5, 10)],
    }),

    // ── Bridge: 2 lojas bônus, rostos/óculos + cabelos longos ───────────────────────────────
    new Loja({
        id: "bridge-loja-rostos",
        nome: "Galeria de Rostos",
        descricao: "Expressões novas e cabelos longos e volumosos.",
        aparenciasDisponiveis: [...ROSTOS, ...CABELO_LONGO_VOLUMOSO],
    }),
    new Loja({
        id: "bridge-loja-oculos",
        nome: "Ótica da Ponte",
        descricao: "Óculos retrô, quadrados e cabelos cacheados.",
        aparenciasDisponiveis: [OCULOS_RETRO, ...OCULOS_QUADRADOS, ...CABELO_CACHEADO],
    }),
];
