interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface Color {
    id: string;
    color: RGB;
    opacity: number;
    roomName: string;
}