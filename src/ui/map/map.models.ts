export interface TileSize {
    width: number;
    height: number;
}

export interface CameraState {
    scale: number;
    offset: { x: number; y: number };
}

export interface NaturalSize {
    width: number;
    height: number;
}

export interface MapActionData {
    /** Identificador opcional (usado como trackBy). */
    id?: string | number;
    /** Posição horizontal em tiles (0 = primeira coluna). */
    x: number;
    /** Posição vertical em tiles (0 = primeira linha). */
    y: number;
    /** Rótulo opcional exibido ao lado/baixo do marcador. */
    label?: string;
    /** Índice do tile no spritesheet (0 = primeiro tile). */
    tileIndex?: number;
    /** Cor do marcador padrão (qualquer valor CSS). */
    color?: string;
    /**
     * Como alinhar a ação em relação à célula do tile.
     * "tile" = canto superior esquerdo do tile (padrão).
     * "center" = centro do tile (padrão).
     */
    anchor?: 'tile' | 'center';
    onClick?: () => void;
    className?: string;
}