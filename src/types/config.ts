export interface KeywordColor {
    type: 'keyword';
    value: string;
}

export interface HexColor {
    type: 'hex';
    value: string;
}

export interface RgbColor {
    type: 'rgb';
    r: number;
    g: number;
    b: number;
}

export type Color = KeywordColor | HexColor | RgbColor;

export interface TransformDate extends ColorTransform {
    type: 'date';
    format: string;
}

export interface TransformString extends ColorTransform {
    type: 'string';
}

export type TransformFunction = TransformString | TransformDate;

export interface ColorTransform {
    color: Color;
}

export interface TimeLog extends Transformation, DefaultProperty {
    default?: 'Date.now';
}

export interface MsgLog extends Transformation, DefaultProperty {
}

export interface Transformation {
    transform: TransformFunction;
}

export interface DefaultProperty {
    always?: boolean;
    default?: string;
}

export interface Properties {
    [key: string]: TimeLog | MsgLog
}

export interface Config {
    format: string;
    properties: Properties;
}
